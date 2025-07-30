const Header = () => {
  return (
    <>
      <header
        className={`
          bg-gray-100 flex items-center justify-between border-yellow-400
          
          // --- Small Screen Styles (Corrected) ---
          h-[38px] px-4 border-b-2

          // --- Desktop Styles (Original) ---
          md:h-auto md:px-6 md:py-4 md:border-b-4
        `}
      >
        <h1 className="text-MD font-semibold font-sans text-gray-800">
          FLOW COMPUTER
        </h1>
        <div
          className={`
            flex items-center
            
            // --- Small Screen Styles (from Figma) ---
            gap-[5px]

            // --- Desktop Styles (Original) ---
            md:gap-2
          `}
        >
          <img
            src="https://i.pravatar.cc/150?img=12"
            alt="User Avatar"
            // --- CHANGED: Made avatar size responsive ---
            className="w-7 h-7 md:w-9 md:h-9 rounded-full border border-gray-300"
          />
          <span className="text-sm text-gray-800 font-medium font-sans">
            Fahad
          </span>
        </div>
      </header>
      <div className="w-full h-[3px] bg-black" />
      {/* <Alert message="WebSocket disconnected" type="error" /> */}
    </>
  );
};

export default Header;
