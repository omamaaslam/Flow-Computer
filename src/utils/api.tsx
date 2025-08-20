const WEBSOCKET_API_URL = "ws://192.168.1.254:8881";
// const WEBSOCKET_API_URL = "ws://192.168.1.110:8887";
// const WEBSOCKET_API_URL = "ws://192.168.1.98:7000";
const RECONNECT_DELAY = 1000;

let socket: WebSocket | null = null;
const listeners = new Set<(event: MessageEvent) => void>();
let connectionPromise: Promise<WebSocket> | null = null;

export const connectWebSocket = (): Promise<WebSocket> => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    return Promise.resolve(socket);
  }

  if (connectionPromise) {
    return connectionPromise;
  }

  connectionPromise = new Promise((resolve, reject) => {
    console.log("Attempting to connect WebSocket...");
    socket = new WebSocket(WEBSOCKET_API_URL);

    socket.onopen = () => {
      console.log("WebSocket connected");
      resolve(socket!);
    };

    socket.onmessage = (event) => {
      listeners.forEach((listener) => listener(event));
    };

    socket.onclose = () => {
      console.log(
        `WebSocket disconnected. Retrying in ${
          RECONNECT_DELAY / 10000
        } seconds...`
      );
      connectionPromise = null;
      socket = null;
      setTimeout(connectWebSocket, RECONNECT_DELAY);
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
      connectionPromise = null;
      socket?.close();
      reject(error);
    };
  });

  return connectionPromise;
};

export const sendMessage = (message: object) => {
  if (socket?.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(message));
  } else {
    console.warn("WebSocket not connected. Message not sent:", message);
  }
};

export const addListener = (callback: (event: MessageEvent) => void) => {
  listeners.add(callback);
};

export const removeListener = (callback: (event: MessageEvent) => void) => {
  listeners.delete(callback);
};