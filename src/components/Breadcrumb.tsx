// Breadcrumb.tsx
import { useLocation } from "react-router-dom";
import { observer } from "mobx-react-lite";
import globalStore from "../stores/GlobalStore";

const routeNameMap: Record<string, string> = {
  monitor: "Monitor",
  alarms: "Alarms",
  devices: "Devices",
  users: "Users",
  configuration: "Configuration",
};

const Breadcrumb = observer(() => {
  const location = useLocation();
  const segments = location.pathname.split("/").filter(Boolean);

  const crumbs: Array<{ name: string; path: string }> = [];

  if (segments.length === 0) {
    // Root path: show Home
    crumbs.push({ name: "Home", path: "/" });
  } else {
    const top = segments[0];

    if (top === "configuration") {
      // configuration special handling: show "Configuration" and then stream name if possible
      crumbs.push({ name: "Configuration", path: "/configuration" });

      if (segments[1]) {
        const streamId = segments[1];
        const stream = globalStore.streams.find((s: any) => s.id.toString() === streamId);
        if (stream) {
          crumbs.push({ name: stream.name, path: `/configuration/${streamId}` });
        } else {
          // If stream not found, show the raw id (fallback)
          crumbs.push({ name: streamId, path: `/configuration/${streamId}` });
        }
      }

      // add any deeper segments beyond configuration/:streamId
      for (let i = 2; i < segments.length; i++) {
        const path = `/${segments.slice(0, i + 1).join("/")}`;
        crumbs.push({ name: segments[i], path });
      }
    } else {
      // Non-configuration top-level route: show only the top-level route name
      const name = routeNameMap[top] ?? top;
      crumbs.push({ name, path: `/${top}` });

      // Optional: if you later add nested routes under top-level (like /monitor/something),
      // this will append them. If you don't want that, remove the following loop.
      for (let i = 1; i < segments.length; i++) {
        const path = `/${segments.slice(0, i + 1).join("/")}`;
        crumbs.push({ name: segments[i], path });
      }
    }
  }

  return (
    <div className="hidden md:flex items-center gap-2 text-sm text-gray-500 px-4 mt-2 font-sans">
      {crumbs.map((c, i) => (
        <span key={i} className="flex items-center gap-1">
          {i > 0 && <span className="text-yellow-500">→</span>}
          <span>{c.name}</span>
        </span>
      ))}
    </div>
  );
});

export default Breadcrumb;
