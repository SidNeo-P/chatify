// import React, { useEffect, useState, useRef } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TextInput,
//   TouchableOpacity,
//   KeyboardAvoidingView,
//   Platform,
//   SafeAreaView,
//   Dimensions,
//   StatusBar,
//   Keyboard,
// } from "react-native";
// import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
// import { StackParamList } from "../types/Alltypes";
// import { useAuth } from "../contexts/AuthContext";
// import { supabase } from "../lib/supabase";
// import { FlashList } from "@shopify/flash-list";
// import { Ionicons } from "@expo/vector-icons";
// import MessageBubble from "../components/MessageBubble";
// import { useSafeAreaInsets } from "react-native-safe-area-context";

// type Message = {
//   messageid: string;
//   senderid: string;
//   receiverid: string;
//   content: string;
//   timestamp: string;
// };

// // const MessageBubble = ({
// //   message,
// //   currentUserId,
// // }: {
// //   message: Message;
// //   currentUserId: string | undefined;
// // }) => {
// //   const isMyMessage = message.senderid === currentUserId;
// //   return (
// //     <View
// //       style={[
// //         styles.messageContainer,
// //         isMyMessage ? styles.myMessageContainer : styles.theirMessageContainer,
// //       ]}
// //     >
// //       <View
// //         style={[
// //           styles.messageBubble,
// //           isMyMessage ? styles.myMessageBubble : styles.theirMessageBubble,
// //         ]}
// //       >
// //         <Text
// //           style={isMyMessage ? styles.myMessageText : styles.theirMessageText}
// //         >
// //           {message.content}
// //         </Text>
// //       </View>
// //     </View>
// //   );
// // };

// export default function ChatScreen() {
//   const route = useRoute<RouteProp<StackParamList, "Chat">>();
//   const navigation = useNavigation();
//   const { userId: contactId, username } = route.params;
//   const { session } = useAuth();
//   const insets = useSafeAreaInsets();

//   const [messages, setMessages] = useState<Message[]>([]);
//   const [text, setText] = useState("");
//   const [keyboardHeight, setKeyboardHeight] = useState(0);
//   const listRef = useRef<FlashList<Message>>(null);
//   const currentUserId = session?.user?.id;

//   // Handle keyboard events
//   useEffect(() => {
//     const keyboardWillShowListener = Keyboard.addListener(
//       Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
//       (e) => {
//         setKeyboardHeight(e.endCoordinates.height);
//       }
//     );

//     const keyboardWillHideListener = Keyboard.addListener(
//       Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
//       () => {
//         setKeyboardHeight(0);
//       }
//     );

//     return () => {
//       keyboardWillShowListener?.remove();
//       keyboardWillHideListener?.remove();
//     };
//   }, []);

//   useEffect(() => {
//     const channel = supabase
//       .channel(`chat:${currentUserId}:${contactId}`)
//       .on(
//         "postgres_changes",
//         {
//           event: "*",
//           schema: "public",
//           table: "messages",
//         },
//         (payload) => {
//           console.log("Message change detected:", payload);

//           switch (payload.eventType) {
//             case "INSERT":
//               setMessages((prev) => [...prev, payload.new as Message]);
//               break;
//             case "UPDATE":
//               setMessages((prev) =>
//                 prev.map((msg) =>
//                   msg.messageid === payload.new.messageid
//                     ? (payload.new as Message)
//                     : msg
//                 )
//               );
//               break;
//             case "DELETE":
//               setMessages((prev) =>
//                 prev.filter((msg) => msg.messageid !== payload.old.messageid)
//               );
//               break;
//           }
//         }
//       )
//       .subscribe();

//     const fetchMessages = async () => {
//       const { data, error } = await supabase
//         .from("messages")
//         .select("*")
//         .in("senderid", [currentUserId, contactId])
//         .in("receiverid", [currentUserId, contactId])
//         .order("timestamp", { ascending: true });

//       if (error) {
//         console.error("Error fetching messages:", error);
//         return;
//       }

