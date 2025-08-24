import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  message: string;
  isSuccess?: boolean;
}

const CustomModal = ({
  visible,
  onClose,
  title,
  message,
  isSuccess = true,
}: ModalProps) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={[styles.modal, { borderColor: isSuccess ? "#4ade80" : "#f87171" }]}>
          <Text style={[styles.title, { color: isSuccess ? "#4ade80" : "#f87171" }]}>
            {title}
          </Text>
          <Text style={styles.message}>{message}</Text>
          <TouchableOpacity onPress={onClose} style={styles.button}>
            <Text style={{ color: "#fff", fontWeight: "bold" }}>Đóng</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default CustomModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    borderWidth: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#7B2FF7",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
});
