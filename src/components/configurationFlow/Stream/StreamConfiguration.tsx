import { useState, type JSX } from "react";
import { observer } from "mobx-react-lite";
import {
  Thermometer,
  MoveHorizontal,
  List,
  Wind,
  GitCompareArrows,
  ArrowRight,
} from "lucide-react";
import MuiModalWrapper from "../MuiModalWrapper";
import VolumeForm, { defaultVolumeConfig } from "./VolumeForm";
import TemperatureForm from "./TemperatureForm";
import PressureForm from "./PressureForm";
import FlowRateForm from "./FlowRateForm";
import ConversionForm from "./ConversionForm";
import globalStore from "../../../stores/GlobalStore";
import { useParams } from "react-router-dom";
import { toJS } from "mobx";
import {
  createDefaultStreamConfig,
  type GasComponent,
} from "../../../types/streamConfig";
import {
  setTemperatureConfig,
  setPressureConfig,
  setFlowRateConfig,
  setVolumeConfig,
  setCompressibilityConfig,
  addProfile,
} from "../../../utils/services";
import PipelineProfileForm from "./PipelineProfileForm";
import AlertBox from "../../AlertBox";
type AlertState = {
  isOpen: boolean;
  type: "success" | "error" | "warning";
  message: string;
};
// UI-aware ModalType
type ModalType =
  | "volume"
  | "temperature"
  | "pressure"
  | "flowRate"
  | "conversion"
  | "pipelineProfile";

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
  const [alertState, setAlertState] = useState<AlertState>({
    isOpen: false,
    type: "success",
    message: "",
  });

  // Inside the StreamConfiguration component, before the return statement
  const handleCloseAlert = () => {
    setAlertState({ ...alertState, isOpen: false });
  };

  const formatValue = (value: any) => {
    if (typeof value === "number") {
      // Use toLocaleString for better formatting and handling of large numbers
      return value.toLocaleString(undefined, { maximumFractionDigits: 2 });
    }
    // Return non-number values (like 'N/A' or '-') as is
    return value;
  };

  const openModal = (modalType: ModalType) => {
    if (!currentStream) return;

    let snapshot;
    switch (modalType) {
      case "temperature":
        snapshot = toJS(currentStream.stream_config.temperature_config);
        break;
      case "pressure":
        snapshot = toJS(currentStream.stream_config.pressure_config);
        break;
      case "flowRate":
        snapshot = toJS(currentStream.stream_config.flow_rate_config);
        break;
      case "volume":
        if (!currentStream.stream_config.volume_configuration) {
          currentStream.stream_config.volume_configuration = {
            ...defaultVolumeConfig,
          };
        } else {
          const configFromServer =
            currentStream.stream_config.volume_configuration;

          if (
            configFromServer.max_total_volume_limit !== undefined &&
            configFromServer.max_volume_step_limit === undefined
          ) {
            configFromServer.max_volume_step_limit =
              configFromServer.max_total_volume_limit;
          }
        }
        snapshot = toJS(currentStream.stream_config.volume_configuration);
        break;
      case "conversion":
        if (!currentStream.stream_config.compressibility_kfactor_config) {
          currentStream.stream_config.compressibility_kfactor_config =
            createDefaultStreamConfig().compressibility_kfactor_config!;
        }
        snapshot = toJS(
          currentStream.stream_config.compressibility_kfactor_config
        );
        break;
      case "pipelineProfile": {
        if (!currentStream.stream_config.calculation_profile) {
          currentStream.stream_config.calculation_profile = {
            active_profile_id: "",
            profiles: [],
          };
        }
        snapshot = toJS(currentStream.stream_config.calculation_profile);
        break;
      }

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
      case "pipelineProfile":
      case "flowRate":
        currentStream.revertPipelineProfileChanges(activeModal.snapshot);
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
    console.log("StreamCOnfiguration line no.168", toJS(currentStream))
    const modalType = activeModal.type;
    setIsSaving(true);
    try {
      switch (modalType) {
        case "temperature":
          await setTemperatureConfig(
            streamId,
            toJS(currentStream.stream_config.temperature_config)
          );
          break;
        case "pressure":
          await setPressureConfig(
            streamId,
            toJS(currentStream.stream_config.pressure_config)
          );
          break;
        case "pipelineProfile": {
          const profileConfig = toJS(
            currentStream.stream_config.calculation_profile
          );

          // 2. Check karein ki user ne koi profile select kiya hai ya nahi
          if (!profileConfig.active_profile_id) {
            setAlertState({
              isOpen: true,
              type: "warning",
              message: "Please select a pipeline profile before saving.",
            });
            setIsSaving(false);
            return;
          }
          await addProfile(streamId, profileConfig.active_profile_id);
          break;
        }
        case "flowRate":
          await setFlowRateConfig(
            streamId,
            toJS(currentStream.stream_config.flow_rate_config)
          );
          break;

        case "volume": {
          const rawConfig = toJS(
            currentStream.stream_config.volume_configuration
          );
          let payloadToSend: any = { ...rawConfig };
          if (payloadToSend.mode_type === "OnePulseVolumeConfig") {
            const { max_volume_step_limit, ...rest } = payloadToSend;

            payloadToSend = {
              ...rest,
              max_total_volume_limit: max_volume_step_limit,
            };
          }
          // const volumeTypeMap: { [key: string]: string } = {
          //   modbus: "ModbusVolumeConfig",
          //   EncoderOnlyVolumeConfig: "EncoderOnlyVolumeConfig",
          //   OnePulseVolumeConfig: "OnePulseVolumeConfig",
          // };
          // const volumeType = volumeTypeMap[payloadToSend.mode_type];

          // 5. Send the final, potentially transformed payload to the API
          await setVolumeConfig(streamId, payloadToSend);
          break;
        }

        case "conversion": {
          const rawConfig = toJS(
            currentStream.stream_config.compressibility_kfactor_config
          );

          // 1. Transform the gas_components array into an object keyed by component.key
          // const gasComponentsObject = rawConfig.gas_components.reduce(
          //   (acc: { [key: string]: GasComponent }, component) => {
          //     acc[component.key] = {
          //       key: component.key,
          //       display_name: component.display_name,
          //       unit: component.unit,
          //       value: component.value,
          //       linked_device_id: component.linked_device_id || "",
          //     };
          //     return acc;
          //   },
          //   {}
          // );
          const payload = {
            active_method: rawConfig.active_method,
            constant_k_value: rawConfig.constant_k_value,
            methods: rawConfig.methods,
          };
          await setCompressibilityConfig(streamId, payload);
          break;
        }
      }
      setActiveModal(null);
      setAlertState({
        isOpen: true,
        type: "success",
        message: "Configuration saved successfully!",
      });
    } catch (error) {
      console.error("Failed to save configuration:", error);
      setAlertState({
        isOpen: true,
        type: "error",
        message: "Failed to save configuration. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!currentStream) {
    return <div>Stream with ID {streamId} not found.</div>;
  }

  const modalConfig = {
    volume: {
      title: "Configure Volume",
      Component: () => (
        <VolumeForm
          store={globalStore}
          config={currentStream.stream_config.volume_configuration}
          onSave={handleSave}
          onClose={closeModal}
          isSaving={isSaving}
        />
      ),
    },
    temperature: {
      title: "Configure Temperature",
      Component: () => (
        <TemperatureForm
          store={globalStore}
          config={currentStream.stream_config.temperature_config}
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
          config={currentStream.stream_config.pressure_config}
          onSave={handleSave}
          onClose={closeModal}
          isSaving={isSaving}
          store={globalStore}
        />
      ),
    },
    flowRate: {
      title: "Configure Flow Rate",
      Component: () => (
        <FlowRateForm
          config={currentStream.stream_config.flow_rate_config}
          onSave={handleSave}
          onClose={closeModal}
          isSaving={isSaving}
        />
      ),
    },
    pipelineProfile: {
      title: "Configure Pipeline Profile",
      Component: () => (
        <PipelineProfileForm
          config={currentStream.stream_config.calculation_profile}
          onSave={handleSave}
          onClose={closeModal}
          isSaving={isSaving}
        />
      ),
    },
    conversion: {
      title: "Compressibility Settings",
      Component: () => (
        <ConversionForm
          store={globalStore}
          stream={currentStream}
          onSave={handleSave}
          onClose={closeModal}
          isSaving={isSaving}
        />
      ),
    },
  };

  // Complete cardData from the UI code
  const cardData = [
    {
      id: "volume" as ModalType,
      label: "Volume",
      Icon: List,
      Illustration: "/streamSVG/EncoderDevice.svg",
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
      label: "Compressibility",
      Icon: GitCompareArrows,
      Illustration: "/streamSVG/Conversion.svg",
    },
    {
      id: "pipelineProfile" as ModalType,
      label: "Profile",
      Icon: MoveHorizontal,
      Illustration: "/streamSVG/Pipline.svg",
    },
  ];

  let modalTitle = "";
  let ModalContent: (() => JSX.Element) | null = null;
  if (activeModal) {
    const details = modalConfig[activeModal.type];
    modalTitle = details.title;
    ModalContent = details.Component;
  }

  return (
    <>
      <AlertBox
        isOpen={alertState.isOpen}
        type={alertState.type}
        message={alertState.message}
        onClose={handleCloseAlert}
      />

      <div className="bg-white rounded-2xl shadow-md border border-gray-200">
        {/* --- Large Screen UI --- */}
        <div className="hidden md:block bg-white rounded-2xl p-6  border border-gray-200">
          <div className="grid grid-cols-3 gap-6">
            {cardData.map(({ id, label, Icon, Illustration }) => {
              let minDisplay: string | number = "N/A";
              let maxDisplay: string | number = "N/A";

              if (currentStream?.stream_config) {
                const config = currentStream.stream_config;
                switch (id) {
                  case "pressure":
                    minDisplay =
                      config.pressure_config?.min_operating_pressure ?? "N/A";
                    maxDisplay =
                      config.pressure_config?.max_operating_pressure ?? "N/A";
                    break;
                  case "temperature":
                    minDisplay =
                      config.temperature_config?.min_operating_temperature ??
                      "N/A";
                    maxDisplay =
                      config.temperature_config?.max_operating_temperature ??
                      "N/A";
                    break;
                  case "volume":
                    minDisplay =
                      config.volume_configuration?.min_operating_volume_limit ??
                      "N/A";
                    maxDisplay =
                      config.volume_configuration?.max_total_volume_limit ??
                      "N/A";
                    break;
                  case "flowRate":
                    minDisplay = config.flow_rate_config?.min_warning_flow_rate;
                    maxDisplay =
                      config.flow_rate_config?.max_warning_flow_rate ?? "N/A";
                    break;
                  case "conversion":
                    minDisplay =
                      config.compressibility_kfactor_config?.active_method ??
                      "N/A";
                    maxDisplay = "-"; // Not a range
                    break;
                  case "pipelineProfile":
                    minDisplay =
                      config.calculation_profile?.active_profile_id || "N/A";
                    maxDisplay = "";
                    break;
                }
              }

              return (
                <button
                  key={id}
                  onClick={() => openModal(id)}
                  className="bg-[#FAFAFA] border-2 border-[#9BC53F] rounded-2xl shadow-sm p-6 flex flex-col justify-between h-[305px] text-left transition-all duration-200 ease-in-out hover:shadow-xl hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-yellow-500"
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
                        className="w-[120px] h-[157.7px] object-contain"
                      />
                    </div>
                    {/* <div className="flex flex-col items-end space-y-4">
                      <div>
                        <span className="text-lg text-gray-500">Min:</span>
                        <p className="text-4xl font-bold text-red-600">
                          {formatValue(minDisplay)}
                        </p>
                      </div>
                      <div>
                        <span className="text-lg text-gray-500">Max:</span>
                        <p className="text-4xl font-bold text-green-600">
                          {formatValue(maxDisplay)}
                        </p>
                      </div>
                    </div> */}
                    <div className="flex flex-col items-end space-y-4 justify-center h-full">
                      {id === "pipelineProfile" || id === "conversion" ? (
                        <p className="text-4xl font-bold text-green-600">
                          {formatValue(minDisplay)}
                        </p>
                      ) : (
                        <>
                          <div>
                            <span className="text-lg text-gray-500">Min:</span>
                            <p className="text-4xl font-bold text-red-600">
                              {formatValue(minDisplay)}
                            </p>
                          </div>
                          <div>
                            <span className="text-lg text-gray-500">Max:</span>
                            <p className="text-4xl font-bold text-red-600">
                              {formatValue(maxDisplay)}
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* --- Small Screen UI --- */}
        <div className="block lg:hidden p-6 py-4">
          <div className="grid grid-cols-3 gap-4">
            {cardData.map(({ id, label, Icon, Illustration }) => {
              let minDisplay: string | number = "N/A";
              let maxDisplay: string | number = "N/A";

              if (currentStream?.stream_config) {
                const config = currentStream.stream_config;
                switch (id) {
                  case "pressure":
                    minDisplay =
                      config.pressure_config?.min_operating_pressure ?? "N/A";
                    maxDisplay =
                      config.pressure_config?.max_operating_pressure ?? "N/A";
                    break;
                  case "temperature":
                    minDisplay =
                      config.temperature_config?.min_operating_temperature ??
                      "N/A";
                    maxDisplay =
                      config.temperature_config?.max_operating_temperature ??
                      "N/A";
                    break;
                  case "volume":
                    minDisplay =
                      config.volume_configuration?.min_operating_volume_limit ??
                      "N/A";
                    maxDisplay =
                      config.volume_configuration?.max_total_volume_limit ??
                      "N/A";
                    break;
                  case "flowRate":
                    minDisplay =
                      config.flow_rate_config?.min_warning_flow_rate ?? "N/A";
                    maxDisplay =
                      config.flow_rate_config?.max_warning_flow_rate ?? "N/A";
                    break;
                  case "conversion":
                    minDisplay =
                      config.compressibility_kfactor_config?.active_method ??
                      "N/A";
                    maxDisplay = "";
                    break;
                  case "pipelineProfile":
                    minDisplay = `${
                      config.calculation_profile?.profiles?.length ?? 0
                    }`;
                    maxDisplay = "-";
                    break;
                }
              }

              return (
                <button
                  key={id}
                  onClick={() => openModal(id)}
                  className="bg-[#FAFAFA] border-2 border-[#9BC53F] rounded-lg shadow p-2 flex flex-col text-left transition-all duration-200 ease-in-out hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  <div className="flex items-center gap-1">
                    <Icon
                      className="text-yellow-500"
                      size={14}
                      strokeWidth={3}
                    />
                    <h3 className="font-bold text-gray-800 text-xs whitespace-nowrap">
                      {label}
                    </h3>
                  </div>
                  <div className="w-full flex flex-row items-center justify-between">
                    <div className="flex-1 flex items-center justify-center">
                      <img
                        src={Illustration}
                        alt={`${label} illustration`}
                        className="w-[84px] h-[82.6px] object-contain"
                      />
                    </div>
                    <div className="flex flex-col items-end ">
                      <div>
                        <span className="text-[10px] text-gray-500">min:</span>
                        <p className="text-base font-bold text-red-600">
                          {formatValue(minDisplay)}
                        </p>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-500">max:</span>
                        <p className="text-base font-bold text-red-600">
                          {formatValue(maxDisplay)}
                        </p>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* --- Start Button (Preserved) --- */}
        <div className="pb-6 px-6 md:pt-8">
          <div className="flex justify-center">
            <button className="w-full flex justify-center items-center py-2 md:py-3 text-sm md:text-lg font-semibold font-sans text-black bg-[#FFB700] border border-[#F5F5F5] rounded-full shadow-lg hover:shadow-xl hover:bg-yellow-500 transition-all">
              <ArrowRight size={20} />
              <span>Start</span>
            </button>
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
