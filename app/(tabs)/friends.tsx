import React, { useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, Text } from 'react-native';
import FriendRingCard from '../../components/FriendRingCard';
import { friendsMockData, FriendMock } from '../../lib/mockData';

export default function FriendsScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [friends] = useState(
    [...friendsMockData].sort((a, b) => b.steps - a.steps) // Sort by steps descending
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate network request
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);

  const renderItem = ({ item, index }: { item: FriendMock, index: number }) => (
    <View style={styles.itemWrapper}>
      <Text style={styles.rank}>#{index + 1}</Text>
      <View style={styles.cardWrapper}>
        <FriendRingCard
          username={item.username}
          displayName={item.displayName}
          steps={item.steps}
          goal={item.dailyStepGoal}
          calories={item.activeCalories}
          lastSyncedAt={item.lastSyncedAt}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={friends}
        keyExtractor={(item) => item.id}
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
          <Text style={styles.headerTitle}>Leaderboard</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
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
