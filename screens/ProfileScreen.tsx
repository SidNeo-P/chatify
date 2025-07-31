// //
// import React from "react";
// import { View, Text, StyleSheet } from "react-native"; // ✅ Import StyleSheet
// // ❌ No longer need Button, useNavigation, or navigation types

// export default function ProfileScreen() {
//   // ❌ The navigation hook and button have been removed.
//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Your Profile</Text>
//       {/* You can add other profile details here */}
//     </View>
//   );
// }

// // ✅ Added some basic styles for the screen
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: "bold",
//   },
// });

import React from "react";
import { View, Text, StyleSheet, Button, Alert } from "react-native";
import { supabase } from "../lib/supabase"; // 1. Import your Supabase client

export default function ProfileScreen() {
  // 2. Create the function to handle signing out
  async function handleSignOut() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      Alert.alert("Error Signing Out", error.message);
    }
    // After sign-out, your app's main navigation logic should automatically
    // detect that there is no session and redirect to the Auth screen.
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Profile</Text>

      {/* 3. Add the Button to the screen */}
      <View style={styles.buttonContainer}>
        <Button
          title="Logout"
          onPress={handleSignOut}
          color="#e74c3c" // A red color for the logout button
        />
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
