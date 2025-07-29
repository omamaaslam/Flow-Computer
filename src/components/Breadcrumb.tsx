// Breadcrumb.tsx
import { useLocation, useParams } from "react-router-dom";
import { observer } from "mobx-react-lite";
import globalStore from "../stores/GlobalStore";

const Breadcrumb = observer(() => {
  const location = useLocation();
  const pathSegments = location.pathname.split("/").filter(Boolean);

  const breadcrumbs = [{ name: "Home", path: "/" }];

  if (pathSegments[0] === "configuration") {
    const streamId = pathSegments[1];
    const stream = globalStore.streams.find(
      (s) => s.id.toString() === streamId
    );
    if (stream) {
      breadcrumbs.push({
        name: stream.name,
        path: `/configuration/${streamId}`,
      });
    }
    if (pathSegments.length > 2) {
      breadcrumbs.push({
        name: "Interface Configuration",
        path: location.pathname,
      });
    }
  }

  return (
    <div className="hidden md:flex items-center gap-2 text-sm text-gray-500 px-4 mt-2 font-sans">
      {breadcrumbs.map((crumb, idx) => (
        <span key={idx} className="flex items-center gap-1">
          {idx > 0 && <span className="text-yellow-500">→</span>}
          <span>{crumb.name}</span>
        </span>
      ))}
    </div>
  );
});

export default Breadcrumb;
