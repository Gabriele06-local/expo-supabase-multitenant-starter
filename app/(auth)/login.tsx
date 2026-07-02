import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { useAuth } from "../../lib/AuthContext";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const { signIn, signInWithMagicLink } = useAuth();

  const handleLogin = async () => {
    setLoading(true);
    const error = await signIn(email, password);
    setLoading(false);
    if (error) {
      Alert.alert("Errore", error.message);
      return;
    }
    router.replace("/(app)/dashboard");
  };

  const handleMagicLink = async () => {
    if (!email) {
      Alert.alert("Errore", "Inserisci un'email");
      return;
    }
    setLoading(true);
    const error = await signInWithMagicLink(email);
    setLoading(false);
    if (error) {
      Alert.alert("Errore", error.message);
      return;
    }
    setMagicLinkSent(true);
  };

  if (magicLinkSent) {
    return (
      <View style={{ flex: 1, justifyContent: "center", padding: 24 }}>
        <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 12 }}>
          Link inviato!
        </Text>
        <Text style={{ color: "#666", marginBottom: 24 }}>
          Controlla la tua email per il link di accesso.
        </Text>
        <TouchableOpacity onPress={() => setMagicLinkSent(false)}>
          <Text style={{ textAlign: "center", color: "#000", fontWeight: "600" }}>
            Torna al login
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 24 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 24 }}>
        Login
      </Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={{
          borderWidth: 1, borderColor: "#ccc", borderRadius: 8,
          padding: 12, marginBottom: 12,
        }}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{
          borderWidth: 1, borderColor: "#ccc", borderRadius: 8,
          padding: 12, marginBottom: 24,
        }}
      />
      <TouchableOpacity
        onPress={handleLogin}
        disabled={loading}
        style={{
          backgroundColor: "#000", borderRadius: 8,
          padding: 16, alignItems: "center", opacity: loading ? 0.5 : 1,
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "600" }}>
          {loading ? "Accesso in corso..." : "Accedi"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleMagicLink} disabled={loading}>
        <Text style={{ textAlign: "center", marginTop: 12, color: "#666" }}>
          Invia magic link
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
        <Text style={{ textAlign: "center", marginTop: 16, color: "#666" }}>
          Non hai un account? Registrati
        </Text>
      </TouchableOpacity>
    </View>
  );
}
