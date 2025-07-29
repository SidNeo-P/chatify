import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";

export default function ChatScreen({ route }: any) {
  const { user } = route.params;

  const MESSAGES = [
    { id: "1", text: "Hello!", sender: "me" },
    { id: "2", text: "Hi, how are you?", sender: user.name },
    { id: "3", text: "All good. You?", sender: "me" },
  ];

  return (
    <View style={styles.container}>
      <FlatList
        data={MESSAGES}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={[
              styles.messageBubble,
              item.sender === "me" ? styles.sent : styles.received,
            ]}
          >
            <Text>{item.text}</Text>
          </View>
        )}
        contentContainerStyle={{ padding: 16 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9" },
  messageBubble: {
    padding: 10,
    marginVertical: 6,
    maxWidth: "80%",
    borderRadius: 12,
  },
  sent: {
    alignSelf: "flex-end",
    backgroundColor: "#dcf8c6",
  },
  received: {
    alignSelf: "flex-start",
    backgroundColor: "#e5e5ea",
  },
});
