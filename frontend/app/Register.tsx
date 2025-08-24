import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "react-native-vector-icons/Ionicons";
import CustomModal from "../components/home/CustomModal";
import { useRouter } from "expo-router";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function RegisterScreen() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [secureText, setSecureText] = useState(true);
  const [otpVerified, setOtpVerified] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [isSuccess, setIsSuccess] = useState(true);

  const handleOtpSuccessNavigation = () => {
    router.push("/Home");
  };

  const handleRegister = async () => {
    try {
      const res = await fetch(`${API_URL}/api/authenticate/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await res.json();

      setModalTitle(res.ok ? "Thành công" : "Lỗi");
      setModalMessage(data.message || "Đã có lỗi xảy ra");
      setIsSuccess(res.ok);
      setModalVisible(true);

      if (res.ok) setStep(2);
    } catch (err) {
      setModalTitle("Lỗi");
      setModalMessage("Không thể kết nối server");
      setIsSuccess(false);
      setModalVisible(true);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const res = await fetch(`${API_URL}/api/authenticate/verify-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();

      if (res.ok) setOtpVerified(true);

      setModalTitle(res.ok ? "Xác minh thành công" : "Lỗi");
      setModalMessage(data.message || "Đã có lỗi xảy ra khi xác minh.");
      setIsSuccess(res.ok);
      setModalVisible(true);
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
          <View className="flex-1 justify-center px-6">
            {/* Logo + Title */}
            <View className="items-center mb-10">
              <Image
                className="w-48 h-48"
                source={require("../assets/images/logo_social-removebg-preview.png")}
              />
              <Text className="text-4xl font-bold text-white tracking-[2px]">
                Social App
              </Text>
            </View>

            {/* Form bước 1 */}
            {step === 1 ? (
              <>
                <TextInput
                  placeholder="Tên người dùng"
                  placeholderTextColor="#ddd"
                  value={username}
                  onChangeText={setUsername}
                  className="bg-white/20 text-white rounded-full px-5 py-3 mb-4"
                />

                <TextInput
                  placeholder="Email (@gmail.com)"
                  placeholderTextColor="#ddd"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  className="bg-white/20 text-white rounded-full px-5 py-3 mb-4"
                />

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

                <TouchableOpacity
                  className="bg-white p-4 rounded-full items-center mt-2 mb-4"
                  onPress={handleRegister}
                >
                  <Text className="text-[#7B2FF7] font-bold text-base">
                    Đăng ký
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              // Form bước 2
              <>
                <Text className="text-2xl font-bold text-white text-center mb-4">
                  Xác minh Email
                </Text>
                <Text className="text-base text-white text-center mb-6">
                  Chúng tôi đã gửi mã OTP đến email của bạn. Vui lòng nhập mã để
                  xác minh.
                </Text>

                <TextInput
                  placeholder="Nhập mã OTP"
                  placeholderTextColor="#ddd"
                  value={otp}
                  onChangeText={setOtp}
                  keyboardType="numeric"
                  className="bg-white/20 text-white rounded-full px-5 py-3 mb-4"
                />

                <TouchableOpacity
                  className="bg-white p-4 rounded-full items-center mb-4"
                  onPress={handleVerifyOtp}
                >
                  <Text className="text-[#7B2FF7] font-bold text-base">
                    Xác minh OTP
                  </Text>
                </TouchableOpacity>
              </>
            )}

            <CustomModal
              visible={modalVisible}
              title={modalTitle}
              message={modalMessage}
              isSuccess={isSuccess}
              onClose={() => {
                console.log("Modal close clicked, otpVerified:", otpVerified);
                setModalVisible(false);

                if (otpVerified) {
                  console.log("OTP Verified, điều hướng sang Home...");
                  router.push("/Home");
                }
              }}
            />
            {/* Link sang Login */}
            <TouchableOpacity
              onPress={() => {
                router.push("/Login");
              }}
            >
              <Text className="text-white text-center mt-4">
                Đã có tài khoản?{" "}
                <Text className="font-bold underline text-[#bf9bf9]">
                  Đăng nhập
                </Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
