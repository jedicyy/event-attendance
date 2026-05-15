import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet, Alert } from 'react-native';
import api from '../../constants/api'; 

// 1. Define the Shape of your Event Data (Interface)
interface Event {
  id: number;
  name: string;
  // add other fields like 'date' or 'location' if they exist in your Django model
}

export default function HomeScreen() {
  // 2. Tell State it will hold an array of Events
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await api.get('/events/');
      setEvents(response.data);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  // 3. Add types to the eventId parameter
  const handleCheckIn = async (eventId: number) => {
    try {
      // Logic: POST to backend with event_id
      await api.post('/attendance/', { event_id: eventId });
      Alert.alert("Success", "Check-in successful!");
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail || "Check-in failed.";
      Alert.alert("Error", errorMsg);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upcoming Events</Text>
      <FlatList
        data={events}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }: { item: Event }) => (
          <View style={styles.card}>
            <Text style={styles.eventName}>{item.name}</Text>
            <Button 
              title="Check In" 
              onPress={() => handleCheckIn(item.id)} 
              color="#007AFF"
            />
          </View>
        )}
      />
    </View>
  );
}

// 4. Using StyleSheet (Professional Standard)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 40,
  },
  card: {
    marginVertical: 8,
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#eee',
    elevation: 2, // Shadow for Android
  },
  eventName: {
    fontSize: 18,
    marginBottom: 10,
  },
});