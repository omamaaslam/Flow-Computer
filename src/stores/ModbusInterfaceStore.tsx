import { makeAutoObservable } from "mobx";
import { InterfaceStore } from "./InterfaceStore";

export class ModbusInterfaceStore extends InterfaceStore {
  constructor() {
    super();
    makeAutoObservable(this);
  }
}
