import React from "react";
import { View, Text, StyleSheet, Button, Alert } from "react-native";
import { supabase } from "../lib/supabase";

export default function ProfileScreen() {
  async function handleSignOut() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      Alert.alert("Error Signing Out", error.message);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Profile</Text>

      <View style={styles.buttonContainer}>
        <Button title="Logout" onPress={handleSignOut} color="#e74c3c" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center", // Center items vertically
    alignItems: "center", // Center items horizontally
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 50, // Add space below the title
  },
  buttonContainer: {
    width: "80%", // Set a width for the button container
  },
});
