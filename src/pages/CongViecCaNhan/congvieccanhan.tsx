import React, { useState, useEffect, useCallback } from "react";
import "./index.css";

type Priority = "Cao" | "Trung bình" | "Thấp";
type Status = "todo" | "inprogress" | "done";
interface Task {
  id: string;
  name: string;
  description: string;
  deadline: string;
  priority: Priority;
  tags: string[];
  status: Status;
  createdAt: string;
}
type Page = "dashboard" | "kanban" | "list";

const STORAGE_KEY = "kanban_tasks_v1";
const COLUMNS: { id: Status; label: string; color: string; bg: string }[] = [
  { id: "todo", label: "Cần làm", color: "#185FA5", bg: "#E6F1FB" },
  { id: "inprogress", label: "Đang làm", color: "#BA7517", bg: "#FAEEDA" },
  { id: "done", label: "Hoàn thành", color: "#3B6D11", bg: "#EAF3DE" },
];
const PRIORITY_META: Record<Priority, { color: string; bg: string }> = {
  Cao: { color: "#A32D2D", bg: "#FCEBEB" },
  "Trung bình": { color: "#BA7517", bg: "#FAEEDA" },
  Thấp: { color: "#3B6D11", bg: "#EAF3DE" },
};

const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);
const isOverdue = (task: Task) => task.deadline && task.status !== "done" && new Date(task.deadline) < new Date();
const loadTasks = (): Task[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : sampleTasks();
  } catch { return sampleTasks(); }
};
const saveTasks = (tasks: Task[]) => localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));

const sampleTasks = (): Task[] => {
  const today = new Date();
  const fmt = (d: Date) => d.toISOString().slice(0, 10);
  const future = (n: number) => fmt(new Date(today.setDate(today.getDate() + n)));
  const past = (n: number) => fmt(new Date(today.setDate(today.getDate() - n)));
  today.setDate(new Date().getDate());
  return [
    { id: uid(), name: "Thiết kế UI trang chủ", description: "Tạo wireframe và mockup", deadline: future(3), priority: "Cao", tags: ["design", "ui"], status: "todo", createdAt: new Date().toISOString() },
    { id: uid(), name: "Viết tài liệu API", description: "Tài liệu hóa endpoints", deadline: future(7), priority: "Trung bình", tags: ["docs", "api"], status: "todo", createdAt: new Date().toISOString() },
    { id: uid(), name: "Fix bug đăng nhập", description: "Sửa lỗi JWT token", deadline: past(1), priority: "Cao", tags: ["bug", "auth"], status: "inprogress", createdAt: new Date().toISOString() },
    { id: uid(), name: "Review code thanh toán", description: "Kiểm tra logic", deadline: future(2), priority: "Cao", tags: ["review"], status: "inprogress", createdAt: new Date().toISOString() },
    { id: uid(), name: "Cài đặt CI/CD", description: "Tích hợp GitHub Actions", deadline: future(14), priority: "Thấp", tags: ["devops"], status: "done", createdAt: new Date().toISOString() },
    { id: uid(), name: "Tối ưu database", description: "Thêm index và cải thiện N+1", deadline: past(3), priority: "Trung bình", tags: ["db", "performance"], status: "done", createdAt: new Date().toISOString() },
  ];
};

const PriorityBadge = ({ priority }: { priority: Priority }) => (
  <span className="badge" style={PRIORITY_META[priority]}>{priority}</span>
);
const StatusBadge = ({ status }: { status: Status }) => {
  const col = COLUMNS.find(c => c.id === status)!;
  return <span className="badge" style={{ background: col.bg, color: col.color }}>{col.label}</span>;
};
const DeadlineBadge = ({ task }: { task: Task }) => task.deadline ? (
  <span className={`deadline-badge${isOverdue(task) ? " overdue" : ""}`}>
    📅 {new Date(task.deadline).toLocaleDateString("vi-VN")}{isOverdue(task) && " (Quá hạn)"}
  </span>
) : null;

