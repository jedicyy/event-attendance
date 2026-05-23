import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../../constants/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function HomeScreen() {

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
        alert('Failed to fetch events: request timed out.\n\nCheck your API host value (API_BASE) and network.\nIf using an Android emulator try http://10.0.2.2:8000, or adjust API_BASE in mobile/app files.');
      } else if (e.response) {
        alert('Failed to fetch events: ' + JSON.stringify(e.response.data));
      } else {
        alert('Failed to fetch events: ' + (e.message || 'Unknown error'));
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
      await api.post('/attendance/', { event: eventId, checked_in: true }, { timeout: 10000 });
      alert('Checked in successfully');
    } catch (err) {
      console.log(err);
      const e: any = err;
      if (e.code === 'ECONNABORTED') alert('Check in failed: request timed out');
      else alert('Check in failed');
    }
  };

  if (loading) return (
    <SafeAreaView style={[styles.container,{justifyContent:'center'}]}>
      <ActivityIndicator size="large" color="#1D4ED8" />
    </SafeAreaView>
  );

  return (

    <SafeAreaView style={styles.container}>
      {/* NAVBAR */}

      <View style={styles.navbar}>

        <Text style={styles.logo}>
          Smart Library
        </Text>

        <TouchableOpacity style={styles.logoutBtn} onPress={async () => { await AsyncStorage.removeItem('token'); router.replace('/login'); }}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

      </View>

      {/* HEADER */}

      <View style={styles.header}>

        <Text style={styles.heading}>
          Upcoming Events
        </Text>

      </View>

      {/* EVENT LIST */}

      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          padding: 20
        }}
        renderItem={({ item }) => (

          <View style={styles.card}>

            <Text style={styles.title}>
              {item.title}
            </Text>

            <Text style={styles.description}>
              {item.description}
            </Text>

            <Text style={styles.location}>
              Location: {item.location}
            </Text>

            <TouchableOpacity
              style={styles.button}
              onPress={() => checkIn(item.id)}
            >

              <Text style={styles.buttonText}>
                Check In
              </Text>

            </TouchableOpacity>

          </View>

        )}
      />

      {/* BOTTOM NAVIGATION */}

      <View style={styles.bottomNav}>

        <TouchableOpacity>

          <Text style={styles.activeTab}>
            Home
          </Text>

        </TouchableOpacity>

        <TouchableOpacity>

          <Text style={styles.tab}>
            Explore
          </Text>

        </TouchableOpacity>

      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#F1F5F9",
  },

  navbar: {
    backgroundColor: "#0F172A",
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  logo: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
  },

  logoutBtn: {
    backgroundColor: "#DC2626",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },

  logoutText: {
    color: "white",
    fontWeight: "bold",
  },

  header: {
    padding: 20,
  },

  heading: {
    fontSize: 34,
    fontWeight: "bold",
  },

  card: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },

  description: {
    color: "#475569",
    marginBottom: 10,
  },

  location: {
    fontWeight: "bold",
    marginBottom: 15,
  },

  button: {
    backgroundColor: "#2563EB",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },

  buttonText: {
    color: "white",
    fontWeight: "bold",
  },

  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#000",
    paddingVertical: 15,
  },

  activeTab: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },

  tab: {
    color: "#94A3B8",
    fontSize: 16,
  },

});