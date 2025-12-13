import React from 'react';
import { useEffect, useState } from "react";
import BeatLoader from "react-spinners/BeatLoader";
import { FiGrid, FiList, FiMusic } from "react-icons/fi";
import { IDirectoryItem, IPlaylist } from '../../types';
import { addRemoteSongToPlaylist, addRemoteSongToPresetPlaylist, getPresetIndexFromName, getRemoteAllPlaylists, getRemoteFileDirectory } from '../../actions';
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-4">
      {selectedNode?.children?.map((item: IDirectoryItem, i: number) => (
        <div
          key={i.toString() + item.name}
          onClick={() => {
            if (item.type === "directory") {
              setSelectedNode(item);
              setNodeHistorie([...nodeHistorie, item]);
            }
          }}
          className="group relative bg-white/5 rounded-lg p-3 sm:p-4 hover:bg-white/10 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="h-10 w-10 sm:h-12 sm:w-12 flex items-center justify-center rounded-lg bg-black/20 flex-shrink-0">
              {item.type === "file" ? (
                <DocumentOutline className="h-5 w-5 sm:h-6 sm:w-6 text-gold/80" />
              ) : (
                <FolderOutline className="h-5 w-5 sm:h-6 sm:w-6 text-gold/80" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium text-white truncate">
                {item.name}
              </p>
              <p className="text-xs text-white/60">
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
                className="sm:opacity-0 sm:group-hover:opacity-100 transition-opacity p-1.5 sm:p-2 hover:bg-white/10 rounded-full flex-shrink-0"
              >
                <PlusCircleOutline className="h-4 w-4 sm:h-5 sm:w-5 text-white/60 hover:text-gold" />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  const renderListView = () => (
    <div>
      {/* Table Header - hidden on mobile */}
      <div className="hidden sm:grid grid-cols-[40px_40px_1fr_80px_40px] lg:grid-cols-[50px_50px_1fr_100px_50px] items-center text-white/60 text-xs sm:text-sm px-2 sm:px-4 py-2 border-b border-white/10">
        <div className="text-center">#</div>
        <div></div>
        <div>Name</div>
        <div>Type</div>
        <div></div>
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
            className="grid grid-cols-[32px_1fr_32px] sm:grid-cols-[40px_40px_1fr_80px_40px] lg:grid-cols-[50px_50px_1fr_100px_50px] items-center px-2 sm:px-4 py-2.5 sm:py-3 text-white hover:bg-white/5 transition-colors group cursor-pointer"
          >
            {/* Mobile: Icon only */}
            <div className="sm:hidden flex justify-center">
              {item.type === "file" ? (
                <DocumentOutline className="h-4 w-4 text-gold/80" />
              ) : (
                <FolderOutline className="h-4 w-4 text-gold/80" />
              )}
            </div>
            
            {/* Desktop: Index */}
            <div className="hidden sm:block text-white/60 text-center text-xs sm:text-sm">{i + 1}</div>
            
            {/* Desktop: Icon */}
            <div className="hidden sm:flex justify-center">
              {item.type === "file" ? (
                <DocumentOutline className="h-4 w-4 sm:h-5 sm:w-5 text-gold/80" />
              ) : (
                <FolderOutline className="h-4 w-4 sm:h-5 sm:w-5 text-gold/80" />
              )}
            </div>
            
            {/* Name - with type on mobile */}
            <div className="min-w-0">
              <div className="truncate text-sm">{item.name}</div>
              <div className="sm:hidden text-xs text-white/50">
                {item.type === "file" ? item.extension : "Folder"}
              </div>
            </div>
            
            {/* Type - hidden on mobile */}
            <div className="hidden sm:block text-white/60 text-xs sm:text-sm">
              {item.type === "file" ? item.extension : "Folder"}
            </div>
            
            {/* Add button */}
            <div className="flex justify-center">
              {item.type === "file" && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFileForMenu(item);
                    setOpenMenu(true);
                  }}
                  className="sm:opacity-0 sm:group-hover:opacity-100 transition-opacity p-1 sm:p-2 hover:bg-white/10 rounded-full"
                >
                  <PlusCircleOutline className="h-4 w-4 sm:h-5 sm:w-5 text-white/60 hover:text-gold" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Fixed Header Section */}
      <header className="flex-shrink-0 flex flex-col gap-3 sm:gap-5 border-b border-gray-800/5 dark:border-white/5 px-3 py-3 sm:px-6 sm:py-4 lg:px-8">
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-col gap-2 sm:gap-4 min-w-0">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">Browse Files</h1>
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
          <div className="flex-shrink-0 flex items-center gap-1 sm:gap-2 bg-white/5 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 sm:p-2 rounded-md transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-white/10 text-gold' 
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <FiGrid className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 sm:p-2 rounded-md transition-colors ${
                viewMode === 'list' 
                  ? 'bg-white/10 text-gold' 
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <FiList className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* File Path Navigation - Fixed */}
      <div className="flex-shrink-0 bg-black/20 px-3 sm:px-6 py-3 sm:py-4 border-b border-white/5 overflow-x-auto">
        <nav className="flex" aria-label="File path">
          <ol className="flex items-center space-x-1 sm:space-x-2">
            {nodeHistorie.map((node, index) => (
              <React.Fragment key={node.name + index}>
                {index === 0 ? (
                  <li className="flex-shrink-0">
                    <button
                      className="text-gold hover:text-gold/80 transition-colors"
                      onClick={() => {
                        setSelectedNode(node);
                        setNodeHistorie(nodeHistorie.slice(0, 1));
                      }}
                    >
                      <HomeModernOutline className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>
                  </li>
                ) : (
                  <li className="flex items-center flex-shrink-0">
                    <ChevronRightOutline className="h-4 w-4 sm:h-5 sm:w-5 text-white/40" />
                    <button
                      onClick={() => {
                        setSelectedNode(node);
                        setNodeHistorie(nodeHistorie.slice(0, index + 1));
                      }}
                      className="ml-1 sm:ml-2 text-xs sm:text-sm font-medium text-white/60 hover:text-white transition-colors truncate max-w-[100px] sm:max-w-[150px]"
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

      {/* File Explorer Content - Scrollable */}
      <div className="flex-1 overflow-auto min-h-0 px-3 sm:px-6 py-3 sm:py-6">
        {treeLoading ? (
          <div className="grid place-items-center h-40">
            <BeatLoader color="#CCA483" size={20} />
          </div>
        ) : (
          <div className="w-full">
            {selectedNode?.children && selectedNode.children.length > 0 ? (
              viewMode === 'grid' ? renderGridView() : renderListView()
            ) : (
              <div className="text-center py-8 sm:py-12">
                <h3 className="text-base sm:text-lg font-medium text-gray-400 mb-2 sm:mb-4">Empty folder</h3>
                <p className="text-xs sm:text-sm text-gray-500">This folder contains no files</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add to Playlist Modal */}
      <Modal open={openMenu} setOpen={setOpenMenu}>
        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h3 className="text-lg sm:text-xl font-bold text-white">Add to Playlist</h3>
            <button
              onClick={() => setOpenMenu(false)}
              className="text-white/60 hover:text-white p-1"
            >
              <XMarkOutline className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* Song Preview */}
          <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white/5 rounded-xl mb-4 sm:mb-6">
            <div className="h-10 w-10 sm:h-12 sm:w-12 flex items-center justify-center rounded-lg bg-black/20 flex-shrink-0">
              <DocumentOutline className="h-5 w-5 sm:h-6 sm:w-6 text-gold/80" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium text-white truncate">
                {selectedFileForMenu?.name}
              </p>
              <p className="text-xs text-white/60">
                {selectedFileForMenu?.extension}
              </p>
            </div>
          </div>

          {/* Playlists List */}
          <div className="space-y-2 max-h-[50vh] overflow-auto">
            {/* Preset Playlists Section */}
            {playlists?.some(p => p.isPreset) && (
              <div className="mb-4">
                <h4 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  Preset Playlists
                </h4>
                <div className="space-y-2">
                  {playlists?.filter(p => p.isPreset).map((list: IPlaylist) => {
                    const color2 = `hsl(${35 + (list.index * 8) % 30}, 60%, 30%)`;

                    return (
                      <button
                        key={`preset-${list.index}`}
                        onClick={async () => {
                          try {
                            const presetIndex = getPresetIndexFromName(list.playlistName);
                            if (presetIndex >= 0) {
                              await addRemoteSongToPresetPlaylist(
                                presetIndex,
                                selectedFileForMenu!.path
                              );
                            }
                            setOpenMenu(false);
                            toastSuccess("Successfully added to preset playlist");
                          } catch (error: any) {
                            setOpenMenu(false);
                            toastError(error?.message ?? DEFAULT_ERROR_MESSAGE);
                          }
                        }}
                        className="w-full group flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl transition-all
                          border border-amber-500/20 hover:border-amber-500/40 bg-amber-500/5 hover:bg-amber-500/10"
                      >
                        {/* Playlist Icon with gradient */}
                        <div 
                          className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg flex items-center justify-center flex-shrink-0 relative"
                          style={{
                            background: `linear-gradient(135deg, rgba(0,0,0,0.5), ${color2})`
                          }}
                        >
                          <FiMusic className="w-5 h-5 sm:w-6 sm:h-6 text-white/80" />
                        </div>
                        
                        {/* Playlist Info */}
                        <div className="flex-1 min-w-0 text-left">
                          <div className="flex items-center gap-2">
                            <p className="text-sm sm:text-base font-medium text-white truncate">
                              {list.displayName || list.playlistName}
                            </p>
                            <span className="px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-amber-500/80 text-black rounded flex-shrink-0">
                              Preset
                            </span>
                          </div>
                          <p className="text-xs sm:text-sm text-white/60">
                            {list.songs?.length || 0} tracks
                          </p>
                        </div>

                        {/* Add Icon */}
                        <div className="text-white/60 group-hover:text-amber-500 transition-colors flex-shrink-0">
                          <PlusCircleOutline className="w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Regular Playlists Section */}
            {playlists?.some(p => !p.isPreset) && (
              <div>
                <h4 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold"></span>
                  My Playlists
                </h4>
                <div className="space-y-2">
                  {playlists?.filter(p => !p.isPreset).map((list: IPlaylist, index: number) => {
                    const hash = list.playlistName
                      .split("")
                      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
                    const color2 = `hsl(${(hash + 180) % 360}, 50%, 25%)`;

                    return (
                      <button
                        key={`regular-${list.index}`}
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
                        className="w-full group flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl transition-all
                          border border-transparent hover:border-gold/20 bg-white/5 hover:bg-white/[0.07]"
                      >
                        {/* Playlist Icon with gradient */}
                        <div 
                          className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{
                            background: `linear-gradient(135deg, rgba(0,0,0,0.5), ${color2})`
                          }}
                        >
                          <FiMusic className="w-5 h-5 sm:w-6 sm:h-6 text-white/80" />
                        </div>
                        
                        {/* Playlist Info */}
                        <div className="flex-1 min-w-0 text-left">
                          <p className="text-sm sm:text-base font-medium text-white truncate">
                            {list.displayName || list.playlistName}
                          </p>
                          <p className="text-xs sm:text-sm text-white/60">
                            {list.songs?.length || 0} tracks
                          </p>
                        </div>

                        {/* Add Icon */}
                        <div className="text-white/60 group-hover:text-gold transition-colors flex-shrink-0">
                          <PlusCircleOutline className="w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Empty State */}
            {(!playlists || playlists.length === 0) && (
              <div className="text-center py-6 sm:py-8">
                <div className="mx-auto w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/5 flex items-center justify-center mb-3 sm:mb-4">
                  <PlusCircleOutline className="w-5 h-5 sm:w-6 sm:h-6 text-white/20" />
                </div>
                <p className="text-sm sm:text-base text-white/60 font-medium">No playlists found</p>
                <p className="text-xs sm:text-sm text-white/40 mt-1">
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