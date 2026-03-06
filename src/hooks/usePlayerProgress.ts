import { useEffect, useRef, useState, useCallback } from 'react';
import { PlayerStateType } from '../types';

interface UsePlayerProgressOptions {
  playerState: PlayerStateType | null | undefined;
  /** Server timestamp (ms) when playerState was captured; improves interpolation. Falls back to client time if undefined. */
  serverTime?: number;
}

interface UsePlayerProgressReturn {
  smoothPosition: number;
  isPlaying: boolean;
}

const POSITION_JUMP_THRESHOLD_MS = 2000; // Reset interpolation if server position deviates more than this

/**
 * Hook that provides smooth progress bar animation using client-side interpolation.
 *
 * Instead of relying on WebSocket updates (which come every ~500ms and cause stuttering),
 * this hook:
 * 1. Stores the last known server position and timestamp
 * 2. Uses requestAnimationFrame to interpolate position at 60fps
 * 3. Syncs with server updates when they arrive
 * 4. Automatically pauses interpolation when player is paused
 * 5. Resets on implausible position jumps to avoid timeline jumps
 */
export function usePlayerProgress({ playerState, serverTime }: UsePlayerProgressOptions): UsePlayerProgressReturn {
  const [smoothPosition, setSmoothPosition] = useState(0);

  const lastServerPosition = useRef(0);
  const lastServerTimestamp = useRef(Date.now());
  const animationFrameId = useRef<number | null>(null);
  const isPlayingRef = useRef(false);
  const songLengthRef = useRef(0);

  const isPlaying = playerState?.status === 'playing';

  // Update refs when we receive new server data; guard against implausible jumps
  // Use serverTime when available so interpolation accounts for when the server captured state (assumes clocks roughly in sync)
  useEffect(() => {
    if (playerState) {
      const now = Date.now();
      const serverPosition = playerState.position;
      const t = typeof serverTime === 'number' ? serverTime : now;

      if (isPlayingRef.current && songLengthRef.current > 0) {
        const elapsed = now - lastServerTimestamp.current;
        const predictedPosition = lastServerPosition.current + elapsed;
        const jump = Math.abs(serverPosition - predictedPosition);
        if (jump > POSITION_JUMP_THRESHOLD_MS) {
          lastServerPosition.current = serverPosition;
          lastServerTimestamp.current = t;
          setSmoothPosition(serverPosition);
        } else {
          lastServerPosition.current = serverPosition;
          lastServerTimestamp.current = t;
        }
      } else {
        lastServerPosition.current = serverPosition;
        lastServerTimestamp.current = t;
      }

      songLengthRef.current = playerState.length;
      isPlayingRef.current = playerState.status === 'playing';

      if (playerState.status !== 'playing') {
        setSmoothPosition(playerState.position);
      }
    }
  }, [playerState?.position, playerState?.status, playerState?.length, playerState?.itemId, serverTime]);

  // Animation loop using requestAnimationFrame
  const animate = useCallback(() => {
    if (!isPlayingRef.current) {
      // Not playing, don't interpolate
      animationFrameId.current = requestAnimationFrame(animate);
      return;
    }

    const now = Date.now();
    const elapsed = Math.max(0, now - lastServerTimestamp.current); // guard against clock skew (negative elapsed)
    
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

  // Reset position when song changes (use same timestamp as main effect so we don't overwrite serverTime)
  useEffect(() => {
    if (playerState?.itemId !== undefined) {
      lastServerPosition.current = playerState.position;
      lastServerTimestamp.current = typeof serverTime === 'number' ? serverTime : Date.now();
      setSmoothPosition(playerState.position);
    }
  }, [playerState?.itemId, serverTime]);

  return {
    smoothPosition,
    isPlaying,
  };
}

