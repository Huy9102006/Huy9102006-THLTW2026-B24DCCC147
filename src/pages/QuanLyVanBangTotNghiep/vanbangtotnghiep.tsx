import { useState} from "react";

type FieldType = "String" | "Number" | "Date";
interface CustomField { id: string; name: string; type: FieldType; }
interface DiplomaBook { id: string; year: number; name: string; }
interface Decision { id: string; number: string; date: string; summary: string; bookId: string; lookupCount: number; }
interface DiplomaRecord {
  id: string; entryNo: number; diplomaNo: string; studentId: string; fullName: string; dob: string;
  decisionId: string; customValues: Record<string, string>;
}

const initFields: CustomField[] = [
  { id: "f1", name: "Dân tộc", type: "String" },
  { id: "f2", name: "Nơi sinh", type: "String" },
  { id: "f3", name: "Điểm trung bình", type: "Number" },
  { id: "f4", name: "Xếp hạng", type: "String" },
  { id: "f5", name: "Hệ đào tạo", type: "String" },
  { id: "f6", name: "Ngày nhập học", type: "Date" },
];
const initBooks: DiplomaBook[] = [
  { id: "b2024", year: 2024, name: "Sổ văn bằng 2024" },
  { id: "b2025", year: 2025, name: "Sổ văn bằng 2025" },
];
const initDecisions: Decision[] = [
  { id: "d1", number: "01/QĐ-ĐT", date: "2024-06-15", summary: "Công nhận tốt nghiệp đợt 1 năm 2024", bookId: "b2024", lookupCount: 5 },
  { id: "d2", number: "02/QĐ-ĐT", date: "2024-12-20", summary: "Công nhận tốt nghiệp đợt 2 năm 2024", bookId: "b2024", lookupCount: 3 },
];
const initRecords: DiplomaRecord[] = [
  { id: "r1", entryNo: 1, diplomaNo: "VB001/2024", studentId: "SV001", fullName: "Nguyễn Văn An", dob: "2002-01-15", decisionId: "d1", customValues: { f1: "Kinh", f2: "Hà Nội", f3: "3.5", f4: "Giỏi", f5: "Chính quy", f6: "2020-09-01" } },
  { id: "r2", entryNo: 2, diplomaNo: "VB002/2024", studentId: "SV002", fullName: "Trần Thị Bình", dob: "2002-03-22", decisionId: "d1", customValues: { f1: "Kinh", f2: "TP.HCM", f3: "3.8", f4: "Xuất sắc", f5: "Chính quy", f6: "2020-09-01" } },
  { id: "r3", entryNo: 1, diplomaNo: "VB001/2024B", studentId: "SV003", fullName: "Lê Minh Cường", dob: "2001-11-10", decisionId: "d2", customValues: { f1: "Tày", f2: "Lạng Sơn", f3: "3.2", f4: "Khá", f5: "Chính quy", f6: "2020-09-01" } },
];

