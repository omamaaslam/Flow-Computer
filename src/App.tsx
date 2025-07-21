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
import Configuration from "./components/configurationFlow/Configuration";

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
    if (globalStore.streams.length > 0) return;

    const initialStreamData = [
      { id: 1, name: "Eastren Stream" },
      { id: 2, name: "Northen Stream" },
      { id: 3, name: "Westren Stream" },
      { id: 4, name: "Southren Stream" },
      { id: 5, name: "Stream E" },
    ];

    globalStore.initializeStreams(initialStreamData);

    const firstStream = globalStore.streams[0];
    if (firstStream) {
      const ioCard = firstStream.addIOCard(1, []);
      ioCard.addInterface(1, "MOD");
      ioCard.addInterface(2, "DI1");
      ioCard.addInterface(3, "DI2");
      ioCard.addInterface(4, "DI3");
      ioCard.addInterface(5, "DI4");
      ioCard.addInterface(6, "DI5");
      ioCard.addInterface(7, "AI1");
      ioCard.addInterface(8, "AI2");
      ioCard.addInterface(9, "RTD");
      ioCard.addInterface(10, "DO1");
      ioCard.addInterface(11, "DO2");
      ioCard.addInterface(12, "DO3");
      ioCard.addInterface(13, "DO5");
      ioCard.addInterface(14, "AO1");
      ioCard.addInterface(15, "AO2");
      ioCard.addInterface(16, "HART1");
      ioCard.addInterface(17, "HART2");
    }
  }, []);

  useEffect(() => {
    const socket = new WebSocket("ws://192.168.1.254:8888");
    socket.addEventListener("open", () => {
      console.log("✅ WebSocket connected");
      socket.send(JSON.stringify({ state: "bulk-start" }));
    });
    return () => {
      socket.close();
    };
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
