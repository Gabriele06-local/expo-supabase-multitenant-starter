import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import { supabase } from "supabase";
import { router } from "expo-router";
import type { Membership } from "shared-types";
import { getMyMemberships } from "../../../lib/membership";

export default function MembersScreen() {
  const [members, setMembers] = useState<any[]>([]);

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    const memberships = await getMyMemberships();
    if (memberships.length === 0) return;

    const orgId = memberships[0].organization_id;
    const { data } = await supabase
      .from("memberships")
      .select("*, users:user_id(email)")
      .eq("organization_id", orgId);

    if (data) setMembers(data);
  };

  return (
    <View style={{ flex: 1, padding: 24 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 16 }}>
        Membri
      </Text>
      <FlatList
        data={members}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={{
              padding: 16, borderBottomWidth: 1, borderColor: "#eee",
            }}
          >
            <Text style={{ fontWeight: "600" }}>
              {item.users?.email ?? "Unknown"}
            </Text>
            <Text style={{ color: "#666" }}>{item.role}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={{ color: "#999" }}>Nessun membro trovato.</Text>
        }
      />
      <TouchableOpacity
        onPress={() => router.push("invite")}
        style={{
          backgroundColor: "#000", borderRadius: 8,
          padding: 16, alignItems: "center", marginTop: 16,
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "600" }}>Invita membro</Text>
      </TouchableOpacity>
    </View>
  );
}
