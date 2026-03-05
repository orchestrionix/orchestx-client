import { IActivePlaylistItem, IDirectoryItem, IPlaylist, PlaylistType } from "./types";
import { toastError } from "./utils/toasts";

export interface Settings {
  NAME: string;
  PLAYER_DIRECTORY: string;
  MUSIC_DIRECTORY: string;
  PLAYER_PLAYLIST_DIRECTORY: string;
}

export const API_BASE_URL = `${window.location.protocol}//${window.location.hostname}:4000`;

const CENTRAL_HUB_URL = 'https://orchestx-terminal-production.up.railway.app';

export async function getPresenceEnabled(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/presence-enabled`);
    if (!response.ok) return false;
    const data = await response.json();
    return !!data.enabled;
  } catch {
    return false;
  }
}

export { CENTRAL_HUB_URL };

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
  order: number[];
  file: string;
}> {
  const response = await fetch(`${API_BASE_URL}/api/get-remote-player-active-playlist`);

  if (!response.ok) {
    throw new Error("Failed to fetch all playlists.");
  }

  const data = await response.json();
  const playlist = data.playlist ?? [];
  const rawOrder = data.order ?? data.Order ?? data.shuffleOrder;
  let order: number[];

  if (Array.isArray(rawOrder) && rawOrder.length === playlist.length) {
    order = rawOrder.map((i: number | string) => Number(i));
    const min = Math.min(...order);
    const max = Math.max(...order);
    const n = order.length;
    if (min === 1 && max === n) {
      order = order.map((i) => i - 1);
    }
  } else {
    order = playlist.map((_: unknown, i: number) => i);
  }

  return {
    playlist,
    order,
    file: data.file ?? "",
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
//========================= P R E S E T   P L A Y L I S T S ==============================
//=========================================================================================

export async function getRemoteAllPresetPlaylists(): Promise<IPlaylist[]> {
  const response = await fetch(`${API_BASE_URL}/api/get-all-preset-playlists`);

  if (!response.ok) {
    toastError("Failed to fetch preset playlists.");
  }

  const data = await response.json();
  return data.playlists;
}

export async function addRemoteSongToPresetPlaylist(
  presetIndex: number,
  songPath: string
) {
  const response = await fetch(`${API_BASE_URL}/api/add-song-to-preset-playlist`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ presetIndex, songPath }),
  });

  if (!response.ok) {
    toastError("Failed to add song to preset playlist.");
  }
}

export async function deleteRemoteSongFromPresetPlaylistByIndex(
  presetIndex: number,
  songIndex: number
) {
  const response = await fetch(
    `${API_BASE_URL}/api/delete-song-from-preset-playlist-by-index`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ presetIndex, songIndex }),
    }
  );

  if (!response.ok) {
    toastError("Failed to delete song from preset playlist.");
  }
}

export async function updateRemotePresetPlaylist(presetIndex: number, songs: string[]) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/update-preset-playlist`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ presetIndex, songs }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to update preset playlist.");
    }

    return data.message;
  } catch (error: any) {
    throw error;
  }
}

/**
 * Get preset index from playlist name (e.g., "PresetPlaylist0" -> 0)
 * Returns -1 if not a preset playlist
 */
export function getPresetIndexFromName(playlistName: string): number {
  const match = playlistName.match(/^PresetPlaylist(\d+)$/);
  if (!match) return -1;
  const index = parseInt(match[1], 10);
  if (index < 0 || index > 9) return -1;
  return index;
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

export async function setVolumeRemotePlayer(volume: number) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/set-volume-remote-player`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ volume }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to set volume on remote player.");
    }

    return data;
  } catch (error: any) {
    toastError(error.message);
    throw error;
  }
}

export async function setViewModeRemotePlayer(viewMode: number) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/set-view-mode-remote-player`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ viewMode }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to set view mode on remote player.");
    }

    return data;
  } catch (error: any) {
    toastError(error.message);
    throw error;
  }
}
