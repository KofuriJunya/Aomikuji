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
    const timeout = setTimeout(() => controller.abort(), 10000); // 10秒で強制中断

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
    }, 10000);
  };

  return (
    <>
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

      {page === "result" && result && (
        <>
          <button
            onClick={() => setPage("start")}
            style={{
              position: "absolute",
              top: "20px",
              left: "20px",
              padding: "8px 16px",
              fontSize: "16px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            戻る
          </button>

          <h1>今日の運勢</h1>

          {/* 文言 */}
          <p>本日のラッキーな星座は{result?.constellation}です！</p>
          <p>{result?.member}の動画を見るとハッピーかも！？</p>

          {/* 画像 */}
          <img
            src={`/photos/${result?.photo}`}
            alt={result?.member}
            style={{ width: "200px", borderRadius: "8px", marginTop: "20px", display: "block", marginLeft: "auto", marginRight: "auto" }}
          />

          {/* 動画 */}
          <iframe
            style={{ width: "100%", maxWidth: "480px", borderRadius: "8px", marginTop: "20px" }}
            height="215"
            src={result?.movie ? toEmbedUrl(result.movie) : ""}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </>
      )}
    </>
  )
}
