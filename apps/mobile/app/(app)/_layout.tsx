import { useEffect, useState } from "react";
import { Stack, router } from "expo-router";
import { supabase } from "supabase";
import { Text, View } from "react-native";
import type { Session } from "@supabase/supabase-js";
import type { AppRole } from "shared-types";
import { getMyMemberships } from "../../lib/membership";

export default function AppLayout() {
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<AppRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) {
        router.replace("/(auth)/login");
        return;
      }
      setSession(session);
      const memberships = await getMyMemberships();
      const orgRole = memberships.find((m) => !m.location_id)?.role ?? null;
      setRole(orgRole);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        if (!session) router.replace("/(auth)/login");
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Caricamento...</Text>
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen name="dashboard" options={{ title: "Dashboard" }} />
      <Stack.Screen name="members/index" options={{ title: "Membri" }} />
      <Stack.Screen name="locations/index" options={{ title: "Sedi" }} />
    </Stack>
  );
}
