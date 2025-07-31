// import React from "react";
// import {
//   View,
//   Text,
//   FlatList,
//   TouchableOpacity,
//   StyleSheet,
// } from "react-native";
// import { useNavigation } from "@react-navigation/native";

// const DUMMY_CHATS = [
//   { id: "1", name: "Alice" },
//   { id: "2", name: "Bob" },
//   { id: "3", name: "Charlie" },
// ];

// export default function AllChatsScreen() {
//   const navigation = useNavigation<any>();

//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={DUMMY_CHATS}
//         keyExtractor={(item) => item.id}
//         renderItem={({ item }) => (
//           <TouchableOpacity
//             style={styles.chatItem}
//             onPress={() => navigation.navigate("Chat", { user: item })}
//           >
//             <Text style={styles.chatName}>{item.name}</Text>
//           </TouchableOpacity>
//         )}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#fff", padding: 16 },
//   chatItem: {
//     padding: 16,
//     borderBottomColor: "#ccc",
//     borderBottomWidth: 1,
//   },
//   chatName: {
//     fontSize: 16,
//     fontWeight: "bold",
//   },
// });

// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   FlatList,
//   TouchableOpacity,
//   StyleSheet,
//   Image,
//   ActivityIndicator,
//   Alert,
// } from "react-native";
// import { useNavigation, useIsFocused } from "@react-navigation/native";
// import { useAuth } from "../contexts/AuthContext"; // Your auth context
// import { supabase } from "../lib/supabase"; // Your supabase client

// // Define a type for the contact data we expect from Supabase
// interface Contact {
//   ContactID: string;
//   Nickname: string;
//   ContactUser: {
//     UserID: string;
//     Username: string;
//     ProfilePicture: string | null;
//   };
// }

// export default function AllChatsScreen() {
//   const navigation = useNavigation<any>();
//   const { session } = useAuth();
//   const isFocused = useIsFocused(); // Hook to check if the screen is focused

//   const [contacts, setContacts] = useState<Contact[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Fetch contacts whenever the screen is focused and a session exists
//     if (isFocused && session) {
//       fetchContacts();
//     }
//   }, [isFocused, session]);

//   const fetchContacts = async () => {
//     if (!session?.user) return;

//     setLoading(true);
//     try {
//       // This query now explicitly tells Supabase to join using the 'ContactUserID' foreign key.
//       const { data, error } = await supabase
//         .from("Contacts")
//         .select(
//           `
//           contactid,
//           nickname,
//           ContactUser:contactuserid (
//             userid,
//             username,
//             profilepicture
//           )
//         `
//         )
//         .eq("userid", session.user.id);

//       if (error) {
//         throw error;
//       }

//       if (data) {
//         // The Supabase client infers a one-to-many relationship, returning ContactUser as an array.
//         // We cast to `any` to bypass the initial incorrect type and then safely transform the data
//         // into the shape our component expects (a single ContactUser object).
//         const formattedContacts = (data as any[])
//           .map((contact) => ({
//             ...contact,
//             ContactUser: contact.ContactUser[0], // Take the first (and only) user from the array
//           }))
//           .filter((contact) => contact.ContactUser); // Ensure the contact user exists after mapping

//         setContacts(formattedContacts);
//       }
//     } catch (error: any) {
//       Alert.alert("Error", "Failed to fetch contacts: " + error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <View style={styles.centered}>
//         <ActivityIndicator size="large" color="#4a90e2" />
//       </View>
//     );
//   }

