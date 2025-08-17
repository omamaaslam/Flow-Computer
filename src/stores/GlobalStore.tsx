// src/stores/GlobalStore.ts

import { makeAutoObservable, runInAction } from "mobx";
import { Stream } from "./Stream";
import type { Device } from "./Device";
import { addListener } from "../utils/api";
import { Results } from "./Results";

class GlobalStore {
  public globalSnapshot: any = null;
  public streams: Stream[] = [];
  public isLoading: boolean = true;
  public resultsStore = new Results();
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
      const existingStream = this.streams.find(
        (s) => s.id === streamData.stream_id
      );

      if (existingStream) {
        // Agar stream pehle se hai, to use naye data se UPDATE karo
        // Is se MobX sirf is object se juray components ko re-render karega
        existingStream.update(streamData);
      } else {
        // Agar stream naya hai, to usay list mein ADD karo
        this.streams.push(new Stream(streamData));
      }
    });

    // Step 2 (Zaroori): Un streams ko hata do jo ab server se nahi aa rahe
    // Taake UI mein purane (deleted) streams na dikhein.
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
        }
        // Handle result messages
        else if (data && data.result) {
          runInAction(() => {
            // ===================================================================
            // ▼▼▼ CHOOSE THE METHOD THAT MATCHES YOUR SCENARIO ▼▼▼
            // ===================================================================

            // **Use this for Scenario 1 (Log of Events):**
            // this.resultsStore.addResult(data.result);

            // **Use this for Scenario 2 (Updating/Overwriting existing items):**
            this.resultsStore.updateOrAddResult(data.result);

            // ===================================================================
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
