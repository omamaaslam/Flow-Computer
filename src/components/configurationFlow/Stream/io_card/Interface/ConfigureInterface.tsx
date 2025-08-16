import { useState, useEffect } from "react";
import { Settings, ArrowLeft } from "lucide-react";
import MuiModalWrapper from "../../../MuiModalWrapper.tsx";
import AddDeviceForm from "./Device/AddDeviceForm.tsx";
import { observer } from "mobx-react-lite";
import { Interface } from "../../../../../stores/Interface.tsx";
import { Device } from "../../../../../stores/Device.tsx";
import type { InterfaceConfig } from "../../../../../types/interfaceConfig.tsx";
import type { DeviceConfig } from "../../../../../types/device.tsx";
import HartInterfaceSettingsForm from "./HartInterfaceSettingsForm.tsx";
import DI_InterfaceSettingsForm from "./DI_InterfaceSettingsForm.tsx";
import FlowRateDeviceForm from "./Device/FlowRateDeviceForm.tsx";
import PressureDeviceForm from "./Device/PressureDeviceForm.tsx";
import PulseFlowRateDeviceForm from "./Device/PulseFlowRateDeviceForm.tsx";
import PulseVolumeDeviceForm from "./Device/PulseVolumeDeviceForm.tsx";
import TemperatureDeviceForm from "./Device/TemperatureDeviceForm.tsx";
import VolumeDeviceForm from "./Device/VolumeDeviceForm.tsx";
import ModbusInterfaceSettingsForm from "./ModbusInterfaceSettingsForm.tsx";
import RTDInterfaceSettingsForm from "./RTDInterfaceSettingsForm.tsx";
import GasDeviceForm from "./Device/GasDeviceForm.tsx";
import DeviceIcon from "../../../../DeviceIcon.tsx";
import Legend from "../../../../Legend.tsx";
import DO_InterfaceSettingsForm from "./DO_InterfaceSettingsForm.tsx";

interface ConfigureInterfaceProps {
  anInterface: Interface;
  onBack: () => void;
}

type DeviceStatus = "ok" | "warning" | "error";
type ModalView =
  | "closed"
  | "modbusSettings"
  | "RTDSettings"
  | "HART1"
  | "Di_InterfaceSettings"
  | "Do_InterfaceSettings"
  | "addDevice_selectType"
  | "addDevice_configure";

const statusStyles: Record<
  DeviceStatus | "inactive",
  { gradient: string; icon: string }
> = {
  ok: { gradient: "from-black to-lime-500", icon: "text-yellow-400" },
  warning: { gradient: "from-black to-yellow-500", icon: "text-yellow-400" },
  error: { gradient: "from-black to-red-600", icon: "text-yellow-400" },
  inactive: { gradient: "from-gray-700 to-gray-500", icon: "text-yellow-400" },
};

const deviceOptions = [
  { value: "TemperatureDevice", label: "Temperature" },
  { value: "PressureDevice", label: "Pressure" },
  { value: "VolumeDevice", label: "Volume" },
  { value: "PulseVolumeDevice", label: "Pulse Volume" },
  { value: "FlowRateDevice", label: "Flow Rate" },
  { value: "PulseFlowRateDevice", label: "Pulse Flow Rate" },
  { value: "CH4", label: "Methanes" },
  { value: "N2", label: "Nitrogen" },
  { value: "CO2", label: "Carbon Dioxide" },
  { value: "C2H6", label: "Ethane" },
  { value: "C3H8", label: "Propane" },
  { value: "H2O", label: "Water" },
  { value: "H2S", label: "Hydrogen sulfides" },
  { value: "H2", label: "Hydrogen" },
  { value: "CO", label: "Carbon monoxide" },
  { value: "O2", label: "Oxygen" },
  { value: "IC4H10", label: "i-Butane" },
  { value: "C4H10", label: "n-butane" },
  { value: "IC5H12", label: "i-Pentane" },
  { value: "C5H12", label: "n-Pentanes" },
  { value: "C6H14", label: "n-hexanes" },
  { value: "C7H16", label: "n-heptanes" },
  { value: "C8H18", label: "n-octanes" },
  { value: "C9H20", label: "n-Nonane" },
  { value: "C10H22", label: "n-Decane" },
  { value: "HE", label: "Helium" },
  { value: "AR", label: "Argon" },
  { value: "HI", label: "heating value" },
  { value: "RD", label: "density ratio" },
  { value: "WI", label: "Wobbe index" },
];

