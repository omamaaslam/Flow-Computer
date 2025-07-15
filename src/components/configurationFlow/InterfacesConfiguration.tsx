// InterfacesConfiguration.tsx
// NO CHANGES NEEDED HERE. This component correctly calls the `onConfigure` prop.
import { useState } from "react";
import IoCardSvg from "../configurationFlow/IoCardSvg";

type InterfaceStatus = "configured" | "unconfigured" | "alert" | "error";
type InterfaceStatuses = Record<string, InterfaceStatus>;

interface InterfacesConfigurationProps {
  onConfigure: (interfaceId: string) => void;
}

const initialStatuses: InterfaceStatuses = {
  MOD: "unconfigured",
  DI2: "unconfigured",
  DI4_left: "unconfigured",
  AI1: "unconfigured",
  DO2: "unconfigured",
  DI4_2: "unconfigured",
  AI2: "unconfigured",
  HART2: "unconfigured",
  AO1: "unconfigured",
  DI1: "unconfigured",
  DI3: "unconfigured",
  DI5: "unconfigured",
  DO1: "unconfigured",
  DO3: "unconfigured",
  DO5: "unconfigured",
  HART1: "unconfigured",
  RTD: "unconfigured",
  AO2: "unconfigured",
};

const statusColorMap: Record<InterfaceStatus, string> = {
  configured: "#9BC53F",
  unconfigured: "#C3C3C3",
  alert: "#FFB700",
  error: "#FF3D00",
};

const InterfacesConfiguration = ({
  onConfigure,
}: InterfacesConfigurationProps) => {
  const [statuses, setStatuses] = useState<InterfaceStatuses>(initialStatuses);
  return (
    <div className="bg-white mx-auto rounded-2xl shadow-md py-4 px-2 border border-gray-200 flex flex-col items-center">
      <h2 className="text-xl md:text-2xl font-semibold text-gray-800 text-center mb-4">
        V1
      </h2>
      <div className="w-full max-w-2xl flex justify-center">
        <IoCardSvg
          modStatusColor={statusColorMap[statuses.MOD]}
          onModClick={() => onConfigure("MOD")}
          di2StatusColor={statusColorMap[statuses.DI2]}
          onDi2Click={() => onConfigure("DI2")}
          di4LeftStatusColor={statusColorMap[statuses.DI4_left]}
          onDi4LeftClick={() => onConfigure("DI4")}
          ai1StatusColor={statusColorMap[statuses.AI1]}
          onAi1Click={() => onConfigure("AI1")}
          do2StatusColor={statusColorMap[statuses.DO2]}
          onDo2Click={() => onConfigure("DO2")}
          di4_2StatusColor={statusColorMap[statuses.DI4_2]}
          onDi4_2Click={() => onConfigure("DI4_2")}
          ai2StatusColor={statusColorMap[statuses.AI2]}
          onAi2Click={() => onConfigure("AI2")}
          hart2StatusColor={statusColorMap[statuses.HART2]}
          onHart2Click={() => onConfigure("HART2")}
          ao1StatusColor={statusColorMap[statuses.AO1]}
          onAo1Click={() => onConfigure("AO1")}
          di1StatusColor={statusColorMap[statuses.DI1]}
          onDi1Click={() => onConfigure("DI1")}
          di3StatusColor={statusColorMap[statuses.DI3]}
          onDi3Click={() => onConfigure("DI3")}
          di5StatusColor={statusColorMap[statuses.DI5]}
          onDi5Click={() => onConfigure("DI5")}
          do1StatusColor={statusColorMap[statuses.DO1]}
          onDo1Click={() => onConfigure("DO1")}
          do3StatusColor={statusColorMap[statuses.DO3]}
          onDo3Click={() => onConfigure("DO3")}
          do5StatusColor={statusColorMap[statuses.DO5]}
          onDo5Click={() => onConfigure("DO5")}
          hart1StatusColor={statusColorMap[statuses.HART1]}
          onHart1Click={() => onConfigure("HART1")}
          rtdStatusColor={statusColorMap[statuses.RTD]}
          onRtdClick={() => onConfigure("RTD")}
          ao2StatusColor={statusColorMap[statuses.AO2]}
          onAo2Click={() => onConfigure("AO2")}
        />
      </div>
    </div>
  );
};

export default InterfacesConfiguration;
