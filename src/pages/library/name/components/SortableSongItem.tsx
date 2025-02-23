import {
    useSortable,
  } from "@dnd-kit/sortable";
import { IPlaylistSong } from "../../../../types";
import { CSS } from "@dnd-kit/utilities";
import { FiMoreHorizontal, FiPause, FiPlay, FiX } from "react-icons/fi";
import { parseSongDetailsPlaylist } from "../../../../utils";

export interface SortableSongItemProps {
    song: IPlaylistSong;
    index: number;
    onDelete: (index: number) => void;
    onPlay: (index: number) => void;
    isPlaying?: boolean;
  }
  
  const SortableSongItem: React.FC<SortableSongItemProps> = ({ 
    song, 
    index, 
    onDelete,
    onPlay,
    isPlaying = false
  }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id: song.index.toString() });
  
    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.5 : 1,
    };

    const songInfo = parseSongDetailsPlaylist(song.name);
  
    return (
      <div
        ref={setNodeRef}
        {...attributes}
        style={style}
        className={`grid grid-cols-[50px_50px_1fr_160px_50px] items-center px-4 py-3 text-white hover:bg-white/5 transition-colors group cursor-grab active:cursor-grabbing ${
          isDragging ? "bg-white/5" : ""
        }`}
      >
        <div className="text-white/60 text-center">{index + 1}</div>
        <div className="flex justify-center" {...listeners}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPlay(index);
            }}
            className={`${isPlaying ? 'text-gold' : 'text-white/60 opacity-0 group-hover:opacity-100'} hover:text-gold transition-all`}
          >
            {isPlaying ? <FiPause className="w-5 h-5" /> : <FiPlay className="w-5 h-5" />}
          </button>
        </div>
        <div className="truncate" {...listeners}>{songInfo.name}</div>
        <div className="text-center text-white/60" {...listeners}>{songInfo.rhythm}</div>
        <div className="flex justify-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(index);
            }}
            className="opacity-0 group-hover:opacity-100 text-white/60 hover:text-red-500 transition-opacity"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  };

  export default SortableSongItem;
  