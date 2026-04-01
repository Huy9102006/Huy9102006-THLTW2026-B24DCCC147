import { useState, useMemo } from "react";
import "./style.css";
type AppStatus = "Pending" | "Approved" | "Rejected";
type Gender = "Nam" | "Nữ" | "Khác";

interface Club {
  id: string;
  name: string;
  foundedDate: string;
  description: string;
  leader: string;
  active: boolean;
}

interface Application {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  gender: Gender;
  address: string;
  skills: string;
  clubId: string;
  reason: string;
  status: AppStatus;
  note: string;
  history: HistoryEntry[];
}

interface HistoryEntry {
  action: AppStatus;
  at: string;
  by: string;
  reason: string;
}

const INIT_CLUBS: Club[] = [
  { id: "c1", name: "CLB Âm nhạc", foundedDate: "2018-03-15", description: "<b>Âm nhạc</b> kết nối mọi người", leader: "Nguyễn Văn An", active: true },
  { id: "c2", name: "CLB Nhiếp ảnh", foundedDate: "2019-07-22", description: "<i>Lưu giữ</i> khoảnh khắc đẹp", leader: "Trần Thị Bình", active: true },
  { id: "c3", name: "CLB Công nghệ", foundedDate: "2020-01-10", description: "Phát triển <u>kỹ năng</u> công nghệ", leader: "Lê Minh Cường", active: true },
  { id: "c4", name: "CLB Thể thao", foundedDate: "2017-09-05", description: "Rèn luyện sức khỏe <b>toàn diện</b>", leader: "Phạm Thu Dung", active: false },
];

const INIT_APPS: Application[] = [
  { id: "a1", fullName: "Nguyễn Thị Hoa", email: "hoa@email.com", phone: "0901234567", gender: "Nữ", address: "Hà Nội", skills: "Hát, đàn guitar", clubId: "c1", reason: "Yêu âm nhạc từ nhỏ", status: "Approved", note: "", history: [{ action: "Approved", at: "2025-03-10T09:00", by: "Admin", reason: "" }] },
  { id: "a2", fullName: "Trần Văn Bảo", email: "bao@email.com", phone: "0912345678", gender: "Nam", address: "TP.HCM", skills: "Chụp ảnh phong cảnh", clubId: "c2", reason: "Muốn học kỹ thuật chụp ảnh", status: "Pending", note: "", history: [] },
  { id: "a3", fullName: "Lê Thị Cẩm", email: "cam@email.com", phone: "0923456789", gender: "Nữ", address: "Đà Nẵng", skills: "Lập trình Python", clubId: "c3", reason: "Muốn nâng cao kỹ năng", status: "Rejected", note: "Không đủ điều kiện", history: [{ action: "Rejected", at: "2025-04-01T14:30", by: "Admin", reason: "Không đủ điều kiện" }] },
  { id: "a4", fullName: "Phạm Đức Dũng", email: "dung@email.com", phone: "0934567890", gender: "Nam", address: "Hải Phòng", skills: "Bóng đá, bơi lội", clubId: "c4", reason: "Yêu thích thể thao", status: "Pending", note: "", history: [] },
  { id: "a5", fullName: "Hoàng Minh Gia", email: "gia@email.com", phone: "0945678901", gender: "Nam", address: "Cần Thơ", skills: "Đánh trống", clubId: "c1", reason: "Muốn tham gia ban nhạc", status: "Approved", note: "", history: [{ action: "Approved", at: "2025-02-20T11:00", by: "Admin", reason: "" }] },
  { id: "a6", fullName: "Vũ Thị Hằng", email: "hang@email.com", phone: "0956789012", gender: "Nữ", address: "Huế", skills: "Thiết kế đồ họa", clubId: "c3", reason: "Muốn học AI", status: "Pending", note: "", history: [] },
];

const genId = () => Math.random().toString(36).slice(2, 9);
const now = () => new Date().toISOString().slice(0, 16);
const fmtDate = (d: string) => new Date(d).toLocaleString("vi-VN");

