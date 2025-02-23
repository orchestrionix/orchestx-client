import React from 'react';
import { useEffect, useState } from "react";
import BeatLoader from "react-spinners/BeatLoader";
import { FiGrid, FiList, FiMusic } from "react-icons/fi";
import { IDirectoryItem, IPlaylist } from '../../types';
import { addRemoteSongToPlaylist, getRemoteAllPlaylists, getRemoteFileDirectory } from '../../actions';
import { ChevronRightOutline, DocumentOutline, FolderOutline, HomeModernOutline, PlusCircleOutline, XMarkOutline } from '../../components/icons';
import { MenuModal } from '../../components/player/menuModal';
import { toastError, toastSuccess } from '../../utils/toasts';
import { DEFAULT_ERROR_MESSAGE } from '../../utils/constants';
import Breadcrumb from '../../components/tailwind/breadcrumbs';
import { Modal } from '../../components/tailwind/modal';

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
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

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

  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {selectedNode?.children?.map((item: IDirectoryItem, i: number) => (
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
  );

  const renderListView = () => (
    <div>
      {/* Table Header */}
      <div className="grid grid-cols-[50px_50px_1fr_100px_50px] items-center text-white/60 text-sm px-4 py-2 border-b border-white/10">
        <div className="text-center">#</div>
        <div></div> {/* For icon */}
        <div>Name</div>
        <div>Type</div>
        <div></div> {/* For add button */}
      </div>

      {/* Table Body */}
      <div className="divide-y divide-white/10">
        {selectedNode?.children?.map((item: IDirectoryItem, i: number) => (
          <div
            key={i.toString() + item.name}
            onClick={() => {
              if (item.type === "directory") {
                setSelectedNode(item);
                setNodeHistorie([...nodeHistorie, item]);
              }
            }}
            className="grid grid-cols-[50px_50px_1fr_100px_50px] items-center px-4 py-3 text-white hover:bg-white/5 transition-colors group cursor-pointer"
          >
            <div className="text-white/60 text-center">{i + 1}</div>
            <div className="flex justify-center">
              {item.type === "file" ? (
                <DocumentOutline className="h-5 w-5 text-gold/80" />
              ) : (
                <FolderOutline className="h-5 w-5 text-gold/80" />
              )}
            </div>
            <div className="truncate">{item.name}</div>
            <div className="text-white/60">
              {item.type === "file" ? item.extension : "Folder"}
            </div>
            <div className="flex justify-center">
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
    </div>
  );

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
          {/* View Toggle */}
          <div className="flex items-center gap-2 bg-white/5 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-white/10 text-gold' 
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <FiGrid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list' 
                  ? 'bg-white/10 text-gold' 
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <FiList className="w-5 h-5" />
            </button>
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
              viewMode === 'grid' ? renderGridView() : renderListView()
            ) : (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-400 mb-4">Empty folder</h3>
                <p className="text-sm text-gray-500">This folder contains no files</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add to Playlist Modal */}
      <Modal open={openMenu} setOpen={setOpenMenu}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">Add to Playlist</h3>
            <button
              onClick={() => setOpenMenu(false)}
              className="text-white/60 hover:text-white"
            >
              <XMarkOutline className="w-5 h-5" />
            </button>
          </div>

          {/* Song Preview */}
          <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl mb-6">
            <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-black/20">
              <DocumentOutline className="h-6 w-6 text-gold/80" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {selectedFileForMenu?.name}
              </p>
              <p className="text-sm text-white/60">
                {selectedFileForMenu?.extension}
              </p>
            </div>
          </div>

          {/* Playlists List */}
          <div className="space-y-2">
            {playlists?.map((list: IPlaylist, index: number) => {
              // Generate gradient colors with moderate saturation
              const hash = list.playlistName
                .split("")
                .reduce((acc, char) => acc + char.charCodeAt(0), 0);
              const color2 = `hsl(${(hash + 180) % 360}, 50%, 25%)`; // Moderate saturation, balanced darkness

              return (
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
                  className="w-full group flex items-center gap-4 p-4 rounded-xl transition-all
                    border border-transparent hover:border-gold/20 bg-white/5 hover:bg-white/[0.07]"
                >
                  {/* Playlist Icon with gradient */}
                  <div 
                    className="h-12 w-12 rounded-lg flex items-center justify-center"
                    style={{
                      background: `linear-gradient(135deg, rgba(0,0,0,0.5), ${color2})`
                    }}
                  >
                    <FiMusic className="w-6 h-6 text-white/80" />
                  </div>
                  
                  {/* Playlist Info */}
                  <div className="flex-1 min-w-0 text-left">
                    <p className="font-medium text-white truncate">
                      {list.playlistName}
                    </p>
                    <p className="text-sm text-white/60">
                      {list.songs?.length || 0} tracks
                    </p>
                  </div>

                  {/* Add Icon */}
                  <div className="text-white/60 group-hover:text-gold transition-colors">
                    <PlusCircleOutline className="w-5 h-5" />
                  </div>
                </button>
              );
            })}

            {/* Empty State */}
            {(!playlists || playlists.length === 0) && (
              <div className="text-center py-8">
                <div className="mx-auto w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4">
                  <PlusCircleOutline className="w-6 h-6 text-white/20" />
                </div>
                <p className="text-white/60 font-medium">No playlists found</p>
                <p className="text-sm text-white/40 mt-1">
                  Create a playlist first to add songs
                </p>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Search;