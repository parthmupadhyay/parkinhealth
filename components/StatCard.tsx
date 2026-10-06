import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface StatCardProps {
  label: string;
  value: string;
  icon?: string;
  color?: string;
}

export default function StatCard({ label, value, icon, color = '#00FFcc' }: StatCardProps) {
  return (
    <View style={styles.card}>
      {icon && <Text style={styles.icon}>{icon}</Text>}
      <View>
        <Text style={[styles.value, { color }]}>{value}</Text>
        <Text style={styles.label}>{label}</Text>
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
    flex: 1,
    marginHorizontal: 8,
  },
  icon: {
    fontSize: 24,
    marginRight: 12,
  },
  value: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  label: {
    color: '#aaaaaa',
    fontSize: 14,
    marginTop: 4,
  },
});
