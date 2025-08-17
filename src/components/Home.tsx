import { observer } from "mobx-react-lite";
import StreamCard from "./configurationFlow/Stream/StreamCard";
import globalStore from "../stores/GlobalStore";

const Home = observer(() => {
  const streams = globalStore.streams;
  const colorSchemes: Array<"yellow" | "red" | "green" | "gray"> = [
    "yellow",
    "red",
    "green",
    "gray",
  ];

  return (
    <div className="grid grid-cols-3 gap-x-2 gap-y-4 px-2 py-2">
      {streams.map((stream, index) => (
        <StreamCard
          key={stream.id}
          stream={stream}
          colorScheme={colorSchemes[index % colorSchemes.length]}
        />
      ))}
    </div>
  );
});

export default Home;