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
        console.log(error);
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

export const get_result = () => {
  const msg = {
    command: "ram_live_data",
  };

  const isMatch = (res: any) => {
    if (res?.streams !== undefined) {
      console.log("✅ Matched full data snapshot (ram_live_data).");
      return true;
    }
    return false;
  };

  return sendAndWait(msg, isMatch);
};

// ==============================================================================================
//                                 ADD / UPDATE API START HERE
// ==============================================================================================

export const updateInterface = (
  stream_id: string,
  interface_id: string,
  data: any
) => {
  const msg = {
    command: "update_interface_configuration",
    stream_id: stream_id,
    interface_id: interface_id,
    data: {
      interface_id: interface_id,
      ...data,
    },
  };

  const isMatch = (res: any) => {
    if (
      res?.success &&
      typeof res.success === "string" &&
      res.success.includes(`'${interface_id}'`)
    ) {
      console.log(`✅ Matched success message for ${interface_id}`);
      return true;
    }
    if (
      res?.streams?.[stream_id]?.io_card?.interfaces?.[interface_id] !==
      undefined
    ) {
      console.log(`✅ Matched full snapshot for ${interface_id}`);
      return true;
    }

    return false;
  };

  return sendAndWait(msg, isMatch);
};

export const addInterfaceConfig = (
  stream_id: string,
  interface_type: string,
  interface_id: string,
  data: any
) => {
  const msg = {
    command: "set_interface_configuration",
    stream_id: stream_id,
    interface_id: interface_id,
    interface_type: interface_type,
    data: {
      interface_id,
      ...data,
    },
  };

  const isMatch = (res: any) => {
    if (
      res?.success &&
      typeof res.success === "string" &&
      res.success.includes(`'${interface_id}'`)
    ) {
      console.log(`✅ Matched ADD success message for ${interface_id}`);
      return true;
    }

    if (
      res?.streams?.[stream_id]?.io_card?.interfaces?.[interface_id] !==
      undefined
    ) {
      console.log(`✅ Matched full snapshot for ADD on ${interface_id}`);
      return true;
    }

    return false;
  };

  return sendAndWait(msg, isMatch);
};

export const addDevice = (
  stream_id: string,
  interface_id: string,
  device_type: string,
  device_data: any,
  device_id: string
) => {
  const msg = {
    command: "set_device_configuration",
    stream_id: stream_id,
    interface_id: interface_id,
    device_type: device_type,
    device_id: device_id,
    data: {
      ...device_data,
      device_id,
    },
  };

  const isMatch = (res: any) => {
    if (
      res?.success &&
      typeof res.success === "string" &&
      res.success.includes(`'${device_id}'`)
    ) {
      console.log(`✅ Matched ADD DEVICE success message for ${device_id}`);
      return true;
    }

    const device =
      res?.streams?.[stream_id]?.io_card?.interfaces?.[interface_id]?.devices?.[
        device_id
      ];

    if (device !== undefined) {
      console.log(
        `✅ Matched full snapshot for ADD DEVICE on ${interface_id} with device ${device_id}`
      );
      return true;
    }

    return false;
  };

  return sendAndWait(msg, isMatch);
};

export const updateDevice = (
  stream_id: string,
  interface_id: string,
  device_id: string,
  device_data: any
) => {
  const msg = {
    command: "update_device_configuration",
    stream_id: stream_id,
    interface_id: interface_id,
    device_id: device_id,
    data: {
      ...device_data,
      device_id: device_id,
    },
  };

  const isMatch = (res: any) => {
    if (
      res?.success &&
      typeof res.success === "string" &&
      res.success.includes(`'${device_id}'`)
    ) {
      console.log(`✅ Matched UPDATE DEVICE success message for ${device_id}`);
      return true;
    }

    const device =
      res?.streams?.[stream_id]?.io_card?.interfaces?.[interface_id]?.devices?.[
        device_id
      ];

    if (device !== undefined) {
      console.log(
        `✅ Matched full snapshot for UPDATE DEVICE on ${interface_id} with device ${device_id}`
      );
      return true;
    }

    return false;
  };

  return sendAndWait(msg, isMatch);
};

// ==============================================================================================
//                                 STREAM CONFIGURATIONS API
// ==============================================================================================

const createStreamConfigMatcher = (streamId: string, configKey: string) => {
  return (res: any) => {
    if (
      res?.success &&
      typeof res.success === "string" &&
      res.success.includes(`stream '${streamId}'`)
    ) {
      return true;
    }
    if (res?.streams?.[streamId]?.calculator?.[configKey] !== undefined) {
      return true;
    }
    return false;
  };
};

export const setTemperatureConfig = (streamId: string, data: any) => {
  const msg = {
    command: "set_temperature_config",
    stream_id: streamId,
    data: data,
  };
  const isMatch = createStreamConfigMatcher(streamId, "temperature_config");
  return sendAndWait(msg, isMatch);
};

export const setPressureConfig = (streamId: string, data: any) => {
  const msg = {
    command: "set_pressure_config",
    stream_id: streamId,
    data: data,
  };
  const isMatch = createStreamConfigMatcher(streamId, "pressure_config");
  return sendAndWait(msg, isMatch);
};

export const setFlowRateConfig = (streamId: string, data: any) => {
  const msg = {
    command: "set_flow_rate_config",
    stream_id: streamId,
    data: data,
  };
  const isMatch = createStreamConfigMatcher(streamId, "flow_rate_config");
  return sendAndWait(msg, isMatch);
};

export const setVolumeConfig = (
  streamId: string,
  volumeType: string,
  data: any
) => {
  const msg = {
    command: "set_volume_config",
    stream_id: streamId,
    volume_type: volumeType,
    data: data,
  };
  const isMatch = createStreamConfigMatcher(streamId, "volume_configuration");
  return sendAndWait(msg, isMatch);
};

export const setCompressibilityConfig = (streamId: string, data: any) => {
  const msg = {
    command: "set_compressibility_config",
    stream_id: streamId,
    data: data,
  };
  const isMatch = createStreamConfigMatcher(
    streamId,
    "compressibility_kfactor_config"
  );
  return sendAndWait(msg, isMatch);
};
