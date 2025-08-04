// D:/flow-computer/src/stores/Stream.ts

import { makeAutoObservable, toJS } from "mobx";
import { IOCard } from "./IOCard";
// Apne types file se zaroori types aur function ko import karein.
import {
  createDefaultStreamConfig,
  type calculator,
  type compressibilityKFactorConfig,
  type flowRateConfig,
  type pressureConfig,
  type temperatureConfig,
  type volumeConfiguration,
} from "../types/streamConfig"; // Make sure path is correct

export class Stream {
  public id: string;
  public name: string;
  public calculator: calculator;
  public ioCards: IOCard[] = [];

  // Editing state ke liye temporary storage
  public editingTemperature: temperatureConfig | null = null;
  public editingPressure: pressureConfig | null = null;
  public editingVolume: volumeConfiguration | null = null;
  public editingFlowRate: flowRateConfig | null = null;
  public editingConversion: compressibilityKFactorConfig | null = null;

  constructor(streamData: any) {
    makeAutoObservable(this, { id: false });

    this.id = streamData.stream_id;
    this.name = streamData.stream_name;

    // Default configuration ko ek variable me store karein.
    const defaultConfig = createDefaultStreamConfig();

    // Aane wale data se config object nikalein. Agar nahi hai to khaali object use karein.
    const incomingConfig = streamData.config || {};

    // Default config aur aane wale config ko merge karke final config banayein.
    // Isse 'this.calculator' hamesha ek valid aur poora object rahega.
    this.calculator = {
      temperatureConfig: {
        ...defaultConfig.temperatureConfig,
        ...incomingConfig.temperatureConfig,
      },
      pressureConfig: {
        ...defaultConfig.pressureConfig,
        ...incomingConfig.pressureConfig,
      },
      volumeConfiguration: {
        ...defaultConfig.volumeConfiguration,
        ...incomingConfig.volumeConfiguration,
      },
      flowRateConfig: {
        ...defaultConfig.flowRateConfig,
        ...incomingConfig.flowRateConfig,
      },
      compressibilityKFactorConfig: {
        ...defaultConfig.compressibilityKFactorConfig,
        ...incomingConfig.compressibilityKFactorConfig,
      },
    };

    // Agar streamData me io_card hai, to IOCard ka instance banakar add karein
    if (streamData.io_card) {
      this.ioCards.push(new IOCard(streamData.io_card));
    }
  }

  // --- Editing Logic Methods ---

  // ===== YAHAN BADLAV KIYA GAYA HAI =====
  private startEditing(configType: keyof calculator, stateKey: keyof this) {
    // 1. Pehle se save ki hui values nikalein.
    const savedConfig = toJS(this.calculator[configType]);

    // 2. Usi section ke liye default values nikalein.
    const defaultConfig = createDefaultStreamConfig()[configType];

    // 3. Naya editing state banayein:
    //    - Pehle saari default values rakhein.
    //    - Phir saved values se unko overwrite kar dein.
    // Isse object hamesha poora (complete) rehta hai aur type error nahi aata.
    const completeEditingState = {
      ...defaultConfig,
      ...savedConfig,
    };

    // 4. Is poore object ko editing state mein daal dein.
    (this[stateKey] as any) = makeAutoObservable(completeEditingState);
  }

  private commitChanges(configType: keyof calculator, stateKey: keyof this) {
    if (this[stateKey]) {
      this.calculator[configType] = toJS(this[stateKey] as any);
      (this[stateKey] as any) = null;
    }
  }

  private cancelEditing(stateKey: keyof this) {
    (this[stateKey] as any) = null;
  }

  // Baaki sab methods waise hi rahenge, unko badalne ki zaroorat nahi hai.

  // Temperature Editing
  startEditingTemperature = () =>
    this.startEditing("temperatureConfig", "editingTemperature");
  commitTemperatureChanges = () =>
    this.commitChanges("temperatureConfig", "editingTemperature");
  cancelEditingTemperature = () => this.cancelEditing("editingTemperature");

  // Pressure Editing
  startEditingPressure = () =>
    this.startEditing("pressureConfig", "editingPressure");
  commitPressureChanges = () =>
    this.commitChanges("pressureConfig", "editingPressure");
  cancelEditingPressure = () => this.cancelEditing("editingPressure");

  // Volume Editing
  startEditingVolume = () =>
    this.startEditing("volumeConfiguration", "editingVolume");
  commitVolumeChanges = () =>
    this.commitChanges("volumeConfiguration", "editingVolume");
  cancelEditingVolume = () => this.cancelEditing("editingVolume");

  // FlowRate Editing
  startEditingFlowRate = () =>
    this.startEditing("flowRateConfig", "editingFlowRate");
  commitFlowRateChanges = () =>
    this.commitChanges("flowRateConfig", "editingFlowRate");
  cancelEditingFlowRate = () => this.cancelEditing("editingFlowRate");

  // Conversion/Compressibility Editing
  startEditingConversion = () =>
    this.startEditing("compressibilityKFactorConfig", "editingConversion");
  commitConversionChanges = () =>
    this.commitChanges("compressibilityKFactorConfig", "editingConversion");
  cancelEditingConversion = () => this.cancelEditing("editingConversion");
}
