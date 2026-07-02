import { View, Text, FlatList, TouchableOpacity, Alert } from "react-native";
import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import { router } from "expo-router";
import { useOrg } from "../../../lib/OrgContext";
import { RoleBadge } from "../../../components";
import type { AppRole } from "../../../lib/types";

interface Member {
  id: string;
  user_id: string;
  role: AppRole;
  users: { email: string } | null;
}

export default function MembersScreen() {
  const { currentOrg } = useOrg();
  const [members, setMembers] = useState<Member[]>([]);
  const [changingRole, setChangingRole] = useState<string | null>(null);

  useEffect(() => {
    if (currentOrg) loadMembers();
  }, [currentOrg]);

  const loadMembers = async () => {
    if (!currentOrg) return;
    const { data } = await supabase
      .from("memberships")
      .select("id, user_id, role, users:user_id(email)")
      .eq("organization_id", currentOrg.organization_id);

    if (data) setMembers(data as unknown as Member[]);
  };

  const handleRoleChange = async (membershipId: string, newRole: AppRole) => {
    setChangingRole(membershipId);
    const { error } = await supabase.rpc("change_membership_role", {
      membership_id: membershipId,
      new_role: newRole,
    });
    setChangingRole(null);
    if (error) {
      Alert.alert("Errore", error.message);
      return;
    }
    loadMembers();
  };

  const nextRole = (current: AppRole): AppRole | null => {
    const levels: AppRole[] = ["customer", "staff", "admin"];
    const idx = levels.indexOf(current);
    if (idx >= 0 && idx < levels.length - 1) return levels[idx + 1];
    return null;
  };

  return (
    <View style={{ flex: 1, padding: 24 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 16 }}>
        Membri
      </Text>
      <FlatList
        data={members}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const promote = nextRole(item.role);
          return (
            <View
              style={{
                flexDirection: "row", alignItems: "center",
                justifyContent: "space-between",
                padding: 16, borderBottomWidth: 1, borderColor: "#eee",
              }}
            >
              <View>
                <Text style={{ fontWeight: "600" }}>
                  {item.users?.email ?? "Unknown"}
                </Text>
                <RoleBadge role={item.role} />
              </View>
              {promote && (
                <TouchableOpacity
                  onPress={() => handleRoleChange(item.id, promote)}
                  disabled={changingRole === item.id}
                >
                  <Text style={{ color: "#3498db", fontWeight: "600" }}>
                    {changingRole === item.id ? "..." : `Promuovi a ${promote}`}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          );
        }}
        ListEmptyComponent={
          <Text style={{ color: "#999" }}>Nessun membro trovato.</Text>
        }
      />
      <TouchableOpacity
        onPress={() => router.push("/(app)/members/invite")}
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
