import { makeAutoObservable } from "mobx";
import type { Stream } from "./Stream";

export class GlobalStore {
  public streams: Stream[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  addStream(stream: Stream[]) {
    this.streams.push(...stream);
  }
}

const globalStore = new GlobalStore();
export default globalStore;
