const WEBSOCKET_API_URL = "ws://192.168.1.254:8888";
const RECONNECT_DELAY = 5000;

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
    console.log("🔌 Attempting to connect WebSocket...");
    socket = new WebSocket(WEBSOCKET_API_URL);

    const handleReconnect = () => {
      connectionPromise = null;
      console.log(
        `❌ WebSocket disconnected. Retrying in ${
          RECONNECT_DELAY / 1000
        } seconds...`
      );
      setTimeout(connectWebSocket, RECONNECT_DELAY);
    };

    socket.onopen = () => {
      console.log("✅ WebSocket connected");
      resolve(socket!);
    };

    socket.onmessage = (event) => {
      listeners.forEach((listener) => listener(event));
    };

    socket.onclose = () => {
      handleReconnect();
    };

    socket.onerror = (error) => {
      console.error("🚨 WebSocket error:", error);
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
    console.warn("❌ WebSocket not connected. Message not sent:", message);
  }
};

export const addListener = (callback: (event: MessageEvent) => void) => {
  listeners.add(callback);
};

export const removeListener = (callback: (event: MessageEvent) => void) => {
  listeners.delete(callback);
};

const sendAndWait = (
  message: object,
  matcher: (response: any) => boolean
): Promise<any> => {
  return new Promise((resolve, reject) => {
    let timeout: number;

    const listener = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        if (matcher(data)) {
          clearTimeout(timeout);
          removeListener(listener);
          resolve(data);
        }
      } catch (error) {
        console.warn("❌ Error parsing WebSocket message:", error, event.data);
      }
    };

    timeout = setTimeout(() => {
      removeListener(listener);
      reject(new Error("⏰ Request timed out"));
    }, 10000);

    addListener(listener);
    sendMessage(message);
  });
};

export const getGlobalStateSnapshot = () => {
  const msg = {
    command: "get_global_state_snapshot",
    scope: "full",
  };
  return sendAndWait(
    msg,
    (res) =>
      res.command === "get_global_state_snapshot" && res.scope === "full"
  );
};

export const getStreamSnapshot = (streamId: string) => {
  const msg = {
    command: "get_global_state_snapshot",
    scope: "stream",
    stream_id: streamId,
  };
  return sendAndWait(
    msg,
    (res) =>
      res.command === "get_global_state_snapshot" &&
      res.scope === "stream" &&
      res.stream_id === streamId
  );
};

export const getIoCardSnapshot = (streamId: string, ioCardId: string) => {
  const msg = {
    command: "get_global_state_snapshot",
    scope: "io_card",
    stream_id: streamId,
    io_card_id: ioCardId,
  };
  return sendAndWait(
    msg,
    (res) =>
      res.command === "get_global_state_snapshot" &&
      res.scope === "io_card" &&
      res.stream_id === streamId &&
      res.io_card_id === ioCardId
  );
};

export const getInterfaceSnapshot = (streamId: string, interfaceId: string) => {
  const msg = {
    command: "get_global_state_snapshot",
    scope: "interface",
    stream_id: streamId,
    interface_id: interfaceId,
  };
  return sendAndWait(
    msg,
    (res) =>
      res.command === "get_global_state_snapshot" &&
      res.scope === "interface" &&
      res.stream_id === streamId &&
      res.interface_id === interfaceId
  );
};

export const getDeviceSnapshot = (
  streamId: string,
  interfaceId: string,
  deviceId: string
) => {
  const msg = {
    command: "get_global_state_snapshot",
    scope: "device",
    stream_id: streamId,
    interface_id: interfaceId,
    device_id: deviceId,
  };
  return sendAndWait(
    msg,
    (res) =>
      res.command === "get_global_state_snapshot" &&
      res.scope === "device" &&
      res.stream_id === streamId &&
      res.interface_id === interfaceId &&
      res.device_id === deviceId
  );
};

export const getDataFromWebSocketServer = (message: object): Promise<any> => {
  return sendAndWait(
    message,
    (res) => res.command === "get_global_state_snapshot"
  );
};