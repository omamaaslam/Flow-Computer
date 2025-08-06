// import React from "react";
// import { observer } from "mobx-react-lite";
// import { ArrowUpDown } from "lucide-react";
// import type globalStore from "../../../stores/GlobalStore";
// import type { CompressibilityKFactorConfig } from "../../../types/streamConfig";
// interface ConversionFormProps {
//   store: typeof globalStore;
//   config: CompressibilityKFactorConfig;
//   onCommit: () => void;
//   onClose: () => void;
// }

// const ConversionForm: React.FC<ConversionFormProps> = observer(
//   ({ store, config, onCommit, onClose }) => {
//     const availableDevices = store.allDevices;
//     const handleMethodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//       config.method = e.target.value;
//     };

//     const handleRowInputChange = (
//       index: number,
//       field:any,
//       value: string
//     ) => {
//       config.rows[index][field] = value;
//     };

//     const UnitDisplay = ({ unit }: { unit: string }) => {
//       const parts = unit.split("³");
//       return parts.length > 1 ? (
//         <span>
//           {parts[0]}
//           <sup>3</sup>
//           {parts[1]}
//         </span>
//       ) : (
//         <span>{unit}</span>
//       );
//     };

//     return (
//       <div className="flex flex-col gap-4">
//         <div className="space-y-1">
//           <label className="block font-medium text-xs text-gray-700">
//             Method
//           </label>
//           <select
//             value={config.method}
//             onChange={handleMethodChange}
//             className="w-full max-w-xs border border-gray-200 rounded-sm px-2 py-1 text-sm shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
//           >
//             <option value="GERG88_1">GERG88_1</option>
//             <option value="ISO6976_2">ISO6976_2</option>
//           </select>
//         </div>
//         <div className="border border-gray-200 rounded-md overflow-hidden shadow-sm">
//           <div className="grid grid-cols-[2.5fr_1.5fr_1fr_2fr_2fr] items-center border-b bg-gray-50 font-semibold text-xs text-gray-700">
//             <div className="flex items-center gap-1 cursor-pointer hover:text-gray-900 px-3 py-2">
//               Name <ArrowUpDown size={12} />
//             </div>
//             <div className="px-3 py-2">Live Value</div>
//             <div className="flex items-center gap-1 cursor-pointer hover:text-gray-900 px-3 py-2">
//               Unit <ArrowUpDown size={12} />
//             </div>
//             <div className="px-3 py-2">Link Device</div>
//             <div className="px-3 py-2">Keyboard Input</div>
//           </div>
//           <div>
//             {config.rows.map((row, index) => (
//               <div
//                 key={row.name}
//                 className="grid grid-cols-[2.5fr_1.5fr_1fr_2fr_2fr] items-center text-xs border-b last:border-b-0"
//               >
//                 <div className="font-medium text-gray-800 px-3 py-1.5">
//                   {row.name}
//                 </div>
//                 <div className="text-gray-600 px-3 py-1.5">{row.liveValue}</div>
//                 <div className="text-gray-700 px-3 py-1.5">
//                   <UnitDisplay unit={row.unit} />
//                 </div>
//                 <div className="px-2 py-1.5">
//                   <select
//                     value={row.linkedDevice}
//                     onChange={(e) =>
//                       handleRowInputChange(
//                         index,
//                         "linkedDevice",
//                         e.target.value
//                       )
//                     }
//                     className="w-full border border-gray-300 rounded-sm px-2 py-1 text-xs shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
//                   >
//                     <option value="" selected disabled>
//                       Select Device
//                     </option>
//                     {availableDevices.map((device) => (
//                       <option key={device.id} value={device.name}>
//                         {device.name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//                 <div className="px-2 py-1.5">
//                   <input
//                     type="text"
//                     value={row.keyboardInput}
//                     onChange={(e) =>
//                       handleRowInputChange(
//                         index,
//                         "keyboardInput",
//                         e.target.value
//                       )
//                     }
//                     placeholder="Enter value"
//                     className="w-full border border-gray-300 rounded-sm px-2 py-1 text-xs shadow-sm focus:ring-1 focus:ring-yellow-500"
//                   />
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//         <div className="flex justify-end gap-2 pt-2">
//           <button
//             onClick={onClose}
//             className="px-5 py-1.5 rounded-full font-semibold text-xs text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={onCommit}
//             className="px-5 py-1.5 rounded-full font-semibold text-xs text-black bg-yellow-500 hover:bg-yellow-600 transition-colors"
//           >
//             Save
//           </button>
//         </div>
//       </div>
//     );
//   }
// );


const ConversionForm = () => {
  return <>Conversion Form</>
};

export default ConversionForm;