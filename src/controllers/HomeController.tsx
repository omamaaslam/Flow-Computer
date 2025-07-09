import globalStore from "../stores/GlobalStore";
import { Stream } from "../stores/Stream";

export default class HomeController {
  constructor() {
    this.initStreams();
  }

  public initStreams() {
    const streams: Stream[] = [
      new Stream(1, "Eastren Stream", "IOCardType1"),
      new Stream(2, "Northen Stream", "IOCardType2"),
      new Stream(3, "Westren Stream", "IOCardType3"),
      new Stream(4, "Southren Stream", "IOCardType4"),
      new Stream(5, "Stream E", "IOCardType5"),
    ];

    if (globalStore.streams.length === 0) {
      globalStore.addStream(streams);
      console.log(globalStore.streams);
    }
  }
}
