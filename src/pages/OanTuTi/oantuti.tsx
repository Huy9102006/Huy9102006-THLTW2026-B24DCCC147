import { useState } from "react";

type Choice = "Kéo" | "Búa" | "Bao";

const choices: Choice[] = ["Kéo", "Búa", "Bao"];
const icons: Record<Choice, string> = { Kéo: "✌️", Búa: "✊", Bao: "🖐️" };

function KetQua(nguoiChoi: Choice, Bot: Choice) {
  if (nguoiChoi === Bot) return "Hòa";
  if (
    (nguoiChoi === "Kéo" && Bot === "Bao") ||
    (nguoiChoi === "Búa" && Bot === "Kéo") ||
    (nguoiChoi === "Bao" && Bot === "Búa")
  ) return "Thắng";
  return "Thua";
}

export default function App() {
  const [nguoiChon, NguoiChoi] = useState<Choice | null>(null);
  const [mayChon, MayChon] = useState<Choice | null>(null);
  const [ketQua, Ket_Qua] = useState<string | null>(null);
  const [lichSu, LichSu] = useState<string[]>([]);

  function choi(luaChon: Choice) {
    const mayNgauNhien = choices[Math.floor(Math.random() * 3)];
    const ketQuaMoi = KetQua(luaChon, mayNgauNhien);
    NguoiChoi(luaChon);
    MayChon(mayNgauNhien);
    Ket_Qua(ketQuaMoi);
    LichSu((cu) => [`${icons[luaChon]} vs ${icons[mayNgauNhien]} → ${ketQuaMoi}`, ...cu]);
  }

  return (
    <div style={{ maxWidth: 360, margin: "40px auto", fontFamily: "sans-serif", textAlign: "center" }}>
      <h2>✊ Oẳn Tù Tì</h2>

      <div style={{ display: "flex", gap: 8, justifyContent: "center", margin: "16px 0" }}>
        {choices.map((luaChon) => (
          <button key={luaChon} onClick={() => choi(luaChon)}>
            {icons[luaChon]} {luaChon}
          </button>
        ))}
      </div>

      {ketQua && (
        <p style={{ color: ketQua === "Thắng" ? "green" : ketQua === "Thua" ? "red" : "orange" }}>
          Bạn: {nguoiChon} — Máy: {mayChon} →{" "}
          <strong>{ketQua === "Thắng" ? "🏆 Thắng!" : ketQua === "Thua" ? "💀 Thua!" : "🤝 Hòa!"}</strong>
        </p>
      )}

      {lichSu.length > 0 && (
        <div style={{ marginTop: 12, textAlign: "left", maxHeight: 160, overflowY: "auto", border: "1px solid #ccc", padding: 8, borderRadius: 6 }}>
          <strong>Lịch sử:</strong>
          {lichSu.map((dong, i) => <p key={i} style={{ margin: "2px 0" }}>{dong}</p>)}
        </div>
      )}
    </div>
  );
}
