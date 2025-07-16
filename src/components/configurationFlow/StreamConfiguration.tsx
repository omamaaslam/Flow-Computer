// src/components/configurationFlow/StreamConfiguration.tsx
import { useState } from "react";
import { observer } from "mobx-react-lite";
import { Thermometer, Gauge, MoveHorizontal, List } from "lucide-react";
import MuiModalWrapper from "./MuiModalWrapper";
import VolumeForm from "./VolumeForm";
import TemperatureForm from "./TemperatureForm";
import PressureForm from "./PressureForm";
import ConversionForm from "./ConversionForm";
import globalStore from "../../stores/GlobalStore";
import { useParams } from "react-router-dom";
import type {
  TemperatureConfig,
  PressureConfig,
  VolumeConfig,
} from "../../types/streamConfig";

type ModalType = "volume" | "temperature" | "pressure" | "conversion";

const StreamConfiguration = observer(() => {
  const [activeModal, setActiveModal] = useState<ModalType | null>(null);
  const { streamId } = useParams<{ streamId: string }>();

  // Find the current stream from the global store using the ID from the URL
  const currentStream = globalStore.streams.find(
    (s) => s.id.toString() === streamId
  );

  const closeModal = () => setActiveModal(null);
  const openModal = (modalType: ModalType) => setActiveModal(modalType);

  // --- SAVE HANDLERS ---
  const handleSaveTemperatureConfig = (config: TemperatureConfig) => {
    currentStream?.updateTemperatureConfig(config);
    console.log("Saved Temperature Config to MobX:", config);
  };
  const handleSavePressureConfig = (config: PressureConfig) => {
    currentStream?.updatePressureConfig(config);
    console.log("Saved Pressure Config to MobX:", config);
  };
  const handleSaveVolumeConfig = (config: VolumeConfig) => {
    currentStream?.updateVolumeConfig(config);
    console.log("Saved Volume Config to MobX:", config);
  };

  // If the stream isn't found, don't render the component
  if (!currentStream) {
    return <div>Stream with ID {streamId} not found.</div>;
  }

  const modalConfig = {
    volume: {
      title: "Configure Volume",
      Component: (props:any) => (
        <VolumeForm
          {...props}
          initialData={currentStream.config.volume}
          onSave={handleSaveVolumeConfig}
        />
      ),
    },
    temperature: {
      title: "Configure Temperature",
      Component: (props:any) => (
        <TemperatureForm
          {...props}
          initialData={currentStream.config.temperature}
          onSave={handleSaveTemperatureConfig}
        />
      ),
    },
    pressure: {
      title: "Configure Pressure",
      Component: (props: any) => (
        <PressureForm
          {...props}
          initialData={currentStream.config.pressure}
          onSave={handleSavePressureConfig}
        />
      ),
    },
    conversion: { title: "Conversion Settings", Component: ConversionForm },
  };

  const ModalContent = activeModal ? modalConfig[activeModal].Component : null;

  return (
    <>
      <div className="bg-white rounded-2xl shadow-md py-2 px-2 border border-gray-200 space-y-8">
        {/* Your existing JSX for visualization and buttons... */}
        <div className="hidden md:block bg-white rounded-2xl p-6 border border-gray-200">
          {/*...Visualization...*/}
        </div>
        <div className="bg-white rounded-2xl py-6 px-2 border border-gray-200">
          <div className="flex flex-wrap justify-between gap-2 sm:gap-4">
            <button
              onClick={() => openModal("volume")}
              className="flex-1 min-w-[70px] sm:min-w-[100px] max-w-[150px] flex items-center justify-center gap-1 sm:gap-2 py-2 px-3 sm:py-3 sm:px-4 text-xs sm:text-sm border rounded-xl shadow-sm hover:bg-gray-100 transition"
            >
              <List className="text-yellow-500" size={18} />{" "}
              <span className="font-medium">Volume</span>
            </button>
            <button
              onClick={() => openModal("temperature")}
              className="flex-1 min-w-[70px] sm:min-w-[100px] max-w-[150px] flex items-center justify-center gap-1 sm:gap-2 py-2 px-3 sm:py-3 sm:px-4 text-xs sm:text-sm border rounded-xl shadow-sm hover:bg-gray-100 transition"
            >
              <Thermometer className="text-yellow-500" size={18} />{" "}
              <span className="font-medium">Temperature</span>
            </button>
            <button
              onClick={() => openModal("pressure")}
              className="flex-1 min-w-[70px] sm:min-w-[100px] max-w-[150px] flex items-center justify-center gap-1 sm:gap-2 py-2 px-3 sm:py-3 sm:px-4 text-xs sm:text-sm border rounded-xl shadow-sm hover:bg-gray-100 transition"
            >
              <Gauge className="text-yellow-500" size={18} />{" "}
              <span className="font-medium">Pressure</span>
            </button>
            <button
              onClick={() => openModal("conversion")}
              className="flex-1 min-w-[70px] sm:min-w-[100px] max-w-[150px] flex items-center justify-center gap-1 sm:gap-2 py-2 px-3 sm:py-3 sm:px-4 text-xs sm:text-sm border rounded-xl shadow-sm hover:bg-gray-100 transition"
            >
              <MoveHorizontal className="text-yellow-500" size={18} />{" "}
              <span className="font-medium">Conversion</span>
            </button>
          </div>
        </div>
      </div>

      <MuiModalWrapper
        open={activeModal !== null}
        onClose={closeModal}
        title={activeModal ? modalConfig[activeModal].title : ""}
      >
        {ModalContent && <ModalContent onClose={closeModal} />}
      </MuiModalWrapper>
    </>
  );
});

export default StreamConfiguration;
