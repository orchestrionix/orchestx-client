import React, { createContext, ReactNode, useEffect, useState } from "react";
import { PlayerStateType } from "./types";

interface PlayerContextType {
  playerState: PlayerStateType | null;
  updatePlayerState: (newPlayerState: PlayerStateType) => void;
}

export const PlayerContext = createContext<PlayerContextType | undefined>(
  undefined
);

interface PlayerProviderProps {
  children: ReactNode;
}

export const PlayerProvider: React.FC<PlayerProviderProps> = ({ children }) => {
  const [playerState, setPlayerState] = useState<PlayerStateType | null>(null);
  const [counter, setCounter] = useState<number>(1);

  useEffect(() => {
    const handleLoad = () => {
      setTimeout(() => {
        window.scrollTo(0, 1);
      }, 0);
    };

    window.addEventListener("load", handleLoad);
    return () => window.removeEventListener("load", handleLoad);
  }, []);

  const updatePlayerState = (newPlayerState: PlayerStateType) => {
    setPlayerState(newPlayerState);
    setCounter(newPlayerState.position);
  };

  // useEffect(() => {
  //   const fetchRemotePlayerState = async () => {
  //     // Replace with your data fetching logic
  //     const newPlayerState: any = {
  //       state: {
  //         status: "playing",
  //         title: "Demo song",
  //         itemId: 1,
  //         length: 23000,
  //         position: 2300,
  //         volume: 50,
  //       },
  //     };

  //     if (newPlayerState?.state) {
  //       updatePlayerState(newPlayerState?.state);
  //     }
  //   };

  //   const intervalId = setInterval(fetchRemotePlayerState, 5000000000);

  //   return () => clearInterval(intervalId);
  // }, []);

  return (
    <PlayerContext.Provider value={{ playerState, updatePlayerState }}>
      {children}
    </PlayerContext.Provider>
  );
};
