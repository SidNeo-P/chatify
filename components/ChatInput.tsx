import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Platform,
  Alert,
  ActivityIndicator,
  Text,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../lib/supabase";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import { decode } from "base64-arraybuffer";

interface ChatInputProps {
  currentUserId: string;
  contactId: string;
  isKeyboardVisible: boolean;
}

export default function ChatInput({
  currentUserId,
  contactId,
}: ChatInputProps) {
  const [text, setText] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  // Function to convert file to base64
  const convertFileToBase64 = async (fileUri: string) => {
    try {
      const base64String = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      return base64String;
    } catch (error) {
      console.error("Error converting file to base64:", error);
      throw error;
    }
  };

  // Function to upload file using base64 method
  const uploadImage = async (file: any, chatId: string) => {
    try {
      const filename = `${Date.now()}_${file.name}`;
      const fileUri = file.uri;
      const base64file = await convertFileToBase64(fileUri);

      const { data, error } = await supabase.storage
        .from("chat-uploads")
        .upload(`uploads/${filename}`, decode(base64file), {
          contentType: file.mimeType || file.type,
        });

      if (error) {
        console.error("Supabase upload error:", error);
        throw error;
      }

      const { data: urlData } = supabase.storage
        .from("chat-uploads")
        .getPublicUrl(data.path);

      console.log(urlData.publicUrl);
      return urlData.publicUrl;
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  };

  // Function to handle file selection
  const handleFilePicker = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];

        // Check file size (limit to 10MB)
        if (file.size && file.size > 10 * 1024 * 1024) {
          Alert.alert(
            "File Too Large",
            "Please select a file smaller than 10MB."
          );
          return;
        }

        setIsUploading(true);

        try {
          // Create chatId from currentUserId and contactId (sorted for consistency)
          const chatId = [currentUserId, contactId].sort().join("_");

          // Upload file using base64 method
          const mediaUrl = await uploadImage(file, chatId);

          if (mediaUrl) {
            await sendMediaMessage(mediaUrl, file.name);
          }
        } catch (error) {
          console.error("Error uploading file:", error);
          Alert.alert(
            "Upload Error",
            "Failed to upload file. Please try again."
          );
        } finally {
          setIsUploading(false);
        }
      }
    } catch (error) {
      console.error("Error picking file:", error);
      Alert.alert("Error", "Failed to select file.");
      setIsUploading(false);
    }
  };

  // Function to send media message
  const sendMediaMessage = async (mediaUrl: string, fileName: string) => {
    if (!currentUserId || !contactId) return;

    const messageToSend = {
      senderid: currentUserId,
      receiverid: contactId,
      content: fileName,
      mediaurl: mediaUrl,
      status: "sent",
    };

    const { error } = await supabase.from("messages").insert(messageToSend);

    if (error) {
      console.error("Error sending media message:", error);
      Alert.alert("Error", "Failed to send file.");
    }
  };

  // Function to handle text message sending
  const handleSend = async () => {
    if (text.trim().length === 0 || !currentUserId || !contactId) return;

    const messageToSend = {
      senderid: currentUserId,
      receiverid: contactId,
      content: text.trim(),
      status: "sent",
    };

    const { error } = await supabase.from("messages").insert(messageToSend);

    if (error) {
      console.error("Error sending message:", error);
    } else {
      setText("");
    }
  };

  return (
    <>
      {/* Upload Progress Overlay */}
      {isUploading && (
        <View style={styles.uploadOverlay}>
          <View style={styles.uploadContainer}>
            <ActivityIndicator size="large" color="#FF6B9D" />
            <Text style={styles.uploadText}>Uploading file...</Text>
          </View>
        </View>
      )}

      {/* Input Container */}
      <View style={styles.inputContainer}>
        {/* File Upload Button */}
        <TouchableOpacity
          style={styles.attachButton}
          onPress={handleFilePicker}
          disabled={isUploading}
        >
          <Ionicons
            name="attach"
            size={20}
            color={isUploading ? "#666666" : "#A09BAC"}
          />
        </TouchableOpacity>

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
          disabled={text.trim().length === 0 || isUploading}
        >
          <Ionicons
            name="paper-plane"
            size={20}
            color={
              text.trim().length > 0 && !isUploading ? "#FF6B9D" : "#666666"
            }
          />
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#1F1A3D",
    borderTopWidth: 1,
    borderTopColor: "#2A2A2A",
    paddingBottom: Platform.OS === "android" ? 35 : 0,
  },
  attachButton: {
    marginRight: 12,
    padding: 8,
    borderRadius: 20,
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
  uploadOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  uploadContainer: {
    backgroundColor: "#1F1A3D",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  uploadText: {
    color: "#FFFFFF",
    marginTop: 10,
    fontSize: 16,
  },
});