//       setMessages(data || []);
//     };

//     fetchMessages();

//     return () => {
//       supabase.removeChannel(channel);
//     };
//   }, [currentUserId, contactId]);

//   useEffect(() => {
//     if (messages.length > 0) {
//       setTimeout(() => {
//         listRef.current?.scrollToEnd({ animated: true });
//       }, 100);
//     }
//   }, [messages]);

//   const handleSend = async () => {
//     if (text.trim().length === 0 || !currentUserId || !contactId) return;

//     const messageToSend = {
//       senderid: currentUserId,
//       receiverid: contactId,
//       content: text.trim(),
//     };

//     const { error } = await supabase.from("messages").insert(messageToSend);

//     if (error) {
//       console.error("Error sending message:", error);
//     } else {
//       setText("");
//     }
//   };

//   const handleGoBack = () => {
//     navigation.goBack();
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="light-content" backgroundColor="#1F1A3D" />

//       {/* Header */}
//       <View style={[styles.header, { paddingTop: insets.top }]}>
//         <View style={styles.headerLeft}>
//           <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
//             <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
//           </TouchableOpacity>
//           <View style={styles.profileInfo}>
//             <View style={styles.profileImage} />
//             <View style={styles.nameContainer}>
//               <Text style={styles.contactName}>{username || "Unknown"}</Text>
//             </View>
//           </View>
//         </View>
//       </View>

//       {/* Main Content */}
//       <View style={styles.mainContent}>
//         {/* Messages List */}
//         <View style={styles.messagesContainer}>
//           {messages.length === 0 ? (
//             <View style={styles.noMessagesContainer}>
//               <Text style={styles.noMessagesText}>No Messages</Text>
//             </View>
//           ) : (
//             <FlashList
//               ref={listRef}
//               contentContainerStyle={styles.listContent}
//               data={messages}
//               renderItem={({ item }) => (
//                 <MessageBubble message={item} currentUserId={currentUserId} />
//               )}
//               keyExtractor={(item) => item.messageid.toString()}
//               showsVerticalScrollIndicator={false}
//               estimatedItemSize={60}
//             />
//           )}
//         </View>

//         {/* Input Bar */}
//         <KeyboardAvoidingView
//           behavior={Platform.OS === "ios" ? "padding" : "height"}
//           keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
//         >
//           <View
//             style={[
//               styles.inputContainer,
//               Platform.OS === "android" &&
//                 keyboardHeight > 0 && {
//                   marginBottom: 0,
//                 },
//             ]}
//           >
//             <TextInput
//               style={styles.input}
//               value={text}
//               onChangeText={setText}
//               placeholder="Type a message..."
//               placeholderTextColor="#A09BAC"
//               multiline={false}
//               returnKeyType="send"
//               onSubmitEditing={handleSend}
//             />
//             <TouchableOpacity
//               style={[
//                 styles.sendButton,
//                 text.trim().length > 0 && styles.sendButtonActive,
//               ]}
//               onPress={handleSend}
//               disabled={text.trim().length === 0}
//             >
//               <Ionicons
//                 name="paper-plane"
//                 size={20}
//                 color={text.trim().length > 0 ? "#FF6B9D" : "#666666"}
//               />
//             </TouchableOpacity>
//           </View>
//         </KeyboardAvoidingView>
//       </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#12082A",
//   },
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
//   mainContent: {
//     flex: 1,
//     backgroundColor: "#12082A",
//   },
//   messagesContainer: {
//     flex: 1,
//     backgroundColor: "#12082A",
//   },
//   messageContainer: {
//     marginVertical: 4,
//     paddingHorizontal: 16,
//   },
//   myMessageContainer: {
//     alignItems: "flex-end",
//   },
//   theirMessageContainer: {
//     alignItems: "flex-start",
//   },
//   messageBubble: {
//     paddingHorizontal: 16,
//     paddingVertical: 10,
//     borderRadius: 20,
//     maxWidth: "75%",
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
//   noMessagesContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#12082A",
//   },
//   noMessagesText: {
//     color: "#A09BAC",
//     fontSize: 16,
//   },
//   listContent: {
//     paddingVertical: 8,
//     backgroundColor: "#12082A",
//   },
//   inputContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     backgroundColor: "#1F1A3D",
//     borderTopWidth: 1,
//     borderTopColor: "#2A2A2A",
//   },
//   input: {
//     flex: 1,
//     height: 40,
//     backgroundColor: "#2A2A2A",
//     borderRadius: 20,
//     paddingHorizontal: 16,
//     color: "#FFFFFF",
//     fontSize: 16,
//   },
//   sendButton: {
//     marginLeft: 12,
//     padding: 8,
//     borderRadius: 20,
//   },
//   sendButtonActive: {
//     backgroundColor: "#FF6B9D20",
//   },
// });

