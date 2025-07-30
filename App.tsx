// import "react-native-gesture-handler";
// import "react-native-url-polyfill/auto";
// import { useState, useEffect } from "react";
// import { supabase } from "./lib/supabase";
// import Auth from "./components/Auth";
// import { View, Text } from "react-native";
// import { Session } from "@supabase/supabase-js";

// export default function App() {
//   const [session, setSession] = useState<Session | null>(null);

//   useEffect(() => {
//     supabase.auth.getSession().then(({ data: { session } }) => {
//       setSession(session);
//     });

//     supabase.auth.onAuthStateChange((_event, session) => {
//       setSession(session);
//     });
//   }, []);

//   return (
//     <View>
//       <Auth />
//       {session && session.user && <Text>hello</Text>}
//     </View>
//   );
// }

// import "react-native-url-polyfill/auto";
// import "react-native-gesture-handler";
// import { useEffect, useState } from "react";
// import { Session } from "@supabase/supabase-js";
// import { supabase } from "./lib/supabase";
// import Navigation from "./navigation/Index";

// export default function App() {
//   const [session, setSession] = useState<Session | null>(null);

//   useEffect(() => {
//     supabase.auth.getSession().then(({ data: { session } }) => {
//       setSession(session);
//     });

//     supabase.auth.onAuthStateChange((_event, session) => {
//       setSession(session);
//     });
//   }, []);

//   return <Navigation session={session} />;
// }

import "react-native-url-polyfill/auto";
import "react-native-gesture-handler";
import Navigation from "./navigation/Index";
import { AuthProvider } from "./contexts/AuthContext"; // adjust the path if needed

export default function App() {
  return (
    <AuthProvider>
      <Navigation />
    </AuthProvider>
  );
}
