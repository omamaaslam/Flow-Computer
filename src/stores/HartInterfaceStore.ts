import { makeAutoObservable } from "mobx";
import { InterfaceStore } from "./Interface";

export class HartInterfaceStore extends InterfaceStore {
  constructor() {
    super();
    makeAutoObservable(this);
  }
}
