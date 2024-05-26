import React, { useEffect, useState } from "react";
import { IActivePlaylistItem} from "../types";
import { getRemotePlayerActivePlaylist } from "../actions";
import BeatLoader from "react-spinners/BeatLoader";
import { IColumn, Table } from "../components/tailwind/table";
import { parsePlaylistString } from "../utils";

const HomePage: React.FC = () => {
  const [listLoading, setListLoading] = useState(true);
  const [playlist, setPlaylist] = useState<IActivePlaylistItem[]>([]);

  useEffect(() => {
    async function fetchData() {
      const list = await getRemotePlayerActivePlaylist();
      if (list) setPlaylist(parsePlaylistString(list));

      setListLoading(false);
    }

    fetchData();
  }, []);

  const columns: IColumn[] = [
    {
      key: "column0",
      name: "Rhythm",
      fieldName: "activity.rhythm",
      render: (item: IActivePlaylistItem) => {
        return (
          <span className="text-ellipsis overflow-hidden block w-100">
            {item?.rhythm}
          </span>
        );
      },
    },
    {
      key: "column1",
      name: "Title",
      fieldName: "activity.title",
      render: (item: IActivePlaylistItem) => {
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
      render: (item: IActivePlaylistItem) => {
        return (
          <span className="text-ellipsis overflow-hidden block w-16 ">
            {item?.extension}
          </span>
        );
      },
    },
  ];
  
  return (
    <div className="h-full flex flex-col">
      {/* First Section: Takes necessary height only */}
      <section className="pl-2 sm:pl-2">
        <h2 className="text-md font-medium text-white">Home</h2>
      </section>

      {/* Second Section: Takes up all remaining space and scrolls if needed */}
      <section className="flex-grow overflow-auto">
        {listLoading ? (
          <div className="grid place-items-center h-4/5">
            <div className=" mx-auto inline">
              <BeatLoader color="#CCA483" size={25} />
            </div>
          </div>
        ) : (
          <>
            <div className="hidden xl:block">
              <Table
                items={playlist}
                columns={columns}
                loading={listLoading}
                onSelect={(child: IActivePlaylistItem) => {
                  console.log(child)
                }}
                selection={undefined}
              />
            </div>
            <div className="block xl:hidden">
              {playlist && playlist.length > 0 ? (
                <>
                  {playlist.map((item, i) => (
                    <div
                      key={i.toString() + item.name} // random number as key, does not really matter, is for react rendering
                      className="flex items-center space-x-2 sm:space-x-4 p-1 sm:p-4 hover:bg-grey-900 text-white hover:text-gold cursor-pointer"
                      onClick={() => {
                        // if (item.type === "directory") {
                        //   setSelectedNode(item);
                        //   setNodeHistorie([...nodeHistorie, item]);
                        // }
                        console.log(item);
                      }}
                    >
                      <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm text-grey-300 truncate">
                          {item.rhythm}
                        </p>
                        <p className="text-xs sm:text-sm font-normal truncate">
                          {item.name}
                        </p>
                      
                      </div>

                    </div>
                  ))}
                </>
              ) : (
                <>
                  {playlist &&
                  playlist.length < 1 ? (
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
    </div>
  );
};

export default HomePage;
