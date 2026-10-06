import { HealthSummary } from '../types';

export const currentUser = {
  id: 'user-1',
  username: 'parkin_pro',
  displayName: 'Parkin Health',
  dailyStepGoal: 10000,
  dailyCalorieGoal: 500,
};

export const currentMetrics: HealthSummary = {
  steps: 7450,
  activeCalories: 320,
  localDate: new Date().toLocaleDateString('en-CA'),
  lastSynced: new Date(),
};

export type FriendMock = {
  id: string;
  username: string;
  displayName: string;
  steps: number;
  activeCalories: number;
  dailyStepGoal: number;
  lastSyncedAt: Date;
};

export const friendsMockData: FriendMock[] = [
  {
    id: 'friend-1',
    username: 'runner_alex',
    displayName: 'Alex Smith',
    steps: 12500,
    activeCalories: 600,
    dailyStepGoal: 10000,
    lastSyncedAt: new Date(Date.now() - 5 * 60000),
  },
  {
    id: 'friend-2',
    username: 'fit_jess',
    displayName: 'Jessica Wong',
    steps: 8200,
    activeCalories: 410,
    dailyStepGoal: 8000,
    lastSyncedAt: new Date(Date.now() - 15 * 60000),
  },
  {
    id: 'friend-3',
    username: 'lazy_dave',
    displayName: 'Dave M.',
    steps: 2100,
    activeCalories: 100,
    dailyStepGoal: 10000,
    lastSyncedAt: new Date(Date.now() - 60 * 60000),
  },
  {
    id: 'friend-4',
    username: 'yoga_sarah',
    displayName: 'Sarah T.',
    steps: 9800,
    activeCalories: 450,
    dailyStepGoal: 10000,
    lastSyncedAt: new Date(Date.now() - 2 * 60000),
  },
];
