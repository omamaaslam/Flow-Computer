export interface DeviceConfig {
  // General Info
  device_id?: string;
  device_type?: string;
  manufacturer?: string;
  model?: string;
  serial_number?: string;
  tag_name?: string;
  build_year?: string;
  version?: string;
  g_size?: string;

  // Temperature Parameters
  temp_min?: number;
  temp_max?: number;
  unit?: string;
  correction_c0?: number;
  correction_c1?: number;
  correction_c2?: number;
  correction_c3?: number;

  // Pressure Parameters
  pressure_min?: number;
  pressure_max?: number;

  // Pulse Parameters
  frequency_hz?: number;
  frequency_type?: string;
  pulse_duration_ms?: number;
  pulse_pause_ms?: number;
  pulse_volume?: number;

  // A fallback for any other property
  [key: string]: any;
}

// This remains the same, but 'config' now refers to the flat type above
export interface Device {
  id: string;
  name: string;
  config: DeviceConfig;
}
