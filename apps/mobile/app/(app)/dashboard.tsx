import { View, Text, TouchableOpacity } from "react-native";
import { useAuth } from "../../lib/AuthContext";
import { RoleBadge } from "shared-ui";
import { router } from "expo-router";

export default function DashboardScreen() {
  const { session, memberships, userRole, signOut } = useAuth();
  const org = memberships[0];

  return (
    <View style={{ flex: 1, padding: 24 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 4 }}>
        Dashboard
      </Text>
      {org && (
        <Text style={{ fontSize: 16, color: "#666", marginBottom: 16 }}>
          {org.organization_name}
        </Text>
      )}
      <View style={{ marginBottom: 24 }}>
        <Text style={{ color: "#333", marginBottom: 4 }}>
          {session?.user?.email}
        </Text>
        {userRole && <RoleBadge role={userRole} />}
      </View>
      <View style={{ gap: 12 }}>
        {userRole && ["owner", "admin"].includes(userRole) && (
          <TouchableOpacity
            onPress={() => router.push("/(app)/members")}
            style={{
              backgroundColor: "#f5f5f5", borderRadius: 8,
              padding: 16,
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
