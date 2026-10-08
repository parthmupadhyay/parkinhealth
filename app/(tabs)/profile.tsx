<<<<<<< Updated upstream
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { supabase } from '../../lib/supabase';

export default function ProfileScreen() {
  const { profile, refreshProfile } = useAuth();
  
  const [stepGoal, setStepGoal] = useState('');
  const [calorieGoal, setCalorieGoal] = useState('');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (profile) {
      setStepGoal(profile.daily_step_goal.toString());
      setCalorieGoal(profile.daily_calorie_goal.toString());
    }
  }, [profile]);

  if (!profile) return null;

  const handleUpdateGoals = async () => {
    setSaving(true);
    setMsg('');
=======
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Profile } from '../../types';

export default function ProfileScreen() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [stepGoal, setStepGoal] = useState('10000');
  const [calGoal, setCalGoal] = useState('500');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();
      
      if (error) throw error;
      setProfile(data);
      setStepGoal(data.daily_step_goal?.toString() || '10000');
      setCalGoal(data.daily_calorie_goal?.toString() || '500');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateGoals = async () => {
    if (!user) return;
    setSaving(true);
>>>>>>> Stashed changes
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
<<<<<<< Updated upstream
          daily_step_goal: parseInt(stepGoal, 10) || 10000,
          daily_calorie_goal: parseInt(calorieGoal, 10) || 500,
        })
        .eq('id', profile.id);

      if (error) throw error;
      setMsg('Goals updated successfully!');
      await refreshProfile();
    } catch (error: any) {
      setMsg(`Error: ${error.message}`);
=======
          daily_step_goal: parseInt(stepGoal, 10),
          daily_calorie_goal: parseInt(calGoal, 10),
        })
        .eq('id', user.id);
      
      if (error) throw error;
      Alert.alert('Success', 'Goals updated successfully');
      fetchProfile();
    } catch (error: any) {
      Alert.alert('Error', error.message);
>>>>>>> Stashed changes
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
<<<<<<< Updated upstream
    await authService.signOut();
  };

=======
    try {
      await supabase.auth.signOut();
    } catch (error: any) {
      Alert.alert('Error signing out', error.message);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#00FFcc" />
      </View>
    );
  }

>>>>>>> Stashed changes
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarText}>
<<<<<<< Updated upstream
            {(profile.display_name || profile.username || '?').charAt(0).toUpperCase()}
          </Text>
        </View>
        <Text style={styles.name}>{profile.display_name || profile.username}</Text>
        <Text style={styles.username}>@{profile.username}</Text>
=======
            {profile?.display_name?.charAt(0)?.toUpperCase() || profile?.username?.charAt(0)?.toUpperCase() || '?'}
          </Text>
        </View>
        <Text style={styles.name}>{profile?.display_name || 'User'}</Text>
        <Text style={styles.username}>@{profile?.username || 'unknown'}</Text>
>>>>>>> Stashed changes
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Update Goals</Text>
        
<<<<<<< Updated upstream
        {msg ? <Text style={styles.msgText}>{msg}</Text> : null}

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Daily Step Goal</Text>
=======
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Step Goal</Text>
>>>>>>> Stashed changes
          <TextInput
            style={styles.input}
            value={stepGoal}
            onChangeText={setStepGoal}
<<<<<<< Updated upstream
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
=======
            keyboardType="numeric"
            placeholderTextColor="#888"
          />
        </View>
        
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Calorie Goal</Text>
          <TextInput
            style={styles.input}
            value={calGoal}
            onChangeText={setCalGoal}
            keyboardType="numeric"
            placeholderTextColor="#888"
          />
        </View>

        <TouchableOpacity 
          style={styles.updateButton} 
          onPress={handleUpdateGoals}
          disabled={saving}
        >
          {saving ? <ActivityIndicator color="#000" /> : <Text style={styles.updateButtonText}>Update Goals</Text>}
>>>>>>> Stashed changes
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
<<<<<<< Updated upstream
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Text style={styles.signOutText}>Sign Out</Text>
=======
        <TouchableOpacity style={styles.settingRow} onPress={handleSignOut}>
          <Text style={[styles.settingLabel, { color: '#ff4444' }]}>Log Out</Text>
          <Text style={styles.chevron}>›</Text>
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
  label: {
    color: '#aaaaaa',
    marginBottom: 8,
=======
  settingLabel: {
    color: '#ffffff',
    fontSize: 16,
>>>>>>> Stashed changes
  },
  input: {
    backgroundColor: '#333',
    color: '#fff',
    borderRadius: 8,
<<<<<<< Updated upstream
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
=======
    padding: 8,
    width: 100,
    textAlign: 'right',
  },
  updateButton: {
    backgroundColor: '#00FFcc',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  updateButtonText: {
>>>>>>> Stashed changes
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
