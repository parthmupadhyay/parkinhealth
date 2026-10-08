import { Platform } from 'react-native';
import { IHealthService, HealthSummary } from '../../types';

// Safely import Android service. We will assign the export below.
let androidService: IHealthService | null = null;

if (Platform.OS === 'android') {
  androidService = require('./healthConnect.android').healthConnectService;
}

const fallbackService: IHealthService = {
  async isAvailable() {
    return false;
  },
  async requestPermissions() {
    return false;
  },
  async getTodaySummary(): Promise<HealthSummary> {
    console.log('Health APIs not implemented or available for this platform (using fallback).');
    const now = new Date();
    return {
      steps: 0,
      activeCalories: 0,
      localDate: now.toLocaleDateString('en-CA'),
      lastSynced: now,
    };
  }
};

export const healthService: IHealthService = Platform.OS === 'android' && androidService 
  ? androidService 
  : fallbackService;
