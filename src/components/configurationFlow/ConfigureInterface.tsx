// ConfigureInterface.tsx
import { useState } from "react";
import { Thermometer, ArrowLeft } from "lucide-react"; // --- MODIFIED: Import a back icon ---

// --- TypeScript Definitions ---
type DeviceStatus = "ok" | "warning" | "error" | "inactive";
interface Device {
  id: number;
  type: string;
  status: DeviceStatus;
}

// --- NEW: Define the props this component expects from its parent ---
interface ConfigureInterfaceProps {
  interfaceId: string; // The ID of the interface being configured (e.g., "MOD")
  onBack: () => void;      // The function to call to go back to the list
}

// --- Mock Data (Unchanged) ---
const initialDevices: Device[] = [
  { id: 1, type: "Temperature", status: "warning" },
];
const statusStyles: Record<DeviceStatus, { gradient: string; icon: string }> = {
  ok: { gradient: "from-black to-lime-500", icon: "text-yellow-400" },
  warning: { gradient: "from-black to-yellow-500", icon: "text-yellow-400" },
  error: { gradient: "from-black to-red-600", icon: "text-yellow-400" },
  inactive: { gradient: "from-gray-700 to-gray-500", icon: "text-yellow-400" },
};

// --- MODIFIED: The component now accepts 'interfaceId' and 'onBack' props ---
const ConfigureInterface = ({ interfaceId, onBack }: ConfigureInterfaceProps) => {
  const [devices, setDevices] = useState<Device[]>(initialDevices);
  const [selectedDeviceId, setSelectedDeviceId] = useState<number | null>(null);

  const handleAddDevice = () => {
    const newDevice: Device = { id: Date.now(), type: "Temperature", status: "inactive" };
    setDevices((prev) => [...prev, newDevice]);
  };

  const handleDeleteDevice = () => {
    if (selectedDeviceId === null) return;
    setDevices((prev) => prev.filter((device) => device.id !== selectedDeviceId));
    setSelectedDeviceId(null);
  };

  return (
    // --- MODIFIED: Removed outer full-screen div to allow it to embed properly ---
    <div className="w-full max-w-4xl bg-white p-4 md:p-8 rounded-2xl shadow-lg space-y-6 md:space-y-8 mx-auto">
      {/* --- NEW: Header with dynamic title and a back button --- */}
      <div className="flex items-center gap-4 border-b border-gray-200 pb-4">
        <button
          onClick={onBack}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Go back to interfaces list"
        >
          <ArrowLeft className="h-6 w-6 text-gray-600" />
        </button>
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">
          Configure Interface: <span className="text-yellow-600 font-mono">{interfaceId}</span>
        </h1>
      </div>

      <div className="space-y-4 md:space-y-6">
        <h2 className="text-base md:text-xl font-bold text-gray-800">
          Devices
        </h2>
        <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-5 lg:grid-cols-6 gap-2 md:gap-4">
          {devices.map((device) => {
            const styles = statusStyles[device.status];
            const isSelected = selectedDeviceId === device.id;

            return (
              <button
                key={device.id}
                onClick={() => setSelectedDeviceId(device.id)}
                className={`relative flex flex-col items-center justify-center gap-0.5 p-1 h-20 md:h-32 md:gap-2 md:p-4 rounded-lg text-white shadow-md transition-all duration-200 ease-in-out hover:scale-105 focus:outline-none border-2 
                  bg-gradient-to-bl ${styles.gradient} 
                  ${ isSelected ? "ring-2 md:ring-4 ring-offset-2 ring-yellow-400" : "ring-2 ring-transparent" }`}
              >
                <Thermometer className={styles.icon} size={24} strokeWidth={2.5}/>
                <span className="font-semibold text-[9px] leading-tight text-center md:text-sm">
                  {device.type}
                </span>
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          <button
            onClick={handleAddDevice}
            className="px-4 py-1.5 md:px-5 md:py-2 text-xs md:text-sm font-semibold text-yellow-500 bg-white border border-yellow-400 rounded-full shadow-sm hover:bg-yellow-50"
          >
            Add Device
          </button>
          <button
            onClick={handleDeleteDevice}
            disabled={selectedDeviceId === null}
            className="px-4 py-1.5 md:px-5 md:py-2 text-xs md:text-sm font-semibold bg-white border border-gray-300 rounded-full shadow-sm text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:enabled:bg-gray-100"
          >
            Delete Device
          </button>
        </div>
      </div>

      <div className="border-t pt-6 md:pt-8">
        <div className="flex justify-center">
          <button className="w-full max-w-sm py-2 md:py-3 text-sm md:text-lg font-semibold text-gray-600 bg-white border border-gray-200 rounded-full shadow-lg hover:shadow-xl hover:bg-gray-50 transition-all">
            Interface Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfigureInterface;