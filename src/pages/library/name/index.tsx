import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BeatLoader from "react-spinners/BeatLoader";
import { FiMusic, FiEdit2, FiTrash2, FiPlay, FiPause } from "react-icons/fi";
import { IPlaylist } from "../../../types";
import {
  deleteRemotePlaylist,
  deleteRemoteSongFromPlaylistByIndex,
  deleteRemoteSongFromPresetPlaylistByIndex,
  getPresetIndexFromName,
  getRemoteAllPlaylists,
  loadPlaylistRemotePlayer,
  renameRemotePlaylist,
  updateRemotePlaylist,
  updateRemotePresetPlaylist
} from "../../../actions";
import { toastError, toastSuccess } from "../../../utils/toasts";
import { MenuModal } from "../../../components/player/menuModal";
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortableSongItem from "./components/SortableSongItem";
import Breadcrumb from "../../../components/tailwind/breadcrumbs";
import { Button } from "../../../components/tailwind/button";
import { Modal } from "../../../components/tailwind/modal";
import { isLite } from "../../../utils/constants";


const PlaylistDetail: React.FC = () => {
  const navigate = useNavigate();
  const { name } = useParams<{ name: string }>();
  const [playlist, setPlaylist] = useState<IPlaylist | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isPlaylistPlaying, setIsPlaylistPlaying] = useState(false);
  const [currentPlayingIndex, setCurrentPlayingIndex] = useState<number | null>(null);

  // Check if this is a preset playlist
  const isPreset = playlist?.isPreset ?? false;
  const presetIndex = name ? getPresetIndexFromName(name) : -1;

  // Configure sensors for both mouse/touch input
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 8,
      },
    })
  );

  useEffect(() => {
    fetchPlaylist();
  }, [name]);

  async function fetchPlaylist() {
    try {
      const playlists = await getRemoteAllPlaylists();
      const found = playlists?.find(p => p.playlistName === name);
      if (found) {
        setPlaylist(found);
        console.log(found);
        setNewName(found.playlistName);
      }
      setLoading(false);
    } catch (error: any) {
      toastError(error.message);
      setLoading(false);
    }
  }

  const handleRename = async () => {
    if (!playlist || !newName.trim() || newName === playlist.playlistName) {
      setIsRenaming(false);
      return;
    }

    try {
      await renameRemotePlaylist(playlist.playlistName, newName);
      toastSuccess("Playlist renamed successfully");
      navigate(`/library/${encodeURIComponent(newName)}`);
      fetchPlaylist();
    } catch (error: any) {
      toastError(error.message);
    }
    setIsRenaming(false);
  };

  const handleDelete = async () => {
    if (!playlist) return;

    try {
      await deleteRemotePlaylist(playlist.playlistName);
      toastSuccess("Playlist deleted successfully");
      navigate("/library");
    } catch (error: any) {
      toastError(error.message);
    }
  };

  const handleDeleteSong = async (index: number) => {
    if (!playlist) return;

    try {
      if (isPreset && presetIndex >= 0) {
        await deleteRemoteSongFromPresetPlaylistByIndex(presetIndex, index);
      } else {
      await deleteRemoteSongFromPlaylistByIndex(playlist.playlistName, index);
      }
      toastSuccess("Song removed from playlist");
      fetchPlaylist();
    } catch (error: any) {
      toastError(error.message);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || !playlist) return;

    if (active.id !== over.id) {
      const oldIndex = playlist.songs.findIndex(
        song => song.index.toString() === active.id
      );
      const newIndex = playlist.songs.findIndex(
        song => song.index.toString() === over.id
      );

      const newSongs = arrayMove(playlist.songs, oldIndex, newIndex);
      const newPlaylist = { ...playlist, songs: newSongs };
      setPlaylist(newPlaylist);

      try {
        // Update the playlist order on the server
        if (isPreset && presetIndex >= 0) {
          await updateRemotePresetPlaylist(
            presetIndex,
            newSongs.map(song => song.path)
          );
        } else {
        await updateRemotePlaylist(
          playlist.playlistName,
          newSongs.map(song => song.path)
        );
        }
      } catch (error: any) {
        toastError(error.message);
        // Revert the change if the server update fails
        fetchPlaylist();
      }
    }
  };

  // Generate gradient colors
  const hash = playlist?.playlistName
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0) ?? 0;
  // Presets get amber/orange tones, regular playlists get varied colors
  const color2 = isPreset 
    ? `hsl(${35 + ((playlist?.index ?? 0) * 8) % 30}, 80%, 45%)`
    : `hsl(${(hash + 180) % 360}, 70%, 50%)`;

  // Placeholder for play functions (you'll implement these)
  const handlePlayPlaylist = async () => {
    if (playlist) {
      await loadPlaylistRemotePlayer(playlist.path, 0);
      navigate("/");
    }
  };

  const handlePlaySong = async (index: number) => {
    if (playlist) {
      await loadPlaylistRemotePlayer(playlist.path, index);
      navigate("/");
    }
  };

  if (loading) {
    return (
      <div className="grid place-items-center h-4/5">
        <div className="mx-auto inline">
          <BeatLoader color="#CCA483" size={25} />
        </div>
      </div>
    );
  }

  if (!playlist) {
    return <div className="text-white p-4">Playlist not found</div>;
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Fixed Header with breadcrumbs */}
      <header className="flex-shrink-0 flex flex-col gap-3 sm:gap-5 border-b border-gray-800/5 dark:border-white/5 px-3 py-3 sm:px-6 sm:py-4 lg:px-8">
        <div className="flex items-center gap-4">
          <Breadcrumb
            home={{ href: "/", name: "home" }}
            items={[
              {
                name: "Library",
                href: "/library",
                current: false
              },
              {
                name: isPreset && presetIndex >= 0 
                  ? `Preset ${presetIndex}`
                  : playlist?.displayName || playlist?.playlistName || "",
                href: `/library/${encodeURIComponent(playlist?.playlistName || "")}`,
                current: true
              }
            ]}
          />
        </div>
      </header>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-auto min-h-0">
        {/* Playlist Header Section */}
        <div className="relative px-3 py-2 sm:p-6 mb-2 sm:mb-8">
          <div
            className="absolute inset-0 opacity-30"
            style={{
              background: `linear-gradient(to bottom right, #000000, ${color2})`,
              filter: "blur(100px)",
            }}
          />
          <div className="relative z-10">
            {/* Mobile: Compact horizontal layout */}
            <div className="sm:hidden flex items-center gap-3">
              {/* Small album art or play button */}
              {isLite ? (
                <button
                  onClick={handlePlayPlaylist}
                  className={`w-12 h-12 rounded-full ${isPreset ? 'bg-gold' : 'bg-gold'} text-black flex items-center justify-center shadow-lg flex-shrink-0 transform transition-transform ${isPlaylistPlaying ? 'scale-95' : 'scale-100 active:scale-95'}`}
                >
                  {isPlaylistPlaying ? (
                    <FiPause className="w-5 h-5" />
                  ) : (
                    <FiPlay className="w-5 h-5" />
                  )}
                </button>
              ) : (
                <div className="w-16 h-16 shadow-lg group relative flex-shrink-0">
                  <div
                    className={`w-full h-full rounded-lg ${isPreset ? 'ring-2 ring-amber-500/50' : ''}`}
                    style={{
                      background: `linear-gradient(to bottom right, #000000, ${color2})`,
                    }}
                  >
                    <FiMusic className="w-full h-full p-3 text-white/50" />
                  </div>
                  {/* Play button overlay */}
                  <button
                    onClick={handlePlayPlaylist}
                    className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-active:opacity-100 transition-opacity rounded-lg"
                  >
                    <div className={`p-1.5 rounded-full ${isPreset ? 'bg-gold' : 'bg-gold'} text-black transform transition-transform ${isPlaylistPlaying ? 'scale-95' : 'scale-100'}`}>
                      {isPlaylistPlaying ? (
                        <FiPause className="w-3 h-3" />
                      ) : (
                        <FiPlay className="w-3 h-3" />
                      )}
                    </div>
                  </button>
                </div>
              )}
              
              {/* Playlist name and actions */}
              <div className="flex-1 min-w-0">
                {isRenaming && !isPreset ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="text-base font-bold bg-white/10 text-white rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-gold w-full"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleRename();
                        if (e.key === 'Escape') setIsRenaming(false);
                      }}
                    />
                    <button
                      onClick={handleRename}
                      className="text-white/60 hover:text-white text-xs"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <h1 className="text-base font-bold text-white truncate">
                        {isPreset && presetIndex >= 0 
                          ? `Preset ${presetIndex}`
                          : playlist.displayName || playlist.playlistName}
                    </h1>
                      {isPreset && (
                        <span className="px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-gold/90 text-black rounded flex-shrink-0">
                          Preset
                        </span>
                      )}
                    </div>
                    {!isPreset && (
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => setIsRenaming(true)}
                        className="text-white/60 hover:text-white p-1"
                      >
                        <FiEdit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="text-white/60 hover:text-red-500 p-1"
                      >
                        <FiTrash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    )}
                  </div>
                )}
                <div className="text-white/60 text-xs mt-0.5">
                  {playlist.songs.length} {playlist.songs.length === 1 ? 'song' : 'songs'}
                </div>
              </div>
            </div>

            {/* Desktop: Original layout */}
            <div className="hidden sm:flex flex-col sm:flex-row gap-4 sm:gap-6">
              {/* Album art or play button */}
              {isLite ? (
                <button
                  onClick={handlePlayPlaylist}
                  className={`w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-gold text-black flex items-center justify-center shadow-2xl flex-shrink-0 mx-auto sm:mx-0 transform transition-transform ${isPlaylistPlaying ? 'scale-95' : 'scale-100 hover:scale-105'}`}
                >
                  {isPlaylistPlaying ? (
                    <FiPause className="w-8 h-8 lg:w-10 lg:h-10" />
                  ) : (
                    <FiPlay className="w-8 h-8 lg:w-10 lg:h-10" />
                  )}
                </button>
              ) : (
                <div className="w-36 sm:w-36 lg:w-48 lg:h-48 shadow-2xl group relative flex-shrink-0 mx-auto sm:mx-0">
                  <div
                    className={`w-full h-full rounded-lg ${isPreset ? 'ring-2 ring-gold/50' : ''}`}
                    style={{
                      background: `linear-gradient(to bottom right, #000000, ${color2})`,
                    }}
                  >
                    <FiMusic className="w-full h-full p-8 lg:p-12 text-white/50" />
                  </div>
                  {/* Play button overlay */}
                  <button
                    onClick={handlePlayPlaylist}
                    className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
                  >
                    <div className={`p-3 lg:p-4 rounded-full ${isPreset ? 'bg-gold' : 'bg-gold'} text-black transform transition-transform ${isPlaylistPlaying ? 'scale-95' : 'scale-100 hover:scale-105'}`}>
                      {isPlaylistPlaying ? (
                        <FiPause className="w-6 h-6 lg:w-8 lg:h-8" />
                      ) : (
                        <FiPlay className="w-6 h-6 lg:w-8 lg:h-8" />
                      )}
                    </div>
                  </button>
                </div>
              )}
              
              {/* Playlist info */}
              <div className="flex flex-col justify-end flex-1 text-center sm:text-left min-w-0">
                <div className="text-white/60 font-medium text-xs sm:text-sm flex items-center gap-2 justify-center sm:justify-start">
                  {isPreset ? 'Preset Playlist' : 'Playlist'}
                  {isPreset && (
                    <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-gold/90 text-black rounded">
                      Preset
                    </span>
                  )}
                </div>
                {isRenaming && !isPreset ? (
                  <div className="flex items-center gap-2 mt-2 mb-2 sm:mb-4 justify-center sm:justify-start">
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="text-base sm:text-2xl lg:text-3xl font-bold bg-white/10 text-white rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-gold w-full sm:w-auto"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleRename();
                        if (e.key === 'Escape') setIsRenaming(false);
                      }}
                    />
                    <button
                      onClick={handleRename}
                      className="text-white/60 hover:text-white text-sm"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 sm:gap-4 mt-2 mb-2 sm:mb-4 justify-center sm:justify-start flex-wrap">
                    <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold text-white truncate max-w-full">
                      {isPreset && presetIndex >= 0 
                        ? `Preset ${presetIndex}`
                        : playlist.displayName || playlist.playlistName}
                    </h1>
                    {!isPreset && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsRenaming(true)}
                        className="text-white/60 hover:text-white p-1"
                      >
                        <FiEdit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="text-white/60 hover:text-red-500 p-1"
                      >
                        <FiTrash2 className="w-5 h-5" />
                      </button>
                    </div>
                    )}
                  </div>
                )}
                <div className="text-white/60 text-xs sm:text-sm">
                  {playlist.songs.length} {playlist.songs.length === 1 ? 'song' : 'songs'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tracks Section */}
        <div className="px-3 sm:px-6">
          {/* Table Header - simplified on mobile */}
          <div className={`hidden sm:grid ${isPreset ? 'grid-cols-[40px_40px_1fr_120px] lg:grid-cols-[50px_50px_1fr_160px]' : 'grid-cols-[40px_40px_1fr_120px] lg:grid-cols-[50px_50px_1fr_160px_50px]'} items-center text-white/60 text-xs sm:text-sm px-2 sm:px-4 py-2 border-b border-white/10`}>
            <div className="text-center">#</div>
            <div></div>
            <div>Title</div>
            <div className="text-center">Rhythm</div>
            {!isPreset && <div className="hidden lg:block"></div>}
          </div>

          <DndContext
            sensors={sensors}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={playlist?.songs.map(song => song.index.toString()) || []}
              strategy={verticalListSortingStrategy}
            >
              <div className="divide-y divide-white/10">
                {playlist?.songs.map((song, index) => (
                  <SortableSongItem
                    key={song.index}
                    song={song}
                    index={index}
                    onDelete={handleDeleteSong}
                    onPlay={handlePlaySong}
                    isPlaying={currentPlayingIndex === index}
                    isPreset={isPreset}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      </div>

      <Modal open={showDeleteConfirm} setOpen={setShowDeleteConfirm}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-md font-medium text-white">Delete Playlist</h3>
          </div>
          <p className="text-sm text-white/60 mb-4">
            Are you sure you want to delete "{playlist.playlistName}"?
          </p>
          <div className="flex justify-end gap-2">
            <Button
              secondary
              onClick={() => setShowDeleteConfirm(false)}
              className="text-xs px-2 py-1"
            >
              Cancel
            </Button>
            <Button
              primary
              onClick={handleDelete}
              className="text-xs px-2 py-1 !bg-red-500 hover:!bg-red-600"
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PlaylistDetail;