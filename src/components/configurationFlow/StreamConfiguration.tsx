// src/components/configurationFlow/StreamConfiguration.tsx
import { useState } from "react";
import { observer } from "mobx-react-lite";
import { Thermometer, MoveHorizontal, List, Wind } from "lucide-react";
import MuiModalWrapper from "./MuiModalWrapper";
import VolumeForm from "./VolumeForm";
import TemperatureForm from "./TemperatureForm";
import FlowRateForm from "./FlowRateForm";
import PressureForm from "./PressureForm";
import ConversionForm from "./ConversionForm";
import globalStore from "../../stores/GlobalStore";
import { useParams } from "react-router-dom";
import type {
  TemperatureConfig,
  PressureConfig,
  VolumeConfig,
} from "../../types/streamConfig";

type ModalType = "volume" | "temperature" | "pressure" | "conversion" | "flowRate";

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

  if (!currentStream) {
    return <div>Stream with ID {streamId} not found.</div>;
  }

  const modalConfig = {
    volume: {
      title: "Configure Volume",
      Component: (props: any) => (
        <VolumeForm
          {...props}
          initialData={currentStream.config.volume}
          onSave={handleSaveVolumeConfig}
        />
      ),
    },
    temperature: {
      title: "Configure Temperature",
      Component: (props: any) => (
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
    flowRate: { title: "Configure FlowRate", Component: FlowRateForm },
  };

  const cardData = [
    {
      id: "volume" as ModalType,
      label: "Volume",
      Icon: List,
      Illustration: "/streamSVG/VolumeMeter.svg",
    },
    {
      id: "flowRate" as ModalType,
      label: "Flow Rate",
      Icon: MoveHorizontal,
      Illustration: "/streamSVG/FlowRateDevice.svg",
    },
    {
      id: "temperature" as ModalType,
      label: "Temperature",
      Icon: Thermometer,
      Illustration: "/streamSVG/TemperatureSencor.svg",
    },
    {
      id: "pressure" as ModalType,
      label: "Pressure",
      Icon: Wind,
      Illustration: "/streamSVG/PressureMeter.svg",
    },
    {
      id: "conversion" as ModalType,
      label: "Conversion",
      Icon: MoveHorizontal,
      Illustration: "/streamSVG/PressureMeter.svg",
    },
  ];

  const ModalContent = activeModal ? modalConfig[activeModal].Component : null;

  return (
    <>
      <div className="bg-white rounded-2xl shadow-md border border-gray-200">
        <div className="hidden md:block bg-white rounded-2xl p-6 border border-gray-200">
          <div className="grid grid-cols-3 gap-6">
            {cardData.map(({ id, label, Icon, Illustration }) => (
              <button
                key={id}
                onClick={() => openModal(id)}
                className="bg-[#FAFAFA] border border-[#DEDEDE] rounded-2xl shadow-sm p-6 flex flex-col justify-between h-[305px] text-left transition-all duration-200 ease-in-out hover:shadow-xl hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                {/* Top Section: Title */}
                <div className="flex items-center gap-3">
                  <Icon
                    className="text-yellow-500"
                    size={24}
                    strokeWidth={2.5}
                  />
                  <h3 className="font-bold text-gray-800 text-xl">{label}</h3>
                </div>

                {/* Bottom Section: Content */}
                <div className="w-full flex flex-row items-center justify-between">
                  {/* Left Side: Illustration */}
                  <div className="flex-1">
                    {typeof Illustration === "string" ? (
                      <img
                        src={Illustration}
                        alt={`${label} illustration`}
                        className="w-[120px] h-[157.7px]"
                      />
                    ) : (
                      <img
                        src={Illustration}
                        alt={`${label} illustration`}
                        className="w-[120px] h-[157.7px]"
                      />
                    )}
                  </div>

                  {/* Right Side: Min/Max Values */}
                  <div className="flex flex-col items-end space-y-4">
                    <div>
                      <span className="text-lg text-gray-500">Min:</span>
                      <p className="text-4xl font-bold text-red-600">75%</p>
                    </div>
                    <div>
                      <span className="text-lg text-gray-500">Max:</span>
                      <p className="text-4xl font-bold text-green-600">75%</p>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="block lg:hidden p-6">
          <div className="grid grid-cols-3 gap-4">
            {cardData.map(({ id, label, Icon, Illustration }) => (
              <button
                key={id}
                onClick={() => openModal(id)}
                className="bg-[#FAFAFA] border border-[#DEDEDE] rounded-lg shadow p-2 flex flex-col text-left transition-all duration-200 ease-in-out hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                {/* Top Section: Title */}
                <div className="flex items-center gap-1">
                  <Icon className="text-yellow-500" size={14} strokeWidth={3} />
                  <h3 className="font-bold text-gray-800 text-xs whitespace-nowrap">
                    {label}
                  </h3>
                </div>

                {/* Bottom Section: Content */}
                <div className="w-full flex flex-row items-center justify-between">
                  {/* Left Side: Illustration */}
                  <div className="flex-1">
                    {typeof Illustration === "string" ? (
                      <img
                        src={Illustration}
                        alt={`${label} illustration`}
                        className="w-[64px] h-[84.11px]"
                      />
                    ) : (
                      <img
                        src={Illustration}
                        alt={`${label} illustration`}
                        className="w-[64px] h-auto"
                      />
                    )}
                  </div>

                  {/* Right Side: Min/Max Values */}
                  <div className="flex flex-col items-end ">
                    <div>
                      <span className="text-[10px] text-gray-500">min:</span>
                      <p className="text-base font-bold text-red-600">75%</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-500">max:</span>
                      <p className="text-base font-bold text-green-600">75%</p>
                    </div>
                  </div>
                </div>
              </button>
            ))}
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
