import { makeAutoObservable } from "mobx";

export class Device {
  public id: number;
  public config: any[] = [];

  constructor(id: number, config: any) {
    makeAutoObservable(this);
    this.id = id;
    this.config = config;
  }
}
