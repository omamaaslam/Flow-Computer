import { observer } from "mobx-react-lite";
import { navigationStore } from "./stores/NavigationStore";
import { ROUTES } from "./routes";
import Sidebar from "./components/Sidebar";
import Breadcrumb from "./components/Breadcrumb";
import Header from "./components/Header";
// Import Routes and Route!
import { useNavigate, Routes, Route } from "react-router-dom";
import { useEffect } from "react";

// Import your page components
import Home from "./components/Home.tsx";
import Configuration from "./components/configurationFlow/Configuration.tsx";

const App = observer(() => {
  const navigate = useNavigate();

  // This effect runs only once to initialize our store with the navigate function
  useEffect(() => {
    if (!navigationStore.navigatorInitialized) {
      navigationStore.initNavigator(navigate);
    }
  }, [navigate]); // navigate is stable, so this effect runs once on mount.

  // --- WebSocket Logic (remains unchanged) ---
  useEffect(() => {
    const socket = new WebSocket("ws://192.168.1.254:8888");

    socket.addEventListener("open", () => {
      console.log("✅ WebSocket connected");
      socket.send(JSON.stringify({ state: "bulk-start" }));
    });
    // ... rest of your WebSocket logic
    return () => {
      socket.close();
    };
  }, []);
  // --- End of WebSocket Logic ---

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <div className="overflow-y-auto">
          <Breadcrumb />
          <div className="p-6">
            {/* THIS IS THE KEY CHANGE. Let React Router handle rendering. */}
            <Routes>
              <Route path={ROUTES.Home} element={<Home />} />
              <Route path={ROUTES.Alarms} element={<h1>Alarms Page</h1>} />
              <Route path={ROUTES.Devices} element={<h1>Devices Page</h1>} />
              <Route path={ROUTES.Users} element={<h1>Users Page</h1>} />
              <Route path={ROUTES.Monitor} element={<h1>Monitor Page</h1>} />
              {/* Note the path for dynamic routes */}
              <Route path={ROUTES.Configuration} element={<Configuration />} />

              {/* Optional: Add a catch-all for not found routes */}
              <Route path="*" element={<h1>404: Page Not Found</h1>} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
});

export default App;