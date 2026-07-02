import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../lib/AuthContext";

export default function CreateOrganizationScreen() {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [loading, setLoading] = useState(false);
  const { refreshMemberships } = useAuth();

  const handleCreate = async () => {
    if (!name || !slug) {
      Alert.alert("Errore", "Compila tutti i campi");
      return;
    }
    setLoading(true);
    const { error } = await supabase.rpc("create_organization", {
      org_name: name,
      org_slug: slug,
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
        Benvenuto!
      </Text>
      <Text style={{ color: "#666", marginBottom: 24 }}>
        Crea la tua organizzazione per iniziare.
      </Text>
      <TextInput
        placeholder="Nome organizzazione"
        value={name}
        onChangeText={setName}
        style={{
          borderWidth: 1, borderColor: "#ccc", borderRadius: 8,
          padding: 12, marginBottom: 12,
        }}
      />
      <TextInput
        placeholder="Slug (es. la-mia-azienda)"
        value={slug}
        onChangeText={(t) => setSlug(t.toLowerCase().replace(/\s+/g, "-"))}
        autoCapitalize="none"
        style={{
          borderWidth: 1, borderColor: "#ccc", borderRadius: 8,
          padding: 12, marginBottom: 24,
        }}
      />
      <TouchableOpacity
        onPress={handleCreate}
        disabled={loading}
        style={{
          backgroundColor: "#000", borderRadius: 8,
          padding: 16, alignItems: "center", opacity: loading ? 0.5 : 1,
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "600" }}>
          {loading ? "Creazione..." : "Crea organizzazione"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/(onboarding)/accept-invite")}>
        <Text style={{ textAlign: "center", marginTop: 16, color: "#666" }}>
          Hai un invito? Inserisci il token
        </Text>
      </TouchableOpacity>
    </View>
  );
}
