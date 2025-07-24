const WEBSOCKET_API_URL = "ws://192.168.1.254:8888";
const RECONNECT_DELAY = 5000;

let socket: WebSocket | null = null;
const listeners = new Set<(event: MessageEvent) => void>();

export const connectWebSocket = () => {
  if (
    socket &&
    (socket.readyState === WebSocket.OPEN ||
      socket.readyState === WebSocket.CONNECTING)
  ) {
    return;
  }

  console.log("🔌 Attempting to connect WebSocket...");
  socket = new WebSocket(WEBSOCKET_API_URL);

  socket.onopen = () => console.log("✅ WebSocket connected");

  socket.onmessage = (event) => {
    listeners.forEach((listener) => listener(event));
  };

  socket.onclose = () => {
    console.log(
      `❌ WebSocket disconnected. Retrying in ${
        RECONNECT_DELAY / 1000
      } seconds...`
    );
    setTimeout(connectWebSocket, RECONNECT_DELAY);
  };

  socket.onerror = (error) => {
    console.error("🚨 WebSocket error:", error);
    socket?.close();
  };
};

export const sendMessage = (message: object) => {
  if (socket?.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(message));
  } else {
    console.warn("❌ WebSocket not connected. Message not sent:", message);
  }
};

export const addListener = (callback: (event: MessageEvent) => void) => {
  listeners.add(callback);
};

export const removeListener = (callback: (event: MessageEvent) => void) => {
  listeners.delete(callback);
};

export const getDataFromWebSocketServer = (message: object): Promise<any> => {
  return new Promise((resolve, reject) => {
    const temporaryListener = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        if (data.command === "get_global_state_snapshot") {
          resolve(data);
          removeListener(temporaryListener);
        }
      } catch (error) {
        console.warn("❌ Error parsing WebSocket message:", error, event.data);
      }
    };

    const timeout = setTimeout(() => {
      removeListener(temporaryListener);
      reject(new Error("Request for global state timed out."));
    }, 10000);

    addListener(temporaryListener);

    sendMessage(message);
  });
};
