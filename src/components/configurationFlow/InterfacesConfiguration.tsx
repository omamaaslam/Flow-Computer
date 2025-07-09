import { useState } from "react";
import IoCardSvg from "../configurationFlow/IoCardSvg";
import { navigationStore } from "../../stores/NavigationStore";
// --- TypeScript Definitions ---
type InterfaceStatus = "configured" | "unconfigured" | "alert" | "error";
type InterfaceStatuses = Record<string, InterfaceStatus>;

// --- Component Initial Data ---
const initialStatuses: InterfaceStatuses = {
  MOD: "configured",
  DI2: "configured",
  DI4_left: "configured",
  AI1: "configured",
  DO2: "unconfigured",
  DI4_2: "unconfigured",
  AI2: "unconfigured",
  HART2: "unconfigured",
  AO1: "unconfigured",
  DI1: "alert",
  DI3: "alert",
  DI5: "error",
  DO5_top: "alert",
  DO3: "unconfigured",
  DO5_2: "unconfigured",
  HART1: "unconfigured",
  RTD: "alert",
  AO2: "error",
};

const statusColorMap: Record<InterfaceStatus, string> = {
  configured: "#9BC53F",
  unconfigured: "#C3C3C3",
  alert: "#FFB700",
  error: "#FF3D00",
};

const InterfacesConfiguration = () => {
  const [statuses, setStatuses] = useState<InterfaceStatuses>(initialStatuses);


  return (
    <div className="bg-white mx-auto rounded-2xl shadow-md py-4 px-2 border border-gray-200 flex flex-col items-center">
      <h2 className="text-xl md:text-2xl font-semibold text-gray-800 text-center mb-4">
        V1
      </h2>
      <div className="w-full max-w-2xl flex justify-center">
        <IoCardSvg
          modStatusColor={statusColorMap[statuses.MOD]}
           onModClick={() => navigationStore.configureInterface("MOD")}
          di2StatusColor={statusColorMap[statuses.DI2]}
          onDi2Click={() => navigationStore.configureInterface("DI2")}
          di4LeftStatusColor={statusColorMap[statuses.DI4_left]}
          onDi4LeftClick={() => navigationStore.configureInterface("DI4_left")}
          ai1StatusColor={statusColorMap[statuses.AI1]}
         onAi1Click={() =>navigationStore.configureInterface("AI1")}
          do2StatusColor={statusColorMap[statuses.DO2]}
          onDo2Click={() => navigationStore.configureInterface("DO2")}
          di4_2StatusColor={statusColorMap[statuses.DI4_2]}
          onDi4_2Click={() => navigationStore.configureInterface("DI4_2")}
          ai2StatusColor={statusColorMap[statuses.AI2]}
          onAi2Click={() => navigationStore.configureInterface("AI2")}
          hart2StatusColor={statusColorMap[statuses.HART2]}
          onHart2Click={() => navigationStore.configureInterface("HART2")}
          ao1StatusColor={statusColorMap[statuses.AO1]}
          onAo1Click={() => navigationStore.configureInterface("AO1")}
          di1StatusColor={statusColorMap[statuses.DI1]}
          onDi1Click={() => navigationStore.configureInterface("DI1")}
          di3StatusColor={statusColorMap[statuses.DI3]}
          onDi3Click={() => navigationStore.configureInterface("DI3")}
          di5StatusColor={statusColorMap[statuses.DI5]}
          onDi5Click={() => navigationStore.configureInterface("DI5")}
          do5TopStatusColor={statusColorMap[statuses.DO5_top]}
          onDo5TopClick={() => navigationStore.configureInterface("DO5_top")}
          do3StatusColor={statusColorMap[statuses.DO3]}
          onDo3Click={() => navigationStore.configureInterface("DO3")}
          do5BottomStatusColor={statusColorMap[statuses.DO5_2]}
          onDo5BottomClick={() => navigationStore.configureInterface("DO5_2")}
          hart1StatusColor={statusColorMap[statuses.HART1]}
          onHart1Click={() => navigationStore.configureInterface("HART1")}
          rtdStatusColor={statusColorMap[statuses.RTD]}
          onRtdClick={() => navigationStore.configureInterface("RTD")}
          ao2StatusColor={statusColorMap[statuses.AO2]}
          onAo2Click={() => navigationStore.configureInterface("AO2")}
        />
      </div>
    </div>
  );
};

export default InterfacesConfiguration;
