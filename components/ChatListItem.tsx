import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getUserById } from "../lib/api"; // Import the new api function

// Define an interface for the contact prop, matching the one in AllChatsScreen
interface Contact {
  contactid: string;
  userid: string;
  contactuserid: string;
  nickname: string | null;
  blocked: boolean;
}

// Define an interface for the user object fetched from the 'users' table
interface User {
  userid: string;
  username: string;
  profilepicture: string | null;
  // Add other user fields if needed
}

// Apply the Contact type to the component's props
export default function ChatListItem({ contact }: { contact: Contact }) {
  const navigation = useNavigation<any>();
  // Apply the User type to the useState hook
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!contact?.contactuserid) return;

      setLoading(true);
      try {
        const userData = await getUserById(contact.contactuserid);
        setUser(userData);
      } catch (error) {
        console.error("Failed to fetch user data in ChatListItem:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [contact]);

  if (loading) {
    // You can return a simple loader or a placeholder view
    return (
      <View style={styles.chatItem}>
        <ActivityIndicator size="small" color="#FFFFFF" />
      </View>
    );
  }

  if (!user) {
    // Don't render anything if the contact's user data couldn't be fetched
    return null;
  }

  return (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() =>
        navigation.navigate("Chat", {
          contactId: user.userid,
          contactName: contact.nickname || user.username,
        })
      }
    >
      <View style={styles.avatarContainer}>
        <Image
          source={
            user.profilepicture
              ? { uri: user.profilepicture }
              : require("../assets/chatapp.webp") // A default placeholder image
          }
          style={styles.avatar}
        />
        {/* You can add online indicator logic here later */}
      </View>
      <View style={styles.chatInfo}>
        <Text style={styles.chatName}>{contact.nickname || user.username}</Text>
        <Text style={styles.lastMessage} numberOfLines={1}>
          Tap to start chatting...
        </Text>
      </View>
      <View style={styles.metaInfo}>
        <Text style={styles.timestamp}>Yest.</Text>
        {/* You can add unread badge logic here later */}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  avatarContainer: {
    position: "relative",
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
  },
  chatInfo: {
    flex: 1,
    marginLeft: 12,
  },
  chatName: {
    fontSize: 17,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  lastMessage: {
    fontSize: 15,
    color: "#A09BAC",
    marginTop: 4,
  },
  metaInfo: {
    alignItems: "flex-end",
  },
  timestamp: {
    fontSize: 13,
    color: "#A09BAC",
    marginBottom: 8,
  },
});
