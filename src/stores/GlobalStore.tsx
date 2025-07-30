import { makeAutoObservable, runInAction } from "mobx";
import { Stream } from "./Stream";
import { createDefaultStreamConfig } from "../types/streamConfig";
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
  }

  public async fetchAndSetGlobalSnapshot() {
    runInAction(() => {
      this.isLoading = true;
    });
    try {
      const data = await getGlobalStateSnapshot();
      console.log("✅ SUCCESS! Data from WebSocket:", data);
      runInAction(() => {
        this.setGlobalSnapshot(data);
        this.isLoading = false;
      });
    } catch (error) {
      console.error("❌ FAILED to get global state snapshot:", error);
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  public initializeStreams(initialStreamData: { id: number; name: string }[]) {
    if (this.streams.length > 0) return;

    const newStreams: Stream[] = [];
    for (const data of initialStreamData) {
      const streamInstance = new Stream(
        data.id,
        data.name,
        createDefaultStreamConfig()
      );
      newStreams.push(streamInstance);
    }
    this.streams = newStreams;
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
