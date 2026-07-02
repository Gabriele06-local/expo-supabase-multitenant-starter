import React from "react";
import { View, Text } from "react-native";
import type { AppRole } from "shared-types";

const roleColors: Record<AppRole, string> = {
  owner: "#e74c3c",
  admin: "#f39c12",
  staff: "#3498db",
  customer: "#2ecc71",
};

export function RoleBadge({ role }: { role: AppRole }) {
  return (
    <View
      style={{
        backgroundColor: roleColors[role] + "20",
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
      }}
    >
      <Text style={{ color: roleColors[role], fontSize: 12, fontWeight: "600" }}>
        {role}
      </Text>
    </View>
  );
}
