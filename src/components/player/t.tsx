import { Modal } from "./modal";
import { useContext, useEffect, useRef, useState } from "react";
import {
  BackwardOutline,
  ForwardOutline,
  PauseOutline,
  PlayOutline,
  XMarkOutline,
} from "../icons";
import {
  formatTime,
  getPath,
  parseSongString,
  positionTimeLine,
} from "../../utils";
import {
  nextRemotePlayer,
  prevRemotePlayer,
  toggelRemotePlayer,
} from "../../actions";
import { STATUS_PLAYING } from "../../utils/constants";
import { PlayerContext } from "../../playerProvider";

export default function PlayerControle() {
  const context = useContext(PlayerContext);
  const playerState = context?.playerState;
  const [startTime, setStartTime] = useState<number | null>(null);
  const [position, setPosition] = useState(0);
  const requestRef = useRef<number | null>(null);
  const previousTimeRef = useRef<number>(performance.now());

  // Function to start the animation
  const startAnimation = () => {
    if (playerState && playerState.status === 'playing') {
      setStartTime(performance.now() - (playerState.position * 1000));
    } else {
      setStartTime(null);
    }
  };

  // Effect to update the animation start time when the song changes
  useEffect(() => {
    if (playerState) {
      startAnimation();
      setPosition(playerState.position);
    }
  }, [playerState?.title]);

  // Smooth progress bar animation
  const animateProgressBar = (time: number) => {
    if (playerState && playerState.status === 'playing' && startTime !== null) {
      const elapsedTime = (time - startTime) / 1000; // elapsed time in seconds
      setPosition(Math.min(elapsedTime, playerState.length));
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animateProgressBar);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animateProgressBar);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [startTime]);

  const timeLineStyle = {
    width: `${(position / (playerState?.length || 1)) * 100}%`,
  };

  return (
    <div>
      <div className="relative h-1 bg-neutral-600">
        <div
          className="absolute h-full bg-gold flex items-center justify-end"
          style={timeLineStyle}
        >
          <div className="rounded-full w-3 h-3 bg-white shadow z-10"></div>
        </div>
      </div>
    </div>
  );
}
