import React, { useContext, useEffect, useState } from "react";
import BeatLoader from "react-spinners/BeatLoader";
import { FiMusic, FiPlay, FiPause, FiX } from "react-icons/fi";
import { PlayerContext } from "../../playerProvider";
import { IActivePlaylistItem } from "../../types";
import { getRemotePlayerActivePlaylist, playItemRemotePlayer, selectItemRemotePlayer } from "../../actions";
import { parsePlaylistString, parseSongDetailsPlaylist } from "../../utils";
import Breadcrumb from "../../components/tailwind/breadcrumbs";

const Home: React.FC = () => {
  const context = useContext(PlayerContext);
  const playerState = context?.playerState;
  const [listLoading, setListLoading] = useState(true);

  const [playlist, setPlaylist] = useState<IActivePlaylistItem[]>([]);
  const [playlistName, setPlaylistName] = useState<string>("");

  useEffect(() => {
    async function fetchData() {
      const playlistData = await getRemotePlayerActivePlaylist();

      if (playlistData.playlist) {
        setPlaylist(parsePlaylistString(playlistData.playlist));
        setPlaylistName(playlistData.playlistName);
      }

      setListLoading(false);
    }

    fetchData();
  }, [playerState?.itemId]);

  const handlePlay = (index: number) => {
    playItemRemotePlayer(index);
  };

  const handleSelect = (index: number) => {
    selectItemRemotePlayer(index);
  };

  // Generate gradient colors for the header
  const hash = "Now Playing"
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const color2 = `hsl(${(hash + 180) % 360}, 70%, 50%)`;

  return (
    <div className="h-full flex flex-col">
      {/* Header Section */}
      <header className="flex flex-col gap-5 border-b border-gray-800/5 dark:border-white/5 px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-4">
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

      {/* Now Playing Header */}
      <div className="bg-black/20 px-6 py-6 border-b border-white/5">
        <div className="flex items-center gap-6">
          <div className="h-20 w-20 bg-white/5 rounded-xl flex items-center justify-center shadow-lg">
            <FiMusic className="w-10 h-10 text-gold/80" />
          </div>
          <div className="flex flex-col gap-1">
            <div className="text-gold/90 font-medium text-sm uppercase tracking-wider">Now Playing</div>
            <div className="text-white text-2xl font-bold">
              {playlistName || "No Playlist Selected"}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="flex-1 px-6 pt-6">
        {listLoading ? (
          <div className="grid place-items-center h-4/5">
            <div className="mx-auto inline">
              <BeatLoader color="#CCA483" size={25} />
            </div>
          </div>
        ) : (
          <div className="w-full">
            {playlist.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-400 mb-4">No tracks in queue</h3>
                <p className="text-sm text-gray-500">Add some music to your queue to get started</p>
              </div>
            ) : (
              <div>
                {/* Table Header */}
                <div className="grid grid-cols-[50px_50px_1fr_160px_50px] items-center text-white/60 text-sm px-4 py-2 border-b border-white/10">
                  <div className="text-center">#</div>
                  <div></div> {/* For play button */}
                  <div>Title</div>
                  <div className="text-center">Rhythm</div>
                  <div></div> {/* For options */}
                </div>

                {/* Table Body */}
                <div className="divide-y divide-white/10">
                  {playlist.map((item, index) => {

                    const isCurrentItem = Number(playerState?.itemId) === item.index;

                    // from the item.name remove any digits and special characters
                    const name = item.name.replace(/[0-9]/g, "").replace(/[^\w\s]/g, "");
                    
                    return (
                      <div
                        key={item.index}
                        className="grid grid-cols-[50px_50px_1fr_160px_50px] items-center px-4 py-3 text-white hover:bg-white/5 transition-colors group cursor-pointer"
                        onClick={() => handleSelect(item.index)}
                        onDoubleClick={() => handlePlay(item.index)}
                      >
                        <div className="text-white/60 text-center">{index + 1}</div>
                        <div className="flex justify-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePlay(item.index);
                            }}
                            className={`${isCurrentItem ? 'text-gold' : 'text-white/60 opacity-0 group-hover:opacity-100'} hover:text-gold transition-all`}
                          >
                            {isCurrentItem ? (
                              <FiPlay className="w-5 h-5" />
                            ) : (
                              <FiPlay className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                        <div className="truncate">{name}</div>
                        <div className="text-center text-white/60">{item.rhythm}</div>
                        <div className="flex justify-center">
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
  );
};

export default Home;
