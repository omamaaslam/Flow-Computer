// D:/flow-computer/src/stores/Stream.ts

import { makeAutoObservable } from "mobx";
import { IOCard } from "./IOCard";
import {
  createDefaultStreamConfig,
  type GasComponent,
  type stream_config,
  type temperature_config,
  // ... other imports
} from "../types/streamConfig";

const ALL_KFACTOR_METHODS = [
  "Constant",
  "GERG88_1",
  "GERG88_2",
  "GERG88_3",
  "AGA8_GCM_1 ",
  "AGA8_GCM_2",
  "AGA_NX19_L",
  "AGA_NX19_H",
  "AGA8_DC92",
  "SGERG_H2",
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

      // --- START OF NEW LOGIC ---
      // Ensure all possible methods exist in our store's state.
      ALL_KFACTOR_METHODS.forEach((methodName) => {
        // If the server sent data for this method, use it.
        if (incomingConfig.methods && incomingConfig.methods[methodName]) {
          // To be safe, ensure the object exists before assigning to it
          if (!targetConfig.methods[methodName]) {
            targetConfig.methods[methodName] = {};
          }
          Object.assign(
            targetConfig.methods[methodName],
            incomingConfig.methods[methodName]
          );
        }
        // If the server did NOT send data, but the method doesn't exist in our store yet, create it.
        else if (!targetConfig.methods[methodName]) {
          // Create a default structure for this method.
          // We'll populate it with keys from the base gas_components list, but with default values.
          const defaultMethodData: { [key: string]: GasComponent } = {};
          targetConfig.gas_components.forEach((component) => {
            defaultMethodData[component.key] = {
              ...component, // copy key, display_name, unit
              value: 0, // set default value to 0
              linked_device_id: "", // set default device to empty
            };
          });
          targetConfig.methods[methodName] = defaultMethodData;
        }
      });
    }
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