// D:/flow-computer/src/stores/Stream.ts

import { makeAutoObservable, toJS } from "mobx";
import { IOCard } from "./IOCard";
import {
  createDefaultStreamConfig,
  type CalculatorConfig,
  type FlowRateCalculatorConfig,
  type PressureCalculatorConfig,
  type TemperatureCalculatorConfig,
  type VolumeConfiguration,
  type CompressibilityKFactorConfig,
} from "../types/streamConfig"; // Yahan naye types import ho rahe hain

export class Stream {
  public id: string;
  public name: string;
  public calculator: CalculatorConfig; // Sahi aur master config type
  public ioCards: IOCard[] = [];

  // Editing states ab naye types ke mutabiq hain
  public editingTemperature: TemperatureCalculatorConfig | null = null;
  public editingPressure: PressureCalculatorConfig | null = null;
  public editingVolume: VolumeConfiguration | null = null;
  public editingFlowRate: FlowRateCalculatorConfig | null = null;
  public editingConversion: CompressibilityKFactorConfig | null = null;

  constructor(streamData: any) {
    makeAutoObservable(this, { id: false });

    this.id = streamData.stream_id;
    this.name = streamData.stream_name;

    const defaultConfig = createDefaultStreamConfig();
    // 'calculator' object ko seedha access karein
    const incomingConfig = streamData.calculator || {};

    // Default aur aane wali config ko merge karein taake object hamesha poora rahe
    this.calculator = {
      temperature_config: {
        ...defaultConfig.temperature_config,
        ...incomingConfig.temperature_config,
      },
      pressure_config: {
        ...defaultConfig.pressure_config,
        ...incomingConfig.pressure_config,
      },
      flow_rate_config: {
        ...defaultConfig.flow_rate_config,
        ...incomingConfig.flow_rate_config,
      },
      volume_configuration:
        incomingConfig.volume_configuration ??
        defaultConfig.volume_configuration,
      compressibility_kfactor_config:
        incomingConfig.compressibility_kfactor_config ??
        defaultConfig.compressibility_kfactor_config,
      calculation_profile:
        incomingConfig.calculation_profile ?? defaultConfig.calculation_profile,
    };

    if (streamData.io_card) {
      // Is logic ko abhi ke liye waise hi rakha hai
      this.ioCards.push(new IOCard(streamData.io_card));
    }
  }

  // --- Editing Logic Methods ---

  // Keys ko `CalculatorConfig` se match karna zaroori hai
  private startEditing(
    configType: keyof CalculatorConfig,
    stateKey: keyof this
  ) {
    const savedConfig = toJS(this.calculator[configType]);

    // Sirf tab state banayein jab config null na ho
    if (savedConfig) {
      const defaultConfigSection = createDefaultStreamConfig()[configType];
      const completeEditingState = {
        ...defaultConfigSection,
        ...savedConfig,
      };
      (this[stateKey] as any) = makeAutoObservable(completeEditingState);
    }
  }

  private commitChanges(
    configType: keyof CalculatorConfig,
    stateKey: keyof this
  ) {
    if (this[stateKey]) {
      // Type assertion 'as any' use ki ja rahi hai general function ke liye
      (this.calculator as any)[configType] = toJS(this[stateKey] as any);
      (this[stateKey] as any) = null;
    }
  }

  private cancelEditing(stateKey: keyof this) {
    (this[stateKey] as any) = null;
  }

  // --- Har section ke liye specific functions ---

  startEditingTemperature = () =>
    this.startEditing("temperature_config", "editingTemperature");
  commitTemperatureChanges = () =>
    this.commitChanges("temperature_config", "editingTemperature");
  cancelEditingTemperature = () => this.cancelEditing("editingTemperature");

  startEditingPressure = () =>
    this.startEditing("pressure_config", "editingPressure");
  commitPressureChanges = () =>
    this.commitChanges("pressure_config", "editingPressure");
  cancelEditingPressure = () => this.cancelEditing("editingPressure");

  startEditingVolume = () =>
    this.startEditing("volume_configuration", "editingVolume");
  commitVolumeChanges = () =>
    this.commitChanges("volume_configuration", "editingVolume");
  cancelEditingVolume = () => this.cancelEditing("editingVolume");

  startEditingFlowRate = () =>
    this.startEditing("flow_rate_config", "editingFlowRate");
  commitFlowRateChanges = () =>
    this.commitChanges("flow_rate_config", "editingFlowRate");
  cancelEditingFlowRate = () => this.cancelEditing("editingFlowRate");

  startEditingConversion = () =>
    this.startEditing("compressibility_kfactor_config", "editingConversion");
  commitConversionChanges = () =>
    this.commitChanges("compressibility_kfactor_config", "editingConversion");
  cancelEditingConversion = () => this.cancelEditing("editingConversion");
}
