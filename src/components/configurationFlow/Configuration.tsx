import { useState } from "react";
import { Thermometer, Gauge, MoveHorizontal, List } from "lucide-react";

// 1. Import the new MUI Modal Wrapper and the refactored Form components
import MuiModalWrapper from "./MuiModalWrapper"; // Assuming this is in the same folder
import VolumeForm from "./VolumeForm";
import TemperatureForm from "./TemperatureForm";
import PressureForm from "./PressureForm";
import ConversionForm from "./ConversionForm";

// 2. Define a type for the modal state for better type safety
type ModalType = "volume" | "temperature" | "pressure" | "conversion";

// 3. A configuration object to map modal types to their titles and components.
// This makes the rendering logic much cleaner and more scalable.
const modalConfig = {
  volume: { title: "Configure Volume", Component: VolumeForm },
  temperature: { title: "Configure Temperature", Component: TemperatureForm },
  pressure: { title: "Configure Pressure", Component: PressureForm },
  conversion: { title: "Conversion Settings", Component: ConversionForm },
};


const Configuration = () => {
  // The state now uses the ModalType we defined
  const [activeModal, setActiveModal] = useState<ModalType | null>(null);

  const closeModal = () => setActiveModal(null);
  const openModal = (modalType: ModalType) => setActiveModal(modalType);

  // Dynamically get the current modal's content component, if one is active
  const ModalContent = activeModal ? modalConfig[activeModal].Component : null;

  return (
    <div className="py-6 w-full max-w-screen-xl mx-auto space-y-6">
      {/* Top Buttons (Unchanged) */}
      <div className="flex justify-end gap-4">
        <button className="px-4 py-2 bg-white text-gray-800 rounded-full shadow-md border border-gray-200 hover:bg-gray-100 transition">
          Stream Configuration
        </button>
        <button className="px-4 py-2 bg-yellow-500 text-black rounded-full shadow-md font-semibold">
          Interfaces Configuration
        </button>
      </div>

      {/* Main Outer Card (Unchanged) */}
      <div className="bg-white rounded-2xl shadow-md py-2 px-2 border border-gray-200 space-y-8">
        
        {/* Visualization Section for Desktop (Unchanged) */}
        <div className="hidden md:block bg-white rounded-2xl p-6 border border-gray-200">
          <div className="flex flex-row flex-wrap justify-around items-center gap-4 sm:gap-8">
            {/* Volume */}
            <div className="flex flex-col items-center">
              <span className="text-yellow-500 font-semibold text-sm">Volume</span>
              <div className="w-10 h-48 border-4 border-black rounded-md relative mt-2 bg-white flex flex-col justify-end">
                <div className="w-full h-2/3 bg-gradient-to-t from-gray-400 to-white" />
              </div>
            </div>
            {/* Cylinder with Particles */}
            <div className="relative bg-gradient-to-t from-gray-500 to-gray-300 w-40 h-48 rounded-t-3xl border-4 border-black flex flex-wrap content-start items-start p-2 gap-1.5">
              {Array.from({ length: 14 }).map((_, i) => (
                <div key={i} className="w-4 h-4 bg-white border border-black rounded-full"></div>
              ))}
            </div>
            {/* Temperature */}
            <div className="flex flex-col items-center">
              <span className="text-yellow-500 font-semibold text-sm">Temperature</span>
              <div className="flex items-center mt-2">
                <div className="w-6 h-48 bg-white border-4 border-black rounded-full flex flex-col-reverse overflow-hidden relative">
                  <div className="h-2/5 bg-red-600 w-full rounded-b-full" />
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-6 bg-red-600 border-4 border-black rounded-full" />
                </div>
                <div className="ml-2 text-xs space-y-4 text-black font-semibold">
                  <div>100°C</div>
                  <div>50°C</div>
                  <div>0°C</div>
                </div>
              </div>
            </div>
            {/* Pressure */}
            <div className="flex flex-col items-center">
              <span className="text-yellow-500 font-semibold text-sm mb-2">Pressure</span>
              <div className="relative w-36 h-36 rounded-full border-[6px] border-black flex items-center justify-center">
                <div className="absolute w-1 h-16 bg-yellow-500 origin-bottom rotate-[300deg]" />
                <div className="absolute w-4 h-4 bg-yellow-500 rounded-full" />
                <div className="absolute bottom-2 text-sm text-black font-semibold">
                  x10<sup>5</sup>N/m<sup>2</sup>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4-CARD TABLET-ONLY LAYOUT (Unchanged) */}
        <div className="md:hidden bg-white rounded-2xl py-4 px-2 border border-gray-200">
          <h2 className="text-center text-gray-500 text-sm mb-4">Main Reading</h2>
          <div className="flex flex-col sm:flex-row justify-between gap-4 sm:gap-2">
            {["Volume", "Temperature", "Pressure", "Conversion"].map((label) => (
              <div
                key={label}
                className="flex-1 border rounded-xl shadow p-4 flex flex-col items-center justify-center min-w-[100px] bg-white"
              >
                <h3 className="text-md font-semibold text-gray-800 mb-4">{label}</h3>
                <div className="flex flex-col items-center space-y-1 text-sm">
                  <div>
                    Positive: <span className="text-green-600 font-semibold">75%</span>
                  </div>
                  <div>
                    Negative: <span className="text-red-600 font-semibold">75%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Control Buttons Section (onClick handlers updated) */}
        <div className="bg-white rounded-2xl py-6 px-2 border border-gray-200">
          <div className="flex flex-wrap justify-between gap-2 sm:gap-4">
            <button
              onClick={() => openModal("volume")}
              className="flex-1 min-w-[70px] sm:min-w-[100px] max-w-[150px] flex items-center justify-center gap-1 sm:gap-2 py-2 px-3 sm:py-3 sm:px-4 text-xs sm:text-sm border rounded-xl shadow-sm hover:bg-gray-100 transition"
            >
              <List className="text-yellow-500" size={18} />
              <span className="font-medium">Volume</span>
            </button>
            <button
              onClick={() => openModal("temperature")}
              className="flex-1 min-w-[70px] sm:min-w-[100px] max-w-[150px] flex items-center justify-center gap-1 sm:gap-2 py-2 px-3 sm:py-3 sm:px-4 text-xs sm:text-sm border rounded-xl shadow-sm hover:bg-gray-100 transition"
            >
              <Thermometer className="text-yellow-500" size={18} />
              <span className="font-medium">Temperature</span>
            </button>
            <button
              onClick={() => openModal("pressure")}
              className="flex-1 min-w-[70px] sm:min-w-[100px] max-w-[150px] flex items-center justify-center gap-1 sm:gap-2 py-2 px-3 sm:py-3 sm:px-4 text-xs sm:text-sm border rounded-xl shadow-sm hover:bg-gray-100 transition"
            >
              <Gauge className="text-yellow-500" size={18} />
              <span className="font-medium">Pressure</span>
            </button>
            <button
              onClick={() => openModal("conversion")}
              className="flex-1 min-w-[70px] sm:min-w-[100px] max-w-[150px] flex items-center justify-center gap-1 sm:gap-2 py-2 px-3 sm:py-3 sm:px-4 text-xs sm:text-sm border rounded-xl shadow-sm hover:bg-gray-100 transition"
            >
              <MoveHorizontal className="text-yellow-500" size={18} />
              <span className="font-medium">Conversion</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. The new Material-UI Modal logic */}
      <MuiModalWrapper
        open={activeModal !== null}
        onClose={closeModal}
        title={activeModal ? modalConfig[activeModal].title : ""}
      >
        {/* Render the active modal's content component, passing the closeModal function */}
        {ModalContent && <ModalContent onClose={closeModal} />}
      </MuiModalWrapper>
    </div>
  );
};

export default Configuration;