import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

interface FriendRingCardProps {
  username: string;
  displayName: string;
  steps: number;
  goal: number;
  calories: number;
  lastSyncedAt: Date;
}

export default function FriendRingCard({
  username,
  displayName,
  steps,
  goal,
  calories,
  lastSyncedAt,
}: FriendRingCardProps) {
  const radius = 30;
  const strokeWidth = 6;
  const size = (radius + strokeWidth) * 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(steps / goal, 1);
  const strokeDashoffset = circumference - circumference * progress;

  const [now] = React.useState(() => Date.now());
  const getRelativeTime = (date: Date) => {
    const mins = Math.floor((now - date.getTime()) / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `Synced ${mins}m ago`;
    return `Synced ${Math.floor(mins / 60)}h ago`;
  };

  return (
    <View style={styles.card}>
      <View style={styles.ringContainer}>
        <Svg width={size} height={size}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#333333"
            strokeWidth={strokeWidth}
            fill="none"
          />
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#00FFcc"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </Svg>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{displayName}</Text>
        <Text style={styles.username}>@{username}</Text>
        <Text style={styles.statsText}>
          {steps.toLocaleString()} steps • 🔥 {calories} kcal
        </Text>
      </View>
      <View style={styles.timeContainer}>
        <Text style={styles.timeText}>{getRelativeTime(lastSyncedAt)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1e1e1e',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    marginHorizontal: 16,
  },
  ringContainer: {
    marginRight: 16,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  username: {
    color: '#888888',
    fontSize: 14,
    marginBottom: 8,
  },
  statsText: {
    color: '#dddddd',
    fontSize: 14,
  },
  timeContainer: {
    alignItems: 'flex-end',
  },
  timeText: {
    color: '#666666',
    fontSize: 12,
  },
});
