import type { StreamStore } from "../stores/StreamStore";

export interface Stream {
  id: number;
  name: string;
  stream?: StreamStore;
}
