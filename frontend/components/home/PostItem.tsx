import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type LikeItem = string | { _id?: string; username?: string };

export interface PostProps {
  _id: string;
  username: string;
  caption: string | null;
  likes: LikeItem[];
  likesCount: number;
  createdAt: string;
  avatarAsset?: string;
  postImageAsset?: string;
  onPostUpdated?: () => void; // Thêm prop để gọi lại fetchPosts
}

const PostItem: React.FC<PostProps> = ({
  _id,
  username,
  caption,
  likes,
  likesCount,
  createdAt,
  avatarAsset,
  postImageAsset,
  onPostUpdated,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [likesState, setLikesState] = useState<LikeItem[]>(likes ?? []);
  const [likesCountState, setLikesCountState] = useState<number>(likesCount ?? 0);
  const [isLiked, setIsLiked] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  const getImageUrl = (assetName?: string) =>
    assetName ? `${API_URL}/images/${assetName}` : "https://via.placeholder.com/40";

  // Đồng bộ props -> state
  useEffect(() => {
    setLikesState(likes ?? []);
    setLikesCountState(likesCount ?? 0);
  }, [likes, likesCount]);

  // Kiểm tra user hiện tại đã like chưa
  useEffect(() => {
    (async () => {
      const userId = await AsyncStorage.getItem("userId");
      setCurrentUserId(userId);
      if (!userId) {
        setIsLiked(false);
        return;
      }
      const liked = likesState.some((u) =>
        typeof u === "string" ? u === userId : u?._id === userId
      );
      setIsLiked(liked);
    })();
  }, [likesState]);

  // Format số like (1k, 1M...)
  const formatLikes = (count: number) => {
    if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
    if (count >= 1_000) return `${Math.floor(count / 1_000)}k`;
    return String(count);
  };

  // Hiển thị tên người like
  const displayLikes = () => {
    if (likesCountState === 0) return "Hãy là người đầu tiên thích bài viết này";

    const names = likesState
      .map((u) => {
        if (typeof u === "object" && u !== null && "username" in u) {
          return u.username || null;
        }
        return null;
      })
      .filter((name): name is string => name !== null);

    let displayNames: string[] = [];

    if (isLiked) displayNames.push("Bạn");

    displayNames = displayNames.concat(names.slice(0, 2));

    const remainingCount = likesCountState - displayNames.length;

    if (remainingCount > 0) {
      return `${displayNames.join(", ")}${displayNames.length > 0 ? " và " : ""}${formatLikes(remainingCount)} người khác`;
    }

    return displayNames.length > 0
      ? `${displayNames.join(", ")} đã thích`
      : `${formatLikes(likesCountState)} lượt thích`;
  };

  // Format thời gian với múi giờ +07
  const formatTimeAgo = (dateStr: string) => {
    const now = new Date(); // 03:07 PM +07, 23/08/2025
    const postDate = new Date(dateStr);
    const diffMs = now.getTime() - postDate.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    if (diffHours < 1) return "Vừa xong";
    if (diffHours < 24) return `${diffHours} giờ trước`;
    return `${diffDays} ngày trước`;
  };

  const handleLike = async () => {
    const token = await AsyncStorage.getItem("userToken");
    if (!token || !currentUserId) return;

    try {
      const res = await fetch(`${API_URL}/api/posts/like/${_id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();

      if (res.ok) {
        setLikesState(Array.isArray(data.likes) ? data.likes : []);
        setLikesCountState(data.likesCount ?? 0);
        setIsLiked(!isLiked); // Cập nhật trạng thái like ngay lập tức
        if (onPostUpdated) onPostUpdated(); // Gọi lại fetchPosts từ PostList
      } else {
        console.error("Like failed:", data?.msg || "Unknown error");
      }
    } catch (err) {
      console.error("Error liking post:", err);
    }
  };

  return (
    <View className="mb-5 bg-black p-2 rounded-lg">
      {/* Header */}
      <View className="flex-row justify-between items-center p-2">
        <View className="flex-row items-center gap-2">
          <Image
            source={{ uri: getImageUrl(avatarAsset) }}
            className="w-10 h-10 rounded-full bg-gray-800"
          />
          <Text className="font-bold text-white">{username}</Text>
        </View>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Ionicons name="ellipsis-horizontal" size={24} color="#D1D5DB" />
        </TouchableOpacity>
      </View>

      {/* Image */}
      <View style={{ width: "100%", height: 300, overflow: "hidden" }}>
        <Image
          source={{ uri: getImageUrl(postImageAsset) }}
          style={{ width: "100%", height: "100%" }}
          resizeMode="contain"
        />
      </View>

      {/* Actions */}
      <View className="flex-row justify-between p-2">
        <View className="flex-row gap-4">
          <TouchableOpacity onPress={handleLike}>
            <Ionicons
              name={isLiked ? "heart" : "heart-outline"}
              size={24}
              color={isLiked ? "red" : "#D1D5DB"}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="chatbubble-outline" size={24} color="#D1D5DB" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="share-outline" size={24} color="#D1D5DB" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity>
          <Ionicons name="bookmark-outline" size={24} color="#D1D5DB" />
        </TouchableOpacity>
      </View>

      {/* Likes */}
      <Text className="font-bold px-2 text-white">{displayLikes()}</Text>

      {/* Caption */}
      <Text className="px-2 mt-1 text-white">
        <Text className="font-bold">{username} </Text>
        {caption}
      </Text>

      <Text className="px-2 text-gray-300 text-xs mt-1">{formatTimeAgo(createdAt)}</Text>

      {/* Modal */}
      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-gray-900 p-5 rounded-t-xl">
            <TouchableOpacity className="py-4 border-b border-gray-700">
              <Text className="text-white">Lưu bài viết</Text>
            </TouchableOpacity>
            <TouchableOpacity className="py-4" onPress={() => setModalVisible(false)}>
              <Text className="text-white">Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default PostItem;