import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useRouter } from "expo-router";
import CustomModal from "../components/home/CustomModal";

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secureText, setSecureText] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(true);
  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  const handleLogin = async () => {
    try {
      const res = await fetch(`${API_URL}/api/authenticate/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (res.ok) {
        await AsyncStorage.setItem("userToken", data.token); // Sử dụng "userToken"
        console.log("Token saved:", data.token); // Debug
        setModalTitle("Thành công");
        setModalMessage("Đăng nhập thành công!");
        setIsSuccess(true);
        setModalVisible(true);
      } else {
        setModalTitle("Lỗi");
        setModalMessage(data.message || "Đăng nhập thất bại");
        setIsSuccess(false);
        setModalVisible(true);
      }
    } catch (err) {
      setModalTitle("Lỗi");
      setModalMessage("Không thể kết nối server");
      setIsSuccess(false);
      setModalVisible(true);
    }
  };

  return (
    <LinearGradient colors={["#7B2FF7", "#F107A3"]} style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={40}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 justify-center px-6 mb-12">
            <View className="items-center mb-10">
              <Image
                className="w-48 h-48"
                source={require("../assets/images/logo_social-removebg-preview.png")}
              />
              <Text className="text-4xl font-bold text-white tracking-[2px]">
                Social App
              </Text>
            </View>

            {/* Email */}
            <TextInput
              placeholder="Email"
              placeholderTextColor="#ddd"
              value={email}
              onChangeText={setEmail}
              className="bg-white/20 text-white rounded-full px-5 py-3 mb-4"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            {/* Mật khẩu */}
            <View className="flex-row items-center bg-white/20 rounded-full px-5 mb-4">
              <TextInput
                placeholder="Mật khẩu"
                placeholderTextColor="#ddd"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={secureText}
                className="flex-1 text-white py-3"
              />
              <TouchableOpacity onPress={() => setSecureText(!secureText)}>
                <Ionicons
                  name={secureText ? "eye-off" : "eye"}
                  size={24}
                  color="#fff"
                />
              </TouchableOpacity>
            </View>

            {/* Button đăng nhập */}
            <TouchableOpacity
              className="bg-white p-4 rounded-full items-center mt-2 mb-4"
              onPress={handleLogin}
            >
              <Text className="text-[#7B2FF7] font-bold text-base">
                Đăng nhập
              </Text>
            </TouchableOpacity>

            {/* Link đăng ký */}
            <TouchableOpacity onPress={() => router.push("/Register")}>
              <Text className="text-center mt-4 text-white">
                Chưa có tài khoản?{" "}
                <Text className="text-[#bf9bf9] font-bold underline">
                  Đăng ký
                </Text>
              </Text>
            </TouchableOpacity>

            <CustomModal
              visible={modalVisible}
              title={modalTitle}
              message={modalMessage}
              isSuccess={isSuccess}
              onClose={async () => {
                setModalVisible(false);
                if (isSuccess) {
                  // Làm mới trạng thái trong _layout.tsx (giả sử có cách gọi lại)
                  router.replace("/Home"); // Thử reload toàn bộ navigation
                }
              }}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}