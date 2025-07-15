import { useState } from "react";
import { Thermometer, Settings, ArrowLeft } from "lucide-react";
import MuiModalWrapper from "./MuiModalWrapper";
import TemperatureDeviceForm from "./TemperatureDeviceForm.tsx";
import ModbusInterfaceSettingsForm from "./ModbusInterfaceSettingsForm.tsx";
import AddDeviceForm from "./AddDeviceForm.tsx";
import { observer } from "mobx-react-lite";
import { Interface } from "../../stores/Interface.tsx";
import { Device } from "../../stores/Device.tsx";
import type { InterfaceConfig } from "../../types/interfaceConfig.tsx";
import type { DeviceConfig } from "../../types/device.tsx"; // <--- Import DeviceConfig

interface ConfigureInterfaceProps {
  anInterface: Interface;
  onBack: () => void;
}

type DeviceStatus = "ok" | "warning" | "error";

type ModalView =
  | "closed"
  | "modbusSettings"
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

const ConfigureInterface = observer(
  ({ anInterface, onBack }: ConfigureInterfaceProps) => {
    const [selectedDeviceId, setSelectedDeviceId] = useState<number | null>(
      null
    );
    const [modalView, setModalView] = useState<ModalView>("closed");
    const [deviceTypeToConfigure, setDeviceTypeToConfigure] =
      useState<string>("");
    const [isEditing, setIsEditing] = useState(false);

    const handleSaveInterfaceConfig = (config: InterfaceConfig) => {
      anInterface.updateConfig(config);
      closeModal();
    };

    const handleAddNewDeviceClick = () => {
      setIsEditing(false);
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
    };

    const handleDeviceTypeSelection = (deviceType: string) => {
      setDeviceTypeToConfigure(deviceType);
      setModalView("addDevice_configure");
    };

    // --- THIS IS THE FINAL ACTION ---
    // It receives the config from the form and calls the MobX action
    const handleSaveDeviceConfiguration = (config: DeviceConfig) => {
      if (!deviceTypeToConfigure) {
        closeModal();
        return;
      }

      if (!isEditing) {
        anInterface.addDevice(
          Date.now(),
          deviceTypeToConfigure, // The name of the new device
          config // The configuration from the form
        );
      }
      closeModal();
    };

    const closeModal = () => {
      setModalView("closed");
      setDeviceTypeToConfigure("");
      setIsEditing(false);
    };

    const getModalTitle = () => {
      switch (modalView) {
        case "modbusSettings":
          return `${anInterface.name} Settings`;
        case "addDevice_selectType":
          return `Add Device for ${anInterface.name}`;
        case "addDevice_configure":
          return `Configure New ${deviceTypeToConfigure} Device`;
        default:
          return "";
      }
    };

    return (
      <>
        <div className="w-full bg-white p-4 md:p-8 rounded-2xl shadow-lg space-y-6 md:space-y-8 border border-gray-200">
          <div className="flex items-center gap-4 border-b pb-4 mb-4">
            <button
              onClick={onBack}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Go back to interfaces list"
            >
              <ArrowLeft className="h-6 w-6 text-gray-700" />
            </button>
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">
              Configure: {anInterface.name}
            </h1>
          </div>

          <div className="space-y-4 md:space-y-6">
            <h2 className="text-base md:text-xl font-bold font-sans text-gray-800">
              Devices on {anInterface.name}
            </h2>
            <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-5 lg:grid-cols-6 gap-2 md:gap-4">
              {anInterface.devices.map((device) => (
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
                  <Thermometer
                    className={statusStyles["ok"].icon}
                    size={24}
                    strokeWidth={2.5}
                  />
                  <span className="font-semibold font-sans text-[9px] leading-tight text-center md:text-sm">
                    {device.name}
                  </span>
                </button>
              ))}
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
                onClick={() => setModalView("modbusSettings")}
                className="w-full flex justify-center items-center gap-2 py-2 md:py-3 text-sm md:text-lg font-semibold font-sans text-black bg-[#FFB700] border border-[#F5F5F5] rounded-full shadow-lg hover:shadow-xl hover:bg-yellow-500 transition-all"
              >
                <Settings size={20} />
                <span>{anInterface.name} Interface Settings</span>
              </button>
            </div>
          </div>
        </div>

        <MuiModalWrapper
          open={modalView !== "closed"}
          onClose={closeModal}
          title={getModalTitle()}
        >
          <>
            {modalView === "modbusSettings" && (
              <ModbusInterfaceSettingsForm
                currentConfig={anInterface.getConfig()}
                onSave={handleSaveInterfaceConfig}
                onClose={closeModal}
              />
            )}
            {modalView === "addDevice_selectType" && (
              <AddDeviceForm
                onClose={closeModal}
                onNext={handleDeviceTypeSelection}
              />
            )}
            {modalView === "addDevice_configure" &&
              deviceTypeToConfigure === "Temperature" && (
                <TemperatureDeviceForm
                  onSave={handleSaveDeviceConfiguration}
                  onBack={() => setModalView("addDevice_selectType")}
                />
              )}
            {/* You can add more forms here for other device types */}
            {/* {modalView === "addDevice_configure" && deviceTypeToConfigure === "Pressure" && <PressureDeviceForm ... />} */}
          </>
        </MuiModalWrapper>
      </>
    );
  }
);

export default ConfigureInterface;
