import React, { useState } from 'react';
<<<<<<< Updated upstream
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Link } from 'expo-router';
=======
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
>>>>>>> Stashed changes
import { authService } from '../../services/authService';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
<<<<<<< Updated upstream
  const [errorMsg, setErrorMsg] = useState('');

  const handleRegister = async () => {
    if (!email || !password || !username || !displayName) {
      setErrorMsg('Please fill in all fields');
      return;
    }
    setLoading(true);
    setErrorMsg('');
    try {
      await authService.signUp(email, password, username, displayName);
    } catch (error: any) {
      setErrorMsg(error.message);
=======
  const router = useRouter();

  const handleRegister = async () => {
    if (!email || !password || !username || !displayName) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    setLoading(true);
    try {
      await authService.signUp(email, password, username, displayName);
      Alert.alert('Success', 'Account created successfully!');
      router.replace('/(auth)/login');
    } catch (error: any) {
      Alert.alert('Registration failed', error.message);
>>>>>>> Stashed changes
    } finally {
      setLoading(false);
    }
  };

  return (
<<<<<<< Updated upstream
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      
      {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Display Name (e.g. Alex Smith)"
=======
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Display Name"
>>>>>>> Stashed changes
        placeholderTextColor="#888"
        value={displayName}
        onChangeText={setDisplayName}
      />
<<<<<<< Updated upstream
      <TextInput
        style={styles.input}
        placeholder="Username (e.g. alex123)"
        placeholderTextColor="#888"
        autoCapitalize="none"
        value={username}
        onChangeText={setUsername}
      />
=======
      
      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#888"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />

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

      <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#000" />
        ) : (
          <Text style={styles.buttonText}>Sign Up</Text>
        )}
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Already have an account? </Text>
        <Link href="/(auth)/login" asChild>
          <TouchableOpacity>
            <Text style={styles.link}>Log In</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
=======
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
        {loading ? <ActivityIndicator color="#000" /> : <Text style={styles.buttonText}>Sign Up</Text>}
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.link} onPress={() => router.replace('/(auth)/login')}>
        <Text style={styles.linkText}>Already have an account? Log in</Text>
      </TouchableOpacity>
    </ScrollView>
>>>>>>> Stashed changes
  );
}

const styles = StyleSheet.create({
  container: {
<<<<<<< Updated upstream
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#121212',
=======
    flexGrow: 1,
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
