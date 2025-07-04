import { makeAutoObservable } from "mobx";
import type { Stream } from "../interfaces/Stream";

export class StreamStore {
  public streams: Stream[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  public addStream(stream: Stream[]) {
    this.streams.push(...stream);
  }

  public deleteStream() {
    this.streams.pop();
    console.log(this.streams);
  }
}
