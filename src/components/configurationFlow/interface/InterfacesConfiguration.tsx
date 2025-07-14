import { useState } from "react";
import IoCardSvg from "../IoCardSvg";

type InterfaceStatus = "configured" | "unconfigured" | "alert" | "error";
type InterfaceStatuses = Record<string, InterfaceStatus>;

interface InterfacesConfigurationProps {
  onInterfaceClick: (interfaceId: string) => void; // Renamed from onConfigure
}

const initialStatuses: InterfaceStatuses = {
  MOD: "configured", DI2: "configured", DI4_left: "configured", AI1: "configured",
  DO2: "unconfigured", DI4_2: "unconfigured", AI2: "unconfigured", HART2: "unconfigured",
  AO1: "unconfigured", DI1: "alert", DI3: "alert", DI5: "error", DO1: "alert",
  DO3: "unconfigured", DO5: "unconfigured", HART1: "unconfigured", RTD: "alert", AO2: "error",
};

const statusColorMap: Record<InterfaceStatus, string> = {
  configured: "#9BC53F", unconfigured: "#C3C3C3", alert: "#FFB700", error: "#FF3D00",
};

const InterfacesConfiguration = ({ onInterfaceClick }: InterfacesConfigurationProps) => {
  const [statuses] = useState<InterfaceStatuses>(initialStatuses);

  return (
    <div className="bg-white mx-auto rounded-2xl shadow-md py-4 px-2 border border-gray-200 flex flex-col items-center">
      <h2 className="text-xl md:text-2xl font-semibold text-gray-800 text-center mb-4">
        V1
      </h2>
      <div className="w-full max-w-2xl flex justify-center">
        <IoCardSvg
          modStatusColor={statusColorMap[statuses.MOD]}
          onModClick={() => onInterfaceClick("MOD")}
          di2StatusColor={statusColorMap[statuses.DI2]}
          onDi2Click={() => onInterfaceClick("DI2")}
          di4LeftStatusColor={statusColorMap[statuses.DI4_left]}
          onDi4LeftClick={() => onInterfaceClick("DI4")}
          ai1StatusColor={statusColorMap[statuses.AI1]}
          onAi1Click={() => onInterfaceClick("AI1")}
          do2StatusColor={statusColorMap[statuses.DO2]}
          onDo2Click={() => onInterfaceClick("DO2")}
          di4_2StatusColor={statusColorMap[statuses.DI4_2]}
          onDi4_2Click={() => onInterfaceClick("DI4_2")}
          ai2StatusColor={statusColorMap[statuses.AI2]}
          onAi2Click={() => onInterfaceClick("AI2")}
          hart2StatusColor={statusColorMap[statuses.HART2]}
          onHart2Click={() => onInterfaceClick("HART2")}
          ao1StatusColor={statusColorMap[statuses.AO1]}
          onAo1Click={() => onInterfaceClick("AO1")}
          di1StatusColor={statusColorMap[statuses.DI1]}
          onDi1Click={() => onInterfaceClick("DI1")}
          di3StatusColor={statusColorMap[statuses.DI3]}
          onDi3Click={() => onInterfaceClick("DI3")}
          di5StatusColor={statusColorMap[statuses.DI5]}
          onDi5Click={() => onInterfaceClick("DI5")}
          do1StatusColor={statusColorMap[statuses.DO1]}
          onDo1Click={() => onInterfaceClick("DO1")}
          do3StatusColor={statusColorMap[statuses.DO3]}
          onDo3Click={() => onInterfaceClick("DO3")}
          do5StatusColor={statusColorMap[statuses.DO5]}
          onDo5Click={() => onInterfaceClick("DO5")}
          hart1StatusColor={statusColorMap[statuses.HART1]}
          onHart1Click={() => onInterfaceClick("HART1")}
          rtdStatusColor={statusColorMap[statuses.RTD]}
          onRtdClick={() => onInterfaceClick("RTD")}
          ao2StatusColor={statusColorMap[statuses.AO2]}
          onAo2Click={() => onInterfaceClick("AO2")}
        />
      </div>
    </div>
  );
};

export default InterfacesConfiguration;