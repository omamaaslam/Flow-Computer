import { Home, Bell, Cpu, Users, Monitor, Settings } from "lucide-react";
import { observer } from "mobx-react-lite";
import { navigationStore } from "../stores/NavigationStore";
import { useMediaQuery } from "react-responsive";

const navItems = [
  {
    label: "Home",
    icon: <Home size={18} />,
    action: () => navigationStore.goToHome(),
    routeKey: "Home",
    children: ["Configuration"],
  },
  {
    label: "Alarms",
    icon: <Bell size={18} />,
    action: () => navigationStore.goToAlarms(),
    routeKey: "Alarms",
    children: [],
  },
  {
    label: "Devices",
    icon: <Cpu size={18} />,
    action: () => navigationStore.goToDevices(),
    routeKey: "Devices",
    children: [],
  },
  {
    label: "Users",
    icon: <Users size={18} />,
    action: () => navigationStore.goToUsers(),
    routeKey: "Users",
    children: [],
  },
  {
    label: "System Settings",
    icon: <Settings size={18} />,
    action: () => navigationStore.goToSystemSettings(),
    routeKey: "SystemSettings",
    children: [],
  },
];

const Sidebar = observer(() => {
  const isTablet = useMediaQuery({ maxWidth: 1024 });

  return (
    <aside
      className={`bg-zinc-900 text-white h-screen ${
        isTablet ? "w-12" : "w-56"
      } flex flex-col items-center py-4 transition-all duration-300`}
    >
      <div className="mb-8">
        <img
          src="\companyLogos\RMA_Sidebar_logo.png"
          alt="RMA Logo"
          className={`mx-auto ${isTablet ? "w-10" : "w-24"}`}
        />
      </div>

      <nav className="flex flex-col gap-2 w-full font-sans">
        {navItems.map(({ label, icon, action, routeKey, children }) => {
          const currentActiveRoute = navigationStore.currentRoute;
          const isActive =
            currentActiveRoute === routeKey ||
            (currentActiveRoute && children.includes(currentActiveRoute));

          return (
            <button
              key={label}
              onClick={action}
              className={`flex items-center 
                ${isTablet ? "justify-center" : "justify-start gap-3 px-4"} 
                py-2 text-sm transition-all duration-200
                ${
                  isActive
                    ? `bg-yellow-500 text-black font-semibold ${
                        isTablet
                          ? "rounded-full w-8 h-8 mx-auto border-2 border-zinc-900"
                          : "border-y-2 border-zinc-900"
                      }`
                    : "hover:bg-zinc-800"
                }`}
            >
              {icon}
              {!isTablet && <span>{label}</span>}
            </button>
          );
        })}
      </nav>
    </aside>
  );
});

export default Sidebar;
