import { makeAutoObservable, runInAction } from "mobx";
import { Stream } from "./Stream";
import { createDefaultStreamConfig } from "../types/streamConfig";
import type { Device } from "./Device";
import { getGlobalStateSnapshot } from "../utils/api";

class GlobalStore {
  public globalSnapshot: any = null;
  public streams: Stream[] = [];
  public isLoading: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  public setGlobalSnapshot(data: any) {
    this.globalSnapshot = data;
    // NOTE: You might want to parse this data and populate
    // this.streams from the real server data here.
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

  async fetchGlobalState() {
    this.isLoading = true;
    try {
      const data = await getGlobalStateSnapshot();
      runInAction(() => {
        this.setGlobalSnapshot(data);
        this.isLoading = false;
      });
      console.log("Global state snapshot received and stored.", data);
    } catch (error) {
      runInAction(() => {
        this.isLoading = false;
      });
      console.error("Failed to fetch global state snapshot:", error);
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
