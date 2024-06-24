import { IDirectoryItem, IPlaylist, PlaylistType } from "./types";
import { toastError } from "./utils/toasts";

export async function getRemotePlayerState() {
  const response = await fetch(
    "http://localhost:4000/api/get-remote-player-state"
  );
  if (!response.ok) {
    throw new Error("Network response was not ok.");
  }
  const data = await response.json();
  return data;
}

export async function getRemotePlayerActivePlaylist() {
  const response = await fetch("http://localhost:4000/api/get-remote-player-active-playlist");

  if (!response.ok) {
    throw new Error("Failed to fetch all playlists.");
  }

  const data = await response.json();
  return data.playlist;
}

export async function toggelRemotePlayer() {
  const response = await fetch(
    "http://localhost:4000/api/toggle-remote-player"
  );
  if (!response.ok) {
    toastError("Network response was not ok.");
  } else {
    const data = await response.json();
    return data;
  }
}

export async function nextRemotePlayer() {
  const response = await fetch("http://localhost:4000/api/next-remote-player");
  if (!response.ok) {
    toastError("Network response was not ok.");
  } else {
    const data = await response.json();
    return data;
  }
}

export async function prevRemotePlayer() {
  const response = await fetch("http://localhost:4000/api/prev-remote-player");
  if (!response.ok) {
    toastError("Network response was not ok.");
  } else {
    const data = await response.json();
    return data;
  }
}

export async function playItemRemotePlayer(
  songIndex: number
) {
  const response = await fetch("http://localhost:4000/api/play-item-remote-player", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ songIndex }),
  });

  if (!response.ok) {
    toastError("Network response was not ok.");
  } else {
    const data = await response.json();
    return data;
  }
}

export async function selectItemRemotePlayer(
  songIndex: number
) {
  const response = await fetch("http://localhost:4000/api/select-item-remote-player", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ songIndex }),
  });

  if (!response.ok) {
    toastError("Network response was not ok.");
  } else {
    const data = await response.json();
    return data;
  }
}

//=========================================================================================
//=========================================================================================
//=========================================================================================

export async function checkRemoteFileExists(filePath: string) {
  const response = await fetch("http://localhost:4000/api/file-exists", {
    // No more query string
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ path: filePath }),
  });

  if (!response.ok) {
    toastError("Failed to check file existence.");
  }
  const data = await response.json();
  return data.exists; // Returns true/false
}

export async function createRemotePlaylist(
  playlistName: string,
  songs: string[]
) {
  const response = await fetch("http://localhost:4000/api/create-playlist", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ playlistName, songs }),
  });

  if (!response.ok) {
    toastError("Failed to create playlist.");
  }

  const data = await response.json();
  return data.result; // Assuming your server returns the created playlist data
}

export async function getRemoteSongsFromPlaylist(playlistName: string) {
  const response = await fetch(
    "http://localhost:4000/api/get-songs-from-playlist",
    {
      method: "POST", // Change to POST to match your backend
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ playlistName }),
    }
  );

  if (!response.ok) {
    toastError("Failed to fetch songs from playlist.");
  }

  const data = await response.json();
  return data.songs;
}

export async function addRemoteSongToPlaylist(
  playlistName: string,
  songPath: string
) {
  const response = await fetch("http://localhost:4000/api/add-songs-to-playlist", {
    method: "POST", // Change to POST to match your backend
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ playlistName, songPath }),
  });

  if (!response.ok) {
    toastError("Failed to add song to playlist.");
  }
}

export async function deleteRemoteSongFromPlaylistByIndex(
  playlistName: string,
  songIndex: number
) {
  const response = await fetch(
    "http://localhost:4000/api/delete-song-from-playlist-by-index",
    {
      method: "POST", // Change to POST to match your backend
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ playlistName, songIndex }),
    }
  );

  if (!response.ok) {
    toastError("Failed to delete song from playlist.");
  }
}

//=========================================================================================
//=========================================================================================
//=========================================================================================

export async function getRemoteAllPlaylists(): Promise<IPlaylist[]> {
  const response = await fetch("http://localhost:4000/api/get-all-playlists");

  if (!response.ok) {
    toastError("Failed to fetch all playlists.");
  }

  const data = await response.json();
  return data.playlists;
}

export async function getRemoteFileDirectory(): Promise<IDirectoryItem> {
  const response = await fetch("http://localhost:4000/api/get-file-directory");

  if (!response.ok) {
    toastError("Failed to fetch file directory.");
  }

  const data = await response.json();
  return data;
}
