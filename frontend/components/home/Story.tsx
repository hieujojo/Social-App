import React, { useEffect, useRef } from "react";
import {
  View,
  ScrollView,
  Image,
  Text,
  TouchableOpacity,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Asset } from "expo-asset";
import { LinearGradient } from "expo-linear-gradient";

interface StoryType {
  id: string;
  username: string;
  avatar: any;
  isUser?: boolean;
}

// Load ảnh
const YourStoryImage = Asset.fromModule(
  require("../../assets/images/friends/shiba.jpg")
);
const Friend1Image = Asset.fromModule(
  require("../../assets/images/friends/caonhatminh.jpg")
);
const Friend2Image = Asset.fromModule(
  require("../../assets/images/friends/duydoky.jpg")
);
const Friend3Image = Asset.fromModule(
  require("../../assets/images/friends/chiphien.png")
);

// Preload tất cả assets
const assets = [YourStoryImage, Friend1Image, Friend2Image, Friend3Image];
const preloadAssets = async () => {
  try {
    await Promise.all(assets.map((asset) => asset.downloadAsync()));
  } catch {
    // bỏ qua lỗi
  }
};
preloadAssets();

const Story: React.FC = () => {
  const stories: StoryType[] = [
    { id: "1", username: "Your Story", avatar: YourStoryImage, isUser: true },
    { id: "2", username: "Minh", avatar: Friend1Image },
    { id: "3", username: "Duy", avatar: Friend2Image },
    { id: "4", username: "Phien", avatar: Friend3Image },
  ];

  return (
    <View className="py-4 bg-black">
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {stories.map((story) => (
          <StoryItem key={story.id} story={story} />
        ))}
      </ScrollView>
    </View>
  );
};

const StoryItem: React.FC<{ story: StoryType }> = ({ story }) => {
  const rotation = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;

  // Viền xoay
  useEffect(() => {
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 4000,
        useNativeDriver: true,
      })
    ).start();
  }, [rotation]);

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const rotateInterpolate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View className="items-center mx-2">
      <TouchableOpacity
        activeOpacity={0.8}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Animated.View style={{ transform: [{ scale }] }}>
          <View
            style={{
              width: 86,
              height: 86,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Viền xoay */}
            <Animated.View
              style={{
                transform: [{ rotate: rotateInterpolate }],
                position: "absolute",
              }}
            >
              <LinearGradient
                colors={[
                  "#a1c4fd",
                  "#c2e9fb",
                  "#6dd5fa",
                  "#2980b9",
                  "#2c3e50",
                ]}
                style={{
                  width: 86,
                  height: 86,
                  borderRadius: 999,
                  padding: 3,
                }}
              >
                {/* thêm thẻ rỗng để tránh RN coi là text node */}
                <></>
              </LinearGradient>
            </Animated.View>

            {/* Ảnh cố định */}
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 999,
                overflow: "hidden",
                backgroundColor: "#000",
              }}
            >
              <Image
                source={{ uri: story.avatar.uri }} // ✅ dùng .uri thay vì asset trực tiếp
                style={{ width: "100%", height: "100%" }}
              />
            </View>

            {/* Nút + */}
            {story.isUser && (
              <TouchableOpacity
                style={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  backgroundColor: "#3b82f6",
                  borderRadius: 999,
                  padding: 1,
                }}
              >
                <Ionicons name="add-circle" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>
      </TouchableOpacity>

      <Text className="text-xs mt-1 text-white shadow-sm">
        {story.username}
      </Text>
    </View>
  );
};

export default Story;
