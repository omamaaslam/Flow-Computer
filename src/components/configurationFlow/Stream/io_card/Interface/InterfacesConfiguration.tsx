import { toJS } from "mobx";
import type { Stream } from "../../../../../stores/Stream";
import Legend from "../../../../Legend";
import IoCardSvg from "../IoCardSvg";
import { observer } from "mobx-react-lite";

type InterfaceStatus = "configured" | "unconfigured" | "alert" | "error";
type InterfaceStatuses = {
  [key: string]: InterfaceStatus;
};

interface InterfacesConfigurationProps {
  stream: Stream;
  onConfigure: (interfaceId: string) => void;
}

const UNCONFIGURED_STATUSES: InterfaceStatuses = {
  MODM1: "unconfigured",
  DI2: "unconfigured",
  DI4_left: "unconfigured",
  AI1: "unconfigured",
  DO2: "unconfigured",
  DI4_2: "unconfigured",
  AI2: "unconfigured",
  HI2: "unconfigured",
  AO1: "unconfigured",
  DI1: "unconfigured",
  DI3: "unconfigured",
  DI5: "unconfigured",
  DO1: "unconfigured",
  DO3: "unconfigured",
  DO5: "unconfigured",
  HI1: "unconfigured",
  TI1: "unconfigured",
  AO2: "unconfigured",
};

const statusColorMap: Record<InterfaceStatus, string> = {
  configured: "#9BC53F",
  unconfigured: "#C3C3C3",
  alert: "#FFB700",
  error: "#FF3D00",
};

const getColorForStatus = (status: InterfaceStatus | undefined): string => {
  if (status && statusColorMap[status]) {
    return statusColorMap[status];
  }
  return statusColorMap.unconfigured;
};

const InterfacesConfiguration = observer(
  ({ stream, onConfigure }: InterfacesConfigurationProps) => {
    const ioCard = stream.ioCards[0];
    const statuses = ioCard ? ioCard.interfaceStatuses : UNCONFIGURED_STATUSES;
    console.log("Interface COnfiguration", toJS(stream))
    return (
      <>
        <Legend />
        <div className="bg-white mx-auto rounded-2xl shadow-md py-4 px-2 border border-gray-200 flex flex-col items-center">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800 text-center mb-4">
            V1
          </h2>
          <div className="w-full max-w-2xl flex justify-center">
            <IoCardSvg
              mod1StatusColor={getColorForStatus(statuses.MODM1)}
              onMod1Click={() => onConfigure("MODM1")}
              di1StatusColor={getColorForStatus(statuses.DI1)}
              onDi1Click={() => onConfigure("DI1")}
              hi1StatusColor={getColorForStatus(statuses.HI1)}
              onHi1Click={() => onConfigure("HI1")}
              ti1StatusColor={getColorForStatus(statuses.TI1)}
              onTi1Click={() => onConfigure("TI1")}
              di2StatusColor={getColorForStatus(statuses.DI2)}
              onDi2Click={() => onConfigure("DI2")}
              di4LeftStatusColor={getColorForStatus(statuses.DI4_left)}
              onDi4LeftClick={() => onConfigure("DI4_left")}
              ai1StatusColor={getColorForStatus(statuses.AI1)}
              onAi1Click={() => onConfigure("AI1")}
              do2StatusColor={getColorForStatus(statuses.DO2)}
              onDo2Click={() => onConfigure("DO2")}
              di4_2StatusColor={getColorForStatus(statuses.DI4_2)}
              onDi4_2Click={() => onConfigure("DI4_2")}
              ai2StatusColor={getColorForStatus(statuses.AI2)}
              onAi2Click={() => onConfigure("AI2")}
              hart2StatusColor={getColorForStatus(statuses.HI2)}
              onHart2Click={() => onConfigure("HI2")}
              ao1StatusColor={getColorForStatus(statuses.AO1)}
              onAo1Click={() => onConfigure("AO1")}
              di3StatusColor={getColorForStatus(statuses.DI3)}
              onDi3Click={() => onConfigure("DI3")}
              di5StatusColor={getColorForStatus(statuses.DI5)}
              onDi5Click={() => onConfigure("DI5")}
              do1StatusColor={getColorForStatus(statuses.DO1)}
              onDo1Click={() => onConfigure("DO1")}
              do3StatusColor={getColorForStatus(statuses.DO3)}
              onDo3Click={() => onConfigure("DO3")}
              do5StatusColor={getColorForStatus(statuses.DO5)}
              onDo5Click={() => onConfigure("DO5")}
              ao2StatusColor={getColorForStatus(statuses.AO2)}
              onAo2Click={() => onConfigure("AO2")}
            />
          </div>
        </div>
      </>
    );
  }
);

export default InterfacesConfiguration;
