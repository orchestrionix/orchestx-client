import React, { useContext, useEffect, useState, useCallback, useRef } from 'react';
import { PlayerContext } from '../../playerProvider';
import { setVolumeRemotePlayer } from '../../actions';
import debounce from 'lodash/debounce';
import { FiVolume1, FiVolume2, FiVolumeX } from 'react-icons/fi';
import Breadcrumb from '../../components/tailwind/breadcrumbs';

const Volume: React.FC = () => {
  const context = useContext(PlayerContext);
  const [localVolume, setLocalVolume] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const isUserInteractingRef = useRef(false);

  // Convert player volume (0-65535) to percentage (0-100)
  const volumeToPercentage = (vol: number) => Math.round((vol / 65535) * 100);
  
  // Convert percentage (0-100) to player volume (0-65535)
  const percentageToVolume = (percentage: number) => Math.round((percentage / 100) * 65535);

  // Initialize local volume from player state (only when user is not interacting)
  useEffect(() => {
    if (context?.playerState?.volume !== undefined && !isUserInteractingRef.current) {
      const newVolume = volumeToPercentage(context.playerState.volume);
      setLocalVolume(newVolume);
    }
  }, [context?.playerState?.volume]);

  // Apply fader image styles to slider thumbs
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      /* Desktop slider thumb - rotated 90 degrees */
      input[data-fader-image="desktop"]::-webkit-slider-thumb {
        background-image: url('/images/volume/fader.png') !important;
        background-color: transparent !important;
        background-repeat: no-repeat !important;
        background-position: center !important;
        background-size: contain !important;
        transform: rotate(90deg) !important;
        transform-origin: center center !important;
        margin-top: -3px !important;
      }
      input[data-fader-image="desktop"]::-moz-range-thumb {
        background-image: url('/images/volume/fader.png') !important;
        background-color: transparent !important;
        background-repeat: no-repeat !important;
        background-position: center !important;
        background-size: contain !important;
        transform: rotate(90deg) !important;
        transform-origin: center center !important;
        margin-top: -3px !important;
      }
      /* Mobile slider thumb - rotated 270 degrees */
      input[data-fader-image="mobile"]::-webkit-slider-thumb {
        background-image: url('/images/volume/fader.png') !important;
        background-color: transparent !important;
        background-repeat: no-repeat !important;
        background-position: center !important;
        background-size: contain !important;
        transform: rotate(270deg) !important;
        transform-origin: center center !important;
      }
      input[data-fader-image="mobile"]::-moz-range-thumb {
        background-image: url('/images/volume/fader.png') !important;
        background-color: transparent !important;
        background-repeat: no-repeat !important;
        background-position: center !important;
        background-size: contain !important;
        transform: rotate(270deg) !important;
        transform-origin: center center !important;
      }
    `;
    document.head.appendChild(style);
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  // Debounced volume update function
  const debouncedUpdateVolume = useCallback(
    debounce(async (volumeValue: number) => {
      try {
        const actualVolume = percentageToVolume(volumeValue);
        await setVolumeRemotePlayer(actualVolume);
      } catch (error) {
        console.error('Failed to update volume:', error);
      }
    }, 100),
    []
  );

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(event.target.value);
    setLocalVolume(newVolume);
    debouncedUpdateVolume(newVolume);
  };

  const handleDragStart = () => {
    setIsDragging(true);
    isUserInteractingRef.current = true;
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    // Send final value immediately
    debouncedUpdateVolume.flush();
    // Allow state updates after a short delay
    setTimeout(() => {
      isUserInteractingRef.current = false;
    }, 200);
  };

  // Get volume icon based on level
  const getVolumeIcon = () => {
    if (localVolume === 0) return <FiVolumeX className="w-6 h-6 sm:w-8 sm:h-8" />;
    if (localVolume < 50) return <FiVolume1 className="w-6 h-6 sm:w-8 sm:h-8" />;
    return <FiVolume2 className="w-6 h-6 sm:w-8 sm:h-8" />;
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <header className="flex flex-col gap-4 border-b border-white/5 px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl sm:text-4xl font-bold text-white">Volume Control</h1>
            <Breadcrumb 
              home={{ href: "/", name: "home" }} 
              items={[{ name: "Volume", href: "/volume", current: true }]} 
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-3xl flex flex-col items-center">
          {/* Volume Display */}
          <div className="flex items-center justify-center mb-8 sm:mb-12">
            <div className="text-gold transition-colors">
              {getVolumeIcon()}
            </div>
            <span className="ml-3 sm:ml-4 text-3xl sm:text-4xl font-bold text-white">
              {localVolume}%
            </span>
          </div>

          {/* Custom Slider Container */}
          <div className="relative w-full flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            {/* Desktop: Horizontal Slider */}
            <div className="hidden sm:flex flex-col w-full">
              {/* Volume Markers */}
              <div className="flex justify-between mb-2 px-1">
                {[0, 25, 50, 75, 100].map((mark) => (
                  <span key={mark} className="text-xs text-white/40 w-8 text-center">
                    {mark}%
                  </span>
                ))}
              </div>
              
              {/* Slider Track */}
              <div className="relative w-full h-2">
                {/* Background Track */}
                <div className="absolute inset-0 bg-white/10 rounded-full">
                  {/* Filled Track */}
                  <div 
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-gold/80 to-gold rounded-full transition-all duration-150"
                    style={{ width: `${localVolume}%` }}
                  />
                </div>

                {/* Slider Input */}
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={localVolume}
                  onChange={handleVolumeChange}
                  onMouseDown={handleDragStart}
                  onMouseUp={handleDragEnd}
                  onTouchStart={handleDragStart}
                  onTouchEnd={handleDragEnd}
                  className="absolute inset-0 w-full h-2 appearance-none bg-transparent cursor-pointer z-10
                           [&::-webkit-slider-thumb]:appearance-none 
                           [&::-webkit-slider-thumb]:w-7 [&::-webkit-slider-thumb]:h-14 
                           [&::-webkit-slider-thumb]:bg-contain
                           [&::-webkit-slider-thumb]:bg-no-repeat
                           [&::-webkit-slider-thumb]:bg-center
                           [&::-webkit-slider-thumb]:cursor-pointer 
                           [&::-webkit-slider-thumb]:transition-all
                           [&::-webkit-slider-thumb]:hover:scale-105
                           [&::-webkit-slider-thumb]:relative
                           [&::-moz-range-thumb]:w-7 [&::-moz-range-thumb]:h-14
                           [&::-moz-range-thumb]:bg-contain
                           [&::-moz-range-thumb]:bg-no-repeat
                           [&::-moz-range-thumb]:bg-center
                           [&::-moz-range-thumb]:cursor-pointer
                           [&::-webkit-slider-runnable-track]:bg-transparent
                           [&::-moz-range-track]:bg-transparent"
                  style={{
                    WebkitAppearance: 'none',
                    MozAppearance: 'none',
                  }}
                  data-fader-image="desktop"
                />
              </div>
            </div>

            {/* Mobile: Vertical Slider */}
            <div className="flex sm:hidden flex-row items-center gap-3 w-full justify-center">
              {/* Volume Markers */}
              <div className="flex flex-col justify-between h-64">
                {[100, 75, 50, 25, 0].map((mark) => (
                  <span key={mark} className="text-xs text-white/40 w-8 text-right">
                    {mark}%
                  </span>
                ))}
              </div>
              
              {/* Slider Track - Wider container for better touch target */}
              <div className="relative w-16 h-64 flex items-center justify-center -mx-2">
                {/* Background Track */}
                <div className="absolute left-1/2 -translate-x-1/2 w-2 h-full bg-white/10 rounded-full">
                  {/* Filled Track */}
                  <div 
                    className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-gold/80 to-gold rounded-full transition-all duration-150"
                    style={{ height: `${localVolume}%` }}
                  />
                </div>

                {/* Slider Input - Vertical using transform with fader-style thumb */}
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={localVolume}
                  onChange={handleVolumeChange}
                  onMouseDown={handleDragStart}
                  onMouseUp={handleDragEnd}
                  onTouchStart={handleDragStart}
                  onTouchEnd={handleDragEnd}
                  className="absolute appearance-none bg-transparent cursor-pointer z-10
                           [&::-webkit-slider-thumb]:appearance-none 
                           [&::-webkit-slider-thumb]:w-16 [&::-webkit-slider-thumb]:h-24 
                           [&::-webkit-slider-thumb]:bg-contain
                           [&::-webkit-slider-thumb]:bg-no-repeat
                           [&::-webkit-slider-thumb]:bg-center
                           [&::-webkit-slider-thumb]:cursor-pointer 
                           [&::-webkit-slider-thumb]:transition-all
                           [&::-webkit-slider-thumb]:active:scale-110
                           [&::-moz-range-thumb]:w-16 [&::-moz-range-thumb]:h-24
                           [&::-moz-range-thumb]:bg-contain
                           [&::-moz-range-thumb]:bg-no-repeat
                           [&::-moz-range-thumb]:bg-center
                           [&::-moz-range-thumb]:cursor-pointer
                           [&::-webkit-slider-runnable-track]:bg-transparent
                           [&::-webkit-slider-runnable-track]:h-full
                           [&::-moz-range-track]:bg-transparent"
                  data-fader-image="mobile"
                  style={{
                    WebkitAppearance: 'none',
                    MozAppearance: 'none',
                    touchAction: 'pan-y',
                    transform: 'rotate(-90deg)',
                    width: '256px',
                    height: '96px',
                    top: '50%',
                    left: '50%',
                    marginTop: '-48px',
                    marginLeft: '-128px',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Volume Tips */}
          <div className="mt-8 sm:mt-16 text-center text-white/40 text-xs sm:text-sm">
            <p className="hidden sm:block">Drag the slider to adjust volume</p>
            <p className="sm:hidden">Slide up or down to adjust volume</p>
            <p className="hidden sm:block mt-2">Or use your keyboard arrow keys for precise control</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Volume;
