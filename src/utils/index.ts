import { RefObject } from "react";

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

export function parseSongString(s: string): {
  index: number;
  rhythm: string;
  name: string;
  extension: string;
  duration: number;
} {
  if (s.length === 0) {
    return {
      index: 0,
      rhythm: '',
      name: '',
      extension: '',
      duration: 0,
    };
  }

  // Splitting the string at the first period and the dash
  const [indexPart, rest] = s.split('. ', 2);
  const [rhythmPart, nameExtDuration] = rest.split(' -', 2);

  // Extracting the index
  const index = parseInt(indexPart.trim());

  // Trimming the rhythm
  const rhythm = rhythmPart.trim();

  // Extracting the name, extension, and duration
  const parenthesisIndex = nameExtDuration.indexOf('(');
  const nameExt = nameExtDuration.substring(0, parenthesisIndex).trim();
  const durationPart = nameExtDuration.substring(parenthesisIndex);

  // Further splitting name and extension
  const [name, extension] = nameExt.split('.').map(part => part.trim());

  // Splitting and converting the duration
  const durationParts = durationPart.replace('(', '').replace(')', '').split(':');
  const minutes = parseInt(durationParts[0]);
  const seconds = parseInt(durationParts[1]);
  const durationMs = (minutes * 60 + seconds) * 1000;

  return {
    index,
    rhythm,
    name,
    extension,
    duration: durationMs,
  };
}

export function extractJson(response: string): string {
  // Split the response by newlines
  const lines = response.split('\n');

  // Find the line where the JSON part begins
  let jsonStartIndex = lines.findIndex(line => line.startsWith('{'));

  // If JSON part is found, return it, otherwise return an empty string
  return jsonStartIndex !== -1 ? lines.slice(jsonStartIndex).join('\n') : '';
}

export function getPath(input: string): string {
  const knownWords = ['Bayon','Bolero', 'Boogie', 'Fox', 'Mars', 'Mazurka', 'Polka', 'Rumba', 'Step', 'Tango', 'Wals'];
  for (const word of knownWords) {
      if (input.includes(word)) {
          return `../images/newRhythms/${word}.webp`;
      }
  }
  return `../images/newRhythms/Unknown.webp`;
}

// Example usage
console.log(getPath('slowfox'));  // Output: '../images/Fox.jpg'
console.log(getPath('classical')); // Output: '../images/unknown.jpg'

