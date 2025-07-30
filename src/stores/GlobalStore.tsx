// src/stores/GlobalStore.ts

import { makeAutoObservable, runInAction } from "mobx";
import { Stream } from "./Stream";
import type { Device } from "./Device";
import { getGlobalStateSnapshot } from "../utils/services";

class GlobalStore {
  public globalSnapshot: any = null;
  public streams: Stream[] = [];
  public isLoading: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  public setGlobalSnapshot(data: any) {
    this.globalSnapshot = data;
    this._parseAndSetStreams(data);
  }

  private _parseAndSetStreams(snapshotData: any) {
    const rawStreams = snapshotData?.streams;
    if (!rawStreams || typeof rawStreams !== "object") {
      this.streams = [];
      return;
    }

    // Naye tareeqe se streams ko parse karein
    this.streams = Object.values<any>(rawStreams).map(
      (streamData) => new Stream(streamData) // Stream constructor ko poora data dein
    );
  }

  public async fetchAndSetGlobalSnapshot() {
    runInAction(() => {
      this.isLoading = true;
    });
    try {
      const data = await getGlobalStateSnapshot();
      console.log("SUCCESS! Data from WebSocket:", data);
      runInAction(() => {
        this.setGlobalSnapshot(data);
        this.isLoading = false;
      });
    } catch (error) {
      console.error("FAILED to get global state snapshot:", error);
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  get allDevices(): Device[] {
    return this.streams.flatMap((stream) =>
      stream.ioCards.flatMap((card) =>
        card.interfaces.flatMap((iface) => iface.devices)
      )
    );
  }
}

const globalStore = new GlobalStore();
export default globalStore;