const css = `
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Segoe UI', sans-serif; font-size: 14px; background: #f0f2f5; }
.app { display: flex; height: 100vh; }
.sidebar { width: 220px; background: #1a2236; color: #cdd5e0; display: flex; flex-direction: column; flex-shrink: 0; }
.sidebar h2 { padding: 16px; font-size: 13px; color: #fff; background: #111827; border-bottom: 1px solid #2d3a50; }
.nav-item { padding: 10px 16px; cursor: pointer; font-size: 13px; border-left: 3px solid transparent; }
.nav-item:hover { background: #2d3a50; }
.nav-item.active { background: #2d3a50; border-left-color: #3b82f6; color: #fff; }
.main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
.topbar { background: #fff; border-bottom: 1px solid #e5e7eb; padding: 12px 20px; font-weight: 600; font-size: 15px; color: #1a2236; }
.content { flex: 1; overflow-y: auto; padding: 20px; }
.card { background: #fff; border: 1px solid #e5e7eb; border-radius: 6px; padding: 16px; margin-bottom: 16px; }
.card h3 { font-size: 14px; font-weight: 600; margin-bottom: 12px; color: #1a2236; }
table { width: 100%; border-collapse: collapse; font-size: 13px; }
th { background: #f8fafc; text-align: left; padding: 8px 10px; border-bottom: 2px solid #e5e7eb; font-weight: 600; color: #374151; }
td { padding: 8px 10px; border-bottom: 1px solid #f0f2f5; vertical-align: middle; }
tr:hover td { background: #f8fafc; }
.btn { padding: 6px 14px; border-radius: 4px; border: none; cursor: pointer; font-size: 13px; }
.btn-primary { background: #3b82f6; color: #fff; }
.btn-primary:hover { background: #2563eb; }
.btn-danger { background: #ef4444; color: #fff; }
.btn-danger:hover { background: #dc2626; }
.btn-sm { padding: 4px 10px; font-size: 12px; }
.btn-secondary { background: #e5e7eb; color: #374151; }
.btn-secondary:hover { background: #d1d5db; }
input, select, textarea { border: 1px solid #d1d5db; border-radius: 4px; padding: 6px 10px; font-size: 13px; width: 100%; }
input:focus, select:focus { outline: none; border-color: #3b82f6; }
label { display: block; margin-bottom: 4px; font-size: 12px; color: #6b7280; font-weight: 500; }
.form-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
.form-grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
.form-group { margin-bottom: 10px; }
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 100; }
.modal { background: #fff; border-radius: 8px; padding: 20px; width: 680px; max-height: 85vh; overflow-y: auto; }
.modal-title { font-weight: 700; font-size: 15px; margin-bottom: 16px; color: #1a2236; }
.modal-footer { display: flex; justify-content: flex-end; gap: 8px; margin-top: 16px; }
.badge { display: inline-block; padding: 2px 8px; border-radius: 10px; font-size: 11px; font-weight: 600; }
.badge-blue { background: #dbeafe; color: #1d4ed8; }
.badge-green { background: #dcfce7; color: #15803d; }
.badge-gray { background: #f3f4f6; color: #374151; }
.search-row { display: flex; gap: 10px; align-items: flex-end; margin-bottom: 16px; flex-wrap: wrap; }
.search-row .form-group { margin-bottom: 0; flex: 1; min-width: 140px; }
.tag-string { color: #7c3aed; font-weight: 600; }
.tag-number { color: #0891b2; font-weight: 600; }
.tag-date { color: #b45309; font-weight: 600; }
.info-row { display: flex; gap: 24px; margin-bottom: 8px; }
.info-item label { font-size: 11px; color: #6b7280; }
.info-item span { font-size: 13px; font-weight: 500; }
.divider { border: none; border-top: 1px solid #e5e7eb; margin: 12px 0; }
.actions { display: flex; gap: 6px; }
.top-actions { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.stat-cards { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 16px; }
.stat-card { background: #fff; border: 1px solid #e5e7eb; border-radius: 6px; padding: 14px; text-align: center; }
.stat-card .value { font-size: 24px; font-weight: 700; color: #3b82f6; }
.stat-card .label { font-size: 12px; color: #6b7280; margin-top: 4px; }
`;

export default function App() {
  const [tab, setTab] = useState("lookup");
  const [fields, setFields] = useState<CustomField[]>(initFields);
  const [books, setBooks] = useState<DiplomaBook[]>(initBooks);
  const [decisions, setDecisions] = useState<Decision[]>(initDecisions);
  const [records, setRecords] = useState<DiplomaRecord[]>(initRecords);

  const pages = [
    { id: "lookup", label: "Tra cứu văn bằng" },
    { id: "books", label: "Sổ văn bằng" },
    { id: "decisions", label: "Quyết định tốt nghiệp" },
    { id: "records", label: "Thông tin văn bằng" },
    { id: "fields", label: "Cấu hình biểu mẫu" },
  ];

  const titles: Record<string, string> = {
    lookup: "Tra cứu văn bằng", books: "Quản lý sổ văn bằng",
    decisions: "Quyết định tốt nghiệp", records: "Thông tin văn bằng", fields: "Cấu hình biểu mẫu phụ lục",
  };

  return (
    <>
      <style>{css}</style>
      <div className="app">
        <div className="sidebar">
          <h2>Quản lý văn bằng</h2>
          {pages.map(p => (
            <div key={p.id} className={`nav-item ${tab === p.id ? "active" : ""}`} onClick={() => setTab(p.id)}>{p.label}</div>
          ))}
        </div>
        <div className="main">
          <div className="topbar">{titles[tab]}</div>
          <div className="content">
            {tab === "lookup" && <LookupPage records={records} decisions={decisions} books={books} fields={fields} setDecisions={setDecisions} />}
            {tab === "books" && <BooksPage books={books} setBooks={setBooks} records={records} decisions={decisions} />}
            {tab === "decisions" && <DecisionsPage decisions={decisions} setDecisions={setDecisions} books={books} records={records} />}
            {tab === "records" && <RecordsPage records={records} setRecords={setRecords} decisions={decisions} fields={fields} books={books} />}
            {tab === "fields" && <FieldsPage fields={fields} setFields={setFields} records={records} />}
          </div>
        </div>
      </div>
    </>
  );
}

