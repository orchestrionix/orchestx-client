import React from 'react';
import { useEffect, useState } from "react";
import BeatLoader from "react-spinners/BeatLoader";
import { FiDisc } from "react-icons/fi";
import { IDirectoryItem, IPlaylist, IPlaylistSong } from '../types';
import { ChevronRightOutline, DocumentOutline, EllipsisHorizontalSolid, FolderOutline, HomeModernOutline, PlusCircleOutline, XMarkOutline } from '../components/icons';
import { MenuModal } from '../components/player/menuModal';
import { toastError, toastSuccess } from '../utils/toasts';
import { addRemoteSongToPlaylist, getRemoteAllPlaylists, getRemoteFileDirectory } from '../actions';
import { DEFAULT_ERROR_MESSAGE } from '../utils/constants';
import { IColumn, Table } from '../components/tailwind/table';

const Search: React.FC = () => {
  const [playlistModalOpen, setPlaylistModalOpen] = useState(false);
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

  const columns: IColumn[] = [
    {
      key: "column0",
      name: "Title",
      fieldName: "activity.title",
      render: (item: IDirectoryItem) => {
        return (
          <div className="flex-shrink-0 h-14 w-14 flex items-center justify-center bg-gradient-to-b from-black to-grey-900">
            {item?.type === "file" ? (
              <DocumentOutline className="h-6 w-6" />
            ) : (
              <FolderOutline className="h-6 w-6" />
            )}
          </div>
        );
      },
    },
    {
      key: "column1",
      name: "",
      fieldName: "activity.title",
      render: (item: IDirectoryItem) => {
        return (
          <span className="text-ellipsis overflow-hidden block w-100">
            {item?.name}
          </span>
        );
      },
    },
    {
      key: "column2",
      name: "Type",
      fieldName: "activity.activityType.title",
      render: (item: IDirectoryItem) => {
        return (
          <span className="text-ellipsis overflow-hidden block w-16 ">
            {item?.type === "directory" ? "Folder" : item?.extension}
          </span>
        );
      },
    },
    {
      key: "column3",
      name: "",
      fieldName: "activity.activityType.title",
      render: (item: IDirectoryItem) => {
        if (item.type === "file") {
          return (
            <span
              className="text-ellipsis overflow-hidden block w-8 hover:cursor-pointer"
              onClick={() => {
                setSelectedFileForMenu(item);
                setOpenMenu(true);
              }}
            >
              <EllipsisHorizontalSolid className="h-6 w-6" />
            </span>
          );
        }
      },
    },
  ];

  return (
    <div className="h-full flex flex-col">
      {/* First Section: Takes necessary height only */}
      <section className="">
        <h2 className="text-md font-medium">Search</h2>
        <div className="flex align-center mt-4 mb-4 h-10">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-4">
              {nodeHistorie &&
                nodeHistorie.map((node, index) => (
                  <>
                    {index > 0 ? (
                      <li key={node.name}>
                        <div className="flex items-center">
                          <ChevronRightOutline className="h-5 w-5 text-white" />

                          <span
                            onClick={() => {
                              setSelectedNode(node);
                              setNodeHistorie(nodeHistorie.slice(0, index + 1));
                            }}
                            className="ml-4 text-sm font-medium text-decapify-lightgray hover:text-decapify-semigray capitalize cursor-pointer"
                          >
                            {node.name}
                          </span>
                        </div>
                      </li>
                    ) : (
                      <li key={node.name}>
                        <div>
                          <span
                            className="text-decapify-lightgray hover:text-gray-500"
                            onClick={() => {
                              setSelectedNode(node);
                              setNodeHistorie(nodeHistorie.slice(0, index + 1));
                            }}
                          >
                            <HomeModernOutline className="h-5 w-5 text-white" />

                            <span className="sr-only">Home</span>
                          </span>
                        </div>
                      </li>
                    )}
                  </>
                ))}
            </ol>
          </nav>
        </div>
      </section>

      {/* Second Section: Takes up all remaining space and scrolls if needed */}
      <section className="flex-grow overflow-auto">
        {treeLoading ? (
          <div className="grid place-items-center h-4/5">
            <div className=" mx-auto inline">
              <BeatLoader color="#CCA483" size={25} />
            </div>
          </div>
        ) : (
          <>
            <div className="hidden xl:block">
              <Table
                items={selectedNode?.children ? selectedNode.children : []}
                columns={columns}
                loading={treeLoading}
                onSelect={(child: IDirectoryItem) => {
                  if (child.type === "directory") {
                    setSelectedNode(child);
                    setNodeHistorie([...nodeHistorie, child]);
                  }
                }}
                selection={undefined}
              />
            </div>
            <div className="block xl:hidden">
              {selectedNode?.children && selectedNode?.children.length > 0 ? (
                <>
                  {selectedNode?.children.map((item, i) => (
                    <div
                      key={i.toString() + item.name} // random number as key, does not really matter, is for react rendering
                      className="flex items-center space-x-2 sm:space-x-4 p-1 sm:p-4 hover:bg-grey-900 text-white hover:text-gold cursor-pointer"
                      onClick={() => {
                        if (item.type === "directory") {
                          setSelectedNode(item);
                          setNodeHistorie([...nodeHistorie, item]);
                        }
                      }}
                    >
                      <div className="flex-shrink-0 h-14 w-14 items-center justify-center bg-gradient-to-b from-black to-grey-900 hidden sm:flex">
                        {item?.type === "file" ? (
                          <DocumentOutline className="h-6 w-6" />
                        ) : (
                          <FolderOutline className="h-6 w-6" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-normal truncate">
                          {item.name}
                        </p>
                        <p className="text-xs sm:text-sm text-grey-300 truncate">
                          {item.type === "file" ? item.extension : "Folder"}{" "}
                        </p>
                      </div>

                      {item.type === "file" ? (
                        <div
                          className="flex-shrink-0 h-14 w-14 flex items-center justify-center hover:cursor-pointer"
                          onClick={() => {
                            setSelectedFileForMenu(item);
                            setOpenMenu(true);
                          }}
                        >
                          <EllipsisHorizontalSolid className="h-6 w-6" />
                        </div>
                      ) : (
                        <div className="flex-shrink-0 h-14 w-14 flex items-center justify-center ">
                          {/* Keep icon as placholder to force fit it to its size, color transparant*/}
                          <EllipsisHorizontalSolid className="h-6 w-6 text-transparent" />
                        </div>
                      )}
                    </div>
                  ))}
                </>
              ) : (
                <>
                  {selectedNode?.children &&
                  selectedNode?.children.length < 1 ? (
                    <div></div>
                  ) : (
                    <></>
                  )}
                </>
              )}
            </div>
          </>
        )}
      </section>

      <MenuModal open={openMenu} setOpen={setOpenMenu}>
        <div className="h-full">
          <section>
            <div className="mb-10">
              <div>
                <XMarkOutline
                  className="h-7 cursor-pointer hover:text-gold"
                  onClick={() => setOpenMenu(false)}
                />
              </div>
              <div className="p-4 flex justify-center h-full">
                <div className="flex-shrink-0 h-40 w-40 items-center justify-center bg-gradient-to-b from-black to-gold flex">
                  {selectedFileForMenu?.type === "file" ? (
                    <DocumentOutline className="h-16 w-16" />
                  ) : (
                    <FolderOutline className="h-16 w-16" />
                  )}
                </div>
              </div>
              <h2 className="font-medium">{selectedFileForMenu?.name}</h2>
            </div>
            <div className="border-b-2 border-grey-900 mb-4">
              <p className="text-left text-md font-medium pb-2">Playlists</p>
            </div>
          </section>

          <div className="h-max overflow-y">
            {selectedFileForMenu &&
              playlists &&
              playlists.map((list: IPlaylist, index: number) => (
                <>
                  <div
                    key={list.index}
                    className="flex bg-grey-900 hover:bg-grey-700 p-2 rounded my-1"
                  >
                    <div className="w-1/6 font-medium">{index + 1}</div>
                    <div className="w-4/6 capitalize font-medium">
                      {list.playlistName}
                    </div>
                    <div
                      className="w-1/6 cursor-pointer text-white hover:text-gold border-none ring-0 focus:ring-0"
                      onClick={async () => {
                        try {
                          await addRemoteSongToPlaylist(
                            list.playlistName,
                            selectedFileForMenu.path
                          );
                          setOpenMenu(false);
                          toastSuccess("Successfully added to playlist");
                        } catch (error: any) {
                          setOpenMenu(false);
                          toastError(
                            error?.message
                              ? error?.message
                              : DEFAULT_ERROR_MESSAGE
                          );
                        }
                      }}
                    >
                      <PlusCircleOutline className="h-6 w-6 ring-0 focus:ring-0" />
                    </div>
                  </div>
                </>
              ))}
          </div>
        </div>
      </MenuModal>
    </div>
  );
};

export default Search