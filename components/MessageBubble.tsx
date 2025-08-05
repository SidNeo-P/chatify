// import React from "react";
// import { View, Text, StyleSheet } from "react-native";
// import { PanGestureHandler } from "react-native-gesture-handler";
// import Animated, {
//   useAnimatedGestureHandler,
//   useSharedValue,
//   useAnimatedStyle,
//   withSpring,
//   interpolate,
// } from "react-native-reanimated";

// // The Message type definition remains the same.
// type Message = {
//   messageid: string;
//   senderid: string;
//   receiverid: string;
//   content: string;
//   timestamp: string;
// };

// // Define the props interface for our component
// interface MessageBubbleProps {
//   message: Message;
//   currentUserId: string | undefined;
// }

// // A helper function to format the timestamp into a readable time
// const formatTime = (timestamp: string) => {
//   if (!timestamp) return "";
//   try {
//     const date = new Date(timestamp);

//     // Convert UTC to IST manually (UTC + 5 hours 30 minutes)
//     const istOffsetMs = 5.5 * 60 * 60 * 1000;
//     const istDate = new Date(date.getTime() + istOffsetMs);

//     return istDate.toLocaleTimeString("en-IN", {
//       hour: "numeric",
//       minute: "2-digit",
//       hour12: true,
//     });
//   } catch (error) {
//     console.error("Error formatting date:", error);
//     return "";
//   }
// };
// // Define how far the user can swipe
// const SWIPE_THRESHOLD = -70; // For my messages (swipe left)
// const SWIPE_THRESHOLD_THEIR = 70; // For their messages (swipe right)

// const MessageBubble: React.FC<MessageBubbleProps> = ({
//   message,
//   currentUserId,
// }) => {
//   const isMyMessage = message.senderid === currentUserId;
//   const translateX = useSharedValue(0);

//   // Gesture handler to manage the swipe animation
//   const gestureHandler = useAnimatedGestureHandler({
//     onStart: (_, ctx: any) => {
//       ctx.startX = translateX.value;
//     },
//     onActive: (event, ctx: any) => {
//       const value = ctx.startX + event.translationX;
//       // Clamp the swipe distance based on who sent the message
//       if (isMyMessage) {
//         translateX.value = Math.max(SWIPE_THRESHOLD, Math.min(0, value));
//       } else {
//         translateX.value = Math.min(SWIPE_THRESHOLD_THEIR, Math.max(0, value));
//       }
//     },
//     onEnd: () => {
//       // Snap back to the original position with a spring animation
//       translateX.value = withSpring(0);
//     },
//   });

//   // Animated style for the message bubble itself
//   const animatedBubbleStyle = useAnimatedStyle(() => {
//     return {
//       transform: [{ translateX: translateX.value }],
//     };
//   });

//   // Animated style for the timestamp to fade it in as it's revealed
//   const animatedTimestampStyle = useAnimatedStyle(() => {
//     const opacity = interpolate(
//       Math.abs(translateX.value),
//       [0, Math.abs(isMyMessage ? SWIPE_THRESHOLD : SWIPE_THRESHOLD_THEIR)],
//       [0, 1]
//     );
//     return { opacity };
//   });

//   const formattedTimestamp = formatTime(message.timestamp);

//   return (
//     <View style={styles.container}>
//       <View
//         style={[
//           styles.messageContainer,
//           isMyMessage
//             ? styles.myMessageContainer
//             : styles.theirMessageContainer,
//         ]}
//       >
//         <PanGestureHandler onGestureEvent={gestureHandler}>
//           <Animated.View style={animatedBubbleStyle}>
//             <View
//               style={[
//                 styles.messageBubble,
//                 isMyMessage
//                   ? styles.myMessageBubble
//                   : styles.theirMessageBubble,
//               ]}
//             >
//               <Text
//                 style={
//                   isMyMessage ? styles.myMessageText : styles.theirMessageText
//                 }
//               >
//                 {message.content}
//               </Text>
//             </View>
//           </Animated.View>
//         </PanGestureHandler>

//         {/* Timestamp positioned behind the message bubble */}
//         <Animated.Text
//           style={[
//             styles.timestamp,
//             animatedTimestampStyle,
//             isMyMessage ? styles.myTimestamp : styles.theirTimestamp,
//           ]}
//         >
//           {formattedTimestamp}
//         </Animated.Text>
//       </View>
//     </View>
//   );
// };

// // Updated styles for Instagram-like alignment
// const styles = StyleSheet.create({
//   container: {
//     marginVertical: 4,
//     width: "100%",
//   },
//   messageContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     width: "100%",
//     position: "relative",
//   },
//   myMessageContainer: {
//     justifyContent: "flex-end",
//     paddingRight: 8, // Small padding from screen edge
//   },
//   theirMessageContainer: {
//     justifyContent: "flex-start",
//     paddingLeft: 8, // Small padding from screen edge
//   },
//   messageBubble: {
//     paddingHorizontal: 16,
//     paddingVertical: 10,
//     borderRadius: 20,
//     maxWidth: 250, // Set a max width for bubbles
//   },
//   myMessageBubble: {
//     backgroundColor: "#FF6B9D",
//   },
//   theirMessageBubble: {
//     backgroundColor: "#2A2A2A",
//   },
//   myMessageText: {
//     color: "#FFFFFF",
//     fontSize: 16,
//   },
//   theirMessageText: {
//     color: "#FFFFFF",
//     fontSize: 16,
//   },
//   timestamp: {
//     color: "#A09BAC",
//     fontSize: 12,
//     position: "absolute",
//     alignSelf: "center",
//   },
//   myTimestamp: {
//     right: 8, // Same position as message bubble
//   },
//   theirTimestamp: {
//     left: 8, // Same position as message bubble
//   },
// });

// export default MessageBubble;

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Image,
} from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useAnimatedGestureHandler,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
} from "react-native-reanimated";

// The Message type definition updated to include mediaurl
type Message = {
  messageid: string;
  senderid: string;
  receiverid: string;
  content?: string;
  mediaurl?: string;
  timestamp: string;
  status?: string;
};

// Define the props interface for our component
interface MessageBubbleProps {
  message: Message;
  currentUserId: string | undefined;
}

// A helper function to format the timestamp into a readable time
const formatTime = (timestamp: string) => {
  if (!timestamp) return "";
  try {
    const date = new Date(timestamp);
    // Using current locale (India Standard Time) to format
    return date.toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "";
  }
};

// Helper function to determine if URL is an image
const isImageUrl = (url: string) => {
  const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp"];
  return imageExtensions.some((ext) => url.toLowerCase().includes(ext));
};

// Helper function to get file name from URL or content
const getFileName = (message: Message) => {
  if (message.content) return message.content;
  if (message.mediaurl) {
    const parts = message.mediaurl.split("/");
    return parts[parts.length - 1];
  }
  return "Unknown file";
};

