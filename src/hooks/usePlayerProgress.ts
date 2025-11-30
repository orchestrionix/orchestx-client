import { useEffect, useRef, useState, useCallback } from 'react';
import { PlayerStateType } from '../types';

interface UsePlayerProgressOptions {
  playerState: PlayerStateType | null | undefined;
}

interface UsePlayerProgressReturn {
  smoothPosition: number;
  isPlaying: boolean;
}

/**
 * Hook that provides smooth progress bar animation using client-side interpolation.
 * 
 * Instead of relying on WebSocket updates (which come every ~500ms and cause stuttering),
 * this hook:
 * 1. Stores the last known server position and timestamp
 * 2. Uses requestAnimationFrame to interpolate position at 60fps
 * 3. Syncs with server updates when they arrive
 * 4. Automatically pauses interpolation when player is paused
 */
export function usePlayerProgress({ playerState }: UsePlayerProgressOptions): UsePlayerProgressReturn {
  // The smoothly animated position (updated at 60fps)
  const [smoothPosition, setSmoothPosition] = useState(0);
  
  // Refs to track server state without causing re-renders
  const lastServerPosition = useRef(0);
  const lastServerTimestamp = useRef(Date.now());
  const animationFrameId = useRef<number | null>(null);
  const isPlayingRef = useRef(false);
  const songLengthRef = useRef(0);

  const isPlaying = playerState?.status === 'playing';

  // Update refs when we receive new server data
  useEffect(() => {
    if (playerState) {
      const now = Date.now();
      
      // Store the server's reported position and when we received it
      lastServerPosition.current = playerState.position;
      lastServerTimestamp.current = now;
      songLengthRef.current = playerState.length;
      isPlayingRef.current = playerState.status === 'playing';

      // If paused or not playing, just set the exact server position
      if (playerState.status !== 'playing') {
        setSmoothPosition(playerState.position);
      }
    }
  }, [playerState?.position, playerState?.status, playerState?.length, playerState?.itemId]);

  // Animation loop using requestAnimationFrame
  const animate = useCallback(() => {
    if (!isPlayingRef.current) {
      // Not playing, don't interpolate
      animationFrameId.current = requestAnimationFrame(animate);
      return;
    }

    const now = Date.now();
    const elapsed = now - lastServerTimestamp.current;
    
    // Calculate interpolated position
    // position = lastServerPosition + time elapsed since last update
    let interpolatedPosition = lastServerPosition.current + elapsed;
    
    // Clamp to song length
    if (songLengthRef.current > 0) {
      interpolatedPosition = Math.min(interpolatedPosition, songLengthRef.current);
    }

    setSmoothPosition(interpolatedPosition);
    
    // Continue the animation loop
    animationFrameId.current = requestAnimationFrame(animate);
  }, []);

  // Start/stop animation loop
  useEffect(() => {
    animationFrameId.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId.current !== null) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [animate]);

  // Reset position when song changes
  useEffect(() => {
    if (playerState?.itemId !== undefined) {
      lastServerPosition.current = playerState.position;
      lastServerTimestamp.current = Date.now();
      setSmoothPosition(playerState.position);
    }
  }, [playerState?.itemId]);

  return {
    smoothPosition,
    isPlaying,
  };
}

