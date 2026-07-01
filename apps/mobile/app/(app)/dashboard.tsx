import { View, Text } from "react-native";
import { useAuth } from "../../lib/auth";

export default function DashboardScreen() {
  const { session } = useAuth();

  return (
    <View style={{ flex: 1, padding: 24 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 8 }}>
        Dashboard
      </Text>
      <Text style={{ color: "#666" }}>
        Bentornato, {session?.user?.email}
      </Text>
    </View>
  );
}
