import {
    useSortable,
  } from "@dnd-kit/sortable";
import { IPlaylistSong } from "../../../../types";
import { CSS } from "@dnd-kit/utilities";
import { FiAirplay, FiPause, FiPlay, FiX } from "react-icons/fi";
import { getPath, parseSongString } from "../../../../utils";

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

    const parsedSong = parseSongString(song.path);
    const name = parsedSong.name;
    const rhythm = parsedSong.rhythm;
    const imageSrc = getPath(rhythm);
  
    return (
      <div
        ref={setNodeRef}
        style={style}
        className={`grid grid-cols-[auto_auto_auto_1fr_auto] gap-4 px-4 py-3 text-white hover:bg-white/5 rounded-lg transition-colors group ${
          isDragging ? "bg-white/5" : ""
        }`}
      >
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-white/60 hover:text-white"
        >
          <FiAirplay className="w-5 h-5" />
        </div>
        <div className="w-8 text-white/60">{index + 1}</div>
        <button
          onClick={() => onPlay(index)}
          className={`w-8 ${isPlaying ? 'text-gold' : 'text-white/60 opacity-0 group-hover:opacity-100'} hover:text-gold transition-all`}
        >
          {isPlaying ? <FiPause className="w-5 h-5" /> : <FiPlay className="w-5 h-5" />}
        </button>
        <div className="truncate">{parsedSong.name}</div> 
        <button
          onClick={() => onDelete(index)}
          className="w-8 opacity-0 group-hover:opacity-100 text-white/60 hover:text-red-500 transition-opacity"
        >
          <FiX className="w-5 h-5" />
        </button>
      </div>
    );
  };

  export default SortableSongItem;
  