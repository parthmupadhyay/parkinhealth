import React, { useState } from 'react';
<<<<<<< Updated upstream
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Link } from 'expo-router';
=======
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
>>>>>>> Stashed changes
import { authService } from '../../services/authService';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
<<<<<<< Updated upstream
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMsg('Please fill in all fields');
      return;
    }
    setLoading(true);
    setErrorMsg('');
    try {
      await authService.signIn(email, password);
    } catch (error: any) {
      setErrorMsg(error.message);
=======
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }
    setLoading(true);
    try {
      await authService.signIn(email, password);
      // Navigation is handled by AuthGuard in _layout.tsx
    } catch (error: any) {
      Alert.alert('Login failed', error.message);
>>>>>>> Stashed changes
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
<<<<<<< Updated upstream
      <Text style={styles.title}>Welcome Back</Text>
      
      {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}

=======
      <Text style={styles.title}>ParkinHealth</Text>
      
>>>>>>> Stashed changes
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#888"
<<<<<<< Updated upstream
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
=======
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      
>>>>>>> Stashed changes
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#888"
<<<<<<< Updated upstream
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#000" />
        ) : (
          <Text style={styles.buttonText}>Log In</Text>
        )}
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Don&apos;t have an account? </Text>
        <Link href="/(auth)/register" asChild>
          <TouchableOpacity>
            <Text style={styles.link}>Sign Up</Text>
          </TouchableOpacity>
        </Link>
      </View>
=======
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        {loading ? <ActivityIndicator color="#000" /> : <Text style={styles.buttonText}>Log In</Text>}
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.link} onPress={() => router.push('/(auth)/register')}>
        <Text style={styles.linkText}>Don't have an account? Sign up</Text>
      </TouchableOpacity>
>>>>>>> Stashed changes
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
<<<<<<< Updated upstream
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#121212',
=======
    backgroundColor: '#121212',
    justifyContent: 'center',
    padding: 24,
>>>>>>> Stashed changes
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#00FFcc',
<<<<<<< Updated upstream
    marginBottom: 32,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#1e1e1e',
    color: '#fff',
=======
    textAlign: 'center',
    marginBottom: 48,
  },
  input: {
    backgroundColor: '#1e1e1e',
    color: '#ffffff',
>>>>>>> Stashed changes
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#00FFcc',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
<<<<<<< Updated upstream
    marginTop: 8,
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  error: {
    color: '#ff4444',
    marginBottom: 16,
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 32,
  },
  footerText: {
    color: '#888',
  },
  link: {
    color: '#00FFcc',
    fontWeight: 'bold',
=======
    marginTop: 16,
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  link: {
    marginTop: 24,
    alignItems: 'center',
  },
  linkText: {
    color: '#888888',
    fontSize: 14,
>>>>>>> Stashed changes
  },
});
