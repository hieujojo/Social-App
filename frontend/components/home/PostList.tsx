import React, { useEffect, useState } from "react";
import { FlatList, ActivityIndicator, View, Text } from "react-native";
import PostItem, { PostProps } from "./PostItem";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PostList: React.FC = () => {
  const [posts, setPosts] = useState<PostProps[]>([]);
  const [loading, setLoading] = useState(true);
  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  const fetchPosts = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      console.log("🔑 Token gửi kèm:", token);

      const res = await fetch(`${API_URL}/api/posts/all`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      const text = await res.text();
      console.log("📥 Raw response:", text);

      let data;
      try {
        data = JSON.parse(text);
      } catch (parseErr) {
        console.error("❌ Parse JSON fail:", parseErr);
        data = null;
      }

      if (Array.isArray(data)) {
        setPosts(data);
      } else {
        console.warn("⚠️ API không trả về array:", data);
        setPosts([]);
      }
    } catch (err) {
      console.error("❌ Error fetching posts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center p-4">
        <ActivityIndicator size="large" color="#fff" />
        <Text className="text-white mt-2">Đang tải bài viết...</Text>
      </View>
    );
  }

  if (posts.length === 0) {
    return (
      <View className="flex-1 justify-center items-center p-4">
        <Text className="text-white">Không có bài viết nào!</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={posts}
      keyExtractor={(item, index) => `${item._id}-${index}`}
      renderItem={({ item }) => (
        <PostItem {...item} onPostUpdated={fetchPosts} />
      )}
      initialNumToRender={5}
      windowSize={5}
    />
  );
};

export default PostList;