// ConfigureInterface.tsx
// This component is a modified version of your InterfaceSettingsPage.
// It is designed to configure a SINGLE interface passed via props.
import { useState, useEffect } from "react";
import { Thermometer, Settings, ArrowLeft } from "lucide-react";
import MuiModalWrapper from "./MuiModalWrapper";
import TemperatureDeviceForm from "./TemperatureDeviceForm.tsx";
import ModbusInterfaceSettingsForm from "./ModbusInterfaceSettingsForm.tsx";
import AddDeviceForm from "./AddDeviceForm.tsx";
import { observer } from "mobx-react-lite";
import { Interface } from "../../stores/Interface.tsx";
import type { InterfaceConfig } from "../../types/interfaceConfig.tsx";

// --- PROPS DEFINITION ---
// This component now receives the ID of the interface to configure and a function to go back.
interface ConfigureInterfaceProps {
  interfaceId: string;
  onBack: () => void;
}

// --- Helper types and constants from your original file ---
type DeviceStatus = "ok" | "warning" | "error";
interface Device { id: number; type: string; status: DeviceStatus; }
type ModalView = "closed" | "modbusSettings" | "addDevice_selectType" | "addDevice_configure";
const initialDevices: Device[] = [{ id: 1, type: "Temperature", status: "warning" }];
const statusStyles: Record<DeviceStatus | "inactive", { gradient: string; icon: string }> = {
  ok: { gradient: "from-black to-lime-500", icon: "text-yellow-400" },
  warning: { gradient: "from-black to-yellow-500", icon: "text-yellow-400" },
  error: { gradient: "from-black to-red-600", icon: "text-yellow-400" },
  inactive: { gradient: "from-gray-700 to-gray-500", icon: "text-yellow-400" },
};

