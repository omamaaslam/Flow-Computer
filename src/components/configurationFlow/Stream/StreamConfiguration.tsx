import { useState, type JSX } from "react";
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
import { defaultVolumeConfig } from "./VolumeForm";
import { createDefaultStreamConfig } from "../../../types/streamConfig";
import { setTemperatureConfig, setPressureConfig, setFlowRateConfig, setVolumeConfig, setCompressibilityConfig } from "../../../utils/services";


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
  const [isSaving, setIsSaving] = useState(false);
  const { streamId } = useParams<{ streamId: string }>();

  if (!streamId) {
    return <div>Stream ID is missing.</div>;
  }

  const currentStream = globalStore.streams.find((s) => s.id === streamId);

  const openModal = (modalType: ModalType) => {
    if (!currentStream) return;

    let snapshot;
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
    if (!currentStream || !activeModal || isSaving) return;

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

  const handleSave = async () => {
    if (!currentStream || !activeModal) return;

    // By creating this constant, TypeScript knows it's not null for the rest of the function.
    const modalType = activeModal.type;

    setIsSaving(true);
    try {
      switch (modalType) {
        case "temperature":
          await setTemperatureConfig(
            streamId,
            toJS(currentStream.calculator.temperature_config)
          );
          break;
        case "pressure":
          await setPressureConfig(
            streamId,
            toJS(currentStream.calculator.pressure_config)
          );
          break;
        case "flowRate":
          await setFlowRateConfig(
            streamId,
            toJS(currentStream.calculator.flow_rate_config)
          );
          break;
        case "volume":
          const volumeConfig = toJS(
            currentStream.calculator.volume_configuration
          );
          const volumeTypeMap: { [key: string]: string } = {
            onePulse: "OnePulseVolumeConfig",
            twoPulse1_1: "TwoPulseVolumeConfig",
            twoPulseX_Y: "TwoPulseVolumeConfig",
          };
          const volumeType =
            volumeTypeMap[volumeConfig.operating_mode] || "EncoderVolumeConfig";
          await setVolumeConfig(streamId, volumeType, volumeConfig);
          break;
        case "conversion":
          await setCompressibilityConfig(
            streamId,
            toJS(currentStream.calculator.compressibility_kfactor_config)
          );
          break;
      }
      setActiveModal(null);
    } catch (error) {
      console.error("Failed to save configuration:", error);
      alert(`Failed to save configuration: ${error}`);
    } finally {
      setIsSaving(false);
    }
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
          onSave={handleSave}
          onClose={closeModal}
          isSaving={isSaving}
        />
      ),
    },
    pressure: {
      title: "Configure Pressure",
      Component: () => (
        <PressureForm
          config={currentStream.calculator.pressure_config}
          onSave={handleSave}
          onClose={closeModal}
          isSaving={isSaving}
        />
      ),
    },
    volume: {
      title: "Configure Volume",
      Component: () => (
        <VolumeForm
          config={currentStream.calculator.volume_configuration!}
          onSave={handleSave}
          onClose={closeModal}
          isSaving={isSaving}
        />
      ),
    },
    flowRate: {
      title: "Configure Flow Rate",
      Component: () => (
        <FlowRateForm
          config={currentStream.calculator.flow_rate_config}
          onSave={handleSave}
          onClose={closeModal}
          isSaving={isSaving}
        />
      ),
    },
    conversion: {
      title: "Compressibility & Conversion Settings",
      Component: () => (
        <ConversionForm
          store={globalStore}
          config={currentStream.calculator.compressibility_kfactor_config}
          onSave={handleSave}
          onClose={closeModal}
          isSaving={isSaving}
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

  let modalTitle = "";
  let ActiveModalComponent: (() => JSX.Element) | null = null;

  if (activeModal) {
    const details = modalConfig[activeModal.type];
    modalTitle = details.title;
    ActiveModalComponent = details.Component;
  }

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
