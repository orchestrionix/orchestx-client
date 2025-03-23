import { RefObject } from "react";
import { IActivePlaylistItem } from "../types";
import { RHYTHMS } from "./constants";

// ===============================================================================
// GENERAL UTILS
// ===============================================================================

export const isWebUrl = (url: string) => url && url.startsWith("https");

export const classNames = (...classes: string[]) => {
  return classes.filter(Boolean).join(" ");
};

export const getRefElement = <T>(
  element?: RefObject<Element> | T
): Element | T | undefined | null => {
  if (element && typeof element === "object" && "current" in element) {
    return element.current;
  }

  return element;
};

export const isSSR = !(
  typeof window !== "undefined" && window.document?.createElement
);

export function extractJson(response: string): string {
  // Split the response by newlines
  const lines = response.split('\n');

  // Find the line where the JSON part begins
  let jsonStartIndex = lines.findIndex(line => line.startsWith('{'));

  // If JSON part is found, return it, otherwise return an empty string
  return jsonStartIndex !== -1 ? lines.slice(jsonStartIndex).join('\n') : '';
}

// ===============================================================================
// PLAYER CONTROLE UTILS
// ===============================================================================


export const positionTimeLine = (
  total: number,
  position: number,
  isPlaying: boolean
) => {
  if (isPlaying === false) {
    return 0 + "%";
  }

  const devider = total / 100;

  return position / devider + "%";
};

export function formatTime(milliseconds: number): string {
  // Convert milliseconds to total seconds
  const totalSeconds = Math.floor(milliseconds / 1000);

  // Calculate hours, minutes, and seconds
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  // Format time based on duration
  if (hours > 0) {
    // Format as HH:mm:ss
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  } else {
    // Format as mm:ss
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
}

export function getPath(input: string): string {
  const knownWords = RHYTHMS;
  for (const word of knownWords) {
      if (input.includes(word)) {
          return `../images/newRhythms/${word}.webp`;
      }
  }
  return `../images/newRhythms/Unknown.webp`;
}

// ===============================================================================
// PLAYLIST UTILS
// ===============================================================================

// song string in playlist, not file path
export function parseSongDetailsPlaylist(s?: string): {
  extension: string;
  name: string;
  rhythm: string;
  author?: string;
} {
  const defaultResult = {
    extension: "",
    name: s || "", // Return full string as name for non-DMP files
    rhythm: "",
    author: ""
  };

  try {
    if (!s || s.trim() === "") {
      return defaultResult;
    }

    // Split extension first
    const lastDotIndex = s.lastIndexOf(".");
    if (lastDotIndex === -1) return defaultResult;

    const extension = s.substring(lastDotIndex + 1).trim();
    const fullName = s.substring(0, lastDotIndex).trim();

    // If doesn't start with DMP, return the whole string as name
    if (!fullName.startsWith("DMP_")) {
      return {
        extension,
        name: fullName,
        rhythm: "",
        author: ""
      };
    }

    // Split the DMP parts
    const parts = fullName.split("_");
    if (parts.length < 2) return { ...defaultResult, extension };

    return {
      extension,
      rhythm: (parts[1] || "").replace(/-/g, " "),
      name: (parts[2] || "").replace(/-/g, " "),
      author: (parts[3] || "").replace(/-/g, " "),
    };
  } catch (error) {
    console.error("Error parsing song details:", error);
    return defaultResult;
  }
}

//song strings file path
export function parseSongString(s?: string): {
  index: number;
  rhythm: string;
  name: string;
  extension: string;
  duration: number;
  author?: string;
} {
  const defaultResult = {
    index: 0,
    rhythm: "",
    name: s || "", // Return full string as name for non-DMP files
    extension: "",
    duration: 0,
    author: ""
  };

  try {
    if (!s || s.trim() === "") return defaultResult;

    // Extract duration if present
    const durationMatch = s.match(/\((\d+):(\d+)\)$/);
    const duration = durationMatch 
      ? (parseInt(durationMatch[1]) * 60 + parseInt(durationMatch[2])) * 1000 
      : 0;

    // Extract index if present
    const indexMatch = s.match(/^(\d+)\./);
    const index = indexMatch ? parseInt(indexMatch[1]) : 0;

    // Remove index and duration for file processing
    let fileString = s
      .replace(/^\d+\.\s*/, '')
      .replace(/\s*\(\d+:\d+\)$/, '')
      .trim();

    // Split extension
    const lastDotIndex = fileString.lastIndexOf(".");
    if (lastDotIndex === -1) return defaultResult;

    const extension = fileString.substring(lastDotIndex + 1).trim();
    const fullName = fileString.substring(0, lastDotIndex).trim();

    // If doesn't start with DMP, return the whole string as name
    if (!fullName.startsWith("DMP_")) {
      return {
        index,
        rhythm: "",
        name: fullName,
        extension,
        duration,
        author: ""
      };
    }

    // Split the DMP parts
    const parts = fullName.split("_");
    
    return {
      index,
      rhythm: (parts[1] || "").replace(/-/g, " "),
      name: (parts[2] || "").replace(/-/g, " "),
      extension,
      duration,
      author: (parts[3] || "").replace(/-/g, " ")
    };
  } catch (error) {
    console.error("Error parsing song string:", error);
    return defaultResult;
  }
}

export function parsePlaylistString(songPaths: string[]): IActivePlaylistItem[] {
  return songPaths.map((path, index) => {
    try {
      // Extract filename from path
      const filename = path.split(/[/\\]/).pop() || "";

      // Split extension
      const lastDotIndex = filename.lastIndexOf(".");
      if (lastDotIndex === -1) {
        return {
          index,
          rhythm: "",
          name: filename,
          extension: ""
        };
      }

      const extension = filename.substring(lastDotIndex + 1).trim();
      const fullName = filename.substring(0, lastDotIndex).trim();

      // If doesn't start with DMP, return the whole string as name
      if (!fullName.startsWith("DMP_")) {
        return {
          index,
          rhythm: "",
          name: fullName,
          extension
        };
      }

      // Split the DMP parts
      const parts = fullName.split("_");
      
      return {
        index,
        rhythm: (parts[1] || "").replace(/-/g, " "),
        name: (parts[2] || "").replace(/-/g, " "),
        extension,
        author: (parts[3] || "").replace(/-/g, " ")
      };
    } catch (error) {
      console.error("Error parsing playlist item:", error);
      return {
        index,
        rhythm: "",
        name: path,
        extension: ""
      };
    }
  });
}

export function extractFileNameWithoutExtension(path: string): string {
  // Handle empty or invalid input
  if (!path) return '';
  
  // Get the last part of the path (works with both forward and backward slashes)
  const fileName = path.split(/[/\\]/).pop() || '';
  
  // Remove the extension
  const lastDotIndex = fileName.lastIndexOf('.');
  if (lastDotIndex === -1) return fileName;
  
  return fileName.substring(0, lastDotIndex);
}




