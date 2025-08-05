// src/stores/Interface.tsx
import { action, makeAutoObservable } from "mobx";
import { Device } from "./Device";
import type { InterfaceConfig } from "../types/interfaceConfig";
import type { DeviceConfig } from "../types/device";

export class Interface {
  public id: string;
  public name: string;
  public config: InterfaceConfig;
  public devices: Device[] = [];
  public isConfigured: boolean = false;

  constructor(interfaceData: any, isInitiallyConfigured: boolean) {
    makeAutoObservable(this, {
      isConfigured: true, // Keep it as an observable property
      setConfigured: action, // Mark the method as an action
    });

    const { interface_id, interface_type, devices, ...configData } =
      interfaceData;

    this.id = interface_id;
    this.name = interface_type;
    this.isConfigured = isInitiallyConfigured; // Set the initial status

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

  updateConfig(newConfig: Partial<this["config"]>) {
    this.config = { ...this.config, ...newConfig };
    // After a user saves the form for the first time, we mark it as configured.
    this.setConfigured(true);
  }

  removeDevice(deviceId: string) {
    this.devices = this.devices.filter((device) => device.id !== deviceId);
  }

  getConfig(): InterfaceConfig {
    return this.config;
  }
}
