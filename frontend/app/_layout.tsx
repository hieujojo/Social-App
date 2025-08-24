import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, StatusBar, StyleSheet, ActivityIndicator, View } from 'react-native';
import HomeScreen from './Home';
import SearchScreen from './Search';
import StoryScreen from './Story';
import ProfileScreen from './Profile';
import RegisterScreen from './Register';
import LoginScreen from './Login';
import Posts from '../components/home/PostList'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

import '../global.css';

type TabParamList = {
  Home: undefined;
  Search: undefined;
  Post: undefined;
  Story: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createNativeStackNavigator();

function TabLayout() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: React.ComponentProps<typeof Ionicons>['name'] = 'home-outline';

          if (route.name === 'Home') iconName = 'home-outline';
          else if (route.name === 'Search') iconName = 'search-outline';
          else if (route.name === 'Post') iconName = 'add-circle-outline';
          else if (route.name === 'Story') iconName = 'film-outline';
          else if (route.name === 'Profile') iconName = 'person-outline';

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: '#666',
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: '#000',
          borderTopColor: '#111',
          height: 60,
          position: 'absolute',
          bottom: 0, // Đảm bảo thanh tab ở dưới cùng
          left: 0,
          right: 0,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Post" component={Posts} /> 
      <Tab.Screen name="Story" component={StoryScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function Layout() {
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        console.log("Token from AsyncStorage in _layout.tsx:", token); // Debug
        setIsLoggedIn(!!token);
      } catch (e) {
        console.error("Error checking token:", e);
      } finally {
        setLoading(false);
      }
    };
    checkLogin();
  }, []);

  // Thêm hàm để kiểm tra lại khi cần
  const refreshLoginStatus = async () => {
    const token = await AsyncStorage.getItem('userToken');
    console.log("Refreshing token status:", token);
    setIsLoggedIn(!!token);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isLoggedIn ? (
          <Stack.Screen name="MainApp" component={TabLayout} />
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
});