import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Platform,
  SafeAreaView,
  StatusBar,
  Keyboard,
  Dimensions,
} from "react-native";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { StackParamList } from "../types/Alltypes";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";
import { FlashList } from "@shopify/flash-list";
import { Ionicons } from "@expo/vector-icons";
import MessageBubble from "../components/MessageBubble";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Message = {
  messageid: string;
  senderid: string;
  receiverid: string;
  content: string;
  timestamp: string;
};

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function ChatScreen() {
  const route = useRoute<RouteProp<StackParamList, "Chat">>();
  const navigation = useNavigation();
  const { userId: contactId, username } = route.params;
  const { session } = useAuth();
  const insets = useSafeAreaInsets();

  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const listRef = useRef<FlashList<Message>>(null);
  const currentUserId = session?.user?.id;

  // Enhanced keyboard handling
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
        setIsKeyboardVisible(true);
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardHeight(0);
        setIsKeyboardVisible(false);
      }
    );

    const keyboardWillShowListener = Keyboard.addListener(
      "keyboardWillShow",
      (e) => {
        if (Platform.OS === "ios") {
          setKeyboardHeight(e.endCoordinates.height);
          setIsKeyboardVisible(true);
        }
      }
    );

    const keyboardWillHideListener = Keyboard.addListener(
      "keyboardWillHide",
      () => {
        if (Platform.OS === "ios") {
          setKeyboardHeight(0);
          setIsKeyboardVisible(false);
        }
      }
    );

    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
      keyboardWillShowListener?.remove();
      keyboardWillHideListener?.remove();
    };
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel(`chat:${currentUserId}:${contactId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
        },
        (payload) => {
          console.log("Message change detected:", payload);

          switch (payload.eventType) {
            case "INSERT":
              setMessages((prev) => [...prev, payload.new as Message]);
              break;
            case "UPDATE":
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.messageid === payload.new.messageid
                    ? (payload.new as Message)
                    : msg
                )
              );
              break;
            case "DELETE":
              setMessages((prev) =>
                prev.filter((msg) => msg.messageid !== payload.old.messageid)
              );
              break;
          }
        }
      )
      .subscribe();

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .in("senderid", [currentUserId, contactId])
        .in("receiverid", [currentUserId, contactId])
        .order("timestamp", { ascending: true });

      if (error) {
        console.error("Error fetching messages:", error);
        return;
      }

      setMessages(data || []);
    };

    fetchMessages();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUserId, contactId]);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        listRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const handleSend = async () => {
    if (text.trim().length === 0 || !currentUserId || !contactId) return;

    const messageToSend = {
      senderid: currentUserId,
      receiverid: contactId,
      content: text.trim(),
    };

    const { error } = await supabase.from("messages").insert(messageToSend);

    if (error) {
      console.error("Error sending message:", error);
    } else {
      setText("");
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  // Calculate dynamic container height
  const getContainerStyle = () => {
    const baseHeight = SCREEN_HEIGHT - insets.top - insets.bottom;

    if (Platform.OS === "android" && isKeyboardVisible) {
      return {
        ...styles.container,
        height: baseHeight - keyboardHeight,
      };
    }

    return styles.container;
  };

  return (
    <View style={getContainerStyle()}>
      <StatusBar barStyle="light-content" backgroundColor="#1F1A3D" />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.profileInfo}>
            <View style={styles.profileImage} />
            <View style={styles.nameContainer}>
              <Text style={styles.contactName}>{username || "Unknown"}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Messages Container */}
      <View style={styles.messagesContainer}>
        {messages.length === 0 ? (
          <View style={styles.noMessagesContainer}>
            <Text style={styles.noMessagesText}>No Messages</Text>
          </View>
        ) : (
          <FlashList
            ref={listRef}
            contentContainerStyle={styles.listContent}
            data={messages}
            renderItem={({ item }) => (
              <MessageBubble message={item} currentUserId={currentUserId} />
            )}
            keyExtractor={(item) => item.messageid.toString()}
            showsVerticalScrollIndicator={false}
            estimatedItemSize={60}
            keyboardShouldPersistTaps="handled"
          />
        )}
      </View>

      {/* Input Container */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder="Type a message..."
          placeholderTextColor="#A09BAC"
          multiline={false}
          returnKeyType="send"
          onSubmitEditing={handleSend}
          blurOnSubmit={false}
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            text.trim().length > 0 && styles.sendButtonActive,
          ]}
          onPress={handleSend}
          disabled={text.trim().length === 0}
        >
          <Ionicons
            name="paper-plane"
            size={20}
            color={text.trim().length > 0 ? "#FF6B9D" : "#666666"}
          />
        </TouchableOpacity>
      </View>

      {/* Custom Keyboard Spacer for Android */}
      {Platform.OS === "android" && isKeyboardVisible && (
        <View style={{ height: keyboardHeight }} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#12082A",
  },
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
    flexDirection: "row",
    alignItems: "center",
  },
  contactName: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginRight: 4,
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: "#12082A",
  },
  messageContainer: {
    marginVertical: 4,
    paddingHorizontal: 16,
  },
  myMessageContainer: {
    alignItems: "flex-end",
  },
  theirMessageContainer: {
    alignItems: "flex-start",
  },
  messageBubble: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    maxWidth: "75%",
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
  noMessagesContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#12082A",
  },
  noMessagesText: {
    color: "#A09BAC",
    fontSize: 16,
  },
  listContent: {
    paddingVertical: 8,
    backgroundColor: "#12082A",
    paddingBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#1F1A3D",
    borderTopWidth: 1,
    borderTopColor: "#2A2A2A",
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: "#2A2A2A",
    borderRadius: 20,
    paddingHorizontal: 16,
    color: "#FFFFFF",
    fontSize: 16,
  },
  sendButton: {
    marginLeft: 12,
    padding: 8,
    borderRadius: 20,
  },
  sendButtonActive: {
    backgroundColor: "#FF6B9D20",
  },
});

// import React, { useEffect, useState, useRef } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TextInput,
//   TouchableOpacity,
//   KeyboardAvoidingView,
//   Platform,
//   SafeAreaView,
//   Dimensions,
//   StatusBar,
//   Keyboard,
// } from "react-native";
// import { useSafeAreaInsets } from "react-native-safe-area-context";
// import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
// import { StackParamList } from "../types/Alltypes";
// import { useAuth } from "../contexts/AuthContext";
// import { supabase } from "../lib/supabase";
// import { FlashList } from "@shopify/flash-list";
// import { Ionicons } from "@expo/vector-icons";

// type Message = {
//   messageid: string;
//   senderid: string;
//   receiverid: string;
//   content: string;
//   timestamp: string;
// };

// const MessageBubble = ({
//   message,
//   currentUserId,
// }: {
//   message: Message;
//   currentUserId: string | undefined;
// }) => {
//   const isMyMessage = message.senderid === currentUserId;
//   return (
//     <View
//       style={[
//         styles.messageContainer,
//         isMyMessage ? styles.myMessageContainer : styles.theirMessageContainer,
//       ]}
//     >
//       <View
//         style={[
//           styles.messageBubble,
//           isMyMessage ? styles.myMessageBubble : styles.theirMessageBubble,
//         ]}
//       >
//         <Text
//           style={isMyMessage ? styles.myMessageText : styles.theirMessageText}
//         >
//           {message.content}
//         </Text>
//       </View>
//     </View>
//   );
// };

// export default function ChatScreen() {
//   const route = useRoute<RouteProp<StackParamList, "Chat">>();
//   const navigation = useNavigation();
//   const { userId: contactId, username } = route.params;
//   const { session } = useAuth();
// const insets = useSafeAreaInsets();

//   const [messages, setMessages] = useState<Message[]>([]);
//   const [text, setText] = useState("");
//   const [keyboardHeight, setKeyboardHeight] = useState(0);
//   const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
//   const listRef = useRef<FlashList<Message>>(null);
//   const currentUserId = session?.user?.id;

//   // Handle keyboard events
//   useEffect(() => {
//     const keyboardWillShowListener = Keyboard.addListener(
//       Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
//       (e) => {
//         setKeyboardHeight(e.endCoordinates.height);
//         setIsKeyboardVisible(true);
//       }
//     );

//     const keyboardWillHideListener = Keyboard.addListener(
//       Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
//       () => {
//         setKeyboardHeight(0);
//         setIsKeyboardVisible(false);
//       }
//     );

//     return () => {
//       keyboardWillShowListener?.remove();
//       keyboardWillHideListener?.remove();
//     };
//   }, []);

//   useEffect(() => {
//     const channel = supabase
//       .channel(`chat:${currentUserId}:${contactId}`)
//       .on(
//         "postgres_changes",
//         {
//           event: "*",
//           schema: "public",
//           table: "messages",
//         },
//         (payload) => {
//           console.log("Message change detected:", payload);

//           switch (payload.eventType) {
//             case "INSERT":
//               setMessages((prev) => [...prev, payload.new as Message]);
//               break;
//             case "UPDATE":
//               setMessages((prev) =>
//                 prev.map((msg) =>
//                   msg.messageid === payload.new.messageid
//                     ? (payload.new as Message)
//                     : msg
//                 )
//               );
//               break;
//             case "DELETE":
//               setMessages((prev) =>
//                 prev.filter((msg) => msg.messageid !== payload.old.messageid)
//               );
//               break;
//           }
//         }
//       )
//       .subscribe();

//     const fetchMessages = async () => {
//       const { data, error } = await supabase
//         .from("messages")
//         .select("*")
//         .in("senderid", [currentUserId, contactId])
//         .in("receiverid", [currentUserId, contactId])
//         .order("timestamp", { ascending: true });

//       if (error) {
//         console.error("Error fetching messages:", error);
//         return;
//       }

//       setMessages(data || []);
//     };

//     fetchMessages();

//     return () => {
//       supabase.removeChannel(channel);
//     };
//   }, [currentUserId, contactId]);

//   useEffect(() => {
//     if (messages.length > 0) {
//       setTimeout(() => {
//         listRef.current?.scrollToEnd({ animated: true });
//       }, 100);
//     }
//   }, [messages]);

//   const handleSend = async () => {
//     if (text.trim().length === 0 || !currentUserId || !contactId) return;

//     const messageToSend = {
//       senderid: currentUserId,
//       receiverid: contactId,
//       content: text.trim(),
//     };

//     const { error } = await supabase.from("messages").insert(messageToSend);

//     if (error) {
//       console.error("Error sending message:", error);
//     } else {
//       setText("");
//     }
//   };

//   const handleGoBack = () => {
//     navigation.goBack();
//   };

//   return (
//     <View style={styles.container}>
//       <StatusBar
//         barStyle="light-content"
//         backgroundColor="#1F1A3D"
//         translucent
//       />

//       {/* Header with integrated status bar */}
//       <View style={[styles.header, { paddingTop: insets.top }]}>
//         <View style={styles.headerLeft}>
//           <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
//             <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
//           </TouchableOpacity>
//           <View style={styles.profileInfo}>
//             <View style={styles.profileImage} />
//             <View style={styles.nameContainer}>
//               <Text style={styles.contactName}>{username || "Unknown"}</Text>
//             </View>
//           </View>
//         </View>
//       </View>

//       {/* KeyboardAvoidingView wrapping the entire content */}
//       <KeyboardAvoidingView
//         style={styles.keyboardAvoidingView}
//         behavior={Platform.OS === "ios" ? "padding" : "height"}
//         keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
//       >
//         {/* Messages List */}
//         <View
//           style={[
//             styles.messagesContainer,
//             Platform.OS === "android" &&
//               isKeyboardVisible && {
//                 marginBottom:
//                   keyboardHeight > 0
//                     ? Math.max(keyboardHeight - insets.bottom - 60, 0)
//                     : 0,
//               },
//           ]}
//         >
//           {messages.length === 0 ? (
//             <View style={styles.noMessagesContainer}>
//               <Text style={styles.noMessagesText}>No Messages</Text>
//             </View>
//           ) : (
//             <FlashList
//               ref={listRef}
//               contentContainerStyle={styles.listContent}
//               data={messages}
//               renderItem={({ item }) => (
//                 <MessageBubble message={item} currentUserId={currentUserId} />
//               )}
//               keyExtractor={(item) => item.messageid.toString()}
//               showsVerticalScrollIndicator={false}
//               estimatedItemSize={60}
//             />
//           )}
//         </View>

//         {/* Input Bar */}
//         <View
//           style={[
//             styles.inputContainer,
//             { paddingBottom: Math.max(insets.bottom, 12) },
//           ]}
//         >
//           <TextInput
//             style={styles.input}
//             value={text}
//             onChangeText={setText}
//             placeholder="Type a message..."
//             placeholderTextColor="#A09BAC"
//             multiline={false}
//             returnKeyType="send"
//             onSubmitEditing={handleSend}
//             blurOnSubmit={false}
//           />
//           <TouchableOpacity
//             style={[
//               styles.sendButton,
//               text.trim().length > 0 && styles.sendButtonActive,
//             ]}
//             onPress={handleSend}
//             disabled={text.trim().length === 0}
//           >
//             <Ionicons
//               name="paper-plane"
//               size={20}
//               color={text.trim().length > 0 ? "#FF6B9D" : "#666666"}
//             />
//           </TouchableOpacity>
//         </View>
//       </KeyboardAvoidingView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#12082A",
//   },
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
//   keyboardAvoidingView: {
//     flex: 1,
//   },
//   messagesContainer: {
//     flex: 1,
//     backgroundColor: "#12082A",
//   },
//   messageContainer: {
//     marginVertical: 4,
//     paddingHorizontal: 16,
//   },
//   myMessageContainer: {
//     alignItems: "flex-end",
//   },
//   theirMessageContainer: {
//     alignItems: "flex-start",
//   },
//   messageBubble: {
//     paddingHorizontal: 16,
//     paddingVertical: 10,
//     borderRadius: 20,
//     maxWidth: "75%",
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
//   noMessagesContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#12082A",
//   },
//   noMessagesText: {
//     color: "#A09BAC",
//     fontSize: 16,
//   },
//   listContent: {
//     paddingVertical: 8,
//     backgroundColor: "#12082A",
//   },
//   inputContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 16,
//     paddingTop: 12,
//     backgroundColor: "#1F1A3D",
//     borderTopWidth: 1,
//     borderTopColor: "#2A2A2A",
//   },
//   input: {
//     flex: 1,
//     height: 40,
//     backgroundColor: "#2A2A2A",
//     borderRadius: 20,
//     paddingHorizontal: 16,
//     color: "#FFFFFF",
//     fontSize: 16,
//   },
//   sendButton: {
//     marginLeft: 12,
//     padding: 8,
//     borderRadius: 20,
//   },
//   sendButtonActive: {
//     backgroundColor: "#FF6B9D20",
//   },
// });
