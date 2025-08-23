// src/stores/GlobalStore.ts

import { makeAutoObservable, runInAction, toJS } from "mobx";
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
    // Guard Clause: Ignore invalid or empty stream messages to prevent accidentally wiping the state.
    if (
      !rawStreams ||
      typeof rawStreams !== "object" ||
      Object.keys(rawStreams).length === 0
    ) {
      console.warn(
        "Received snapshot with no streams data. Ignoring update to prevent state wipe."
      );
      return;
    }

    // --- START OF CORRECTED, NON-DESTRUCTIVE LOGIC ---

    // Iterate over the streams in the INCOMING MESSAGE, not the existing state.
    Object.values<any>(rawStreams).forEach((streamData) => {
      // Safety check for malformed data from the server
      if (!streamData.stream_id) {
        console.error("Received stream data without a stream_id", streamData);
        return;
      }

      // Find if this stream already exists in our current state array.
      const existingStream = this.streams.find(
        (s) => s.id === streamData.stream_id
      );

      if (existingStream) {
        // If it exists, simply update it with the new data.
        // MobX will detect the changes within the object and trigger re-renders.
        existingStream.update(streamData);
      } else {
        // If it's a new stream we haven't seen before, create an instance and add it.
        this.streams.push(new Stream(streamData));
      }
    });
    // --- END OF CORRECTED LOGIC ---

    // This separate loop for handling results is fine to keep.
    // It also iterates over the incoming data to update results.
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

          if (activeProfile && activeProfile.result) {
            const resultWithStreamId = {
              ...activeProfile.result,
              stream_id: streamData.stream_id,
            };

            const existingIndex = this.results.findIndex(
              (r) => r.stream_id === streamData.stream_id
            );

            if (existingIndex !== -1) {
              Object.keys(resultWithStreamId).forEach((key) => {
                if (
                  this.results[existingIndex][key] !== resultWithStreamId[key]
                ) {
                  this.results[existingIndex][key] = resultWithStreamId[key];
                }
              });
            } else {
              this.results.push(resultWithStreamId);
            }
          }
        }
      } catch (e) {
        console.error(
          `Error extracting result for stream ${streamData.stream_id}:`,
          e
        );
      }
    });
  }

  public updateResults(incomingData: any) {
    runInAction(() => {
      Object.keys(incomingData).forEach((streamId) => {
        const profilesForStream = incomingData[streamId];
        Object.keys(profilesForStream).forEach((profileId) => {
          const newResultData = profilesForStream[profileId];
          const existingResult = this.results.find(
            (r) => r.stream_id === streamId
          );
          if (existingResult) {
            Object.assign(existingResult, newResultData);
            console.log(`Successfully updated results for stream ${streamId}`);
          } else {
            console.warn(
              `Received a result update for stream ${streamId}, but it doesn't exist in the store yet.`
            );
          }
        });
      });
    });
  }

  public updateDeviceData(liveData: any) {
    runInAction(() => {
      // The live data comes in a structure like { "7": { "HI1": { "HI1T15": ... } } }
      // We need to iterate through it to find the device ID and its data.
      Object.values<any>(liveData).forEach((streamData) => {
        Object.values<any>(streamData).forEach((cardData) => {
          Object.entries<any>(cardData).forEach(([deviceId, deviceData]) => {
            // Find the device instance in our entire store
            const device = this.allDevices.find((d) => d.id === deviceId);
            if (device) {
              // If found, call its internal update method
              device.updateData(deviceData);
            } else {
              // This can happen briefly if data arrives before the full snapshot
              // console.warn(`Received data for unknown device ID: ${deviceId}`);
            }
          });
        });
      });
    });
  }

  public listenForUpdates() {
    const handleMessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        if (data && data.streams) {
          runInAction(() => {
            console.log("Received globalState data:", toJS(data));
            this.setGlobalSnapshot(data);
          });
        } else if (data && data.result) {
          console.log("Received live result update:", data.result);
          this.updateResults(data.result);
        } else if (data && data.data) {
          this.updateDeviceData(data.data);
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

  get volumeDevices(): Device[] {
    return this.allDevices.filter(
      (device) => device.config.device_type === "VolumeDevice"
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
