import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { getUserById } from "../lib/api";
import { useNavigation } from "@react-navigation/native";
import { NavigationProps } from "../types/Alltypes";

// Type for the contact prop
type Contact = {
  ContactID: string;
  UserID: string;
  ContactUserID: string;
  Nickname?: string;
  Blocked?: boolean;
};

type User = {
  userid: string; // UUID
  phonenumber: string;
  username: string;
  profilepicture?: string;
  status?: string;
  lastseen?: string;
};

type ChatListItemProps = {
  contact: Contact;
};

export default function ChatListItem({ contact }: ChatListItemProps) {
  const navigation = useNavigation<NavigationProps>();
  const [userData, setUserData] = useState<User | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!contact?.ContactUserID) return;
      try {
        const data = await getUserById(contact.ContactUserID);
        console.log("Fetched userData:", data);
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user data in ChatListItem:", error);
      }
    };
    fetchUserData();
  }, [contact]);
  console.log("User Data:");

  return (
    <TouchableOpacity
      style={styles.mainView}
      onPress={() => {
        navigation.navigate("Chat", {
          userId: contact.ContactUserID,
          username: contact.Nickname || userData?.username || "Unknown",
        });
      }}
    >
      <Image
        source={
          userData?.profilepicture
            ? { uri: userData.profilepicture }
            : require("../assets/gojoprofile.jpg")
        }
        style={styles.avatar}
      />
      <View style={styles.textContainer}>
        <Text style={styles.username}>
          {contact.Nickname || userData?.username || "Unknown"}
        </Text>
        <Text style={styles.lastMessage} numberOfLines={1} ellipsizeMode="tail">
          hii
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  mainView: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 8,
  },
  avatar: {
    borderRadius: 50,
    width: 50,
    height: 50,
  },
  textContainer: {
    flex: 1,
    overflow: "hidden",
    gap: 1.5,
  },
  username: {
    fontWeight: "600",
    fontSize: 16,
    color: "#FFFFFF",
  },
  lastMessage: {
    color: "gray",
  },
});
