import { observer } from "mobx-react-lite";
import { navigationStore } from "../stores/NavigationStore";

const Breadcrumb = observer(() => {
  return (
    <div className="hidden md:block text-sm text-gray-500 px-4 mt-2 font-sans">
      <span className="text-yellow-500">→</span> {navigationStore.currentRoute}
    </div>
  );
});

export default Breadcrumb;
