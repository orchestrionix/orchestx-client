import React, { useEffect, useState, useContext } from "react";
import Breadcrumb from "../../components/tailwind/breadcrumbs";
import { PlayerContext } from "../../playerProvider";
import { setViewModeRemotePlayer } from "../../actions";
import {
  ListBulletIcon,
  BookOpenIcon,
  FilmIcon,
  MicrophoneIcon,
  PresentationChartLineIcon,
} from "@heroicons/react/24/outline";

const viewOptions = [
  { id: 1, name: "Playlist", size: "large", icon: ListBulletIcon },
  { id: 4, name: "Book", size: "medium", icon: BookOpenIcon },
  { id: 5, name: "Animation", size: "medium", icon: FilmIcon },
  { id: 3, name: "Karaoke", size: "large", icon: MicrophoneIcon },
  { id: 2, name: "Slide Show", size: "medium", icon: PresentationChartLineIcon },
];

const ViewsPage: React.FC = () => {
  const playerContext = useContext(PlayerContext);
  const [activeView, setActiveView] = useState<number>(1);
  const [isChanging, setIsChanging] = useState<boolean>(false);

  useEffect(() => {
    if (playerContext?.playerState?.viewMode) {
      setActiveView(playerContext.playerState.viewMode);
    }
  }, [playerContext?.playerState]);

  const handleViewChange = async (viewId: number) => {
    try {
      setIsChanging(true);
      await setViewModeRemotePlayer(viewId);
      setActiveView(viewId);
    } catch (error) {
      console.error("Failed to change view mode:", error);
    } finally {
      setIsChanging(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <header className="flex flex-col gap-4 border-b border-white/5 px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl sm:text-4xl font-bold text-white">Views</h1>
            <Breadcrumb 
              home={{ href: "/", name: "home" }} 
              items={[{ name: "views", href: "/views", current: true }]}
            />
          </div>
        </div>
      </header>

      <div className="flex-1 px-4 py-6 sm:px-6 lg:px-8 overflow-auto">
        <div className="mx-auto max-w-7xl">
          {/* Bento Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {viewOptions.map((view) => {
              const isActive = activeView === view.id;
              const isLarge = view.size === "large";
              
              return (
                <div
                  key={view.id}
                  className={`
                    group relative cursor-pointer transition-all duration-300 rounded-xl overflow-hidden
                    ${isLarge ? 'sm:col-span-2 lg:col-span-2' : 'sm:col-span-1 lg:col-span-1'}
                    ${isActive 
                      ? 'border-2 border-gold' 
                      : 'border border-white/10 hover:border-white/20'
                    }
                    ${isChanging && isActive ? 'pointer-events-none' : ''}
                  `}
                  onClick={() => !isChanging && handleViewChange(view.id)}
                >
                  {/* Background Image */}
                  <div className="absolute inset-0">
                    <img
                      src={`/images/views/_${view.id}.png`}
                      className="w-full h-full object-cover"
                      alt={view.name}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                  
                  {/* Heavy Dark Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/98 via-black/97 to-black/98"></div>

                  {/* Card Content */}
                  <div className={`
                    relative z-10 p-6 sm:p-8 flex flex-col
                    ${isLarge ? 'min-h-[200px] sm:min-h-[240px]' : 'min-h-[180px] sm:min-h-[200px]'}
                  `}>
                    {/* Top Section - Icon */}
                    <div className="flex items-start justify-between mb-4">
                      <div className={`
                        transition-transform duration-300
                        ${isActive ? 'scale-105' : 'group-hover:scale-105'}
                      `}>
                        <div className={`
                          bg-black sm:bg-grey-900
                          rounded-lg p-3 sm:p-4 transition-colors
                        `}>
                          {React.createElement(view.icon, {
                            className: `
                              w-12 h-12 sm:w-16 sm:h-16 transition-opacity
                              ${isActive ? 'opacity-100 text-gold' : 'opacity-70 text-white group-hover:opacity-100'}
                            `
                          })}
                        </div>
                      </div>
                      
                      {/* Active Indicator */}
                      {isActive && (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gold/10 rounded-full">
                          <div className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse"></div>
                          <span className="text-gold text-xs font-medium">Active</span>
                        </div>
                      )}
                    </div>

                    {/* Bottom Section - Name */}
                    <div className="mt-auto">
                      <h3 className={`
                        text-lg sm:text-xl font-semibold transition-colors px-3 py-2 rounded-lg bg-black sm:bg-grey-900
                        ${isActive ? 'text-gold' : 'text-white group-hover:text-gold/80'}
                      `}>
                        {view.name}
                      </h3>
                    </div>

                    {/* Loading State */}
                    {isChanging && isActive && (
                      <div className="absolute inset-0 bg-black/80 flex items-center justify-center rounded-xl z-20">
                        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewsPage;

