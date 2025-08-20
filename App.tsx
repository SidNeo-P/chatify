import "react-native-url-polyfill/auto";
import "react-native-gesture-handler";
import Navigation from "./navigation/Index";
import { AuthProvider } from "./contexts/AuthContext";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useAuth } from "./contexts/AuthContext";
import { useEffect } from "react";
import { setupPowerSync } from "./powersync/System";

export default function App() {
  const { session } = useAuth();

  useEffect(() => {
    console.log("Session state:", session ? "Logged in" : "Logged out");
    setupPowerSync();
  }, []);
  console.log("App component rendered. ");
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <Navigation />
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
