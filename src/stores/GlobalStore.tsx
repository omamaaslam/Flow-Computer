// src/stores/GlobalStore.ts

import { makeAutoObservable, runInAction } from "mobx";
import { Stream } from "./Stream";
import type { Device } from "./Device";
import { addListener } from "../utils/api";

class GlobalStore {
  public globalSnapshot: any = null;
  public streams: Stream[] = [];
  public isLoading: boolean = true;

  constructor() {
    makeAutoObservable(this);
  }

  public setGlobalSnapshot(data: any) {
    this.globalSnapshot = data;
    this._updateStreams(data); // Purane function ki jagah naya function

    if (this.isLoading) {
      this.isLoading = false;
    }
  }

  // --- YEH FUNCTION AB "UPDATE, DON'T REPLACE" USOOL PAR CHALEGA ---
  private _updateStreams(snapshotData: any) {
    const rawStreams = snapshotData?.streams;
    if (!rawStreams || typeof rawStreams !== "object") {
      this.streams = [];
      return;
    }

    const incomingStreamIds = Object.keys(rawStreams);

    // Step 1: Maujooda streams ko update karo ya naye add karo
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
    console.log("GlobalStore ab WebSocket updates ko sun raha hai...");

    const handleMessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        console.log("⬇️ WebSocket se naya data mila:", data);

        // --- 👇 FIX IS HERE: Sirf snapshot messages ko process karein ---
        // Agar message me 'streams' property hai, tabhi state update karein.
        if (data && data.streams) {
          // runInAction se MobX saari tabdeeliyon ko ek batch mein process karta hai
          runInAction(() => {
            this.setGlobalSnapshot(data);
          });
        } else {
          // Doosre messages (jaise {success: "..."}) ko global level par ignore karein.
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
}

const globalStore = new GlobalStore();
export default globalStore;
