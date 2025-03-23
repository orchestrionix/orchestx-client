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
  { id: 4, name: "Book View", description: "Ponskaart views, like a midi piano roll view" },
  { id: 5, name: "Animation View", description: "Animations of instruments" },
  { id: 3, name: "Karaoke View", description: "Display lyrics for songs" },
  { id: 2, name: "Slide Show", description: "Display slides for presentations" },
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
        <div className="mx-auto max-w-[1920px]">
          <h2 className="text-2xl font-semibold text-white mb-8">Select View Mode</h2>
          
          <div className="grid grid-cols-5 gap-6">
            {viewOptions.map((view) => (
              <div 
                key={view.id}
                className={`group relative cursor-pointer transition-all duration-300 rounded-lg
                  ${activeView === view.id 
                    ? 'bg-grey-800 ring-1 ring-gold' 
                    : 'bg-grey-900/50 hover:bg-grey-800/80'
                  }`}
                onClick={() => !isChanging && handleViewChange(view.id)}
              >
                {/* Card Container */}
                <div className="relative aspect-[16/10] p-4 flex flex-col">
                  {/* Icon/Image Container */}
                  <div className="flex-1 flex items-center justify-center mb-4">
                    <div className={`relative w-16 h-16 transition-transform duration-300
                      ${activeView === view.id 
                        ? 'scale-110' 
                        : 'group-hover:scale-110'
                      }`}
                    >
                      <img
                        src={`/images/views/_${view.id}.png`}
                        className={`w-full h-full object-contain transition-opacity duration-300
                          ${activeView === view.id 
                            ? 'opacity-100' 
                            : 'opacity-70 group-hover:opacity-100'
                          }`}
                        alt={view.name}
                        onError={(e) => {
                          e.currentTarget.src = "/images/album_.jpg";
                        }}
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <div className="text-gold text-xs font-medium">
                        View {view.id}
                      </div>
                      {activeView === view.id && (
                        <div className="flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse"></div>
                          <span className="text-gold text-xs">Active</span>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <h3 className="text-white text-sm font-medium mb-1">{view.name}</h3>
                      <p className="text-grey-300 text-xs opacity-60 group-hover:opacity-100 transition-opacity line-clamp-2">
                        {view.description}
                      </p>
                    </div>
                  </div>

                  {/* Loading State */}
                  {isChanging && activeView === view.id && (
                    <div className="absolute inset-0 bg-grey-900/90 backdrop-blur-sm flex items-center justify-center rounded-lg">
                      <div className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
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

