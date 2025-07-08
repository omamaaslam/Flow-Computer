// src/stores/IOCard.ts
import { makeAutoObservable, action } from "mobx";
import { Interface } from "./Interface";

export class IOCard {
  // Observables
  public cardType: string;
  public interfaces: Interface[] = [];

  constructor(type: string) {
    makeAutoObservable(this, {
      addInterface: action,
    });
    this.cardType = type;
  }

  // Action to add an interface
  addInterface(interfaceObj: Interface) {
    this.interfaces.push(interfaceObj);
  }

  // Getter to find a specific interface
  getInterfaceById(interfaceId: string): Interface | undefined {
    return this.interfaces.find((intf) => intf.id === interfaceId);
  }
}
