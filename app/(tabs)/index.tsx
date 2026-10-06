import React from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import StepRing from '../../components/StepRing';
import StatCard from '../../components/StatCard';
import { currentUser, currentMetrics } from '../../lib/mockData';

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.greeting}>Hello, {currentUser.displayName}</Text>
      
      <StepRing
        steps={currentMetrics.steps}
        goal={currentUser.dailyStepGoal}
        calories={currentMetrics.activeCalories}
      />

      <View style={styles.statsRow}>
        <StatCard
          label="Steps Goal"
          value={currentUser.dailyStepGoal.toLocaleString()}
          icon="👟"
          color="#ffffff"
        />
        <StatCard
          label="Calories Goal"
          value={`${currentUser.dailyCalorieGoal} kcal`}
          icon="🔥"
          color="#ff4444"
        />
      </View>
      
      <View style={styles.summaryBox}>
        <Text style={styles.summaryTitle}>Daily Summary</Text>
        <Text style={styles.summaryText}>
          You have reached {Math.round((currentMetrics.steps / currentUser.dailyStepGoal) * 100)}% of your daily step goal. Keep it up!
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  content: {
    padding: 16,
    paddingTop: 32,
  },
  greeting: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'space-between',
  },
  summaryBox: {
    backgroundColor: '#1e1e1e',
    borderRadius: 16,
    padding: 16,
    marginTop: 20,
  },
  summaryTitle: {
    color: '#00FFcc',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  summaryText: {
    color: '#dddddd',
    fontSize: 14,
    lineHeight: 20,
  },
});