//   if (contacts.length === 0) {
//     return (
//       <View style={styles.centered}>
//         <Text style={styles.emptyText}>No contacts found.</Text>
//         <Text style={styles.emptySubText}>Add contacts to start chatting.</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={contacts}
//         keyExtractor={(item) => item.ContactID}
//         renderItem={({ item }) => (
//           <TouchableOpacity
//             style={styles.chatItem}
//             onPress={() =>
//               navigation.navigate("Chat", {
//                 // Pass the contact's user details to the chat screen
//                 contactId: item.ContactUser.UserID,
//                 contactName: item.Nickname || item.ContactUser.Username,
//                 contactProfilePicture: item.ContactUser.ProfilePicture,
//               })
//             }
//           >
//             <Image
//               source={
//                 item.ContactUser.ProfilePicture
//                   ? { uri: item.ContactUser.ProfilePicture }
//                   : require("../assets/chatapp.webp") // A default placeholder image
//               }
//               style={styles.avatar}
//             />
//             <View style={styles.chatInfo}>
//               <Text style={styles.chatName}>
//                 {item.Nickname || item.ContactUser.Username}
//               </Text>
//               <Text style={styles.lastMessage}>Tap to start chatting...</Text>
//             </View>
//           </TouchableOpacity>
//         )}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//   },
//   centered: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 20,
//   },
//   emptyText: {
//     fontSize: 18,
//     fontWeight: "600",
//     color: "#333",
//   },
//   emptySubText: {
//     fontSize: 14,
//     color: "#888",
//     marginTop: 8,
//   },
//   chatItem: {
//     flexDirection: "row",
//     alignItems: "center",
//     padding: 16,
//     borderBottomColor: "#f0f0f0",
//     borderBottomWidth: 1,
//   },
//   avatar: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     marginRight: 16,
//   },
//   chatInfo: {
//     flex: 1,
//   },
//   chatName: {
//     fontSize: 16,
//     fontWeight: "bold",
//     color: "#333",
//   },
//   lastMessage: {
//     fontSize: 14,
//     color: "#666",
//     marginTop: 4,
//   },
// });






// import React from "react";
// import {
//   View,
//   Text,
//   FlatList,
//   TouchableOpacity,
//   StyleSheet,
//   Image,
//   SafeAreaView,
// } from "react-native";
// import { useNavigation } from "@react-navigation/native";

// // Dummy data to match the design in the image
// const DUMMY_CHATS = [
//   {
//     id: "1",
//     name: "Alice",
//     age: 18,
//     lastMessage: "Kinda nothing, just playing Fortnite...",
//     timestamp: "Now",
//     avatarUrl: "https://placehold.co/100x100/EEDCFF/3D2C42?text=A",
//     isOnline: true,
//     unreadCount: 1,
//   },
//   {
//     id: "2",
//     name: "Male",
//     age: 21,
//     lastMessage: "typing...",
//     timestamp: "2 min",
//     avatarUrl: "https://placehold.co/100x100/FFD6A5/4B3F38?text=M",
//     isOnline: false,
//     unreadCount: 0,
//   },
//   {
//     id: "3",
//     name: "Craig",
//     age: 22,
//     lastMessage: "hyd",
//     timestamp: "12:54 PM",
//     avatarUrl: "https://placehold.co/100x100/D4E2D4/3A4F41?text=C",
//     isOnline: false,
//     unreadCount: 0,
//   },
//   {
//     id: "4",
//     name: "Jonelle",
//     age: 19,
//     lastMessage: "Photo",
//     timestamp: "Yest.",
//     avatarUrl: "https://placehold.co/100x100/FFC0CB/4D3B3E?text=J",
//     isOnline: false,
//     unreadCount: 1,
//   },
//   {
//     id: "5",
//     name: "Madelyn",
//     age: 25,
//     lastMessage: "Don't mess with me",
//     timestamp: "Nov 1",
//     avatarUrl: "https://placehold.co/100x100/B9F2D8/314A40?text=M",
//     isOnline: false,
//     unreadCount: 0,
//   },
// ];

