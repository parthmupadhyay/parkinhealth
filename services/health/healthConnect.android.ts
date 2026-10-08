import {
  initialize,
  getSdkStatus,
  requestPermission,
  aggregateRecord,
  Permission,
} from 'react-native-health-connect';
import { IHealthService, HealthSummary } from '../../types';

export const healthConnectService: IHealthService = {
  async isAvailable(): Promise<boolean> {
    try {
      await initialize();
      const status = await getSdkStatus();
      return status === 3; // 3 means SDK_AVAILABLE
    } catch (e) {
      console.error('Health Connect initialization failed', e);
      return false;
    }
  },

  async requestPermissions(): Promise<boolean> {
    try {
      const permissions: Permission[] = [
        { accessType: 'read', recordType: 'Steps' },
        { accessType: 'read', recordType: 'TotalCaloriesBurned' },
      ];
      await requestPermission(permissions);
      return true;
    } catch (e) {
      console.error('Health Connect permission request failed', e);
      return false;
    }
  },

  async getTodaySummary(): Promise<HealthSummary> {
    const now = new Date();
    // Start of local today
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const timeRangeFilter = {
      operator: 'between' as const,
      startTime: startOfDay.toISOString(),
      endTime: now.toISOString(),
    };

    let steps = 0;
    let activeCalories = 0;

    try {
      const stepsRecord = await aggregateRecord({
        recordType: 'Steps',
        timeRangeFilter,
      });
      steps = stepsRecord.COUNT_TOTAL || 0;
    } catch (e) {
      console.error('Failed to aggregate Steps', e);
    }

    try {
      const caloriesRecord = await aggregateRecord({
        recordType: 'TotalCaloriesBurned',
        timeRangeFilter,
      });
      // The ENERGY_TOTAL property returns an EnergyResult object with various units.
      activeCalories = Math.floor(caloriesRecord.ENERGY_TOTAL?.inKilocalories || 0);
    } catch (e) {
      console.error('Failed to aggregate TotalCaloriesBurned', e);
    }

    return {
      steps,
      activeCalories,
      localDate: now.toLocaleDateString('en-CA'),
      lastSynced: now,
    };
  },
};
