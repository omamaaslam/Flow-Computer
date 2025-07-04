import { Home, Bell, Cpu, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { navigationStore } from "../stores/NavigationStore";
import { useMediaQuery } from "react-responsive";

const navItems = [
  {
    label: "Home",
    icon: <Home size={18} />,
    action: () => navigationStore.goToHome(),
  },
  {
    label: "Alarms",
    icon: <Bell size={18} />,
    action: () => navigationStore.goToAlarms(),
  },
  {
    label: "Devices",
    icon: <Cpu size={18} />,
    action: () => navigationStore.goToDevices(),
  },
  {
    label: "Users",
    icon: <Users size={18} />,
    action: () => navigationStore.goToUsers(),
  },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const isTablet = useMediaQuery({ maxWidth: 1024 }); // Tailwind `lg` breakpoint

  const isActive = (label: string) => {
    if (label === "Home") {
      return (
        navigationStore.currentRoute === "Home" ||
        navigationStore.currentRoute === "Configuration"
      );
    }
    return navigationStore.currentRoute === label;
  };

  if (!navigationStore["navigator"]) {
    navigationStore.initNavigator(navigate);
  }

  return (
    <aside
      className={`bg-zinc-900 text-white h-screen ${
        isTablet ? "w-20" : "w-56"
      } flex flex-col items-center py-4 transition-all duration-300`}
    >
      <div className="mb-8">
        <img
          src="\companyLogos\RMA_Sidebar_logo.png"
          alt="RMA Logo"
          className={`mx-auto ${isTablet ? "w-10" : "w-24"}`}
        />
      </div>

      <nav className="flex flex-col gap-2 w-full">
        {navItems.map(({ label, icon, action }) => (
          <button
            key={label}
            onClick={action}
            className={`flex items-center 
${isTablet ? "justify-center" : "justify-start gap-3 px-4"} 
py-2 text-sm 
${
  isActive(label)
    ? `bg-yellow-500 text-black font-semibold ${
        isTablet ? "rounded-full w-12 h-12 mx-auto border-2" : "border-y-2"
      }`
    : "hover:bg-zinc-800"
}`}
          >
            {icon}
            {!isTablet && <span>{label}</span>}
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
