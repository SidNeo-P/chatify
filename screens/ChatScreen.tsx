// import React from "react";
// import { View, Text, FlatList, StyleSheet } from "react-native";

// export default function ChatScreen({ route }: any) {
//   const { user } = route.params;

//   const MESSAGES = [
//     { id: "1", text: "Hello!", sender: "me" },
//     { id: "2", text: "Hi, how are you?", sender: user.name },
//     { id: "3", text: "All good. You?", sender: "me" },
//   ];

//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={MESSAGES}
//         keyExtractor={(item) => item.id}
//         renderItem={({ item }) => (
//           <View
//             style={[
//               styles.messageBubble,
//               item.sender === "me" ? styles.sent : styles.received,
//             ]}
//           >
//             <Text>{item.text}</Text>
//           </View>
//         )}
//         contentContainerStyle={{ padding: 16 }}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#f9f9f9" },
//   messageBubble: {
//     padding: 10,
//     marginVertical: 6,
//     maxWidth: "80%",
//     borderRadius: 12,
//   },
//   sent: {
//     alignSelf: "flex-end",
//     backgroundColor: "#dcf8c6",
//   },
//   received: {
//     alignSelf: "flex-start",
//     backgroundColor: "#e5e5ea",
//   },
// });

// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   FlatList,
//   StyleSheet,
//   TextInput,
//   TouchableOpacity,
// } from "react-native";
// import { RouteProp, useRoute } from "@react-navigation/native";
// import { StackParamList } from "../types/navigation"; // Import navigation types
// import { getMessages, sendMessage } from "../lib/api"; // Import API functions

// type Message = {
//   MessageID: string;
//   SenderID: string;
//   ReceiverID: string;
//   Content: string;
//   Timestamp: string;
// };

// export default function ChatScreen() {
//   const route = useRoute<RouteProp<StackParamList, "Chat">>(); // Type-safe route
//   const { userId } = route.params; // Extract userId from route params

//   const [messages, setMessages] = useState<Message[]>([]);
//   const [newMessage, setNewMessage] = useState<string>("");

//   useEffect(() => {
//     const fetchMessages = async () => {
//       try {
//         const fetchedMessages = await getMessages(userId);
//         setMessages(fetchedMessages);
//       } catch (error) {
//         console.error("Error fetching messages:", error);
//       }
//     };

//     fetchMessages();
//   }, [userId]);

//   const handleSendMessage = async () => {
//     if (!newMessage.trim()) return;

//     try {
//       const sentMessage = await sendMessage(userId, newMessage);
//       setMessages((prevMessages) => [...prevMessages, sentMessage]);
//       setNewMessage(""); // Clear input field
//     } catch (error) {
//       console.error("Error sending message:", error);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={messages}
//         keyExtractor={(item) => item.MessageID}
//         renderItem={({ item }) => (
//           <View
//             style={[
//               styles.messageBubble,
//               item.SenderID === userId ? styles.received : styles.sent,
//             ]}
//           >
//             <Text>{item.Content}</Text>
//           </View>
//         )}
//         contentContainerStyle={{ padding: 16 }}
//       />
//       <View style={styles.inputContainer}>
//         <TextInput
//           style={styles.input}
//           placeholder="Type a message..."
//           value={newMessage}
//           onChangeText={setNewMessage}
//         />
//         <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
//           <Text style={styles.sendButtonText}>Send</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#f9f9f9",
//   },
//   messageBubble: {
//     padding: 10,
//     marginVertical: 6,
//     maxWidth: "80%",
//     borderRadius: 12,
//   },
//   sent: {
//     alignSelf: "flex-end",
//     backgroundColor: "#dcf8c6",
//   },
//   received: {
//     alignSelf: "flex-start",
//     backgroundColor: "#e5e5ea",
//   },
//   inputContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     padding: 10,
//     borderTopWidth: 1,
//     borderTopColor: "#ddd",
//   },
//   input: {
//     flex: 1,
//     padding: 10,
//     borderWidth: 1,
//     borderColor: "#ddd",
//     borderRadius: 20,
//     backgroundColor: "#fff",
//   },
//   sendButton: {
//     marginLeft: 10,
//     padding: 10,
//     backgroundColor: "#007AFF",
//     borderRadius: 20,
//   },
//   sendButtonText: {
//     color: "#fff",
//     fontWeight: "bold",
//   },
// });

