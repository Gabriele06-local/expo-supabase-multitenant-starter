"use client";

import { useState } from "react";
import { createClient } from "../../lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async () => {
    setError(null);
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setError(error.message);
      return;
    }
    router.push("/dashboard");
  };

  return (
    <div style={{ maxWidth: 400, margin: "100px auto", padding: 24 }}>
      <h1 style={{ marginBottom: 24 }}>Login</h1>
      {error && (
        <p style={{ color: "red", marginBottom: 12 }}>{error}</p>
      )}
      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{
          width: "100%", padding: 12, marginBottom: 12,
          border: "1px solid #ccc", borderRadius: 8, boxSizing: "border-box",
        }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{
          width: "100%", padding: 12, marginBottom: 24,
          border: "1px solid #ccc", borderRadius: 8, boxSizing: "border-box",
        }}
      />
      <button
        onClick={handleLogin}
        style={{
          width: "100%", padding: 12, backgroundColor: "#000",
          color: "#fff", border: "none", borderRadius: 8,
          fontWeight: 600, cursor: "pointer",
        }}
      >
        Accedi
      </button>
    </div>
  );
}
