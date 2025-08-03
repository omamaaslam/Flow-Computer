import { makeAutoObservable } from "mobx";
import { Interface } from "./Interface";

// Base list waisi hi rahegi, lekin keys ab backend IDs se match karengi.
const ALL_DIAGRAM_INTERFACES = {
  MOD_M: "unconfigured", // Changed from MOD
  DI2: "unconfigured",
  DI4_left: "unconfigured",
  AI1: "unconfigured",
  DO2: "unconfigured",
  DI4_2: "unconfigured",
  AI2: "unconfigured",
  HART2: "unconfigured", // Assuming backend sends HART2
  AO1: "unconfigured",
  DI1: "unconfigured",
  DI3: "unconfigured",
  DI5: "unconfigured",
  DO1: "unconfigured",
  DO3: "unconfigured",
  DO5: "unconfigured",
  HI1: "unconfigured",
  TI1: "unconfigured",
  AO2: "unconfigured",
};

export class IOCard {
  card_type: string;
  interfaces: Interface[] = [];

  constructor(ioCardData: any) {
    this.card_type = ioCardData.card_type;
    makeAutoObservable(this);

    if (ioCardData.interfaces) {
      this.interfaces = Object.values<any>(ioCardData.interfaces).map(
        (interfaceData) => new Interface(interfaceData)
      );
    }
  }

  // *** NEW METHOD START ***
  // Add this method to allow adding a new interface instance.
  addInterface(newInterface: Interface) {
    if (!this.interfaces.find(iface => iface.id === newInterface.id)) {
      this.interfaces.push(newInterface);
    }
  }


  get interfaceStatuses() {
    const currentStatuses: any = { ...ALL_DIAGRAM_INTERFACES };

    this.interfaces.forEach((iface) => {
      const diagramId = iface.id;

      if (diagramId in currentStatuses) {
        currentStatuses[diagramId] = "configured";
      }
    });

    return currentStatuses;
  }
}