// import React, { useEffect, useState, useRef } from "react";
// import {
//   View,
//   Text,
//   FlatList,
//   StyleSheet,
//   TextInput,
//   TouchableOpacity,
//   KeyboardAvoidingView,
//   Platform,
//   SafeAreaView,
//   ActivityIndicator,
// } from "react-native";
// import { RouteProp, useRoute } from "@react-navigation/native";
// import { StackParamList } from "../types/navigation"; // Import navigation types
// import { useAuth } from "../contexts/AuthContext";
// import { supabase } from "../lib/supabase";

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
//   const route = useRoute<RouteProp<StackParamList, "Chat">>(); // Type-safe route
//   const { userId: contactId } = route.params; // Extract userId from route params
//   const { session } = useAuth();

//   const [messages, setMessages] = useState<Message[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [text, setText] = useState("");
//   const flatListRef = useRef<FlatList>(null);
//   const currentUserId = session?.user?.id;

//   const fetchMessages = async () => {
//     if (!currentUserId || !contactId) return;
//     setLoading(true);
//     const { data, error } = await supabase
//       .from("messages")
//       .select("*")
//       .in("senderid", [currentUserId, contactId])
//       .in("receiverid", [currentUserId, contactId])
//       .order("timestamp", { ascending: true });

//     if (error) {
//       console.error("Error fetching messages:", error);
//     } else {
//       setMessages(data || []);
//     }
//     setLoading(false);
//   };

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
//       setText(""); // Clear the input field
//     }
//   };

//   useEffect(() => {
//     fetchMessages();

//     const channel = supabase
//       .channel(`chat:${currentUserId}:${contactId}`)
//       .on(
//         "postgres_changes",
//         {
//           event: "INSERT",
//           schema: "public",
//           table: "messages",
//           filter: `receiverid=eq.${currentUserId}`,
//         },
//         (payload) => {
//           if (payload.new.senderid === contactId) {
//             setMessages((prevMessages) => [
//               ...prevMessages,
//               payload.new as Message,
//             ]);
//           }
//         }
//       )
//       .subscribe();

//     return () => {
//       supabase.removeChannel(channel);
//     };
//   }, [currentUserId, contactId]);

//   return (
//     <SafeAreaView style={styles.container}>
//       <KeyboardAvoidingView
//         style={styles.container}
//         behavior={Platform.OS === "ios" ? "padding" : "height"}
//         keyboardVerticalOffset={90}
//       >
//         {loading ? (
//           <ActivityIndicator style={{ flex: 1 }} />
//         ) : (
//           <FlatList
//             ref={flatListRef}
//             data={messages}
//             renderItem={({ item }) => (
//               <MessageBubble message={item} currentUserId={currentUserId} />
//             )}
//             keyExtractor={(item) => item.messageid}
//             contentContainerStyle={{ padding: 10 }}
//             onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
//           />
//         )}

