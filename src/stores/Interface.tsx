import { action, makeAutoObservable, runInAction } from "mobx";
import { Device } from "./Device";
import type { InterfaceConfig } from "../types/interfaceConfig";
import type { DeviceConfig } from "../types/device";
import {
  addDevice as addDeviceService,
  updateDevice as updateDeviceService,
  addInterfaceConfig,
  updateInterface,
  DeleteDevice as deleteDeviceService,
} from "../utils/services";

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
    // makeAutoObservable(this, {
    //   isConfigured: true,
    //   setConfigured: action,
    // });
    makeAutoObservable(this);

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
      await addInterfaceConfig(
        this.stream_id,
        this.name,
        this.interface_id,
        newConfig
      );

      runInAction(() => {
        this.config = { ...this.config, ...newConfig };
        this.isConfigured = true;
      });
    } catch (error) {
      console.error(
        `Failed to ADD interface configuration for '${this.interface_id}':`,
        error
      );
      throw error;
    }
  }

  setConfigured(status: boolean) {
    this.isConfigured = status;
  }

  async addDevice(deviceType: string, deviceConfig: DeviceConfig) {
    const deviceId = deviceConfig.device_id;

    if (!deviceId) {
      console.error("Cannot add a device without a device_id.");
      throw new Error("Device ID is missing.");
    }
    console.log("add device payload", {
      stream_id: this.stream_id,
      interface_id: this.interface_id,
      deviceType: deviceType,
      deviceConfig: deviceConfig,
      deviceId: deviceId,
    });
    try {
      await addDeviceService(
        this.stream_id,
        this.interface_id,
        deviceType,
        deviceConfig,
        deviceId
      );

      runInAction(() => {
        const newDevice = new Device({
          ...deviceConfig,
          device_type: deviceType,
        });
        this.devices.push(newDevice);
      });
    } catch (error) {
      console.error(
        `Failed to ADD device '${deviceConfig.device_id}' to interface '${this.interface_id}':`,
        error
      );
      throw error;
    }
  }

  async updateDevice(deviceId: string, newConfig: DeviceConfig) {
    const deviceToUpdate = this.devices.find(
      (device) => device.id === deviceId
    );

    if (!deviceToUpdate) {
      console.error(`Device with ID ${deviceId} not found for update.`);
      return;
    }

    try {
      // Call the new service function
      await updateDeviceService(
        this.stream_id,
        this.interface_id,
        deviceId,
        newConfig
      );

      // On success, update the local state optimistically
      runInAction(() => {
        deviceToUpdate.updateConfig(newConfig); // Use the existing method on the Device instance
      });
    } catch (error) {
      console.error(`Failed to UPDATE device '${deviceId}':`, error);
      throw error;
    }
  }

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
  getConfig(): InterfaceConfig {
    return this.config;
  }

  async deleteDevice(deviceId: string) {
    const deviceIndex = this.devices.findIndex(
      (device) => device.id === deviceId
    );

    if (deviceIndex === -1) {
      console.error(`Device with ID ${deviceId} not found for deletion.`);
      return;
    }

    try {
      // Call the service to delete the device
      await deleteDeviceService(this.stream_id, this.interface_id, deviceId);

      // On success, remove it locally
      runInAction(() => {
        this.devices.splice(deviceIndex, 1);
      });

      console.log(`Device '${deviceId}' deleted successfully.`);
    } catch (error) {
      console.error(`Failed to DELETE device '${deviceId}':`, error);
      throw error;
    }
  }
}
