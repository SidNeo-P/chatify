// chatify/screens/ContactsScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  Text,
  ActivityIndicator,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParamList } from "../types/Alltypes";
import Ionicons from "react-native-vector-icons/Ionicons";

type ContactsScreenNavigationProp = NativeStackNavigationProp<StackParamList>;

interface Contact {
  ContactID: string;
  Nickname: string;
  Blocked: boolean;
}

export default function ContactsScreen() {
  const { session, loading: authLoading } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<ContactsScreenNavigationProp>();

  useEffect(() => {
    if (!session || !session.user) return;

    const fetchContacts = async () => {
      // ... your existing fetch logic ...
      setLoading(true);
      const { data, error } = await supabase
        .from("Contacts")
        .select("ContactID, Nickname, Blocked")
        .eq("UserID", session.user.id);

      if (error) {
        console.error("Error fetching contacts:", error);
        Alert.alert("Error", "Failed to fetch contacts.");
      } else {
        setContacts(data || []);
      }
      setLoading(false);
    };

    fetchContacts();
  }, [session]);

  if (authLoading || loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!session || !session.user) {
    return (
      <View style={styles.center}>
        <Text>Please sign in to view contacts.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {contacts.length === 0 ? (
        <View style={styles.center}>
          <Text>No contacts found. Press '+' to add one.</Text>
        </View>
      ) : (
        <FlatList
          data={contacts}
          keyExtractor={(item) => item.ContactID}
          renderItem={({ item }) => (
            <View style={styles.contactCard}>
              <Text style={styles.contactName}>{item.Nickname}</Text>
              <Text style={styles.contactStatus}>
                {item.Blocked ? "Blocked" : "Active"}
              </Text>
            </View>
          )}
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("ImportContacts")}
      >
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  contactCard: {
    padding: 16,
    borderBottomWidth: 1,
    borderColor: "#eee", // A lighter border color
  },
  contactName: {
    fontSize: 16,
    fontWeight: "600",
  },
  contactStatus: {
    color: "#888",
    marginTop: 4,
  },
  // ✅ Styles for the FAB
  fab: {
    top: 20,
    position: "absolute",
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    right: 20,
    bottom: 20, // Adjust this value to position it above your tab bar
    backgroundColor: "#30234a", // Using the same purple from the nav bar
    borderRadius: 28,
    elevation: 8, // Shadow for Android
    shadowColor: "#000", // Shadow for iOS
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowOffset: { height: 5, width: 0 },
  },
});
