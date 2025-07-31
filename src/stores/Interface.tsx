// src/stores/Interface.tsx
import { makeAutoObservable } from "mobx";
import { Device } from "./Device";
import type { InterfaceConfig } from "../types/interfaceConfig";
import type { DeviceConfig } from "../types/device";

export class Interface {
  public id: string;
  public name: string;
  public config: InterfaceConfig;
  public devices: Device[] = [];

  constructor(interfaceData: any) {
    makeAutoObservable(this);

    const { interface_id, interface_type, devices, ...configData } =
      interfaceData;

    this.id = interface_id;
    this.name = interface_type;

    if (devices) {
      this.devices = Object.values<any>(devices).map(
        (devData) => new Device(devData)
      );
    }

    this.config = {
      interface_type: interface_type,
      ...configData,
    } as InterfaceConfig;
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
  }

  removeDevice(deviceId: string) {
    this.devices = this.devices.filter((device) => device.id !== deviceId);
  }

  getConfig(): InterfaceConfig {
    return this.config;
  }
}
