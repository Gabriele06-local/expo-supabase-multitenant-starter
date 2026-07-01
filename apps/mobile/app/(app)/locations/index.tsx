import { View, Text, FlatList } from "react-native";
import { useEffect, useState } from "react";
import { supabase } from "supabase";
import { getMyMemberships } from "../../../lib/membership";

export default function LocationsScreen() {
  const [locations, setLocations] = useState<any[]>([]);

  useEffect(() => {
    loadLocations();
  }, []);

  const loadLocations = async () => {
    const memberships = await getMyMemberships();
    if (memberships.length === 0) return;

    const orgId = memberships[0].organization_id;
    const { data } = await supabase
      .from("locations")
      .select("*")
      .eq("organization_id", orgId);

    if (data) setLocations(data);
  };

  return (
    <View style={{ flex: 1, padding: 24 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 16 }}>
        Sedi
      </Text>
      <FlatList
        data={locations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={{
              padding: 16, borderBottomWidth: 1, borderColor: "#eee",
            }}
          >
            <Text style={{ fontWeight: "600" }}>{item.name}</Text>
            {item.address && (
              <Text style={{ color: "#666" }}>{item.address}</Text>
            )}
          </View>
        )}
        ListEmptyComponent={
          <Text style={{ color: "#999" }}>Nessuna sede trovata.</Text>
        }
      />
    </View>
  );
}
