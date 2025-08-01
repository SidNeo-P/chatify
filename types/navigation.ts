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
  Chat: { userId: string };
  NewChat: undefined;
  ImportContacts: undefined;
};

export type RootStackParamList = {
  Chat: { userId: string }; // Define the parameters for the "Chat" screen
  // Add other screens here if needed
};
export type NavigationProps = NativeStackNavigationProp<RootStackParamList>;
