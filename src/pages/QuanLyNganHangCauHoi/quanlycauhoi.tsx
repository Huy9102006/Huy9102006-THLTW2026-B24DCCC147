import { useState } from "react";

type DoKho = "Dễ" | "Trung bình" | "Khó" | "Rất khó";
type KhoiKT = { id: number; ten: string };
type MonHoc = { id: number; ma: string; ten: string; tinChi: number };
type CauHoi = { id: number; monId: number; noiDung: string; doKho: DoKho; khoiId: number };
type YeuCau = { khoiId: number; doKho: DoKho; soCau: number };
type DeThi = { id: number; monId: number; cauHois: CauHoi[]; yeuCaus: YeuCau[] };

const DS_DO_KHO: DoKho[] = ["Dễ", "Trung bình", "Khó", "Rất khó"];
const TABS = ["Khối KT", "Môn học", "Câu hỏi", "Đề thi"];
const th: React.CSSProperties = { border: "1px solid #ccc", padding: "5px 8px", textAlign: "left", background: "#f5f5f5" };
const td: React.CSSProperties = { border: "1px solid #ccc", padding: "4px 8px" };
const inp: React.CSSProperties = { padding: "5px", border: "1px solid #ccc" };

export default function App() {
  const [tab, setTab] = useState(0);
  const [dsKhoi, setDsKhoi] = useState<KhoiKT[]>([{ id: 1, ten: "Tổng quan" }, { id: 2, ten: "Chuyên sâu" }]);
  const [dsMon, setDsMon] = useState<MonHoc[]>([{ id: 1, ma: "IT001", ten: "Nhập môn CNTT", tinChi: 3 }]);
  const [dsCau, setDsCau] = useState<CauHoi[]>([]);
  const [dsDe, setDsDe] = useState<DeThi[]>([]);

  const [tenKhoi, setTenKhoi] = useState("");
  const [mon, setMon] = useState({ ma: "", ten: "", tinChi: 2 });
  const [cau, setCau] = useState<Omit<CauHoi, "id">>({ monId: 0, noiDung: "", doKho: "Dễ", khoiId: 0 });
  const [loc, setLoc] = useState({ monId: 0, doKho: "", khoiId: 0 });
  const [cauTruc, setCauTruc] = useState<{ monId: number; yeuCaus: YeuCau[] }>({ monId: 0, yeuCaus: [] });
  const [yc, setYc] = useState<YeuCau>({ khoiId: 0, doKho: "Dễ", soCau: 1 });

  const cauLoc = dsCau.filter(c =>
    (!loc.monId || c.monId === loc.monId) &&
    (!loc.doKho || c.doKho === loc.doKho) &&
    (!loc.khoiId || c.khoiId === loc.khoiId)
  );

  const taoDethi = () => {
    const ketQua: CauHoi[] = [];
    for (const r of cauTruc.yeuCaus) {
      const ngan = dsCau.filter(c => c.monId === cauTruc.monId && c.khoiId === r.khoiId && c.doKho === r.doKho);
      if (ngan.length < r.soCau) return alert(`Không đủ câu: ${dsKhoi.find(k => k.id === r.khoiId)?.ten} - ${r.doKho} (cần ${r.soCau}, có ${ngan.length})`);
      ketQua.push(...ngan.sort(() => Math.random() - 0.5).slice(0, r.soCau));
    }
    setDsDe(ds => [...ds, { id: Date.now(), monId: cauTruc.monId, cauHois: ketQua, yeuCaus: cauTruc.yeuCaus }]);
    alert(`Tạo đề thành công! ${ketQua.length} câu.`);
  };

  return (
    <div style={{ fontFamily: "monospace", maxWidth: 860, margin: "0 auto", padding: 16 }}>
      <h2>Ngân hàng câu hỏi tự luận</h2>
      <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
        {TABS.map((t, i) => <button key={i} onClick={() => setTab(i)} style={{ padding: "6px 14px", background: tab === i ? "#333" : "#eee", color: tab === i ? "#fff" : "#000", border: "none", cursor: "pointer" }}>{t}</button>)}
      </div>

      {tab === 0 && <>
        <h3>Khối kiến thức</h3>
        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          <input style={inp} placeholder="Tên khối" value={tenKhoi} onChange={e => setTenKhoi(e.target.value)} />
          <button onClick={() => { if (tenKhoi) { setDsKhoi(ds => [...ds, { id: Date.now(), ten: tenKhoi }]); setTenKhoi(""); } }}>Thêm</button>
        </div>
        <table style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead><tr><th style={th}>ID</th><th style={th}>Tên khối</th><th style={th}>Xoá</th></tr></thead>
          <tbody>{dsKhoi.map(k => <tr key={k.id}><td style={td}>{k.id}</td><td style={td}>{k.ten}</td><td style={td}><button onClick={() => setDsKhoi(ds => ds.filter(x => x.id !== k.id))}>🗑</button></td></tr>)}</tbody>
        </table>
      </>}

      {tab === 1 && <>
        <h3>Môn học</h3>
        <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
          <input style={{ ...inp, width: 80 }} placeholder="Mã môn" value={mon.ma} onChange={e => setMon(m => ({ ...m, ma: e.target.value }))} />
          <input style={{ ...inp, flex: 1 }} placeholder="Tên môn" value={mon.ten} onChange={e => setMon(m => ({ ...m, ten: e.target.value }))} />
          <input style={{ ...inp, width: 60 }} type="number" placeholder="TC" value={mon.tinChi} onChange={e => setMon(m => ({ ...m, tinChi: +e.target.value }))} />
          <button onClick={() => { if (mon.ma && mon.ten) { setDsMon(ds => [...ds, { id: Date.now(), ...mon }]); setMon({ ma: "", ten: "", tinChi: 2 }); } }}>Thêm</button>
        </div>
        <table style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead><tr><th style={th}>Mã</th><th style={th}>Tên môn</th><th style={th}>Tín chỉ</th><th style={th}>Xoá</th></tr></thead>
          <tbody>{dsMon.map(m => <tr key={m.id}><td style={td}>{m.ma}</td><td style={td}>{m.ten}</td><td style={td}>{m.tinChi}</td><td style={td}><button onClick={() => setDsMon(ds => ds.filter(x => x.id !== m.id))}>🗑</button></td></tr>)}</tbody>
        </table>
      </>}

      {tab === 2 && <>
        <h3>Câu hỏi</h3>
        <div style={{ display: "flex", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
          <select style={inp} value={cau.monId} onChange={e => setCau(c => ({ ...c, monId: +e.target.value }))}>
            <option value={0}> Môn </option>
            {dsMon.map(m => <option key={m.id} value={m.id}>{m.ten}</option>)}
          </select>
          <select style={inp} value={cau.khoiId} onChange={e => setCau(c => ({ ...c, khoiId: +e.target.value }))}>
            <option value={0}> Khối KT </option>
            {dsKhoi.map(k => <option key={k.id} value={k.id}>{k.ten}</option>)}
          </select>
          <select style={inp} value={cau.doKho} onChange={e => setCau(c => ({ ...c, doKho: e.target.value as DoKho }))}>
            {DS_DO_KHO.map(d => <option key={d}>{d}</option>)}
          </select>
        </div>
        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          <textarea style={{ ...inp, flex: 1, minHeight: 55 }} placeholder="Nội dung câu hỏi" value={cau.noiDung} onChange={e => setCau(c => ({ ...c, noiDung: e.target.value }))} />
          <button onClick={() => { if (cau.noiDung && cau.monId && cau.khoiId) { setDsCau(ds => [...ds, { id: Date.now(), ...cau }]); setCau(c => ({ ...c, noiDung: "" })); } }}>Thêm</button>
        </div>
        <div style={{ display: "flex", gap: 8, marginBottom: 8, background: "#f8f8f8", padding: 8, flexWrap: "wrap" }}>
          <b>Lọc:</b>
          <select style={inp} value={loc.monId} onChange={e => setLoc(l => ({ ...l, monId: +e.target.value }))}>
            <option value={0}>Tất cả môn</option>{dsMon.map(m => <option key={m.id} value={m.id}>{m.ten}</option>)}
          </select>
          <select style={inp} value={loc.doKho} onChange={e => setLoc(l => ({ ...l, doKho: e.target.value }))}>
            <option value="">Tất cả độ khó</option>{DS_DO_KHO.map(d => <option key={d}>{d}</option>)}
          </select>
          <select style={inp} value={loc.khoiId} onChange={e => setLoc(l => ({ ...l, khoiId: +e.target.value }))}>
            <option value={0}>Tất cả khối</option>{dsKhoi.map(k => <option key={k.id} value={k.id}>{k.ten}</option>)}
          </select>
        </div>
        <table style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead><tr><th style={th}>Môn</th><th style={th}>Nội dung</th><th style={th}>Độ khó</th><th style={th}>Khối KT</th><th style={th}>Xoá</th></tr></thead>
          <tbody>{cauLoc.map(c => <tr key={c.id}>
            <td style={td}>{dsMon.find(m => m.id === c.monId)?.ten}</td>
            <td style={td}>{c.noiDung}</td>
            <td style={td}>{c.doKho}</td>
            <td style={td}>{dsKhoi.find(k => k.id === c.khoiId)?.ten}</td>
            <td style={td}><button onClick={() => setDsCau(ds => ds.filter(x => x.id !== c.id))}>🗑</button></td>
          </tr>)}</tbody>
        </table>
      </>}

      {tab === 3 && <>
        <h3>Tạo đề thi</h3>
        <div style={{ display: "flex", gap: 8, marginBottom: 12, alignItems: "center" }}>
          <b>Môn:</b>
          <select style={inp} value={cauTruc.monId} onChange={e => setCauTruc(ct => ({ ...ct, monId: +e.target.value }))}>
            <option value={0}>Chọn môn</option>
            {dsMon.map(m => <option key={m.id} value={m.id}>{m.ten}</option>)}
          </select>
        </div>
        <div style={{ display: "flex", gap: 8, marginBottom: 8, background: "#f8f8f8", padding: 8, flexWrap: "wrap", alignItems: "center" }}>
          <b>Thêm yêu cầu:</b>
          <select style={inp} value={yc.khoiId} onChange={e => setYc(y => ({ ...y, khoiId: +e.target.value }))}>
            <option value={0}> Khối </option>{dsKhoi.map(k => <option key={k.id} value={k.id}>{k.ten}</option>)}
          </select>
          <select style={inp} value={yc.doKho} onChange={e => setYc(y => ({ ...y, doKho: e.target.value as DoKho }))}>
            {DS_DO_KHO.map(d => <option key={d}>{d}</option>)}
          </select>
          <input style={{ ...inp, width: 60 }} type="number" min={1} value={yc.soCau} onChange={e => setYc(y => ({ ...y, soCau: +e.target.value }))} />
          <button onClick={() => { if (yc.khoiId) setCauTruc(ct => ({ ...ct, yeuCaus: [...ct.yeuCaus, { ...yc }] })); }}>+ Thêm</button>
        </div>
        {cauTruc.yeuCaus.length > 0 && <table style={{ borderCollapse: "collapse", width: "100%", marginBottom: 8 }}>
          <thead><tr><th style={th}>Khối KT</th><th style={th}>Độ khó</th><th style={th}>Số câu</th><th style={th}>Xoá</th></tr></thead>
          <tbody>{cauTruc.yeuCaus.map((r, i) => <tr key={i}>
            <td style={td}>{dsKhoi.find(k => k.id === r.khoiId)?.ten}</td>
            <td style={td}>{r.doKho}</td><td style={td}>{r.soCau}</td>
            <td style={td}><button onClick={() => setCauTruc(ct => ({ ...ct, yeuCaus: ct.yeuCaus.filter((_, j) => j !== i) }))}>🗑</button></td>
          </tr>)}</tbody>
        </table>}
        <button onClick={taoDethi} style={{ padding: "7px 16px", background: "#333", color: "#fff", border: "none", cursor: "pointer", marginBottom: 16 }}>📄 Tạo đề thi</button>
        <h4>Đề đã lưu ({dsDe.length})</h4>
        {dsDe.map(de => <details key={de.id} style={{ border: "1px solid #ddd", marginBottom: 8, padding: 8 }}>
          <summary style={{ cursor: "pointer" }}>Đề #{de.id} — {dsMon.find(m => m.id === de.monId)?.ten} — {de.cauHois.length} câu</summary>
          <ol style={{ marginTop: 8 }}>{de.cauHois.map((c, i) => <li key={i} style={{ marginBottom: 4 }}><b>[{c.doKho}]</b> {c.noiDung} <i>({dsKhoi.find(k => k.id === c.khoiId)?.ten})</i></li>)}</ol>
        </details>)}
      </>}
    </div>
  );
}
