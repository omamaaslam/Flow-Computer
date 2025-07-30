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
    this._parseAndSetStreams(data);
  }

  private _parseAndSetStreams(snapshotData: any) {
    const rawStreams = snapshotData?.streams;
    if (!rawStreams || typeof rawStreams !== "object") {
      this.streams = [];
      return;
    }

    const newStreams: Stream[] = [];

    for (const streamData of Object.values<any>(rawStreams)) {
      const streamId = parseInt(streamData.stream_id, 10);
      const streamName = streamData.stream_name;

      // Step 1: Create a new Stream instance
      const streamInstance = new Stream(
        streamId,
        streamName,
        createDefaultStreamConfig() // Abhi ke liye default config
      );

      // Step 2: Parse and add the IO Card
      const ioCardData = streamData.io_card;
      if (ioCardData) {
        const ioCardInstance = streamInstance.addIOCard(ioCardData.card_type);

        // Step 3: Parse and add Interfaces to the IO Card
        const interfacesData = ioCardData.interfaces;
        if (interfacesData) {
          for (const interfaceData of Object.values<any>(interfacesData)) {
            ioCardInstance.addInterface(
              interfaceData.interface_id,
              interfaceData.interface_type
            );
            // TODO: Yahan par har interface ke devices ko parse karne ka logic aayega.
            // For example:
            // if (interfaceData.devices) {
            //   for (const deviceData of interfaceData.devices) {
            //     newlyAddedInterface.addDevice(...)
            //   }
            // }
          }
        }
      }
      newStreams.push(streamInstance);
    }

    this.streams = newStreams;
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
