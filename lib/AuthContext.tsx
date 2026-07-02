import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "./supabase";
import type { Session, AuthError } from "@supabase/supabase-js";
import type { AppRole } from "./types";
import { getMyMemberships, type MyMembership } from "./membership";

interface AuthContextValue {
  session: Session | null;
  userRole: AppRole | null;
  memberships: MyMembership[];
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<AuthError | null>;
  signUp: (email: string, password: string) => Promise<AuthError | null>;
  signInWithMagicLink: (email: string) => Promise<AuthError | null>;
  signOut: () => Promise<void>;
  refreshMemberships: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [memberships, setMemberships] = useState<MyMembership[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const userRole: AppRole | null =
    memberships.find((m) => !m.location_id)?.role ?? null;

  const refreshMemberships = async () => {
    const data = await getMyMemberships();
    setMemberships(data);
  };

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      if (session) await refreshMemberships();
      setIsLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        if (session) await refreshMemberships();
        else setMemberships([]);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return error;
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password });
    return error;
  };

  const signInWithMagicLink = async (email: string) => {
    const { error } = await supabase.auth.signInWithOtp({ email });
    return error;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setMemberships([]);
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        userRole,
        memberships,
        isLoading,
        signIn,
        signUp,
        signInWithMagicLink,
        signOut,
        refreshMemberships,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
