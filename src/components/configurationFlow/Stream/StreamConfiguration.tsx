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

type ModalType =
  | "volume"
  | "temperature"
  | "pressure"
  | "flowRate"
  | "conversion";

const StreamConfiguration = observer(() => {
  const [activeModal, setActiveModal] = useState<ModalType | null>(null);
  const { streamId } = useParams<{ streamId: string }>();

  const currentStream = globalStore.streams.find(
    (s) => s.id.toString() === streamId
  );

  const openModal = (modalType: ModalType) => {
    if (!currentStream) return;
    switch (modalType) {
      case "volume":
        currentStream.startEditingVolume();
        break;
      case "temperature":
        currentStream.startEditingTemperature();
        break;
      case "pressure":
        currentStream.startEditingPressure();
        break;
      case "flowRate":
        currentStream.startEditingFlowRate();
        break;
      case "conversion":
        currentStream.startEditingConversion();
        break;
    }
    setActiveModal(modalType);
  };

  const closeModal = () => {
    if (!currentStream) return;
    switch (activeModal) {
      case "volume":
        currentStream.cancelEditingVolume();
        break;
      case "temperature":
        currentStream.cancelEditingTemperature();
        break;
      case "pressure":
        currentStream.cancelEditingPressure();
        break;
      case "flowRate":
        currentStream.cancelEditingFlowRate();
        break;
      case "conversion":
        currentStream.cancelEditingConversion();
        break;
    }
    setActiveModal(null);
  };

  const commitAndClose = (commitFn: () => void) => {
    commitFn();
    // Log the entire globalStore state as a plain object after the commit
    console.log("Global Store State After Save:", toJS(globalStore));
    setActiveModal(null);
  };

  if (!currentStream) {
    return <div>Stream with ID {streamId} not found.</div>;
  }

  const modalConfig = {
    volume: {
      title: "Configure Volume",
      Component: () =>
        currentStream.editingVolume && (
          <VolumeForm
            config={currentStream.editingVolume}
            onCommit={() => commitAndClose(currentStream.commitVolumeChanges)}
            onClose={closeModal}
          />
        ),
    },
    temperature: {
      title: "Configure Temperature",
      Component: () =>
        currentStream.editingTemperature && (
          <TemperatureForm
            config={currentStream.editingTemperature}
            onCommit={() =>
              commitAndClose(currentStream.commitTemperatureChanges)
            }
            onClose={closeModal}
          />
        ),
    },
    pressure: {
      title: "Configure Pressure",
      Component: () =>
        currentStream.editingPressure && (
          <PressureForm
            config={currentStream.editingPressure}
            onCommit={() => commitAndClose(currentStream.commitPressureChanges)}
            onClose={closeModal}
          />
        ),
    },
    flowRate: {
      title: "Configure Flow Rate",
      Component: () =>
        currentStream.editingFlowRate && (
          <FlowRateForm
            config={currentStream.editingFlowRate}
            onCommit={() => commitAndClose(currentStream.commitFlowRateChanges)}
            onClose={closeModal}
          />
        ),
    },
    conversion: {
      title: "Conversion Settings",
      Component: () =>
        currentStream.editingConversion && (
          // <ConversionForm
          //   store={globalStore}
          //   config={currentStream.editingConversion}
          //   onCommit={() =>
          //     commitAndClose(currentStream.commitConversionChanges)
          //   }
          //   onClose={closeModal}
          // />
          <ConversionForm />
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

  const ModalContent = activeModal ? modalConfig[activeModal].Component : null;
  const modalTitle = activeModal ? modalConfig[activeModal].title : "";

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

        <div className="block lg:hidden p-6">
          <div className="grid grid-cols-3 gap-4">
            {cardData.map(({ id, label, Icon, Illustration }) => (
              <button
                key={id}
                onClick={() => openModal(id)}
                className="bg-[#FAFAFA] border border-[#DEDEDE] rounded-lg shadow p-2 flex flex-col text-left transition-all duration-200 ease-in-out hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                <div className="flex items-center gap-1">
                  <Icon className="text-yellow-500" size={14} strokeWidth={3} />
                  <h3 className="font-bold text-gray-800 text-xs whitespace-nowrap">
                    {label}
                  </h3>
                </div>
                <div className="w-full flex flex-row items-center justify-between">
                  <div className="flex-1">
                    <img
                      src={Illustration}
                      alt={`${label} illustration`}
                      className="w-[64px] h-auto"
                    />
                  </div>
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
        title={modalTitle}
      >
        {ModalContent && <ModalContent />}
      </MuiModalWrapper>
    </>
  );
});

export default StreamConfiguration;
