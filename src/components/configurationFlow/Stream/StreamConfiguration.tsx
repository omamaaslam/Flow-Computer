// D:/flow-computer/src/components/configurationFlow/Stream/StreamConfiguration.tsx

import { useState } from "react";
import { observer } from "mobx-react-lite";
import {
  Thermometer,
  MoveHorizontal,
  List,
  Wind,
  GitCompareArrows,
} from "lucide-react";
import MuiModalWrapper from "../MuiModalWrapper";
import globalStore from "../../../stores/GlobalStore";
import { useParams } from "react-router-dom";
import { toJS } from "mobx";
import ConversionForm from "./ConversionForm";
import FlowRateForm from "./FlowRateForm";
import PressureForm from "./PressureForm";
import VolumeForm from "./VolumeForm";
import TemperatureForm from "./TemperatureForm";
import { defaultVolumeConfig } from "./VolumeForm"; // Import default config
import { createDefaultStreamConfig } from "../../../types/streamConfig";

type ModalType =
  | "volume"
  | "temperature"
  | "pressure"
  | "flowRate"
  | "conversion";

interface ActiveModalState {
  type: ModalType;
  snapshot: any;
}

const StreamConfiguration = observer(() => {
  const [activeModal, setActiveModal] = useState<ActiveModalState | null>(null);
  const { streamId } = useParams<{ streamId: string }>();

  const currentStream = globalStore.streams.find(
    (s) => s.id.toString() === streamId
  );

  const openModal = (modalType: ModalType) => {
    if (!currentStream) return;

    let snapshot;
    // Create a snapshot of the current state BEFORE opening the modal
    switch (modalType) {
      case "temperature":
        snapshot = toJS(currentStream.calculator.temperature_config);
        break;
      case "pressure":
        snapshot = toJS(currentStream.calculator.pressure_config);
        break;
      case "flowRate":
        snapshot = toJS(currentStream.calculator.flow_rate_config);
        break;
      case "volume":
        // --- YEH SABSE ZAROORI CHANGE HAI ---
        // Agar volume config null hai, to use form kholne se pehle default object de do.
        if (!currentStream.calculator.volume_configuration) {
          currentStream.calculator.volume_configuration = {
            ...defaultVolumeConfig,
          };
        }
        snapshot = toJS(currentStream.calculator.volume_configuration);
        break;
      case "conversion":
        if (!currentStream.calculator.compressibility_kfactor_config) {
          currentStream.calculator.compressibility_kfactor_config = 
            createDefaultStreamConfig().compressibility_kfactor_config!;
        }
        snapshot = toJS(
          currentStream.calculator.compressibility_kfactor_config
        );
        break;
      default:
        snapshot = null;
    }

    setActiveModal({ type: modalType, snapshot });
  };

  const closeModal = () => {
    if (!currentStream || !activeModal) return;
    // On cancel, revert the changes using the saved snapshot
    switch (activeModal.type) {
      case "temperature":
        currentStream.revertTemperatureChanges(activeModal.snapshot);
        break;
      case "pressure":
        currentStream.revertPressureChanges(activeModal.snapshot);
        break;
      case "flowRate":
        currentStream.revertFlowRateChanges(activeModal.snapshot);
        break;
      case "volume":
        currentStream.revertVolumeChanges(activeModal.snapshot);
        break;
      case "conversion":
        currentStream.revertConversionChanges(activeModal.snapshot);
        break;
    }
    setActiveModal(null);
  };

  const handleSave = () => {
    if (!currentStream) return;
    // Yeh line aapki requirement ke hisaab se console par object print karegi.
    console.log("Saving new config to server:", toJS(currentStream.calculator));
    setActiveModal(null);
  };

  if (!currentStream) {
    return <div>Stream with ID {streamId} not found.</div>;
  }

  const modalConfig = {
    temperature: {
      title: "Configure Temperature",
      Component: () => (
        <TemperatureForm
          config={currentStream.calculator.temperature_config}
          onCommit={handleSave}
          onClose={closeModal}
        />
      ),
    },
    pressure: {
      title: "Configure Pressure",
      Component: () => (
        <PressureForm
          config={currentStream.calculator.pressure_config}
          onCommit={handleSave}
          onClose={closeModal}
        />
      ),
    },
    volume: {
      title: "Configure Volume",
      Component: () => (
        <VolumeForm
          // Ab yeh hamesha ek object hoga, kabhi null nahi.
          config={currentStream.calculator.volume_configuration!}
          onCommit={handleSave}
          onClose={closeModal}
        />
      ),
    },
    flowRate: {
      title: "Configure Flow Rate",
      Component: () => (
        <FlowRateForm
          config={currentStream.calculator.flow_rate_config}
          onCommit={handleSave}
          onClose={closeModal}
        />
      ),
    },
    conversion: {
      title: "Conversion Settings",
      Component: () => (
        <ConversionForm
        store={globalStore} 
        config={currentStream.calculator.compressibility_kfactor_config}
        onCommit={handleSave}
        onClose={closeModal}
        />
      ),
    },
  };

  const cardData = [
    {
      id: "volume" as ModalType,
      label: "Volume",
      Icon: List,
      Illustration: "/streamSVG/TemperatureSencor.svg",
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
      Illustration: "/streamSVG/TemperatureTransmeter.svg",
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
      Icon: GitCompareArrows,
      Illustration: "/streamSVG/Conversion.svg",
    },
  ];

  const ActiveModalComponent = activeModal
    ? modalConfig[activeModal.type].Component
    : null;
  const modalTitle = activeModal ? modalConfig[activeModal.type].title : "";

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
                <div className="flex items-center gap-3">
                  <Icon
                    className="text-yellow-500"
                    size={24}
                    strokeWidth={2.5}
                  />
                  <h3 className="font-bold text-gray-800 text-xl">{label}</h3>
                </div>
                <div className="w-full flex flex-row items-center justify-between">
                  <div className="flex-1">
                    <img
                      src={Illustration}
                      alt={`${label} illustration`}
                      className="w-[120px] h-[157.7px]"
                    />
                  </div>
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
      </div>
      <MuiModalWrapper
        open={activeModal !== null}
        onClose={closeModal}
        title={modalTitle}
      >
        {ActiveModalComponent && <ActiveModalComponent />}
      </MuiModalWrapper>
    </>
  );
});

export default StreamConfiguration;
