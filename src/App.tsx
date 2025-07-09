import { observer } from "mobx-react-lite";
import { navigationStore } from "./stores/NavigationStore";
import { RouteComponentMap } from "./routes";
import Sidebar from "./components/Sidebar";
import Breadcrumb from "./components/Breadcrumb";
import Header from "./components/Header";
import { useNavigate } from "react-router-dom";

const App = observer(() => {
  const navigate = useNavigate();
  
  if (!navigationStore.navigatorInitialized) {
    navigationStore.initNavigator(navigate);
  }

  const currentComponent = RouteComponentMap[navigationStore.currentRoute];

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <div className="overflow-y-auto">
          <Breadcrumb />
          <div className="p-6 ">{currentComponent}</div>
        </div>
      </div>
    </div>
  );
});

export default App;
