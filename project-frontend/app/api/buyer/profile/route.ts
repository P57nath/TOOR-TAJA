import { cookies } from "next/headers";

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5010";

async function getToken() {
  const cookieStore = await cookies();
  return cookieStore.get("access_token")?.value ?? null;
}

export async function GET() {
  const token = await getToken();
  if (!token) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const response = await fetch(`${apiBaseUrl}/buyer/profile`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  const data = await response.text();
  return new Response(data, {
    status: response.status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function PUT(request: Request) {
  const token = await getToken();
  if (!token) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const body = await request.text();
  const response = await fetch(`${apiBaseUrl}/buyer/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body,
  });

  const data = await response.text();
  return new Response(data, {
    status: response.status,
    headers: { "Content-Type": "application/json" },
  });
}
