import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, Text, ActivityIndicator } from 'react-native';
import FriendRingCard from '../../components/FriendRingCard';
import { metricsService } from '../../services/metricsService';
import { FriendLeaderboardItem } from '../../types';

export default function FriendsScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [leaderboard, setLeaderboard] = useState<FriendLeaderboardItem[]>([]);
  const [errorMsg, setErrorMsg] = useState('');

  const loadLeaderboard = async () => {
    try {
      const localDate = new Date().toLocaleDateString('en-CA');
      const data = await metricsService.getFriendsTodayLeaderboard(localDate);
      setLeaderboard(data);
      setErrorMsg('');
    } catch (error: any) {
      setErrorMsg(error.message);
    }
  };

  const fetchInitial = async () => {
    setLoading(true);
    await loadLeaderboard();
    setLoading(false);
  };

  useEffect(() => {
    fetchInitial();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadLeaderboard();
    setRefreshing(false);
  }, []);

  const renderItem = ({ item, index }: { item: FriendLeaderboardItem, index: number }) => (
    <View style={styles.itemWrapper}>
      <Text style={styles.rank}>#{index + 1}</Text>
      <View style={styles.cardWrapper}>
        <FriendRingCard
          username={item.profile.username}
          displayName={item.profile.display_name || item.profile.username}
          steps={item.dailyMetric?.steps || 0}
          goal={item.profile.daily_step_goal}
          calories={item.dailyMetric?.active_calories || 0}
          lastSyncedAt={item.dailyMetric?.last_synced_at ? new Date(item.dailyMetric.last_synced_at) : new Date()}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color="#00FFcc" />
        </View>
      ) : (
        <FlatList
          data={leaderboard}
          keyExtractor={(item) => item.profile.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#00FFcc"
              colors={['#00FFcc']}
            />
          }
          ListHeaderComponent={
            <>
              <Text style={styles.headerTitle}>Leaderboard</Text>
              {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}
              {leaderboard.length === 0 && !errorMsg ? (
                <Text style={styles.emptyText}>No friends found. Add some to compete!</Text>
              ) : null}
            </>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingVertical: 16,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  error: {
    color: '#ff4444',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  emptyText: {
    color: '#888',
    paddingHorizontal: 16,
  },
  itemWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
  },
  rank: {
    color: '#888888',
    fontSize: 18,
    fontWeight: 'bold',
    width: 30,
  },
  cardWrapper: {
    flex: 1,
  },
});
