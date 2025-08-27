import { observer } from "mobx-react-lite";
import globalStore from "../stores/GlobalStore";
import MeterGuage from "./MeterGuage";
import Thermometer from "./Thermometer";
import React, { useState } from "react";
import ArchiveDataComponent from "./Archive";
import { Archive } from "lucide-react";

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
    className={`bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col p-4 h-[190px] lg:h-[260px] ${className}`}
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

// --- Main Screen Component ---
const MonitorScreen = observer(() => {
  const [showArchive, setShowArchive] = useState<string | null>(null);
  const streamId = results[0]?.stream_id;
  return (
    <div className="w-full font-sans text-gray-600">
      {results.length > 0 ? (
        <>
          {results.map((res: any, index) => {
            const tableDisplayConfig = [
              // Group 1: Original Volume
              {
                label: "Original Volume",
                key: "current_volume_original",
                unit: "m³",
                statusKey: "volume_interference_flag",
              },
              {
                label: "Last Original Volume",
                key: "last_volume_original",
                unit: "m³",
              },
              {
                label: "Delta Original Volume",
                key: "delta_volume_original",
                unit: "m³",
              },
              // Group 2: Temperature
              {
                label: "Operating Temperature",
                key: "operating_temperature",
                unit: res.temperature_unit,
                statusKey: "temperature_interference_flag",
              },
              {
                label: "Base Temperature",
                key: "base_temperature",
                unit: res.temperature_unit,
              },
              // Group 3: Pressure
              {
                label: "Operating Pressure",
                key: "operating_pressure",
                unit: res.pressure_unit,
                statusKey: "pressure_interference_flag",
              },
              {
                label: "Base Pressure",
                key: "base_pressure",
                unit: res.pressure_unit,
              },
              // Group 4: Flow Rate
              {
                label: "Device Flow Rate",
                key: "device_flow_rate",
                unit: "m³/h",
                statusKey: "flow_rate_interference_flag",
              },
              {
                label: "Software Flow Rate",
                key: "software_flow_rate",
                unit: "m³/h",
              },
              // Group 5: Standard & Interference Volumes and Flow Rates
              {
                label: "Operating Volume (Net)",
                key: "operating_volume_net",
                unit: "m³",
              },
              {
                label: "Standard Volume (Forward)",
                key: "standard_volume_forward",
                unit: "m³",
              },
              {
                label: "Interference Volume (Forward)",
                key: "interference_volume_forward",
                unit: "m³",
              },
              {
                label: "Standard Interference Volume (Forward)",
                key: "standard_interference_volume_forward",
                unit: "m³",
              },
              {
                label: "Operating Flow Rate",
                key: "operating_flow_rate",
                unit: "m³/h",
              },
              {
                label: "Standard Flow Rate",
                key: "standard_flow_rate",
                unit: "m³/h",
              },
              {
                label: "Interference Flow Rate",
                key: "interference_flow_rate",
                unit: "m³/h",
              },
              {
                label: "Standard Interference Flow Rate",
                key: "standard_interference_flow_rate",
                unit: "m³/h",
              },
              // Group 6: Flow Creep
              {
                label: "Flow Creep Enabled",
                key: "flow_creep_enable_flag",
                statusKey: "flow_creep_interference_flag",
              },
              {
                label: "Flow Creep Alarm",
                key: "flow_creep_alarm",
                statusKey: "flow_creep_interference_flag",
              },
              // Group 7: All Gasses
              {
                label: "Methane",
                key: "CH4",
                unit: "%mol",
                statusKey: "CH4_interference",
              },
              {
                label: "Nitrogen",
                key: "N2",
                unit: "%mol",
                statusKey: "N2_interference",
              },
              {
                label: "Carbon Dioxide",
                key: "CO2",
                unit: "%mol",
                statusKey: "CO2_interference",
              },
              {
                label: "Ethane",
                key: "C2H6",
                unit: "%mol",
                statusKey: "C2H6_interference",
              },
              {
                label: "Propane",
                key: "C3H8",
                unit: "%mol",
                statusKey: "C3H8_interference",
              },
              {
                label: "i-Butane",
                key: "I-C4H10",
                unit: "%mol",
                statusKey: "I-C4H10_interference",
              },
              {
                label: "n-Butane",
                key: "N_C4H10",
                unit: "%mol",
                statusKey: "N_C4H10_interference",
              },
              {
                label: "i-Pentane",
                key: "I-C5H12",
                unit: "%mol",
                statusKey: "I-C5H12_interference",
              },
              {
                label: "n-Pentane",
                key: "N_C5H12",
                unit: "%mol",
                statusKey: "N_C5H12_interference",
              },
              {
                label: "n-Hexane",
                key: "C6H14",
                unit: "%mol",
                statusKey: "C6H14_interference",
              },
              {
                label: "n-Heptane",
                key: "C7H16",
                unit: "%mol",
                statusKey: "C7H16_interference",
              },
              {
                label: "n-Octane",
                key: "C8H18",
                unit: "%mol",
                statusKey: "C8H18_interference",
              },
              {
                label: "Nonane",
                key: "C9H20",
                unit: "%mol",
                statusKey: "C9H20_interference",
              },
              {
                label: "Decane",
                key: "C10H22",
                unit: "%mol",
                statusKey: "C10H22_interference",
              },
              {
                label: "Hydrogen",
                key: "H2",
                unit: "%mol",
                statusKey: "H2_interference",
              },
              {
                label: "Hydrogen Sulfide",
                key: "H2S",
                unit: "%mol",
                statusKey: "H2S_interference",
              },
              {
                label: "Carbon Monoxide",
                key: "CO",
                unit: "%mol",
                statusKey: "CO_interference",
              },
              {
                label: "Oxygen",
                key: "O2",
                unit: "%mol",
                statusKey: "O2_interference",
              },
              {
                label: "Water",
                key: "H2O",
                unit: "%mol",
                statusKey: "H2O_interference",
              },
              {
                label: "Helium",
                key: "HE",
                unit: "%mol",
                statusKey: "HE_interference",
              },
              {
                label: "Argon",
                key: "AR",
                unit: "%mol",
                statusKey: "AR_interference",
              },
              {
                label: "Pseudo HS",
                key: "HS",
                unit: "",
                statusKey: "HS_interference",
              },
              {
                label: "Pseudo SD",
                key: "SD",
                unit: "",
                statusKey: "SD_interference",
              },
            ];

            return (
              <div key={index} className="space-y-6">
                <div className="hidden lg:block space-y-8">
                  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex justify-between">
                      <div>
                      <span>Active Profile</span>
                      <button
                        onClick={() => setShowArchive(res.stream_id || globalStore.streams[index]?.id || index.toString())}
                        className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-gray-800 text-bold rounded-lg transition-colors"
                      >
                        <Archive size={18} />
                        View Archive
                      </button>
                      </div>
                      <span>
                        <strong>Update Time:</strong>
                        {new Date(res.current_system_timestamp).toLocaleString(
                          "en-GB",
                          {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                            hour12: false,
                          }
                        )}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-6">
                      <div className="border border-gray-200 rounded-lg p-6">
                        <p className="text-md">
                          <span className="font-bold text-gray-600">
                            Original Volume
                          </span>{" "}
                          <span className="font-semibold text-cyan-600 pl-2">
                            {res.current_volume_original.toFixed(5)} m³
                          </span>
                        </p>
                      </div>
                      <div className="border border-gray-200 rounded-lg p-6">
                        <p className="text-md">
                          <span className="font-bold text-gray-600 ">
                            Operating Volume
                          </span>
                          <span className="font-semibold text-cyan-600 pl-2">
                            {res.operating_volume_net.toFixed(5)} m³
                          </span>
                        </p>
                      </div>
                      <div className="border border-gray-200 rounded-lg p-6">
                        <p className="text-md">
                          <span className="font-bold text-gray-600">
                            Std Volume
                          </span>{" "}
                          <span className="font-semibold text-cyan-600 pl-2">
                            {res.standard_volume_forward.toFixed(5)} m³
                          </span>
                        </p>
                      </div>
                      <div className="border border-gray-200 rounded-lg p-6">
                        <p className="text-md">
                          <span className="font-bold text-gray-600">
                            Current Flow Rate:
                          </span>{" "}
                          <span className="font-semibold text-cyan-600 pl-2">
                            {res.device_flow_rate.toFixed(5)} m³/h
                          </span>
                        </p>
                      </div>
                      <div className="border border-gray-200 rounded-lg p-6">
                        <p className="text-md">
                          <span className="font-bold text-gray-600 ">
                            Interference Volume:
                          </span>
                          <span className="font-semibold text-cyan-600 pl-2">
                            {res.interference_volume_forward.toFixed(5)} m³
                          </span>
                        </p>
                      </div>
                      <div className="border border-gray-200 rounded-lg p-6">
                        <p className="text-md">
                          <span className="font-bold text-gray-600">
                            Std. Interference Volume:
                          </span>{" "}
                          <span className="font-semibold text-cyan-600 pl-2">
                            {res.standard_interference_volume_forward.toFixed(
                              5
                            )}{" "}
                            m³
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
                            {res.operating_pressure.toFixed(5)}{" "}
                            {res.pressure_unit}
                          </span>
                        </p>
                        <p className="flex justify-between py-2.5">
                          <span>Temperature:</span>{" "}
                          <span className="font-semibold text-cyan-600">
                            {res.operating_temperature.toFixed(5)}{" "}
                            {res.temperature_unit}
                          </span>
                        </p>
                        <p className="flex justify-between py-2.5">
                          <span>K-Number:</span>{" "}
                          <span className="font-semibold text-cyan-600">
                            {res.compressibility_k_factor.toFixed(5)}
                          </span>
                        </p>
                        <p className="flex justify-between py-2.5">
                          <span>Z-Factor:</span>{" "}
                          <span className="font-semibold text-cyan-600">
                            {res.correction_z_factor.toFixed(5)}
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
                          {res.temperature_logs?.[
                            res.temperature_logs.length - 1
                          ] || "No temperature logs"}
                        </div>
                        <div
                          className={`p-2 border-l-4 ${
                            res.flow_rate_interference_flag
                              ? "border-red-500 bg-red-100/80 text-red-700"
                              : "bg-green-100 border-green-500 text-green-800"
                          }`}
                        >
                          {res.flow_rate_logs?.[
                            res.flow_rate_logs.length - 1
                          ] || "No flow rate logs"}
                        </div>
                        <div
                          className={`p-2 border-l-4 ${
                            res.pressure_interference_flag
                              ? "border-red-500 bg-red-100/80 text-red-700"
                              : "bg-green-100 border-green-500 text-green-800"
                          }`}
                        >
                          {res.pressure_logs?.[res.pressure_logs.length - 1] ||
                            "No pressure logs"}
                        </div>
                        <div
                          className={`p-2 border-l-4 ${
                            !res.last_status_ok
                              ? "border-red-500 bg-red-100/80 text-red-700"
                              : "bg-blue-100 border-blue-500 text-blue-800"
                          }`}
                        >
                          {res.system_logs?.[res.system_logs.length - 1] ||
                            "No system logs"}
                        </div>
                        <div
                          className={`p-2 border-l-4 ${
                            res.volume_interference_flag
                              ? "border-red-500 bg-red-100/80 text-red-700"
                              : "bg-green-100 border-green-500 text-green-800"
                          }`}
                        >
                          {res.volume_logs?.[res.volume_logs.length - 1] ||
                            "No volume logs"}
                        </div>
                        <div
                          className={`p-2 border-l-4 ${
                            res.compressibility_interference_flag
                              ? "border-red-500 bg-red-100/80 text-red-700"
                              : "bg-green-100 border-green-500 text-green-800"
                          }`}
                        >
                          {res.compressibility_logs?.[
                            res.compressibility_logs.length - 1
                          ] || "No compressibility logs"}
                        </div>
                      </div>
                    </InfoCard>
                  </div>
                  <div>
                    <div className="grid grid-cols-3 gap-6">
                      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg flex flex-col items-center ">
                        <h3 className="font-bold text-xl">Flow Rate</h3>
                        <div className="text-center mt-2">
                          <MeterGuage
                            currentValue={res.device_flow_rate}
                            unit="m3/h"
                            min={0}
                            max={50000}
                          />
                          <p className="text-lg text-gray-500 mt-3">
                            {res.device_flow_rate.toFixed(5)} m³/h
                          </p>
                        </div>
                      </div>
                      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg flex flex-col items-center justify-around">
                        <h3 className="font-bold text-xl">Pressure</h3>
                        <div className="text-center mt-2">
                          <MeterGuage
                            currentValue={res.operating_pressure}
                            unit="Bar"
                            min={0}
                            max={20}
                          />
                          <p className="text-lg text-gray-500 mt-3">
                            {res.operating_pressure.toFixed(5)}{" "}
                            {res.pressure_unit}
                          </p>
                        </div>
                      </div>
                      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg flex flex-col items-center justify-around">
                        <h3 className="font-bold text-xl">Temperature</h3>
                        <div className="text-center">
                          <Thermometer
                            currentValue={res.operating_temperature}
                            min={-20}
                            max={100}
                          />
                          <p className="text-lg text-gray-500 mt-3">
                            {res.operating_temperature} {res.temperature_unit}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm overflow-auto my-6">
                  <h3 className="text-xl font-bold p-2 text-gray-700">
                    Detailed Results
                  </h3>
                  <table className="w-full text-sm text-left">
                    <thead className="text-sm text-gray-700 uppercase bg-[#FFB700] sticky top-0">
                      <tr>
                        <th className="px-6 py-3">NAME</th>
                        <th className="px-6 py-3">VALUE</th>
                        <th className="px-6 py-3">UNIT</th>
                        <th className="px-6 py-3">STATUS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableDisplayConfig.map((item) => {
                        // Skip rendering if the key doesn't exist in the data
                        if (!res.hasOwnProperty(item.key)) {
                          return null;
                        }

                        const value = res[item.key];
                        const isInterference = item.statusKey
                          ? res[item.statusKey]
                          : false;

                        // Format value for display
                        let displayValue;
                        if (typeof value === "number") {
                          displayValue = value.toFixed(4);
                        } else if (typeof value === "boolean") {
                          displayValue = value ? "True" : "False";
                        } else {
                          displayValue = String(value);
                        }

                        return (
                          <tr
                            key={item.key}
                            className="bg-white border-b hover:bg-gray-50"
                          >
                            <td className="px-6 py-4 font-medium text-gray-900">
                              {item.label}
                            </td>
                            <td className="px-6 py-4">{displayValue}</td>
                            <td className="px-6 py-4">{item.unit || "---"}</td>
                            <td className="px-6 py-4">
                              {item.statusKey ? (
                                <div className="flex items-center gap-2">
                                  <div
                                    className={`w-2.5 h-2.5 rounded-full ${
                                      isInterference
                                        ? "bg-red-500"
                                        : "bg-green-500"
                                    }`}
                                  ></div>
                                  <span>
                                    {isInterference ? "Interference" : "OK"}
                                  </span>
                                </div>
                              ) : (
                                "---"
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
           {/* Archive start here  */}
            {showArchive && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-xl w-full max-w-7xl max-h-[90vh] overflow-hidden">
                <div className="overflow-auto max-h-[calc(90vh-80px)]">
                  <ArchiveDataComponent streamId={showArchive} onClose={() => setShowArchive(null)} />
                </div>
              </div>
            </div>
          )}

           {/* Archive end here  */}
        </>
      ) : (
        <p>No results yet...</p>
      )}
    </div>
  );
});

export default MonitorScreen;
