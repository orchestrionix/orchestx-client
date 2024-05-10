
import { Modal } from "./modal";
import { useContext, useState } from "react";
import { BackwardOutline, ForwardOutline, PauseOutline, PlayOutline, XMarkOutline } from "../icons";
import { formatTime, getPath, parseSongString, positionTimeLine } from "../../utils";
import { nextRemotePlayer, prevRemotePlayer, toggelRemotePlayer } from "../../actions";
import { STATUS_PLAYING } from "../../utils/constants";
import { PlayerContext } from "../../playerProvider";


export default function PlayerControle() {
  const context = useContext(PlayerContext);
  const playerState = context?.playerState;
  const [openSongModal, setOpenSongModal] = useState(false);

  const currentSong = parseSongString(playerState?.title ? playerState?.title : '');

  const timeLineStyle = {
    width: positionTimeLine(playerState?.length ? playerState?.length : 0, playerState?.position ? playerState?.position : 0, (playerState?.status === 'paused' || playerState?.status === 'playing') ? true : false),
  };

  const playingPictureStyle = {
    width: 100 + "%",
    height: 75,
    background: `linear-gradient( rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.6) ), url("${getPath(currentSong.rhythm)}")`,
    backgroundPosition: "center",
    WebkitAnimationFillMode: "forwards",
  };

  const modalBackgroundPictureStyle = {
    background: `linear-gradient( rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.9) ), url("${getPath(currentSong.rhythm)}")`,
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
  }

  return (
    <>
      <Modal open={openSongModal} setOpen={setOpenSongModal}>
        <div className="flex flex-col justify-between h-full px-8 rounded-2xl" style={modalBackgroundPictureStyle}>

          {/* Header */}
          <div className="pt-8">
            <XMarkOutline className="h-7 cursor-pointer hover:text-gold" onClick={() => setOpenSongModal(false)} />
          </div>


          {/* Song Image */}
          <div className="flex z-0 text-center">
            <div className="mx-auto my-auto flex justify-center items-center flex-col">
              <img className='rounded-lg sm:max-w-sm lg:w-full' alt={getPath(currentSong.rhythm)} src={getPath(currentSong.rhythm)} />
              <h2 className="text-gray-300 font-bold capitalize text-base pt-5">{currentSong.name}</h2>
              <p className="text-gray-400 pt-2 capitalize text-small">{currentSong.rhythm}</p>
            </div>
          </div>

          {/* Player controles */}
          <div>
            {/* ProgressBar */}
            <div>
              <div className="relative h-1 bg-gray-200">
                <div className="absolute h-full bg-gold flex items-center justify-end" style={timeLineStyle}>
                  <div className="rounded-full w-3 h-3 bg-white shadow"></div>
                </div>
              </div>
            </div>

            {/* Time Labels */}
            <div className="relative overflow-hidden">
              <div className="flex justify-between text-m font-semibold text-gray-300 my-3">
                <div className=" w-24 text-left">
                  {formatTime(playerState?.position ? playerState?.position : 0)}
                </div>

                <div className=" w-24 text-right">
                  {formatTime(playerState?.length ? playerState?.length : 0)}
                </div>
              </div>
            </div>

            {/* Controles */}
            <div className="flex justify-around">
              <div className="flex space-x-6">
                <button className="focus:outline-none text-gray-300 hover:text-gold" onClick={async () =>
                  await prevRemotePlayer()}>
                  <BackwardOutline className="h-10" />
                </button>
                {playerState?.status === STATUS_PLAYING ?
                  <button className="focus:outline-non text-center text-gray-300 hover:text-gold" onClick={async () =>
                    await toggelRemotePlayer()}>
                    <PauseOutline className="h-12" />
                  </button>
                  :
                  <button className="focus:outline-non text-center text-gray-300 hover:text-gold" onClick={async () =>
                    await toggelRemotePlayer()}>
                    <PlayOutline className="h-12" />
                  </button>
                }
                <button className="focus:outline-none text-gray-300 hover:text-gold" onClick={async () =>
                  await nextRemotePlayer()}>
                  <ForwardOutline className="h-10" />
                </button>
              </div>
            </div>
          </div>

          {/* Footer, transparant icon */}
          <div className="pb-8">
            <XMarkOutline className="h-7  text-transparent" onClick={() => setOpenSongModal(false)} />
          </div>
        </div>
      </Modal>
      <div className="h-full shadow-lg flex flex-col justify-center">
        <div className="flex items-between">
          <div className="hidden xl:flex flex-1 justify-start align-middle">
            <div className="flex cursor-pointer hover:shadow-md px-2 rounded-lg pl-8">
              <img
                className="w-16 h-16 object-cover"
                alt="User avatar"
                src={getPath(currentSong.rhythm)}
              />
              <div className="flex flex-col px-2 pt-1 w-full">
                <span className=" text-gray-200 capitalize font-semibold">
                  {currentSong.name}
                </span>
                <span className=" text-neutral-400 capitalize font-small">
                  {currentSong.rhythm}
                </span>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="">
              <div
                className={`xl:hidden relative rounded-xl display ${true ? "animate-slideup" : "animate-slidedown"
                  }`}
                style={playingPictureStyle}
                onClick={() => setOpenSongModal(true)}
              >
                <div
                  className={`${true
                    ? "absolute p-4 inset-0 flex flex-col justify-end bg-gradient-to-b from-transparent to-black backdrop backdrop-blur-5 text-white"
                    : "display-hidden"
                    }`}
                >
                  <h3 className="font-bold capitalize">{currentSong.name}</h3>
                  <span className="opacity-80 animate-pulse"> {playerState?.status === STATUS_PLAYING ? 'now playing' : playerState?.status}</span>
                </div>
              </div>

              <div>
                <div className="relative h-1 bg-neutral-600">
                  <div
                    className="absolute h-full bg-gold flex items-center justify-end"
                    style={timeLineStyle}
                  >
                    <div className="rounded-full w-3 h-3 bg-white shadow z-10"></div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between text-xs font-semibold px-4 py-2 xl:p-0">
                <div className=" w-24 text-left text-gray-200">{formatTime(playerState?.position ? playerState?.position : 0)}</div>

                <div className="flex space-x-4 p-2 py-4 xl:p-0 xl:mt-4">
                  <button className="focus:outline-none text-gray-300 hover:text-gold" onClick={async () =>
                    await prevRemotePlayer()}>
                    <BackwardOutline className="h-8" />
                  </button>
                  {playerState?.status === STATUS_PLAYING ? (
                    <button className="focus:outline-non text-center text-gray-300 hover:text-gold" onClick={async () =>
                      await toggelRemotePlayer()}>
                      <PauseOutline className="h-10" />
                    </button>
                  ) : (
                    <button className="focus:outline-non text-center text-gray-300 hover:text-gold" onClick={async () =>
                      await toggelRemotePlayer()}>
                      <PlayOutline className="h-10" />
                    </button>
                  )}
                  <button className="focus:outline-none text-gray-300 hover:text-gold" onClick={async () =>
                    await nextRemotePlayer()}>
                    <ForwardOutline className="h-8" />
                  </button>
                </div>

                <div className=" w-24 text-right text-gray-200">{formatTime(playerState?.length ? playerState?.length : 0)}</div>
              </div>
            </div>
          </div>
          <div className="hidden xl:flex flex-1"></div>
        </div>
      </div>
    </>
  );
}