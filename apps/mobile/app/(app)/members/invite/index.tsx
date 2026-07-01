import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { supabase } from "supabase";
import { useAuth } from "../../../../lib/AuthContext";
import { useOrg } from "../../../../lib/OrgContext";

const ROLES = ["admin", "staff", "customer"] as const;

export default function InviteMemberScreen() {
  const { currentOrg } = useOrg();
  const { session } = useAuth();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<string>("staff");
  const [loading, setLoading] = useState(false);

  const handleInvite = async () => {
    if (!email || !currentOrg) {
      Alert.alert("Errore", "Compila tutti i campi");
      return;
    }
    setLoading(true);

    const token = crypto.randomUUID
      ? crypto.randomUUID()
      : Math.random().toString(36).substring(2, 15);

    const { error } = await supabase.from("invites").insert({
      organization_id: currentOrg.organization_id,
      email,
      role,
      invited_by: session?.user?.id,
      token,
    });

    setLoading(false);
    if (error) {
      Alert.alert("Errore", error.message);
      return;
    }
    Alert.alert("Inviato", `Invito creato per ${email}. Token: ${token}`);
    router.back();
  };

  return (
    <View style={{ flex: 1, padding: 24 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 24 }}>
        Invita membro
      </Text>
      <TextInput
        placeholder="Email del membro"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={{
          borderWidth: 1, borderColor: "#ccc", borderRadius: 8,
          padding: 12, marginBottom: 16,
        }}
      />
      <Text style={{ marginBottom: 8, fontWeight: "600" }}>Ruolo</Text>
      <View style={{ flexDirection: "row", gap: 8, marginBottom: 24 }}>
        {ROLES.map((r) => (
          <TouchableOpacity
            key={r}
            onPress={() => setRole(r)}
            style={{
              flex: 1, padding: 12, borderRadius: 8,
              backgroundColor: role === r ? "#000" : "#f5f5f5",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: role === r ? "#fff" : "#333",
                fontWeight: "600",
                textTransform: "capitalize",
              }}
            >
              {r}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity
        onPress={handleInvite}
        disabled={loading}
        style={{
          backgroundColor: "#000", borderRadius: 8,
          padding: 16, alignItems: "center", opacity: loading ? 0.5 : 1,
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "600" }}>
          {loading ? "Invio..." : "Invia invito"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
