import React from "react";
import { View, Text, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParamList } from "../types/navigation";

type ProfileScreenNavigationProp = NativeStackNavigationProp<StackParamList>;

export default function ProfileScreen() {
  const navigation = useNavigation<ProfileScreenNavigationProp>();

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24 }}>Your Profile</Text>
      <Button
        title="Import Contacts"
        onPress={() => navigation.navigate("ImportContacts")}
      />
    </View>
  );
}
