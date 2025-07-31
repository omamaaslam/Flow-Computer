import type { JSX } from "react";
import Home from "./components/Home.tsx";
import Configuration from "./components/configurationFlow/Configuration.tsx";


export const ROUTES = {
  Home: "/",
  Alarms: "/alarms",
  Devices: "/devices",
  Users: "/users",
  Monitor: "/monitor",
  Configuration: "/configuration/:streamId",

} as const;

export type RouteKey = keyof typeof ROUTES;

export const RouteComponentMap: Record<RouteKey, JSX.Element> = {
  Home: <Home />,
  Alarms: <h1>Alarms Page</h1>,
  Devices: <h1>Devices Page</h1>,
  Users: <h1>Users Page</h1>,
  Monitor: <h1>Monitor Page</h1>,
  Configuration: <Configuration />,

};
