import { makeAutoObservable } from "mobx";
import { InterfaceStore } from "./InterfaceStore";

export class RtdInterfaceStore extends InterfaceStore {
  constructor() {
    super();
    makeAutoObservable(this);
  }
}
