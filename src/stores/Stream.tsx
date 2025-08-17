// D:/flow-computer/src/stores/Stream.ts

import { makeAutoObservable } from "mobx";
import { IOCard } from "./IOCard";
import {
  createDefaultStreamConfig,
  type stream_config,
  type temperature_config,
  // ... other imports
} from "../types/streamConfig";

export class Stream {
  public id: string;
  public name: string;
  public calculator: stream_config;
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

    const incomingstream_config = streamData.calculator || {};

    if (incomingstream_config.temperature_config) {
      Object.assign(
        this.calculator.temperature_config,
        incomingstream_config.temperature_config
      );
    }
    if (incomingstream_config.pressure_config) {
      Object.assign(
        this.calculator.pressure_config,
        incomingstream_config.pressure_config
      );
    }
    if (incomingstream_config.flow_rate_config) {
      Object.assign(
        this.calculator.flow_rate_config,
        incomingstream_config.flow_rate_config
      );
    }

    // For nullable properties, we can still replace them
    if ("volume_configuration" in incomingstream_config) {
      this.calculator.volume_configuration =
        incomingstream_config.volume_configuration;
    }
    if ("compressibility_kfactor_config" in incomingstream_config) {
      this.calculator.compressibility_kfactor_config =
        incomingstream_config.compressibility_kfactor_config;
    }
    if ("calculation_profile" in incomingstream_config) {
      this.calculator.calculation_profile =
        incomingstream_config.calculation_profile;
    }
  }

  // --- NEW, SIMPLER WAY TO HANDLE CANCEL ---
  // This method will revert the changes using a snapshot taken before editing began.
  public revertTemperatureChanges(snapshot: temperature_config) {
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
