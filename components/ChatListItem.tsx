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

// Type for the userData state
type User = {
  UserID: string; // UUID
  PhoneNumber: string;
  Username: string;
  ProfilePicture?: string; // Optional
  Status?: string; // Optional
  LastSeen?: string; // Optional, timestamp
};

type ChatListItemProps = {
  contact: Contact;
};

// export default function ChatListItem({ contact }) {
//   const navigation = useNavigation();
//   const [userData, setUserData] = useState(null);

//   useEffect(() => {
//     const fetchUserData = async () => {
//       if (!contact?.contactuserid) return;
//       try {
//         const data = await getUserById(contact.contactuserid);
//         setUserData(data);
//       } catch (error) {
//         console.error("Error fetching user data in ChatListItem:", error);
//       }
//     };
//     fetchUserData();
//   }, [contact]);

//   return (
//     <TouchableOpacity
//       style={styles.mainView}
//       onPress={() => {
//         navigation.navigate("Chat", { userId: contact.contactuserid });
//       }}
//     >
//       <Image
//         source={{
//           uri:
//             userData?.profilepicture ||
//             "https://placehold.co/100x100/EEDCFF/3D2C42?text=A", // Fallback
//         }}
//         style={styles.avatar}
//       />
//       <View style={styles.textContainer}>
//         <Text style={styles.username}>
//           {contact.nickname || userData?.username}
//         </Text>
//         <Text style={styles.lastMessage} numberOfLines={1} ellipsizeMode="tail">
//           Lorem ipsum dolor sit amet...
//         </Text>
//       </View>
//     </TouchableOpacity>
//   );
// }

// const styles = StyleSheet.create({
//   mainView: {
//     width: "100%",
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 12.5,
//     paddingVertical: 8,
//   },
//   avatar: {
//     borderRadius: 50,
//     width: 56,
//     height: 56,
//   },
//   textContainer: {
//     flex: 1,
//     overflow: "hidden",
//     gap: 1.5,
//   },
//   username: {
//     fontWeight: "600",
//     fontSize: 16,
//   },
//   lastMessage: {
//     color: "gray",
//   },
// });

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
        navigation.navigate("Chat", { userId: contact.ContactUserID }); // Type-safe navigation
      }}
    >
      <Image
        source={{
          uri:
            userData?.ProfilePicture ||
            "https://placehold.co/100x100/EEDCFF/3D2C42?text=A",
        }}
        style={styles.avatar}
      />
      <View style={styles.textContainer}>
        <Text style={styles.username}>
          {contact.Nickname || userData?.Username || "Unknown"}
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
    gap: 12.5,
    paddingVertical: 8,
  },
  avatar: {
    borderRadius: 50,
    width: 56,
    height: 56,
  },
  textContainer: {
    flex: 1,
    overflow: "hidden",
    gap: 1.5,
  },
  username: {
    fontWeight: "600",
    fontSize: 16,
    color: "#3D2C42", // Dark color for better contrast
  },
  lastMessage: {
    color: "gray",
  },
});
