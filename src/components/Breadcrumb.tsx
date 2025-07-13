import { observer } from "mobx-react-lite";
import { useLocation } from "react-router-dom";
import { ROUTES } from "../routes";
import type { RouteKey } from "../routes";

const getRouteKeyFromPath = (path: string): string => {
  if (path === "/") return "Home";

  for (const [key, value] of Object.entries(ROUTES)) {
    if (value.includes(":")) {
      const base = value.split("/:")[0];
      if (path.startsWith(base)) return key as RouteKey;
    } else if (value === path) {
      return key as RouteKey;
    }
  }
  return path.slice(1);
};

const Breadcrumb = observer(() => {
  const location = useLocation();
  const currentRouteName = getRouteKeyFromPath(location.pathname);

  return (
    <div className="hidden md:block text-sm text-gray-500 px-4 mt-2 font-sans">
      <span className="text-yellow-500">→</span> {currentRouteName}
    </div>
  );
});

export default Breadcrumb;