const Badge = ({ status }: { status: AppStatus }) => <span className={`badge badge-${status}`}>{status}</span>;

const Btn = ({ children, onClick, v = "default", md = false, disabled = false }: any) => (
  <button className={`btn btn-${v}${md ? " btn-md" : ""}`} onClick={onClick} disabled={disabled}>{children}</button>
);

const Field = ({ label, children }: any) => (
  <div className="field"><label>{label}</label>{children}</div>
);

const Modal = ({ title, children, onClose, width = 540 }: any) => (
  <div className="modal-backdrop">
    <div className="modal" style={{ maxWidth: width }}>
      <div className="modal-header">
        <h3>{title}</h3>
        <button className="modal-close" onClick={onClose}>×</button>
      </div>
      <div className="modal-body">{children}</div>
    </div>
  </div>
);

function useSort<T>(defaultCol: keyof T) {
  const [col, setCol] = useState<keyof T>(defaultCol);
  const [dir, setDir] = useState<"asc" | "desc">("asc");
  const toggle = (c: keyof T) => { if (c === col) setDir(d => d === "asc" ? "desc" : "asc"); else { setCol(c); setDir("asc"); } };
  const sort = (list: T[]) => [...list].sort((a, b) => {
    const va = String(a[col]), vb = String(b[col]);
    return dir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
  });
  const icon = (c: keyof T) => c === col ? (dir === "asc" ? " ↑" : " ↓") : " ↕";
  return { col, dir, toggle, sort, icon };
}

export default function App() {
  const [tab, setTab] = useState<"clubs" | "apps" | "members" | "stats">("clubs");
  const [clubs, setClubs] = useState<Club[]>(INIT_CLUBS);
  const [apps, setApps] = useState<Application[]>(INIT_APPS);

  return (
      <div>
        <div className="header">
          <span className="header-title">CLB Manager</span>
          <nav className="nav">
            {(["clubs", "apps", "members", "stats"] as const).map(t => (
              <button key={t} className={`nav-btn${tab === t ? " active" : ""}`} onClick={() => setTab(t)}>
                {{ clubs: "Câu lạc bộ", apps: "Đơn đăng ký", members: "Thành viên", stats: "Thống kê" }[t]}
              </button>
            ))}
          </nav>
        </div>
        <div className="content">
          {tab === "clubs" && <ClubsTab clubs={clubs} setClubs={setClubs} apps={apps} />}
          {tab === "apps" && <AppsTab clubs={clubs} apps={apps} setApps={setApps} />}
          {tab === "members" && <MembersTab clubs={clubs} apps={apps} setApps={setApps} />}
          {tab === "stats" && <StatsTab clubs={clubs} apps={apps} />}
        </div>
      </div>
  );
}