//         <View style={styles.inputContainer}>
//           <TextInput
//             style={styles.input}
//             value={text}
//             onChangeText={setText}
//             placeholder="Type a message..."
//           />
//           <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
//             <Text style={styles.sendButtonText}>Send</Text>
//           </TouchableOpacity>
//         </View>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#FFFFFF",
//   },
//   messageContainer: {
//     marginVertical: 5,
//   },
//   myMessageContainer: {
//     alignItems: "flex-end",
//   },
//   theirMessageContainer: {
//     alignItems: "flex-start",
//   },
//   messageBubble: {
//     padding: 12,
//     borderRadius: 18,
//     maxWidth: "80%",
//   },
//   myMessageBubble: {
//     backgroundColor: "#007AFF",
//   },
//   theirMessageBubble: {
//     backgroundColor: "#E5E5EA",
//   },
//   myMessageText: {
//     color: "#FFFFFF",
//   },
//   theirMessageText: {
//     color: "#000000",
//   },
//   inputContainer: {
//     flexDirection: "row",
//     padding: 10,
//     borderTopWidth: 1,
//     borderColor: "#E5E5EA",
//   },
//   input: {
//     flex: 1,
//     height: 40,
//     backgroundColor: "#F0F0F0",
//     borderRadius: 20,
//     paddingHorizontal: 15,
//   },
//   sendButton: {
//     marginLeft: 10,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   sendButtonText: {
//     color: "#007AFF",
//     fontWeight: "600",
//     fontSize: 16,
//   },
// });

import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { StackParamList } from "../types/navigation"; // Import navigation types
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";
import { FlashList } from "@shopify/flash-list";

type Message = {
  messageid: string;
  senderid: string;
  receiverid: string;
  content: string;
  timestamp: string;
};

const MessageBubble = ({
  message,
  currentUserId,
}: {
  message: Message;
  currentUserId: string | undefined;
}) => {
  const isMyMessage = message.senderid === currentUserId;
  return (
    <View
      style={[
        styles.messageContainer,
        isMyMessage ? styles.myMessageContainer : styles.theirMessageContainer,
      ]}
    >
      <View
        style={[
          styles.messageBubble,
          isMyMessage ? styles.myMessageBubble : styles.theirMessageBubble,
        ]}
      >
        <Text
          style={isMyMessage ? styles.myMessageText : styles.theirMessageText}
        >
          {message.content}
        </Text>
      </View>
    </View>
  );
};

export default function ChatScreen() {
  const route = useRoute<RouteProp<StackParamList, "Chat">>(); // Type-safe route
  const { userId: contactId } = route.params; // Extract userId from route params
  const { session } = useAuth();

  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const listRef = useRef<FlashList<Message>>(null);
  const currentUserId = session?.user?.id;

  useEffect(() => {
    const channel = supabase
      .channel(`chat:${currentUserId}:${contactId}`)
      .on(
        "postgres_changes",
        {
          event: "*", // Listen to all events (INSERT, UPDATE, DELETE)
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

    // Fetch existing messages on component mount
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
      setText(""); // Clear the input field
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={90}
      >
        {messages.length === 0 ? (
          <Text style={styles.noMessagesText}>No Messages</Text>
        ) : (
          <FlashList
            ref={listRef}
            contentContainerStyle={styles.listContent}
            data={messages}
            renderItem={({ item }) => (
              <MessageBubble message={item} currentUserId={currentUserId} />
            )}
            keyExtractor={(item) => item.messageid.toString()}
          />
        )}

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={text}
            onChangeText={setText}
            placeholder="Type a message..."
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  messageContainer: {
    marginVertical: 5,
  },
  myMessageContainer: {
    alignItems: "flex-end",
  },
  theirMessageContainer: {
    alignItems: "flex-start",
  },
  messageBubble: {
    padding: 12,
    borderRadius: 18,
    maxWidth: "80%",
  },
  myMessageBubble: {
    backgroundColor: "#007AFF",
  },
  theirMessageBubble: {
    backgroundColor: "#E5E5EA",
  },
  myMessageText: {
    color: "#FFFFFF",
  },
  theirMessageText: {
    color: "#000000",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#E5E5EA",
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: "#F0F0F0",
    borderRadius: 20,
    paddingHorizontal: 15,
  },
  sendButton: {
    marginLeft: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonText: {
    color: "#007AFF",
    fontWeight: "600",
    fontSize: 16,
  },
  noMessagesText: {
    textAlign: "center",
    color: "gray",
    marginTop: 20,
  },
  listContent: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
});
