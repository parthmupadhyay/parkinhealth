import { supabase } from '../lib/supabase';
import { FriendLeaderboardItem, Profile, DailyMetric } from '../types';

export const metricsService = {
  async upsertTodayMetrics(steps: number, calories: number, localDate: string) {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) throw new Error('Not authenticated');

    const { error } = await supabase.from('daily_metrics').upsert({
      user_id: userData.user.id,
      local_date: localDate,
      steps,
      active_calories: calories,
      last_synced_at: new Date().toISOString(),
    }, { onConflict: 'user_id,local_date' });

    if (error) throw error;
  },

  async getFriendsTodayLeaderboard(localDate: string): Promise<FriendLeaderboardItem[]> {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) throw new Error('Not authenticated');

    const userId = userData.user.id;

    // Fetch accepted friendships where I am user_id or friend_id
    const { data: friendships, error: friendError } = await supabase
      .from('friendships')
      .select('*')
      .eq('status', 'accepted')
      .or(`user_id.eq.${userId},friend_id.eq.${userId}`);

    if (friendError) throw friendError;
    
    if (!friendships || friendships.length === 0) {
      return [];
    }

    const friendIds = friendships.map(f => f.user_id === userId ? f.friend_id : f.user_id);
    
    // Fetch profiles of friends
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .in('id', friendIds);
      
    if (profileError) throw profileError;

    // Fetch daily metrics for those friends on the given date
    const { data: metrics, error: metricsError } = await supabase
      .from('daily_metrics')
      .select('*')
      .eq('local_date', localDate)
      .in('user_id', friendIds);
      
    if (metricsError) throw metricsError;

    const leaderboard: FriendLeaderboardItem[] = (profiles as Profile[]).map(profile => {
      const metric = (metrics as DailyMetric[]).find(m => m.user_id === profile.id);
      return {
        profile,
        dailyMetric: metric || null,
      };
    });

    // Sort by steps descending (treat null metric as 0 steps)
    leaderboard.sort((a, b) => {
      const stepsA = a.dailyMetric?.steps || 0;
      const stepsB = b.dailyMetric?.steps || 0;
      return stepsB - stepsA;
    });

    return leaderboard;
  }
};
