import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { PlayerStateType } from './types';

interface PlayerContextType {
  playerState: PlayerStateType | null;
  updatePlayerState: (newPlayerState: PlayerStateType) => void;
}

export const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

interface PlayerProviderProps {
  children: ReactNode;
}

export const PlayerProvider: React.FC<PlayerProviderProps> = ({ children }) => {
  const [playerState, setPlayerState] = useState<PlayerStateType | null>(null);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  const updatePlayerState = (newPlayerState: PlayerStateType) => {
    setPlayerState(newPlayerState);
  };

  useEffect(() => {
    // Create WebSocket connection
    const ws = new WebSocket('ws://localhost:4000');

    ws.onopen = () => {
      console.log('WebSocket Connected');
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data?.state) {
        updatePlayerState(data.state);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      // Optional: Implement reconnection logic here
    };

    setSocket(ws);

    // Cleanup on unmount
    return () => {
      ws.close();
    };
  }, []);

  return (
    <PlayerContext.Provider value={{ playerState, updatePlayerState }}>
      {children}
    </PlayerContext.Provider>
  );
};
