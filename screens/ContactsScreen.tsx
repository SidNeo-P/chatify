import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  Text,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from "react-native";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";

interface Contact {
  ContactID: string;
  Nickname: string;
  Blocked: boolean;
}

export default function ContactsScreen() {
  const { session, loading: authLoading } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session || !session.user) return;

    const fetchContacts = async () => {
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

  if (contacts.length === 0) {
    return (
      <View style={styles.center}>
        <Text>No contacts found.</Text>
      </View>
    );
  }

  return (
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
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  contactCard: {
    padding: 16,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  contactName: {
    fontSize: 16,
    fontWeight: "600",
  },
  contactStatus: {
    color: "#888",
    marginTop: 4,
  },
});
