import { makeAutoObservable } from "mobx";
import { Stream } from "./Stream";
import { createDefaultStreamConfig } from "../types/streamConfig";
import type { Device } from "./Device";

class GlobalStore {
  public globalSnapshot: any = null;
  public streams: Stream[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  public setGlobalSnapshot(data: any) {
    this.globalSnapshot = data;
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