// export default function AllChatsScreen() {
//   const navigation = useNavigation<any>();

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.headerTitle}>Chats</Text>
//       </View>
//       <FlatList
//         data={DUMMY_CHATS}
//         keyExtractor={(item) => item.id}
//         renderItem={({ item }) => (
//           <TouchableOpacity
//             style={styles.chatItem}
//             onPress={() =>
//               navigation.navigate("Chat", {
//                 contactId: item.id,
//                 contactName: item.name,
//               })
//             }
//           >
//             <View style={styles.avatarContainer}>
//               <Image source={{ uri: item.avatarUrl }} style={styles.avatar} />
//               {item.isOnline && <View style={styles.onlineIndicator} />}
//             </View>
//             <View style={styles.chatInfo}>
//               <View style={styles.nameRow}>
//                 <Text style={styles.chatName}>{item.name},</Text>
//                 <Text style={styles.chatAge}>{item.age}</Text>
//               </View>
//               <Text
//                 style={[
//                   styles.lastMessage,
//                   item.lastMessage === "typing..." && styles.typingText,
//                 ]}
//                 numberOfLines={1}
//               >
//                 {item.lastMessage}
//               </Text>
//             </View>
//             <View style={styles.metaInfo}>
//               <Text style={styles.timestamp}>{item.timestamp}</Text>
//               {item.unreadCount > 0 && (
//                 <View style={styles.unreadBadge}>
//                   <Text style={styles.unreadBadgeText}>{item.unreadCount}</Text>
//                 </View>
//               )}
//             </View>
//           </TouchableOpacity>
//         )}
//       />
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#12082A", // Dark purple background
//   },
//   header: {
//     padding: 16,
//     alignItems: "center",
//     color: "#FFFFFF",
//     backgroundColor: "#1F1A3D", // Slightly lighter purple for header
//     marginTop: 5,
//   },
//   headerTitle: {
//     fontSize: 20,
//     fontWeight: "bold",
//     color: "#FFFFFF",
//   },
//   chatItem: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//   },
//   avatarContainer: {
//     position: "relative",
//   },
//   avatar: {
//     width: 54,
//     height: 54,
//     borderRadius: 27,
//   },
//   onlineIndicator: {
//     width: 14,
//     height: 14,
//     borderRadius: 7,
//     backgroundColor: "#34C759", // Bright green
//     position: "absolute",
//     top: 0,
//     left: 0,
//     borderWidth: 2,
//     borderColor: "#12082A",
//   },
//   chatInfo: {
//     flex: 1,
//     marginLeft: 12,
//   },
//   nameRow: {
//     flexDirection: "row",
//     alignItems: "baseline",
//   },
//   chatName: {
//     fontSize: 17,
//     fontWeight: "600",
//     color: "#FFFFFF",
//   },
//   chatAge: {
//     fontSize: 17,
//     color: "#FFFFFF",
//     marginLeft: 4,
//   },
//   lastMessage: {
//     fontSize: 15,
//     color: "#A09BAC", // Light gray for message
//     marginTop: 4,
//   },
//   typingText: {
//     color: "#4A90E2", // Blue for 'typing...'
//     fontStyle: "italic",
//   },
//   metaInfo: {
//     alignItems: "flex-end",
//   },
//   timestamp: {
//     fontSize: 13,
//     color: "#A09BAC",
//     marginBottom: 8,
//   },
//   unreadBadge: {
//     backgroundColor: "#4A90E2", // Blue badge
//     width: 20,
//     height: 20,
//     borderRadius: 10,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   unreadBadgeText: {
//     color: "#FFFFFF",
//     fontSize: 12,
//     fontWeight: "bold",
//   },
// });




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
import { getContacts } from "../lib/api"; // Import from your new api file
import ChatListItem from "../components/ChatListItem"; // Import the new component

// Define an interface for the contact object
interface Contact {
  contactid: string;
  userid: string;
  contactuserid: string;
  nickname: string | null;
  blocked: boolean;
}

export default function AllChatsScreen() {
  const { session } = useAuth();
  const isFocused = useIsFocused();
  // Provide the Contact type to the useState hook
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isFocused && session) {
      const fetchUserContacts = async () => {
        setLoading(true);
        const userContacts = await getContacts();
        setContacts(userContacts);
        setLoading(false);
      };
      fetchUserContacts();
    }
  }, [isFocused, session]);

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#FFFFFF" />
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
        keyExtractor={(item) => item.contactid}
        renderItem={({ item }) => <ChatListItem contact={item} />}
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text style={styles.emptyText}>No Chats Found</Text>
            <Text style={styles.emptySubText}>
              Add contacts to see them here.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#12082A", // Dark purple background
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    padding: 16,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
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
