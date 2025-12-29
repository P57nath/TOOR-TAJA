import axios from "axios";
import { cookies } from "next/headers";
import { z } from "zod";
import { loginSchema } from "@/lib/auth-client";

type LoginResponse = {
  access_token: string;
};

type RoleResponse = {
  role: "buyer" | "seller" | "admin";
};

function parseJwtRole(token: string): RoleResponse["role"] | null {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  try {
    const normalized = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(
      normalized.length + ((4 - (normalized.length % 4)) % 4),
      "=",
    );
    const payload = Buffer.from(padded, "base64").toString("utf8");
    const data = JSON.parse(payload) as { role?: RoleResponse["role"] };
    return data.role ?? null;
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return new Response(JSON.stringify({ message: "Invalid credentials" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const apiBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5010";

  const params = new URLSearchParams();
  params.set("email", parsed.data.email);
  params.set("password", parsed.data.password);

  const response = await axios.post<LoginResponse>(
    `${apiBaseUrl}/auth/login`,
    params,
    {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    },
  );

  const token = response.data.access_token;
  const role = parseJwtRole(token);

  if (!role) {
    return new Response(JSON.stringify({ message: "Invalid token response" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const cookieStore = await cookies();
  cookieStore.set("access_token", token, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24,
    path: "/",
  });

  return new Response(JSON.stringify({ role }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
