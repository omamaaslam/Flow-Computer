import { makeAutoObservable } from "mobx";
import { ROUTES, type RouteKey } from "../routes";

class NavigationStore {
  private navigator:
    | ((path: string, options?: { replace?: boolean }) => void)
    | null = null;
  public navigatorInitialized = false;
  public currentPath = window.location.hash.substring(1) || "/";

  constructor() {
    makeAutoObservable(this);
  }
  setCurrentPath(path: string) {
    this.currentPath = path;
  }

  get currentRoute(): RouteKey | null {
    const routeEntry = Object.entries(ROUTES).find(([_, value]) => {
      if (value.includes(":")) {
        const baseRoute = value.substring(0, value.indexOf("/:"));
        return (
          this.currentPath.startsWith(baseRoute) &&
          this.currentPath.length > baseRoute.length
        );
      }
      return value === this.currentPath;
    });

    if (routeEntry) {
      return routeEntry[0] as RouteKey;
    }

    return null;
  }

  initNavigator(
    navigate: (path: string, options?: { replace?: boolean }) => void
  ) {
    this.navigator = navigate;
    this.navigatorInitialized = true;
  }

  goTo(routeKey: RouteKey) {
    if (this.navigator) {
      // The path definitions in ROUTES don't need to change
      this.navigator(ROUTES[routeKey]);
    } else {
      console.warn("Navigator not initialized yet.");
    }
  }

  goToHome() {
    this.goTo("Home");
  }
  goToAlarms() {
    this.goTo("Alarms");
  }
  goToDevices() {
    this.goTo("Devices");
  }
  goToUsers() {
    this.goTo("Users");
  }
gotoMonitor(id: number | string) {
  if (this.navigator) {
    const path = ROUTES.Monitor.replace(":streamId", id.toString());
    this.navigator(path);
  } else {
    console.warn("Navigator not initialized yet.");
  }
}
  goToSystemSettings() {
    this.goTo("SystemSettings");
  }

  gotoConfiguration(id: number | string) {
    if (this.navigator) {
      const path = ROUTES.Configuration.replace(":streamId", id.toString());
      this.navigator(path);
    } else {
      console.warn("Navigator not initialized yet.");
    }
  }
}

export const navigationStore = new NavigationStore();
