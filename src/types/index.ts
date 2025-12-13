import { Dispatch, SetStateAction } from "react";

export type PlayerStateType = {
    status: "ready" | "playing" | "paused" | "unknown" | "error";
    title: string;
    itemId: number;
    length: number;
    position: number;
    volume: number;
    viewMode: number;
};

export type PlaylistType = string[];

export interface IDirectoryItem {
    path: string;
    name: string;
    children?: IDirectoryItem[];
    size: number;
    type: 'directory' | 'file';
    extension?: string;
}

export interface IDirectoryState {
    path: string;
    name: string;
    setDirectoryOpen: Dispatch<SetStateAction<boolean>>;
}

export interface IPlaylistSong {
    index: number;
    name: string;
    path: string;
}

export interface IPlaylist {
    index: number;
    playlistName: string;
    displayName: string;
    path: string;
    songs: IPlaylistSong[];
    isPreset: boolean;
} 

export interface IActivePlaylistItem { index: number; rhythm: string; name: string; extension: string; }

export interface PlayerContextType {
  play: (path: string) => void;
  pause: () => void;
  status: "ready" | "playing" | "paused" | "unknown";
  currentSong: string | null;
  // ... any other existing properties
}