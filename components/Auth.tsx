import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  View,
  Text,
  Image,
} from "react-native";
import { supabase } from "../lib/supabase";
import { Button, Input } from "@rneui/themed";
import { FontAwesome } from "@expo/vector-icons";
import { StatusBar } from "react-native";


export default function Auth() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const signInWithEmail = async (): Promise<void> => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) Alert.alert("Sign In Error", error.message);
    setLoading(false);
  };

  const signUpWithEmail = async (): Promise<void> => {
    setLoading(true);
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) Alert.alert("Sign Up Error", error.message);
    if (!session)
      Alert.alert("Verify Email", "Please check your inbox for verification.");
    setLoading(false);
  };

  return (
    
    <>
    <StatusBar hidden={true}/>
       <View style={styles.container}>
      <Image
        source={require("../assets/chatapp.webp")}
        style={styles.image}
        resizeMode="contain"
      />

      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Sign in to continue</Text>

      <View style={styles.inputField}>
        <View style={[styles.verticallySpaced, styles.mt20]}>
          <Input
            label="Email"
            leftIcon={<FontAwesome name="envelope" size={20} color="#888" />}
            onChangeText={(text: string) => setEmail(text)}
            value={email}
            placeholder="email@address.com"
            autoCapitalize="none"
            inputContainerStyle={styles.inputContainer}
          />
        </View>

        <View style={styles.verticallySpaced}>
          <Input
            label="Password"
            leftIcon={<FontAwesome name="lock" size={24} color="#888" />}
            onChangeText={(text: string) => setPassword(text)}
            value={password}
            secureTextEntry={true}
            placeholder="Password"
            autoCapitalize="none"
            inputContainerStyle={styles.inputContainer}
          />
        </View>
      </View>

      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Button
          title="Sign in"
          disabled={loading}
          onPress={signInWithEmail}
          buttonStyle={styles.button}
          containerStyle={styles.buttonContainer}
        />
      </View>

      <View style={styles.verticallySpaced}>
        <Button
          title="Create Account"
          type="clear"
          disabled={loading}
          onPress={signUpWithEmail}
        />
      </View>
    </View>
    </>
   
  );
}

const styles = StyleSheet.create({
  container: {
    top:0,
    marginTop: 0,
    padding: 12,
    backgroundColor:"#12082A",
    height:"100%"
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: "stretch",
  },
  mt20: {
    marginTop: 5,
  },
  image: {
    width: "100%",
    height: 160,
    marginBottom: 15,
    marginTop:20
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 4,
    color:"#FFFFFF"
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 24,
    color:"#FFFFFF"
  },
  inputContainer: {
    backgroundColor: "#fff",
    borderBottomWidth: 0,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    elevation: 2,
    marginBottom: 16,
  },
  inputField: {
    gap: 0,
  },
  button: {
    backgroundColor: "#4a90e2",
    borderRadius: 12,
    paddingVertical: 12,
  },
  buttonContainer: {
    marginTop: 12,
    marginBottom: 16,
  },
});
