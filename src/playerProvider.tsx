import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { PlayerStateType } from './types';
import { getRemotePlayerState } from './actions';

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
  const [counter, setCounter] = useState<number>(1);

  const updatePlayerState = (newPlayerState: PlayerStateType) => {
    setPlayerState(newPlayerState);
    setCounter(newPlayerState.position);
  };

  useEffect(() => {
    const fetchRemotePlayerState = async () => {
      // Replace with your data fetching logic
      const newPlayerState = await getRemotePlayerState();

      if (newPlayerState?.state) {
        updatePlayerState(newPlayerState?.state);
      }
    };

    const intervalId = setInterval(fetchRemotePlayerState, 500);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <PlayerContext.Provider value={{ playerState, updatePlayerState }}>
      {children}
    </PlayerContext.Provider>
  );
};
