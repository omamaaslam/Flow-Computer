import { useState } from "react";
import { Thermometer, Settings } from "lucide-react";

import MuiModalWrapper from "./MuiModalWrapper";
import TemperatureDeviceForm from "./TemperatureDeviceForm.tsx";
import ModbusInterfaceSettingsForm from "./ModbusInterfaceSettingsForm.tsx";
import AddDeviceForm from "./AddDeviceForm.tsx";

// --- TypeScript Definitions ---
type DeviceStatus = "ok" | "warning" | "error"; // REMOVED "inactive"

interface Device {
  id: number;
  type: string;
  status: DeviceStatus;
}

type ModalView =
  | "closed"
  | "modbusSettings"
  | "addDevice_selectType"
  | "addDevice_configure";

// --- Mock Data & Styles ---
// MODIFIED: Removed all "inactive" devices from the initial state
const initialDevices: Device[] = [
  { id: 1, type: "Temperature", status: "warning" },
  { id: 2, type: "Temperature", status: "error" },
  { id: 3, type: "Temperature", status: "warning" },
  { id: 4, type: "Temperature", status: "ok" },
  { id: 6, type: "Temperature", status: "error" },
  { id: 7, type: "Temperature", status: "error" },
  { id: 8, type: "Temperature", status: "ok" },
];

// Inactive style is no longer used for devices but can be kept for other potential uses
const statusStyles: Record<
  DeviceStatus | "inactive",
  { gradient: string; icon: string }
> = {
  ok: { gradient: "from-black to-lime-500", icon: "text-yellow-400" },
  warning: { gradient: "from-black to-yellow-500", icon: "text-yellow-400" },
  error: { gradient: "from-black to-red-600", icon: "text-yellow-400" },
  inactive: { gradient: "from-gray-700 to-gray-500", icon: "text-yellow-400" },
};

// --- The Main Page Component ---
const InterfaceSettingsPage = () => {
  const [devices, setDevices] = useState<Device[]>(initialDevices);
  const [selectedDeviceId, setSelectedDeviceId] = useState<number | null>(null);

  const [modalView, setModalView] = useState<ModalView>("closed");
  const [deviceTypeToConfigure, setDeviceTypeToConfigure] =
    useState<string>("");
  const [deviceToConfigureId, setDeviceToConfigureId] = useState<number | null>(
    null
  );
  const [isEditing, setIsEditing] = useState(false);

  // --- MODIFIED: This button now opens the modal to start the 'Add Device' flow ---
  const handleAddNewDeviceClick = () => {
    setIsEditing(false); // This is a new device, not an edit
    setModalView("addDevice_selectType");
  };

  const handleDeleteDevice = () => {
    if (selectedDeviceId === null) return;
    setDevices((prev) =>
      prev.filter((device) => device.id !== selectedDeviceId)
    );
    setSelectedDeviceId(null);
  };

  // --- MODIFIED: Clicking a device is now ALWAYS for editing an existing one ---
  const handleDeviceClick = (device: Device) => {
    setIsEditing(true);
    setDeviceToConfigureId(device.id);
    setDeviceTypeToConfigure(device.type);
    setModalView("addDevice_configure"); // Skip directly to the configuration form
  };

  const handleDeviceTypeSelection = (deviceType: string) => {
    setDeviceTypeToConfigure(deviceType);
    setModalView("addDevice_configure");
  };

  // --- MODIFIED: Logic now handles both CREATING and UPDATING devices ---
  const handleSaveDeviceConfiguration = () => {
    if (!deviceTypeToConfigure) {
      console.error("Configuration save failed: Missing device type.");
      closeModal();
      return;
    }

    if (isEditing) {
      // --- UPDATE an existing device ---
      setDevices((prevDevices) =>
        prevDevices.map((device) =>
          device.id === deviceToConfigureId
            ? { ...device, type: deviceTypeToConfigure }
            : device
        )
      );
    } else {
      // --- CREATE a new device ---
      const newDevice: Device = {
        id: Date.now(),
        type: deviceTypeToConfigure,
        status: "ok", // New devices start with an 'ok' status
      };
      setDevices((prevDevices) => [...prevDevices, newDevice]);
    }

    closeModal();
  };

  const closeModal = () => {
    setModalView("closed");
    setDeviceToConfigureId(null);
    setDeviceTypeToConfigure("");
    setIsEditing(false);
  };

  const getModalTitle = () => {
    switch (modalView) {
      case "modbusSettings":
        return "Modbus Settings";
      case "addDevice_selectType":
        return "Add Device for MODBUS";
      case "addDevice_configure":
        return `${
          isEditing ? "Edit" : "Configure"
        } ${deviceTypeToConfigure} Device`;
      default:
        return "";
    }
  };

  return (
    <>
      <div className="w-full min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="w-full max-w-4xl bg-white p-4 md:p-8 rounded-2xl shadow-lg space-y-6 md:space-y-8">
          <div className="space-y-4 md:space-y-6">
            <h2 className="text-base md:text-xl font-bold font-sans text-gray-800">
              Devices
            </h2>
            <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-5 lg:grid-cols-6 gap-2 md:gap-4">
              {/* The list now only maps over active devices */}
              {devices.map((device) => (
                <button
                  key={device.id}
                  onClick={() => handleDeviceClick(device)}
                  className={`relative flex flex-col items-center justify-center gap-0.5 p-1 h-20 md:h-32 md:gap-2 md:p-4 rounded-lg text-white shadow-md transition-all duration-200 ease-in-out hover:scale-105 focus:outline-none border-2 bg-gradient-to-bl ${
                    statusStyles[device.status].gradient
                  } ${
                    selectedDeviceId === device.id
                      ? "ring-2 md:ring-4 ring-offset-2 ring-yellow-400"
                      : "ring-2 ring-transparent"
                  }`}
                >
                  <Thermometer
                    className={statusStyles[device.status].icon}
                    size={24}
                    strokeWidth={2.5}
                  />
                  <span className="font-semibold font-sans text-[9px] leading-tight text-center md:text-sm">
                    {device.type}
                  </span>
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 md:gap-4">
              {/* MODIFIED: onClick handler is now for starting the add flow */}
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
          <div className="border-t pt-6 md:pt-8">
            <div className="flex justify-center">
              <button
                onClick={() => setModalView("modbusSettings")}
                className="w-full flex justify-center items-center gap-2 py-2 md:py-3 text-sm md:text-lg font-semibold font-sans text-black bg-[#FFB700] border border-[#F5F5F5] rounded-full shadow-lg hover:shadow-xl hover:bg-yellow-500 transition-all"
              >
                <Settings size={20} />
                <span>Interface Settings</span>
              </button>
            </div>
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
            <ModbusInterfaceSettingsForm onClose={closeModal} />
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
                onBack={
                  isEditing
                    ? closeModal
                    : () => setModalView("addDevice_selectType")
                }
              />
            )}
        </>
      </MuiModalWrapper>
    </>
  );
};

export default InterfaceSettingsPage;
