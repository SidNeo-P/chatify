import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StyleSheet } from "react-native"; // View and Image are no longer needed
import Ionicons from "react-native-vector-icons/Ionicons";

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { useAuth } from "../contexts/AuthContext";

import Auth from "../components/Auth";
import AllChatsScreen from "../screens/AllChatsScreen";
import ChatScreen from "../screens/ChatScreen";
import ProfileScreen from "../screens/ProfileScreen";
import ContactsScreen from "../screens/ContactsScreen";
import ImportContactsScreen from "../screens/ImportContactsScreen";
import { StackParamList, TabParamList } from "../types/Alltypes";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Stack = createNativeStackNavigator<StackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

function TabNavigator() {
  const insets = useSafeAreaInsets();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: {
          backgroundColor: "#30234a",
          borderTopWidth: 0,
          height: 80,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          paddingBottom: insets.bottom || 10, // Adjust padding based on safe area insets
          position: "absolute",
        },
        tabBarItemStyle: {
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
        },
        tabBarActiveTintColor: "#FF6B9D",
        tabBarInactiveTintColor: "#8e8e93",
      }}
    >
      <Tab.Screen
        name="AllChats"
        component={AllChatsScreen}
        options={{
          title: "Chats",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "chatbubbles" : "chatbubbles-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Contacts"
        component={ContactsScreen}
        options={{
          title: "Contacts",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "people" : "people-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "person-circle" : "person-circle-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({});

export default function Navigation() {
  const { session, loading } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false, animation: "slide_from_right" }}
      >
        {session && session.user ? (
          <>
            <Stack.Screen
              name="Main"
              component={TabNavigator}
              options={{ statusBarHidden: true }}
            />
            <Stack.Screen
              name="Chat"
              component={ChatScreen}
              options={{ statusBarHidden: true }}
            />
            <Stack.Screen
              name="ImportContacts"
              component={ImportContactsScreen}
            />
          </>
        ) : (
          <Stack.Screen name="Auth" component={Auth} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
