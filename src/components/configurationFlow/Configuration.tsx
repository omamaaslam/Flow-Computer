// src/pages/Configuration.tsx

import { useState } from "react";
import StreamConfiguration from "./StreamConfiguration";
import InterfacesConfiguration from "./InterfacesConfiguration";
import ConfigureInterface from "./ConfigureInterface";
import { observer } from "mobx-react-lite";
import globalStore from "../../stores/GlobalStore";

// No more mapping import needed
// import { idNameMapping } from "../../models/IOCard";

type ActiveTab = "stream" | "interfaces";

const ConfigurationPage = observer(() => {
  const [activeTab, setActiveTab] = useState<ActiveTab>("stream");
  const [configuringInterfaceId, setConfiguringInterfaceId] = useState<
    string | null
  >(null);

  const handleSelectInterfaceToConfigure = (interfaceId: string) => {
    setConfiguringInterfaceId(interfaceId);
  };

  const handleBackToInterfacesList = () => {
    setConfiguringInterfaceId(null);
  };

  const handleTabClick = (tabName: ActiveTab) => {
    setActiveTab(tabName);
    setConfiguringInterfaceId(null);
  };

  const getButtonClass = (tabName: ActiveTab) => {
    const baseClasses = `rounded-full shadow-md transition-colors duration-200 
       text-xs px-3 py-1.5 border border-transparent 
       md:text-sm md:px-4 md:py-2 md:border-transparent`;
    const activeClasses = "bg-yellow-500 text-black font-semibold";
    const inactiveClasses =
      "bg-white text-gray-800 md:border md:border-gray-200 hover:bg-gray-100";

    return activeTab === tabName
      ? `${baseClasses} ${activeClasses}`
      : `${baseClasses} ${inactiveClasses}`;
  };

  // The find logic is now simpler. It directly compares the interface ID.
  const foundInterface = configuringInterfaceId
    ? globalStore.streams
        .flatMap((s) => s.ioCards)
        .flatMap((c) => c.interfaces)
        .find((iface) => iface.id === configuringInterfaceId)
    : null;

  return (
    <div className="py-2 md:py-0 w-full max-w-screen-xl mx-auto space-y-6">
      <div className="flex justify-end gap-2 md:gap-4 px-2 md:px-0">
        <button
          onClick={() => handleTabClick("stream")}
          className={getButtonClass("stream")}
        >
          Stream Configuration
        </button>
        <button
          onClick={() => handleTabClick("interfaces")}
          className={getButtonClass("interfaces")}
        >
          Interfaces Configuration
        </button>
      </div>

      <div>
        {activeTab === "stream" && <StreamConfiguration />}
        {activeTab === "interfaces" && (
          <>
            {configuringInterfaceId === null ? (
              <InterfacesConfiguration
                onConfigure={handleSelectInterfaceToConfigure}
              />
            ) : foundInterface ? (
              <ConfigureInterface
                anInterface={foundInterface}
                onBack={handleBackToInterfacesList}
              />
            ) : (
              // This message will now show if the user clicks on a gray (unconfigured) interface.
              <div className="text-center p-4 text-gray-600">
                Interface '{configuringInterfaceId}' is not configured.
                <button
                  onClick={handleBackToInterfacesList}
                  className="block mx-auto mt-4 px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Back to Diagram
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
});

export default ConfigurationPage;
