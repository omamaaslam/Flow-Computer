import { makeAutoObservable } from "mobx";

export class InterfaceStore {
  public devices = new Map<string, any>();

  constructor() {
    makeAutoObservable(this);
  }

  addDevice(key: string, device: any) {
    this.devices.set(key, device);
  }

  getDevice(key: string) {
    return this.devices.get(key);
  }
}
