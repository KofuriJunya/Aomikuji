"use client";

import { useState, useEffect } from "react";

export default function App() {
  const [page, setPage] = useState("start");
　const [result, setResult] = useState<any>(null);

  // 抽選開始 → GAS へ fetch → 結果画面へ
  const startLottery = async () => {
    setPage("animation");

    try {
      const res = await fetch("/api/lottery");
      const data = await res.json();

      setResult(data);
    } catch (err) {
      setResult({ error: "GAS との通信に失敗しました" });
    }

    // 2秒後に結果画面へ
    setTimeout(() => {
      setPage("result");
    }, 2000);
  };

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      {page === "start" && (
        <>
          <h1>初期画面</h1>
          <button
            onClick={() => setPage("animation")}
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

      {page === "result" && (
        <>
          <h1>抽選結果</h1>
          <p>ここに結果が表示されます</p>
          <pre style={{ textAlign: "left", display: "inline-block" }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </>
      )}
    </div>
  );
}
