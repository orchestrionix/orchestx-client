import { IActivePlaylistItem, IDirectoryItem, IPlaylist, PlaylistType } from "./types";
import { toastError } from "./utils/toasts";

export interface Settings {
  NAME: string;
  PLAYER_DIRECTORY: string;
  MUSIC_DIRECTORY: string;
  PLAYER_PLAYLIST_DIRECTORY: string;
}

export const API_BASE_URL = `${window.location.protocol}//${window.location.hostname}:4000`;

export async function getRemotePlayerState() {
  const response = await fetch(
    `${API_BASE_URL}/api/get-remote-player-state`
  );
  if (!response.ok) {
    throw new Error("Network response was not ok.");
  }
  const data = await response.json();
  return data;
}

export async function getRemotePlayerActivePlaylist(): Promise<{
  playlist: string[];
  playlistName: string;
}> {
  const response = await fetch(`${API_BASE_URL}/api/get-remote-player-active-playlist`);

  if (!response.ok) {
    throw new Error("Failed to fetch all playlists.");
  }

  const data = await response.json();
  
  return {
    playlist: data.playlist,
    playlistName: data.playlistName || "Unknown Playlist",
  };
}

export async function toggelRemotePlayer() {
  const response = await fetch(
    `${API_BASE_URL}/api/toggle-remote-player`
  );
  if (!response.ok) {
    toastError("Network response was not ok.");
  } else {
    const data = await response.json();
    return data;
  }
}

export async function nextRemotePlayer() {
  const response = await fetch(`${API_BASE_URL}/api/next-remote-player`);
  if (!response.ok) {
    toastError("Network response was not ok.");
  } else {
    const data = await response.json();
    return data;
  }
}

export async function prevRemotePlayer() {
  const response = await fetch(`${API_BASE_URL}/api/prev-remote-player`);
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
  const response = await fetch(`${API_BASE_URL}/api/play-item-remote-player`, {
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
  const response = await fetch(`${API_BASE_URL}/api/select-item-remote-player`, {
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
  const response = await fetch(`${API_BASE_URL}/api/file-exists`, {
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


// GOOD ERROR HANDLING, COPY THIS FOR OTHER FUNCTIONS
export async function createRemotePlaylist(
  playlistName: string,
  songs: string[]
) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/create-playlist`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ playlistName, songs }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to create playlist.");
    }

    return data.result;
  } catch (error: any) {
    throw error;
  }
}


export async function getRemoteSongsFromPlaylist(playlistName: string) {
  const response = await fetch(
    `${API_BASE_URL}/api/get-songs-from-playlist`,
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
  const response = await fetch(`${API_BASE_URL}/api/add-songs-to-playlist`, {
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
    `${API_BASE_URL}/api/delete-song-from-playlist-by-index`,
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

export async function getRemoteAllPlaylists(): Promise<IPlaylist[]> {
  const response = await fetch(`${API_BASE_URL}/api/get-all-playlists`);

  if (!response.ok) {
    toastError("Failed to fetch all playlists.");
  }

  const data = await response.json();
  return data.playlists;
}

export async function getRemoteFileDirectory(): Promise<IDirectoryItem> {
  const response = await fetch(`${API_BASE_URL}/api/get-file-directory`);

  if (!response.ok) {
    toastError("Failed to fetch file directory.");
  }

  const data = await response.json();
  return data;
}

export async function deleteRemotePlaylist(playlistName: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/delete-playlist`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ playlistName }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to delete playlist.");
    }

    return data.message;
  } catch (error: any) {
    throw error;
  }
}

export async function updateRemotePlaylist(playlistName: string, songs: string[]) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/update-playlist`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ playlistName, songs }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to update playlist.");
    }

    return data.message;
  } catch (error: any) {
    throw error;
  }
}

export async function renameRemotePlaylist(oldPlaylistName: string, newPlaylistName: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/rename-playlist`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ oldPlaylistName, newPlaylistName }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to rename playlist.");
    }

    return data.message;
  } catch (error: any) {
    throw error;
  }
}

export async function loadPlaylistRemotePlayer(playlistPath: string, playIndex: number) {
  try {
    console.log("Loading playlist on remote player:", playlistPath, playIndex);

    const response = await fetch(`${API_BASE_URL}/api/load-playlist-remote-player`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ path: playlistPath, playIndex: playIndex }),
    });

    if (!response.ok) {
      throw new Error("Failed to load playlist on remote player.");
    }
  } catch (error: any) {
    toastError(error.message);
    throw error;
  }
}

export async function getRemoteSettings(): Promise<Settings> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/settings`);
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch settings.");
    }
    
    return data;
  } catch (error: any) {
    toastError(error.message);
    throw error;
  }
}

export async function updateRemoteSetting(key: keyof Settings, value: string): Promise<{
  message: string;
  settings: Settings;
}> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/settings/${key}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ value }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Failed to update setting: ${key}`);
    }

    return data;
  } catch (error: any) {
    toastError(error.message);
    throw error;
  }
}

export async function updateRemoteSettings(settings: Partial<Settings>): Promise<{
  message: string;
  settings: Settings;
}> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/settings`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(settings),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to update settings');
    }

    return data;
  } catch (error: any) {
    toastError(error.message);
    throw error;
  }
}

//=========================================================================================
//=========================================================================================
//=========================================================================================

export async function updateVolume(volume: number) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/update-volume`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ volume }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to update volume.");
    }

    return data;
  } catch (error: any) {
    toastError(error.message);
    throw error;
  }
}
