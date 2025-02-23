import React, { createContext, useContext, useState } from 'react';
import { Modal } from '../components/tailwind/modal';
import { DocumentOutline, PlusCircleOutline, XMarkOutline } from '../components/icons';
import { IDirectoryItem, IPlaylist } from '../types';
import { addRemoteSongToPlaylist } from '../actions';
import { toastError, toastSuccess } from '../utils/toasts';
import { DEFAULT_ERROR_MESSAGE } from '../utils/constants';

interface ModalContextType {
  openAddToPlaylist: (file: IDirectoryItem) => void;
  playlists: IPlaylist[];
  setPlaylists: (playlists: IPlaylist[]) => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAddToPlaylistOpen, setIsAddToPlaylistOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<IDirectoryItem | null>(null);
  const [playlists, setPlaylists] = useState<IPlaylist[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const openAddToPlaylist = (file: IDirectoryItem) => {
    setSelectedFile(file);
    setIsAddToPlaylistOpen(true);
    setSearchQuery('');
  };

  const filteredPlaylists = playlists.filter(playlist => 
    playlist.playlistName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ModalContext.Provider value={{ openAddToPlaylist, playlists, setPlaylists }}>
      {children}

      <Modal open={isAddToPlaylistOpen} setOpen={setIsAddToPlaylistOpen}>
        <div className="p-6 sm:p-8">
          {/* Header */}
          <div className="flex items-center gap-6 mb-8">
            <div className="h-24 w-24 flex-shrink-0 bg-gradient-to-br from-gold/20 to-gold/5 rounded-xl flex items-center justify-center shadow-lg">
              <DocumentOutline className="h-12 w-12 text-gold" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold text-white mb-2">Add to Playlist</h2>
              <div className="text-white/60 text-sm truncate">
                {selectedFile?.name}
              </div>
              <div className="text-white/40 text-sm">
                {selectedFile?.extension?.toUpperCase()}
              </div>
            </div>
            <button
              onClick={() => setIsAddToPlaylistOpen(false)}
              className="p-2 hover:bg-white/5 rounded-full transition-colors"
            >
              <XMarkOutline className="h-6 w-6 text-white/60 hover:text-white" />
            </button>
          </div>

          {/* Search Input */}
          <div className="relative mb-6">
            <input
              type="text"
              placeholder="Filter playlists..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/50"
            />
          </div>

          {/* Playlists Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {filteredPlaylists.map((list: IPlaylist, index: number) => (
              <button
                key={list.index}
                onClick={async () => {
                  try {
                    await addRemoteSongToPlaylist(
                      list.playlistName,
                      selectedFile!.path
                    );
                    setIsAddToPlaylistOpen(false);
                    toastSuccess("Successfully added to playlist");
                  } catch (error: any) {
                    setIsAddToPlaylistOpen(false);
                    toastError(error?.message ?? DEFAULT_ERROR_MESSAGE);
                  }
                }}
                className="group relative bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-all text-left border border-transparent hover:border-gold/20 focus:outline-none focus:border-gold/20 focus:ring-1 focus:ring-gold/20"
              >
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 flex-shrink-0 bg-black/40 rounded-lg flex items-center justify-center text-lg font-medium text-gold">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-white truncate">
                      {list.playlistName}
                    </div>
                    <div className="text-sm text-white/40">
                      {list.songs?.length || 0} tracks
                    </div>
                  </div>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <PlusCircleOutline className="h-6 w-6 text-gold" />
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Empty State */}
          {(!filteredPlaylists.length) && (
            <div className="text-center py-8">
              <div className="text-white/40 mb-2">
                {playlists.length === 0 ? 'No playlists found' : 'No matching playlists'}
              </div>
              <div className="text-sm text-white/30">
                {playlists.length === 0 ? 'Create a playlist first to add songs' : 'Try a different search term'}
              </div>
            </div>
          )}
        </div>
      </Modal>
    </ModalContext.Provider>
  );
}; 