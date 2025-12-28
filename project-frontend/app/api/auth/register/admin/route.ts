export async function POST(request: Request) {
  const apiBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5010";
  const formData = await request.formData();

  const response = await fetch(`${apiBaseUrl}/auth/register/admin`, {
    method: "POST",
    body: formData,
  });

  const data = await response.text();
  return new Response(data, {
    status: response.status,
    headers: { "Content-Type": "application/json" },
  });
}
