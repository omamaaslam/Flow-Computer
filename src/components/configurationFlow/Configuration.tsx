// Configuration.tsx
import { useState } from 'react';
import StreamConfiguration from './StreamConfiguration'; 
import InterfacesConfiguration from './InterfacesConfiguration';
import ConfigureInterface from './ConfigureInterface'; // --- MODIFIED: Import the detail page component ---

type ActiveTab = 'stream' | 'interfaces';

const ConfigurationPage = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('interfaces'); // Set to interfaces for easier testing

  const [configuringInterfaceId, setConfiguringInterfaceId] = useState<string | null>(null);

  const handleSelectInterfaceToConfigure = (interfaceId: string) => {
    setConfiguringInterfaceId(interfaceId);
  };

  const handleBackToInterfaceList = () => {
    setConfiguringInterfaceId(null);
  };
  

  const handleTabClick = (tabName: ActiveTab) => {
    setActiveTab(tabName);
    setConfiguringInterfaceId(null); 
  };

  const getButtonClass = (tabName: ActiveTab) => {
    const baseClasses = 
      `rounded-full shadow-md transition-colors duration-200 
       text-xs px-3 py-1.5 border border-transparent 
       md:text-sm md:px-4 md:py-2 md:border-transparent`;
    
    const activeClasses = 'bg-yellow-500 text-black font-semibold';
    
    const inactiveClasses = 'bg-white text-gray-800 md:border md:border-gray-200 hover:bg-gray-100';

    if (activeTab === tabName) {
      return `${baseClasses} ${activeClasses}`;
    }
    return `${baseClasses} ${inactiveClasses}`;
  };

  return (
    <div className="py-6 w-full max-w-screen-xl mx-auto space-y-6">
      <div className="flex justify-end gap-2 md:gap-4 px-2 md:px-0">
        <button
          onClick={() => handleTabClick('stream')}
          className={getButtonClass('stream')}
        >
          Stream Configuration
        </button>
        <button
          onClick={() => handleTabClick('interfaces')}
          className={getButtonClass('interfaces')}
        >
          Interfaces Configuration
        </button>
      </div>

      <div>
        {activeTab === 'stream' && <StreamConfiguration />}
        
        {activeTab === 'interfaces' && (
          <>
            {configuringInterfaceId === null ? (
              <InterfacesConfiguration 
                onConfigure={handleSelectInterfaceToConfigure} 
              />
            ) : (
              <ConfigureInterface 
                interfaceId={configuringInterfaceId} 
                onBack={handleBackToInterfaceList} 
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ConfigurationPage;