// import React from "react";
// import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
// import { useNavigation } from "@react-navigation/native";
// import { Ionicons } from "@expo/vector-icons";
// import { useSafeAreaInsets } from "react-native-safe-area-context";

// interface ChatHeaderProps {
//   username: string;
// }

// export default function ChatHeader({ username }: ChatHeaderProps) {
//   const navigation = useNavigation();
//   const insets = useSafeAreaInsets();

//   const handleGoBack = () => {
//     navigation.goBack();
//   };

//   return (
//     <View style={[styles.header, { paddingTop: insets.top }]}>
//       <View style={styles.headerLeft}>
//         <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
//           <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
//         </TouchableOpacity>
//         <View style={styles.profileInfo}>
//           <View style={styles.profileImage} />
//           <View style={styles.nameContainer}>
//             <Text style={styles.contactName}>{username || "Unknown"}</Text>
//           </View>
//         </View>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     backgroundColor: "#1F1A3D",
//     zIndex: 1,
//   },
//   headerLeft: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   backButton: {
//     marginRight: 12,
//     padding: 4,
//   },
//   profileInfo: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   profileImage: {
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     backgroundColor: "#4A90E2",
//     marginRight: 8,
//   },
//   nameContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   contactName: {
//     color: "#FFFFFF",
//     fontSize: 16,
//     fontWeight: "600",
//     marginRight: 4,
//   },
// });

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { supabase } from "../lib/supabase";

interface ChatHeaderProps {
  username: string;
  isTyping?: boolean;
  contactId?: string;
}

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

export default function ChatHeader({
  username,
  isTyping = false,
  contactId,
}: ChatHeaderProps) {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [isOnline, setIsOnline] = useState(false);
  const [lastSeen, setLastSeen] = useState<string | null>(null);

  // Check if user is online and get last seen
  useEffect(() => {
    if (!contactId) return;

    const checkOnlineStatus = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("status, lastseen")
        .eq("userid", contactId)
        .single();

      if (error) {
        console.error("Error fetching user status:", error);
        return;
      }

      if (data) {
        setIsOnline(data.status === "online");
        setLastSeen(data.lastseen);
      }
    };

    checkOnlineStatus();

    // Subscribe to real-time status changes
    const channel = supabase
      .channel(`user-status-${contactId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "users",
          filter: `userid=eq.${contactId}`,
        },
        (payload) => {
          const userData = payload.new;
          setIsOnline(userData.status === "online");
          setLastSeen(userData.lastseen);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [contactId]);

  const getStatusText = () => {
    if (isTyping) {
      return null; // Don't show status when typing
    }

    if (isOnline) {
      return "online";
    }

    if (lastSeen) {
      const lastSeenDate = new Date(lastSeen);
      const now = new Date();
      const diffInMinutes = Math.floor(
        (now.getTime() - lastSeenDate.getTime()) / (1000 * 60)
      );

      if (diffInMinutes < 1) {
        return "last seen just now";
      } else if (diffInMinutes < 60) {
        return `last seen ${diffInMinutes} minutes ago`;
      } else if (diffInMinutes < 1440) {
        const hours = Math.floor(diffInMinutes / 60);
        return `last seen ${hours} hour${hours > 1 ? "s" : ""} ago`;
      } else {
        const days = Math.floor(diffInMinutes / 1440);
        return `last seen ${days} day${days > 1 ? "s" : ""} ago`;
      }
    }

    return "offline";
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <View style={[styles.header, { paddingTop: insets.top }]}>
      <View style={styles.headerLeft}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.profileInfo}>
          <View style={styles.profileImage} />
          <View style={styles.nameContainer}>
            <Text style={styles.contactName}>{username || "Unknown"}</Text>
            {isTyping ? (
              <View style={styles.statusContainer}>
                <Text style={styles.typingText}>typing</Text>
                <TypingIndicator />
              </View>
            ) : (
              getStatusText() && (
                <Text style={styles.statusText}>{getStatusText()}</Text>
              )
            )}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#1F1A3D",
    zIndex: 1,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  profileInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#4A90E2",
    marginRight: 8,
  },
  nameContainer: {
    flexDirection: "column",
    justifyContent: "center",
  },
  contactName: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  statusText: {
    color: "#A09BAC",
    fontSize: 12,
    marginTop: 2,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  typingText: {
    color: "#FF6B9D",
    fontSize: 12,
    marginRight: 4,
  },
  typingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  typingDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: "#FF6B9D",
    marginHorizontal: 1,
  },
});
