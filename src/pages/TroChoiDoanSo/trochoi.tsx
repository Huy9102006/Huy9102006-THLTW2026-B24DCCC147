import { useState } from "react";

export default function DoanSo() {
  const [SoRandom] = useState(() => Math.floor(Math.random() * 100) + 1);
  const [SoNhapVao, setNhapSo] = useState("");
  const [LuotConLai, setLuotCon] = useState(10);
  const [ThongBao, setThongBao] = useState("");
  const [KetThuc, setKetThuc] = useState(false);

  const xuLyThongtin = () => {
    const SoCanDoan = parseInt(SoNhapVao);
    if (isNaN(SoCanDoan) || SoCanDoan < 1 || SoCanDoan > 100) {
      setThongBao("Vui lòng nhập số từ 1 đến 100!");
      return;
    }
    const LuotMoi = LuotConLai - 1;
    setLuotCon(LuotMoi);
    setNhapSo("");
    if (SoCanDoan < SoRandom) setThongBao("Bạn đoán quá thấp");
    else if (SoCanDoan > SoRandom) setThongBao("Bạn đoán quá cao");
    else { setThongBao("Chúc mừng, Bạn đã đoán đúng"); setKetThuc(true); return; }
    if (LuotMoi === 0) { setThongBao(`Bạn đã hết lượt! Số đúng là ${SoRandom}.`); setKetThuc(true); }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", gap: "10px", fontFamily: "monospace" }}>
      <h2>Đoán Số Bí Ẩn</h2>
      <p>Số từ 1 - 100 | Còn {LuotConLai} lượt</p>
      <p>{ThongBao}</p>
      {!KetThuc && (
        <>
          <input
            type="number"
            value={SoNhapVao}
            onChange={e => setNhapSo(e.target.value)}
            onKeyDown={e => e.key === "Enter" && xuLyThongtin()}
            placeholder="Nhập số..."
            style={{ padding: "6px", textAlign: "center" }}
          />
          <button onClick={xuLyThongtin} 
          style={{ padding: "6px 16px", cursor: "pointer"}}>Đoán</button>
        </>
      )}
      {KetThuc && (
        <button onClick={() => window.location.reload()} style={{ padding: "6px 16px", cursor: "pointer" }}>Chơi lại</button>
      )}
    </div>
  );
}