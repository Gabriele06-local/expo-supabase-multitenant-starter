import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import type { MyMembership } from "./membership";

interface OrgContextValue {
  currentOrg: MyMembership | null;
  currentLocation: MyMembership | null;
  setCurrentOrg: (org: MyMembership) => void;
  setCurrentLocation: (location: MyMembership | null) => void;
  orgMemberships: MyMembership[];
  locationMemberships: MyMembership[];
}

const OrgContext = createContext<OrgContextValue | null>(null);

export function OrgProvider({ children }: { children: React.ReactNode }) {
  const { memberships } = useAuth();
  const [currentOrg, setCurrentOrg] = useState<MyMembership | null>(null);
  const [currentLocation, setCurrentLocation] = useState<MyMembership | null>(null);

  const orgMemberships = memberships.filter((m) => !m.location_id);
  const locationMemberships = memberships.filter((m) => m.location_id);

  useEffect(() => {
    if (!currentOrg && orgMemberships.length > 0) {
      setCurrentOrg(orgMemberships[0]);
    }
  }, [memberships]);

  return (
    <OrgContext.Provider
      value={{
        currentOrg,
        currentLocation,
        setCurrentOrg,
        setCurrentLocation,
        orgMemberships,
        locationMemberships,
      }}
    >
      {children}
    </OrgContext.Provider>
  );
}

export function useOrg(): OrgContextValue {
  const ctx = useContext(OrgContext);
  if (!ctx) throw new Error("useOrg must be used within an OrgProvider");
  return ctx;
}
