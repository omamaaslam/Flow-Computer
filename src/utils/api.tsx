// websocketService.ts

const WEBSOCKET_API_URL = "ws://192.168.1.254:8888";

let socket: WebSocket | null = null;
let reconnectInterval: number | null = null;
const reconnectDelay = 5000;

const listeners: ((event: MessageEvent) => void)[] = [];

const connectWebSocket = () => {
  if (socket && socket.readyState === WebSocket.OPEN) return;

  console.log("🟡 Attempting to connect WebSocket...");

  socket = new WebSocket(WEBSOCKET_API_URL);

  socket.addEventListener("open", () => {
    console.log("✅ WebSocket connected");

    // Clear reconnect timer if any
    if (reconnectInterval) {
      clearInterval(reconnectInterval);
      reconnectInterval = null;
    }
  });

  socket.addEventListener("message", (event) => {
    listeners.forEach((cb) => cb(event));
  });

  socket.addEventListener("close", () => {
    console.log("❌ WebSocket disconnected. Retrying...");
    attemptReconnect();
  });

  socket.addEventListener("error", (err) => {
    console.error("⚠️ WebSocket error:", err);
    socket?.close(); // Trigger reconnect
  });
};

const attemptReconnect = () => {
  if (reconnectInterval) return;

  reconnectInterval = setInterval(() => {
    connectWebSocket();
  }, reconnectDelay);
};

export const websocketConnection = () => {
  connectWebSocket();
};

export const sendWebSocketMessage = (message: object) => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(message));
  } else {
    console.warn("❌ WebSocket not connected. Message not sent:", message);
  }
};

export const getGlobalStateData = () => {
  sendWebSocketMessage({
    command: "get_global_state_snapshot",
    scope: "full",
  });
};

export const addWebSocketMessageListener = (
  callback: (event: MessageEvent) => void
) => {
  listeners.push(callback);
};

export const removeWebSocketMessageListener = (
  callback: (event: MessageEvent) => void
) => {
  const index = listeners.indexOf(callback);
  if (index !== -1) listeners.splice(index, 1);
};
