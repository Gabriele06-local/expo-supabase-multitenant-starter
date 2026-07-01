import { describe, it, expect } from "vitest";
import type { AppRole } from "../src";

const roleHierarchy: AppRole[] = ["customer", "staff", "admin", "owner"];

function hasMinRole(userRole: AppRole, minRole: AppRole): boolean {
  return roleHierarchy.indexOf(userRole) >= roleHierarchy.indexOf(minRole);
}

describe("AppRole hierarchy", () => {
  it("owner has all permissions", () => {
    expect(hasMinRole("owner", "owner")).toBe(true);
    expect(hasMinRole("owner", "admin")).toBe(true);
    expect(hasMinRole("owner", "staff")).toBe(true);
    expect(hasMinRole("owner", "customer")).toBe(true);
  });

  it("admin has admin, staff, customer but not owner", () => {
    expect(hasMinRole("admin", "owner")).toBe(false);
    expect(hasMinRole("admin", "admin")).toBe(true);
    expect(hasMinRole("admin", "staff")).toBe(true);
    expect(hasMinRole("admin", "customer")).toBe(true);
  });

  it("staff has staff and customer but not admin or owner", () => {
    expect(hasMinRole("staff", "owner")).toBe(false);
    expect(hasMinRole("staff", "admin")).toBe(false);
    expect(hasMinRole("staff", "staff")).toBe(true);
    expect(hasMinRole("staff", "customer")).toBe(true);
  });

  it("customer has only customer", () => {
    expect(hasMinRole("customer", "owner")).toBe(false);
    expect(hasMinRole("customer", "admin")).toBe(false);
    expect(hasMinRole("customer", "staff")).toBe(false);
    expect(hasMinRole("customer", "customer")).toBe(true);
  });
});

describe("Membership validation", () => {
  it("all AppRole values are valid", () => {
    const validRoles: AppRole[] = ["owner", "admin", "staff", "customer"];
    validRoles.forEach((role) => {
      expect(roleHierarchy).toContain(role);
    });
  });

  it("has correct role ordering", () => {
    expect(roleHierarchy).toEqual(["customer", "staff", "admin", "owner"]);
  });
});
