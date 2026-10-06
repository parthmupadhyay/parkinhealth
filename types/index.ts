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

export interface Profile {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  daily_step_goal: number;
  daily_calorie_goal: number;
  timezone: string;
  created_at?: string;
}

export interface DailyMetric {
  id?: string;
  user_id: string;
  local_date: string;
  steps: number;
  active_calories: number;
  last_synced_at?: string;
}

export interface Friendship {
  id?: string;
  user_id: string;
  friend_id: string;
  status: 'pending' | 'accepted' | 'blocked';
  created_at?: string;
}

export interface FriendLeaderboardItem {
  profile: Profile;
  dailyMetric: DailyMetric | null;
}
