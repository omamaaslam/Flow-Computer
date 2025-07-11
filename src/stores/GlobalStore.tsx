import { makeAutoObservable } from "mobx";
import { Stream } from "./Stream";

export class GlobalStore {
  public streams: Stream[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  addStream(streamId: number, config: any) {
    const stream = new Stream(streamId, config);
    this.streams.push(stream);
    return stream;
  }
}
const globalStore = new GlobalStore();
export default globalStore;
