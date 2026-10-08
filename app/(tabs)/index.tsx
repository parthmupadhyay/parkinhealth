import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import StepRing from '../../components/StepRing';
import StatCard from '../../components/StatCard';
import { healthService } from '../../services/health/healthService';
import { HealthSummary, Profile } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

export default function HomeScreen() {
  const { session, profile } = useAuth();
  const [summary, setSummary] = useState<HealthSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [healthAvailable, setHealthAvailable] = useState(false);

  const initHealth = async () => {
    setLoading(true);

    const available = await healthService.isAvailable();
    setHealthAvailable(available);
    
    if (available) {
      await healthService.requestPermissions();
      const today = await healthService.getTodaySummary();
      setSummary(today);
    } else {
      const today = await healthService.getTodaySummary(); // will trigger fallback
      setSummary(today);
    }
    setLoading(false);
  };

  useEffect(() => {
    initHealth();
  }, [session?.user]);

  const handleSync = async () => {
    setSyncing(true);
    if (healthAvailable) {
      const today = await healthService.getTodaySummary();
      setSummary(today);
    }
    setSyncing(false);
  };

  const steps = summary?.steps || 0;
  const calories = summary?.activeCalories || 0;
  const stepGoal = profile?.daily_step_goal || 10000;
  const calGoal = profile?.daily_calorie_goal || 500;
  const percentage = Math.round((steps / stepGoal) * 100);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.greeting}>Hello, {profile?.display_name || profile?.username || 'User'}</Text>
      
      {loading ? (
        <ActivityIndicator size="large" color="#00FFcc" style={{ marginVertical: 40 }} />
      ) : (
        <>
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
              You have reached {percentage}% of your daily step goal.
            </Text>
            {summary && (
              <Text style={styles.lastSyncedText}>
                Last Synced: {new Date(summary.lastSynced).toLocaleTimeString()}
              </Text>
            )}
          </View>

          <TouchableOpacity style={styles.syncButton} onPress={handleSync} disabled={syncing}>
            {syncing ? <ActivityIndicator color="#000" /> : <Text style={styles.syncButtonText}>Sync with Health Connect</Text>}
          </TouchableOpacity>
        </>
      )}
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
  lastSyncedText: {
    color: '#888888',
    fontSize: 12,
    marginTop: 8,
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
