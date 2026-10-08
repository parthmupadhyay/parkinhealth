import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { supabase } from '../../lib/supabase';

export default function ProfileScreen() {
  const { profile, refreshProfile } = useAuth();
  
  const [stepGoal, setStepGoal] = useState('10000');
  const [calorieGoal, setCalorieGoal] = useState('500');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (profile) {
      setStepGoal(profile.daily_step_goal?.toString() || '10000');
      setCalorieGoal(profile.daily_calorie_goal?.toString() || '500');
    }
  }, [profile]);

  if (!profile) return null;

  const handleUpdateGoals = async () => {
    setSaving(true);
    setMsg('');
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          daily_step_goal: parseInt(stepGoal, 10) || 10000,
          daily_calorie_goal: parseInt(calorieGoal, 10) || 500,
        })
        .eq('id', profile.id);

      if (error) throw error;
      setMsg('Goals updated successfully!');
      await refreshProfile();
    } catch (error: any) {
      setMsg(`Error: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    await authService.signOut();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarText}>
            {(profile.display_name || profile.username || '?').charAt(0).toUpperCase()}
          </Text>
        </View>
        <Text style={styles.name}>{profile.display_name || profile.username}</Text>
        <Text style={styles.username}>@{profile.username}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Update Goals</Text>
        
        {msg ? <Text style={styles.msgText}>{msg}</Text> : null}

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Daily Step Goal</Text>
          <TextInput
            style={styles.input}
            value={stepGoal}
            onChangeText={setStepGoal}
            keyboardType="number-pad"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Daily Calorie Goal</Text>
          <TextInput
            style={styles.input}
            value={calorieGoal}
            onChangeText={setCalorieGoal}
            keyboardType="number-pad"
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleUpdateGoals} disabled={saving}>
          {saving ? <ActivityIndicator color="#000" /> : <Text style={styles.buttonText}>Save Goals</Text>}
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
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
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 16,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#333333',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarText: {
    color: '#00FFcc',
    fontSize: 32,
    fontWeight: 'bold',
  },
  name: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  username: {
    color: '#888888',
    fontSize: 16,
    marginTop: 4,
  },
  section: {
    backgroundColor: '#1e1e1e',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#00FFcc',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
    textTransform: 'uppercase',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    color: '#aaaaaa',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#333',
    color: '#fff',
    borderRadius: 8,
    padding: 12,
  },
  button: {
    backgroundColor: '#00FFcc',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  signOutButton: {
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ff4444',
    alignItems: 'center',
  },
  signOutText: {
    color: '#ff4444',
    fontWeight: 'bold',
    fontSize: 16,
  },
  msgText: {
    color: '#00FFcc',
    marginBottom: 12,
    textAlign: 'center',
  },
});
