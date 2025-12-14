import { FiDisc } from "react-icons/fi";
import { IPlaylist } from "../../../types";

const PresetItem: React.FC<IPlaylist> = ({ index, playlistName, songs }) => {
  const hash = playlistName
    ? playlistName.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
    : Math.random()
        .toString(36)
        .split("")
        .reduce((acc, char) => acc + char.charCodeAt(0), 0);

  // Define gradient colors based on the hash (same as regular playlists)
  const color1 = "#000000";
  const color2 = `hsl(${(hash + 180) % 360}, 70%, 50%)`;

  // Generate unique SVG background based on the hash, without changing stop-opacity
  const svgBackground = `data:image/svg+xml;base64,${btoa(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%"><defs><linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="${color1}" /><stop offset="100%" stop-color="${color1}" /></linearGradient></defs><rect width="100%" height="100%" fill="url(#gradient1)"/></svg>`
  )}`;

  // Title is always just the number (1-based)
  const title = (index + 1).toString();
  
  // Border color (gold, same as regular playlists)
  const borderColor = "border-gold";

  return (
    <>
      <div className="group relative p-4 sm:p-1 xl:p-2 rounded-xl bg-black sm:bg-grey-900 hover:bg-grey-700">
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
            style={{ backgroundImage: `url(${svgBackground})`, opacity: 0.7 }}
          ></div>

          

          <div className={`flex flex-col items-center justify-center text-7xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold uppercase text-grey-300 hover:text-grey-100`}>
            <span>
              {title}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default PresetItem;

