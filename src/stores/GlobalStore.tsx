// src/stores/GlobalStore.ts

import { makeAutoObservable, runInAction } from "mobx";
import { Stream } from "./Stream";
import type { Device } from "./Device";
import { addListener } from "../utils/api"; // Sirf addListener import karein

class GlobalStore {
  public globalSnapshot: any = null;
  public streams: Stream[] = [];
  public isLoading: boolean = true; // App shuru mein loading state mein hogi

  constructor() {
    makeAutoObservable(this);
  }

  public setGlobalSnapshot(data: any) {
    this.globalSnapshot = data;
    this._parseAndSetStreams(data);

    // Pehli baar data milne par loading state ko false karein
    if (this.isLoading) {
      this.isLoading = false;
    }
  }

  private _parseAndSetStreams(snapshotData: any) {
    const rawStreams = snapshotData?.streams;
    if (!rawStreams || typeof rawStreams !== "object") {
      this.streams = [];
      return;
    }
    this.streams = Object.values<any>(rawStreams).map(
      (streamData) => new Stream(streamData)
    );
  }

  // YEH NAYA AUR AHEM FUNCTION HAI
  // Yeh WebSocket se aane walay har message ko sunega
  public listenForUpdates() {
    console.log("GlobalStore ab WebSocket updates ko sun raha hai...");

    const handleMessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        console.log("⬇️ WebSocket se naya data mila:", data);

        // MobX store ko update karein
        runInAction(() => {
          this.setGlobalSnapshot(data);
        });
      } catch (error) {
        console.error(
          "WebSocket se aaye data ko parse karne mein error:",
          error
        );
      }
    };

    // api.ts ke listener ko subscribe karein
    addListener(handleMessage);
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
