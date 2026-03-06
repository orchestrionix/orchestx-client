import React, { createContext, useState, useEffect, ReactNode, useRef, useCallback } from 'react';
import { PlayerStateType } from './types';

interface PlayerContextType {
  playerState: PlayerStateType | null;
  /** Server timestamp (ms) when current playerState was captured; used for interpolation. Undefined if not provided. */
  serverTime: number | undefined;
  isConnected: boolean;
  connectionError: boolean;
}

export const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

interface PlayerProviderProps {
  children: ReactNode;
}

// WebSocket reconnection settings
const WS_RECONNECT_DELAY_INITIAL = 1000; // Start with 1 second
const WS_RECONNECT_DELAY_MAX = 10000;    // Max 10 seconds
const WS_RECONNECT_MULTIPLIER = 1.5;     // Exponential backoff multiplier

export const PlayerProvider: React.FC<PlayerProviderProps> = ({ children }) => {
  const [playerState, setPlayerState] = useState<PlayerStateType | null>(null);
  const [serverTime, setServerTime] = useState<number | undefined>(undefined);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(false);
  
  // Refs to manage WebSocket lifecycle without causing re-renders
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectDelayRef = useRef(WS_RECONNECT_DELAY_INITIAL);
  const isMountedRef = useRef(true);
  const lastMessageTimeRef = useRef<number>(Date.now());

  // Cleanup function for WebSocket
  const cleanupWebSocket = useCallback(() => {
    if (wsRef.current) {
      // Remove all listeners to prevent memory leaks
      wsRef.current.onopen = null;
      wsRef.current.onclose = null;
      wsRef.current.onerror = null;
      wsRef.current.onmessage = null;
      
      if (wsRef.current.readyState === WebSocket.OPEN || 
          wsRef.current.readyState === WebSocket.CONNECTING) {
        wsRef.current.close();
      }
      wsRef.current = null;
    }
  }, []);

  // Schedule reconnection with exponential backoff
  const scheduleReconnect = useCallback(() => {
    if (!isMountedRef.current) return;
    
    // Clear any existing timeout
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }

    const delay = reconnectDelayRef.current;
    console.log(`[WS] Scheduling reconnect in ${delay}ms`);

    reconnectTimeoutRef.current = setTimeout(() => {
      if (isMountedRef.current) {
        // Increase delay for next attempt (exponential backoff)
        reconnectDelayRef.current = Math.min(
          reconnectDelayRef.current * WS_RECONNECT_MULTIPLIER,
          WS_RECONNECT_DELAY_MAX
        );
        connectWebSocket();
      }
    }, delay);
  }, []);

  // Connect to WebSocket
  const connectWebSocket = useCallback(() => {
    if (!isMountedRef.current) return;
    
    // Clean up existing connection
    cleanupWebSocket();

    try {
      const wsUrl = `ws://${window.location.hostname}:4000`;
      console.log(`[WS] Connecting to ${wsUrl}`);
      
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        if (!isMountedRef.current) return;
        
        console.log('[WS] Connected');
        setIsConnected(true);
        setConnectionError(false);
        // Reset reconnect delay on successful connection
        reconnectDelayRef.current = WS_RECONNECT_DELAY_INITIAL;
        lastMessageTimeRef.current = Date.now();
      };

      ws.onmessage = (event) => {
        if (!isMountedRef.current) return;
        
        lastMessageTimeRef.current = Date.now();
        
        try {
          const data = JSON.parse(event.data);
          if (data?.state) {
            setPlayerState(data.state);
            setServerTime(typeof data.serverTime === 'number' ? data.serverTime : undefined);
          }
        } catch (error) {
          console.error('[WS] Failed to parse message:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('[WS] Error:', error);
      };
      ws.onclose = () => {
        if (!isMountedRef.current) return;
        setIsConnected(false);
        wsRef.current = null;
        setConnectionError(true);
        scheduleReconnect();
      };

    } catch (error) {
      console.error('[WS] Failed to create connection:', error);
      setConnectionError(true);
      scheduleReconnect();
    }
  }, [cleanupWebSocket, scheduleReconnect]);

  // Stale connection detection: reconnect in background without showing the modal
  // Modal only shows on real disconnect (onclose) or initial connect failure
  const WS_STALE_TIMEOUT_MS = 15000;
  useEffect(() => {
    const checkStaleConnection = setInterval(() => {
      if (isConnected && Date.now() - lastMessageTimeRef.current > WS_STALE_TIMEOUT_MS) {
        cleanupWebSocket();
        scheduleReconnect();
      }
    }, 2000);

    return () => clearInterval(checkStaleConnection);
  }, [isConnected, cleanupWebSocket, scheduleReconnect]);

  // Initial connection and cleanup
  useEffect(() => {
    isMountedRef.current = true;
    connectWebSocket();

    return () => {
      isMountedRef.current = false;
      
      // Clear reconnect timeout
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
      
      // Cleanup WebSocket
      cleanupWebSocket();
    };
  }, [connectWebSocket, cleanupWebSocket]);

  // Handle page visibility changes
  // Reconnect when tab becomes visible again
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && !isConnected) {
        console.log('[WS] Page visible, attempting reconnect');
        reconnectDelayRef.current = WS_RECONNECT_DELAY_INITIAL;
        connectWebSocket();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isConnected, connectWebSocket]);

  return (
    <PlayerContext.Provider value={{ playerState, serverTime, isConnected, connectionError }}>
      {children}
    </PlayerContext.Provider>
  );
};
