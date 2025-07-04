import { makeAutoObservable } from "mobx";
import { StreamStore } from "./StreamStore";

class GlobalStore {
  public streamStore: StreamStore;

  constructor() {
    this.streamStore = new StreamStore();
    makeAutoObservable(this);
  }
}

const globalStore = new GlobalStore();
export default globalStore;
