import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export type UserRole = "guest" | "buyer" | "seller" | "admin";

export type SessionUser = {
  role: UserRole;
  displayName: string;
  userId?: string;
  email?: string;
  token?: string;
};

type JwtPayload = {
  sub?: string;
  email?: string;
  role?: string;
};

function decodeBase64Url(input: string) {
  const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(
    normalized.length + ((4 - (normalized.length % 4)) % 4),
    "=",
  );
  return Buffer.from(padded, "base64").toString("utf8");
}

function parseJwtPayload(token: string): JwtPayload | null {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  try {
    const payload = decodeBase64Url(parts[1]);
    return JSON.parse(payload) as JwtPayload;
  } catch {
    return null;
  }
}

export async function getAccessToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("access_token")?.value ?? null;
}

export async function requireGuest(): Promise<SessionUser> {
  return {
    role: "guest",
    displayName: "Guest",
  };
}

export async function requireRole(requiredRole: UserRole): Promise<SessionUser> {
  const token = await getAccessToken();
  if (!token) redirect("/login");

  const payload = parseJwtPayload(token);
  const normalizedRole = payload?.role?.toLowerCase() as UserRole | undefined;
  if (!normalizedRole || normalizedRole !== requiredRole) {
    redirect("/login");
  }

  return {
    role: normalizedRole,
    displayName: payload.email ?? requiredRole,
    userId: payload.sub,
    email: payload.email,
    token,
  };
}
