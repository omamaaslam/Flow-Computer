import { makeAutoObservable } from "mobx";
import { ROUTES, type RouteKey } from "../routes";

class NavigationStore {
  // The navigator function provided by React Router
  private navigator: ((path: string, options?: { replace?: boolean }) => void) | null = null;

  // A simple flag to ensure we don't call navigate before it's ready
  navigatorInitialized = false;

  constructor() {
    makeAutoObservable(this);
  }

  // This is the key initialization method called from your App component
  initNavigator(navigate: (path: string, options?: { replace?: boolean }) => void) {
    this.navigator = navigate;
    this.navigatorInitialized = true;
  }

  // --- All navigation methods now simply call the navigator ---

  goTo(routeKey: RouteKey) {
    if (this.navigator) {
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

  gotoMonitor() {
    this.goTo("Monitor");
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