import { makeAutoObservable } from "mobx";
import { Interface } from "./Interface";
import type { InterfaceConfig } from "../types/interfaceConfig";

export class HartInterfaceStore extends Interface {
  constructor(id: number, name: string, config: InterfaceConfig = {}) {
    super(id, name, config);
    makeAutoObservable(this);
  }
}
