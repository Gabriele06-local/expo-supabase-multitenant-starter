import { createClient } from "../lib/supabase";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    redirect("/auth/login");
  }

  const { data: memberships } = await supabase.rpc("my_memberships");
  const org = memberships?.[0];

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 24 }}>
      <h1>Dashboard</h1>
      {org && <p style={{ color: "#666" }}>{org.organization_name}</p>}
      <p>{data.user.email}</p>
    </div>
  );
}
