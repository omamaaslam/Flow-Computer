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
        console.log("WebSocket se connection hogaya, ab updates sunenge...");

        // Step 2: Hamesha ke liye updates sunna shuru karein
        globalStore.listenForUpdates();
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
              <Route path={ROUTES.Monitor} element={<h1>Monitor Page</h1>} />
              <Route path={ROUTES.Configuration} element={<Configuration />} />
              <Route path="*" element={<h1>404: Page Not Found</h1>} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
});

export default App;
