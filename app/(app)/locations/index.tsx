import { View, Text, FlatList } from "react-native";
import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import { useOrg } from "../../../lib/OrgContext";

interface Location {
  id: string;
  name: string;
  address: string | null;
}

export default function LocationsScreen() {
  const { currentOrg } = useOrg();
  const [locations, setLocations] = useState<Location[]>([]);

  useEffect(() => {
    if (currentOrg) loadLocations();
  }, [currentOrg]);

  const loadLocations = async () => {
    if (!currentOrg) return;
    const { data } = await supabase
      .from("locations")
      .select("*")
      .eq("organization_id", currentOrg.organization_id);

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
