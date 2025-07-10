// Configuration.tsx
import { useState } from 'react';
import StreamConfiguration from './StreamConfiguration'; 
import InterfacesConfiguration from './InterfacesConfiguration';
import ConfigureInterface from './ConfigureInterface'; // --- MODIFIED: Import the detail page component ---

type ActiveTab = 'stream' | 'interfaces';

const ConfigurationPage = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('interfaces'); // Set to interfaces for easier testing
  
  // --- NEW STATE ---
  // This state holds the ID of the interface being configured.
  // null = show the SVG list view.
  // string (e.g., "MOD") = show the specific configuration/detail view.
  const [configuringInterfaceId, setConfiguringInterfaceId] = useState<string | null>(null);

  // --- NEW HANDLER: Passed down to InterfacesConfiguration to set the state ---
  const handleSelectInterfaceToConfigure = (interfaceId: string) => {
    setConfiguringInterfaceId(interfaceId);
  };

  // --- NEW HANDLER: Passed down to ConfigureInterface to go back to the list ---
  const handleBackToInterfaceList = () => {
    setConfiguringInterfaceId(null);
  };
  
  // --- MODIFIED: This now resets the view when switching main tabs ---
  const handleTabClick = (tabName: ActiveTab) => {
    setActiveTab(tabName);
    // Always reset to the list view when a main tab is clicked
    setConfiguringInterfaceId(null); 
  };

  // --- Common function to get button classes (Unchanged) ---
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
        
        {/* --- MODIFIED: Conditional rendering logic for the interfaces tab --- */}
        {activeTab === 'interfaces' && (
          <>
            {configuringInterfaceId === null ? (
              // If no ID is set, show the list of interfaces (the SVG)
              <InterfacesConfiguration 
                onConfigure={handleSelectInterfaceToConfigure} 
              />
            ) : (
              // If an ID is set, show the detail page for that interface
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