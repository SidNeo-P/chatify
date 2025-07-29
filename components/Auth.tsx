// import React, { useState } from "react";
// import { Alert, StyleSheet, View, Text, Image } from "react-native";
// import { supabase } from "../lib/supabase";
// import { Button, Input } from "@rneui/themed";
// import { FontAwesome } from "@expo/vector-icons";

// export default function Auth() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);

//   async function signInWithEmail() {
//     setLoading(true);
//     const { error } = await supabase.auth.signInWithPassword({
//       email: email,
//       password: password,
//     });

//     if (error) Alert.alert(error.message);
//     setLoading(false);
//   }

//   async function signUpWithEmail() {
//     setLoading(true);
//     const {
//       data: { session },
//       error,
//     } = await supabase.auth.signUp({
//       email: email,
//       password: password,
//     });

//     if (error) Alert.alert(error.message);
//     if (!session)
//       Alert.alert("Please check your inbox for email verification!");
//     setLoading(false);
//   }

//   return (
//     <View style={styles.container}>
//       <Image
//         source={require("../assets/chatapp.webp")} // use your own image path
//         style={styles.image}
//         resizeMode="contain"
//       />

//       <Text style={styles.title}>Welcome Back</Text>
//       <Text style={styles.subtitle}>Sign in to continue</Text>
//       <View style={styles.inputField}>
//         <View style={[styles.verticallySpaced, styles.mt20]}>
//           <Input
//             label="Email"
//             leftIcon={<FontAwesome name="envelope" size={20} color="#888}" />}
//             onChangeText={(text) => setEmail(text)}
//             value={email}
//             placeholder="email@address.com"
//             autoCapitalize={"none"}
//             inputContainerStyle={styles.inputContainer}
//           />
//         </View>
//         <View style={styles.verticallySpaced}>
//           <Input
//             label="Password"
//             leftIcon={<FontAwesome name="lock" size={24} color="#888" />}
//             onChangeText={(text) => setPassword(text)}
//             value={password}
//             secureTextEntry={true}
//             placeholder="Password"
//             autoCapitalize={"none"}
//             inputContainerStyle={styles.inputContainer}
//           />
//         </View>
//       </View>

//       <View style={[styles.verticallySpaced, styles.mt20]}>
//         <Button
//           title="Sign in"
//           disabled={loading}
//           onPress={() => signInWithEmail()}
//           buttonStyle={styles.button}
//           containerStyle={styles.buttonContainer}
//         />
//       </View>
//       <View style={styles.verticallySpaced}>
//         <Button
//           title="Create Account"
//           type="clear"
//           disabled={loading}
//           onPress={() => signUpWithEmail()}
//         />
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     marginTop: 40,
//     padding: 12,
//   },
//   verticallySpaced: {
//     paddingTop: 4,
//     paddingBottom: 4,
//     alignSelf: "stretch",
//   },
//   mt20: {
//     marginTop: 5,
//   },
//   image: {
//     width: "100%",
//     height: 160,
//     marginBottom: 15,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: "700",
//     textAlign: "center",
//     marginBottom: 4,
//   },
//   subtitle: {
//     fontSize: 16,
//     textAlign: "center",
//     color: "#666",
//     marginBottom: 24,
//   },
//   inputContainer: {
//     backgroundColor: "#fff",
//     borderBottomWidth: 0,
//     borderRadius: 12,
//     paddingHorizontal: 12,
//     paddingVertical: 4,
//     elevation: 2,
//     marginBottom: 16,
//   },
//   inputField: {
//     gap: 0,
//   },
//   button: {
//     backgroundColor: "#4a90e2",
//     borderRadius: 12,
//     paddingVertical: 12,
//   },
//   buttonContainer: {
//     marginTop: 12,
//     marginBottom: 16,
//   },
// });

// // return (
// //     <View style={styles.container}>
// // <Image
// //   source={require('../assets/chatapp.webp')} // use your own image path
// //   style={styles.image}
// //   resizeMode="contain"
// // />

// // <Text style={styles.title}>Welcome Back</Text>
// // <Text style={styles.subtitle}>Sign in to continue</Text>

// //       <Input
// //         placeholder="Email"
// //         leftIcon={<FontAwesome name="envelope" size={20} color="#888" />}
// //         value={email}
// //         onChangeText={setEmail}
// //         autoCapitalize="none"
// //         inputContainerStyle={styles.inputContainer}
// //         inputStyle={styles.input}
// //       />

// //       <Input
// //         placeholder="Password"
// //         secureTextEntry
// //         leftIcon={<FontAwesome name="lock" size={24} color="#888" />}
// //         value={password}
// //         onChangeText={setPassword}
// //         autoCapitalize="none"
// //         inputContainerStyle={styles.inputContainer}
// //         inputStyle={styles.input}
// //       />

// //       <Button
// //         title="Sign In"
// //         onPress={signInWithEmail}
// //         disabled={loading}
// // buttonStyle={styles.button}
// // containerStyle={styles.buttonContainer}
// //       />

// //       <Button
// //         title="Create Account"
// //         type="clear"
// //         onPress={signUpWithEmail}
// //         titleStyle={styles.signUpText}
// //       />
// //     </View>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     padding: 24,
// //     backgroundColor: '#f9fafe',
// //     justifyContent: 'center',
// //     marginTop:200
// //   },
// // image: {
// //   width: '100%',
// //   height: 160,
// //   marginBottom: 24,
// // },
// // title: {
// //   fontSize: 28,
// //   fontWeight: '700',
// //   textAlign: 'center',
// //   marginBottom: 4,
// // },
// // subtitle: {
// //   fontSize: 16,
// //   textAlign: 'center',
// //   color: '#666',
// //   marginBottom: 24,
// // },
// // inputContainer: {
// //   backgroundColor: '#fff',
// //   borderBottomWidth: 0,
// //   borderRadius: 12,
// //   paddingHorizontal: 12,
// //   paddingVertical: 4,
// //   elevation: 2,
// //   marginBottom: 16,
// // },
// //   input: {
// //     fontSize: 16,
// //   },
// // button: {
// //   backgroundColor: '#4a90e2',
// //   borderRadius: 12,
// //   paddingVertical: 12,
// // },
// // buttonContainer: {
// //   marginTop: 12,
// //   marginBottom: 16,
// // },
// //   signUpText: {
// //     color: '#4a90e2',
// //     fontWeight: '600',
// //   },
// // });

import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  View,
  Text,
  Image,
  TextInputProps,
} from "react-native";
import { supabase } from "../lib/supabase";
import { Button, Input } from "@rneui/themed";
import { FontAwesome } from "@expo/vector-icons";

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
  );
}

// --------- Styles ---------
const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
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
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
    marginBottom: 24,
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
