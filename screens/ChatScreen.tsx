import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  StatusBar,
  Keyboard,
  Dimensions,
} from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { StackParamList } from "../types/Alltypes";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";
import { FlashList } from "@shopify/flash-list";
import MessageBubble from "../components/MessageBubble";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ChatHeader from "../components/ChatHeader";
import ChatInput from "../components/ChatInput";

type Message = {
  messageid: string;
  senderid: string;
  receiverid: string;
  content?: string;
  mediaurl?: string;
  timestamp: string;
  status?: string;
};

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function ChatScreen() {
  const route = useRoute<RouteProp<StackParamList, "Chat">>();
  const { userId: contactId, username } = route.params;
  const { session } = useAuth();
  const insets = useSafeAreaInsets();

  const [messages, setMessages] = useState<Message[]>([]);
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

  // Real-time message subscription
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

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        listRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

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

      {/* Header Component */}
      <ChatHeader username={username} />

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

      {/* Input Component */}
      <ChatInput
        currentUserId={currentUserId!}
        contactId={contactId}
        isKeyboardVisible={isKeyboardVisible}
      />

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
  messagesContainer: {
    flex: 1,
    backgroundColor: "#12082A",
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
});

//old code

// import React, { useEffect, useState, useRef } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TextInput,
//   TouchableOpacity,
//   Platform,
//   SafeAreaView,
//   StatusBar,
//   Keyboard,
//   Dimensions,
//   Alert,
//   ActivityIndicator,
// } from "react-native";
// import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
// import { StackParamList } from "../types/Alltypes";
// import { useAuth } from "../contexts/AuthContext";
// import { supabase } from "../lib/supabase";
// import { FlashList } from "@shopify/flash-list";
// import { Ionicons } from "@expo/vector-icons";
// import MessageBubble from "../components/MessageBubble";
// import { useSafeAreaInsets } from "react-native-safe-area-context";
// import * as DocumentPicker from "expo-document-picker";
// import * as FileSystem from "expo-file-system";
// import { decode } from "base64-arraybuffer";

// type Message = {
//   messageid: string;
//   senderid: string;
//   receiverid: string;
//   content?: string;
//   mediaurl?: string;
//   timestamp: string;
//   status?: string;
// };

// const { height: SCREEN_HEIGHT } = Dimensions.get("window");

// export default function ChatScreen() {
//   const route = useRoute<RouteProp<StackParamList, "Chat">>();
//   const navigation = useNavigation();
//   const { userId: contactId, username } = route.params;
//   const { session } = useAuth();
//   const insets = useSafeAreaInsets();

//   const [messages, setMessages] = useState<Message[]>([]);
//   const [text, setText] = useState("");
//   const [keyboardHeight, setKeyboardHeight] = useState(0);
//   const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
//   const [isUploading, setIsUploading] = useState(false);
//   const listRef = useRef<FlashList<Message>>(null);
//   const currentUserId = session?.user?.id;

//   // Enhanced keyboard handling
//   useEffect(() => {
//     const keyboardDidShowListener = Keyboard.addListener(
//       "keyboardDidShow",
//       (e) => {
//         setKeyboardHeight(e.endCoordinates.height);
//         setIsKeyboardVisible(true);
//       }
//     );

//     const keyboardDidHideListener = Keyboard.addListener(
//       "keyboardDidHide",
//       () => {
//         setKeyboardHeight(0);
//         setIsKeyboardVisible(false);
//       }
//     );

//     const keyboardWillShowListener = Keyboard.addListener(
//       "keyboardWillShow",
//       (e) => {
//         if (Platform.OS === "ios") {
//           setKeyboardHeight(e.endCoordinates.height);
//           setIsKeyboardVisible(true);
//         }
//       }
//     );

//     const keyboardWillHideListener = Keyboard.addListener(
//       "keyboardWillHide",
//       () => {
//         if (Platform.OS === "ios") {
//           setKeyboardHeight(0);
//           setIsKeyboardVisible(false);
//         }
//       }
//     );

//     return () => {
//       keyboardDidShowListener?.remove();
//       keyboardDidHideListener?.remove();
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

//   // Helper function to convert file to base64
//   const convertFileToBase64 = async (fileUri: string) => {
//     try {
//       const base64String = await FileSystem.readAsStringAsync(fileUri, {
//         encoding: FileSystem.EncodingType.Base64,
//       });
//       return base64String;
//     } catch (error) {
//       console.error("Error converting file to base64:", error);
//       throw error;
//     }
//   };

//   // Function to upload file using base64 method
//   const uploadImage = async (file: any, chatId: string) => {
//     try {
//       const filename = `${Date.now()}_${file.name}`;
//       const fileUri = file.uri;
//       const base64file = await convertFileToBase64(fileUri);

//       const { data, error } = await supabase.storage
//         .from("chat-uploads")
//         .upload(`uploads/${filename}`, decode(base64file), {
//           contentType: file.mimeType || file.type,
//         });

//       if (error) {
//         console.error("Supabase upload error:", error);
//         throw error;
//       }

//       const { data: urlData } = supabase.storage
//         .from("chat-uploads")
//         .getPublicUrl(data.path);

//       console.log(urlData.publicUrl);
//       return urlData.publicUrl;
//     } catch (error) {
//       console.error("Upload error:", error);
//       throw error;
//     }
//   };

//   // Function to handle file selection
//   const handleFilePicker = async () => {
//     try {
//       const result = await DocumentPicker.getDocumentAsync({
//         type: "*/*",
//         copyToCacheDirectory: true,
//       });

//       if (!result.canceled && result.assets && result.assets.length > 0) {
//         const file = result.assets[0];

