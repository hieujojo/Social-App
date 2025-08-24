import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const ProfileIndex = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) {
          router.push('/Login');
          return;
        }

        const response = await fetch(`${API_URL}/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <Text>Loading...</Text>;

  return (
    <View>
      <Text>{user?.username}</Text>
      <Text>{user?.bio || 'No bio'}</Text>
      <Text>Followers: {user?.followers.length || 0}</Text>
      <Text>Following: {user?.following.length || 0}</Text>
      <TouchableOpacity onPress={() => router.push('/components/profile/edit')}>
        <Text>Edit Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/profile/followers')}>
        <Text>View Followers</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileIndex;