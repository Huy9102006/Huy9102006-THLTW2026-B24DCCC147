import { useState } from "react";

type NhanVien = { id: number; ten: string; toiDaMoiNgay: number };
type DichVu = { id: number; ten: string; gia: number; thoiGian: number };
type LichHen = { id: number; khachHang: string; nhanVienId: number; dichVuId: number; ngay: string; gio: string; trangThai: string };
type DanhGia = { id: number; nhanVienId: number; khachHang: string; soSao: number; nhanXet: string };

const TABS = ["Lịch hẹn", "Nhân viên", "Dịch vụ", "Đánh giá", "Thống kê"];
const DS_TRANG_THAI = ["Chờ duyệt", "Xác nhận", "Hoàn thành", "Hủy"];
const MAU_TRANG_THAI: Record<string, string> = {
  "Chờ duyệt": "#f59e0b", "Xác nhận": "#3b82f6", "Hoàn thành": "#16a34a", "Hủy": "#ef4444",
};

const styleInput = { width: "100%", padding: "4px 6px", border: "1px solid #999", fontSize: 13, boxSizing: "border-box" as const };
const styleThe = (themStyle = {}): React.CSSProperties => ({ border: "1px solid #ccc", padding: 10, marginBottom: 8, ...themStyle });
const styleNut = (mauNen = "#2563eb") => ({ padding: "5px 14px", background: mauNen, color: "#fff", border: "none", fontSize: 13, cursor: "pointer" });
const styleLuoi2 = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 12px" } as React.CSSProperties;

const TruongNhap = ({ nhan, ...props }: any) => (
  <div style={{ marginBottom: 8 }}>
    {nhan && <div style={{ fontSize: 12, marginBottom: 2 }}>{nhan}</div>}
    <input {...props} style={styleInput} />
  </div>
);

const TruongChon = ({ nhan, children, ...props }: any) => (
  <div style={{ marginBottom: 8 }}>
    {nhan && <div style={{ fontSize: 12, marginBottom: 2 }}>{nhan}</div>}
    <select {...props} style={styleInput}>{children}</select>
  </div>
);

const Nut = ({ mauNen, ...props }: any) => <button {...props} style={styleNut(mauNen)} />;
const The = ({ children, themStyle }: any) => <div style={styleThe(themStyle)}>{children}</div>;

export default function App() {
  const [tabHienTai, setTabHienTai] = useState(0);
  const [danhSachNhanVien, setDanhSachNhanVien] = useState<NhanVien[]>([]);
  const [danhSachDichVu, setDanhSachDichVu] = useState<DichVu[]>([]);
  const [danhSachLichHen, setDanhSachLichHen] = useState<LichHen[]>([]);
  const [danhSachDanhGia, setDanhSachDanhGia] = useState<DanhGia[]>([]);
  const [thongBao, setThongBao] = useState("");
  const [formNhanVien, setFormNhanVien] = useState({ ten: "", toiDaMoiNgay: 5 });
  const [formDichVu, setFormDichVu] = useState({ ten: "", gia: 0, thoiGian: 30 });
  const [formLichHen, setFormLichHen] = useState({ khachHang: "", nhanVienId: 0, dichVuId: 0, ngay: "", gio: "09:00" });
  const [formDanhGia, setFormDanhGia] = useState({ lichHenId: 0, soSao: 5, nhanXet: "" });
  const [lichHenDangSua, setLichHenDangSua] = useState<LichHen | null>(null);

  const hienThongBao = (m: string) => { setThongBao(m); setTimeout(() => setThongBao(""), 2500); };
  const timDichVu = (id: number) => danhSachDichVu.find(d => d.id === id);
  const timNhanVien = (id: number) => danhSachNhanVien.find(n => n.id === id);
  const trungBinhSao = (nhanVienId: number) => {
    const danhGia = danhSachDanhGia.filter(d => d.nhanVienId === nhanVienId);
    return danhGia.length ? (danhGia.reduce((t, d) => t + d.soSao, 0) / danhGia.length).toFixed(1) : "—";
  };
  const lichHoanThanh = danhSachLichHen.filter(l => l.trangThai === "Hoàn thành");

  const themNhanVien = () => {
    if (!formNhanVien.ten.trim()) return hienThongBao("Nhập tên nhân viên!");
    setDanhSachNhanVien(ds => [...ds, { id: Date.now(), ...formNhanVien }]);
    setFormNhanVien({ ten: "", toiDaMoiNgay: 5 });
    hienThongBao("Đã thêm nhân viên.");
  };

  const themDichVu = () => {
    if (!formDichVu.ten.trim() || !formDichVu.gia) return hienThongBao("Nhập đủ thông tin dịch vụ!");
    setDanhSachDichVu(ds => [...ds, { id: Date.now(), ...formDichVu }]);
    setFormDichVu({ ten: "", gia: 0, thoiGian: 30 });
    hienThongBao("Đã thêm dịch vụ.");
  };

  const datLich = () => {
    const { khachHang, nhanVienId, dichVuId, ngay, gio } = formLichHen;
    if (!khachHang.trim() || !nhanVienId || !dichVuId || !ngay) return hienThongBao("Điền đủ thông tin!");
    const trungGio = danhSachLichHen.some(l => l.nhanVienId === nhanVienId && l.ngay === ngay && l.gio === gio && l.trangThai !== "Hủy");
    if (trungGio) return hienThongBao("Nhân viên đã có lịch giờ này!");
    const soLichTrongNgay = danhSachLichHen.filter(l => l.nhanVienId === nhanVienId && l.ngay === ngay && l.trangThai !== "Hủy").length;
    if (soLichTrongNgay >= (timNhanVien(nhanVienId)?.toiDaMoiNgay ?? 0)) return hienThongBao("Nhân viên đã đủ lịch ngày này!");
    setDanhSachLichHen(ds => [...ds, { id: Date.now(), ...formLichHen, trangThai: "Chờ duyệt" }]);
    setFormLichHen(f => ({ ...f, khachHang: "", ngay: "", gio: "09:00" }));
    hienThongBao("Đặt lịch thành công!");
  };

  const luuSuaLich = () => {
    if (!lichHenDangSua) return;
    setDanhSachLichHen(ds => ds.map(l => l.id === lichHenDangSua.id ? lichHenDangSua : l));
    setLichHenDangSua(null);
    hienThongBao("Đã cập nhật.");
  };

  const guiDanhGia = () => {
    if (!formDanhGia.lichHenId || !formDanhGia.nhanXet.trim()) return hienThongBao("Chọn lịch hẹn và nhập nhận xét!");
    const lich = danhSachLichHen.find(l => l.id === formDanhGia.lichHenId);
    if (!lich) return;
    setDanhSachDanhGia(ds => [...ds, { id: Date.now(), nhanVienId: lich.nhanVienId, khachHang: lich.khachHang, soSao: formDanhGia.soSao, nhanXet: formDanhGia.nhanXet }]);
    setFormDanhGia({ lichHenId: 0, soSao: 5, nhanXet: "" });
    hienThongBao("Đã gửi đánh giá.");
  };

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", maxWidth: 800, margin: "0 auto", padding: 16 }}>
      {thongBao && <div style={{ border: "1px solid #999", padding: "6px 10px", marginBottom: 8, fontSize: 13 }}>{thongBao}</div>}
      <div style={{ display: "flex", borderBottom: "1px solid #999", marginBottom: 16 }}>
        {TABS.map((ten, i) => (
          <button key={i} onClick={() => setTabHienTai(i)} style={{ padding: "8px 14px", border: "none", borderBottom: tabHienTai === i ? "2px solid #000" : "2px solid transparent", background: "transparent", fontWeight: tabHienTai === i ? 700 : 400, fontSize: 13, cursor: "pointer" }}>{ten}</button>
        ))}
      </div>

      {tabHienTai === 0 && (
        <>
          {!danhSachNhanVien.length || !danhSachDichVu.length
            ? <p style={{ color: "#666", fontSize: 13 }}>Vui lòng thêm nhân viên và dịch vụ trước.</p>
            : <The>
              <b style={{ display: "block", marginBottom: 10 }}>Đặt lịch hẹn</b>
              <div style={styleLuoi2}>
                <TruongNhap nhan="Tên khách" value={formLichHen.khachHang} onChange={(e: any) => setFormLichHen(f => ({ ...f, khachHang: e.target.value }))} placeholder="Nguyễn Văn A" />
                <TruongNhap nhan="Ngày hẹn" type="date" value={formLichHen.ngay} onChange={(e: any) => setFormLichHen(f => ({ ...f, ngay: e.target.value }))} />
                <TruongNhap nhan="Giờ hẹn" type="time" value={formLichHen.gio} onChange={(e: any) => setFormLichHen(f => ({ ...f, gio: e.target.value }))} />
                <TruongChon nhan="Nhân viên" value={formLichHen.nhanVienId} onChange={(e: any) => setFormLichHen(f => ({ ...f, nhanVienId: +e.target.value }))}>
                  <option value={0}>-- Chọn --</option>
                  {danhSachNhanVien.map(nv => <option key={nv.id} value={nv.id}>{nv.ten}</option>)}
                </TruongChon>
                <TruongChon nhan="Dịch vụ" value={formLichHen.dichVuId} onChange={(e: any) => setFormLichHen(f => ({ ...f, dichVuId: +e.target.value }))}>
                  <option value={0}>-- Chọn --</option>
                  {danhSachDichVu.map(dv => <option key={dv.id} value={dv.id}>{dv.ten} – {dv.gia.toLocaleString()}đ</option>)}
                </TruongChon>
              </div>
              <Nut onClick={datLich}>Đặt lịch</Nut>
            </The>}

          {danhSachLichHen.map(lich => (
            <The key={lich.id} themStyle={{ borderLeft: `4px solid ${MAU_TRANG_THAI[lich.trangThai]}` }}>
              {lichHenDangSua?.id === lich.id ? (
                <>
                  <div style={styleLuoi2}>
                    <TruongNhap nhan="Tên khách" value={lichHenDangSua.khachHang} onChange={(e: any) => setLichHenDangSua({ ...lichHenDangSua, khachHang: e.target.value })} />
                    <TruongNhap nhan="Ngày" type="date" value={lichHenDangSua.ngay} onChange={(e: any) => setLichHenDangSua({ ...lichHenDangSua, ngay: e.target.value })} />
                    <TruongNhap nhan="Giờ" type="time" value={lichHenDangSua.gio} onChange={(e: any) => setLichHenDangSua({ ...lichHenDangSua, gio: e.target.value })} />
                    <TruongChon nhan="Trạng thái" value={lichHenDangSua.trangThai} onChange={(e: any) => setLichHenDangSua({ ...lichHenDangSua, trangThai: e.target.value })}>
                      {DS_TRANG_THAI.map(tt => <option key={tt}>{tt}</option>)}
                    </TruongChon>
                  </div>
                  <Nut onClick={luuSuaLich}>Lưu</Nut>{" "}
                  <Nut mauNen="#6b7280" onClick={() => setLichHenDangSua(null)}>Hủy</Nut>
                </>
              ) : (
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ flex: 1 }}>
                    <b>{lich.khachHang}</b>
                    <div style={{ fontSize: 12, color: "#666" }}>{timDichVu(lich.dichVuId)?.ten} · {timNhanVien(lich.nhanVienId)?.ten} · {lich.ngay} {lich.gio}</div>
                  </div>
                  <span style={{ fontSize: 12, color: MAU_TRANG_THAI[lich.trangThai] }}>{lich.trangThai}</span>
                  <Nut mauNen="#6b7280" onClick={() => setLichHenDangSua({ ...lich })}>Sửa</Nut>
                  <Nut mauNen="#ef4444" onClick={() => setDanhSachLichHen(ds => ds.filter(l => l.id !== lich.id))}>Xóa</Nut>
                </div>
              )}
            </The>
          ))}
        </>
      )}

      {tabHienTai === 1 && (
        <>
          <The>
            <b style={{ display: "block", marginBottom: 10 }}>Thêm nhân viên</b>
            <div style={styleLuoi2}>
              <TruongNhap nhan="Tên" value={formNhanVien.ten} onChange={(e: any) => setFormNhanVien(f => ({ ...f, ten: e.target.value }))} placeholder="Nguyễn Thị A" />
              <TruongNhap nhan="Tối đa khách/ngày" type="number" value={formNhanVien.toiDaMoiNgay} onChange={(e: any) => setFormNhanVien(f => ({ ...f, toiDaMoiNgay: +e.target.value }))} />
            </div>
            <Nut onClick={themNhanVien}>+ Thêm</Nut>
          </The>
          {danhSachNhanVien.map(nv => (
            <The key={nv.id} themStyle={{ display: "flex", alignItems: "center" }}>
              <div style={{ flex: 1 }}>
                <b>👤 {nv.ten}</b>
                <div style={{ fontSize: 12, color: "#666" }}>Tối đa {nv.toiDaMoiNgay} khách/ngày · ⭐ {trungBinhSao(nv.id)}</div>
              </div>
              <Nut mauNen="#ef4444" onClick={() => setDanhSachNhanVien(ds => ds.filter(n => n.id !== nv.id))}>Xóa</Nut>
            </The>
          ))}
        </>
      )}

      {tabHienTai === 2 && (
        <>
          <The>
            <b style={{ display: "block", marginBottom: 10 }}>Thêm dịch vụ</b>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0 12px" }}>
              <TruongNhap nhan="Tên dịch vụ" value={formDichVu.ten} onChange={(e: any) => setFormDichVu(f => ({ ...f, ten: e.target.value }))} placeholder="Cắt tóc nam" />
              <TruongNhap nhan="Giá (đ)" type="number" value={formDichVu.gia || ""} onChange={(e: any) => setFormDichVu(f => ({ ...f, gia: +e.target.value }))} />
              <TruongNhap nhan="Thời gian (phút)" type="number" value={formDichVu.thoiGian} onChange={(e: any) => setFormDichVu(f => ({ ...f, thoiGian: +e.target.value }))} />
            </div>
            <Nut onClick={themDichVu}>+ Thêm</Nut>
          </The>
          {danhSachDichVu.map(dv => (
            <The key={dv.id} themStyle={{ display: "flex", alignItems: "center" }}>
              <div style={{ flex: 1 }}>
                <b>{dv.ten}</b>
                <div style={{ fontSize: 12, color: "#666" }}>{dv.gia.toLocaleString()}đ · {dv.thoiGian} phút</div>
              </div>
              <Nut mauNen="#ef4444" onClick={() => setDanhSachDichVu(ds => ds.filter(d => d.id !== dv.id))}>Xóa</Nut>
            </The>
          ))}
        </>
      )}

      {tabHienTai === 3 && (
        <>
          {lichHoanThanh.length > 0 && (
            <The>
              <b style={{ display: "block", marginBottom: 10 }}>Gửi đánh giá</b>
              <div style={styleLuoi2}>
                <TruongChon nhan="Lịch hẹn hoàn thành" value={formDanhGia.lichHenId} onChange={(e: any) => setFormDanhGia(f => ({ ...f, lichHenId: +e.target.value }))}>
                  <option value={0}>-- Chọn --</option>
                  {lichHoanThanh.map(l => <option key={l.id} value={l.id}>{l.khachHang} · {timNhanVien(l.nhanVienId)?.ten} · {l.ngay}</option>)}
                </TruongChon>
                <TruongChon nhan="Số sao" value={formDanhGia.soSao} onChange={(e: any) => setFormDanhGia(f => ({ ...f, soSao: +e.target.value }))}>
                  {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{"★".repeat(n)}</option>)}
                </TruongChon>
              </div>
              <TruongNhap nhan="Nhận xét" value={formDanhGia.nhanXet} onChange={(e: any) => setFormDanhGia(f => ({ ...f, nhanXet: e.target.value }))} placeholder="Dịch vụ rất tốt..." />
              <Nut onClick={guiDanhGia}>Gửi đánh giá</Nut>
            </The>
          )}
          {danhSachNhanVien.map(nv => {
            const danhGiaCuaNV = danhSachDanhGia.filter(d => d.nhanVienId === nv.id);
            return (
              <The key={nv.id}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: danhGiaCuaNV.length ? 8 : 0 }}>
                  <b>{nv.ten}</b>
                  <span style={{ color: "#f59e0b" }}>⭐ {trungBinhSao(nv.id)} <span style={{ color: "#999", fontSize: 12 }}>({danhGiaCuaNV.length})</span></span>
                </div>
                {danhGiaCuaNV.length === 0
                  ? <div style={{ fontSize: 12, color: "#999" }}>Chưa có đánh giá.</div>
                  : danhGiaCuaNV.map(dg => (
                    <div key={dg.id} style={{ border: "1px solid #eee", padding: "6px 8px", marginBottom: 4, fontSize: 13 }}>
                      <span style={{ color: "#f59e0b" }}>{"★".repeat(dg.soSao)}{"☆".repeat(5 - dg.soSao)}</span>{" "}
                      <span style={{ color: "#666" }}>— {dg.khachHang}</span>
                      <div>{dg.nhanXet}</div>
                    </div>
                  ))}
              </The>
            );
          })}
        </>
      )}

      {tabHienTai === 4 && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 16 }}>
            {([
              ["Tổng lịch hẹn", danhSachLichHen.length],
              ["Hoàn thành", lichHoanThanh.length],
              ["Doanh thu", lichHoanThanh.reduce((t, l) => t + (timDichVu(l.dichVuId)?.gia || 0), 0).toLocaleString() + "đ"],
            ] as any[]).map(([nhan, giaTri]) => (
              <div key={nhan} style={{ border: "1px solid #ccc", padding: 10 }}>
                <div style={{ fontSize: 11 }}>{nhan}</div>
                <div style={{ fontSize: 18, fontWeight: 700 }}>{giaTri}</div>
              </div>
            ))}
          </div>
          <b style={{ display: "block", marginBottom: 6, fontSize: 13 }}>Theo nhân viên</b>
          {danhSachNhanVien.map(nv => {
            const lichCuaNV = lichHoanThanh.filter(l => l.nhanVienId === nv.id);
            const doanhThu = lichCuaNV.reduce((t, l) => t + (timDichVu(l.dichVuId)?.gia || 0), 0);
            return (
              <The key={nv.id} themStyle={{ display: "flex", justifyContent: "space-between" }}>
                <span>{nv.ten}</span>
                <span style={{ color: "#16a34a" }}>{lichCuaNV.length} lịch · {doanhThu.toLocaleString()}đ</span>
              </The>
            );
          })}
          <b style={{ display: "block", margin: "12px 0 6px", fontSize: 13 }}>Theo dịch vụ</b>
          {danhSachDichVu.map(dv => {
            const soLich = lichHoanThanh.filter(l => l.dichVuId === dv.id).length;
            return (
              <The key={dv.id} themStyle={{ display: "flex", justifyContent: "space-between" }}>
                <span>{dv.ten}</span>
                <span style={{ color: "#2563eb" }}>{soLich} lịch · {(soLich * dv.gia).toLocaleString()}đ</span>
              </The>
            );
          })}
        </>
      )}
    </div>
  );
}
