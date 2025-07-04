import { makeAutoObservable } from "mobx";

export class IOCardStore {
  public cardType: string;
  public interfaces: Map<string, any>;

  constructor(type: string) {
    this.cardType = type;
    this.interfaces = new Map();
    makeAutoObservable(this); // auto-track all state and actions
  }

  // Add or replace an interface
  public addInterface(key: string, interfaceObj: any) {
    this.interfaces.set(key, interfaceObj);
  }

  // Get an interface (no reactivity needed)
  public getInterface(key: string): any | null {
    return this.interfaces.get(key) || null;
  }

  // Update existing interface, return 1 if updated, 0 otherwise
  public updateInterface(key: string, interfaceObj: any): number {
    if (this.interfaces.has(key)) {
      this.interfaces.set(key, interfaceObj);
      return 1;
    }
    return 0;
  }

  // Remove an interface
  public removeInterface(key: string) {
    this.interfaces.delete(key);
  }

  // Check if a key exists
  public hasInterface(key: string): boolean {
    return this.interfaces.has(key);
  }

  // Return all keys as an array
  public listInterfaceKeys(): string[] {
    return Array.from(this.interfaces.keys());
  }

  // Get card type
  public getCardType(): string {
    return this.cardType;
  }
}
