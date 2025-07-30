// types/navigation.ts

export type StackParamList = {
  Auth: undefined;
  Main: undefined;
  Chat: { chatId: string };
  NewChat: undefined;
  ImportContacts: undefined;
};

export type TabParamList = {
  AllChats: undefined;
  Contacts: undefined;
  Profile: undefined;
};
