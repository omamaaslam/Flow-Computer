import globalStore from "../stores/GlobalStore"; // ✅ use instance
import { StreamStore } from "../stores/StreamStore";
import type { Stream } from "../interfaces/Stream";

export default class HomeController {
  constructor() {
    this.initStreams();
  }

  public initStreams() {
    const streams: Stream[] = [
      { id: 1, name: "Eastren Stream", stream: new StreamStore() },
      { id: 2, name: "Northen Stream", stream: new StreamStore() },
      { id: 3, name: "Westren Stream", stream: new StreamStore() },
      { id: 4, name: "Southren Stream", stream: new StreamStore() },
      { id: 5, name: "Stream E", stream: new StreamStore() },
    ];

    // ✅ Use the instance of the store
    if (globalStore.streams.length === 0) {
      globalStore.addStream(streams);
    }
  }
}
