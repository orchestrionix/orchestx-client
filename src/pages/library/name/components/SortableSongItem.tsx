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
    isPreset?: boolean;
  }
  
  const SortableSongItem: React.FC<SortableSongItemProps> = ({ 
    song, 
    index, 
    onDelete,
    onPlay,
    isPlaying = false,
    isPreset = false
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
        className={`
          grid ${isPreset ? 'grid-cols-[32px_1fr]' : 'grid-cols-[32px_1fr_32px]'} ${isPreset ? 'sm:grid-cols-[40px_40px_1fr_120px]' : 'sm:grid-cols-[40px_40px_1fr_120px_40px]'} ${isPreset ? 'lg:grid-cols-[50px_50px_1fr_160px]' : 'lg:grid-cols-[50px_50px_1fr_160px_50px]'} 
          items-center px-2 sm:px-4 py-2.5 sm:py-3 text-white hover:bg-white/5 transition-colors group cursor-grab active:cursor-grabbing
          ${isDragging ? "bg-white/5" : ""}
          ${isPlaying ? "bg-white/5" : ""}
        `}
      >
        {/* Mobile: Play button only */}
        <div className="sm:hidden flex items-center justify-center" {...listeners}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPlay(index);
            }}
            className={`${isPlaying ? 'text-gold' : 'text-white/60'} hover:text-gold`}
          >
            {isPlaying ? <FiPause className="w-4 h-4" /> : <FiPlay className="w-4 h-4" />}
          </button>
        </div>

        {/* Desktop: Index */}
        <div className="hidden sm:block text-white/60 text-center text-xs sm:text-sm">{index + 1}</div>
        
        {/* Desktop: Play button */}
        <div className="hidden sm:flex justify-center" {...listeners}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPlay(index);
            }}
            className={`${isPlaying ? 'text-gold' : 'text-white/60 opacity-0 group-hover:opacity-100'} hover:text-gold transition-all`}
          >
            {isPlaying ? <FiPause className="w-4 h-4 sm:w-5 sm:h-5" /> : <FiPlay className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>
        </div>
        
        {/* Title - with rhythm on mobile */}
        <div className="min-w-0" {...listeners}>
          <div className="truncate text-sm sm:text-base">{songInfo.name}</div>
          <div className="sm:hidden text-xs text-white/50 truncate">{songInfo.rhythm}</div>
        </div>
        
        {/* Rhythm - hidden on mobile */}
        <div className="hidden sm:block text-center text-white/60 text-xs sm:text-sm truncate" {...listeners}>{songInfo.rhythm}</div>
        
        {/* Delete button */}
        {!isPreset && (
          <div className="flex justify-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(index);
              }}
              className="sm:opacity-0 sm:group-hover:opacity-100 text-white/60 hover:text-red-500 transition-opacity p-1"
            >
              <FiX className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        )}
      </div>
    );
  };

  export default SortableSongItem;
  