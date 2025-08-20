// D:/flow-computer/src/stores/Stream.ts

import { makeAutoObservable } from "mobx";
import { IOCard } from "./IOCard";
import {
  createDefaultStreamConfig,
  type stream_config,
  type temperature_config,
  // ... other imports
} from "../types/streamConfig";

const ALL_KFACTOR_METHODS = [
  "AGA8_DC92",
  "GERG88_1",
  "ISO6976_2",
  "Constant",
];
export class Stream {
  public id: string;
  public name: string;
  public stream_config: stream_config;
  public ioCards: IOCard[] = [];

  // The 'editing...' properties are no longer needed here.

  constructor(streamData: any) {
    makeAutoObservable(this, { id: false });
    this.id = streamData.stream_id;
    this.name = "";
    this.stream_config = createDefaultStreamConfig();
    this.update(streamData);
  }

  public update(streamData: any) {
    this.name = streamData.stream_name || this.name;

    if (streamData.io_card) {
      this.ioCards = [new IOCard(streamData.io_card, this.id)];
    } else {
      this.ioCards = [];
    }

    const incomingstream_config = streamData.stream_config || {};

    if (incomingstream_config.temperature_config) {
      Object.assign(
        this.stream_config.temperature_config,
        incomingstream_config.temperature_config
      );
    }
    if (incomingstream_config.pressure_config) {
      Object.assign(
        this.stream_config.pressure_config,
        incomingstream_config.pressure_config
      );
    }
    if (incomingstream_config.flow_rate_config) {
      Object.assign(
        this.stream_config.flow_rate_config,
        incomingstream_config.flow_rate_config
      );
    }

    // For nullable properties, we can still replace them
    if ("volume_configuration" in incomingstream_config) {
      this.stream_config.volume_configuration =
        incomingstream_config.volume_configuration;
    }
    if (
      "compressibility_kfactor_config" in incomingstream_config &&
      incomingstream_config.compressibility_kfactor_config
    ) {
      const incomingConfig =
        incomingstream_config.compressibility_kfactor_config;
        const targetConfig = this.stream_config.compressibility_kfactor_config;

      // Update simple properties directly
      targetConfig.active_method = incomingConfig.active_method;
      targetConfig.constant_k_value = incomingConfig.constant_k_value;

      // Deep merge the 'methods' object
      // This ensures we add/update methods without destroying the whole object
      if (incomingConfig.methods) {
        Object.assign(
          this.stream_config.compressibility_kfactor_config.methods,
          incomingConfig.methods
        );
      }
      // --- END OF FIX ---
    }
    // ▲▲▲ THE FIX IS HERE ▲▲▲
    //

    if ("calculation_profile" in incomingstream_config) {
      this.stream_config.calculation_profile =
        incomingstream_config.calculation_profile;
    }
  }

  // --- NEW, SIMPLER WAY TO HANDLE CANCEL ---
  // This method will revert the changes using a snapshot taken before editing began.
  public revertTemperatureChanges(snapshot: temperature_config) {
    Object.assign(this.stream_config.temperature_config, snapshot);
  }

  public revertPressureChanges(snapshot: any) {
    Object.assign(this.stream_config.pressure_config, snapshot);
  }

  public revertFlowRateChanges(snapshot: any) {
    Object.assign(this.stream_config.flow_rate_config, snapshot);
  }

  public revertVolumeChanges(snapshot: any) {
    this.stream_config.volume_configuration = snapshot;
  }

  public revertConversionChanges(snapshot: any) {
    this.stream_config.compressibility_kfactor_config = snapshot;
  }
}
