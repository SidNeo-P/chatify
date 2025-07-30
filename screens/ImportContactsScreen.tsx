import React, { useState } from "react";
import { View, Text, Button, ActivityIndicator, Alert } from "react-native";
import { getDeviceContacts, uploadContactsToSupabase } from "../lib/contacts";
import { useAuth } from "../contexts/AuthContext"; // using your context

export default function ImportContactsScreen() {
  const [loading, setLoading] = useState(false);
  const { session, loading: authLoading } = useAuth();

  const handleImport = async () => {
    try {
      if (!session) {
        Alert.alert("Authentication Error", "User is not logged in.");
        return;
      }

      setLoading(true);
      const contacts = await getDeviceContacts();
      await uploadContactsToSupabase(contacts, session);
      Alert.alert("Success", "Contacts uploaded successfully!");
    } catch (err: any) {
      Alert.alert("Error", err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 16 }}>
        Import Your Contacts
      </Text>
      <Button
        title="Import Contacts"
        onPress={handleImport}
        disabled={loading}
      />
      {loading && <ActivityIndicator style={{ marginTop: 16 }} />}
    </View>
  );
}
