// src/stores/IOCard.ts

import { makeAutoObservable, computed } from "mobx";
import { Interface } from "./Interface";

// This map now acts as the single source of truth for ALL possible interfaces
const ALL_INTERFACES_META: { [id: string]: { type: string } } = {
  MODM1: { type: "ModbusInterface" },
  DI1: { type: "DigitalInputInterface" },
  DI2: { type: "DigitalInputInterface" },
  DI3: { type: "DigitalInputInterface" },
  DI4: { type: "DigitalInputInterface" }, // NOTE: Your SVG has two DI4s. You may need unique IDs like DI4_1, DI4_2
  DI5: { type: "DigitalInputInterface" },
  HI1: { type: "HartInterface" },
  HI2: { type: "HartInterface" },
  TI1: { type: "RtdInterface" },
  AI1: { type: "AnalogInput" }, // You'll need to define AnalogInputInterface in your types
  AI2: { type: "AnalogInput" },
  DO1: { type: "DigitalOutputInterface" }, // You'll need to define DigitalOutputInterface in your types
  DO2: { type: "DigitalOutputInterface" },
  DO3: { type: "DigitalOutputInterface" },
  DO5: { type: "DigitalOutputInterface" },
  AO1: { type: "AnalogOutputInterface" }, // You'll need to define AnalogOutputInterface in your types
  AO2: { type: "AnalogOutputInterface" },
  DI4_left: { type: "DigitalInputInterface" },
  DI4_2: { type: "DigitalInputInterface" },
};

export class IOCard {
  card_type: string;
  // This array will ALWAYS contain an Interface object for every possible slot
  interfaces: Interface[] = [];
  stream_id: string;
  constructor(ioCardData: any, stream_id: string) {
    makeAutoObservable(this, {
      interfaceStatuses: computed,
    });
    this.card_type = ioCardData.card_type;
    this.stream_id = stream_id;
    const configuredInterfacesData = ioCardData.interfaces || {};

    // Create instances for ALL predefined interfaces, every time.
    for (const id in ALL_INTERFACES_META) {
      const configDataFromServer = configuredInterfacesData[id];

      let interfaceInstance;
      if (configDataFromServer) {
        // --- CONFIGURED ---
        // If data exists, create the interface instance with server data.
        // We pass a flag to the constructor to mark it as configured.
        interfaceInstance = new Interface(
          configDataFromServer,
          true,
          this.stream_id
        );
      } else {
        // --- UNCONFIGURED ---
        // If data does NOT exist, create a new, default instance.
        const newInterfaceData = {
          interface_id: id,
          interface_type: ALL_INTERFACES_META[id].type,
          enabled: false,
          devices: {},
          // Add any other default properties required by your types
        };
        // We pass false to mark it as unconfigured initially.
        interfaceInstance = new Interface(
          newInterfaceData,
          false,
          this.stream_id
        );
      }
      this.interfaces.push(interfaceInstance);
    }
  }

  // This computed property now simply checks the flag on the interface itself
  get interfaceStatuses() {
    const statuses: { [id: string]: "configured" | "unconfigured" } = {};
    this.interfaces.forEach((iface) => {
      // console.log("Interface ID:", iface.interface_id, iface.isConfigured);
      statuses[iface.interface_id] = iface.isConfigured
        ? "configured"
        : "unconfigured";
    });
    return statuses;
  }
}
