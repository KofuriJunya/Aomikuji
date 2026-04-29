"use client";

import { useState, useEffect } from "react";

export default function App() {
  const [page, setPage] = useState("start");
  const [result, setResult] = useState<any>(null);


  function toEmbedUrl(url: string) {
    // youtu.be/xxxx の後ろを取り出す
    const id = url.split("youtu.be/")[1].split("?")[0];
    console.info(`https://www.youtube.com/embed/${id}`);
    return `https://www.youtube.com/embed/${id}`;
  }

  const startLottery = async () => {
    setPage("animation");

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000); // 3秒で強制中断

    try {
      const res = await fetch("/api/lottery", { signal: controller.signal });
      clearTimeout(timeout);

      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error("fetch エラー:", err);
      setResult({ error: "GAS との通信に失敗しました" });
    }

    setTimeout(() => {
      setPage("result");
    }, 5000);
  };

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      {page === "start" && (
        <>
          <h1>初期画面</h1>
          <button
            onClick={startLottery}
            style={{ padding: "10px 20px", fontSize: "18px" }}
          >
            占う
          </button>
        </>
      )}

      {page === "animation" && (
        <>
          <h1>抽選画面</h1>
          <p>抽選中…</p>
        </>
      )}

      {page === "result" && result ? (
        <>
          <h1>抽選結果</h1>

          <pre style={{ textAlign: "left", display: "inline-block" }}>
            {JSON.stringify(result, null, 2)}
          </pre>

          <p>{result?.member} の動画を見るとハッピーかも！？</p>
          <p>埋め込みURL: {result?.movie}</p>
          <p>画像: {result?.photo}</p>
        </>
      ) : (
        <p>結果を読み込み中...</p>
      )}
      
    </div>
  );
}
