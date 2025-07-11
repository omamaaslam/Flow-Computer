import globalStore from "../stores/GlobalStore";
import { Stream } from "../stores/Stream";

export default class HomeController {
  constructor() {
    this.initStreams();
  }

  public initStreams() {
    const streams: Stream[] = [
      new Stream(1, "Eastren Stream"),
      new Stream(2, "Northen Stream"),
      new Stream(3, "Westren Stream"),
      new Stream(4, "Southren Stream"),
      new Stream(5, "Stream E"),
    ];

    if (globalStore.streams.length === 0) {
      streams.map((stream) => globalStore.addStream(stream.id, stream));
    }
  }
}
