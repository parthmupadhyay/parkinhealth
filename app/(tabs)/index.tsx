import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import StepRing from '../../components/StepRing';
import StatCard from '../../components/StatCard';
import { useAuth } from '../../context/AuthContext';
import { metricsService } from '../../services/metricsService';
import { supabase } from '../../lib/supabase';
import { DailyMetric } from '../../types';

export default function HomeScreen() {
  const { profile } = useAuth();
  const [metric, setMetric] = useState<DailyMetric | null>(null);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const fetchTodayMetric = async () => {
    if (!profile) return;
    setLoading(true);
    const localDate = new Date().toLocaleDateString('en-CA');
    const { data, error } = await supabase
      .from('daily_metrics')
      .select('*')
      .eq('user_id', profile.id)
      .eq('local_date', localDate)
      .single();

    if (!error && data) {
      setMetric(data as DailyMetric);
    } else {
      setMetric(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTodayMetric();
  }, [profile]);

  if (!profile) return null;

  const handleSimulateSync = async () => {
    setSyncing(true);
    try {
      const randomSteps = Math.floor(Math.random() * 5000) + 5000;
      const randomCalories = Math.floor(Math.random() * 200) + 200;
      const localDate = new Date().toLocaleDateString('en-CA');
      
      await metricsService.upsertTodayMetrics(randomSteps, randomCalories, localDate);
      await fetchTodayMetric();
    } catch (e) {
      console.error(e);
    } finally {
      setSyncing(false);
    }
  };

  const steps = metric?.steps || 0;
  const calories = metric?.active_calories || 0;
  const stepGoal = profile.daily_step_goal || 10000;
  const calGoal = profile.daily_calorie_goal || 500;
  
  const percentage = Math.round((steps / stepGoal) * 100);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.greeting}>Hello, {profile.display_name || profile.username}</Text>
      
      <StepRing
        steps={steps}
        goal={stepGoal}
        calories={calories}
      />

      <View style={styles.statsRow}>
        <StatCard
          label="Steps Goal"
          value={stepGoal.toLocaleString()}
          icon="👟"
          color="#ffffff"
        />
        <StatCard
          label="Calories Goal"
          value={`${calGoal} kcal`}
          icon="🔥"
          color="#ff4444"
        />
      </View>
      
      <View style={styles.summaryBox}>
        <Text style={styles.summaryTitle}>Daily Summary</Text>
        <Text style={styles.summaryText}>
          You have reached {percentage}% of your daily step goal. Keep it up!
        </Text>
      </View>

      <TouchableOpacity style={styles.syncButton} onPress={handleSimulateSync} disabled={syncing}>
        {syncing ? <ActivityIndicator color="#000" /> : <Text style={styles.syncButtonText}>Simulate Sync (Phase 2B)</Text>}
      </TouchableOpacity>
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
  syncButton: {
    backgroundColor: '#00FFcc',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 32,
  },
  syncButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  }
});
