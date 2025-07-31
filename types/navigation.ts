import { NavigatorScreenParams } from "@react-navigation/native";

export type TabParamList = {
  AllChats: undefined;
  Contacts: undefined;
  Profile: undefined;
};

export type StackParamList = {
  Auth: undefined;
  // ✅ This now correctly types the Main route as a container for the Tab Navigator
  Main: NavigatorScreenParams<TabParamList>;
  Chat: { chatId: string };
  NewChat: undefined;
  ImportContacts: undefined;
};
