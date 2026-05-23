import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../constants/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

export default function HomeScreen({ onLogout }: { onLogout?: () => void }) {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  const fetchEvents = useCallback(async (storedToken?: string | null) => {
    setLoading(true);
    try {
      const tokenToUse = storedToken || token || await AsyncStorage.getItem('token');
      if (!tokenToUse) {
        router.replace('/login');
        return;
      }

      const res = await api.get('/events/', { timeout: 10000 });
      setEvents(res.data);
    } catch (err) {
      console.log('Failed to fetch events', err);
      const e: any = err;
      if (e.code === 'ECONNABORTED' || (e.message && e.message.toLowerCase().includes('timeout'))) {
        Alert.alert('Failed to fetch events', 'Request timed out. Check your API host or network.');
      } else if (e.response) {
        Alert.alert('Failed to fetch events', JSON.stringify(e.response.data));
      } else {
        Alert.alert('Failed to fetch events', e.message || 'Unknown error');
      }
    } finally {
      setLoading(false);
    }
  }, [token, router]);

  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem('token');
      if (!stored) {
        router.replace('/login');
        return;
      }
      setToken(stored);
      fetchEvents(stored);
    })();
  }, [fetchEvents, router]);

  const checkIn = async (eventId: string) => {
    try {
      const stored = token || await AsyncStorage.getItem('token');
      if (!stored) {
        router.replace('/login');
        return;
      }
      await api.post('/attendance/', { event: eventId }, { timeout: 10000 });
      Alert.alert('Success', 'Checked in successfully!');
      fetchEvents(stored);
    } catch (err) {
      console.log('Check in error', err);
      const e: any = err;
      if (e.code === 'ECONNABORTED') {
        Alert.alert('Check in failed', 'Request timed out');
      } else if (e.response) {
        Alert.alert('Check in failed', JSON.stringify(e.response.data));
      } else {
        Alert.alert('Check in failed', e.message || 'Unknown error');
      }
    }
  };

  if (loading && events.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="#1D4ED8" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.iconContainer}>
                <MaterialIcons name="event-available" size={32} color="#1D4ED8" />
              </View>
              <View style={styles.headerInfo}>
                <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.date}>Upcoming</Text>
              </View>
            </View>

            <View style={styles.cardBody}>
              <Text style={styles.description} numberOfLines={2}>{item.description}</Text>

              <View style={styles.locationRow}>
                <MaterialIcons name="location-on" size={18} color="#6B7280" />
                <Text style={styles.location}>{item.location}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.checkInButton}
              onPress={() => checkIn(item.id)}
              activeOpacity={0.8}
            >
              <MaterialIcons name="check-circle" size={24} color="white" />
              <Text style={styles.checkInText}>Check In</Text>
            </TouchableOpacity>
          </View>
        )}
        onRefresh={() => fetchEvents()}
        refreshing={loading}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F7FB',
  },

  listContent: {
    padding: 16,
    paddingBottom: 32,
  },

  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },

  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },

  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#E0E7FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  headerInfo: {
    flex: 1,
  },

  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },

  date: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },

  cardBody: {
    padding: 16,
  },

  description: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
    lineHeight: 20,
  },

  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  location: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '600',
    marginLeft: 6,
  },

  checkInButton: {
    backgroundColor: '#1D4ED8',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },

  checkInText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
    marginLeft: 8,
  },
});
