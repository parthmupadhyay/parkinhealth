export interface HealthSummary {
  steps: number;
  activeCalories: number;
  localDate: string; // YYYY-MM-DD
  lastSynced: Date;
}

export interface IHealthService {
  isAvailable(): Promise<boolean>;
  requestPermissions(): Promise<boolean>;
  getTodaySummary(): Promise<HealthSummary>;
}