const TaskForm = ({ task, onSave, onClose }: { task?: Task | null; onSave: (t: Task) => void; onClose: () => void }) => {
  const [name, setName] = useState(task?.name ?? "");
  const [desc, setDesc] = useState(task?.description ?? "");
  const [deadline, setDeadline] = useState(task?.deadline ?? "");
  const [priority, setPriority] = useState<Priority>(task?.priority ?? "Trung bình");
  const [tagsRaw, setTagsRaw] = useState(task?.tags?.join(", ") ?? "");
  const [status, setStatus] = useState<Status>(task?.status ?? "todo");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Tên task không được để trống";
    if (!deadline) e.deadline = "Vui lòng chọn deadline";
    if (Object.keys(e).length) return setErrors(e);
    onSave({
      id: task?.id ?? uid(),
      name: name.trim(),
      description: desc.trim(),
      deadline,
      priority,
      tags: tagsRaw.split(",").map(s => s.trim()).filter(Boolean),
      status,
      createdAt: task?.createdAt ?? new Date().toISOString(),
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">{task ? "Chỉnh sửa" : "Thêm task"}</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">Tên task *</label>
            <input className={`form-control${errors.name ? " error" : ""}`} value={name} onChange={e => setName(e.target.value)} />
            {errors.name && <div className="form-error">{errors.name}</div>}
          </div>
          <div className="form-group">
            <label className="form-label">Mô tả</label>
            <textarea className="form-control" rows={3} value={desc} onChange={e => setDesc(e.target.value)} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Deadline *</label>
              <input type="date" className={`form-control${errors.deadline ? " error" : ""}`} value={deadline} onChange={e => setDeadline(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Ưu tiên</label>
              <select className="form-control" value={priority} onChange={e => setPriority(e.target.value as Priority)}>
                <option>Cao</option><option>Trung bình</option><option>Thấp</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Trạng thái</label>
              <select className="form-control" value={status} onChange={e => setStatus(e.target.value as Status)}>
                {COLUMNS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Tags</label>
              <input className="form-control" value={tagsRaw} onChange={e => setTagsRaw(e.target.value)} placeholder="design, ui, bug" />
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Hủy</button>
          <button className="btn btn-primary" onClick={handleSubmit}>{task ? "Lưu" : "Thêm"}</button>
        </div>
      </div>
    </div>
  );
};

const Dashboard = ({ tasks, onAdd }: { tasks: Task[]; onAdd: () => void }) => {
  const total = tasks.length, done = tasks.filter(t => t.status === "done").length, overdue = tasks.filter(isOverdue).length, pct = total ? Math.round((done / total) * 100) : 0;
  const recent = [...tasks].sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0,5);
  return (
    <div>
      <div className="stats-grid">
        {[
          { label: "Tổng số task", value: total, icon: "📋", bg: "#EEF2FF", color: "#4338CA" },
          { label: "Hoàn thành", value: done, icon: "✅", bg: "#ECFDF5", color: "#047857" },
          { label: "Quá hạn", value: overdue, icon: "⚠️", bg: "#FEF2F2", color: "#DC2626" },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-icon" style={{ background: s.bg }}>{s.icon}</div>
            <div><div className="stat-value" style={{ color: s.color }}>{s.value}</div><div className="stat-label">{s.label}</div></div>
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div className="recent-section">
          <div className="section-title">Task gần đây</div>
          {recent.map(t => (
            <div key={t.id} className="recent-task-row">
              <div className="priority-dot" style={{ background: PRIORITY_META[t.priority].color }} />
              <div style={{ flex: 1 }}><div style={{ fontWeight: 600 }}>{t.name}</div><div style={{ fontSize: 12, color: "#94a3b8" }}>{t.deadline}</div></div>
              <StatusBadge status={t.status} />
            </div>
          ))}
        </div>
        <div className="recent-section">
          <div className="section-title">Tiến độ</div>
          <div style={{ textAlign: "center", padding: 12 }}><div style={{ fontSize: 48, fontWeight: 800, color: "#3b82f6" }}>{pct}%</div><div>{done}/{total} hoàn thành</div></div>
          <div className="progress-bar-wrap"><div className="progress-bar" style={{ width: `${pct}%` }} /></div>
          <div style={{ marginTop: 20 }}>
            {COLUMNS.map(col => {
              const count = tasks.filter(t => t.status === col.id).length;
              return <div key={col.id} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: col.color }} />
                <span style={{ flex: 1 }}>{col.label}</span><span style={{ fontWeight: 600, color: col.color }}>{count}</span>
                <div style={{ width: 80, background: "#e2e8f0", borderRadius: 20, height: 5 }}><div style={{ width: `${total ? (count/total)*100 : 0}%`, height: "100%", background: col.color, borderRadius: 20 }} /></div>
              </div>;
            })}
          </div>
          <button className="btn btn-primary" onClick={onAdd} style={{ marginTop: 16, width: "100%" }}>+ Thêm task</button>
        </div>
      </div>
    </div>
  );
};

const KanbanBoard = ({ tasks, onEdit, onDelete, onMove, onAdd }: { tasks: Task[]; onEdit: (t: Task) => void; onDelete: (id: string) => void; onMove: (id: string, status: Status) => void; onAdd: () => void }) => {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [overCol, setOverCol] = useState<Status | null>(null);
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}><button className="btn btn-primary" onClick={onAdd}>+ Thêm task</button></div>
      <div className="kanban-board">
        {COLUMNS.map(col => (
          <div key={col.id} className="kanban-col">
            <div className="col-header" style={{ background: col.bg }}><div className="col-header-dot" style={{ background: col.color }} /><span className="col-header-label" style={{ color: col.color }}>{col.label}</span><span className="col-header-count">{tasks.filter(t => t.status === col.id).length}</span></div>
            <div className={`col-body${overCol === col.id ? " drag-over" : ""}`} onDragOver={e => { e.preventDefault(); setOverCol(col.id); }} onDrop={e => { e.preventDefault(); const id = e.dataTransfer.getData("text/plain"); if(id) onMove(id, col.id); setOverCol(null); }} onDragLeave={() => setOverCol(null)}>
              {tasks.filter(t => t.status === col.id).map(task => (
                <div key={task.id} className={`task-card${draggingId === task.id ? " dragging" : ""}`} draggable onDragStart={e => { setDraggingId(task.id); e.dataTransfer.setData("text/plain", task.id); }} onDragEnd={() => setDraggingId(null)} style={isOverdue(task) ? { borderLeft: "3px solid #ef4444" } : {}}>
                  <div className="task-card-name">{task.name}</div>
                  {task.description && <div className="task-card-desc">{task.description}</div>}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 10 }}>{task.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}</div>
                  <div className="task-card-footer"><PriorityBadge priority={task.priority} /><DeadlineBadge task={task} /><div className="task-card-actions"><button onClick={() => onEdit(task)}>✏️</button><button onClick={() => onDelete(task.id)}>🗑️</button></div></div>
                </div>
              ))}
              {tasks.filter(t => t.status === col.id).length === 0 && <div className="empty-col"><div>📭</div><div>Kéo task vào đây</div></div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const TaskList = ({ tasks, onEdit, onDelete, onAdd }: { tasks: Task[]; onEdit: (t: Task) => void; onDelete: (id: string) => void; onAdd: () => void }) => {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<Status | "all">("all");
  const [filterPriority, setFilterPriority] = useState<Priority | "all">("all");
  const [sortField, setSortField] = useState<"name"|"deadline"|"priority"|"status">("deadline");
  const [sortDir, setSortDir] = useState<"asc"|"desc">("asc");
  const priorityOrder = { Cao:0, "Trung bình":1, Thấp:2 };
  const statusOrder = { todo:0, inprogress:1, done:2 };
  
  const filtered = tasks.filter(t => t.name.toLowerCase().includes(search.toLowerCase()) && (filterStatus==="all"||t.status===filterStatus) && (filterPriority==="all"||t.priority===filterPriority))
    .sort((a,b) => {
      let cmp = sortField==="name" ? a.name.localeCompare(b.name) : sortField==="deadline" ? (a.deadline||"").localeCompare(b.deadline||"") : sortField==="priority" ? priorityOrder[a.priority]-priorityOrder[b.priority] : statusOrder[a.status]-statusOrder[b.status];
      return sortDir==="asc" ? cmp : -cmp;
    });

  return (
    <div>
      <div className="list-controls">
        <input className="form-control search-input" placeholder="🔍 Tìm kiếm..." value={search} onChange={e=>setSearch(e.target.value)} />
        <select className="form-control" value={filterStatus} onChange={e=>setFilterStatus(e.target.value as any)} style={{width:160}}><option value="all">Tất cả trạng thái</option>{COLUMNS.map(c=><option key={c.id} value={c.id}>{c.label}</option>)}</select>
        <select className="form-control" value={filterPriority} onChange={e=>setFilterPriority(e.target.value as any)} style={{width:160}}><option value="all">Tất cả ưu tiên</option><option>Cao</option><option>Trung bình</option><option>Thấp</option></select>
        <button className="btn btn-primary" onClick={onAdd}>+ Thêm task</button>
      </div>
      <div className="table-wrapper">
        <table className="data-table">
          <thead><tr>{["name","status","priority","deadline"].map(field=><th key={field} onClick={()=>{if(sortField===field) setSortDir(d=>d==="asc"?"desc":"asc"); else {setSortField(field as any);setSortDir("asc");}}}>{field==="name"?"Tên task":field==="status"?"Trạng thái":field==="priority"?"Ưu tiên":"Deadline"}{sortField===field&&<span>{sortDir==="asc"?" ↑":" ↓"}</span>}</th>)}<th>Tags</th><th>Thao tác</th></tr></thead>
          <tbody>
            {filtered.map(task=><tr key={task.id} className={isOverdue(task)?"overdue-row":""}>
              <td style={{fontWeight:600}}>{task.name}</td>
              <td><StatusBadge status={task.status} /></td>
              <td><PriorityBadge priority={task.priority} /></td>
              <td><DeadlineBadge task={task} /></td>
              <td><div style={{display:"flex",flexWrap:"wrap",gap:4}}>{task.tags.map(tg=><span key={tg} className="tag">{tg}</span>)}</div></td>
              <td><button className="btn btn-secondary btn-sm" onClick={()=>onEdit(task)}>✏️ Sửa</button> <button className="btn btn-danger btn-sm" onClick={()=>onDelete(task.id)}>🗑️</button></td>
            </tr>)}
            {filtered.length===0&&<tr><td colSpan={6}><div className="table-empty">Không tìm thấy task</div></td></tr>}
          </tbody>
        </table>
      </div>
      <div style={{marginTop:12,fontSize:13,color:"#94a3b8"}}>Hiển thị {filtered.length}/{tasks.length} task</div>
    </div>
  );
};

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [page, setPage] = useState<Page>("dashboard");
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => setTasks(loadTasks()), []);
  useEffect(() => { if(tasks.length) saveTasks(tasks); }, [tasks]);

  const handleSave = useCallback((task: Task) => { setTasks(prev => prev.find(t=>t.id===task.id) ? prev.map(t=>t.id===task.id?task:t) : [...prev,task]); setShowForm(false); setEditingTask(null); }, []);
  const handleEdit = useCallback((task: Task) => { setEditingTask(task); setShowForm(true); }, []);
  const handleDelete = useCallback((id: string) => { if(window.confirm("Xóa?")) setTasks(prev=>prev.filter(t=>t.id!==id)); }, []);
  const handleMove = useCallback((id: string, status: Status) => setTasks(prev=>prev.map(t=>t.id===id?{...t,status}:t)), []);
  const openAdd = useCallback(() => { setEditingTask(null); setShowForm(true); }, []);

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-brand">Task<span>Flow</span></div>
        <nav className="sidebar-nav">
          {[
            { id: "dashboard" as Page, label: "Dashboard", icon: "📊" },
            { id: "kanban" as Page, label: "Kanban Board", icon: "📌" },
            { id: "list" as Page, label: "Danh sách task", icon: "📋" },
          ].map(item=>(
            <button key={item.id} className={`nav-item${page===item.id?" active":""}`} onClick={()=>setPage(item.id)}>
              <span className="nav-icon">{item.icon}</span>{item.label}
            </button>
          ))}
        </nav>
        <div style={{padding:"16px 20px",borderTop:"1px solid #334155",fontSize:12}}>
          {tasks.length} task · {tasks.filter(t=>t.status==="done").length} hoàn thành
        </div>
      </aside>
      <main className="main">
        <div className="topbar">
          <span className="topbar-title">{{dashboard:"Dashboard",kanban:"Kanban Board",list:"Danh sách task"}[page]}</span>
          {page!=="dashboard"&&<button className="btn btn-primary" onClick={openAdd}>+ Thêm task</button>}
        </div>
        <div className="page-content">
          {page==="dashboard"&&<Dashboard tasks={tasks} onAdd={openAdd} />}
          {page==="kanban"&&<KanbanBoard tasks={tasks} onEdit={handleEdit} onDelete={handleDelete} onMove={handleMove} onAdd={openAdd} />}
          {page==="list"&&<TaskList tasks={tasks} onEdit={handleEdit} onDelete={handleDelete} onAdd={openAdd} />}
        </div>
      </main>
      {showForm&&<TaskForm task={editingTask} onSave={handleSave} onClose={()=>{setShowForm(false);setEditingTask(null);}} />}
    </div>
  );
}
