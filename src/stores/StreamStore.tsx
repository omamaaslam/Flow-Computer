import { makeAutoObservable } from "mobx";
import type { Interface } from "../interfaces/Interface";


export class StreamStore {
  public interfaces: Interface[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  addInterface(interfaceObj: Interface) {
    this.interfaces.push(interfaceObj);
  }

}
