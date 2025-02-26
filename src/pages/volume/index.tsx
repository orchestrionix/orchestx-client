import React, { useContext, useEffect, useState, useCallback } from 'react';
import { PlayerContext } from '../../playerProvider';
import { updateVolume } from '../../actions';
import debounce from 'lodash/debounce';
import { FiVolume1, FiVolume2, FiVolumeX } from 'react-icons/fi';
import Breadcrumb from '../../components/tailwind/breadcrumbs';

const Volume: React.FC = () => {
  const context = useContext(PlayerContext);
  const [localVolume, setLocalVolume] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Convert player volume (0-65535) to percentage (0-100)
  const volumeToPercentage = (vol: number) => Math.round((vol / 65535) * 100);
  
  // Convert percentage (0-100) to player volume (0-65535)
  const percentageToVolume = (percentage: number) => Math.round((percentage / 100) * 65535);

  // Update local volume when player state changes (only if not dragging)
  useEffect(() => {
    if (!isDragging && context?.playerState?.volume !== undefined) {
      setLocalVolume(volumeToPercentage(context.playerState.volume));
    }
  }, [context?.playerState?.volume, isDragging]);

  // Debounced volume update function
  const debouncedUpdateVolume = useCallback(
    debounce((value: number) => {
      updateVolume(percentageToVolume(value));
    }, 100),
    []
  );

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(event.target.value);
    setLocalVolume(newVolume);
    debouncedUpdateVolume(newVolume);
  };

  // Get volume icon based on level
  const getVolumeIcon = () => {
    if (localVolume === 0) return <FiVolumeX className="w-8 h-8" />;
    if (localVolume < 50) return <FiVolume1 className="w-8 h-8" />;
    return <FiVolume2 className="w-8 h-8" />;
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <header className="flex flex-col gap-5 border-b border-gray-800/5 dark:border-white/5 px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-4">
            <h1 className="text-4xl font-bold text-white mb-4">Volume Control</h1>
            <Breadcrumb 
              home={{ href: "/", name: "home" }} 
              items={[{ name: "Volume", href: "/volume", current: true }]} 
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-3xl flex flex-col items-center">
          {/* Volume Display */}
          <div className="flex items-center justify-center mb-12">
            <div className="text-gold transition-colors">
              {getVolumeIcon()}
            </div>
            <span className="ml-4 text-4xl font-bold text-white">
              {localVolume}%
            </span>
          </div>

          {/* Custom Slider Container */}
          <div className="relative flex md:w-full md:h-4 h-[400px] w-20">
            {/* Volume Markers - Left side on mobile, bottom on desktop */}
            <div className="absolute md:w-full w-8 md:flex-row flex-col flex justify-between 
                          md:bottom-[-2rem] md:left-0 left-[-2rem] top-0
                          h-full md:h-auto">
              {[0, 25, 50, 75, 100].map((mark) => (
                <div 
                  key={mark}
                  className="flex md:flex-col flex-row items-center justify-end h-0"
                >
                  <span className="md:mt-2 mr-2 md:mr-0 text-xs text-white/40 w-8 text-right md:text-center">
                    {mark}%
                  </span>
                </div>
              ))}
            </div>

            {/* Slider Track */}
            <div className="relative md:w-full w-2 h-full md:h-2 mx-auto">
              {/* Background Track */}
              <div className="absolute inset-0 bg-white/10 rounded-full overflow-hidden">
                {/* Filled Track */}
                <div 
                  className="md:w-[calc(100%+12px)] md:h-full w-full h-[calc(100%+12px)]
                           bg-gradient-to-t md:bg-gradient-to-r from-gold/80 to-gold 
                           transition-all absolute 
                           md:-left-[6px] md:top-0
                           bottom-[-6px] left-0"
                  style={{ 
                    height: !isDragging ? `${localVolume}%` : `calc(${localVolume}% + 12px)`,
                    width: !isDragging ? `${localVolume}%` : undefined,
                  }}
                />
              </div>

              {/* Slider Input */}
              <input
                type="range"
                min="0"
                max="100"
                value={localVolume}
                onChange={handleVolumeChange}
                onMouseDown={() => setIsDragging(true)}
                onMouseUp={() => setIsDragging(false)}
                onTouchStart={() => setIsDragging(true)}
                onTouchEnd={() => setIsDragging(false)}
                className="absolute md:w-full w-2 md:h-2 h-full 
                         appearance-none bg-transparent cursor-pointer
                         md:rotate-0 
                         [writing-mode:tb-rl] md:[writing-mode:lr-tb]
                         [&::-webkit-slider-runnable-track]:w-2 md:[&::-webkit-slider-runnable-track]:w-full
                         [&::-webkit-slider-runnable-track]:h-full md:[&::-webkit-slider-runnable-track]:h-2
                         [&::-webkit-slider-runnable-track]:bg-transparent
                         [&::-webkit-slider-runnable-track]:rounded-full
                         [&::-moz-range-track]:w-2 md:[&::-moz-range-track]:w-full
                         [&::-moz-range-track]:h-full md:[&::-moz-range-track]:h-2
                         [&::-moz-range-track]:bg-transparent
                         [&::-moz-range-track]:rounded-full
                         [&::-webkit-slider-thumb]:appearance-none 
                         [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 
                         [&::-webkit-slider-thumb]:rounded-full 
                         [&::-webkit-slider-thumb]:bg-gold 
                         [&::-webkit-slider-thumb]:shadow-lg 
                         [&::-webkit-slider-thumb]:shadow-black/20
                         [&::-webkit-slider-thumb]:border-2 
                         [&::-webkit-slider-thumb]:border-white/20
                         [&::-webkit-slider-thumb]:cursor-pointer 
                         [&::-webkit-slider-thumb]:transition-all
                         [&::-webkit-slider-thumb]:hover:scale-110 
                         [&::-webkit-slider-thumb]:relative 
                         [&::-webkit-slider-thumb]:z-10
                         [&::-webkit-slider-thumb]:translate-x-[7px] md:[&::-webkit-slider-thumb]:translate-x-[-8px]
                         [&::-webkit-slider-thumb]:translate-y-[0px] md:[&::-webkit-slider-thumb]:translate-y-[-8px]"
                style={{
                  WebkitAppearance: 'none',
                  MozAppearance: 'none',
                }}
              />
            </div>
          </div>

          {/* Volume Tips */}
          <div className="mt-16 text-center text-white/40 text-sm">
            <p className="md:block hidden">Drag the slider to adjust volume</p>
            <p className="md:hidden">Slide up or down to adjust volume</p>
            <p className="md:block hidden">Or use your keyboard arrow keys for precise control</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Volume;
