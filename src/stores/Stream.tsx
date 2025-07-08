import { makeAutoObservable, action } from "mobx";
import { IOCard } from "./IOCard";
// Import the TYPE from its new, clean location.
// Update the import path to the correct location of StreamConfig, for example:
import type { streamConfig as StreamConfig } from "../types/Stream";
// Or, if the file does not exist, create 'src/types/StreamConfig.ts' and export the type there.

export class StreamStore {
  public id: number;
  public name: string;
  public ioCard: IOCard;
  public configurations: StreamConfig; // No longer initialized here

  constructor(id: number, name: string, ioCardType: string) {
    makeAutoObservable(this, {
      updateConfig: action,
    });
    this.id = id;
    this.name = name;
    this.ioCard = new IOCard(ioCardType);

    // Initialize the configurations with default values inside the constructor
    this.configurations = {
      volumn: {
        opMode: "default",
        gasMeter: "default",
        qMinAlarm: 0,
        qMaxalarm: 100,
        qMinWarn: 10,
        qMaxWarn: 90,
        creepMode: "off",
        flowRate: 0,
      },
      temperature: {
        subsTemp: 20,
        deviceId: 0,
        baseTemp: 15,
        minOpTemp: -10,
        maxOpTemp: 50,
        tempUnit: "C",
      },
      pressure: {
        subsPress: 101,
        deviceId: 0,
        basePress: 101.325,
        minOpPress: 50,
        maxOpPress: 200,
        pressUnit: "kPa",
      },
    };
  }

  // A better way to handle deep partial updates
  updateConfig(newConfig: Partial<StreamConfig>) {
    if (newConfig.volumn) {
      Object.assign(this.configurations.volumn, newConfig.volumn);
    }
    if (newConfig.temperature) {
      Object.assign(this.configurations.temperature, newConfig.temperature);
    }
    if (newConfig.pressure) {
      Object.assign(this.configurations.pressure, newConfig.pressure);
    }
  }
}