function ClubsTab({ clubs, setClubs, apps }: { clubs: Club[]; setClubs: any; apps: Application[] }) {
  const [search, setSearch] = useState("");
  const [editModal, setEditModal] = useState<Club | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [memberClubId, setMemberClubId] = useState<string | null>(null);
  const { col, dir, toggle, sort, icon } = useSort<Club>("name");

  const rows = useMemo(() => sort(
    clubs.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.leader.toLowerCase().includes(search.toLowerCase()))
  ), [clubs, search, col, dir]);

  const save = (c: Club) => {
    setClubs((cs: Club[]) => cs.find((x: Club) => x.id === c.id) ? cs.map((x: Club) => x.id === c.id ? c : x) : [...cs, c]);
    setEditModal(null);
  };

  const members = apps.filter(a => a.clubId === memberClubId && a.status === "Approved");

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">Câu lạc bộ</h2>
        <Btn onClick={() => setEditModal({ id: genId(), name: "", foundedDate: "", description: "", leader: "", active: true })} v="default" md>Thêm CLB</Btn>
      </div>
      <div className="filters">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm theo tên, chủ nhiệm..." style={{ maxWidth: 300 }} />
      </div>
      <div className="card">
        <table>
          <thead>
            <tr>
              {([["name","Tên CLB"],["foundedDate","Ngày thành lập"],["description","Mô tả"],["leader","Chủ nhiệm"],["active","Hoạt động"]] as [keyof Club, string][]).map(([c,l]) => (
                <th key={c} onClick={() => toggle(c)}>{l}{icon(c)}</th>
              ))}
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(c => (
              <tr key={c.id}>
                <td style={{ fontWeight: 600 }}>{c.name}</td>
                <td className="muted">{new Date(c.foundedDate).toLocaleDateString("vi-VN")}</td>
                <td className="muted" style={{ maxWidth: 180 }}><span dangerouslySetInnerHTML={{ __html: c.description }} /></td>
                <td>{c.leader}</td>
                <td><span className={`badge badge-${c.active ? "yes" : "no"}`}>{c.active ? "Có" : "Không"}</span></td>
                <td>
                  <div className="actions">
                    <Btn onClick={() => setEditModal(c)} v="outline">Sửa</Btn>
                    <Btn onClick={() => setMemberClubId(c.id)} v="outline">Thành viên</Btn>
                    <Btn onClick={() => setDeleteId(c.id)} v="danger">Xóa</Btn>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editModal && (
        <Modal title={editModal.name ? "Chỉnh sửa CLB" : "Thêm CLB mới"} onClose={() => setEditModal(null)}>
          <ClubForm club={editModal} onSave={save} onClose={() => setEditModal(null)} />
        </Modal>
      )}

      {deleteId && (
        <Modal title="Xác nhận xóa" onClose={() => setDeleteId(null)} width={360}>
          <p className="muted" style={{ marginBottom: 14 }}>Bạn có chắc muốn xóa câu lạc bộ này?</p>
          <div className="modal-footer">
            <Btn onClick={() => setDeleteId(null)} v="outline" md>Hủy</Btn>
            <Btn onClick={() => { setClubs((cs: Club[]) => cs.filter((c: Club) => c.id !== deleteId)); setDeleteId(null); }} v="danger" md>Xóa</Btn>
          </div>
        </Modal>
      )}

      {memberClubId && (
        <Modal title={`Thành viên: ${clubs.find(c => c.id === memberClubId)?.name}`} onClose={() => setMemberClubId(null)} width={660}>
          {members.length === 0 ? <p className="empty">Chưa có thành viên được duyệt</p> : (
            <table>
              <thead><tr>{["Họ tên","Email","SĐT","Giới tính","Địa chỉ"].map(h => <th key={h}>{h}</th>)}</tr></thead>
              <tbody>
                {members.map(m => (
                  <tr key={m.id}>
                    <td style={{ fontWeight: 600 }}>{m.fullName}</td>
                    <td className="muted">{m.email}</td>
                    <td className="muted">{m.phone}</td>
                    <td className="muted">{m.gender}</td>
                    <td className="muted">{m.address}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <div className="modal-footer"><Btn onClick={() => setMemberClubId(null)} v="outline" md>Đóng</Btn></div>
        </Modal>
      )}
    </div>
  );
}

function ClubForm({ club, onSave, onClose }: { club: Club; onSave: (c: Club) => void; onClose: () => void }) {
  const [f, setF] = useState(club);
  const s = (k: keyof Club) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setF(x => ({ ...x, [k]: k === "active" ? (e.target as HTMLSelectElement).value === "1" : e.target.value }));
  return (
    <>
      <div className="grid2">
        <Field label="Tên CLB"><input value={f.name} onChange={s("name")} placeholder="Tên câu lạc bộ" /></Field>
        <Field label="Chủ nhiệm"><input value={f.leader} onChange={s("leader")} placeholder="Họ tên chủ nhiệm" /></Field>
        <Field label="Ngày thành lập"><input type="date" value={f.foundedDate} onChange={s("foundedDate")} /></Field>
        <Field label="Hoạt động">
          <select value={f.active ? "1" : "0"} onChange={s("active")}><option value="1">Có</option><option value="0">Không</option></select>
        </Field>
        <div className="col2">
          <Field label="Mô tả (HTML)"><textarea value={f.description} onChange={s("description")} rows={3} placeholder="Hỗ trợ HTML" /></Field>
        </div>
      </div>
      <div className="modal-footer">
        <Btn onClick={onClose} v="outline" md>Hủy</Btn>
        <Btn onClick={() => onSave(f)} md>Lưu</Btn>
      </div>
    </>
  );
}

function AppsTab({ clubs, apps, setApps }: { clubs: Club[]; apps: Application[]; setApps: any }) {
  const [search, setSearch] = useState("");
  const [fStatus, setFStatus] = useState<AppStatus | "all">("all");
  const [fClub, setFClub] = useState("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [editModal, setEditModal] = useState<Application | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [detailModal, setDetailModal] = useState<Application | null>(null);
  const [rejectIds, setRejectIds] = useState<string[] | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [historyModal, setHistoryModal] = useState<Application | null>(null);
  const { col, dir, toggle, sort, icon } = useSort<Application>("fullName");

  const rows = useMemo(() => sort(
    apps.filter(a =>
      (fStatus === "all" || a.status === fStatus) &&
      (fClub === "all" || a.clubId === fClub) &&
      (a.fullName.toLowerCase().includes(search.toLowerCase()) || a.email.toLowerCase().includes(search.toLowerCase()))
    )
  ), [apps, search, fStatus, fClub, col, dir]);

  const allIds = rows.map(a => a.id);
  const allSel = allIds.length > 0 && allIds.every(id => selected.has(id));
  const toggleAll = () => setSelected(allSel ? new Set() : new Set(allIds));
  const toggleOne = (id: string) => { const s = new Set(selected); s.has(id) ? s.delete(id) : s.add(id); setSelected(s); };

  const approve = (ids: string[]) => {
    const e: HistoryEntry = { action: "Approved", at: now(), by: "Admin", reason: "" };
    setApps((as: Application[]) => as.map((a: Application) => ids.includes(a.id) ? { ...a, status: "Approved", note: "", history: [...a.history, e] } : a));
    setSelected(new Set());
  };

  const reject = (ids: string[], reason: string) => {
    const e: HistoryEntry = { action: "Rejected", at: now(), by: "Admin", reason };
    setApps((as: Application[]) => as.map((a: Application) => ids.includes(a.id) ? { ...a, status: "Rejected", note: reason, history: [...a.history, e] } : a));
    setSelected(new Set()); setRejectIds(null); setRejectReason("");
  };

  const save = (app: Application) => {
    setApps((as: Application[]) => as.find((a: Application) => a.id === app.id) ? as.map((a: Application) => a.id === app.id ? app : a) : [...as, app]);
    setEditModal(null);
  };

  const selArr = Array.from(selected);
  const clubName = (id: string) => clubs.find(c => c.id === id)?.name || "—";

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">Đơn đăng ký</h2>
        <Btn onClick={() => setEditModal({ id: genId(), fullName: "", email: "", phone: "", gender: "Nam", address: "", skills: "", clubId: clubs[0]?.id || "", reason: "", status: "Pending", note: "", history: [] })} md>Thêm đơn</Btn>
      </div>
      <div className="filters">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm theo tên, email..." style={{ maxWidth: 240 }} />
        <select value={fStatus} onChange={e => setFStatus(e.target.value as any)} style={{ width: 160 }}>
          <option value="all">Tất cả trạng thái</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
        <select value={fClub} onChange={e => setFClub(e.target.value)} style={{ width: 190 }}>
          <option value="all">Tất cả CLB</option>
          {clubs.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      {selArr.length > 0 && (
        <div className="bulk-bar">
          Đã chọn {selArr.length} đơn
          <Btn onClick={() => approve(selArr)} v="success">Duyệt {selArr.length} đơn</Btn>
          <Btn onClick={() => { setRejectIds(selArr); setRejectReason(""); }} v="danger">Từ chối {selArr.length} đơn</Btn>
          <Btn onClick={() => setSelected(new Set())} v="ghost">Bỏ chọn</Btn>
        </div>
      )}

      <div className="card">
        <table>
          <thead>
            <tr>
              <th><input type="checkbox" checked={allSel} onChange={toggleAll} /></th>
              {([["fullName","Họ tên"],["email","Email"],["phone","SĐT"],["gender","Giới tính"],["clubId","CLB"],["status","Trạng thái"]] as [keyof Application, string][]).map(([c,l]) => (
                <th key={c} onClick={() => toggle(c)}>{l}{icon(c)}</th>
              ))}
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(a => (
              <tr key={a.id} style={{ background: selected.has(a.id) ? "#f0f9ff" : "" }}>
                <td><input type="checkbox" checked={selected.has(a.id)} onChange={() => toggleOne(a.id)} /></td>
                <td style={{ fontWeight: 600 }}>{a.fullName}</td>
                <td className="muted">{a.email}</td>
                <td className="muted">{a.phone}</td>
                <td className="muted">{a.gender}</td>
                <td className="muted">{clubName(a.clubId)}</td>
                <td><Badge status={a.status} /></td>
                <td>
                  <div className="actions">
                    <Btn onClick={() => setDetailModal(a)} v="outline">Chi tiết</Btn>
                    <Btn onClick={() => setEditModal(a)} v="outline">Sửa</Btn>
                    {a.status === "Pending" && <Btn onClick={() => approve([a.id])} v="success">Duyệt</Btn>}
                    {a.status === "Pending" && <Btn onClick={() => { setRejectIds([a.id]); setRejectReason(""); }} v="danger">Từ chối</Btn>}
                    <Btn onClick={() => setHistoryModal(a)} v="ghost">Lịch sử</Btn>
                    <Btn onClick={() => setDeleteId(a.id)} v="danger">Xóa</Btn>
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={8} className="empty">Không có dữ liệu</td></tr>}
          </tbody>
        </table>
      </div>

      {detailModal && (
        <Modal title="Chi tiết đơn đăng ký" onClose={() => setDetailModal(null)} width={480}>
          {([["Họ tên", detailModal.fullName], ["Email", detailModal.email], ["SĐT", detailModal.phone], ["Giới tính", detailModal.gender], ["Địa chỉ", detailModal.address], ["Sở trường", detailModal.skills], ["CLB", clubName(detailModal.clubId)], ["Lý do", detailModal.reason], ["Ghi chú", detailModal.note || "—"]] as [string, string][]).map(([k, v]) => (
            <div key={k} className="detail-row"><span className="detail-key">{k}</span><span>{v}</span></div>
          ))}
          <div className="detail-row"><span className="detail-key">Trạng thái</span><Badge status={detailModal.status} /></div>
          <div className="modal-footer"><Btn onClick={() => setDetailModal(null)} v="outline" md>Đóng</Btn></div>
        </Modal>
      )}

      {rejectIds && (
        <Modal title={`Từ chối ${rejectIds.length} đơn`} onClose={() => setRejectIds(null)} width={400}>
          <Field label="Lý do từ chối *">
            <textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)} placeholder="Nhập lý do (bắt buộc)..." rows={4} />
          </Field>
          <div className="modal-footer">
            <Btn onClick={() => setRejectIds(null)} v="outline" md>Hủy</Btn>
            <Btn onClick={() => rejectReason.trim() && reject(rejectIds, rejectReason.trim())} v="danger" md disabled={!rejectReason.trim()}>Xác nhận</Btn>
          </div>
        </Modal>
      )}

      {historyModal && (
        <Modal title={`Lịch sử: ${historyModal.fullName}`} onClose={() => setHistoryModal(null)} width={480}>
          {historyModal.history.length === 0
            ? <p className="empty">Chưa có lịch sử</p>
            : historyModal.history.map((h, i) => (
              <div key={i} className={`history-entry ${h.action}`}>
                <div className="history-meta">
                  <Badge status={h.action} />
                  <span className="muted xs">{fmtDate(h.at)}</span>
                  <span className="muted xs">bởi {h.by}</span>
                </div>
                {h.reason && <p className="muted xs">Lý do: {h.reason}</p>}
              </div>
            ))}
          <div className="modal-footer"><Btn onClick={() => setHistoryModal(null)} v="outline" md>Đóng</Btn></div>
        </Modal>
      )}

      {editModal && (
        <Modal title={editModal.fullName ? "Chỉnh sửa đơn" : "Thêm đơn mới"} onClose={() => setEditModal(null)} width={580}>
          <AppForm app={editModal} clubs={clubs} onSave={save} onClose={() => setEditModal(null)} />
        </Modal>
      )}

      {deleteId && (
        <Modal title="Xác nhận xóa" onClose={() => setDeleteId(null)} width={360}>
          <p className="muted" style={{ marginBottom: 14 }}>Bạn có chắc muốn xóa đơn đăng ký này?</p>
          <div className="modal-footer">
            <Btn onClick={() => setDeleteId(null)} v="outline" md>Hủy</Btn>
            <Btn onClick={() => { setApps((as: Application[]) => as.filter((a: Application) => a.id !== deleteId)); setDeleteId(null); }} v="danger" md>Xóa</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

function AppForm({ app, clubs, onSave, onClose }: { app: Application; clubs: Club[]; onSave: (a: Application) => void; onClose: () => void }) {
  const [f, setF] = useState(app);
  const s = (k: keyof Application) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setF(x => ({ ...x, [k]: e.target.value }));
  return (
    <>
      <div className="grid2">
        <Field label="Họ tên"><input value={f.fullName} onChange={s("fullName")} /></Field>
        <Field label="Email"><input type="email" value={f.email} onChange={s("email")} /></Field>
        <Field label="SĐT"><input value={f.phone} onChange={s("phone")} /></Field>
        <Field label="Giới tính">
          <select value={f.gender} onChange={s("gender")}><option>Nam</option><option>Nữ</option><option>Khác</option></select>
        </Field>
        <Field label="Địa chỉ"><input value={f.address} onChange={s("address")} /></Field>
        <Field label="Câu lạc bộ">
          <select value={f.clubId} onChange={s("clubId")}>{clubs.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
        </Field>
        <div className="col2"><Field label="Sở trường"><input value={f.skills} onChange={s("skills")} /></Field></div>
        <div className="col2"><Field label="Lý do đăng ký"><textarea value={f.reason} onChange={s("reason")} rows={3} /></Field></div>
        <Field label="Trạng thái">
          <select value={f.status} onChange={s("status")}><option>Pending</option><option>Approved</option><option>Rejected</option></select>
        </Field>
        <Field label="Ghi chú"><input value={f.note} onChange={s("note")} /></Field>
      </div>
      <div className="modal-footer">
        <Btn onClick={onClose} v="outline" md>Hủy</Btn>
        <Btn onClick={() => onSave(f)} md>Lưu</Btn>
      </div>
    </>
  );
}

function MembersTab({ clubs, apps, setApps }: { clubs: Club[]; apps: Application[]; setApps: any }) {
  const [clubId, setClubId] = useState(clubs[0]?.id || "");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [showTransfer, setShowTransfer] = useState(false);
  const [targetId, setTargetId] = useState(clubs[1]?.id || "");
  const [search, setSearch] = useState("");

  const members = useMemo(() =>
    apps.filter((a: Application) => a.status === "Approved" && a.clubId === clubId &&
      (a.fullName.toLowerCase().includes(search.toLowerCase()) || a.email.toLowerCase().includes(search.toLowerCase())))
  , [apps, clubId, search]);

  const allIds = members.map(m => m.id);
  const allSel = allIds.length > 0 && allIds.every(id => selected.has(id));
  const toggleAll = () => setSelected(allSel ? new Set() : new Set(allIds));
  const toggleOne = (id: string) => { const s = new Set(selected); s.has(id) ? s.delete(id) : s.add(id); setSelected(s); };

  const doTransfer = () => {
    const ids = Array.from(selected);
    setApps((as: Application[]) => as.map((a: Application) => ids.includes(a.id) ? { ...a, clubId: targetId } : a));
    setSelected(new Set()); setShowTransfer(false);
  };

  const currentClub = clubs.find(c => c.id === clubId);
  const destClub = clubs.find(c => c.id === targetId);
  const selArr = Array.from(selected);

  return (
    <div>
      <div className="page-header"><h2 className="page-title">Thành viên CLB</h2></div>
      <div className="filters">
        <select value={clubId} onChange={e => { setClubId(e.target.value); setSelected(new Set()); }} style={{ width: 220 }}>
          {clubs.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm thành viên..." style={{ maxWidth: 250 }} />
      </div>

      {selArr.length > 0 && (
        <div className="bulk-bar">
          Đã chọn {selArr.length} thành viên
          <Btn onClick={() => setShowTransfer(true)} v="warning">Đổi CLB</Btn>
          <Btn onClick={() => setSelected(new Set())} v="ghost">Bỏ chọn</Btn>
        </div>
      )}

      <div className="card">
        <div className="club-bar">
          {currentClub?.name}
          <span className="club-count">{members.length} thành viên</span>
        </div>
        <table>
          <thead>
            <tr>
              <th><input type="checkbox" checked={allSel} onChange={toggleAll} /></th>
              {["Họ tên","Email","SĐT","Giới tính","Địa chỉ","Sở trường"].map(h => <th key={h}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {members.map(m => (
              <tr key={m.id} style={{ background: selected.has(m.id) ? "#f0f9ff" : "" }}>
                <td><input type="checkbox" checked={selected.has(m.id)} onChange={() => toggleOne(m.id)} /></td>
                <td style={{ fontWeight: 600 }}>{m.fullName}</td>
                <td className="muted">{m.email}</td>
                <td className="muted">{m.phone}</td>
                <td className="muted">{m.gender}</td>
                <td className="muted">{m.address}</td>
                <td className="muted">{m.skills}</td>
              </tr>
            ))}
            {members.length === 0 && <tr><td colSpan={7} className="empty">Không có thành viên</td></tr>}
          </tbody>
        </table>
      </div>

      {showTransfer && (
        <Modal title="Đổi câu lạc bộ" onClose={() => setShowTransfer(false)} width={400}>
          <div className="warn-box">
            Chuyển <strong>{selArr.length}</strong> thành viên từ <strong>{currentClub?.name}</strong> sang CLB mới.
          </div>
          <Field label="CLB đích">
            <select value={targetId} onChange={e => setTargetId(e.target.value)}>
              {clubs.filter(c => c.id !== clubId).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </Field>
          {destClub && <div className="info-box">Chuyển đến: <strong>{destClub.name}</strong> — Chủ nhiệm: {destClub.leader}</div>}
          <div className="modal-footer">
            <Btn onClick={() => setShowTransfer(false)} v="outline" md>Hủy</Btn>
            <Btn onClick={doTransfer} v="warning" md>Xác nhận</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

function StatsTab({ clubs, apps }: { clubs: Club[]; apps: Application[] }) {
  const pending = apps.filter(a => a.status === "Pending").length;
  const approved = apps.filter(a => a.status === "Approved").length;
  const rejected = apps.filter(a => a.status === "Rejected").length;

  const data = clubs.map(c => ({
    name: c.name.replace("CLB ", ""),
    p: apps.filter(a => a.clubId === c.id && a.status === "Pending").length,
    a: apps.filter(a => a.clubId === c.id && a.status === "Approved").length,
    r: apps.filter(a => a.clubId === c.id && a.status === "Rejected").length,
  }));

  const maxVal = Math.max(...data.flatMap(d => [d.p, d.a, d.r]), 1);
  const H = 200, bW = 20, gW = bW * 3 + 16, totalW = data.length * gW + 56;
  const clrs = ["#f59e0b", "#22c55e", "#ef4444"];

  return (
    <div>
      <h2 className="page-title" style={{ marginBottom: 18 }}>Báo cáo & Thống kê</h2>
      <div className="stat-grid">
        {[
          { label: "Tổng CLB", value: clubs.length, color: "#6366f1", bg: "#eef2ff" },
          { label: "Tổng đơn", value: apps.length, color: "#0ea5e9", bg: "#e0f2fe" },
          { label: "Đang chờ", value: pending, color: "#f59e0b", bg: "#fef3c7" },
          { label: "Đã duyệt", value: approved, color: "#22c55e", bg: "#dcfce7" },
          { label: "Từ chối", value: rejected, color: "#ef4444", bg: "#fee2e2" },
        ].map(s => (
          <div key={s.label} className="stat-card" style={{ background: s.bg }}>
            <div className="stat-val" style={{ color: s.color }}>{s.value}</div>
            <div className="stat-lbl" style={{ color: s.color }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className="chart-wrap">
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Đơn đăng ký theo câu lạc bộ</div>
        <div className="muted xs" style={{ marginBottom: 14 }}>Phân loại theo trạng thái</div>
        <div className="legend">
          {["Pending","Approved","Rejected"].map((l, i) => (
            <div key={l} className="legend-item"><div className="legend-dot" style={{ background: clrs[i] }} />{l}</div>
          ))}
        </div>
        <div style={{ overflowX: "auto" }}>
          <svg width={Math.max(totalW, 420)} height={H + 55}>
            {[0,.25,.5,.75,1].map(f => {
              const y = H - f * H + 10;
              return (
                <g key={f}>
                  <line x1="34" y1={y} x2={Math.max(totalW, 420) - 6} y2={y} stroke="#f1f5f9" strokeWidth="1" />
                  <text x="30" y={y + 4} fontSize="9" fill="#94a3b8" textAnchor="end">{Math.round(f * maxVal)}</text>
                </g>
              );
            })}
            {data.map((d, gi) => {
              const gx = 40 + gi * gW;
              return (
                <g key={d.name}>
                  {[d.p, d.a, d.r].map((val, bi) => {
                    const bh = Math.max((val / maxVal) * H, val > 0 ? 2 : 0);
                    const by = H - bh + 10;
                    return (
                      <g key={bi}>
                        <rect x={gx + bi * (bW + 2)} y={by} width={bW} height={bh} fill={clrs[bi]} rx="2" opacity=".85" />
                        {val > 0 && <text x={gx + bi * (bW + 2) + bW / 2} y={by - 3} fontSize="9" fill="#64748b" textAnchor="middle">{val}</text>}
                      </g>
                    );
                  })}
                  <text x={gx + gW / 2 - bW / 2} y={H + 28} fontSize="10" fill="#475569" textAnchor="middle">{d.name}</text>
                </g>
              );
            })}
            <line x1="34" y1={H + 10} x2={Math.max(totalW, 420) - 6} y2={H + 10} stroke="#e2e8f0" strokeWidth="1" />
          </svg>
        </div>
      </div>

      <div className="card" style={{ marginTop: 18 }}>
        <table>
          <thead>
            <tr>
              {["Câu lạc bộ","Pending","Approved","Rejected","Tổng"].map(h => (
                <th key={h} style={{ textAlign: h === "Câu lạc bộ" ? "left" : "center" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map(d => (
              <tr key={d.name}>
                <td style={{ fontWeight: 500 }}>CLB {d.name}</td>
                <td style={{ textAlign: "center" }}><span className="badge badge-Pending">{d.p}</span></td>
                <td style={{ textAlign: "center" }}><span className="badge badge-Approved">{d.a}</span></td>
                <td style={{ textAlign: "center" }}><span className="badge badge-Rejected">{d.r}</span></td>
                <td style={{ textAlign: "center", fontWeight: 600 }}>{d.p + d.a + d.r}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr style={{ background: "#f8fafc", fontWeight: 700 }}>
              <td>Tổng cộng</td>
              <td style={{ textAlign: "center", color: "#b45309" }}>{pending}</td>
              <td style={{ textAlign: "center", color: "#166534" }}>{approved}</td>
              <td style={{ textAlign: "center", color: "#991b1b" }}>{rejected}</td>
              <td style={{ textAlign: "center" }}>{apps.length}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
