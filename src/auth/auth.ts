// src/auth/authStore.ts
export type Role = "complainant" | "officer" | null;

class AuthStore {
  role: Role;

  constructor() {
    this.role = (sessionStorage.getItem("role") as Role) || null;
  }

  setRole(role: Role) {
    this.role = role;
    if (role !== null) {
      sessionStorage.setItem("role", role);
    }
  }

  clear() {
    this.role = null;
    sessionStorage.removeItem("role");
  }
}

export const authStore = new AuthStore();
