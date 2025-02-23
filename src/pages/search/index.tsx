import React from 'react';
import { useEffect, useState } from "react";
import BeatLoader from "react-spinners/BeatLoader";
import { IDirectoryItem, IPlaylist } from '../../types';
import { addRemoteSongToPlaylist, getRemoteAllPlaylists, getRemoteFileDirectory } from '../../actions';
import { ChevronRightOutline, DocumentOutline, FolderOutline, HomeModernOutline, PlusCircleOutline, XMarkOutline } from '../../components/icons';
import { MenuModal } from '../../components/player/menuModal';
import { toastError, toastSuccess } from '../../utils/toasts';
import { DEFAULT_ERROR_MESSAGE } from '../../utils/constants';
import Breadcrumb from '../../components/tailwind/breadcrumbs';

const Search: React.FC = () => {
  // const [playlistModalOpen, setPlaylistModalOpen] = useState(false);
  const [treeLoading, setTreeLoading] = useState(true);
  const [nodeHistorie, setNodeHistorie] = useState<IDirectoryItem[]>([]);
  const [selectedNode, setSelectedNode] = useState<IDirectoryItem | undefined>(
    undefined
  );
  const [playlists, setPlaylists] = useState<IPlaylist[]>([]);

  const [selectedFileForMenu, setSelectedFileForMenu] = useState<
    IDirectoryItem | undefined
  >();
  const [openMenu, setOpenMenu] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const lists = await getRemoteAllPlaylists();
      if (lists) setPlaylists(lists);

      const node = await getRemoteFileDirectory();
      if (node) {
        setNodeHistorie([node]);
        setSelectedNode(node);
      }

      setTreeLoading(false);
    }

    fetchData(); // Call the async function inside useEffect
  }, []);

  return (
    <div className="h-full flex flex-col">
      {/* Header Section */}
      <header className="flex flex-col gap-5 border-b border-gray-800/5 dark:border-white/5 px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-4">
            <div>
              <h1 className="text-4xl font-bold text-white mb-4">Browse Files</h1>
            </div>
            <Breadcrumb 
              home={{ href: "/search", name: "browse" }} 
              items={[
                {
                  name: "Search",
                  href: "/search",
                  current: true
                }
              ]} 
            />
          </div>
        </div>
      </header>

      {/* File Path Navigation */}
      <div className="bg-black/20 px-6 py-4 border-b border-white/5">
        <nav className="flex" aria-label="File path">
          <ol className="flex items-center space-x-2">
            {nodeHistorie.map((node, index) => (
              <React.Fragment key={node.name + index}>
                {index === 0 ? (
                  <li>
                    <button
                      className="text-gold hover:text-gold/80 transition-colors"
                      onClick={() => {
                        setSelectedNode(node);
                        setNodeHistorie(nodeHistorie.slice(0, 1));
                      }}
                    >
                      <HomeModernOutline className="h-5 w-5" />
                    </button>
                  </li>
                ) : (
                  <li className="flex items-center">
                    <ChevronRightOutline className="h-5 w-5 text-white/40" />
                    <button
                      onClick={() => {
                        setSelectedNode(node);
                        setNodeHistorie(nodeHistorie.slice(0, index + 1));
                      }}
                      className="ml-2 text-sm font-medium text-white/60 hover:text-white transition-colors"
                    >
                      {node.name}
                    </button>
                  </li>
                )}
              </React.Fragment>
            ))}
          </ol>
        </nav>
      </div>

      {/* File Explorer Content */}
      <div className="flex-1 px-6 py-6">
        {treeLoading ? (
          <div className="grid place-items-center h-4/5">
            <div className="mx-auto inline">
              <BeatLoader color="#CCA483" size={25} />
            </div>
          </div>
        ) : (
          <div className="w-full">
            {selectedNode?.children && selectedNode.children.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {selectedNode.children.map((item: IDirectoryItem, i: number) => (
                  <div
                    key={i.toString() + item.name}
                    onClick={() => {
                      if (item.type === "directory") {
                        setSelectedNode(item);
                        setNodeHistorie([...nodeHistorie, item]);
                      }
                    }}
                    className="group relative bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-black/20">
                        {item.type === "file" ? (
                          <DocumentOutline className="h-6 w-6 text-gold/80" />
                        ) : (
                          <FolderOutline className="h-6 w-6 text-gold/80" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">
                          {item.name}
                        </p>
                        <p className="text-sm text-white/60">
                          {item.type === "file" ? item.extension : "Folder"}
                        </p>
                      </div>
                      {item.type === "file" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedFileForMenu(item);
                            setOpenMenu(true);
                          }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-white/10 rounded-full"
                        >
                          <PlusCircleOutline className="h-5 w-5 text-white/60 hover:text-gold" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-400 mb-4">Empty folder</h3>
                <p className="text-sm text-gray-500">This folder contains no files</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Menu Modal - Keep existing code but update styling */}
      <MenuModal open={openMenu} setOpen={setOpenMenu}>
        <div className="h-full">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">Add to Playlist</h2>
            <button
              onClick={() => setOpenMenu(false)}
              className="text-white/60 hover:text-white transition-colors"
            >
              <XMarkOutline className="h-6 w-6" />
            </button>
          </div>

          <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg mb-6">
            <div className="h-16 w-16 flex items-center justify-center rounded-lg bg-black/20">
              <DocumentOutline className="h-8 w-8 text-gold/80" />
            </div>
            <div>
              <h3 className="text-white font-medium">{selectedFileForMenu?.name}</h3>
              <p className="text-white/60 text-sm">{selectedFileForMenu?.extension}</p>
            </div>
          </div>

          <div className="space-y-2">
            {playlists?.map((list: IPlaylist, index: number) => (
              <button
                key={list.index}
                onClick={async () => {
                  try {
                    await addRemoteSongToPlaylist(
                      list.playlistName,
                      selectedFileForMenu!.path
                    );
                    setOpenMenu(false);
                    toastSuccess("Successfully added to playlist");
                  } catch (error: any) {
                    setOpenMenu(false);
                    toastError(error?.message ?? DEFAULT_ERROR_MESSAGE);
                  }
                }}
                className="w-full flex items-center gap-4 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-left"
              >
                <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-black/20 text-gold">
                  {index + 1}
                </div>
                <span className="text-white font-medium">{list.playlistName}</span>
                <PlusCircleOutline className="h-5 w-5 text-white/60 ml-auto" />
              </button>
            ))}
          </div>
        </div>
      </MenuModal>
    </div>
  );
};

export default Search;