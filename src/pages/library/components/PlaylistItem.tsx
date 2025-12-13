import { FiDisc } from "react-icons/fi";
import { IPlaylist } from "../../../types";

const PlaylistItem: React.FC<IPlaylist> = ({ index, playlistName, displayName, songs, isPreset }) => {
    const hash = playlistName
      ? playlistName.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
      : Math.random()
          .toString(36)
          .split("")
          .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
    // Define gradient colors based on the hash and preset status
    const color1 = "#000000";
    // Presets get amber/orange tones, regular playlists get varied colors
    const color2 = isPreset 
      ? `hsl(${35 + (index * 8) % 30}, 80%, 45%)` // Amber/orange gradient for presets
      : `hsl(${(hash + 180) % 360}, 70%, 50%)`;
  
    // Generate unique SVG background based on the hash, without changing stop-opacity
    const svgBackground = `data:image/svg+xml;base64,${btoa(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%"><defs><linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="${color1}" /><stop offset="100%" stop-color="${color2}" /></linearGradient></defs><rect width="100%" height="100%" fill="url(#gradient1)"/></svg>`
    )}`;

    // Use displayName for presets, playlistName otherwise
    const nameToShow = displayName || playlistName;
    
    // Border color based on preset status
    const borderColor = isPreset ? "border-amber-500" : "border-gold";
  
    return (
      <>
        <div className={`group relative p-4 rounded-xl bg-black sm:bg-grey-900 ${isPreset ? 'ring-1 ring-amber-500/30' : ''}`}>
          <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg relative">
            {/* Image Background */}
            <img
              src={"../images/album_.jpg"}
              className="absolute inset-0 w-full h-full object-cover"
              alt="Playlist Background"
            />
  
            {/* SVG Gradient Overlay */}
            <div
              className="absolute inset-0 w-full h-full"
              style={{ backgroundImage: `url(${svgBackground})`, opacity: 0.5 }}
            ></div>

            {/* Preset badge */}
            {isPreset && (
              <span className="absolute top-2 right-2 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-amber-500/90 text-black rounded">
                Preset
              </span>
            )}
  
            <span className="absolute pl-4 pt-4">
              <FiDisc className="block" />
            </span>
  
            <span className="absolute pl-9 pt-3">{songs.length}</span>
  
            <div className={`flex flex-col items-start justify-center text-small font-medium uppercase border-b-4 ${borderColor}`}>
              <div className="flex-grow"></div>
              <span className={`border-l-4 ${borderColor} mb-3 pl-2`}>
                {nameToShow}
              </span>
            </div>
          </div>
          
        </div>
      </>
    );
  };

  export default PlaylistItem;