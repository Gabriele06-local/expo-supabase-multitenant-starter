import { View, Text, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import { router } from "expo-router";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../lib/AuthContext";
import { useOrg } from "../../lib/OrgContext";
import { RoleBadge } from "../../components";

export default function DashboardScreen() {
  const { session, userRole, signOut } = useAuth();
  const { currentOrg, setCurrentOrg, orgMemberships } = useOrg();
  const [stats, setStats] = useState({ members: 0, locations: 0 });
  const [showOrgPicker, setShowOrgPicker] = useState(false);

  useEffect(() => {
    if (currentOrg) loadStats();
  }, [currentOrg]);

  const loadStats = async () => {
    if (!currentOrg) return;
    const { count: members } = await supabase
      .from("memberships")
      .select("*", { count: "exact", head: true })
      .eq("organization_id", currentOrg.organization_id);

    const { count: locations } = await supabase
      .from("locations")
      .select("*", { count: "exact", head: true })
      .eq("organization_id", currentOrg.organization_id);

    setStats({
      members: members ?? 0,
      locations: locations ?? 0,
    });
  };

  return (
    <View style={{ flex: 1, padding: 24 }}>
      {/* Organization Switcher */}
      {orgMemberships.length > 1 && (
        <View style={{ marginBottom: 16 }}>
          <TouchableOpacity
            onPress={() => setShowOrgPicker(!showOrgPicker)}
            style={{
              backgroundColor: "#f5f5f5", borderRadius: 8,
              padding: 12, flexDirection: "row", justifyContent: "space-between",
            }}
          >
            <Text style={{ fontWeight: "600" }}>
              {currentOrg?.organization_name}
            </Text>
            <Text>{showOrgPicker ? "▲" : "▼"}</Text>
          </TouchableOpacity>
          {showOrgPicker &&
            orgMemberships.map((org) => (
              <TouchableOpacity
                key={org.organization_id}
                onPress={() => {
                  setCurrentOrg(org);
                  setShowOrgPicker(false);
                }}
                style={{
                  padding: 12, borderBottomWidth: 1, borderColor: "#eee",
                }}
              >
                <Text>{org.organization_name}</Text>
                <RoleBadge role={org.role} />
              </TouchableOpacity>
            ))}
        </View>
      )}

      {/* Stats */}
      <View style={{ flexDirection: "row", gap: 12, marginBottom: 24 }}>
        <View
          style={{
            flex: 1, backgroundColor: "#f5f5f5", borderRadius: 8,
            padding: 16, alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 28, fontWeight: "bold" }}>
            {stats.members}
          </Text>
          <Text style={{ color: "#666" }}>Membri</Text>
        </View>
        <View
          style={{
            flex: 1, backgroundColor: "#f5f5f5", borderRadius: 8,
            padding: 16, alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 28, fontWeight: "bold" }}>
            {stats.locations}
          </Text>
          <Text style={{ color: "#666" }}>Sedi</Text>
        </View>
      </View>

      {/* User info */}
      <View style={{ marginBottom: 24 }}>
        <Text style={{ color: "#333" }}>{session?.user?.email}</Text>
        {userRole && <RoleBadge role={userRole} />}
      </View>

      {/* Quick actions */}
      <View style={{ gap: 12 }}>
        {userRole && ["owner", "admin"].includes(userRole) && (
          <TouchableOpacity
            onPress={() => router.push("/(app)/members")}
            style={{
              backgroundColor: "#f5f5f5", borderRadius: 8, padding: 16,
            }}
          >
            <Text style={{ fontWeight: "600" }}>Gestione membri</Text>
            <Text style={{ color: "#666", fontSize: 12, marginTop: 4 }}>
              Invita, promuovi o rimuovi membri
            </Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={() => router.push("/(app)/locations")}
          style={{
            backgroundColor: "#f5f5f5", borderRadius: 8, padding: 16,
          }}
        >
          <Text style={{ fontWeight: "600" }}>Sedi</Text>
          <Text style={{ color: "#666", fontSize: 12, marginTop: 4 }}>
            Visualizza le sedi dell'organizzazione
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={signOut}
        style={{ marginTop: "auto", padding: 16, alignItems: "center" }}
      >
        <Text style={{ color: "#e74c3c", fontWeight: "600" }}>Esci</Text>
      </TouchableOpacity>
    </View>
  );
}
