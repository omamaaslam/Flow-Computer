import type { JSX } from "react";
import Home from "./components/Home.tsx";
import Configuration from "./components/configurationFlow/Stream/io_card/Interface/Configuration.tsx";
import MonitorScreen from "./components/MonitorScreen.tsx";


export const ROUTES = {
  Home: "/",
  Monitor: "/monitor",
  Alarms: "/alarms",
  Devices: "/devices",
  Users: "/users",
  Configuration: "/configuration/:streamId",

} as const;

export type RouteKey = keyof typeof ROUTES;

export const RouteComponentMap: Record<RouteKey, JSX.Element> = {
  Home: <Home />,
  Monitor: <MonitorScreen />,
  Alarms: <h1>Alarms Page</h1>,
  Devices: <h1>Devices Page</h1>,
  Users: <h1>Users Page</h1>,
  Configuration: <Configuration />,

};
