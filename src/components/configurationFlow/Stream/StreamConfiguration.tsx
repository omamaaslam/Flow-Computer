import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import {
  Thermometer,
  MoveHorizontal,
  List,
  Wind,
  GitCompareArrows,
  ArrowRight,
  Square,
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
  start_calculation,
  stop_calculation,
} from "../../../utils/services";
import PipelineProfileForm from "./PipelineProfileForm";
import AlertBox from "../../AlertBox";

type RunState = "start" | "stop" | "disabled";

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
  const [runState, setRunState] = useState<RunState>(
    currentStream?.stream_config.state.start ? "stop" : "start"
  );
  const [alertState, setAlertState] = useState<AlertState>({
    isOpen: false,
    type: "success",
    message: "",
  });

  useEffect(() => {
    console.log("useEffect triggered for stream config state update");
    if (
      currentStream &&
      currentStream.stream_config &&
      typeof currentStream.stream_config.state.start === "boolean"
    ) {
      const newRunState = currentStream.stream_config.state.start
        ? "stop"
        : "start";
      if (runState !== newRunState) {
        console.log(`Updating runState from ${runState} to ${newRunState}`);
        setRunState(newRunState);
      }
    } else {
      if (runState !== "start") {
        setRunState("start");
      }
      console.log(
        "Current stream or its state.start is not yet available or valid."
      );
    }
  }, [currentStream?.stream_config.state.start, currentStream]);

  const buttonConfigs = {
    start: {
      text: "Start",
      Icon: ArrowRight,
      className: "bg-[#FFB700] hover:bg-yellow-500 text-black",
      disabled: false,
    },
    stop: {
      text: "Stop",
      Icon: Square,
      className: "bg-[#DD2C01] hover:bg-red-700 text-white",
      disabled: false,
    },
    disabled: {
      text: "Start",
      Icon: ArrowRight,
      className: "bg-gray-300 text-gray-500 cursor-not-allowed",
      disabled: true,
    },
  };

  const currentButtonConfig = buttonConfigs[runState];

  const handleRunButtonClick = async () => {
    if (!streamId || runState === "disabled") return;

    setIsSaving(true);

    if (runState === "start") {
      try {
        await start_calculation(streamId);
        setRunState("stop");
        setAlertState({
          isOpen: true,
          type: "success",
          message: "Calculation started successfully!",
        });
      } catch (error) {
        console.error("Failed to start calculation:", error);
        setAlertState({
          isOpen: true,
          type: "error",
          message: `Failed to start calculation. ${error}`,
        });
      } finally {
        setIsSaving(false);
      }
    } else {
      try {
        await stop_calculation(streamId);
        setRunState("start");
        setAlertState({
          isOpen: true,
          type: "success",
          message: "Calculation stopped successfully!",
        });
      } catch (error) {
        console.error("Failed to stop calculation:", error);
        setAlertState({
          isOpen: true,
          type: "error",
          message: `Failed to stop calculation. ${error}`,
        });
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleCloseAlert = () => {
    setAlertState({ ...alertState, isOpen: false });
  };

  const formatValue = (value: any) => {
    if (typeof value === "number") {
      return value.toLocaleString(undefined, { maximumFractionDigits: 2 });
    }
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

          // Handle the OnePulseVolumeConfig name change for max volume limit
          if (payloadToSend.mode_type === "OnePulseVolumeConfig") {
            const { max_volume_step_limit, ...rest } = payloadToSend;
            payloadToSend = {
              ...rest,
              max_total_volume_limit: max_volume_step_limit,
            };
          }

          // Transform UI's "Modbus" mode to backend's "EncoderOnlyVolumeConfig"
          if (payloadToSend.mode_type === "Modbus") {
            payloadToSend.mode_type = "EncoderOnlyVolumeConfig";
          }

          await setVolumeConfig(streamId, payloadToSend);
          break;
        }

        case "conversion": {
          const rawConfig = toJS(
            currentStream.stream_config.compressibility_kfactor_config
          );

          const activeMethodName = rawConfig.active_method;
          const activeMethodComponents = rawConfig.methods[activeMethodName];
          const filteredComponents: { [key: string]: GasComponent } = {};
          for (const key in activeMethodComponents) {
            const component = activeMethodComponents[key];
            if (component.value !== 0 || component.linked_device_id) {
              filteredComponents[key] = component;
            }
          }

          const methodsPayload = {
            [activeMethodName]: filteredComponents, // Use the filtered components for the active method
          };

          const payload = {
            active_method: activeMethodName,
            constant_k_value: rawConfig.constant_k_value,
            methods: methodsPayload,
          };

          console.log(payload);
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
    },
    temperature: {
      title: "Configure Temperature",
    },
    pressure: {
      title: "Configure Pressure",
    },
    flowRate: {
      title: "Configure Flow Rate",
    },
    pipelineProfile: {
      title: "Configure Pipeline Profile",
    },
    conversion: {
      title: "Compressibility Settings",
    },
  };

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

  const modalTitle = activeModal ? modalConfig[activeModal.type].title : "";

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
                      config.volume_configuration?.max_volume_step_limit ??
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
                    maxDisplay = ""; // Not a range
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
                    <div className="flex flex-col items-end space-y-4 justify-center h-full">
                      {id === "pipelineProfile" || id === "conversion" ? (
                        <p className="text-2xl font-bold text-green-600">
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
                      config.volume_configuration?.max_volume_step_limit ??
                      config.volume_configuration?.max_total_volume_limit ?? // <-- Add this fallback
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
            <button
              onClick={handleRunButtonClick}
              disabled={currentButtonConfig.disabled || isSaving}
              className={`w-full flex justify-center items-center gap-2 py-2 md:py-3 text-sm md:text-lg font-semibold font-sans border border-[#F5F5F5] rounded-full shadow-lg transition-all ${currentButtonConfig.className}`}
            >
              {isSaving ? (
                <span>
                  {runState === "start" ? "Starting..." : "Stopping..."}
                </span>
              ) : (
                <>
                  <currentButtonConfig.Icon size={20} />
                  <span>{currentButtonConfig.text}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <MuiModalWrapper
        open={activeModal !== null}
        onClose={closeModal}
        title={modalTitle}
      >
        {activeModal?.type === "volume" && (
          <VolumeForm
            store={globalStore}
            config={currentStream.stream_config.volume_configuration}
            onSave={handleSave}
            onClose={closeModal}
            isSaving={isSaving}
          />
        )}
        {activeModal?.type === "temperature" && (
          <TemperatureForm
            store={globalStore}
            config={currentStream.stream_config.temperature_config}
            onSave={handleSave}
            onClose={closeModal}
            isSaving={isSaving}
          />
        )}
        {activeModal?.type === "pressure" && (
          <PressureForm
            config={currentStream.stream_config.pressure_config}
            onSave={handleSave}
            onClose={closeModal}
            isSaving={isSaving}
            store={globalStore}
          />
        )}
        {activeModal?.type === "flowRate" && (
          <FlowRateForm
            config={currentStream.stream_config.flow_rate_config}
            onSave={handleSave}
            onClose={closeModal}
            isSaving={isSaving}
          />
        )}
        {activeModal?.type === "pipelineProfile" && (
          <PipelineProfileForm
            config={currentStream.stream_config.calculation_profile}
            onSave={handleSave}
            onClose={closeModal}
            isSaving={isSaving}
          />
        )}
        {activeModal?.type === "conversion" && (
          <ConversionForm
            store={globalStore}
            stream={currentStream}
            onSave={handleSave}
            onClose={closeModal}
            isSaving={isSaving}
          />
        )}
      </MuiModalWrapper>
    </>
  );
});

export default StreamConfiguration;
