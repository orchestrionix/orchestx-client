import React from 'react';
import { useEffect, useState } from "react";
import BeatLoader from "react-spinners/BeatLoader";
import { FiDisc } from "react-icons/fi";
import { IPlaylist, IPlaylistSong } from '../types';

interface PlaylistItemProps {
  index: number;
  playlistName: string;
  songs: IPlaylistSong[];
}

const PlaylistItem: React.FC<PlaylistItemProps> = ({
  index,
  playlistName,
  songs,
  // Assuming you have a prop for the background image URL
}) => {
  // Generate a hash value based on the playlistName
  const hash = playlistName ? playlistName
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0) : Math.random().toString(36).split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);

  // Define gradient colors based on the hash
  const color1 = "#000000";
  const color2 = `hsl(${(hash + 180) % 360}, 70%, 50%)`;

  // Generate unique SVG background based on the hash, without changing stop-opacity
  const svgBackground = `data:image/svg+xml;base64,${btoa(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%"><defs><linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="${color1}" /><stop offset="100%" stop-color="${color2}" /></linearGradient></defs><rect width="100%" height="100%" fill="url(#gradient1)"/></svg>`
  )}`;

  return (
    <div key={index} className="p-2 w-1/2 lg:w-1/3 xl:w-1/4 relative">
      <div className="group relative p-4 rounded-xl bg-black sm:bg-grey-900">
        <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg relative">
          {/* Image Background */}
          <img src={'../images/album_.jpg'} className="absolute inset-0 w-full h-full object-cover" alt="Playlist Background" />

          {/* SVG Gradient Overlay */}
          <div
            className="absolute inset-0 w-full h-full"
            style={{ backgroundImage: `url(${svgBackground})`, opacity: 0.5 }} // Adjust the opacity here
          ></div>

          <span className="absolute pl-4 pt-4 ">
            <FiDisc className="block" />
          </span>

          <span className="absolute pl-9 pt-3 ">{songs.length}</span>

          <div className="flex flex-col items-start justify-center text-small font-medium uppercase border-b-4 border-gold">
            <div className="flex-grow"></div>
            <span className="border-l-4 border-gold mb-3 pl-2">{playlistName}</span>
          </div>
        </div>
        <div className="text-center">
          <h3 className="text-sm font-medium text-white capitalize pt-2">
            {playlistName}
          </h3>
        </div>
      </div>
    </div>
  );
};
interface Props {
  initialLists: IPlaylist[];
}

const Library: React.FC<Props> = ({ initialLists }) => {
  const [listsLoading, setListsLoading] = useState(false);
  const [lists, setLists] = useState<
    {
      index: number;
      playlistName: string;
      songs: IPlaylistSong[];
    }[]
  >(initialLists);

  useEffect(() => {
    // Your useEffect logic for fetching playlists
  }, []); // Remember to add dependencies if needed

  return (
    <div className="h-full flex flex-col">
      {/* First Section: Takes necessary height only */}
      <section className="pl-2 sm:pl-2">
        <h2 className="text-md font-medium text-white">Library</h2>
      </section>

      {/* Second Section: Takes up all remaining space and scrolls if needed */}
      <section className="flex-grow overflow-auto">
        {listsLoading ? (
          <div className="grid place-items-center h-4/5">
            <div className=" mx-auto inline">
              <BeatLoader color="#CCA483" size={25} />
            </div>
          </div>
        ) : (
          <>
            <div className="w-full h-full">
              <div className="flex flex-wrap -p-2 h-full">
                {lists.map((list, index) => (
                  <PlaylistItem
                    key={index}
                    index={list.index}
                    playlistName={list.playlistName}
                    songs={list.songs}
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default Library