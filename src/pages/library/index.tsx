import React from "react";
import { useEffect, useState } from "react";
import BeatLoader from "react-spinners/BeatLoader";
import { useNavigate } from 'react-router-dom';
import { IPlaylist } from "../../types";
import { createRemotePlaylist, getRemoteAllPlaylists } from "../../actions";
import PlaylistItem from "./components/PlaylistItem";
import DetailForm2O, { DetailSchema2O } from "../../components/detailForm2O";
import { DEFAULT_TOAST_CONFIG, DEFAULT_TOAST_CREATE, toastError, toastSuccess } from "../../utils/toasts";
import { toast } from "react-toastify";
import { ModalV2 } from "../../components/tailwind/modalV2";
import { Slideover } from "../../components/tailwind/slideover";
import { Modal } from "../../components/tailwind/modal";
import Breadcrumb from "../../components/tailwind/breadcrumbs";
import Button from "../../components/tailwind/button";


const Library: React.FC = () => {
  const [listsLoading, setListsLoading] = useState(true);
  const [playlists, setPlaylists] = useState<IPlaylist[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      const lists = await getRemoteAllPlaylists();
      if (lists) setPlaylists(lists);
      setListsLoading(false);
    }

    fetchData();
  }, []);

  // ==============================================================
  // ==============================================================

  const [openPlaylistDetail, setOpenPlaylistDetail] =
  useState(false);

  const [selectedPlaylist, setSelectedPlaylist] = useState<
    {
      name: string;
    } | undefined
  >();

  const [selectedPlaylistTab, setSelectedPlaylistTab] =
    useState('Algemeen');

  // ==============================================================
  // ==============================================================

  const handleCreateObject = async () => {
    const playlistName = selectedPlaylist?.name;

    if (playlistName) {
      try {
        await toast.promise(
          new Promise(async (resolve, reject) => {
            try {
              const playlist = await createRemotePlaylist(playlistName, []);
              resolve(playlist);
            } catch (error) {
              reject(error);
            }
          }),
          DEFAULT_TOAST_CONFIG
        );
        
        toastSuccess(DEFAULT_TOAST_CREATE);
        setOpenPlaylistDetail(false);

        navigate(`/library/${encodeURIComponent(playlistName)}`);
      } catch (error: any) {
        toastError(error.message as string);
      }
    }
  };

  // ==============================================================
  // ==============================================================

  const detailSchema: DetailSchema2O = {
    identifier: "products",
    object: selectedPlaylist,
    selectedTab: selectedPlaylistTab,
    setSelectedTab: setSelectedPlaylistTab,
    tabs: [
      {
        buttons: [
          {
            text: "Opslaan",
            validate: true,
            callback: handleCreateObject,
            hideCallback: (object?: any): boolean => {
              return false;
            },
            disableCallback: (object?: any): boolean => {
              return false;
            },
          },
        ],
        title: "Algemeen",
        sections: [
          {
            title: "Product gegevens",
            description: "",
            width: 100,
            fields: [
              {
                grid: "sm:col-span-2",
                label: "Naam",
                name: "name",
                required: true,
                value: selectedPlaylist?.name,
                type: "text",
                callback: (name: string, value: string) => {
                  setSelectedPlaylist((prevState: any) => ({
                    ...prevState,
                    [name]: value,
                  }));
                  return value;
                },
                validateCallback: (
                  lable: string,
                  value?: string
                ): { valid: boolean; message?: string } => {
                  if (!value) {
                    return {
                      valid: false,
                      message: `moet worden ingevuld`,
                    };
                  }

                  return { valid: true };
                },
              },
            ],
          },
        ],
      },
    ],
  };

  // ==============================================================
  // ==============================================================

  return (
    <div className="h-full flex flex-col">
      <header className="flex flex-col gap-5 border-b border-gray-800/5 dark:border-white/5 px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-4">
            <div>
              <h1 className="text-4xl font-bold text-white mb-4">Library</h1>
              
            </div>
            <Breadcrumb 
              home={{ href: "/", name: "home" }} 
              items={[
                {
                  name: "Library",
                  href: "/library",
                  current: true
                }
              ]} 
            />
          </div>
          <div className="flex items-center gap-4">
            <Button 
              
              primary
              onClick={(e) => {
                e.preventDefault();
                setSelectedPlaylist({name: ""});
                setOpenPlaylistDetail(true);
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Create Playlist
            </Button> 
          </div>
        </div>
      </header>

      <section className="flex-grow overflow-auto px-4 py-6 sm:px-6 lg:px-8">
        {listsLoading ? (
          <div className="grid place-items-center h-4/5">
            <div className="mx-auto inline">
              <BeatLoader color="#CCA483" size={25} />
            </div>
          </div>
        ) : (
          <div className="w-full h-full">
            {playlists.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-400 mb-4">No playlists yet</h3>
                <p className="text-sm text-gray-500">Create your first playlist to get started</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {playlists.map((list, index) => (
                  <div
                    key={index}
                    className="relative cursor-pointer"
                    onClick={() => {
                      navigate(`/library/${encodeURIComponent(list.playlistName)}`);
                    }}
                  >
                    <PlaylistItem
                      key={index}
                      index={list.index}
                      playlistName={list.playlistName}
                      songs={list.songs}
                      path={list.path}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      <Modal open={openPlaylistDetail} setOpen={setOpenPlaylistDetail}>
        
          <DetailForm2O
            schema={detailSchema}
            title={"Producten"}
            caption={
              "Product toevoegen"
            }
          />
       
      </Modal>
    </div>
  );
};

export default Library;
