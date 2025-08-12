// import React, { useEffect, useState } from "react";
// import { Text, View, StyleSheet, Image, TouchableOpacity } from "react-native";
// import { getUserById } from "../lib/api";
// import { useNavigation } from "@react-navigation/native";
// import { NavigationProps } from "../types/Alltypes";

// // Type for the contact prop
// type Contact = {
//   ContactID: string;
//   UserID: string;
//   ContactUserID: string;
//   Nickname?: string;
//   Blocked?: boolean;
// };

// type User = {
//   userid: string; // UUID
//   phonenumber: string;
//   username: string;
//   profilepicture?: string;
//   status?: string;
//   lastseen?: string;
// };

// type ChatListItemProps = {
//   contact: Contact;
// };

// export default function ChatListItem({ contact }: ChatListItemProps) {
//   const navigation = useNavigation<NavigationProps>();
//   const [userData, setUserData] = useState<User | null>(null);

//   useEffect(() => {
//     const fetchUserData = async () => {
//       if (!contact?.ContactUserID) return;
//       try {
//         const data = await getUserById(contact.ContactUserID);
//         console.log("Fetched userData:", data);
//         setUserData(data);
//       } catch (error) {
//         console.error("Error fetching user data in ChatListItem:", error);
//       }
//     };
//     fetchUserData();
//   }, [contact]);
//   console.log("User Data:");

//   return (
//     <TouchableOpacity
//       style={styles.mainView}
//       onPress={() => {
//         navigation.navigate("Chat", {
//           userId: contact.ContactUserID,
//           username: contact.Nickname || userData?.username || "Unknown",
//         });
//       }}
//     >
//       <Image
//         source={
//           userData?.profilepicture
//             ? { uri: userData.profilepicture }
//             : require("../assets/gojoprofile.jpg")
//         }
//         style={styles.avatar}
//       />
//       <View style={styles.textContainer}>
//         <Text style={styles.username}>
//           {contact.Nickname || userData?.username || "Unknown"}
//         </Text>
//         <Text style={styles.lastMessage} numberOfLines={1} ellipsizeMode="tail">
//           hii
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
//     gap: 14,
//     paddingVertical: 8,
//   },
//   avatar: {
//     borderRadius: 50,
//     width: 50,
//     height: 50,
//   },
//   textContainer: {
//     flex: 1,
//     overflow: "hidden",
//     gap: 1.5,
//   },
//   username: {
//     fontWeight: "600",
//     fontSize: 16,
//     color: "#FFFFFF",
//   },
//   lastMessage: {
//     color: "gray",
//   },
// });

import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
} from "react-native";
import { getUserById } from "../lib/api";
import { useNavigation } from "@react-navigation/native";
import { NavigationProps } from "../types/Alltypes";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";

// Type for the contact prop
type Contact = {
  ContactID: string;
  UserID: string;
  ContactUserID: string;
  Nickname?: string;
  Blocked?: boolean;
};

type User = {
  userid: string; // UUID
  phonenumber: string;
  username: string;
  profilepicture?: string;
  status?: string;
  lastseen?: string;
};

type ChatListItemProps = {
  contact: Contact;
};

const TypingIndicator = () => {
  const dot1 = new Animated.Value(0);
  const dot2 = new Animated.Value(0);
  const dot3 = new Animated.Value(0);

  useEffect(() => {
    const animate = () => {
      const animation = Animated.sequence([
        Animated.timing(dot1, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(dot2, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(dot3, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(dot1, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(dot2, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(dot3, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]);

      Animated.loop(animation).start();
    };

    animate();
  }, []);

  return (
    <View style={styles.typingContainer}>
      <Text style={styles.typingText}>typing</Text>
      <Animated.View
        style={[
          styles.typingDot,
          {
            opacity: dot1,
            transform: [
              {
                scale: dot1.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1.2],
                }),
              },
            ],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.typingDot,
          {
            opacity: dot2,
            transform: [
              {
                scale: dot2.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1.2],
                }),
              },
            ],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.typingDot,
          {
            opacity: dot3,
            transform: [
              {
                scale: dot3.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1.2],
                }),
              },
            ],
          },
        ]}
      />
    </View>
  );
};