function LookupPage({ records, decisions, books, fields, setDecisions }: any) {
  const [params, setParams] = useState({ diplomaNo: "", entryNo: "", studentId: "", fullName: "", dob: "" });
  const [results, setResults] = useState<DiplomaRecord[] | null>(null);
  const [detail, setDetail] = useState<DiplomaRecord | null>(null);
  const [err, setErr] = useState("");

  const filled = Object.values(params).filter(v => v.trim()).length;

  function search() {
    if (filled < 2) { setErr("Vui lòng nhập ít nhất 2 tham số tìm kiếm."); return; }
    setErr("");
    const res = records.filter((r: DiplomaRecord) => {
      const checks = [
        params.diplomaNo && r.diplomaNo.toLowerCase().includes(params.diplomaNo.toLowerCase()),
        params.entryNo && String(r.entryNo) === params.entryNo,
        params.studentId && r.studentId.toLowerCase().includes(params.studentId.toLowerCase()),
        params.fullName && r.fullName.toLowerCase().includes(params.fullName.toLowerCase()),
        params.dob && r.dob === params.dob,
      ].filter(Boolean);
      const activeCount = [params.diplomaNo, params.entryNo, params.studentId, params.fullName, params.dob].filter(v => v.trim()).length;
      return checks.length === activeCount;
    });
    setResults(res);
    if (res.length > 0) {
     const decId = Array.from(new Set(res.map((r: DiplomaRecord) => r.decisionId)));
      setDecisions((prev: Decision[]) => prev.map((d: Decision) => decId.includes(d.id) ? { ...d, lookupCount: d.lookupCount + 1 } : d));
    }
  }

  const dec = detail ? decisions.find((d: Decision) => d.id === detail.decisionId) : null;
  const book = dec ? books.find((b: DiplomaBook) => b.id === dec.bookId) : null;

  return (
    <div>
      <div className="card">
        <h3>Tìm kiếm văn bằng <span style={{ fontWeight: 400, color: "#6b7280" }}>(nhập ít nhất 2 tham số)</span></h3>
        <div className="form-grid">
          <div className="form-group"><label>Số hiệu văn bằng</label><input value={params.diplomaNo} onChange={e => setParams(p => ({ ...p, diplomaNo: e.target.value }))} placeholder="VB001/2024" /></div>
          <div className="form-group"><label>Số vào sổ</label><input value={params.entryNo} onChange={e => setParams(p => ({ ...p, entryNo: e.target.value }))} placeholder="1" /></div>
          <div className="form-group"><label>Mã sinh viên</label><input value={params.studentId} onChange={e => setParams(p => ({ ...p, studentId: e.target.value }))} placeholder="SV001" /></div>
          <div className="form-group"><label>Họ tên</label><input value={params.fullName} onChange={e => setParams(p => ({ ...p, fullName: e.target.value }))} placeholder="Nguyễn Văn An" /></div>
          <div className="form-group"><label>Ngày sinh</label><input type="date" value={params.dob} onChange={e => setParams(p => ({ ...p, dob: e.target.value }))} /></div>
          <div className="form-group" style={{ display: "flex", alignItems: "flex-end" }}>
            <button className="btn btn-primary" style={{ width: "100%" }} onClick={search}>🔍 Tìm kiếm ({filled}/5)</button>
          </div>
        </div>
        {err && <div style={{ color: "#ef4444", marginTop: 8, fontSize: 13 }}>{err}</div>}
      </div>

      {results !== null && (
        <div className="card">
          <h3>Kết quả: {results.length} văn bằng</h3>
          {results.length === 0 ? <div style={{ color: "#6b7280" }}>Không tìm thấy kết quả phù hợp.</div> : (
            <table>
              <thead><tr><th>Số vào sổ</th><th>Số hiệu VB</th><th>MSV</th><th>Họ tên</th><th>Ngày sinh</th><th>Quyết định</th><th></th></tr></thead>
              <tbody>{results.map((r: DiplomaRecord) => {
                const d = decisions.find((x: Decision) => x.id === r.decisionId);
                return (
                  <tr key={r.id}>
                    <td>{r.entryNo}</td><td><span className="badge badge-blue">{r.diplomaNo}</span></td>
                    <td>{r.studentId}</td><td>{r.fullName}</td><td>{r.dob}</td>
                    <td>{d?.number}</td>
                    <td><button className="btn btn-sm btn-primary" onClick={() => setDetail(r)}>Xem</button></td>
                  </tr>
                );
              })}</tbody>
            </table>
          )}
        </div>
      )}

      {detail && (
        <div className="modal-overlay" onClick={() => setDetail(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">Chi tiết văn bằng</div>
            <div className="card" style={{ margin: 0 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
                <div><label>Số hiệu văn bằng</label><span className="badge badge-blue">{detail.diplomaNo}</span></div>
                <div><label>Số vào sổ</label><b>{detail.entryNo}</b></div>
                <div><label>Mã sinh viên</label>{detail.studentId}</div>
                <div><label>Họ tên</label><b>{detail.fullName}</b></div>
                <div><label>Ngày sinh</label>{detail.dob}</div>
              </div>
              <hr className="divider" />
              <div style={{ marginBottom: 8, fontWeight: 600, fontSize: 13 }}>Thông tin thêm</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {fields.map((f: CustomField) => (
                  <div key={f.id}><label>{f.name}</label>{detail.customValues[f.id] || "—"}</div>
                ))}
              </div>
              <hr className="divider" />
              <div style={{ marginBottom: 4, fontWeight: 600, fontSize: 13 }}>Quyết định tốt nghiệp</div>
              {dec && <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <div><label>Số QĐ</label>{dec.number}</div>
                <div><label>Ngày ban hành</label>{dec.date}</div>
                <div style={{ gridColumn: "1/-1" }}><label>Trích yếu</label>{dec.summary}</div>
                <div><label>Sổ văn bằng</label>{book?.name}</div>
              </div>}
            </div>
            <div className="modal-footer"><button className="btn btn-secondary" onClick={() => setDetail(null)}>Đóng</button></div>
          </div>
        </div>
      )}
    </div>
  );
}

function BooksPage({ books, setBooks, records, decisions }: any) {
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ year: new Date().getFullYear() });
  const [editId, setEditId] = useState<string | null>(null);

  function save() {
    if (editId) {
      setBooks((prev: DiplomaBook[]) => prev.map(b => b.id === editId ? { ...b, year: form.year, name: `Sổ văn bằng ${form.year}` } : b));
    } else {
      const id = "b" + form.year + Date.now();
      setBooks((prev: DiplomaBook[]) => [...prev, { id, year: form.year, name: `Sổ văn bằng ${form.year}` }]);
    }
    setShow(false); setEditId(null);
  }

  function del(id: string) {
    const hasDecision = decisions.some((d: Decision) => d.bookId === id);
    if (hasDecision) { alert("Không thể xóa: sổ đang có quyết định liên kết."); return; }
    setBooks((prev: DiplomaBook[]) => prev.filter(b => b.id !== id));
  }

  function openEdit(b: DiplomaBook) { setForm({ year: b.year }); setEditId(b.id); setShow(true); }

  return (
    <div>
      <div className="stat-cards">
        <div className="stat-card"><div className="value">{books.length}</div><div className="label">Tổng số sổ</div></div>
        <div className="stat-card"><div className="value">{decisions.length}</div><div className="label">Quyết định</div></div>
        <div className="stat-card"><div className="value">{records.length}</div><div className="label">Văn bằng</div></div>
        <div className="stat-card"><div className="value">{decisions.reduce((s: number, d: Decision) => s + d.lookupCount, 0)}</div><div className="label">Lượt tra cứu</div></div>
      </div>
      <div className="card">
        <div className="top-actions">
          <h3>Danh sách sổ văn bằng</h3>
          <button className="btn btn-primary btn-sm" onClick={() => { setForm({ year: new Date().getFullYear() }); setEditId(null); setShow(true); }}>+ Tạo sổ mới</button>
        </div>
        <table>
          <thead><tr><th>Tên sổ</th><th>Năm</th><th>Số QĐ</th><th>Số VB</th><th></th></tr></thead>
          <tbody>{books.map((b: DiplomaBook) => {
            const ds = decisions.filter((d: Decision) => d.bookId === b.id);
            const rs = records.filter((r: DiplomaRecord) => ds.some((d: Decision) => d.id === r.decisionId));
            return (
              <tr key={b.id}>
                <td><b>{b.name}</b></td><td>{b.year}</td>
                <td><span className="badge badge-gray">{ds.length}</span></td>
                <td><span className="badge badge-blue">{rs.length}</span></td>
                <td><div className="actions">
                  <button className="btn btn-sm btn-secondary" onClick={() => openEdit(b)}>Sửa</button>
                  <button className="btn btn-sm btn-danger" onClick={() => del(b.id)}>Xóa</button>
                </div></td>
              </tr>
            );
          })}</tbody>
        </table>
      </div>
      {show && (
        <div className="modal-overlay"><div className="modal" style={{ width: 360 }}>
          <div className="modal-title">{editId ? "Sửa sổ văn bằng" : "Tạo sổ văn bằng mới"}</div>
          <div className="form-group"><label>Năm</label><input type="number" value={form.year} onChange={e => setForm({ year: +e.target.value })} /></div>
          <div style={{ padding: "8px", background: "#f8fafc", borderRadius: 4, fontSize: 12, color: "#6b7280" }}>Tên sổ: Sổ văn bằng {form.year}</div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={() => setShow(false)}>Hủy</button>
            <button className="btn btn-primary" onClick={save}>Lưu</button>
          </div>
        </div></div>
      )}
    </div>
  );
}

function DecisionsPage({ decisions, setDecisions, books, records }: any) {
  const empty = { number: "", date: "", summary: "", bookId: books[0]?.id || "" };
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ ...empty });
  const [editId, setEditId] = useState<string | null>(null);

  function save() {
    if (!form.number || !form.date || !form.summary || !form.bookId) { alert("Vui lòng điền đầy đủ thông tin."); return; }
    if (editId) {
      setDecisions((prev: Decision[]) => prev.map(d => d.id === editId ? { ...d, ...form } : d));
    } else {
      setDecisions((prev: Decision[]) => [...prev, { id: "d" + Date.now(), ...form, lookupCount: 0 }]);
    }
    setShow(false); setEditId(null);
  }

  function del(id: string) {
    if (records.some((r: DiplomaRecord) => r.decisionId === id)) { alert("Không thể xóa: đang có văn bằng liên kết."); return; }
    setDecisions((prev: Decision[]) => prev.filter(d => d.id !== id));
  }

  function openEdit(d: Decision) { setForm({ number: d.number, date: d.date, summary: d.summary, bookId: d.bookId }); setEditId(d.id); setShow(true); }

  return (
    <div>
      <div className="card">
        <div className="top-actions">
          <h3>Danh sách quyết định tốt nghiệp</h3>
          <button className="btn btn-primary btn-sm" onClick={() => { setForm({ ...empty }); setEditId(null); setShow(true); }}>+ Thêm quyết định</button>
        </div>
        <table>
          <thead><tr><th>Số QĐ</th><th>Ngày ban hành</th><th>Trích yếu</th><th>Sổ VB</th><th>Số VB</th><th>Lượt tra cứu</th><th></th></tr></thead>
          <tbody>{decisions.map((d: Decision) => {
            const book = books.find((b: DiplomaBook) => b.id === d.bookId);
            const cnt = records.filter((r: DiplomaRecord) => r.decisionId === d.id).length;
            return (
              <tr key={d.id}>
                <td><b>{d.number}</b></td><td>{d.date}</td>
                <td style={{ maxWidth: 250, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.summary}</td>
                <td>{book?.name}</td>
                <td><span className="badge badge-blue">{cnt}</span></td>
                <td><span className="badge badge-green">{d.lookupCount}</span></td>
                <td><div className="actions">
                  <button className="btn btn-sm btn-secondary" onClick={() => openEdit(d)}>Sửa</button>
                  <button className="btn btn-sm btn-danger" onClick={() => del(d.id)}>Xóa</button>
                </div></td>
              </tr>
            );
          })}</tbody>
        </table>
      </div>
      {show && (
        <div className="modal-overlay"><div className="modal" style={{ width: 520 }}>
          <div className="modal-title">{editId ? "Sửa quyết định" : "Thêm quyết định tốt nghiệp"}</div>
          <div className="form-grid-2">
            <div className="form-group"><label>Số QĐ *</label><input value={form.number} onChange={e => setForm(p => ({ ...p, number: e.target.value }))} placeholder="01/QĐ-ĐT" /></div>
            <div className="form-group"><label>Ngày ban hành *</label><input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} /></div>
          </div>
          <div className="form-group"><label>Trích yếu *</label><textarea value={form.summary} onChange={e => setForm(p => ({ ...p, summary: e.target.value }))} rows={2} /></div>
          <div className="form-group"><label>Sổ văn bằng *</label>
            <select value={form.bookId} onChange={e => setForm(p => ({ ...p, bookId: e.target.value }))}>
              {books.map((b: DiplomaBook) => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={() => setShow(false)}>Hủy</button>
            <button className="btn btn-primary" onClick={save}>Lưu</button>
          </div>
        </div></div>
      )}
    </div>
  );
}

function RecordsPage({ records, setRecords, decisions, fields, books }: any) {
  const emptyForm = () => ({
    diplomaNo: "", studentId: "", fullName: "", dob: "", decisionId: decisions[0]?.id || "",
    customValues: Object.fromEntries(fields.map((f: CustomField) => [f.id, ""]))
  });
  const [show, setShow] = useState(false);
  const [form, setForm] = useState<any>(emptyForm());
  const [editId, setEditId] = useState<string | null>(null);
  const [filterDec, setFilterDec] = useState("");

  function getNextEntryNo(decisionId: string) {
    const dec = decisions.find((d: Decision) => d.id === decisionId);
    if (!dec) return 1;
    const bookRecords = records.filter((r: DiplomaRecord) => {
      const rd = decisions.find((d: Decision) => d.id === r.decisionId);
      return rd?.bookId === dec.bookId;
    });
    return bookRecords.length + 1;
  }

  function save() {
    if (!form.diplomaNo || !form.studentId || !form.fullName || !form.dob || !form.decisionId) { alert("Vui lòng điền đầy đủ thông tin."); return; }
    if (editId) {
      setRecords((prev: DiplomaRecord[]) => prev.map(r => r.id === editId ? { ...r, ...form, entryNo: r.entryNo } : r));
    } else {
      const entryNo = getNextEntryNo(form.decisionId);
      setRecords((prev: DiplomaRecord[]) => [...prev, { id: "r" + Date.now(), entryNo, ...form }]);
    }
    setShow(false); setEditId(null);
  }

  function del(id: string) {
    if (!window.confirm("Xác nhận xóa văn bằng này?")) return;
    setRecords((prev: DiplomaRecord[]) => prev.filter(r => r.id !== id));
  }

  function openEdit(r: DiplomaRecord) {
    setForm({ diplomaNo: r.diplomaNo, studentId: r.studentId, fullName: r.fullName, dob: r.dob, decisionId: r.decisionId, customValues: { ...r.customValues } });
    setEditId(r.id); setShow(true);
  }

  const filtered = filterDec ? records.filter((r: DiplomaRecord) => r.decisionId === filterDec) : records;

  return (
    <div>
      <div className="card">
        <div className="top-actions">
          <h3>Danh sách văn bằng</h3>
          <div style={{ display: "flex", gap: 8 }}>
            <select value={filterDec} onChange={e => setFilterDec(e.target.value)} style={{ width: 200 }}>
              <option value="">-- Tất cả quyết định --</option>
              {decisions.map((d: Decision) => <option key={d.id} value={d.id}>{d.number}</option>)}
            </select>
            <button className="btn btn-primary btn-sm" onClick={() => { setForm(emptyForm()); setEditId(null); setShow(true); }}>+ Thêm văn bằng</button>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Số vào sổ</th><th>Số hiệu VB</th><th>MSV</th><th>Họ tên</th><th>Ngày sinh</th><th>Quyết định</th>
              {fields.slice(0, 3).map((f: CustomField) => <th key={f.id}>{f.name}</th>)}
              <th></th>
            </tr>
          </thead>
          <tbody>{filtered.map((r: DiplomaRecord) => {
            const d = decisions.find((x: Decision) => x.id === r.decisionId);
            return (
              <tr key={r.id}>
                <td>{r.entryNo}</td>
                <td><span className="badge badge-blue">{r.diplomaNo}</span></td>
                <td>{r.studentId}</td><td>{r.fullName}</td><td>{r.dob}</td>
                <td>{d?.number}</td>
                {fields.slice(0, 3).map((f: CustomField) => <td key={f.id}>{r.customValues[f.id] || "—"}</td>)}
                <td><div className="actions">
                  <button className="btn btn-sm btn-secondary" onClick={() => openEdit(r)}>Sửa</button>
                  <button className="btn btn-sm btn-danger" onClick={() => del(r.id)}>Xóa</button>
                </div></td>
              </tr>
            );
          })}</tbody>
        </table>
      </div>

      {show && (
        <div className="modal-overlay"><div className="modal">
          <div className="modal-title">{editId ? "Sửa thông tin văn bằng" : "Thêm văn bằng mới"}</div>
          <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 10 }}>(*) Các trường bắt buộc</div>
          <div className="form-grid">
            <div className="form-group">
              <label>Số vào sổ</label>
              <input value={editId ? records.find((r: DiplomaRecord) => r.id === editId)?.entryNo : `[Tự động: ${getNextEntryNo(form.decisionId)}]`} disabled style={{ background: "#f3f4f6" }} />
            </div>
            <div className="form-group"><label>Số hiệu văn bằng *</label><input value={form.diplomaNo} onChange={e => setForm((p: any) => ({ ...p, diplomaNo: e.target.value }))} placeholder="VB001/2024" /></div>
            <div className="form-group"><label>Quyết định TN *</label>
              <select value={form.decisionId} onChange={e => setForm((p: any) => ({ ...p, decisionId: e.target.value }))}>
                {decisions.map((d: Decision) => <option key={d.id} value={d.id}>{d.number} — {d.date}</option>)}
              </select>
            </div>
            <div className="form-group"><label>Mã sinh viên *</label><input value={form.studentId} onChange={e => setForm((p: any) => ({ ...p, studentId: e.target.value }))} /></div>
            <div className="form-group"><label>Họ tên *</label><input value={form.fullName} onChange={e => setForm((p: any) => ({ ...p, fullName: e.target.value }))} /></div>
            <div className="form-group"><label>Ngày sinh *</label><input type="date" value={form.dob} onChange={e => setForm((p: any) => ({ ...p, dob: e.target.value }))} /></div>
          </div>
          <hr className="divider" />
          <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 8 }}>Thông tin bổ sung</div>
          <div className="form-grid">
            {fields.map((f: CustomField) => (
              <div className="form-group" key={f.id}>
                <label>{f.name} <span className={`tag-${f.type.toLowerCase()}`}>[{f.type}]</span></label>
                {f.type === "Date"
                  ? <input type="date" value={form.customValues[f.id] || ""} onChange={e => setForm((p: any) => ({ ...p, customValues: { ...p.customValues, [f.id]: e.target.value } }))} />
                  : f.type === "Number"
                  ? <input type="number" value={form.customValues[f.id] || ""} onChange={e => setForm((p: any) => ({ ...p, customValues: { ...p.customValues, [f.id]: e.target.value } }))} />
                  : <input value={form.customValues[f.id] || ""} onChange={e => setForm((p: any) => ({ ...p, customValues: { ...p.customValues, [f.id]: e.target.value } }))} />
                }
              </div>
            ))}
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={() => setShow(false)}>Hủy</button>
            <button className="btn btn-primary" onClick={save}>Lưu</button>
          </div>
        </div></div>
      )}
    </div>
  );
}

