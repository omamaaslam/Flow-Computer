// Configuration.tsx
import { useParams } from "react-router-dom";
import { useState } from "react";
import StreamConfiguration from "../../StreamConfiguration";
import InterfacesConfiguration from "./InterfacesConfiguration";
import ConfigureInterface from "./ConfigureInterface";
import { observer } from "mobx-react-lite";
import globalStore from "../../../../../stores/GlobalStore";

type ActiveTab = "stream" | "interfaces";

const ConfigurationPage = observer(() => {
  const { streamId } = useParams<{ streamId: string }>();
  const [activeTab, setActiveTab] = useState<ActiveTab>("stream");
  const [configuringInterfaceId, setConfiguringInterfaceId] = useState<
    string | null
  >(null);

  const selectedStream = streamId
    ? globalStore.streams.find((s) => s.id === streamId)
    : globalStore.streams[0];

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
    const baseClasses = `rounded-full shadow-md transition-colors duration-200 text-xs px-3 py-1.5 border border-transparent md:text-sm md:px-4 md:py-2 md:border-transparent`;
    const activeClasses = "bg-yellow-500 text-black font-semibold";
    const inactiveClasses =
      "bg-white text-gray-800 md:border md:border-gray-200 hover:bg-gray-100";
    return activeTab === tabName
      ? `${baseClasses} ${activeClasses}`
      : `${baseClasses} ${inactiveClasses}`;
  };

  const foundInterface =
    configuringInterfaceId && selectedStream
      ? selectedStream.ioCards[0]?.interfaces.find(
          (iface) => iface.interface_id === configuringInterfaceId
        )
      : null;

  // Agar stream na mile to loading ya error state dikhayein
  if (!selectedStream) {
    return <div>No Stream Fount...</div>;
  }

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
            {!configuringInterfaceId ? (
              <InterfacesConfiguration
                stream={selectedStream}
                onConfigure={handleSelectInterfaceToConfigure}
              />
            ) : foundInterface ? (
              <ConfigureInterface
                anInterface={foundInterface}
                onBack={handleBackToInterfacesList}
              />
            ) : (
              // This part will now only show if there's a major error, like no IO Card.
              <div className="text-center p-4 text-gray-600">
                Error loading interface '{configuringInterfaceId}'.
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
