import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const Header: React.FC = () => {
  return (
    <View className="p-2.5 h-[90px] bg-black">
      <View className="flex-row items-center">
        {/* Logo */}
        <View className="flex-1 items-center ml-[-20px]">
          <Image
            className="w-28 h-28"
            source={require("../../assets/images/logo_social-removebg-preview.png")}
            resizeMode="contain"
          />
        </View>

        {/* Title */}
        <View className="flex-1 items-center ml-[25px]">
          <Text className="text-[25px] w-40 font-bold text-blue-300">Social App</Text>
        </View>

        {/* Icons */}
        <View className="flex-1 flex-row justify-center mr-[-10px]">
          <TouchableOpacity className="p-2">
            <Ionicons name="heart-outline" size={24} color="#a1c4fd" />
          </TouchableOpacity>
          <TouchableOpacity className="p-2">
            <Ionicons name="chatbubble-outline" size={24} color="#a1c4fd" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Header;
