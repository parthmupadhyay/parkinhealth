import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { currentUser } from '../../lib/mockData';

export default function ProfileScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarText}>
            {currentUser.displayName.charAt(0)}
          </Text>
        </View>
        <Text style={styles.name}>{currentUser.displayName}</Text>
        <Text style={styles.username}>@{currentUser.username}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Daily Goals</Text>
        
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Step Goal</Text>
          <Text style={styles.settingValue}>{currentUser.dailyStepGoal.toLocaleString()}</Text>
        </View>
        
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Calorie Goal</Text>
          <Text style={styles.settingValue}>{currentUser.dailyCalorieGoal} kcal</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Edit Profile</Text>
          <Text style={styles.chevron}>›</Text>
        </View>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Sign Out</Text>
          <Text style={styles.chevron}>›</Text>
        </View>
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
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  settingLabel: {
    color: '#ffffff',
    fontSize: 16,
  },
  settingValue: {
    color: '#aaaaaa',
    fontSize: 16,
  },
  chevron: {
    color: '#555555',
    fontSize: 20,
  },
});
