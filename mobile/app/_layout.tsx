import React, { useEffect, useState } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';
import { ActivityIndicator, View } from 'react-native';
import { useColorScheme } from 'react-native';

import HomeScreen from './home';
import ProfileScreen from './profile';
import LoginScreen from './login';
import SignupScreen from './signup';

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

export const unstable_settings = {
  anchor: 'login',
};

function DrawerNavigator({ onLogout }: { onLogout: () => void }) {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#0F172A',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: '700',
        },
        drawerStyle: {
          backgroundColor: '#F3F7FB',
        },
        drawerLabelStyle: {
          fontSize: 16,
          fontWeight: '500',
        },
        drawerActiveTintColor: '#1D4ED8',
        drawerInactiveTintColor: '#6B7280',
      }}
    >
      <Drawer.Screen
        name="Events"
        options={{
          title: 'Events',
          drawerIcon: ({ color }) => <MaterialIcons name="event" size={24} color={color} />,
        }}
      >
        {() => <HomeScreen onLogout={onLogout} />}
      </Drawer.Screen>
      <Drawer.Screen
        name="Profile"
        options={{
          title: 'Profile',
          drawerIcon: ({ color }) => <MaterialIcons name="person" size={24} color={color} />,
        }}
      >
        {() => <ProfileScreen onLogout={onLogout} />}
      </Drawer.Screen>
    </Drawer.Navigator>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [isLoading, setIsLoading] = useState(true);
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        setHasToken(!!token);
      } catch (err) {
        console.error('Error checking token:', err);
      } finally {
        setIsLoading(false);
      }
    };
    checkToken();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    setHasToken(false);
  };

  if (isLoading) {
    return (
      <SafeAreaProvider>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F3F7FB' }}>
          <ActivityIndicator size="large" color="#1D4ED8" />
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack.Navigator
          screenOptions={{ headerShown: false }}
          initialRouteName={hasToken ? 'Drawer' : 'Login'}
        >
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
          <Stack.Screen name="Drawer">
            {() => <DrawerNavigator onLogout={handleLogout} />}
          </Stack.Screen>
        </Stack.Navigator>
        <StatusBar style="auto" />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}