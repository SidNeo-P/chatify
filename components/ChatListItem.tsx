//

import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { getUserById } from "../lib/api"; // Corrected path
import { useNavigation } from "@react-navigation/native";
import { NavigationProps } from "../types/navigation"; // Import the navigation type

// Type for the contact prop
type Contact = {
  ContactID: string; // UUID
  UserID: string; // UUID
  ContactUserID: string; // UUID
  Nickname?: string; // Optional
  Blocked?: boolean; // Optional
};

// Type for the userData state - updated to match database field names
type User = {
  userid: string; // UUID - lowercase to match database
  phonenumber: string;
  username: string;
  profilepicture?: string; // Optional - lowercase to match database
  status?: string; // Optional
  lastseen?: string; // Optional, timestamp
};

type ChatListItemProps = {
  contact: Contact;
};

export default function ChatListItem({ contact }: ChatListItemProps) {
  const navigation = useNavigation<NavigationProps>(); // Use the navigation type
  const [userData, setUserData] = useState<User | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!contact?.ContactUserID) return;
      try {
        const data = await getUserById(contact.ContactUserID);
        console.log("Fetched userData:", data); // <-- SEE WHAT'S INSIDE
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
          username: contact.Nickname || userData?.username || "Unknown"
        }); // Pass both userId and username
      }}
    >
      <Image
        source={
          userData?.profilepicture
            ? { uri: userData.profilepicture }
            : require("../assets/gojoprofile.jpg") // Use require for local assets
        }
        style={styles.avatar}
      />
      <View style={styles.textContainer}>
        <Text style={styles.username}>
          {contact.Nickname || userData?.username || "Unknown"}
        </Text>
        <Text style={styles.lastMessage} numberOfLines={1} ellipsizeMode="tail">
          Lorem ipsum dolor sit amet...
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
    color: "#FFFFFF", // Dark color for better contrast
  },
  lastMessage: {
    color: "gray",
  },
});

