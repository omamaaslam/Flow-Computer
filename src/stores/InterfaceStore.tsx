import { makeAutoObservable } from "mobx";

export class InterfaceStore {
  constructor() {
    makeAutoObservable(this);
  }
}
