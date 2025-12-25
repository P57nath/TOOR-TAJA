export type UserRole = "guest" | "buyer" | "seller" | "admin";

export type SessionUser = {
  role: UserRole;
  displayName: string;
};

export async function requireGuest(): Promise<SessionUser> {
  return {
    role: "guest",
    displayName: "Guest",
  };
}
