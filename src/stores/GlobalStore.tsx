// src/stores/GlobalStore.ts

import { makeAutoObservable, runInAction } from "mobx";
import { Stream } from "./Stream"; // Assuming this file exists
import type { Device } from "./Device"; // Assuming this file exists
import { addListener } from "../utils/api"; // Assuming this file exists

class GlobalStore {
  public globalSnapshot: any = null;
  public streams: Stream[] = [];
  public isLoading: boolean = true;
  public results: any[] = [];
  constructor() {
    makeAutoObservable(this);
  }

  public setGlobalSnapshot(data: any) {
    this.globalSnapshot = data;
    this._updateStreams(data);

    if (this.isLoading) {
      this.isLoading = false;
    }
  }

  private _updateStreams(snapshotData: any) {
    const rawStreams = snapshotData?.streams;
    if (!rawStreams || typeof rawStreams !== "object") {
      this.streams = [];
      return;
    }

    const incomingStreamIds = Object.keys(rawStreams);

    Object.values<any>(rawStreams).forEach((streamData) => {
      try {
        const calcProfile = streamData.stream_config?.calculation_profile;
        if (
          calcProfile &&
          calcProfile.active_profile_id &&
          calcProfile.profiles
        ) {
          const activeProfileId = calcProfile.active_profile_id;
          const activeProfile = calcProfile.profiles[activeProfileId];
          console.warn({
            activeProfileId,
            activeProfile,
            streamId: streamData.stream_id,
          });

          if (activeProfile && activeProfile.result) {
            const resultWithStreamId = {
              ...activeProfile.result,
              stream_id: streamData.stream_id,
            };
            this.results.push(resultWithStreamId);
          }
        }
      } catch (e) {
        console.error(
          `Error extracting result for stream ${streamData.stream_id}:`,
          e
        );
      }

      const existingStream = this.streams.find(
        (s) => s.id === streamData.stream_id
      );

      if (existingStream) {
        existingStream.update(streamData);
      } else {
        this.streams.push(new Stream(streamData));
      }
    });

    this.streams = this.streams.filter((s) => incomingStreamIds.includes(s.id));
  }

  public listenForUpdates() {
    console.log("Listening for updates from the websocket server...");

    const handleMessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        if (data && data.streams) {
          runInAction(() => {
            console.log("Received globalState data:", data);
            this.setGlobalSnapshot(data);
          });
        } else {
          console.log("Ignoring non-snapshot message at global level:", data);
        }
      } catch (error) {
        console.error(
          "WebSocket se aaye data ko parse karne mein error:",
          error
        );
      }
    };

    addListener(handleMessage);
  }

  // --- Getters remain unchanged ---
  get allDevices(): Device[] {
    return this.streams.flatMap((stream) =>
      stream.ioCards.flatMap((card) =>
        card.interfaces.flatMap((iface) => iface.devices)
      )
    );
  }

  get temperatureDevices(): Device[] {
    return this.allDevices.filter(
      (device) => device.config.device_type === "TemperatureDevice"
    );
  }

  get pressureDevices(): Device[] {
    return this.allDevices.filter(
      (device) => device.config.device_type === "PressureDevice"
    );
  }

  get get_all_di_devices(): Device[] {
    return this.streams.flatMap((stream) =>
      stream.ioCards.flatMap((card) =>
        card.interfaces
          .filter((iface) => iface.interface_id.startsWith("DI"))
          .flatMap((iface) => iface.devices)
      )
    );
  }
}

const globalStore = new GlobalStore();
export default globalStore;
