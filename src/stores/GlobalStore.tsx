import { makeAutoObservable } from "mobx";
import type { Stream } from "../interfaces/Stream";

export class GlobalStore {
  public streams: Stream[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  addStream(stream: Stream[]) {
    this.streams.push(...stream);
  }

  removeStream(id: number) {
    this.streams = this.streams.filter((s) => s.id !== id);
  }
}

const globalStore = new GlobalStore();
export default globalStore;
