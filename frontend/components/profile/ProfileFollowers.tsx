import { useState, useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const ProfileFollowers = () => {
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFollowers = async () => {
      const token = await AsyncStorage.getItem('userToken');
      const response = await fetch(`${API_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const user = await response.json();
      // Giả sử fetch danh sách followers từ API (cần endpoint mới)
      setFollowers(user.followers || []);
      setLoading(false);
    };
    fetchFollowers();
  }, []);

  if (loading) return <Text>Loading...</Text>;

  return (
    <View>
      <FlatList
        data={followers}
        keyExtractor={(item) => item.toString()}
        renderItem={({ item }) => <Text>{item.username || item}</Text>}
      />
    </View>
  );
};

export default ProfileFollowers;