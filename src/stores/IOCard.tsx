import { makeAutoObservable } from "mobx";
import { Interface } from "./Interface";

export class IOCard {
  id: number;
  config: any[] = [];
  interfaces: Interface[] = [];

  constructor(cardId: number, config: any[]) {
    this.id = cardId;
    this.config = config;
    makeAutoObservable(this);
  }

  addInterface(id: number, config: any) {
    const iface = new Interface(id, config);
    this.interfaces.push(iface);
    return iface;
  }
}
