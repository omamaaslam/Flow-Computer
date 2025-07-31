import { makeAutoObservable } from "mobx";
import { Device } from "./Device";
import type { InterfaceConfig } from "../types/interfaceConfig";
import type { DeviceConfig } from "../types/device";

export class Interface {
  public id: string;
  public name: string; // This will hold the interface_type, e.g., "DigitalInputInterface"
  public config: InterfaceConfig;
  public devices: Device[] = [];

  constructor(interfaceData: any) {
    makeAutoObservable(this);

    // Destructure all properties from the incoming data object
    const { interface_id, interface_type, devices, ...configData } =
      interfaceData;

    this.id = interface_id;
    this.name = interface_type;

    // Devices are parsed the same way
    if (devices && Array.isArray(devices)) {
      this.devices = devices.map((devData) => new Device(devData));
    }

    this.config = {
      interface_type: interface_type,
      ...configData,
    } as InterfaceConfig;
  }

   addDevice(name: string, config: DeviceConfig) {
    // We create a new Device instance.
    // The new device's data is constructed from the provided name and config.
    // We generate a simple unique ID using the current timestamp.
    const newDeviceData = {
      device_id: `device_${Date.now()}`, // Or use a proper UUID library
      device_type: name,
      ...config,
    };
    const newDevice = new Device(newDeviceData);
    this.devices.push(newDevice);
  }
  updateConfig(newConfig: Partial<this["config"]>) {
    this.config = { ...this.config, ...newConfig };
  }

  // These methods remain the same.
  removeDevice(deviceId: string) {
    this.devices = this.devices.filter((device) => device.id !== deviceId);
  }

  getConfig(): InterfaceConfig {
    return this.config;
  }
}
