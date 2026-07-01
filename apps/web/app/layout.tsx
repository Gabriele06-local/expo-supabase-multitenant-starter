import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SaaS Starter",
  description: "Expo + Supabase Multi-Tenant Starter",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
