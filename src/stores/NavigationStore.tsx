import { makeAutoObservable } from "mobx";
import { ROUTES, type RouteKey } from "../routes";

class NavigationStore {
  private navigator: ((path: string) => void) | null = null;
  navigatorInitialized = false;

  constructor() {
    makeAutoObservable(this);
    this.listenToHashChange(); // Correct for HashRouter
  }

  currentRoute: RouteKey = "Home";

  setCurrentRoute(routeKey: RouteKey) {
    this.currentRoute = routeKey;
  }

  initNavigator(navigate: (path: string) => void) {
    this.navigator = navigate;
    this.navigatorInitialized = true;
    this.syncWithBrowser();
  }

  goTo(routeKey: RouteKey) {
    this.currentRoute = routeKey;
    if (this.navigator) {
      this.navigator(ROUTES[routeKey]);
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

  gotoMonitor() {
    this.goTo("Monitor");
  }

  gotoConfiguration(id: number) {
    const path = ROUTES.Configuration.replace(":streamId", id.toString());
    this.currentRoute = "Configuration";
    if (this.navigator) {
      this.navigator(path);
    }
  }

  getRouteKeyFromPath(path: string): RouteKey | null {
    for (const [key, value] of Object.entries(ROUTES)) {
      if (value.includes(":")) {
        const base = value.split("/:")[0];
        if (path.startsWith(base)) return key as RouteKey;
      } else if (value === path) {
        return key as RouteKey;
      }
    }
    return null;
  }

  syncWithBrowser() {
    const hashPath = window.location.hash;
    const path = hashPath.startsWith("#") ? hashPath.slice(1) : hashPath;
    const routeKey = this.getRouteKeyFromPath(path);
    if (routeKey) {
      this.setCurrentRoute(routeKey);
    }
  }

  private listenToHashChange() {
    window.addEventListener("hashchange", () => {
      this.syncWithBrowser();
    });
  }

configureInterface(path: string) {
    this.currentRoute = "ConfigureInterface";
    if (this.navigator) {
      this.navigator(path);
    }
  }


}
export const navigationStore = new NavigationStore();