// --- COMPONENT LOGIC ---
const ConfigureInterface = observer(({ interfaceId, onBack }: ConfigureInterfaceProps) => {
  // State for devices, modals etc. remains internal to this component.
  const [devices, setDevices] = useState<Device[]>(initialDevices);
  const [selectedDeviceId, setSelectedDeviceId] = useState<number | null>(null);
  const [interfaceName, setInterfaceName] = useState<string>("");
  const [modalView, setModalView] = useState<ModalView>("closed");
  const [deviceTypeToConfigure, setDeviceTypeToConfigure] = useState<string>("");
  const [deviceToConfigureId, setDeviceToConfigureId] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // This map of all possible interfaces can stay.
  const [interfaceInstances] = useState<Record<string, Interface>>(() => ({
    MOD: new Interface(1, "MODBUS", { baudrate: "", dataBits: 8, maxSlaves: 32, parity: "Even", stopBits: 1, pullUpDown: "Enabled", timeoutMs: 1000, pollIntervalMs: 5000, retryCount: 3 }),
    DI1: new Interface(2, "Digital Input 1"), DI2: new Interface(3, "Digital Input 2"), DI3: new Interface(4, "Digital Input 3"), DI4: new Interface(5, "Digital Input 4"), DI5: new Interface(6, "Digital Input 5"),
    DO1: new Interface(7, "Digital Output 1"), DO2: new Interface(8, "Digital Output 2"), DO3: new Interface(9, "Digital Output 3"), DO4: new Interface(10, "Digital Output 4"), DO5: new Interface(11, "Digital Output 5"),
    AI1: new Interface(12, "Analog Input 1"), AI2: new Interface(13, "Analog Input 2"), AO1: new Interface(14, "Analog Output 1"), AO2: new Interface(15, "Analog Output 2"),
    HART1: new Interface(16, "HART 1"), HART2: new Interface(17, "HART 2"), RTD: new Interface(18, "RTD"),
  }));

  // When the interfaceId prop changes, update the display name.
  useEffect(() => {
    const nameMap: Record<string, string> = {
      MOD: "MODBUS", DI1: "Digital Input 1", DI2: "Digital Input 2", DI3: "Digital Input 3", DI4: "Digital Input 4", DI5: "Digital Input 5",
      DO1: "Digital Output 1", DO2: "Digital Output 2", DO3: "Digital Output 3", DO4: "Digital Output 4", DO5: "Digital Output 5",
      AI1: "Analog Input 1", AI2: "Analog Input 2", AO1: "Analog Output 1", AO2: "Analog Output 2",
      HART1: "HART 1", HART2: "HART 2", RTD: "RTD",
    };
    setInterfaceName(nameMap[interfaceId] || interfaceId);
  }, [interfaceId]);

  const handleSaveInterfaceConfig = (config: InterfaceConfig) => {
    // Use the `interfaceId` prop directly
    interfaceInstances[interfaceId].updateConfig(config);
    closeModal();
  };

  const handleAddNewDeviceClick = () => { setIsEditing(false); setModalView("addDevice_selectType"); };
  const handleDeleteDevice = () => { if (selectedDeviceId === null) return; setDevices((prev) => prev.filter((device) => device.id !== selectedDeviceId)); setSelectedDeviceId(null); };
  const handleDeviceClick = (device: Device) => { setIsEditing(true); setDeviceToConfigureId(device.id); setDeviceTypeToConfigure(device.type); setModalView("addDevice_configure"); };
  const handleDeviceTypeSelection = (deviceType: string) => { setDeviceTypeToConfigure(deviceType); setModalView("addDevice_configure"); };
  const handleSaveDeviceConfiguration = () => {
    if (!deviceTypeToConfigure) { closeModal(); return; }
    if (isEditing) { setDevices((prev) => prev.map((d) => d.id === deviceToConfigureId ? { ...d, type: deviceTypeToConfigure } : d)); } 
    else { setDevices((prev) => [...prev, { id: Date.now(), type: deviceTypeToConfigure, status: "ok" }]); }
    closeModal();
  };
  const closeModal = () => { setModalView("closed"); setDeviceToConfigureId(null); setDeviceTypeToConfigure(""); setIsEditing(false); };

  const getModalTitle = () => {
    switch (modalView) {
      case "modbusSettings": return `${interfaceName} Settings`;
      case "addDevice_selectType": return `Add Device for ${interfaceName}`;
      case "addDevice_configure": return `${isEditing ? "Edit" : "Configure"} ${deviceTypeToConfigure} Device`;
      default: return "";
    }
  };

  return (
    <>
      <div className="w-full bg-white p-4 md:p-8 rounded-2xl shadow-lg space-y-6 md:space-y-8 border border-gray-200">
        
        {/* --- ADDED HEADER with Back Button --- */}
        <div className="flex items-center gap-4 border-b pb-4 mb-4">
            <button
              onClick={onBack}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Go back to interfaces list"
            >
              <ArrowLeft className="h-6 w-6 text-gray-700" />
            </button>
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">
              Configure: {interfaceName}
            </h1>
        </div>

        <div className="space-y-4 md:space-y-6">
          <h2 className="text-base md:text-xl font-bold font-sans text-gray-800">
            Devices on {interfaceName}
          </h2>
          <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-5 lg:grid-cols-6 gap-2 md:gap-4">
            {devices.map((device) => (
              <button key={device.id} onClick={() => handleDeviceClick(device)} className={`relative flex flex-col items-center justify-center gap-0.5 p-1 h-20 md:h-32 md:gap-2 md:p-4 rounded-lg text-white shadow-md transition-all duration-200 ease-in-out hover:scale-105 focus:outline-none border-2 bg-gradient-to-bl ${statusStyles[device.status].gradient} ${selectedDeviceId === device.id ? "ring-2 md:ring-4 ring-offset-2 ring-yellow-400" : "ring-2 ring-transparent"}`}>
                <Thermometer className={statusStyles[device.status].icon} size={24} strokeWidth={2.5}/>
                <span className="font-semibold font-sans text-[9px] leading-tight text-center md:text-sm">{device.type}</span>
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <button onClick={handleAddNewDeviceClick} className="px-4 py-1.5 md:px-5 md:py-2 text-xs md:text-sm font-semibold font-sans text-yellow-500 bg-white border border-yellow-400 rounded-full shadow-sm hover:bg-yellow-50">
              Add Device
            </button>
            <button onClick={handleDeleteDevice} disabled={selectedDeviceId === null} className="px-4 py-1.5 md:px-5 md:py-2 text-xs md:text-sm font-semibold font-sans bg-white border border-gray-300 rounded-full shadow-sm text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:enabled:bg-gray-100">
              Delete Device
            </button>
          </div>
        </div>

        <div className="border-t pt-6 md:pt-8 space-y-4">
            {/* --- REMOVED InterfacesConfiguration Component --- */}
            {/* The overview SVG is no longer rendered here. */}
            
            <div className="flex justify-center">
              <button onClick={() => setModalView("modbusSettings")} className="w-full flex justify-center items-center gap-2 py-2 md:py-3 text-sm md:text-lg font-semibold font-sans text-black bg-[#FFB700] border border-[#F5F5F5] rounded-full shadow-lg hover:shadow-xl hover:bg-yellow-500 transition-all">
                <Settings size={20} />
                <span>{interfaceName} Interface Settings</span>
              </button>
            </div>
        </div>
      </div>

      <MuiModalWrapper open={modalView !== "closed"} onClose={closeModal} title={getModalTitle()}>
        <>
          {modalView === "modbusSettings" && (
            <ModbusInterfaceSettingsForm
              currentConfig={interfaceInstances[interfaceId].getConfig()}
              onSave={handleSaveInterfaceConfig}
              onClose={closeModal}
            />
          )}
          {modalView === "addDevice_selectType" && (
            <AddDeviceForm onClose={closeModal} onNext={handleDeviceTypeSelection} />
          )}
          {modalView === "addDevice_configure" && deviceTypeToConfigure === "Temperature" && (
            <TemperatureDeviceForm onSave={handleSaveDeviceConfiguration} onBack={isEditing ? closeModal : () => setModalView("addDevice_selectType")} />
          )}
        </>
      </MuiModalWrapper>
    </>
  );
});

export default ConfigureInterface;