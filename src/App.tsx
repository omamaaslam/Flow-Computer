// App.tsx
import { observer } from "mobx-react-lite";
import { navigationStore } from "./stores/NavigationStore";
import globalStore from "./stores/GlobalStore";
import { ROUTES } from "./routes";
import Sidebar from "./components/Sidebar";
import Breadcrumb from "./components/Breadcrumb";
import Header from "./components/Header";
import { useNavigate, useLocation, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Home from "./components/Home";
import Configuration from "./components/configurationFlow/Stream/io_card/Interface/Configuration";
import { connectWebSocket } from "./utils/api";
import MonitorScreen from "./components/MonitorScreen";
import { getGlobalStateSnapshot } from "./utils/services";
import ArchiveDataComponent from "./components/Archive";
import SystemSettings from "./components/SystemSettings";

const App = observer(() => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    navigationStore.setCurrentPath(location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    if (!navigationStore.navigatorInitialized) {
      navigationStore.initNavigator(navigate);
    }
  }, [navigate]);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Step 1: WebSocket se connect karein
        await connectWebSocket();
        // Step 2: Hamesha ke liye updates sunna shuru karein
        globalStore.listenForUpdates();
        await getGlobalStateSnapshot();
        console.log("Global state snapshot request sent. The listener will handle the response.");
      } catch (error) {
        console.error("App shuru karne mein masla hua:", error);
      }
    };

    initializeApp();
  }, []);

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <div className="overflow-y-auto">
          <Breadcrumb />
          <div className="px-6">
            <Routes>
              <Route path={ROUTES.Home} element={<Home />} />
              <Route path={ROUTES.Alarms} element={<h1>Alarms Page</h1>} />
              <Route path={ROUTES.Devices} element={<h1>Devices Page</h1>} />
              <Route path={ROUTES.Users} element={<h1>Users Page</h1>} />
              <Route path={ROUTES.Monitor} element={<MonitorScreen />} />
              <Route path={ROUTES.Configuration} element={<Configuration />} />
              <Route path={ROUTES.SystemSettings} element={<SystemSettings />} />
              <Route path="*" element={<h1>404: Page Not Found</h1>} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
});

export default App;
