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
      <div>
      <section className="pl-2 sm:pl-2">
        <h2 className="text-md font-medium text-white">Library</h2>
      </section>

      <button className="bg-primary text-white px-4 py-2 rounded-md" onClick={(e) => {
        e.preventDefault();
        setSelectedPlaylist({name: ""});
        setOpenPlaylistDetail(true);
      }}>
        Create Playlist
      </button>
      </div>

      <section className="flex-grow overflow-auto">
        {listsLoading ? (
          <div className="grid place-items-center h-4/5">
            <div className="mx-auto inline">
              <BeatLoader color="#CCA483" size={25} />
            </div>
          </div>
        ) : (
          <div className="w-full h-full">
            <div className="flex flex-wrap -p-2 h-full">
              {playlists.map((list, index) => (
                <div
                  key={index}
                  className="p-2 w-1/2 lg:w-1/3 xl:w-1/4 relative cursor-pointer"
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
