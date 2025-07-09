import type { InterfaceStore } from "../stores/InterfaceStore";

export interface Interface {
  id: number;
  name: string;
  status: boolean;
  interface?: InterfaceStore;
}
