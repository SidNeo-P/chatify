// // import React from "react";
// // import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// // import { NavigationContainer } from "@react-navigation/native";
// // import { createNativeStackNavigator } from "@react-navigation/native-stack";
// // import Auth from "../components/Auth";
// // import AllChatsScreen from "../screens/AllChatsScreen";
// // import ProfileScreen from "../screens/ProfileScreen";
// // import { Session } from "@supabase/supabase-js";

// // const Stack = createNativeStackNavigator();
// // const Tab = createBottomTabNavigator();

// // const Tabs = () => (
// //   <Tab.Navigator>
// //     <Tab.Screen name="Chats" component={AllChatsScreen} />
// //     <Tab.Screen name="Profile" component={ProfileScreen} />
// //   </Tab.Navigator>
// // );

// // export default function Navigation({ session }: { session: Session | null }) {
// //   return (
// //     <NavigationContainer>
// //       <Stack.Navigator screenOptions={{ headerShown: false }}>
// //         {session && session.user ? (
// //           <Stack.Screen name="Main" component={Tabs} />
// //         ) : (
// //           <Stack.Screen name="Auth" component={Auth} />
// //         )}
// //       </Stack.Navigator>
// //     </NavigationContainer>
// //   );
// // }

// // navigation/Index.tsx
// // import React from "react";
// // import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// // import { createNativeStackNavigator } from "@react-navigation/native-stack";
// // import { NavigationContainer } from "@react-navigation/native";
// // import Auth from "../components/Auth";
// // import AllChatsScreen from "../screens/AllChatsScreen";
// // import ChatScreen from "../screens/ChatScreen";
// // import NewChatScreen from "../screens/NewChatScreen";
// // import ProfileScreen from "../screens/ProfileScreen";
// // import { Session } from "@supabase/supabase-js";

// // const Stack = createNativeStackNavigator();
// // const Tab = createBottomTabNavigator();

// // // Tab navigator with bottom tabs
// // function TabNavigator() {
// //   return (
// //     <Tab.Navigator>
// //       <Tab.Screen
// //         name="AllChats"
// //         component={AllChatsScreen}
// //         options={{ title: "Chats" }}
// //       />
// //       <Tab.Screen name="Profile" component={ProfileScreen} />
// //     </Tab.Navigator>
// //   );
// // }

// // // Main navigation based on session
// // export default function Navigation({ session }: { session: Session | null }) {
// //   return (
// //     <NavigationContainer>
// //       <Stack.Navigator screenOptions={{ headerShown: false }}>
// //         {session && session.user ? (
// //           <>
// //             <Stack.Screen name="Main" component={TabNavigator} />
// //             <Stack.Screen name="Chat" component={ChatScreen} />
// //             <Stack.Screen name="NewChat" component={NewChatScreen} />
// //           </>
// //         ) : (
// //           <Stack.Screen name="Auth" component={Auth} />
// //         )}
// //       </Stack.Navigator>
// //     </NavigationContainer>
// //   );
// // }

// import React from "react";
// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import { NavigationContainer } from "@react-navigation/native";
// import Auth from "../components/Auth";
// import AllChatsScreen from "../screens/AllChatsScreen";
// import ChatScreen from "../screens/ChatScreen";
// import NewChatScreen from "../screens/NewChatScreen";
// import ProfileScreen from "../screens/ProfileScreen";
// import { useAuth } from "../contexts/AuthContext"; // 👈 new

// const Stack = createNativeStackNavigator();
// const Tab = createBottomTabNavigator();

// // Bottom tabs: Chats + Profile
// function TabNavigator() {
//   return (
//     <Tab.Navigator>
//       <Tab.Screen
//         name="AllChats"
//         component={AllChatsScreen}
//         options={{ title: "Chats" }}
//       />
//       <Tab.Screen name="Profile" component={ProfileScreen} />
//     </Tab.Navigator>
//   );
// }

// export default function Navigation() {
//   const { session, loading } = useAuth(); // 👈 get session

//   if (loading) return null; // ⏳ optional: show loading indicator

//   return (
//     <NavigationContainer>
//       <Stack.Navigator screenOptions={{ headerShown: false }}>
//         {session && session.user ? (
//           <>
//             <Stack.Screen name="Main" component={TabNavigator} />
//             <Stack.Screen name="Chat" component={ChatScreen} />
//             <Stack.Screen name="NewChat" component={NewChatScreen} />
//           </>
//         ) : (
//           <Stack.Screen name="Auth" component={Auth} />
//         )}
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }

// navigation/Navigation.tsx
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { useAuth } from "../contexts/AuthContext";

import Auth from "../components/Auth";
import AllChatsScreen from "../screens/AllChatsScreen";
import ChatScreen from "../screens/ChatScreen";
import NewChatScreen from "../screens/NewChatScreen";
import ProfileScreen from "../screens/ProfileScreen";
import ContactsScreen from "../screens/ContactsScreen";
import ImportContactsScreen from "../screens/ImportContactsScreen";
import { StackParamList, TabParamList } from "../types/navigation";

const Stack = createNativeStackNavigator<StackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();
function TabNavigator() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="AllChats"
        component={AllChatsScreen}
        options={{ title: "Chats" }}
      />
      <Tab.Screen name="Contacts" component={ContactsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function Navigation() {
  const { session, loading } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {session && session.user ? (
          <>
            <Stack.Screen name="Main" component={TabNavigator} />
            <Stack.Screen name="Chat" component={ChatScreen} />
            <Stack.Screen name="NewChat" component={NewChatScreen} />
            <Stack.Screen
              name="ImportContacts"
              component={ImportContactsScreen} // ✅ Add here
            />
          </>
        ) : (
          <Stack.Screen name="Auth" component={Auth} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
