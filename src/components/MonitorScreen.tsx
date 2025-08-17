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
globalStore.results.map((result)=> {
  console.log("Result:", result.pressure_interference_flag);
})


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
    <h3 className="font-semibold text-gray-800 border-b pb-1 mb-1 text-lg">
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
const MonitorScreen = () => {
  const tableData = [
    { name: "Operating Volume Forward", value: "125.67", unit: "m³" },
    { name: "Operating Volume Reverse", value: "12.34", unit: "m³" },
    { name: "Operating Volume Net", value: "113.33", unit: "m³" },
    { name: "Interference Volume Forward", value: "1.12", unit: "m³" },
    { name: "Interference Volume Reverse", value: "0.56", unit: "m³" },
    { name: "Interference Volume Net", value: "0.56", unit: "m³" },
    { name: "Operating Total Volume Forward", value: "126.79", unit: "m³" },
    { name: "Operating Total Volume Reverse", value: "12.90", unit: "m³" },
    { name: "Operating Total Volume Net", value: "113.89", unit: "m³" },
    { name: "Standard Volume Forward", value: "120.55", unit: "Sm³" },
    { name: "Standard Volume Reverse", value: "11.89", unit: "Sm³" },
    { name: "Standard Volume Net", value: "108.66", unit: "Sm³" },
    { name: "Standard Total Volume Forward", value: "121.50", unit: "Sm³" },
    { name: "Standard Total Volume Reverse", value: "12.40", unit: "Sm³" },
    { name: "Standard Total Volume Net", value: "109.10", unit: "Sm³" },
    { name: "Operating Flow Rate Forward", value: "55.43", unit: "m³/hr" },
    { name: "Operating Flow Rate Reverse", value: "2.11", unit: "m³/hr" },
    { name: "Operating Flow Rate Net", value: "53.32", unit: "m³/hr" },
    { name: "Standard Flow Rate Forward", value: "52.88", unit: "Sm³/hr" },
    { name: "Standard Flow Rate Reverse", value: "1.99", unit: "Sm³/hr" },
    { name: "Standard Flow Rate Net", value: "50.89", unit: "Sm³/hr" },
    { name: "Z-Factor", value: "0.9982", unit: "Unitless" },
    { name: "K-Number", value: "1.0012", unit: "Unitless" },
    { name: "Last Z-Factor", value: "0.9981", unit: "Unitless" },
    { name: "Last K-Number", value: "1.0011", unit: "Unitless" },
    { name: "Delta Z-Factor", value: "0.0001", unit: "Unitless" },
    { name: "Delta K-Number", value: "0.0001", unit: "Unitless" },
    { name: "Last Volume Original", value: "110.00", unit: "m³" },
    { name: "Current Volume Original", value: "113.33", unit: "m³" },
    { name: "Delta Volume Original", value: "3.33", unit: "m³" },
    { name: "Last Timestamp", value: "1672531140", unit: "s" },
    { name: "Current Timestamp", value: "1672531200", unit: "s" },
    { name: "Delta Time", value: "60.00", unit: "s" },
    { name: "Operating Pressure", value: "4.20", unit: "bar" },
    { name: "Operating Temperature", value: "18.50", unit: "°C" },
    { name: "Substitution Pressure", value: "4.21", unit: "bar" },
    { name: "Substitution Temperature", value: "18.45", unit: "°C" },
    { name: "Software Flow Rate", value: "53.32", unit: "m³/hr" },
    { name: "Device Flow Rate", value: "53.31", unit: "m³/hr" },
  ];
  return (
    <div className="w-full font-sans text-gray-800">
      <div className="space-y-6">
        {/* ======================================= */}
        {/*         LARGE SCREEN LAYOUT             */}
        {/* ======================================= */}
        <div className="hidden lg:block space-y-8">
          {/* *** NEW: Operating Volume Section for large screens *** */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="font-semibold text-gray-700 text-lg mb-4">
              Current Volume:
            </h3>
            <div className="grid grid-cols-3 gap-6">
              {/* Card 1: Positive */}
              <div className="border border-gray-200 rounded-lg p-6">
                <p className="text-xl">
                  <span className="font-bold text-gray-800">Positive:</span>{" "}
                  <span className="font-semibold text-cyan-600 pl-2">
                    123.45 m<sup>3</sup>
                  </span>
                </p>
              </div>

              {/* Card 2: Reverse */}
              <div className="border border-gray-200 rounded-lg p-6">
                <p className="text-xl">
                  <span className="font-bold text-gray-800 ">Reverse:</span>

                  <span className="font-semibold text-cyan-600 pl-2">
                    123.45 m<sup>3</sup>
                  </span>
                </p>
              </div>

              {/* Card 3: Net */}
              <div className="border border-gray-200 rounded-lg p-6">
                <p className="text-xl">
                  <span className="font-bold text-gray-800">Net:</span>{" "}
                  <span className="font-semibold text-cyan-600 pl-2">
                    123.45 m<sup>3</sup>
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* *** NEW: Grid for Conditions, System, and Alerts with custom widths *** */}
          <div className="grid grid-cols-5 gap-6">
            <InfoCard title="Conditions" className="col-span-2">
              <div className="text-sm divide-y divide-gray-200">
                <p className="flex justify-between py-2.5">
                  <span>Pressure:</span>{" "}
                  <span className="font-semibold text-cyan-600">4.2 bar</span>
                </p>
                <p className="flex justify-between py-2.5">
                  <span>Temperature:</span>{" "}
                  <span className="font-semibold text-cyan-600">18.5c</span>
                </p>
                <p className="flex justify-between py-2.5">
                  <span>Z-Factor:</span>{" "}
                  <span className="font-semibold text-cyan-600">0.9982</span>
                </p>
                <p className="flex justify-between py-2.5">
                  <span>K-Number:</span>{" "}
                  <span className="font-semibold text-cyan-600">1.0012</span>
                </p>
              </div>
            </InfoCard>

            <InfoCard title="System Status" className="col-span-1">
              <div className="space-y-3 text-sm pt-2 ">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>System OK</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Flow Normal</span>
                </div>
                <div className="flex items-center gap-3 font-bold">
                  <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                  <span>Temperature</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Pressure</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Volume</span>
                </div>
              </div>
            </InfoCard>

            <InfoCard title="Alerts" scrollable={true} className="col-span-2">
              <div className="space-y-2 text-sm">
                <div className="bg-red-100 border-l-4 border-red-500 p-2">
                  Temperature exceeds
                </div>
                <div className="bg-yellow-100 border-l-4 border-yellow-500 p-2">
                  Flow Rate variance detected
                </div>
                <div className="bg-red-100/80 border-l-4 border-red-500 p-2 rounded-r-sm">
                  Pressure Anomaly
                </div>
                <div className="bg-blue-100/80 border-l-4 border-blue-500 p-2 rounded-r-sm">
                  Maintenance due
                </div>
                <div className="bg-blue-100/80 border-l-4 border-blue-500 p-2 rounded-r-sm">
                  Connectivity lost
                </div>
                <div className="bg-blue-100/80 border-l-4 border-blue-500 p-2 rounded-r-sm">
                  Low Battery
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
                  <p className="text-lg text-gray-500 mt-3">Flow Rate: 0.00</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg flex flex-col items-center justify-around">
                <h3 className="font-bold text-xl">Pressure</h3>
                <div className="text-center mt-2">
                  <GaugeIcon size={250} />
                  <p className="text-lg text-gray-500 mt-3">
                    Pressure: 4.2 bar
                  </p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg flex flex-col items-center justify-around">
                <h3 className="font-bold text-xl">Temperature</h3>
                <div className="text-center">
                  <ThermometerIcon size={250} />
                  <p className="text-lg text-gray-500 mt-3">
                    Temperature: 42°C (Hot)
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
            <h3 className="font-semibold text-gray-800 text-base mb-2">
              Forward Volume
            </h3>
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-white border rounded-lg shadow-sm p-3 text-center">
                <p className="font-bold text-sm">Operating Volume</p>
                <p className="font-semibold text-cyan-600 text-lg">
                  555555555.000<span className="text-xs"> m³</span>
                </p>
              </div>
              <div className="bg-white border rounded-lg shadow-sm p-3 text-center">
                <p className="font-bold text-sm">Normalized Volume</p>
                <p className="font-semibold text-cyan-600 text-lg">
                  555555555.000<span className="text-xs"> m³</span>
                </p>
              </div>
              <div className="bg-white border rounded-lg shadow-sm p-3 text-center">
                <p className="font-bold text-sm">Original Volume</p>
                <p className="font-semibold text-cyan-600 text-lg">
                  555555555.000<span className="text-xs"> m³</span>
                </p>
              </div>
            </div>
          </div>

          <div>
            <div className="flex flex-row items-stretch gap-2 h-[170px]">
              <div className="flex flex-1 flex-col bg-white border rounded-lg shadow-sm p-3">
                <h3 className="font-semibold text-gray-800 text-sm border-b pb-1 mb-2">
                  Conditions
                </h3>
                <div className="text-xs divide-y divide-gray-200">
                  <p className="flex justify-between py-1.5">
                    <span className="text-cyan-600">Pressure:</span>
                    <span className="font-medium text-gray-700">4.2 bar</span>
                  </p>
                  <p className="flex justify-between py-1.5">
                    <span className="text-cyan-600">Temp:</span>
                    <span className="font-medium text-gray-700">18.5c</span>
                  </p>
                  <p className="flex justify-between py-1.5">
                    <span className="text-cyan-600">Z-Factor:</span>
                    <span className="font-medium text-gray-700">0.9982</span>
                  </p>
                  <p className="flex justify-between py-1.5">
                    <span className="text-cyan-600">K-Number:</span>
                    <span className="font-medium text-gray-700">1.0012</span>
                  </p>
                </div>
              </div>

              <div className="flex flex-col bg-white border rounded-lg shadow-sm p-3">
                <h3 className="font-semibold text-gray-800 text-sm border-b pb-1 mb-2">
                  System
                </h3>
                <div className="space-y-1.5 text-xs pt-1">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 bg-green-500 rounded-full flex-shrink-0"></div>
                    <span>System OK</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 bg-green-500 rounded-full flex-shrink-0"></div>
                    <span>Flow Normal</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 bg-red-500 rounded-full flex-shrink-0"></div>
                    <span className="font-bold">Temperature</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 bg-green-500 rounded-full flex-shrink-0"></div>
                    <span>Pressure</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 bg-green-500 rounded-full flex-shrink-0"></div>
                    <span>Volume</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-1 flex-col bg-white border rounded-lg shadow-sm p-3">
                <h3 className="font-semibold text-gray-800 text-sm border-b pb-1 mb-2">
                  Alerts
                </h3>
                <div className="flex-grow overflow-y-auto space-y-1.5 text-xs pr-1">
                  <div className="bg-red-100/80 border-l-4 border-red-500 p-2 rounded-r-sm">
                    Temperature exceeds
                  </div>
                  <div className="bg-yellow-100/80 border-l-4 border-yellow-500 p-2 rounded-r-sm">
                    Flow Rate variance
                  </div>
                  <div className="bg-red-100/80 border-l-4 border-red-500 p-2 rounded-r-sm">
                    Pressure Anomaly
                  </div>
                  <div className="bg-blue-100/80 border-l-4 border-blue-500 p-2 rounded-r-sm">
                    Maintenance due
                  </div>
                  <div className="bg-yellow-100/80 border-l-4 border-yellow-500 p-2 rounded-r-sm">
                    Low Battery
                  </div>
                  <div className="bg-red-100/80 border-l-4 border-red-500 p-2 rounded-r-sm">
                    Connectivity Lost
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
                  <p className="text-[20px] text-gray-500 mt-3">0.00 m³/hr</p>
                </div>
              </div>
              <div className="bg-white p-2 rounded-lg border shadow-lg flex flex-col items-center justify-between text-center">
                <h3 className="font-bold text-lg mb-1">Pressure</h3>
                <div className="my-2">
                  <GaugeIcon size={150} />
                  <p className="text-[20px] text-gray-500 mt-3">4.2 bar</p>
                </div>
              </div>
              <div className="bg-white p-2 rounded-lg border shadow-lg flex flex-col items-center text-center">
                <h3 className="font-bold text-lg mb-1">Temperature</h3>
                <div className="text-center pt-3    ">
                  <ThermometerIcon size={150} />
                  <p className="text-[20px] text-gray-500 mt-1">42°C (Hot)</p>
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
              {tableData.map((row, index) => (
                <tr key={index} className="bg-white border-b hover:bg-gray-50 ">
                  <td className="px-6 py-4">{row.name}</td>
                  <td className="px-6 py-4 ">{row.value}</td>
                  <td className="px-6 py-4">{row.unit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MonitorScreen;