const gasDeviceTypes = deviceOptions
  .filter(
    (opt) =>
      !opt.value.endsWith("Device") && !["HI", "RD", "WI"].includes(opt.value)
  )
  .map((opt) => opt.value);

const ConfigureInterface = observer(
  ({ anInterface, onBack }: ConfigureInterfaceProps) => {
    const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(
      null
    );
    const [modalView, setModalView] = useState<ModalView>("closed");
    const [deviceTypeToConfigure, setDeviceTypeToConfigure] =
      useState<string>("");
    const [isEditing, setIsEditing] = useState(false);
    const [editingDevice, setEditingDevice] = useState<Device | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
      if (!anInterface.isConfigured) {
        handleOpenSettingsModal();
      }
    }, [anInterface]);

    const handleSaveInterfaceConfig = async (config: InterfaceConfig) => {
      setIsSaving(true);
      try {
        if (anInterface.isConfigured) {
          await anInterface.updateConfig(config);
        } else {
          await anInterface.addConfig(config);
        }
        closeModal();
      } catch (error) {
        console.error("Failed to save interface config:", error);
      } finally {
        setIsSaving(false);
      }
    };

    const handleSaveDeviceConfiguration = async (config: DeviceConfig) => {
      setIsSaving(true);
      try {
        if (isEditing && editingDevice) {
          // await anInterface.updateDevice(editingDevice.id, config);
        }
        // else if (!isEditing && deviceTypeToConfigure) {
        //   const singleDeviceInterfacePrefixes = ["DI", "TI"];
        //   const currentInterfacePrefix = anInterface.interface_id.substring(
        //     0,
        //     2
        //   );

        //   let newDeviceId: string;
        //   if (singleDeviceInterfacePrefixes.includes(currentInterfacePrefix)) {
        //     newDeviceId = anInterface.interface_id;
        //   } else {
        //     const deviceCount = anInterface.devices.length;
        //     newDeviceId = `${anInterface.interface_id}D${deviceCount + 1}`;
        //   }
        //   const finalConfig = {
        //     ...config,
        //     device_id: newDeviceId,
        //   };

        //   console.log(
        //     "Adding a new device with generated config:",
        //     finalConfig
        //   );
        //   // await anInterface.addDevice(deviceTypeToConfigure, finalConfig);
        // }
        // --- ADD a new device ---
        else if (!isEditing && deviceTypeToConfigure) {
          let newDeviceId: string;
          const currentInterfacePrefix = anInterface.interface_id.substring(
            0,
            2
          );
          const deviceCount = anInterface.devices.length;
          let payloadToSave: Partial<DeviceConfig>;
          // --- CASE 1: HART Interface ---
          if (currentInterfacePrefix === "HI") {
            const {
              pollingAddress,
              variableType,
              commandSet,
              ...restOfConfig
            } = config;

            if (!pollingAddress || !variableType) {
              console.error(
                "Polling Address and Variable Type are required for HART device ID."
              );
              setIsSaving(false);
              return;
            }

            // This is the clean payload without the transient fields
            payloadToSave = restOfConfig;

            // Assemble the special HART device ID
            newDeviceId = `${anInterface.interface_id}T${
              deviceCount + 1
            }${variableType}${pollingAddress}`;
          }
          // --- CASE 2: Single-Device Interfaces (DI, RTD) ---
          else if (["DI", "TI"].includes(currentInterfacePrefix)) {
            newDeviceId = anInterface.interface_id;
          }
          // --- CASE 3: Default Multi-Device (MODBUS, etc.) ---
          else {
            newDeviceId = `${anInterface.interface_id}D${deviceCount + 1}`;
          }

          const finalConfig = {
            ...config,
            device_id: newDeviceId, // Overwrite with our generated ID
          };

          console.log(
            "Adding a new device with generated config:",
            finalConfig
          );
          console.log(
            "Adding a new device with generated config:",
            finalConfig
          );
          // await anInterface.addDevice(deviceTypeToConfigure, finalConfig);
        }
        closeModal();
      } catch (error) {
        console.error("Failed to save device configuration:", error);
      } finally {
        setIsSaving(false);
      }
    };

    const handleSettingsCancel = () => {
      closeModal();
      if (!anInterface.isConfigured) {
        onBack();
      }
    };

    const handleOpenSettingsModal = () => {
      const interfaceNameUpper = anInterface.name.toUpperCase();
      if (interfaceNameUpper.includes("DIGITALOUTPUT"))
        setModalView("Do_InterfaceSettings");
      else if (interfaceNameUpper.includes("DIGITALINPUT"))
        setModalView("Di_InterfaceSettings");
      else if (interfaceNameUpper.includes("RTD")) setModalView("RTDSettings");
      else if (interfaceNameUpper.includes("HART")) setModalView("HART1");
      else setModalView("modbusSettings");
    };

    const handleAddNewDeviceClick = () => {
      setIsEditing(false);
      setEditingDevice(null);
      setModalView("addDevice_selectType");
    };

    const handleDeleteDevice = () => {
      if (selectedDeviceId !== null) {
        anInterface.removeDevice(selectedDeviceId);
        setSelectedDeviceId(null);
      }
    };

    const handleDeviceClick = (device: Device) => {
      setSelectedDeviceId(device.id);
      setDeviceTypeToConfigure(device.name);
      setIsEditing(true);

      let completeInitialData = { ...device.config };

      if (
        anInterface.config.interface_type === "ModbusInterface" &&
        (anInterface.config as any).modbus_settings
      ) {
        const deviceModbusSettings = (anInterface.config as any)
          .modbus_settings[device.id];

        if (deviceModbusSettings) {
          completeInitialData.modbus_settings = deviceModbusSettings;
        }
      }

      // Create a NEW INSTANCE of the Device class with the complete data
      const updatedDeviceInstance = new Device(completeInitialData);

      // Set this new, valid instance into the state
      setEditingDevice(updatedDeviceInstance);

      setModalView("addDevice_configure");
    };

    const handleDeviceTypeSelection = (deviceType: string) => {
      setDeviceTypeToConfigure(deviceType);
      setModalView("addDevice_configure");
    };

    const closeModal = () => {
      setModalView("closed");
      setDeviceTypeToConfigure("");
      setIsEditing(false);
      setEditingDevice(null);
      setSelectedDeviceId(null);
    };

    const getModalTitle = () => {
      if (isEditing && editingDevice) {
        const label =
          deviceOptions.find((opt) => opt.value === editingDevice.name)
            ?.label || editingDevice.name;
        return `Edit ${label}`;
      }
      switch (modalView) {
        case "addDevice_selectType":
        case "addDevice_configure":
          return `Add Device for ${anInterface.interface_id}`;
        case "modbusSettings":
          return `Modbus Settings: ${anInterface.interface_id}`;
        case "RTDSettings":
          return `RTD Settings: ${anInterface.interface_id}`;
        default:
          return "";
      }
    };

    const currentConfig = anInterface.getConfig();

    const renderModalContent = () => {
      const settingsProps = {
        onSave: handleSaveInterfaceConfig,
        onClose: handleSettingsCancel,
        isSaving: isSaving,
        interface_id: anInterface.interface_id,
      };

      const deviceProps = {
        initialData: isEditing ? editingDevice?.config : null,
        onSave: handleSaveDeviceConfiguration,
        onBack: closeModal,
        interface_type: anInterface.config.interface_type,
        interface_id: anInterface.interface_id,
      };

      switch (modalView) {
        case "modbusSettings":
          return (
            <ModbusInterfaceSettingsForm
              currentConfig={currentConfig as any}
              {...settingsProps}
            />
          );
        case "RTDSettings":
          return (
            <RTDInterfaceSettingsForm
              currentConfig={currentConfig as any}
              {...settingsProps}
            />
          );
        case "HART1":
          return (
            <HartInterfaceSettingsForm
              currentConfig={currentConfig as any}
              {...settingsProps}
            />
          );
        case "Di_InterfaceSettings":
          return (
            <DI_InterfaceSettingsForm
              currentConfig={currentConfig as any}
              {...settingsProps}
            />
          );
        case "Do_InterfaceSettings":
          return (
            <DO_InterfaceSettingsForm
              currentConfig={currentConfig as any}
              {...settingsProps}
            />
          );
        case "addDevice_selectType":
          return (
            <AddDeviceForm
              onClose={closeModal}
              onNext={handleDeviceTypeSelection}
              interfaceId={anInterface.interface_id}
            />
          );
        case "addDevice_configure":
          const isGasDevice = gasDeviceTypes.includes(deviceTypeToConfigure);
          const deviceLabel =
            deviceOptions.find((d) => d.value === deviceTypeToConfigure)
              ?.label || deviceTypeToConfigure;
          if (isGasDevice) {
            return (
              <GasDeviceForm {...deviceProps} deviceTypeLabel={deviceLabel} />
            );
          }
          switch (deviceTypeToConfigure) {
            case "TemperatureDevice":
              return <TemperatureDeviceForm {...deviceProps} />;
            case "PressureDevice":
              return <PressureDeviceForm {...deviceProps} />;
            case "VolumeDevice":
              return <VolumeDeviceForm {...deviceProps} />;
            case "PulseVolumeDevice":
              return <PulseVolumeDeviceForm {...deviceProps} />;
            case "PulseFlowRateDevice":
              return <PulseFlowRateDeviceForm {...deviceProps} />;
            case "FlowRateDevice":
              return <FlowRateDeviceForm {...deviceProps} />;
            default:
              return null;
          }
        default:
          return null;
      }
    };

    return (
      <>
        <Legend />
        <div className="w-full bg-white p-4 md:p-8 rounded-2xl shadow-lg space-y-6 md:space-y-8 border border-gray-200">
          <div className="flex items-center gap-4 border-b pb-4 mb-4">
            <button
              onClick={onBack}
              className="p-2 rounded-full hover:bg-gray-100"
              aria-label="Go back"
            >
              <ArrowLeft className="h-6 w-6 text-gray-700" />
            </button>
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">
              Configure: {anInterface.interface_id}
              <span
                className={`text-sm ml-2 font-normal ${
                  anInterface.isConfigured ? "text-green-600" : "text-gray-500"
                }`}
              >
                ({anInterface.isConfigured ? "Configured" : "Unconfigured"})
              </span>
            </h1>
          </div>

          {anInterface.isConfigured ? (
            <>
              <div className="space-y-4 md:space-y-6">
                <h2 className="text-base md:text-xl font-bold font-sans text-gray-800">
                  Devices on {anInterface.name}
                </h2>
                <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-5 lg:grid-cols-6 gap-2 md:gap-4">
                  {anInterface.devices.map((device) => {
                    const deviceType = device.config?.device_type;
                    if (!deviceType) return null;
                    const deviceLabel =
                      deviceOptions.find((opt) => opt.value === deviceType)
                        ?.label || deviceType;
                    return (
                      <button
                        key={device.id}
                        onClick={() => handleDeviceClick(device)}
                        className={`relative flex flex-col items-center justify-center gap-0.5 p-1 h-20 md:h-32 md:gap-2 md:p-4 rounded-lg text-white shadow-md transition-all duration-200 ease-in-out hover:scale-105 focus:outline-none border-2 bg-gradient-to-bl ${
                          statusStyles["ok"].gradient
                        } ${
                          selectedDeviceId === device.id
                            ? "ring-2 md:ring-4 ring-offset-2 ring-yellow-400"
                            : "ring-2 ring-transparent"
                        }`}
                      >
                        <DeviceIcon
                          deviceType={deviceType}
                          className={`${statusStyles["ok"].icon} h-6 w-6 md:h-8 md:w-8`}
                        />
                        <span className="font-semibold font-sans text-[9px] leading-tight text-center md:text-sm">
                          {deviceLabel}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <div className="flex items-center gap-2 md:gap-4">
                  <button
                    onClick={handleAddNewDeviceClick}
                    className="px-4 py-1.5 md:px-5 md:py-2 text-xs md:text-sm font-semibold font-sans text-yellow-500 bg-white border border-yellow-400 rounded-full shadow-sm hover:bg-yellow-50"
                  >
                    Add Device
                  </button>
                  <button
                    onClick={handleDeleteDevice}
                    disabled={selectedDeviceId === null}
                    className="px-4 py-1.5 md:px-5 md:py-2 text-xs md:text-sm font-semibold font-sans bg-white border border-gray-300 rounded-full shadow-sm text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:enabled:bg-gray-100"
                  >
                    Delete Device
                  </button>
                </div>
              </div>
              <div className="border-t pt-6 md:pt-8 space-y-4">
                <div className="flex justify-center">
                  <button
                    onClick={handleOpenSettingsModal}
                    className="w-full flex justify-center items-center gap-2 py-2 md:py-3 text-sm md:text-lg font-semibold font-sans text-black bg-[#FFB700] border border-[#F5F5F5] rounded-full shadow-lg hover:shadow-xl hover:bg-yellow-500 transition-all"
                  >
                    <Settings size={20} />
                    <span>{anInterface.name} Setting</span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">
                This interface is not configured yet.
              </p>
              <p className="text-gray-400 mt-2">
                The configuration form has been opened automatically.
              </p>
            </div>
          )}
        </div>
        <MuiModalWrapper
          open={modalView !== "closed"}
          onClose={handleSettingsCancel}
          title={getModalTitle()}
        >
          {renderModalContent()}
        </MuiModalWrapper>
      </>
    );
  }
);
export default ConfigureInterface;
