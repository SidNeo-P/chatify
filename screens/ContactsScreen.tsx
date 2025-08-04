// import React, { useEffect, useState } from "react";
// import {
//   View,
//   FlatList,
//   Text,
//   ActivityIndicator,
//   Alert,
//   StyleSheet,
// } from "react-native";
// import { supabase } from "../lib/supabase";
// import { useAuth } from "../contexts/AuthContext";

// interface Contact {
//   ContactID: string;
//   Nickname: string;
//   Blocked: boolean;
// }

// export default function ContactsScreen() {
//   const { session, loading: authLoading } = useAuth();
//   const [contacts, setContacts] = useState<Contact[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!session || !session.user) return;

//     const fetchContacts = async () => {
//       setLoading(true);
//       const { data, error } = await supabase
//         .from("Contacts")
//         .select("ContactID, Nickname, Blocked")
//         .eq("UserID", session.user.id);

//       if (error) {
//         console.error("Error fetching contacts:", error);
//         Alert.alert("Error", "Failed to fetch contacts.");
//       } else {
//         setContacts(data || []);
//       }

//       setLoading(false);
//     };

//     fetchContacts();
//   }, [session]);

//   if (authLoading || loading) {
//     return (
//       <View style={styles.center}>
//         <ActivityIndicator size="large" />
//       </View>
//     );
//   }

//   if (!session || !session.user) {
//     return (
//       <View style={styles.center}>
//         <Text>Please sign in to view contacts.</Text>
//       </View>
//     );
//   }

//   if (contacts.length === 0) {
//     return (
//       <View style={styles.center}>
//         <Text>No contacts found.</Text>
//       </View>
//     );
//   }

//   return (
//     <FlatList
//       data={contacts}
//       keyExtractor={(item) => item.ContactID}
//       renderItem={({ item }) => (
//         <View style={styles.contactCard}>
//           <Text style={styles.contactName}>{item.Nickname}</Text>
//           <Text style={styles.contactStatus}>
//             {item.Blocked ? "Blocked" : "Active"}
//           </Text>
//         </View>
//       )}
//     />
//   );
// }

// const styles = StyleSheet.create({
//   center: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   contactCard: {
//     padding: 16,
//     borderBottomWidth: 1,
//     borderColor: "#ccc",
//   },
//   contactName: {
//     fontSize: 16,
//     fontWeight: "600",
//   },
//   contactStatus: {
//     color: "#888",
//     marginTop: 4,
//   },
// });

import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  Text,
  ActivityIndicator,
  Alert,
  StyleSheet,
  TouchableOpacity, // ✅ Import TouchableOpacity
} from "react-native";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";
import { useNavigation } from "@react-navigation/native"; // ✅ Import useNavigation
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParamList } from "../types/Alltypes"; // ✅ Import your stack types
import Ionicons from "react-native-vector-icons/Ionicons"; // ✅ Import an icon library

// ✅ Define the navigation prop type for this screen
// ✅ After
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
  const navigation = useNavigation<ContactsScreenNavigationProp>(); // ✅ Get navigation object

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

  // Your loading and empty states remain the same
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

  // ✅ Wrap everything in a container View
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

      {/* ✅ Floating Action Button (FAB) */}
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
  // ✅ Add container style
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