function FieldsPage({ fields, setFields, records }: any) {
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ name: "", type: "String" as FieldType });
  const [editId, setEditId] = useState<string | null>(null);

  function save() {
    if (!form.name.trim()) { alert("Vui lòng nhập tên trường."); return; }
    if (editId) {
      setFields((prev: CustomField[]) => prev.map(f => f.id === editId ? { ...f, name: form.name, type: form.type } : f));
    } else {
      setFields((prev: CustomField[]) => [...prev, { id: "f" + Date.now(), name: form.name, type: form.type }]);
    }
    setShow(false); setEditId(null);
  }

  function del(id: string) {
    setFields((prev: CustomField[]) => prev.filter(f => f.id !== id));
  }

  function openEdit(f: CustomField) { setForm({ name: f.name, type: f.type }); setEditId(f.id); setShow(true); }

  const typeColor: Record<string, string> = { String: "#7c3aed", Number: "#0891b2", Date: "#b45309" };

  return (
    <div>
      <div className="card">
        <div className="top-actions">
          <h3>Cấu hình các trường thông tin phụ lục văn bằng</h3>
          <button className="btn btn-primary btn-sm" onClick={() => { setForm({ name: "", type: "String" }); setEditId(null); setShow(true); }}>+ Thêm trường</button>
        </div>
        <div style={{ padding: "8px 0 12px", fontSize: 12, color: "#6b7280" }}>
          <b>5 trường mặc định:</b> Số vào sổ, Số hiệu văn bằng, Mã sinh viên, Họ tên, Ngày sinh (không thể xóa)
        </div>
        <table>
          <thead><tr><th>#</th><th>Tên trường</th><th>Kiểu dữ liệu</th><th>Control nhập</th><th></th></tr></thead>
          <tbody>{fields.map((f: CustomField, i: number) => (
            <tr key={f.id}>
              <td style={{ color: "#9ca3af" }}>{i + 1}</td>
              <td><b>{f.name}</b></td>
              <td><span style={{ color: typeColor[f.type], fontWeight: 600 }}>{f.type}</span></td>
              <td style={{ color: "#6b7280", fontSize: 12 }}>
                {f.type === "String" && "input[type=text]"}
                {f.type === "Number" && "input[type=number]"}
                {f.type === "Date" && "input[type=date]"}
              </td>
              <td><div className="actions">
                <button className="btn btn-sm btn-secondary" onClick={() => openEdit(f)}>Sửa</button>
                <button className="btn btn-sm btn-danger" onClick={() => del(f.id)}>Xóa</button>
              </div></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
      {show && (
        <div className="modal-overlay"><div className="modal" style={{ width: 400 }}>
          <div className="modal-title">{editId ? "Sửa trường thông tin" : "Thêm trường thông tin mới"}</div>
          <div className="form-group"><label>Tên trường *</label><input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="VD: Dân tộc, Điểm trung bình..." /></div>
          <div className="form-group"><label>Kiểu dữ liệu *</label>
            <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value as FieldType }))}>
              <option value="String">String — Văn bản</option>
              <option value="Number">Number - Số</option>
              <option value="Date">Date — Ngày tháng</option>
            </select>
          </div>
          <div style={{ padding: 10, background: "#f8fafc", borderRadius: 4, fontSize: 12, color: "#6b7280" }}>
            Preview control: <b>
              {form.type === "String" && 'input type="text"'}
              {form.type === "Number" && 'input type="number"'}
              {form.type === "Date" && 'input type="date"'}
            </b>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={() => setShow(false)}>Hủy</button>
            <button className="btn btn-primary" onClick={save}>Lưu</button>
          </div>
        </div></div>
      )}
    </div>
  );
}
