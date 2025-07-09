export interface Device {
  id: number;
  name?: string;
  type: string;
  status: "ok" | "warning" | "error" | "inactive";
}
