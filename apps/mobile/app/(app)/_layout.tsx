import { useEffect } from "react";
import { Stack, router } from "expo-router";
import { View, Text, TouchableOpacity } from "react-native";
import { useAuth } from "../../lib/AuthContext";
import type { AppRole } from "shared-types";

const roleTabs: { role: AppRole; label: string; routes: string[] }[] = [
  { role: "owner", label: "Proprietario", routes: ["dashboard", "members", "locations"] },
  { role: "admin", label: "Amministratore", routes: ["dashboard", "members", "locations"] },
  { role: "staff", label: "Staff", routes: ["dashboard", "locations"] },
  { role: "customer", label: "Cliente", routes: ["dashboard"] },
];

export default function AppLayout() {
  const { session, memberships, isLoading, signOut, userRole } = useAuth();

  useEffect(() => {
    if (isLoading) return;
    if (!session) {
      router.replace("/(auth)/login");
      return;
    }
    if (memberships.length === 0) {
      router.replace("/(onboarding)/create-organization");
    }
  }, [isLoading, session, memberships]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Caricamento...</Text>
      </View>
    );
  }

  if (!session || memberships.length === 0) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
          headerRight: () => (
            <TouchableOpacity onPress={signOut}>
              <Text style={{ color: "#e74c3c", marginRight: 8 }}>Esci</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen name="members/index" options={{ title: "Membri" }} />
      <Stack.Screen name="locations/index" options={{ title: "Sedi" }} />
    </Stack>
  );
}
