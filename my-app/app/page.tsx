"use client";

import { useState, useEffect } from "react";

export default function App() {
  const [page, setPage] = useState("start");

  // 抽選画面 → 数秒後に結果画面へ
  useEffect(() => {
    if (page === "animation") {
      const timer = setTimeout(() => {
        setPage("result");
      }, 2000); // 2秒後に遷移

      return () => clearTimeout(timer);
    }
  }, [page]);

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
        </>
      )}
    </div>
  );
}
