import { useEffect } from "react";
import { Stack, router } from "expo-router";
import { View, Text, TouchableOpacity } from "react-native";
import { useAuth } from "../../lib/AuthContext";
import { useOrg } from "../../lib/OrgContext";

export default function AppLayout() {
  const { session, memberships, isLoading, signOut } = useAuth();
  const { currentOrg } = useOrg();

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
          title: currentOrg?.organization_name ?? "Dashboard",
          headerRight: () => (
            <TouchableOpacity onPress={signOut}>
              <Text style={{ color: "#e74c3c", marginRight: 8 }}>Esci</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen name="members/index" options={{ title: "Membri" }} />
      <Stack.Screen name="members/invite/index" options={{ title: "Invita" }} />
      <Stack.Screen name="locations/index" options={{ title: "Sedi" }} />
    </Stack>
  );
}
