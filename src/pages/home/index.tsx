import React, { useContext, useEffect, useState } from "react";
import BeatLoader from "react-spinners/BeatLoader";
import { FiMusic, FiPlay, FiPause, FiX } from "react-icons/fi";
import { PlayerContext } from "../../playerProvider";
import { IActivePlaylistItem } from "../../types";
import { getRemotePlayerActivePlaylist, playItemRemotePlayer, selectItemRemotePlayer } from "../../actions";
import { extractFileNameWithoutExtension, buildOrderedPlaylistItems } from "../../utils";
import Breadcrumb from "../../components/tailwind/breadcrumbs";
import { toastError } from "../../utils/toasts";

const Home: React.FC = () => {
  const context = useContext(PlayerContext);
  const playerState = context?.playerState;
  const [listLoading, setListLoading] = useState(true);

  const [playlist, setPlaylist] = useState<IActivePlaylistItem[]>([]);
  const [playlistName, setPlaylistName] = useState<string>("");

  useEffect(() => {
    async function fetchData() {
      try {
        const playlistData = await getRemotePlayerActivePlaylist();
        if (!playlistData.playlist?.length) {
          setPlaylist([]);
          setListLoading(false);
          return;
        }
        const playlist = buildOrderedPlaylistItems(playlistData.playlist, playlistData.order);
        const file = playlistData.file;
        setPlaylist(playlist);
        setPlaylistName(extractFileNameWithoutExtension(file));
      } catch (error: any) {
        toastError(error?.message ? error?.message : "Failed to fetch playlist data");
      } finally {
        setListLoading(false);
      }
    }

    fetchData();
  }, [playerState?.itemId]);  

  const handlePlay = (playlistIndex: number) => {
    playItemRemotePlayer(playlistIndex);
  };

  const handleSelect = (playlistIndex: number) => {
    selectItemRemotePlayer(playlistIndex);
  };

  // Generate gradient colors for the header
  const hash = "Now Playing"
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const color2 = `hsl(${(hash + 180) % 360}, 70%, 50%)`;

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Fixed Header Section */}
      <header className="flex-shrink-0 flex flex-col gap-3 sm:gap-5 border-b border-gray-800/5 dark:border-white/5 px-3 py-3 sm:px-6 sm:py-4 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-2 sm:gap-4">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">Home</h1>
            <Breadcrumb 
              home={{ href: "/", name: "home" }} 
              items={[
                {
                  name: "Home",
                  href: "/",
                  current: true
                }
              ]} 
            />
          </div>
        </div>
      </header>

      {/* Now Playing Header - Fixed */}
      <div className="flex-shrink-0 bg-black/20 px-3 sm:px-6 py-3 sm:py-4 border-b border-white/5">
        <div className="flex items-center gap-3 sm:gap-6">
          <div className="h-12 w-12 sm:h-16 sm:w-16 lg:h-20 lg:w-20 bg-white/5 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
            <FiMusic className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-gold/80" />
          </div>
          <div className="flex flex-col gap-0.5 min-w-0">
            <div className="text-gold/90 font-medium text-xs sm:text-sm uppercase tracking-wider">Now Playing</div>
            <div className="text-white text-base sm:text-lg lg:text-xl font-bold truncate">
              {playlistName || "No Playlist Selected"}
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Content Section */}
      <div className="flex-1 overflow-auto min-h-0">
        <div className="px-3 sm:px-6 py-3 sm:py-6">
          {listLoading ? (
            <div className="grid place-items-center h-40">
              <BeatLoader color="#CCA483" size={20} />
            </div>
          ) : (
            <div className="w-full">
              {playlist.length === 0 ? (
                <div className="text-center py-8 sm:py-12">
                  <h3 className="text-base sm:text-lg font-medium text-gray-400 mb-2 sm:mb-4">No tracks in queue</h3>
                  <p className="text-xs sm:text-sm text-gray-500">Add some music to your queue to get started</p>
                </div>
              ) : (
                <div>
                  {/* Table Header - Hidden on mobile, show simplified version */}
                  <div className="hidden sm:grid grid-cols-[40px_40px_1fr_120px] lg:grid-cols-[50px_50px_1fr_160px_50px] items-center text-white/60 text-xs sm:text-sm px-2 sm:px-4 py-2 border-b border-white/10">
                    <div className="text-center">#</div>
                    <div></div>
                    <div>Title</div>
                    <div className="text-center">Rhythm</div>
                    <div className="hidden lg:block"></div>
                  </div>

                  {/* Table Body */}
                  <div className="divide-y divide-white/10">
                    {playlist.map((item, index) => {
                      const isCurrentItem = Number(playerState?.itemId) === index;
                      const name = item.name.replace(/[0-9]/g, "").replace(/[^\w\s]/g, "");
                      
                      return (
                        <div
                          key={`${item.playlistIndex}-${index}`}
                          className={`
                            grid grid-cols-[32px_1fr_auto] sm:grid-cols-[40px_40px_1fr_120px] lg:grid-cols-[50px_50px_1fr_160px_50px] 
                            items-center px-2 sm:px-4 py-4 sm:py-3 text-white hover:bg-white/5 transition-colors group cursor-pointer
                            ${isCurrentItem ? 'bg-white/5' : ''}
                          `}
                          onClick={() => handleSelect(index)}
                          onDoubleClick={() => handlePlay(index)}
                        >
                          {/* Mobile: Index with play button */}
                          <div className="sm:hidden flex items-center justify-center">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePlay(index);
                              }}
                              className={`${isCurrentItem ? 'text-gold' : 'text-white/60'} hover:text-gold bg-grey-900 md:bg-black`}
                            >
                              <FiPlay className="w-6 h-6 text-gold bg-grey-900 hover:bg-grey-900/50 md:bg-black" />
                            </button>
                          </div>
                          
                          {/* Desktop: Index */}
                          <div className="hidden sm:block text-white/60 text-center text-xs sm:text-sm">{index + 1}</div>
                          
                          {/* Desktop: Play button */}
                          <div className="hidden sm:flex justify-center">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePlay(index);
                              }}
                              className={`${isCurrentItem ? 'text-gold' : 'text-white/60 opacity-0 group-hover:opacity-100'} hover:text-gold transition-all bg-black`}
                            >
                              <FiPlay className="w-4 h-4 sm:w-5 sm:h-5 text-gold bg-black" />
                            </button>
                          </div>
                          
                          {/* Title - with rhythm on mobile */}
                          <div className="min-w-0">
                            <div className="truncate text-sm sm:text-base">{name}</div>
                            <div className="sm:hidden text-xs text-white/50 truncate">{item.rhythm}</div>
                          </div>
                          
                          {/* Rhythm - hidden on mobile */}
                          <div className="hidden sm:block text-center text-white/60 text-xs sm:text-sm truncate">{item.rhythm}</div>
                          
                          {/* Options spacer - hidden on mobile and tablet */}
                          <div className="hidden lg:flex justify-center">
                            <div className="opacity-0 group-hover:opacity-100 text-white/60 transition-opacity w-5 h-5" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
