import { supabase } from '../lib/supabase';
import { Friendship } from '../types';

export const friendshipService = {
  async sendFriendRequest(targetUsername: string) {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) throw new Error('Not authenticated');

    // Find the target user by username
    const { data: targetProfiles, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', targetUsername)
      .limit(1);

    if (profileError) throw profileError;
    if (!targetProfiles || targetProfiles.length === 0) throw new Error('User not found');

    const targetUserId = targetProfiles[0].id;

    if (targetUserId === userData.user.id) throw new Error('Cannot send request to yourself');

    const { error: requestError } = await supabase.from('friendships').insert({
      user_id: userData.user.id,
      friend_id: targetUserId,
      status: 'pending',
    });

    if (requestError) throw requestError;
  },

  async getPendingRequests(): Promise<Friendship[]> {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('friendships')
      .select('*')
      .eq('friend_id', userData.user.id)
      .eq('status', 'pending');

    if (error) throw error;
    return data as Friendship[];
  },

  async respondToRequest(friendshipId: string, status: 'accepted' | 'blocked') {
    const { error } = await supabase
      .from('friendships')
      .update({ status })
      .eq('id', friendshipId);

    if (error) throw error;
  }
};
