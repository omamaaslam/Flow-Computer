import { makeAutoObservable } from "mobx";
import { InterfaceStore } from "./InterfaceStore";

export class HartInterfaceStore extends InterfaceStore {
  constructor() {
    super();
    makeAutoObservable(this);
  }
}
