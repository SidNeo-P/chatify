import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface ChatHeaderProps {
  username: string;
}

export default function ChatHeader({ username }: ChatHeaderProps) {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <View style={[styles.header, { paddingTop: insets.top }]}>
      <View style={styles.headerLeft}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.profileInfo}>
          <View style={styles.profileImage} />
          <View style={styles.nameContainer}>
            <Text style={styles.contactName}>{username || "Unknown"}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#1F1A3D",
    zIndex: 1,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  profileInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#4A90E2",
    marginRight: 8,
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  contactName: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginRight: 4,
  },
});
