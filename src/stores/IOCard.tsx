import { makeAutoObservable } from "mobx";
import { Interface } from "./Interface";
import type { InterfaceConfig } from "../types/interfaceConfig";

export class IOCard {
  id: number;
  config: any[] = [];
  interfaces: Interface[] = [];

  constructor(cardId: number, config: any[]) {
    this.id = cardId;
    this.config = config;
    makeAutoObservable(this);
  }

  addInterface(id: number, name: string, config: InterfaceConfig = {}) {
    const iface = new Interface(id, name, config);
    this.interfaces.push(iface);
    return iface;
  }
}