// Define how far the user can swipe
const SWIPE_THRESHOLD = -70; // For my messages (swipe left)
const SWIPE_THRESHOLD_THEIR = 70; // For their messages (swipe right)

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  currentUserId,
}) => {
  const isMyMessage = message.senderid === currentUserId;
  const translateX = useSharedValue(0);
  const hasMedia = !!message.mediaurl;
  const isImage = hasMedia && isImageUrl(message.mediaurl!);

  // Gesture handler to manage the swipe animation
  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx: any) => {
      ctx.startX = translateX.value;
    },
    onActive: (event, ctx: any) => {
      const value = ctx.startX + event.translationX;
      // Clamp the swipe distance based on who sent the message
      if (isMyMessage) {
        translateX.value = Math.max(SWIPE_THRESHOLD, Math.min(0, value));
      } else {
        translateX.value = Math.min(SWIPE_THRESHOLD_THEIR, Math.max(0, value));
      }
    },
    onEnd: () => {
      // Snap back to the original position with a spring animation
      translateX.value = withSpring(0);
    },
  });

  // Animated style for the message bubble itself
  const animatedBubbleStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  // Animated style for the timestamp to fade it in as it's revealed
  const animatedTimestampStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      Math.abs(translateX.value),
      [0, Math.abs(isMyMessage ? SWIPE_THRESHOLD : SWIPE_THRESHOLD_THEIR)],
      [0, 1]
    );
    return { opacity };
  });

  const formattedTimestamp = formatTime(message.timestamp);

  // Handle file download/open
  const handleFilePress = async () => {
    if (message.mediaurl) {
      try {
        await Linking.openURL(message.mediaurl);
      } catch (error) {
        console.error("Error opening file:", error);
      }
    }
  };

  const renderMessageContent = () => {
    if (hasMedia) {
      if (isImage) {
        return (
          <TouchableOpacity onPress={handleFilePress}>
            <Image
              source={{ uri: message.mediaurl }}
              style={styles.imageMessage}
              resizeMode="cover"
            />
          </TouchableOpacity>
        );
      } else {
        // File attachment
        return (
          <TouchableOpacity
            style={styles.fileContainer}
            onPress={handleFilePress}
          >
            <Ionicons
              name="document-attach"
              size={24}
              color={isMyMessage ? "#FFFFFF" : "#FFFFFF"}
            />
            <View style={styles.fileInfo}>
              <Text
                style={[
                  isMyMessage ? styles.myMessageText : styles.theirMessageText,
                  styles.fileName,
                ]}
                numberOfLines={1}
              >
                {getFileName(message)}
              </Text>
              <Text style={styles.fileSubtext}>Tap to open</Text>
            </View>
          </TouchableOpacity>
        );
      }
    } else {
      // Regular text message
      return (
        <Text
          style={isMyMessage ? styles.myMessageText : styles.theirMessageText}
        >
          {message.content}
        </Text>
      );
    }
  };

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.messageContainer,
          isMyMessage
            ? styles.myMessageContainer
            : styles.theirMessageContainer,
        ]}
      >
        <PanGestureHandler onGestureEvent={gestureHandler}>
          <Animated.View style={animatedBubbleStyle}>
            <View
              style={[
                styles.messageBubble,
                isMyMessage
                  ? styles.myMessageBubble
                  : styles.theirMessageBubble,
                hasMedia && styles.mediaBubble,
              ]}
            >
              {renderMessageContent()}
            </View>
          </Animated.View>
        </PanGestureHandler>

        {/* Timestamp positioned behind the message bubble */}
        <Animated.Text
          style={[
            styles.timestamp,
            animatedTimestampStyle,
            isMyMessage ? styles.myTimestamp : styles.theirTimestamp,
          ]}
        >
          {formattedTimestamp}
        </Animated.Text>
      </View>
    </View>
  );
};

// Updated styles for media support
const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    width: "100%",
  },
  messageContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    position: "relative",
  },
  myMessageContainer: {
    justifyContent: "flex-end",
    paddingRight: 8, // Small padding from screen edge
  },
  theirMessageContainer: {
    justifyContent: "flex-start",
    paddingLeft: 8, // Small padding from screen edge
  },
  messageBubble: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    maxWidth: 250, // Set a max width for bubbles
  },
  mediaBubble: {
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  myMessageBubble: {
    backgroundColor: "#FF6B9D",
  },
  theirMessageBubble: {
    backgroundColor: "#2A2A2A",
  },
  myMessageText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  theirMessageText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  timestamp: {
    color: "#A09BAC",
    fontSize: 12,
    position: "absolute",
    alignSelf: "center",
  },
  myTimestamp: {
    right: 8, // Same position as message bubble
  },
  theirTimestamp: {
    left: 8, // Same position as message bubble
  },
  imageMessage: {
    width: 200,
    height: 150,
    borderRadius: 16,
  },
  fileContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    minWidth: 200,
  },
  fileInfo: {
    marginLeft: 12,
    flex: 1,
  },
  fileName: {
    fontWeight: "600",
    marginBottom: 2,
  },
  fileSubtext: {
    color: "#A09BAC",
    fontSize: 12,
  },
});

export default MessageBubble;
