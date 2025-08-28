import { observer } from "mobx-react-lite";
import React from "react";
import { Newspaper } from "lucide-react";
import { navigationStore } from "../../../stores/NavigationStore";
import globalStore from "../../../stores/GlobalStore";

interface StreamCardProps {
  stream: {
    id: string;
    name: string;
  };
  colorScheme: "yellow" | "red" | "green" | "gray";
}

const StreamCard: React.FC<StreamCardProps> = observer(
  ({ colorScheme, stream }) => {
    const streamResult = globalStore.results.find(
      (r) => r.stream_id === stream.id
    );

    const getBackgroundClass = () => {
      switch (colorScheme) {
        case "yellow":
          return "bg-gradient-to-bl from-black to-yellow-400";
        case "red":
          return "bg-gradient-to-bl from-black to-[#FF3D00]";
        case "green":
          return "bg-gradient-to-bl from-black to-[#9BC53F]";
        case "gray":
          return "bg-gray-500";
        default:
          return "bg-gradient-to-bl from-black to-slate-500";
      }
    };

    const getBorderColor = () => {
      switch (colorScheme) {
        case "yellow":
          return "#FFB700";
        case "red":
          return "#dc2626";
        case "green":
          return "#059669";
        case "gray":
          return "#475569";
        default:
          return "#FFB700";
      }
    };

    const borderColor = getBorderColor();

    return (
      <div
        className={`
        ${getBackgroundClass()} 
        w-full 
        max-w-[95%] sm:max-w-sm md:max-w-md lg:max-w-[340px] 
        p-2 sm:p-2.5 md:p-4 lg:p-6 
        flex flex-col items-center justify-center 
        gap-3 md:gap-4 lg:gap-6 
        border-[2px] border-white 
        rounded-[12px] md:rounded-[15px]
      `}
        style={{
          boxShadow:
            "0px 1.57px 3.14px rgba(0, 0, 0, 0.3), 0px 1.57px 4.72px 1.57px rgba(0, 0, 0, 0.15)",
        }}
      >
        <div className="flex flex-col items-center gap-3 md:gap-4 w-full">
          <div
            className="flex flex-col items-start gap-1.5 w-full cursor-pointer"
            onClick={() => navigationStore.gotoConfiguration(stream.id)}
          >
            <div className="flex items-center justify-center px-2 py-1.5 md:px-4 md:py-2 gap-1 w-full border-2 border-dashed border-[#F0F0F0] rounded-[4px]">
              <div className="flex items-center gap-1 md:gap-2 flex-wrap">
                <span className="text-[13px] sm:text-[14px] md:text-[20px] font-semibold text-white">
                  {stream.name}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-1.5 md:gap-2 w-full">
              <div
                className="flex items-center justify-center w-full 
              h-[30px] sm:h-[34px] md:h-[56px] 
              border rounded-[6px] md:rounded-[12px]"
                style={{ borderColor }}
              >
                <span className="text-[11px] sm:text-[12px] md:text-[18px] font-semibold text-white text-center">
                  Volume:{" "}
                  {streamResult.pressure_interference_flag &&
                  streamResult.temperature_interference_flag &&
                  streamResult.volume_interference_flag &&
                  streamResult.flow_rate_interference_flag &&
                  streamResult.flow_rate_interference_flag &&
                  streamResult.compressbility_method_interference
                    ? streamResult.standard_volume_forward.toFixed(5)
                    : streamResult.standard_volume_forward.toFixed(5)}
                </span>
              </div>
              <div
                className="flex items-center justify-center w-full 
              h-[30px] sm:h-[34px] md:h-[56px] 
              border rounded-[6px] md:rounded-[12px]"
                style={{ borderColor }}
              >
                <span className="text-[11px] sm:text-[12px] md:text-[18px] font-semibold text-white text-center">
                  Flow Rate:{" "}
                  {streamResult.pressure_interference_flag &&
                  streamResult.temperature_interference_flag &&
                  streamResult.volume_interference_flag &&
                  streamResult.flow_rate_interference_flag &&
                  streamResult.flow_rate_interference_flag &&
                  streamResult.compressbility_method_interference
                    ? streamResult.standard_volume_forward.toFixed(5)
                    : streamResult.standard_flow_rate.toFixed(5)}
                </span>
              </div>
            </div>
          </div>

          {/* Configuration Button */}
          <button
            className="flex items-center justify-center 
          px-3 md:px-4 gap-1 md:gap-2 
          w-full h-[32px] sm:h-[36px] md:h-[56px] 
          bg-white border-[2px] md:border-[3px] border-[#F0F0F0] 
          rounded-[28px] md:rounded-[33.5px] 
          hover:bg-gray-100 transition-colors"
            style={{
              boxShadow:
                "0px 10px 6px rgba(0, 0, 0, 0.02), 0px 4px 4px rgba(0, 0, 0, 0.04)",
            }}
            onClick={() => navigationStore.gotoMonitor()}
          >
            <Newspaper className="w-4 h-4 md:w-6 md:h-6 text-[#9BC53F]" />
            <span className="text-[11px] sm:text-[12px] md:text-[18px] font-semibold text-black">
              View Analytics
            </span>
          </button>
        </div>
      </div>
    );
  }
);

export default StreamCard;
