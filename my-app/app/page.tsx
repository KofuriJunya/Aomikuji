"use client";

import { useState, useEffect } from "react";

export default function App() {
  const [page, setPage] = useState("start");
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    const ua = navigator.userAgent;
    let osClass = "desktop";

    if (/Android/i.test(ua)) {
      osClass = "android";
    } else if (/iPhone|iPad|iPod/i.test(ua)) {
      osClass = "ios";
    }

    const body = document.body;
    body.classList.add(osClass);

    const updateSizeClass = () => {
      const width = window.innerWidth;
      body.classList.remove("screen-small", "screen-medium", "screen-large");

      if (width < 768) {
        body.classList.add("screen-small");
      } else if (width < 1025) {
        body.classList.add("screen-medium");
      } else {
        body.classList.add("screen-large");
      }
    };

    updateSizeClass();
    window.addEventListener("resize", updateSizeClass);

    return () => {
      window.removeEventListener("resize", updateSizeClass);
      body.classList.remove(osClass, "screen-small", "screen-medium", "screen-large");
    };
  }, []);

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
          <p>抽選中…</p>
        </>
      )}

      {page === "result" && result && (
        <>
          <div style={{ marginBottom: "20px", display: "flex" }}>
            <button
              onClick={() => setPage("start")}
              style={{
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
          </div>

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
            className="video-iframe"
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
