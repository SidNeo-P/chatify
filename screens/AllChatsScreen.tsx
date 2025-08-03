
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { useAuth } from "../contexts/AuthContext";
import { getContacts } from "../lib/api"; // Import from your new util file
import ChatListItem from "../components/ChatListItem"; // Import the new component

type Contact = {
  ContactID: string; // UUID
  UserID: string; // UUID
  ContactUserID: string; // UUID
  Nickname?: string; // Optional
  Blocked?: boolean; // Optional
};

export default function AllChatsScreen() {
  const { session } = useAuth();
  const isFocused = useIsFocused();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isFocused && session) {
      const fetchUserContacts = async () => {
        setLoading(true);
        try {
          const userContacts = await getContacts();
          setContacts(userContacts);
        } catch (error) {
          console.error("Failed to fetch contacts on screen:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchUserContacts();
    }
  }, [isFocused, session]);

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chats</Text>
      </View>
      <FlatList
        data={contacts}
        keyExtractor={(item) => item.ContactID}
        renderItem={({ item }) => <ChatListItem contact={item} />}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text style={styles.emptyText}>No Chats Found</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#12082A", // Dark purple background
//   },
//   centered: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   header: {
//     padding: 16,
//     alignItems: "flex-start",
//   },
//   headerTitle: {
//     fontSize: 32,
//     fontWeight: "bold",
//   },
//   emptyText: {
//     fontSize: 16,
//     color: "gray",
//   },
// });
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#12082A", // Dark purple background from image
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: "center", // Center the title
    borderBottomWidth: 1,
    borderBottomColor: "#2A1B4D", // A slightly lighter border
    backgroundColor:"#30234a",
    top:0,
    height:70,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    alignItems:"center",
    textAlign:"center"
  },
  emptyText: {
    fontSize: 18,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  emptySubText: {
    fontSize: 14,
    color: "#A09BAC",
    marginTop: 8,
  },
});