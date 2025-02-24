import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BeatLoader from "react-spinners/BeatLoader";
import { FiMusic, FiEdit2, FiTrash2, FiPlay, FiPause } from "react-icons/fi";
import { IPlaylist } from "../../../types";
import { 
  deleteRemotePlaylist, 
  deleteRemoteSongFromPlaylistByIndex, 
  getRemoteAllPlaylists,
  loadPlaylistRemotePlayer,
  renameRemotePlaylist,
  updateRemotePlaylist 
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
      await deleteRemoteSongFromPlaylistByIndex(playlist.playlistName, index);
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
        await updateRemotePlaylist(
          playlist.playlistName,
          newSongs.map(song => song.path)
        );
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
  const color2 = `hsl(${(hash + 180) % 360}, 70%, 50%)`;

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
        <BeatLoader color="#CCA483" size={25} />
      </div>
    );
  }

  if (!playlist) {
    return <div className="text-white p-4">Playlist not found</div>;
  }

  return (
    <div className="h-full flex flex-col">
      {/* Add header with breadcrumbs */}
      <header className="flex flex-col gap-5 border-b border-gray-800/5 dark:border-white/5 px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
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
                name: playlist?.playlistName || "",
                href: `/library/${encodeURIComponent(playlist?.playlistName || "")}`,
                current: true
              }
            ]}
          />
        </div>
      </header>

      {/* Playlist Header Section */}
      <div className="relative p-6 mb-8">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: `linear-gradient(to bottom right, #000000, ${color2})`,
            filter: "blur(100px)",
          }}
        />
        <div className="relative z-10 flex gap-6">
          <div className="w-48 h-48 shadow-2xl group relative">
            <div
              className="w-full h-full rounded-lg"
              style={{
                background: `linear-gradient(to bottom right, #000000, ${color2})`,
              }}
            >
              <FiMusic className="w-full h-full p-12 text-white/50" />
            </div>
            {/* Play button overlay */}
            <button
              onClick={handlePlayPlaylist}
              className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
            >
              <div className={`p-4 rounded-full bg-gold text-black transform transition-transform ${isPlaylistPlaying ? 'scale-95' : 'scale-100 hover:scale-105'}`}>
                {isPlaylistPlaying ? (
                  <FiPause className="w-8 h-8" />
                ) : (
                  <FiPlay className="w-8 h-8" />
                )}
              </div>
            </button>
          </div>
          <div className="flex flex-col justify-end flex-1">
            <div className="text-white/60 font-medium">Playlist</div>
            {isRenaming ? (
              <div className="flex items-center gap-2 mt-2 mb-4">
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="text-3xl font-bold bg-white/10 text-white rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-gold"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleRename();
                    if (e.key === 'Escape') setIsRenaming(false);
                  }}
                />
                <button
                  onClick={handleRename}
                  className="text-white/60 hover:text-white"
                >
                  Save
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4 mt-2 mb-4">
                <h1 className="text-5xl font-bold text-white">
                  {playlist.playlistName}
                </h1>
                <button
                  onClick={() => setIsRenaming(true)}
                  className="text-white/60 hover:text-white"
                >
                  <FiEdit2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="text-white/60 hover:text-red-500"
                >
                  <FiTrash2 className="w-5 h-5" />
                </button>
              </div>
            )}
            <div className="text-white/60">
              {playlist.songs.length} {playlist.songs.length === 1 ? 'song' : 'songs'}
            </div>
          </div>
        </div>
      </div>

      {/* Tracks Section */}
      <div className="flex-1 px-6">
        <div className="grid grid-cols-[50px_50px_1fr_160px_50px] items-center text-white/60 text-sm px-4 py-2 border-b border-white/10">
          <div className="text-center">#</div>
          <div></div> {/* For play button */}
          <div>Title</div>
          <div className="text-center">Rhythm</div>
          <div></div> {/* For delete button */}
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
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
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