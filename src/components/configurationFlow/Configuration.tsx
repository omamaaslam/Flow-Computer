import { Thermometer, Logs, Gauge, MoveHorizontal } from "lucide-react";

const Configuration = () => {
  return (
    <div className="p-6 w-full max-w-screen-xl mx-auto space-y-6">
      {/* Top Right Buttons */}
      <div className="flex justify-end gap-4">
        <button className="px-4 py-2 bg-white text-gray-800 rounded-full shadow-md border border-gray-200 hover:bg-gray-100 transition">
          Stream Configuration
        </button>
        <button className="px-4 py-2 bg-yellow-500 text-black rounded-full shadow-md font-semibold">
          Interfaces Configuration
        </button>
      </div>

      {/* Outer Wrapper Card */}
      <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200 space-y-8">
        {/* Visualization Card */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <div className="flex flex-col lg:flex-row justify-around items-center gap-8 lg:gap-0">
            {/* Volume */}
            <div className="flex flex-col items-center">
              <span className="text-yellow-500 font-semibold text-sm">Volume</span>
              <div className="w-10 h-48 border-4 border-black rounded-md relative mt-2 bg-white flex flex-col justify-end">
                <div className="w-full h-2/3 bg-gradient-to-t from-gray-400 to-white" />
              </div>
            </div>

            {/* Cylinder */}
            <div className="relative bg-gradient-to-t from-gray-500 to-gray-300 w-40 h-48 rounded-t-3xl border-4 border-black flex flex-wrap content-start items-start p-2 gap-1.5">
              {Array.from({ length: 14 }).map((_, i) => (
                <div
                  key={i}
                  className="w-4 h-4 bg-white border border-black rounded-full"
                ></div>
              ))}
            </div>

            {/* Temperature */}
            <div className="flex flex-col items-center">
              <span className="text-yellow-500 font-semibold text-sm">Temperature</span>
              <div className="flex items-center mt-2">
                <div className="w-6 h-48 bg-white border-4 border-black rounded-full flex flex-col-reverse overflow-hidden relative">
                  <div className="h-2/5 bg-red-600 w-full rounded-b-full" />
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-6 bg-red-600 border-4 border-black rounded-full" />
                </div>
                <div className="ml-2 text-xs space-y-4 text-black font-semibold">
                  <div>100°C</div>
                  <div>50°C</div>
                  <div>0°C</div>
                </div>
              </div>
            </div>

            {/* Pressure */}
            <div className="flex flex-col items-center">
              <span className="text-yellow-500 font-semibold text-sm mb-2">Pressure</span>
              <div className="relative w-36 h-36 rounded-full border-[6px] border-black flex items-center justify-center">
                <div className="absolute w-1 h-16 bg-yellow-500 origin-bottom rotate-[300deg]" />
                <div className="absolute w-4 h-4 bg-yellow-500 rounded-full" />
                <div className="absolute bottom-2 text-sm text-black font-semibold">
                  x10<sup>5</sup>N/m<sup>2</sup>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Control Buttons Card */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="flex items-center justify-center gap-2 py-3 px-4 border rounded-xl shadow-sm hover:bg-gray-100 transition">
              <Logs className="text-yellow-500" size={20} />
              <span className="text-sm font-medium">Volume</span>
            </button>
            <button className="flex items-center justify-center gap-2 py-3 px-4 border rounded-xl shadow-sm hover:bg-gray-100 transition">
              <Thermometer className="text-yellow-500" size={20} />
              <span className="text-sm font-medium">Temperature</span>
            </button>
            <button className="flex items-center justify-center gap-2 py-3 px-4 border rounded-xl shadow-sm hover:bg-gray-100 transition">
              <Gauge className="text-yellow-500" size={20} />
              <span className="text-sm font-medium">Pressure</span>
            </button>
            <button className="flex items-center justify-center gap-2 py-3 px-4 border rounded-xl shadow-sm hover:bg-gray-100 transition">
              <MoveHorizontal className="text-yellow-500" size={20} />
              <span className="text-sm font-medium">Conversion</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Configuration;


<MoveHorizontal />