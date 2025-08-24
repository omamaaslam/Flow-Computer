import { observer } from "mobx-react-lite";
import globalStore from "../stores/GlobalStore";
const GaugeIcon = ({ size = 100 }: { size?: number }) => (
  <img
    src="/MonitorSvg/Meter.svg"
    alt="Meter Icon"
    width={size}
    height={size}
    className="mx-auto"
  />
);
const ThermometerIcon = ({ size = 100 }: { size?: number }) => (
  <img
    src="/MonitorSvg/Thermometer.svg"
    alt="Thermometer Icon"
    width={size * 0.33}
    height={size}
    className="mx-auto"
  />
);
const results = globalStore.results;
const InfoCard = ({
  title,
  children,
  scrollable = false,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  scrollable?: boolean;
  className?: string;
}) => (
  <div
    className={`bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col p-4 h-[190px] lg:h-[260px] ${className}`} // Applied the className prop
  >
    <h3 className="font-semibold text-gray-600 border-b pb-1 mb-1 text-lg">
      {title}
    </h3>
    <div
      className={`flex-grow ${
        scrollable ? "overflow-y-auto pr-2" : "overflow-hidden"
      }`}
    >
      {children}
    </div>
  </div>
);

const GasDevices = [
  { name: "CH4", label: "Methanes" },
  { name: "N2", label: "Nitrogen" },
  { name: "CO2", label: "Carbon Dioxide" },
  { name: "C2H6", label: "Ethane" },
  { name: "C3H8", label: "Propane" },
  { name: "H2O", label: "Water" },
  { name: "H2S", label: "Hydrogen sulfides" },
  { name: "H2", label: "Hydrogen" },
  { name: "CO", label: "Carbon monoxide" },
  { name: "O2", label: "Oxygen" },
  { name: "IC4H10", label: "i-Butane" },
  { name: "C4H10", label: "n-butane" },
  { name: "IC5H12", label: "i-Pentane" },
  { name: "C5H12", label: "n-Pentanes" },
  { name: "C6H14", label: "n-hexanes" },
  { name: "C7H16", label: "n-heptanes" },
  { name: "C8H18", label: "n-octanes" },
  { name: "C9H20", label: "n-Nonane" },
  { name: "C10H22", label: "n-Decane" },
  { name: "HE", label: "Helium" },
  { name: "AR", label: "Argon" },
  { name: "HI", label: "heating value" },
  { name: "RD", label: "density ratio" },
  { name: "WI", label: "Wobbe index" },
];

