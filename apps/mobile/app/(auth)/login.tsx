import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { supabase } from "supabase";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (!error) router.replace("/(app)/dashboard");
  };

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
        style={{
          backgroundColor: "#000", borderRadius: 8,
          padding: 16, alignItems: "center",
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "600" }}>Accedi</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
        <Text style={{ textAlign: "center", marginTop: 16, color: "#666" }}>
          Non hai un account? Registrati
        </Text>
      </TouchableOpacity>
    </View>
  );
}
