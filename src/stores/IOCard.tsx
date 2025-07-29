import { makeAutoObservable } from "mobx";
import { Interface } from "./Interface";
import type { InterfaceConfig } from "../types/interfaceConfig";

export class IOCard {
  card_type: string;
  interfaces: Interface[] = [];

  constructor(card_type: string) {
    this.card_type = card_type;
    makeAutoObservable(this);
  }

  addInterface(id: number, name: string, config: InterfaceConfig = {}) {
    const iface = new Interface(id, name, config);
    this.interfaces.push(iface);
    return iface;
  }
}