// --- Main Screen Component ---
const MonitorScreen = observer(() => {
  return (
    <div className="w-full font-sans text-gray-600">
      {results.length > 0 ? (
        <>
          {results.map((res) => (
            <>
              <div className="space-y-6">
                {/* ======================================= */}
                {/*         LARGE SCREEN LAYOUT             */}
                {/* ======================================= */}
                <div className="hidden lg:block space-y-8">
                  {/* *** NEW: Operating Volume Section for large screens *** */}
                  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="grid grid-cols-3 gap-6">
                      {/* Card 1: Positive */}
                      <div className="border border-gray-200 rounded-lg p-6">
                        <p className="text-md">
                          <span className="font-bold text-gray-600">
                            Original Volume
                          </span>{" "}
                          <span className="font-semibold text-cyan-600 pl-2">
                            {res.current_volume_original} m³
                          </span>
                        </p>
                      </div>

                      {/* Card 2: Reverse */}
                      <div className="border border-gray-200 rounded-lg p-6">
                        <p className="text-md">
                          <span className="font-bold text-gray-600 ">
                            Operating Volume
                          </span>

                          <span className="font-semibold text-cyan-600 pl-2">
                            {res.operating_volume_net} m³
                          </span>
                        </p>
                      </div>

                      {/* Card 3: Net */}
                      <div className="border border-gray-200 rounded-lg p-6">
                        <p className="text-md">
                          <span className="font-bold text-gray-600">
                            Std Volume
                          </span>{" "}
                          <span className="font-semibold text-cyan-600 pl-2">
                            {res.standard_volume_forward} m³
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-6">
                      {/* Card 1: Positive */}
                      <div className="border border-gray-200 rounded-lg p-6">
                        <p className="text-md">
                          <span className="font-bold text-gray-600">
                            Current Flow Rate:
                          </span>{" "}
                          <span className="font-semibold text-cyan-600 pl-2">
                            {res.device_flow_rate} m³/h
                          </span>
                        </p>
                      </div>

                      {/* Card 2: Reverse */}
                      <div className="border border-gray-200 rounded-lg p-6">
                        <p className="text-md">
                          <span className="font-bold text-gray-600 ">
                            Interference Volume:
                          </span>

                          <span className="font-semibold text-cyan-600 pl-2">
                            {res.interference_volume_forward} m³
                          </span>
                        </p>
                      </div>

                      {/* Card 3: Net */}
                      <div className="border border-gray-200 rounded-lg p-6">
                        <p className="text-md">
                          <span className="font-bold text-gray-600">
                            Std. Interference Volume:
                          </span>{" "}
                          <span className="font-semibold text-cyan-600 pl-2">
                            {res.standard_interference_volume_forward} m³
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-5 gap-6">
                    <InfoCard title="Conditions" className="col-span-2">
                      <div className="text-sm divide-y divide-gray-200">
                        <p className="flex justify-between py-2.5">
                          <span>Pressure:</span>{" "}
                          <span className="font-semibold text-cyan-600">
                            {res.operating_pressure} {res.pressure_unit}
                          </span>
                        </p>
                        <p className="flex justify-between py-2.5">
                          <span>Temperature:</span>{" "}
                          <span className="font-semibold text-cyan-600">
                            {res.operating_temperature} {res.temperature_unit}
                          </span>
                        </p>
                        <p className="flex justify-between py-2.5">
                          <span>K-Number:</span>{" "}
                          <span className="font-semibold text-cyan-600">
                            {res.compressibility_k_factor}
                          </span>
                        </p>
                        <p className="flex justify-between py-2.5">
                          <span>Z-Factor:</span>{" "}
                          <span className="font-semibold text-cyan-600">
                            {res.correction_z_factor}
                          </span>
                        </p>
                      </div>
                    </InfoCard>

                    <InfoCard title="System Status" className="col-span-1">
                      <div className="space-y-3 text-sm pt-2 ">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              res.pressure_interference_flag
                                ? "bg-red-600"
                                : "bg-green-500"
                            }`}
                          />
                          <span>Pressure</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              res.temperature_interference_flag
                                ? "bg-red-600"
                                : "bg-green-500"
                            }`}
                          />
                          <span>Temperature</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              res.volume_interference_flag
                                ? "bg-red-600"
                                : "bg-green-500"
                            }`}
                          />
                          <span>Volume</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              res.flow_rate_interference_flag
                                ? "bg-red-600"
                                : "bg-green-500"
                            }`}
                          />
                          <span>FlowRate</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              res.compressibility_interference_flag
                                ? "bg-red-600"
                                : "bg-green-500"
                            }`}
                          />
                          <span>K-Number</span>
                        </div>
                      </div>
                    </InfoCard>

                    <InfoCard
                      title="Alerts"
                      scrollable={true}
                      className="col-span-2"
                    >
                      <div className="space-y-2 text-sm">
                        <div
                          className={`p-2 border-l-4 ${
                            res.temperature_interference_flag
                              ? "border-red-500 bg-red-100/80 text-red-700"
                              : "bg-green-100 border-green-500 text-green-800"
                          }`}
                        >
                          {
                            res.temperature_logs[
                              res.temperature_logs.length - 1
                            ]
                          }
                        </div>
                        <div
                          className={`p-2 border-l-4 ${
                            res.flow_rate_interference_flag
                              ? "border-red-500 bg-red-100/80 text-red-700"
                              : "bg-green-100 border-green-500 text-green-800"
                          }`}
                        >
                          {res.flow_rate_logs[res.flow_rate_logs.length - 1]}
                        </div>
                        <div
                          className={`p-2 border-l-4 ${
                            res.pressure_interference_flag
                              ? "border-red-500 bg-red-100/80 text-red-700"
                              : "bg-green-100 border-green-500 text-green-800"
                          }`}
                        >
                          {res.pressure_logs[res.pressure_logs.length - 1]}
                        </div>
                        <div
                          className={`p-2 border-l-4 ${
                            res.system_logs
                              ? "border-red-500 bg-red-100/80 text-red-700"
                              : "bg-green-100 border-blue-500 text-blue-800"
                          }`}
                        >
                          {res.system_logs[res.system_logs.length - 1]}
                        </div>
                        <div
                          className={`p-2 border-l-4 ${
                            res.volume_interference_flag
                              ? "border-red-500 bg-red-100/80 text-red-700"
                              : "bg-green-100 border-green-500 text-green-800"
                          }`}
                        >
                          {res.volume_logs[res.volume_logs.length - 1]}
                        </div>
                        <div
                          className={`p-2 border-l-4 ${
                            res.compressibility_interference_flag
                              ? "border-red-500 bg-red-100/80 text-red-700"
                              : "bg-green-100 border-green-500 text-green-800"
                          }`}
                        >
                          {
                            res.compressibility_logs[
                              res.compressibility_logs.length - 1
                            ]
                          }
                        </div>
                      </div>
                    </InfoCard>
                  </div>

                  <div>
                    <div className="grid grid-cols-3 gap-6">
                      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg flex flex-col items-center ">
                        <h3 className="font-bold text-xl">Flow Rate</h3>
                        <div className="text-center mt-2">
                          <GaugeIcon size={250} />
                          <p className="text-lg text-gray-500 mt-3">
                            Flow Rate: {res.device_flow_rate}
                          </p>
                        </div>
                      </div>
                      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg flex flex-col items-center justify-around">
                        <h3 className="font-bold text-xl">Pressure</h3>
                        <div className="text-center mt-2">
                          <GaugeIcon size={250} />
                          <p className="text-lg text-gray-500 mt-3">
                            Pressure:{res.operating_pressure}{" "}
                            {res.pressure_unit}
                          </p>
                        </div>
                      </div>
                      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg flex flex-col items-center justify-around">
                        <h3 className="font-bold text-xl">Temperature</h3>
                        <div className="text-center">
                          <ThermometerIcon size={250} />
                          <p className="text-lg text-gray-500 mt-3">
                            Temperature: {res.operating_temperature}{" "}
                            {res.temperature_unit}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ======================================= */}
                {/*          SMALL SCREEN LAYOUT            */}
                {/* ======================================= */}
                <div className="block lg:hidden space-y-4">
                  <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-white border rounded-lg shadow-sm p-3 text-center">
                        <p className="font-bold text-xs">Orignal Volume</p>
                        <p className="font-semibold text-cyan-600 text-sm">
                          {res.current_volume_original} m³
                        </p>
                      </div>
                      <div className="bg-white border rounded-lg shadow-sm p-3 text-center">
                        <p className="font-bold text-xs">Operating Volume:</p>
                        <p className="font-semibold text-cyan-600 text-sm">
                          {res.operating_volume_net} m³
                        </p>
                      </div>
                      <div className="bg-white border rounded-lg shadow-sm p-3 text-center">
                        <p className="font-bold text-xs">Std. Volume</p>
                        <p className="font-semibold text-cyan-600 text-sm">
                          {res.standard_volume_net} m³
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-white border rounded-lg shadow-sm p-3 text-center">
                        <p className="font-bold text-xs">Current Flow Rate</p>
                        <p className="font-semibold text-cyan-600 text-sm">
                          {res.device_flow_rate} m³/h
                        </p>
                      </div>
                      <div className="bg-white border rounded-lg shadow-sm p-3 text-center">
                        <p className="font-bold text-xs">Interference Volume</p>
                        <p className="font-semibold text-cyan-600 text-sm">
                          {res.interference_volume_forward} m³
                        </p>
                      </div>
                      <div className="bg-white border rounded-lg shadow-sm p-3 text-center">
                        <p className="font-bold text-xs">
                          Std. Interference Volume
                        </p>
                        <p className="font-semibold text-cyan-600 text-sm">
                          {res.standard_interference_volume_forward} m³
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex flex-row items-stretch gap-2 h-[170px]">
                      <div className="flex flex-1 flex-col bg-white border rounded-lg shadow-sm p-3">
                        <h3 className="font-semibold text-gray-600 text-sm border-b pb-1 mb-2">
                          Conditions
                        </h3>
                        <div className="text-xs divide-y divide-gray-200">
                          <p className="flex justify-between py-1.5">
                            <span className="text-cyan-600">Pressure</span>
                            <span className="font-medium text-gray-700">
                              {res.operating_pressure} {res.pressure_unit}
                            </span>
                          </p>
                          <p className="flex justify-between py-1.5">
                            <span className="text-cyan-600">Temp</span>
                            <span className="font-medium text-gray-700">
                              {res.operating_temperature} {res.temperature_unit}
                            </span>
                          </p>
                          <p className="flex justify-between py-1.5">
                            <span className="text-cyan-600">K-Factor</span>
                            <span className="font-medium text-gray-700">
                              {res.compressibility_k_factor}
                            </span>
                          </p>
                          <p className="flex justify-between py-1.5">
                            <span className="text-cyan-600">Z-Number</span>
                            <span className="font-medium text-gray-700">
                              {res.correction_z_factor}
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col bg-white border rounded-lg shadow-sm p-3">
                        <h3 className="font-semibold text-gray-600 text-sm border-b pb-1 mb-2">
                          System Status
                        </h3>
                        <div className="space-y-1.5 text-xs pt-1">
                          <div className="flex items-center gap-1.5">
                            <div className="w-2.5 h-2.5 bg-green-500 rounded-full flex-shrink-0"></div>
                            <span>System OK</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <div
                              className={`w-2.5 h-2.5 rounded-full ${
                                res.flow_rate_interference_flag
                                  ? "bg-red-600"
                                  : "bg-green-500"
                              } flex-shrink-0`}
                            ></div>
                            <span>Flow Normal</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <div
                              className={`w-2.5 h-2.5 rounded-full ${
                                res.temperature_interference_flag
                                  ? "bg-red-600"
                                  : "bg-green-500"
                              } flex-shrink-0`}
                            ></div>
                            <span className="font-bold">Temperature</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <div
                              className={`w-2.5 h-2.5 rounded-full ${
                                res.pressure_interference_flag
                                  ? "bg-red-600"
                                  : "bg-green-500"
                              } flex-shrink-0`}
                            ></div>
                            <span>Pressure</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <div
                              className={`w-2.5 h-2.5 rounded-full ${
                                res.volume_interference_flag
                                  ? "bg-red-600"
                                  : "bg-green-500"
                              } flex-shrink-0`}
                            ></div>
                            <span>Volume</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-1 flex-col bg-white border rounded-lg shadow-sm p-3">
                        <h3 className="font-semibold text-gray-600 text-sm border-b pb-1 mb-2">
                          Alerts
                        </h3>
                        <div className="flex-grow overflow-y-auto space-y-1.5 text-xs pr-1">
                          <div
                            className={`border-l-4 p-2 rounded-r-sm ${
                              res.temperature_interference_flag
                                ? "border-red-500 bg-red-100/80 text-red-700" // Consistent error style
                                : "bg-green-100 border-green-500 text-gray-800" // New light green success style
                            }`}
                          >
                            {
                              res.temperature_logs[
                                res.temperature_logs.length - 1
                              ]
                            }
                          </div>
                          <div
                            className={`border-l-4 p-2 rounded-r-sm ${
                              res.flow_rate_interference_flag
                                ? "border-red-500 bg-red-100/80 text-red-700" // Consistent error style
                                : "bg-green-100 border-green-500 text-gray-800" // New light green success style
                            }`}
                          >
                            {res.flow_rate_logs[res.flow_rate_logs.length - 1]}
                          </div>
                          <div
                            className={`border-l-4 p-2 rounded-r-sm ${
                              res.pressure_interference_flag
                                ? "border-red-500 bg-red-100/80 text-red-700" // Consistent error style
                                : "bg-green-100 border-green-500 text-gray-800" // New light green success style
                            }`}
                          >
                            {res.pressure_logs[res.pressure_logs.length - 1]}
                          </div>
                          <div
                            className={`border-l-4 p-2 rounded-r-sm ${
                              res.system_logs
                                ? "border-red-500 bg-red-100/80 text-red-700"
                                : "bg-blue-100 border-blue-500 text-blue-800" // Replaced green style with blue
                            }`}
                          >
                            {res.system_logs[res.system_logs.length - 1]}
                          </div>
                          <div
                            className={`border-l-4 p-2 rounded-r-sm ${
                              res.volume_interference_flag
                                ? "border-red-500 bg-red-100/80 text-red-700" // Consistent error style
                                : "bg-green-100 border-green-500 text-gray-800" // New light green success style
                            }`}
                          >
                            {res.volume_logs[res.volume_logs.length - 1]}
                          </div>
                          <div
                            className={`border-l-4 p-2 rounded-r-sm ${
                              res.compressibility_interference_flag
                                ? "border-red-500 bg-red-100/80 text-red-700" // Consistent error style
                                : "bg-green-100 border-green-500 text-gray-800" // New light green success style
                            }`}
                          >
                            {
                              res.compressibility_logs[
                                res.compressibility_logs.length - 1
                              ]
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-white p-2 rounded-lg border shadow-lg flex flex-col items-center justify-between text-center">
                        <h3 className="font-bold text-lg mb-1">Flow Rate</h3>
                        <div className="my-2">
                          <GaugeIcon size={150} />
                          <p className="text-[20px] text-gray-500 mt-3">
                            {res.operating_flow_rate}
                          </p>
                        </div>
                      </div>
                      <div className="bg-white p-2 rounded-lg border shadow-lg flex flex-col items-center justify-between text-center">
                        <h3 className="font-bold text-lg mb-1">Pressure</h3>
                        <div className="my-2">
                          <GaugeIcon size={150} />
                          <p className="text-[20px] text-gray-500 mt-3">
                            {res.operating_pressure}
                          </p>
                        </div>
                      </div>
                      <div className="bg-white p-2 rounded-lg border shadow-lg flex flex-col items-center text-center">
                        <h3 className="font-bold text-lg mb-1">Temperature</h3>
                        <div className="text-center pt-3    ">
                          <ThermometerIcon size={150} />
                          <p className="text-[20px] text-gray-500 mt-1">
                            {res.operating_temperature}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Table Section */}
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm overflow-auto h-96 lg:h-[500px] my-6">
                  <table className="w-full text-sm text-left">
                    <thead className="text-sm text-gray-700 uppercase bg-[#FFB700] sticky top-0">
                      <tr>
                        <th className="px-6 py-3">Name</th>
                        <th className="px-6 py-3 whitespace-nowrap">Value</th>
                        <th className="px-6 py-3 whitespace-nowrap">Unit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {GasDevices.map((device) => {
                        // Check if the device name exists as a key in the result object
                        if (res.hasOwnProperty(device.name)) {
                          const value = res[device.name];
                          return (
                            <tr
                              key={device.name}
                              className="bg-white border-b hover:bg-gray-50"
                            >
                              <td className="px-6 py-4 font-medium text-gray-900">
                                {device.label}
                              </td>
                              <td className="px-6 py-4">
                                {/* Format number to a few decimal places for readability */}
                                {typeof value === "number"
                                  ? value.toFixed(4)
                                  : value}
                              </td>
                              <td className="px-6 py-4">%mol</td>
                            </tr>
                          );
                        }
                        return null; // Don't render a row if the data doesn't exist for it
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ))}
        </>
      ) : (
        <p>No results yet...</p>
      )}
    </div>
  );
});

export default MonitorScreen;
