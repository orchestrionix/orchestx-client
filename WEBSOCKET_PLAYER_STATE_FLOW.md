# WebSocket Player State Flow

This document describes the full flow of the WebSocket that feeds the React client with real-time data about the currently playing song, including all TypeScript types and message shapes.

---

## 1. Overview

| Layer | Role |
|-------|------|
| **DecapPlayer** | Virtual music player (TCP server on `127.0.0.1:12340`). Source of truth for playback state. |
| **OrchestX Server** | Express + WebSocket server. Polls DecapPlayer via TCP every 500ms and pushes state to connected clients. |
| **OrchestX Client** | React app. Connects to the server WebSocket, receives state, and drives UI (progress bar, play/pause, current song). |

```
DecapPlayer (TCP:12340)  ←── GetState  ──  Express Server  ──WS every 500ms──►  React Client
```

---

## 2. Server-Side Flow

### 2.1 WebSocket server setup

- **File:** `orchestx-server/src/app.ts`
- The HTTP server is created with `createServer(app)`.
- `initializeWebSocket(server)` is called so the WebSocket server shares the same port as HTTP (4000).

### 2.2 WebSocket initialization

- **File:** `orchestx-server/src/routes/index.ts`
- `initializeWebSocket(server)` creates a `WebSocket.Server` attached to the HTTP server.
- On each **connection**:
  - A `setInterval(500)` is started.
  - Every 500ms the server calls `TCPRemotePlayerState()` and sends the result to that client as JSON: `ws.send(JSON.stringify(state))`.
  - On **close**, the interval is cleared.

### 2.3 Fetching state from DecapPlayer (TCP)

- **File:** `orchestx-server/src/utils/state_and_controles.ts`
- **Function:** `TCPRemotePlayerState(): Promise<any>`
- Opens a TCP socket to `TCP_HOST` (127.0.0.1) and `TCP_PORT` (12340).
- Sends the command: `"GetState\n"`.
- On **data**: parses the response with `extractJson(data.toString())` and resolves with that object.
- On **error**: resolves with a fallback error state (so the client still gets a valid payload):

```ts
{
  state: {
    status: "error",
    title: "No connection to remote player",
    itemId: 0,
    length: 0,
    position: 0,
    volume: 0,
    viewMode: 0,
  }
}
```

- **File:** `orchestx-server/src/utils/index.ts`
- `extractJson(data: string): any` — wraps `JSON.parse(data)`; on parse failure returns `{}`.

The DecapPlayer TCP response is expected to be a JSON object that contains a **`state`** property (see types below). The server does not define a formal type; it forwards whatever it gets (or the error object above).

---

## 3. Data Types

### 3.1 Message envelope (WebSocket payload)

The server sends a **single JSON object** per message. The client uses the **`state`** property; **`serverTime`** is optional for interpolation.

```ts
// What the server sends (conceptual)
interface WebSocketPlayerMessage {
  serverTime?: number;  // Server timestamp (ms) when state was captured; used for interpolation
  state: PlayerStateType;
}
```

So the raw WebSocket message is: `JSON.stringify({ serverTime: Date.now(), state: { ... } })`. The server uses a single non-overlapping poll loop, broadcasts to all clients with backpressure checks, and does not use per-message compression.

### 3.2 Player state (TypeScript type on the client)

- **File:** `orchestx-client/src/types/index.ts`

```ts
export type PlayerStateType = {
  status: "ready" | "playing" | "paused" | "unknown" | "error";
  title: string;
  itemId: number;
  length: number;
  position: number;
  volume: number;
  viewMode: number;
};
```

| Field      | Type   | Description |
|-----------|--------|-------------|
| `status`  | string | Playback state: `"ready"` \| `"playing"` \| `"paused"` \| `"unknown"` \| `"error"`. |
| `title`   | string | Current track identifier (e.g. filename or "DMP_Rhythm_Name.ext"). Used for display and parsing (e.g. rhythm image). |
| `itemId`  | number | 0-based index of the current track in the **display order** (shuffled list). Used for “current item” highlight and play position. |
| `length`  | number | Duration of the current track in **milliseconds**. |
| `position`| number | Current playback position in **milliseconds**. |
| `volume`  | number | Volume level (0–65535). Used on Volume page. |
| `viewMode`| number | Display view mode (0–5). Used on Views page. |

---

## 4. Client-Side Flow

### 4.1 Connection and context

- **File:** `orchestx-client/src/playerProvider.tsx`
- **WebSocket URL:** `ws://${window.location.hostname}:4000` (same host, port 4000).
- The app wraps the tree in `PlayerProvider`, which:
  - Opens the WebSocket on mount.
  - On **message**: `const data = JSON.parse(event.data)`; if `data?.state` exists, calls `setPlayerState(data.state)`.
  - Exposes `playerState`, `isConnected`, and `connectionError` via `PlayerContext`.
- Reconnection uses exponential backoff; “stale” detection (no message for 15s) triggers a silent reconnect without showing the connection-lost overlay.

### 4.2 Context type (provider)

- **File:** `orchestx-client/src/playerProvider.tsx`

```ts
interface PlayerContextType {
  playerState: PlayerStateType | null;
  isConnected: boolean;
  connectionError: boolean;
}
```

### 4.3 Where `playerState` is used

| Location | Usage |
|----------|--------|
| **Layout.tsx** | `playerState?.status === "error"` and `connectionError` to show “Player Connection Lost” overlay. |
| **components/player/index.tsx** | Progress bar, play/pause, current song (title/rhythm), timeline. Uses `usePlayerProgress({ playerState })` for smooth progress. |
| **hooks/usePlayerProgress.ts** | Interpolates `position` at 60fps between WebSocket updates; uses `playerState.position`, `playerState.length`, `playerState.status`, `playerState.itemId`. |
| **pages/home/index.tsx** | “Now Playing” list; highlights current row with `playerState?.itemId === index`; playlist and play/select by index. |
| **pages/volume/index.tsx** | Reads `playerState.volume` for display. |
| **pages/views/index.tsx** | Reads `playerState.viewMode` for the active view. |

---

## 5. Smooth progress (client-side interpolation)

- **File:** `orchestx-client/src/hooks/usePlayerProgress.ts`
- WebSocket updates arrive every ~500ms; using them directly would make the progress bar jump.
- The hook:
  - Stores the last server `position` and timestamp when `playerState` updates.
  - When `status === 'playing'`, uses `requestAnimationFrame` to interpolate: `position = lastServerPosition + (now - lastServerTimestamp)`.
  - Clamps to `playerState.length`.
  - When paused or not playing, uses the server `position` as-is.
  - Resets when `playerState.itemId` changes (new track).
- The player component uses this **smooth position** for the progress bar width and time display.

---

## 6. Summary

- **Server:** Polls DecapPlayer over TCP with `GetState\n` every 500ms per WebSocket client and sends `JSON.stringify(state)` where `state` has at least a `state` property (or the error fallback with the same shape).
- **Client:** Connects to `ws://hostname:4000`, parses each message, and sets `playerState = data.state` (type `PlayerStateType`). The rest of the app consumes `playerState` from context for progress, play/pause, current song, volume, and view mode; the progress bar is smoothed with `usePlayerProgress`.

All data sent over the WebSocket is the **player state object** described by `PlayerStateType` above, wrapped in an object that has a **`state`** property.
