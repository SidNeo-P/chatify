import { NavigatorScreenParams } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export type TabParamList = {
  AllChats: undefined;
  Contacts: undefined;
  Profile: undefined;
};

export type StackParamList = {
  Auth: undefined;
  // ✅ This now correctly types the Main route as a container for the Tab Navigator
  Main: NavigatorScreenParams<TabParamList>;
  Chat: { userId: string; username?: string }; // Updated to include username
  NewChat: undefined;
  ImportContacts: undefined;
};

export type RootStackParamList = StackParamList; // Use the same type as StackParamList
export type NavigationProps = NativeStackNavigationProp<RootStackParamList>;

// Types for chat messages
export interface ChatMessage {
  _id: string;
  text: string;
  createdAt: Date;
  user: {
    _id: string;
  };
}

// Types for database messages
export interface DatabaseMessage {
  messageid: string;
  content: string;
  timestamp: string;
  senderid: string;
  receiverid: string;
  status?: string;
}

// Types for API functions
export interface User {
  userid: string;
  email?: string;
  full_name?: string;
  avatar_url?: string;
  created_at?: string;
}

export interface Contact {
  contactid: string;
  userid: string;
  contact_userid: string;
  created_at?: string;
}
