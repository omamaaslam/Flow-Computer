import globalStore from "../stores/GlobalStore";
import type { Stream } from "../interfaces/Stream";

export default class HomeController {
  // private deleteInterval: ReturnType<typeof setInterval> | null = null;
  // private updateInterval: ReturnType<typeof setInterval> | null = null;

  constructor() {
    this.initStreams();
    // this.startAutoDelete();
  }

  public initStreams() {
    const streams: Stream[] = [
      { id: 1, name: "Eastren Stream", flowRate: 10, volume: 100 },
      { id: 2, name: "Northen Stream", flowRate: 60, volume: 170 },
      { id: 3, name: "Westren Stream", flowRate: 19, volume: 20 },
      { id: 4, name: "Southren Stream", flowRate: 120, volume: 140 },
      { id: 5, name: "Stream E", flowRate: 90, volume: 140 },
    ];

    if (globalStore.streamStore.streams.length === 0) {
      globalStore.streamStore.addStream(streams);
    }
  }

  // public startAutoDelete() {
  //   this.deleteInterval = setInterval(() => {
  //     const { streams } = globalStore.streamStore;
  //     if (streams.length > 1) {
  //       globalStore.streamStore.deleteStream();
  //     } else {
  //       this.clearAutoDelete();
  //       this.startRandomUpdateForLastStream(); // ✅ start updating last stream
  //     }
  //   }, 5000);
  // }

  // public clearAutoDelete() {
  //   if (this.deleteInterval) {
  //     clearInterval(this.deleteInterval);
  //     this.deleteInterval = null;
  //   }
  // }

  // private startRandomUpdateForLastStream() {
  //   this.updateInterval = setInterval(() => {
  //     const streams = globalStore.streamStore.streams;

  //     if (streams.length === 1) {
  //       const randomVolume = Math.floor(Math.random() * 100) + 100;
  //       const randomFlow = Math.floor(Math.random() * 300) + 10;
  //       streams[0].volume = randomVolume;
  //       streams[0].flowRate = randomFlow;
  //     } else {
  //       this.clearRandomUpdate();
  //     }
  //   }, 5000);
  // }

  // private clearRandomUpdate() {
  //   if (this.updateInterval) {
  //     clearInterval(this.updateInterval);
  //     this.updateInterval = null;
  //   }
  // }
}
