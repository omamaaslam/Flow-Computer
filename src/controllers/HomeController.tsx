import globalStore from "../stores/GlobalStore"; // ✅ use instance
import { StreamStore } from "../stores/Stream";
import type { Stream } from "../interfaces/Stream";

export default class HomeController {
  constructor() {
    this.initStreams();
  }

  public initStreams() {
    const streams: Stream[] = [
      { id: 1, name: "Eastren Stream", stream: new StreamStore(1, "Eastren Stream") },
      { id: 2, name: "Northen Stream", stream: new StreamStore(2, "Northen Stream") },
      { id: 3, name: "Westren Stream", stream: new StreamStore(3, "Westren Stream") },
      { id: 4, name: "Southren Stream", stream: new StreamStore(4, "Southren Stream") },
      { id: 5, name: "Stream E", stream: new StreamStore(5, "Stream E") },
    ];

    // ✅ Use the instance of the store
    if (globalStore.streams.length === 0) {
      globalStore.addStream(streams);
      console.log(globalStore.streams);
    }
  }
}
