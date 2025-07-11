import { makeAutoObservable } from "mobx";
import { Device } from "./Device";

export class Interface {
  public id: number;
  public config: any[] = [];

  public devices: Device[] = [];

  constructor(id: number, config: any) {
    makeAutoObservable(this);
    this.id = id;
    this.config = config;
  }

 
addDevice(id: number, config: any) {
  const d = new Device(id, config);
  this.devices.push(d);
  return d;
}

}
