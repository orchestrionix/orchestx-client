import React, { useEffect, useState, useContext } from "react";
import Breadcrumb from "../../components/tailwind/breadcrumbs";
import { PlayerContext } from "../../playerProvider";
import { setViewModeRemotePlayer } from "../../actions";

// There are 5 views
// 1. Playlist view 
// 2. Book view (ponskaart views, like a midi piano roll view)
// 3. Animation view (animations of instruments)
// 4. Karaoke view (lyrics)
// 5. Slide Show

const viewOptions = [
  { id: 1, name: "Playlist View", description: "Standard playlist display" },
  { id: 2, name: "Book View", description: "Ponskaart views, like a midi piano roll view" },
  { id: 3, name: "Animation View", description: "Animations of instruments" },
  { id: 4, name: "Karaoke View", description: "Display lyrics for songs" },
  { id: 5, name: "Slide Show", description: "Display slides for presentations" },
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
      <header className="flex flex-col gap-5 border-b border-gray-800/5 dark:border-white/5 px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-4">
            <h1 className="text-4xl font-bold text-white mb-4">Views</h1>
            <Breadcrumb 
              home={{ href: "/", name: "home" }} 
              items={[{ name: "views", href: "/views", current: true }]}
            />
          </div>
        </div>
      </header>

      <div className="flex-1 px-4 py-8 sm:px-6 lg:px-8 overflow-auto">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-2xl font-semibold text-white mb-8">Select View Mode</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {viewOptions.map((view) => (
              <div 
                key={view.id}
                className={`group relative cursor-pointer transition-all duration-300 ${
                  activeView === view.id 
                    ? 'scale-105 z-10' 
                    : 'hover:scale-102'
                }`}
                onClick={() => !isChanging && handleViewChange(view.id)}
              >
                {/* Fluent UI inspired card */}
                <div className={`rounded-xl overflow-hidden ${
                  activeView === view.id 
                    ? 'shadow-lg shadow-gold/20 ring-1 ring-gold' 
                    : 'shadow-md hover:shadow-lg hover:shadow-grey-700/30'
                }`}>
                  {/* Card content with acrylic effect */}
                  <div className="relative backdrop-blur-sm bg-grey-900/80 border border-grey-700/50">
                    {/* Image */}
                    <div className="aspect-w-16 aspect-h-9">
                      <img
                        src={`/images/views/${view.id}.png`}
                        className="w-full h-full object-cover"
                        alt={view.name}
                        onError={(e) => {
                          e.currentTarget.src = "/images/album_.jpg";
                        }}
                      />
                      
                      {/* Acrylic overlay */}
                      <div className="absolute inset-0 bg-gradient-to-b from-grey-900/40 to-grey-900/80 backdrop-blur-[2px]"></div>
                      
                      {/* View number badge */}
                      <div className="absolute top-3 left-3 bg-black/40 backdrop-blur-md text-gold text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full border border-grey-700/50">
                        {view.id}
                      </div>
                      
                      {/* Loading indicator */}
                      {isChanging && activeView === view.id && (
                        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                          <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      )}
                    </div>
                    
                    {/* Content area */}
                    <div className="p-4 backdrop-blur-md bg-grey-900/70 border-t border-grey-700/30">
                      <h3 className="text-white font-medium text-xsm capitalize">{view.name}</h3>
                      
                      {/* Active indicator */}
                      {activeView === view.id && (
                        <div className="absolute top-3 right-3 flex items-center space-x-1">
                          <div className="w-2 h-2 rounded-full bg-gold animate-pulse"></div>
                          <span className="text-gold text-xs">Active</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewsPage;
