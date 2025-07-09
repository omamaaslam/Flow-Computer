import { makeAutoObservable } from "mobx";
import type { Interface } from "../interfaces/Interface";


export class Stream {
  public configurations: Record<string, any> = {};
  public interfaces: Interface[] = [];

  constructor(id: number, name: string) {
    makeAutoObservable(this);
  }

  addInterface(interfaceObj: Interface) {
    this.interfaces.push(interfaceObj);
  }

  setConfiguration(key: string, value: any) {
    this.configurations[key] = value;
  }

}
