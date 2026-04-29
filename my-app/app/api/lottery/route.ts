export async function GET() {
  const gasUrl = process.env.GAS_URL;

  if (!gasUrl) {
    return Response.json({ error: "GAS_URL is not set" }, { status: 500 });
  }

  try {
    const res = await fetch(gasUrl);

    const text = await res.text(); // ← まず text として受け取る

    // JSON かどうか判定
    try {
      const json = JSON.parse(text);
      return Response.json(json, { status: 200 });
    } catch (err) {
      // JSON じゃない → GAS が HTML エラーを返している
      return Response.json(
        { error: "GAS returned non-JSON", raw: text },
        { status: 502 }
      );
    }

  } catch (err) {
    return Response.json(
      { error: "Fetch error", detail: String(err) },
      { status: 502 }
    );
  }
}
