import { makeAutoObservable } from "mobx";
import { StreamStore } from "./StreamStore";
import { IOCardStore } from "./IO_CardStore";
import { InterfaceStore } from "./InterfaceStore";

class GlobalStore {
  public streamStore: StreamStore;
  public ioCardStore: IOCardStore;
  public interfaceStore: InterfaceStore;

  constructor() {
    this.streamStore = new StreamStore();
    this.ioCardStore = new IOCardStore("default");
    this.interfaceStore = new InterfaceStore();
    makeAutoObservable(this);
  }
}

const globalStore = new GlobalStore();
export default globalStore;
