import "react-native-url-polyfill/auto";
import "react-native-gesture-handler";
import Navigation from "./navigation/Index";
import { AuthProvider } from "./contexts/AuthContext"; // adjust the path if needed
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <Navigation />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
