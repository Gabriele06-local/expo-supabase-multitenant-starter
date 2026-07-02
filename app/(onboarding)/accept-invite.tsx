import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../lib/AuthContext";

export default function AcceptInviteScreen() {
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const { refreshMemberships } = useAuth();

  const handleAccept = async () => {
    if (!token) {
      Alert.alert("Errore", "Inserisci il token di invito");
      return;
    }
    setLoading(true);
    const { error } = await supabase.rpc("accept_invite", {
      invite_token: token,
    });
    setLoading(false);
    if (error) {
      Alert.alert("Errore", error.message);
      return;
    }
    await refreshMemberships();
    router.replace("/(app)/dashboard");
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 24 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 8 }}>
        Accetta invito
      </Text>
      <Text style={{ color: "#666", marginBottom: 24 }}>
        Inserisci il token che hai ricevuto via email.
      </Text>
      <TextInput
        placeholder="Token di invito"
        value={token}
        onChangeText={setToken}
        autoCapitalize="none"
        style={{
          borderWidth: 1, borderColor: "#ccc", borderRadius: 8,
          padding: 12, marginBottom: 24,
        }}
      />
      <TouchableOpacity
        onPress={handleAccept}
        disabled={loading}
        style={{
          backgroundColor: "#000", borderRadius: 8,
          padding: 16, alignItems: "center", opacity: loading ? 0.5 : 1,
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "600" }}>
          {loading ? "Accettazione..." : "Accetta invito"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={{ textAlign: "center", marginTop: 16, color: "#666" }}>
          Torna indietro
        </Text>
      </TouchableOpacity>
    </View>
  );
}