//         // Check file size (limit to 10MB)
//         if (file.size && file.size > 10 * 1024 * 1024) {
//           Alert.alert(
//             "File Too Large",
//             "Please select a file smaller than 10MB."
//           );
//           return;
//         }

//         setIsUploading(true);

//         try {
//           // Create chatId from currentUserId and contactId (sorted for consistency)
//           const chatId = [currentUserId, contactId].sort().join("_");

//           // Upload file using base64 method
//           const mediaUrl = await uploadImage(file, chatId);

//           if (mediaUrl) {
//             await sendMediaMessage(mediaUrl, file.name);
//           }
//         } catch (error) {
//           console.error("Error uploading file:", error);
//           Alert.alert(
//             "Upload Error",
//             "Failed to upload file. Please try again."
//           );
//         } finally {
//           setIsUploading(false);
//         }
//       }
//     } catch (error) {
//       console.error("Error picking file:", error);
//       Alert.alert("Error", "Failed to select file.");
//       setIsUploading(false);
//     }
//   };

//   // Function to send media message
//   const sendMediaMessage = async (mediaUrl: string, fileName: string) => {
//     if (!currentUserId || !contactId) return;

//     const messageToSend = {
//       senderid: currentUserId,
//       receiverid: contactId,
//       content: fileName,
//       mediaurl: mediaUrl,
//       status: "sent",
//     };

//     const { error } = await supabase.from("messages").insert(messageToSend);

//     if (error) {
//       console.error("Error sending media message:", error);
//       Alert.alert("Error", "Failed to send file.");
//     }
//   };

//   // Function to handle text message sending
//   const handleSend = async () => {
//     if (text.trim().length === 0 || !currentUserId || !contactId) return;

//     const messageToSend = {
//       senderid: currentUserId,
//       receiverid: contactId,
//       content: text.trim(),
//       status: "sent",
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

//   // Calculate dynamic container height
//   const getContainerStyle = () => {
//     const baseHeight = SCREEN_HEIGHT - insets.top - insets.bottom;

//     if (Platform.OS === "android" && isKeyboardVisible) {
//       return {
//         ...styles.container,
//         height: baseHeight - keyboardHeight,
//       };
//     }

//     return styles.container;
//   };

//   return (
//     <View style={getContainerStyle()}>
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

//       {/* Messages Container */}
//       <View style={styles.messagesContainer}>
//         {messages.length === 0 ? (
//           <View style={styles.noMessagesContainer}>
//             <Text style={styles.noMessagesText}>No Messages</Text>
//           </View>
//         ) : (
//           <FlashList
//             ref={listRef}
//             contentContainerStyle={styles.listContent}
//             data={messages}
//             renderItem={({ item }) => (
//               <MessageBubble message={item} currentUserId={currentUserId} />
//             )}
//             keyExtractor={(item) => item.messageid.toString()}
//             showsVerticalScrollIndicator={false}
//             estimatedItemSize={60}
//             keyboardShouldPersistTaps="handled"
//           />
//         )}
//       </View>

//       {/* Upload Progress Overlay */}
//       {isUploading && (
//         <View style={styles.uploadOverlay}>
//           <View style={styles.uploadContainer}>
//             <ActivityIndicator size="large" color="#FF6B9D" />
//             <Text style={styles.uploadText}>Uploading file...</Text>
//           </View>
//         </View>
//       )}

//       {/* Input Container */}
//       <View style={styles.inputContainer}>
//         {/* File Upload Button */}
//         <TouchableOpacity
//           style={styles.attachButton}
//           onPress={handleFilePicker}
//           disabled={isUploading}
//         >
//           <Ionicons
//             name="attach"
//             size={20}
//             color={isUploading ? "#666666" : "#A09BAC"}
//           />
//         </TouchableOpacity>

//         <TextInput
//           style={styles.input}
//           value={text}
//           onChangeText={setText}
//           placeholder="Type a message..."
//           placeholderTextColor="#A09BAC"
//           multiline={false}
//           returnKeyType="send"
//           onSubmitEditing={handleSend}
//           blurOnSubmit={false}
//         />

//         <TouchableOpacity
//           style={[
//             styles.sendButton,
//             text.trim().length > 0 && styles.sendButtonActive,
//           ]}
//           onPress={handleSend}
//           disabled={text.trim().length === 0 || isUploading}
//         >
//           <Ionicons
//             name="paper-plane"
//             size={20}
//             color={
//               text.trim().length > 0 && !isUploading ? "#FF6B9D" : "#666666"
//             }
//           />
//         </TouchableOpacity>
//       </View>

//       {/* Custom Keyboard Spacer for Android */}
//       {Platform.OS === "android" && isKeyboardVisible && (
//         <View style={{ height: keyboardHeight }} />
//       )}
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
//   messagesContainer: {
//     flex: 1,
//     backgroundColor: "#12082A",
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
//     paddingBottom: 20,
//   },
//   inputContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     backgroundColor: "#1F1A3D",
//     borderTopWidth: 1,
//     borderTopColor: "#2A2A2A",
//     paddingBottom: Platform.OS === "android" ? 35 : 0,
//   },
//   attachButton: {
//     marginRight: 12,
//     padding: 8,
//     borderRadius: 20,
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
//   uploadOverlay: {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: "rgba(0, 0, 0, 0.7)",
//     justifyContent: "center",
//     alignItems: "center",
//     zIndex: 1000,
//   },
//   uploadContainer: {
//     backgroundColor: "#1F1A3D",
//     padding: 20,
//     borderRadius: 10,
//     alignItems: "center",
//   },
//   uploadText: {
//     color: "#FFFFFF",
//     marginTop: 10,
//     fontSize: 16,
//   },
// });
