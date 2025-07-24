import { getDataFromWebSocketServer } from "./api";

export const getFullGlobalState = (message: object) => {
  getDataFromWebSocketServer(message)
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.error("❌ Error fetching global state:", error);
    });
};

export const getSreamById = (message: object) => {
  getDataFromWebSocketServer(message)
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.error("❌ Error fetching stream by ID:", error);
    });
};

export const getInterfcaeById = (message: object) => {
  getDataFromWebSocketServer(message)
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.error("❌ Error fetching interface by ID:", error);
    });
};

export const getDeviceById = (message: object) => {
  getDataFromWebSocketServer(message)
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.error("❌ Error fetching device by ID:", error);
    });
};
