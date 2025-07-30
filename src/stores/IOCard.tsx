import { makeAutoObservable } from "mobx";
import { Interface } from "./Interface";

export class IOCard {
  card_type: string;
  interfaces: Interface[] = [];

  constructor(ioCardData: any) {
    this.card_type = ioCardData.card_type;
    makeAutoObservable(this);

    // interfaces object ko parse karke Interface instances banayein
    if (ioCardData.interfaces) {
      this.interfaces = Object.values<any>(ioCardData.interfaces).map(
        (interfaceData) => new Interface(interfaceData)
      );
    }
  }
}
