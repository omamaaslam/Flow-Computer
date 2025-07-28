import { makeAutoObservable, toJS } from "mobx";
import { IOCard } from "./IOCard";
import type {
  StreamConfig,
  TemperatureConfig,
  PressureConfig,
  VolumeConfig,
  FlowRateConfig,
  ConversionConfig,
} from "../types/streamConfig";

export class Stream {
  public id: number;
  public name: string;
  public config: StreamConfig;
  public ioCards: IOCard[] = [];

  public editingTemperature: TemperatureConfig | null = null;
  public editingPressure: PressureConfig | null = null;
  public editingVolume: VolumeConfig | null = null;
  public editingFlowRate: FlowRateConfig | null = null;
  public editingConversion: ConversionConfig | null = null;

  constructor(id: number, name: string, config: StreamConfig) {
    makeAutoObservable(this, { id: false, name: false });
    this.id = id;
    this.name = name;
    this.config = config;
  }

  private startEditing(configType: keyof StreamConfig, stateKey: keyof this) {
    (this[stateKey] as any) = makeAutoObservable(toJS(this.config[configType]));
  }

  private commitChanges(configType: keyof StreamConfig, stateKey: keyof this) {
    if (this[stateKey]) {
      this.config[configType] = toJS(this[stateKey] as any);
      (this[stateKey] as any) = null;
    }
  }

  private cancelEditing(stateKey: keyof this) {
    (this[stateKey] as any) = null;
  }

  startEditingTemperature = () =>
    this.startEditing("temperature", "editingTemperature");
  commitTemperatureChanges = () =>
    this.commitChanges("temperature", "editingTemperature");
  cancelEditingTemperature = () => this.cancelEditing("editingTemperature");

  startEditingPressure = () => this.startEditing("pressure", "editingPressure");
  commitPressureChanges = () =>
    this.commitChanges("pressure", "editingPressure");
  cancelEditingPressure = () => this.cancelEditing("editingPressure");

  startEditingVolume = () => this.startEditing("volume", "editingVolume");
  commitVolumeChanges = () => this.commitChanges("volume", "editingVolume");
  cancelEditingVolume = () => this.cancelEditing("editingVolume");

  startEditingFlowRate = () => this.startEditing("flowRate", "editingFlowRate");
  commitFlowRateChanges = () =>
    this.commitChanges("flowRate", "editingFlowRate");
  cancelEditingFlowRate = () => this.cancelEditing("editingFlowRate");

  startEditingConversion = () =>
    this.startEditing("conversion", "editingConversion");
  commitConversionChanges = () =>
    this.commitChanges("conversion", "editingConversion");
  cancelEditingConversion = () => this.cancelEditing("editingConversion");

  addIOCard(cardId: number, config: any) {
    const ioCard = new IOCard(cardId, config);
    this.ioCards.push(ioCard);
    return ioCard;
  }
}
