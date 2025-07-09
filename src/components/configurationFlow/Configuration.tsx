import { useState } from 'react';
import StreamConfiguration from './StreamConfiguration'; 
import InterfacesConfiguration from './InterfacesConfiguration';

type ActiveTab = 'stream' | 'interfaces';

const ConfigurationPage = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('stream');

  // --- Common function to get button classes (Refined for smooth transition) ---
  const getButtonClass = (tabName: ActiveTab) => {
    // --- BASE classes for ALL buttons (font, size, transitions) ---
    // The key is to have a transparent border on the inactive button 
    // to prevent size-jumping during transition.
    const baseClasses = 
      `rounded-full shadow-md transition-colors duration-200 
       text-xs px-3 py-1.5 border border-transparent 
       md:text-sm md:px-4 md:py-2 md:border-transparent`;
    
    // --- Classes for the ACTIVE tab ---
    // Restores your original active look on large screens (md:border-gray-200 is gone).
    const activeClasses = 'bg-yellow-500 text-black font-semibold';
    
    // --- Classes for the INACTIVE tab ---
    // Restores your original inactive look exactly.
    const inactiveClasses = 'bg-white text-gray-800 md:border md:border-gray-200 hover:bg-gray-100';

    if (activeTab === tabName) {
      return `${baseClasses} ${activeClasses}`;
    }
    return `${baseClasses} ${inactiveClasses}`;
  };

  return (
    // Reverted outer padding and gap to your original values
    <div className="py-6 w-full max-w-screen-xl mx-auto space-y-6">
      {/* Top Tab Buttons - adjusted responsive gap and padding */}
      <div className="flex justify-end gap-2 md:gap-4 px-2 md:px-0">
        <button
          onClick={() => setActiveTab('stream')}
          className={getButtonClass('stream')}
        >
          Stream Configuration
        </button>
        <button
          onClick={() => setActiveTab('interfaces')}
          className={getButtonClass('interfaces')}
        >
          Interfaces Configuration
        </button>
      </div>

      {/* Conditionally render the active component based on the tab state */}
      <div>
        {activeTab === 'stream' && <StreamConfiguration />}
        {activeTab === 'interfaces' && <InterfacesConfiguration />}
      </div>
    </div>
  );
};

export default ConfigurationPage;