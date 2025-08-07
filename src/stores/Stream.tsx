// D:/flow-computer/src/stores/Stream.ts

import { makeAutoObservable } from "mobx";
import { IOCard } from "./IOCard";
import {
  createDefaultStreamConfig,
  type CalculatorConfig,
  type TemperatureCalculatorConfig,
  // ... other imports
} from "../types/streamConfig";

export class Stream {
  public id: string;
  public name: string;
  public calculator: CalculatorConfig;
  public ioCards: IOCard[] = [];

  // The 'editing...' properties are no longer needed here.

  constructor(streamData: any) {
    makeAutoObservable(this, { id: false });
    this.id = streamData.stream_id;
    this.name = "";
    this.calculator = createDefaultStreamConfig();
    this.update(streamData);
  }

  public update(streamData: any) {
    this.name = streamData.stream_name || this.name;

    if (streamData.io_card) {
      this.ioCards = [new IOCard(streamData.io_card, this.id)];
    } else {
      this.ioCards = [];
    }

    const incomingCalculatorConfig = streamData.calculator || {};

    if (incomingCalculatorConfig.temperature_config) {
      Object.assign(
        this.calculator.temperature_config,
        incomingCalculatorConfig.temperature_config
      );
    }
    if (incomingCalculatorConfig.pressure_config) {
      Object.assign(
        this.calculator.pressure_config,
        incomingCalculatorConfig.pressure_config
      );
    }
    if (incomingCalculatorConfig.flow_rate_config) {
      Object.assign(
        this.calculator.flow_rate_config,
        incomingCalculatorConfig.flow_rate_config
      );
    }

    // For nullable properties, we can still replace them
    if ("volume_configuration" in incomingCalculatorConfig) {
      this.calculator.volume_configuration =
        incomingCalculatorConfig.volume_configuration;
    }
    if ("compressibility_kfactor_config" in incomingCalculatorConfig) {
      this.calculator.compressibility_kfactor_config =
        incomingCalculatorConfig.compressibility_kfactor_config;
    }
    if ("calculation_profile" in incomingCalculatorConfig) {
      this.calculator.calculation_profile =
        incomingCalculatorConfig.calculation_profile;
    }
  }

  // --- NEW, SIMPLER WAY TO HANDLE CANCEL ---
  // This method will revert the changes using a snapshot taken before editing began.
  public revertTemperatureChanges(snapshot: TemperatureCalculatorConfig) {
    Object.assign(this.calculator.temperature_config, snapshot);
  }

  public revertPressureChanges(snapshot: any) {
    Object.assign(this.calculator.pressure_config, snapshot);
  }

  public revertFlowRateChanges(snapshot: any) {
    Object.assign(this.calculator.flow_rate_config, snapshot);
  }

  public revertVolumeChanges(snapshot: any) {
    this.calculator.volume_configuration = snapshot;
  }

  public revertConversionChanges(snapshot: any) {
    this.calculator.compressibility_kfactor_config = snapshot;
  }
}
