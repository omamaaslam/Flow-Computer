import { sendMessage, addListener, removeListener } from "./api";

const sendAndWait = (
  message: object,
  matcher: (response: any) => boolean,
  timeoutMs = 10000
): Promise<any> => {
  return new Promise((resolve, reject) => {
    let timeoutId: number;

    const temporaryListener = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        if (matcher(data)) {
          clearTimeout(timeoutId);
          removeListener(temporaryListener);
          resolve(data);
        }
      } catch (error) {
        // Ignore non-JSON messages
      }
    };

    timeoutId = window.setTimeout(() => {
      removeListener(temporaryListener);
      reject(new Error(`Request timed out after ${timeoutMs / 1000}s`));
    }, timeoutMs);

    addListener(temporaryListener);
    sendMessage(message);
  });
};

export const getGlobalStateSnapshot = () => {
  const msg = {
    command: "get_global_state_snapshot",
    scope: "full",
  };
  const isMatch = (res: any) => res && typeof res.streams === "object";
  return sendAndWait(msg, isMatch);
};

export const getStreamSnapshot = (streamId: string) => {
  const msg = {
    command: "get_global_state_snapshot",
    scope: "stream",
    stream_id: streamId,
  };
  const isMatch = (res: any) => res?.streams?.[streamId] !== undefined;
  return sendAndWait(msg, isMatch);
};

export const getIoCardSnapshot = (streamId: string, ioCardId: string) => {
  const msg = {
    command: "get_global_state_snapshot",
    scope: "io_card",
    stream_id: streamId,
    io_card_id: ioCardId,
  };
  const isMatch = (res: any) => res?.io_card?.io_card_id === ioCardId;
  return sendAndWait(msg, isMatch);
};

export const getInterfaceSnapshot = (streamId: string, interfaceId: string) => {
  const msg = {
    command: "get_global_state_snapshot",
    scope: "interface",
    stream_id: streamId,
    interface_id: interfaceId,
  };
  const isMatch = (res: any) => res?.interfaces?.[interfaceId] !== undefined;
  return sendAndWait(msg, isMatch);
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
  const isMatch = (res: any) => res?.devices?.[deviceId] !== undefined;
  return sendAndWait(msg, isMatch);
};


// ==============================================================================================
//                                 UPDATE API START HERE
// ==============================================================================================

export const updateInterface = (
  stream_id: string,
  interface_id: string,
  data: any
) => {
  const msg = {
    command: "get_global_state_snapshot",
    scope: "update_interface",
    stream_id: stream_id,
    interface_id: interface_id,
    data: {
      interface_id: interface_id,
      ...data,
    },
  };
  const isMatch = (res: any) => res?.interfaces?.[interface_id] !== undefined;
  return sendAndWait(msg, isMatch);
};


export const addInterfaceConfig = (
  stream_id: string,
  interface_type: string,
  interface_id: string,
  data: any
) => {
  const msg = {
    command: "get_global_state_snapshot",
    scope: "add_interface",
    stream_id: stream_id,
    interface_type: interface_type,

    data: {
      interface_id,
      ...data,
    },
  };
  const isMatch = (res: any) => res?.interfaces?.[interface_id] !== undefined;
  return sendAndWait(msg, isMatch);
};