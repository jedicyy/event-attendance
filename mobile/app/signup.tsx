import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import api from '../constants/api';
import { useNavigation } from '@react-navigation/native';

export default function Signup() {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [re_password, setRe_password] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (password !== re_password) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await api.post('/auth/users/', { username, email, password, re_password }, { timeout: 10000 });
      Alert.alert('Account created', 'Please check your email for activation link');
      (navigation as any).navigate('Login');
    } catch (err: any) {
      console.log('Signup error - Full error:', err);
      console.log('Signup error - Status:', err.response?.status);
      console.log('Signup error - Response data:', JSON.stringify(err.response?.data, null, 2));
      console.log('Signup error - Message:', err.message);
      console.log('Signup error - Code:', err.code);
      if (err.code === 'ECONNABORTED' || err.message?.toLowerCase()?.includes('timeout')) {
        Alert.alert('Signup failed', 'Request timed out. Check your API host or network connection.');
      } else if (err.response) {
        const data = err.response.data;
        const msg = typeof data === 'string' ? data : JSON.stringify(data);
        Alert.alert('Signup failed', msg);
      } else {
        Alert.alert('Signup failed', err.message || 'Unknown error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <TextInput placeholder="Username" style={styles.input} value={username} onChangeText={setUsername} />
      <TextInput placeholder="Email" style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" />
      <TextInput placeholder="Password" style={styles.input} secureTextEntry value={password} onChangeText={setPassword} />
      <TextInput placeholder="Confirm Password" style={styles.input} secureTextEntry value={re_password} onChangeText={setRe_password} />
      <TouchableOpacity style={styles.button} onPress={handleSignup} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Creating...' : 'Create Account'}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => (navigation as any).navigate('Login')} disabled={loading}>
        <Text style={styles.link}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#F3F7FB' },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 20, color: '#1E3A8A' },
  input: { backgroundColor: '#fff', padding: 12, borderRadius: 8, marginBottom: 12, borderWidth:1, borderColor:'#CBD5E1' },
  button: { backgroundColor: '#1D4ED8', padding: 14, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: 'white', fontWeight: '700' },
  link: { marginTop: 12, color: '#2563EB', textAlign: 'center' }
});
