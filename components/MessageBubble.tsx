import React from "react";
import { View, Text, StyleSheet } from "react-native";

// The Message type is now defined here, making the component self-contained.
type Message = {
  messageid: string;
  senderid: string;
  receiverid: string;
  content: string;
  timestamp: string;
};

// Define the props interface for our component
interface MessageBubbleProps {
  message: Message;
  currentUserId: string | undefined;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  currentUserId,
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

// Styles relevant only to the message bubble are moved here.
const styles = StyleSheet.create({
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
});

export default MessageBubble;
