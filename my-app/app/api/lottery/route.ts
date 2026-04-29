export async function GET() {
  const gasUrl = process.env.GAS_URL;

  const res = await fetch(gasUrl);
  const data = await res.json();

  return Response.json(data);
}