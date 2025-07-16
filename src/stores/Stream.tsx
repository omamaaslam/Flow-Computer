import { makeAutoObservable } from "mobx";
import { IOCard } from "./IOCard";
import type { StreamConfig, TemperatureConfig, PressureConfig, VolumeConfig } from "../types/streamConfig";

export class Stream {
  public id: number;
  public name: string;
  public config: StreamConfig;
  public ioCards: IOCard[] = [];

  constructor(id: number, name: string, config: StreamConfig) {
    makeAutoObservable(this);
    this.id = id;
    this.name = name;
    this.config = config;
  }

  addIOCard(cardId: number, config: any) {
    const ioCard = new IOCard(cardId, config);
    this.ioCards.push(ioCard);
    return ioCard;
  }
  
  // --- ADD THESE METHODS ---
  updateTemperatureConfig(newConfig: TemperatureConfig) {
    this.config.temperature = newConfig;
  }
  
  updatePressureConfig(newConfig: PressureConfig) {
    this.config.pressure = newConfig;
  }

  updateVolumeConfig(newConfig: VolumeConfig) {
    this.config.volume = newConfig;
  }
}