import { useState, useEffect } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const ProfileEdit = () => {
  const [bio, setBio] = useState('');
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = await AsyncStorage.getItem('userToken');
      const response = await fetch(`${API_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setUser(data);
      setBio(data.bio || '');
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    const token = await AsyncStorage.getItem('userToken');
    await fetch(`${API_URL}/users/${user?._id}`, {
      method: 'PUT',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ bio }),
    });
    router.push('/profile');
  };

  return (
    <View>
      <Text>Edit Bio</Text>
      <TextInput value={bio} onChangeText={setBio} />
      <Button title="Save" onPress={handleSave} />
    </View>
  );
};

export default ProfileEdit;