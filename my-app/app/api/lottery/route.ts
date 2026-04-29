export async function GET() {
  const gasUrl = process.env.GAS_URL;

  if (!gasUrl) {
    return new Response(JSON.stringify({ error: "GAS_URL is not set" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const res = await fetch(gasUrl);
    if (!res.ok) {
      return new Response(JSON.stringify({ error: "GAS fetch failed", status: res.status }), {
        status: 502,
        headers: { "Content-Type": "application/json" },
      });
    }

    const data = await res.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Fetch error", detail: String(err) }), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    });
  }
}
