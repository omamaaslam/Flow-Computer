// src/stores/Interface.tsx
import { action, makeAutoObservable, runInAction } from "mobx";
import { Device } from "./Device";
import type { InterfaceConfig } from "../types/interfaceConfig";
import type { DeviceConfig } from "../types/device";
import { addInterfaceConfig, updateInterface } from "../utils/services";

export class Interface {
  public interface_id: string;
  public name: string;
  public config: InterfaceConfig;
  public devices: Device[] = [];
  public isConfigured: boolean = false;
  public stream_id: string;
  constructor(
    interfaceData: any,
    isInitiallyConfigured: boolean,
    stream_id: string
  ) {
    makeAutoObservable(this, {
      isConfigured: true,
      setConfigured: action,
    });

    const { interface_id, interface_type, devices, ...configData } =
      interfaceData;
    this.stream_id = stream_id;
    this.interface_id = interface_id;
    this.name = interface_type;
    this.isConfigured = isInitiallyConfigured;

    if (devices && Object.keys(devices).length > 0) {
      this.devices = Object.values<any>(devices).map(
        (devData) => new Device(devData)
      );
    }

    this.config = {
      interface_type: interface_type,
      ...configData,
    } as InterfaceConfig;
  }

  async addConfig(newConfig: Partial<this["config"]>) {
    try {
      // Call the service function to add the new interface config
      await addInterfaceConfig(
        this.stream_id,
        this.name,
        this.interface_id,
        newConfig
      );

      // On success, update the local state in a single transaction
      runInAction(() => {
        this.config = { ...this.config, ...newConfig };
        this.isConfigured = true; // Mark it as configured
      });
    } catch (error) {
      console.error(
        `Failed to ADD interface configuration for '${this.interface_id}':`,
        error
      );
      throw error; // Re-throw the error to be caught by the UI component
    }
  }

  // An action to explicitly set the configured status
  setConfigured(status: boolean) {
    this.isConfigured = status;
  }

  addDevice(name: string, config: DeviceConfig) {
    const newDeviceData = {
      ...config,
      device_id: `device_${Date.now()}`,
      device_type: name,
    };
    const newDevice = new Device(newDeviceData);
    this.devices.push(newDevice);
  }

  updateDevice(deviceId: string, newConfig: DeviceConfig) {
    const deviceToUpdate = this.devices.find(
      (device) => device.id === deviceId
    );
    if (deviceToUpdate) {
      // Pass the partial flat config to the device's update method
      deviceToUpdate.updateConfig(newConfig);
    }
  }

  // updateConfig(newConfig: Partial<this["config"]>) {
  //   this.config = { ...this.config, ...newConfig };
  //   this.setConfigured(true);
  // }

  async updateConfig(newConfig: Partial<this["config"]>) {
    try {
      await updateInterface(this.stream_id, this.interface_id, newConfig);
      runInAction(() => {
        this.config = { ...this.config, ...newConfig };
        this.isConfigured = true;
      });
    } catch (error) {
      console.error("Failed to update interface settings:", error);
      throw error;
    }
  }

  removeDevice(deviceId: string) {
    this.devices = this.devices.filter((device) => device.id !== deviceId);
  }

  getConfig(): InterfaceConfig {
    return this.config;
  }
}
