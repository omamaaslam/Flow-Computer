const Header = () => {
  return (
    <>
      {/* Top header bar with yellow bottom border */}
      <header className="bg-gray-100 flex items-center justify-between px-6 py-4 border-b-4 border-yellow-400">
        <h1 className="text-lg font-semibold text-gray-800">FLOW COMPUTER</h1>
        <div className="flex items-center gap-2">
          <img
            src="https://i.pravatar.cc/150?img=12"
            alt="User Avatar"
            className="w-9 h-9 rounded-full border border-gray-300"
          />
          <span className="text-sm text-gray-800 font-medium">Weber Swerge</span>
        </div>
      </header>

      {/* Extra black border line immediately below */}
      <div className="w-full h-[3px] bg-black" />
    </>
  );
};

export default Header;