export default function ChatListItem({ contact }: ChatListItemProps) {
  const navigation = useNavigation<NavigationProps>();
  const { session } = useAuth();
  const [userData, setUserData] = useState<User | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [lastMessage, setLastMessage] = useState("hii");

  const currentUserId = session?.user?.id;

  useEffect(() => {
    const fetchUserData = async () => {
      if (!contact?.ContactUserID) return;
      try {
        const data = await getUserById(contact.ContactUserID);
        console.log("Fetched userData:", data);
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user data in ChatListItem:", error);
      }
    };
    fetchUserData();
  }, [contact]);

  // Subscribe to typing indicator for this specific chat
  useEffect(() => {
    if (!currentUserId || !contact.ContactUserID) return;

    const channelName =
      currentUserId < contact.ContactUserID
        ? `typing-${currentUserId}-${contact.ContactUserID}`
        : `typing-${contact.ContactUserID}-${currentUserId}`;

    const channel = supabase.channel(channelName, {
      config: { broadcast: { self: false } },
    });

    channel.on("broadcast", { event: "typing" }, (payload) => {
      if (payload.senderId === contact.ContactUserID) {
        setIsTyping(payload.isTyping);
      }
    });

    channel.subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUserId, contact.ContactUserID]);

  // Fetch last message for this chat
  useEffect(() => {
    const fetchLastMessage = async () => {
      if (!currentUserId || !contact.ContactUserID) return;

      const { data, error } = await supabase
        .from("messages")
        .select("content, mediaurl, senderid")
        .in("senderid", [currentUserId, contact.ContactUserID])
        .in("receiverid", [currentUserId, contact.ContactUserID])
        .order("timestamp", { ascending: false })
        .limit(1);

      if (error) {
        console.error("Error fetching last message:", error);
        return;
      }

      if (data && data.length > 0) {
        const message = data[0];
        if (message.mediaurl) {
          setLastMessage(
            message.senderid === currentUserId ? "You: 📎 File" : "📎 File"
          );
        } else {
          const content = message.content || "";
          const prefix = message.senderid === currentUserId ? "You: " : "";
          setLastMessage(prefix + content);
        }
      }
    };

    fetchLastMessage();

    // Subscribe to new messages for this chat to update last message
    const channel = supabase
      .channel(`last-message:${currentUserId}:${contact.ContactUserID}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `or(and(senderid.eq.${currentUserId},receiverid.eq.${contact.ContactUserID}),and(senderid.eq.${contact.ContactUserID},receiverid.eq.${currentUserId}))`,
        },
        (payload) => {
          const message = payload.new;
          if (message.mediaurl) {
            setLastMessage(
              message.senderid === currentUserId ? "You: 📎 File" : "📎 File"
            );
          } else {
            const content = message.content || "";
            const prefix = message.senderid === currentUserId ? "You: " : "";
            setLastMessage(prefix + content);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUserId, contact.ContactUserID]);

  console.log("User Data:");

  return (
    <TouchableOpacity
      style={styles.mainView}
      onPress={() => {
        navigation.navigate("Chat", {
          userId: contact.ContactUserID,
          username: contact.Nickname || userData?.username || "Unknown",
        });
      }}
    >
      <Image
        source={
          userData?.profilepicture
            ? { uri: userData.profilepicture }
            : require("../assets/gojoprofile.jpg")
        }
        style={styles.avatar}
      />
      <View style={styles.textContainer}>
        <Text style={styles.username}>
          {contact.Nickname || userData?.username || "Unknown"}
        </Text>
        {isTyping ? (
          <TypingIndicator />
        ) : (
          <Text
            style={styles.lastMessage}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {lastMessage}
          </Text>
        )}
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
    color: "#FFFFFF",
  },
  lastMessage: {
    color: "gray",
  },
  typingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  typingText: {
    color: "#FF6B9D",
    fontSize: 12,
    marginRight: 4,
  },
  typingDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: "#FF6B9D",
    marginHorizontal: 1,
  },
});
