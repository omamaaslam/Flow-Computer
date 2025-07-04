import { observer } from "mobx-react-lite";
import { navigationStore } from "../stores/NavigationStore";

const Breadcrumb = observer(() => {
  return (
    <div className="text-sm text-gray-500 px-6 mt-4">
      <span className="text-yellow-500">→</span> {navigationStore.currentRoute}
    </div>
  );
});

export default Breadcrumb;
