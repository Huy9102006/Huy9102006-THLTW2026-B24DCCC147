import { useState, useMemo } from "react";
import "./index.css";

type LoaiPhong = "Lý thuyết" | "Thực hành" | "Hội trường";

interface PhongHoc {
  maPhong: string;
  tenPhong: string;
  soChoNgoi: number;
  loaiPhong: LoaiPhong;
  nguoiPhuTrach: string;
}

const DANH_SACH_LOAI_PHONG: LoaiPhong[] = ["Lý thuyết", "Thực hành", "Hội trường"];

const DANH_SACH_QUAN_LY = ["Nguyễn Văn A", "Trần Thị B", "Lê Văn C", "Phạm Thị D", "Hoàng Văn E"];

const DU_LIEU_BAN_DAU: PhongHoc[] = [
  { maPhong: "P101", tenPhong: "Phòng 101", soChoNgoi: 40, loaiPhong: "Lý thuyết", nguoiPhuTrach: "Nguyễn Văn A" },
  { maPhong: "P102", tenPhong: "Phòng 102", soChoNgoi: 25, loaiPhong: "Lý thuyết", nguoiPhuTrach: "Trần Thị B" },
  { maPhong: "LAB01", tenPhong: "Phòng thực hành 01", soChoNgoi: 30, loaiPhong: "Thực hành", nguoiPhuTrach: "Lê Văn C" },
  { maPhong: "LAB02", tenPhong: "Phòng thực hành 02", soChoNgoi: 20, loaiPhong: "Thực hành", nguoiPhuTrach: "Phạm Thị D" },
  { maPhong: "HT01", tenPhong: "Hội trường A", soChoNgoi: 150, loaiPhong: "Hội trường", nguoiPhuTrach: "Hoàng Văn E" },
  { maPhong: "P205", tenPhong: "Phòng 205", soChoNgoi: 35, loaiPhong: "Lý thuyết", nguoiPhuTrach: "Nguyễn Văn A" },
];

const BIEU_MAU_TRONG: PhongHoc = {
  maPhong: "", tenPhong: "", soChoNgoi: 10, loaiPhong: "Lý thuyết", nguoiPhuTrach: DANH_SACH_QUAN_LY[0],
};

function kiemTraDuLieu(bieuMau: PhongHoc, danhSachPhong: PhongHoc[], maDangSua: string | null): Record<string, string> {
  const loi: Record<string, string> = {};
  if (!bieuMau.maPhong.trim()) loi.maPhong = "Mã phòng không được để trống";
  else if (bieuMau.maPhong.length > 10) loi.maPhong = "Mã phòng tối đa 10 ký tự";
  else if (danhSachPhong.some(p => p.maPhong === bieuMau.maPhong && p.maPhong !== maDangSua)) loi.maPhong = "Mã phòng đã tồn tại";

  if (!bieuMau.tenPhong.trim()) loi.tenPhong = "Tên phòng không được để trống";
  else if (bieuMau.tenPhong.length > 50) loi.tenPhong = "Tên phòng tối đa 50 ký tự";
  else if (danhSachPhong.some(p => p.tenPhong === bieuMau.tenPhong && p.maPhong !== maDangSua)) loi.tenPhong = "Tên phòng đã tồn tại";

  if (bieuMau.soChoNgoi < 10 || bieuMau.soChoNgoi > 200) loi.soChoNgoi = "Số chỗ ngồi từ 10 đến 200";
  return loi;
}

export default function QuanLyPhongHoc() {
  const [danhSachPhong, setDanhSachPhong] = useState<PhongHoc[]>(DU_LIEU_BAN_DAU);
  const [tuKhoaTimKiem, setTuKhoaTimKiem] = useState("");
  const [locLoaiPhong, setLocLoaiPhong] = useState("");
  const [locNguoiPhuTrach, setLocNguoiPhuTrach] = useState("");
  const [sapXepChoNgoi, setSapXepChoNgoi] = useState<"tang" | "giam" | null>(null);

  const [hienThiBieuMau, setHienThiBieuMau] = useState(false);
  const [maDangSua, setMaDangSua] = useState<string | null>(null);
  const [duLieuBieuMau, setDuLieuBieuMau] = useState<PhongHoc>({ ...BIEU_MAU_TRONG });
  const [danhSachLoi, setDanhSachLoi] = useState<Record<string, string>>({});

  const [doiTuongXoa, setDoiTuongXoa] = useState<PhongHoc | null>(null);

  const danhSachHienThi = useMemo(() => {
    let ketQua = danhSachPhong.filter(p => {
      const tuKhoa = tuKhoaTimKiem.toLowerCase();
      const khopTimKiem = p.maPhong.toLowerCase().includes(tuKhoa) || p.tenPhong.toLowerCase().includes(tuKhoa);
      const khopLoai = locLoaiPhong ? p.loaiPhong === locLoaiPhong : true;
      const khopQuanLy = locNguoiPhuTrach ? p.nguoiPhuTrach === locNguoiPhuTrach : true;
      return khopTimKiem && khopLoai && khopQuanLy;
    });
    if (sapXepChoNgoi === "tang") ketQua = [...ketQua].sort((a, b) => a.soChoNgoi - b.soChoNgoi);
    if (sapXepChoNgoi === "giam") ketQua = [...ketQua].sort((a, b) => b.soChoNgoi - a.soChoNgoi);
    return ketQua;
  }, [danhSachPhong, tuKhoaTimKiem, locLoaiPhong, locNguoiPhuTrach, sapXepChoNgoi]);

  function moTrinhThem() {
    setDuLieuBieuMau({ ...BIEU_MAU_TRONG });
    setDanhSachLoi({});
    setMaDangSua(null);
    setHienThiBieuMau(true);
  }

  function moTrinhSua(phong: PhongHoc) {
    setDuLieuBieuMau({ ...phong });
    setDanhSachLoi({});
    setMaDangSua(phong.maPhong);
    setHienThiBieuMau(true);
  }

  function thayDoiBieuMau(truong: keyof PhongHoc, giaTri: string | number) {
    setDuLieuBieuMau(prev => ({ ...prev, [truong]: giaTri }));
  }

  function luuDuLieu() {
    const loi = kiemTraDuLieu(duLieuBieuMau, danhSachPhong, maDangSua);
    if (Object.keys(loi).length > 0) { setDanhSachLoi(loi); return; }
    
    if (maDangSua) {
      setDanhSachPhong(prev => prev.map(p => p.maPhong === maDangSua ? duLieuBieuMau : p));
    } else {
      setDanhSachPhong(prev => [...prev, duLieuBieuMau]);
    }
    setHienThiBieuMau(false);
  }

  function xacNhanXoa() {
    if (!doiTuongXoa) return;
    setDanhSachPhong(prev => prev.filter(p => p.maPhong !== doiTuongXoa.maPhong));
    setDoiTuongXoa(null);
  }

  function layLopNhan(loai: LoaiPhong) {
    if (loai === "Lý thuyết") return "nhan-loai nhan-lt";
    if (loai === "Thực hành") return "nhan-loai nhan-th";
    return "nhan-loai nhan-ht";
  }

  function daoSapXep() {
    setSapXepChoNgoi(prev => prev === "tang" ? "giam" : prev === "giam" ? null : "tang");
  }

  return (
    <>
      <div className="khung-chua">
        <h1>Quản lý phòng học</h1>

        <div className="the-noi">
          <div className="thanh-cong-cu">
            <input
              placeholder="Tìm mã / tên phòng..."
              value={tuKhoaTimKiem}
              onChange={e => setTuKhoaTimKiem(e.target.value)}
              style={{ width: 200 }}
            />
            <select value={locLoaiPhong} onChange={e => setLocLoaiPhong(e.target.value)}>
              <option value=""> Loại phòng </option>
              {DANH_SACH_LOAI_PHONG.map(t => <option key={t}>{t}</option>)}
            </select>
            <select value={locNguoiPhuTrach} onChange={e => setLocNguoiPhuTrach(e.target.value)}>
              <option value="">Người phụ trách</option>
              {DANH_SACH_QUAN_LY.map(m => <option key={m}>{m}</option>)}
            </select>
            <button onClick={() => { setTuKhoaTimKiem(""); setLocLoaiPhong(""); setLocNguoiPhuTrach(""); }}>
              Xóa lọc
            </button>
            <button className="btn-primary" onClick={moTrinhThem} style={{ marginLeft: "auto" }}>
             Thêm phòng +
            </button>
          </div>
        </div>

        <div className="the-noi" style={{ overflowX: "auto" }}>
          <table>
            <thead>
              <tr>
                <th>Mã phòng</th>
                <th>Tên phòng</th>
                <th>
                  Số chỗ ngồi
                  <button className="sort-btn" onClick={daoSapXep}>
                    {sapXepChoNgoi === "tang" ? "↑" : sapXepChoNgoi === "giam" ? "↓" : "↕"}
                  </button>
                </th>
                <th>Loại phòng</th>
                <th>Người phụ trách</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {danhSachHienThi.length === 0 && (
                <tr><td colSpan={6} style={{ textAlign: "center", color: "#888", padding: 20 }}>Không có phòng nào</td></tr>
              )}
              {danhSachHienThi.map(phong => (
                <tr key={phong.maPhong}>
                  <td><b>{phong.maPhong}</b></td>
                  <td>{phong.tenPhong}</td>
                  <td>{phong.soChoNgoi}</td>
                  <td><span className={layLopNhan(phong.loaiPhong)}>{phong.loaiPhong}</span></td>
                  <td>{phong.nguoiPhuTrach}</td>
                  <td style={{ display: "flex", gap: 6 }}>
                    <button className="btn-edit" onClick={() => moTrinhSua(phong)}>Sửa</button>
                    <button
                      className="btn-danger"
                      onClick={() => phong.soChoNgoi < 30 ? setDoiTuongXoa(phong) : alert("Chỉ xóa phòng dưới 30 chỗ ngồi!")}
                      style={{ opacity: phong.soChoNgoi < 30 ? 1 : 0.4 }}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop: 8, fontSize: 13, color: "#666" }}>
            Hiển thị {danhSachHienThi.length} / {danhSachPhong.length} phòng
          </div>
        </div>
      </div>

      {hienThiBieuMau && (
        <div className="lop-phu-modal" onClick={() => setHienThiBieuMau(false)}>
          <div className="hop-thoai" onClick={e => e.stopPropagation()}>
            <h2>{maDangSua ? "Chỉnh sửa phòng học" : "Thêm phòng học"}</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div className="dong-bieu-mau">
                <div className="nhom-nhap-lieu">
                  <label>Mã phòng *</label>
                  <input
                    value={duLieuBieuMau.maPhong}
                    onChange={e => thayDoiBieuMau("maPhong", e.target.value)}
                    disabled={!!maDangSua}
                    maxLength={10}
                  />
                  {danhSachLoi.maPhong && <span className="error">{danhSachLoi.maPhong}</span>}
                </div>
                <div className="nhom-nhap-lieu">
                  <label>Tên phòng *</label>
                  <input
                    value={duLieuBieuMau.tenPhong}
                    onChange={e => thayDoiBieuMau("tenPhong", e.target.value)}
                    maxLength={50}
                  />
                  {danhSachLoi.tenPhong && <span className="error">{danhSachLoi.tenPhong}</span>}
                </div>
              </div>
              <div className="dong-bieu-mau">
                <div className="nhom-nhap-lieu">
                  <label>Số chỗ ngồi *</label>
                  <input
                    type="number"
                    value={duLieuBieuMau.soChoNgoi}
                    onChange={e => thayDoiBieuMau("soChoNgoi", parseInt(e.target.value) || 10)}
                  />
                  {danhSachLoi.soChoNgoi && <span className="error">{danhSachLoi.soChoNgoi}</span>}
                </div>
                <div className="nhom-nhap-lieu">
                  <label>Loại phòng *</label>
                  <select value={duLieuBieuMau.loaiPhong} onChange={e => thayDoiBieuMau("loaiPhong", e.target.value as LoaiPhong)}>
                    {DANH_SACH_LOAI_PHONG.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div className="nhom-nhap-lieu">
                <label>Người phụ trách *</label>
                <select value={duLieuBieuMau.nguoiPhuTrach} onChange={e => thayDoiBieuMau("nguoiPhuTrach", e.target.value)}>
                  {DANH_SACH_QUAN_LY.map(m => <option key={m}>{m}</option>)}
                </select>
              </div>
            </div>
            <div className="modal-actions">
              <button onClick={() => setHienThiBieuMau(false)}>Hủy</button>
              <button className="btn-primary" onClick={luuDuLieu}>
                {maDangSua ? "Lưu thay đổi" : "Thêm phòng"}
              </button>
            </div>
          </div>
        </div>
      )}

      {doiTuongXoa && (
        <div className="lop-phu-modal" onClick={() => setDoiTuongXoa(null)}>
          <div className="hop-thoai" style={{ width: 380 }} onClick={e => e.stopPropagation()}>
            <h2>Xác nhận xóa</h2>
            <p>Bạn có chắc muốn xóa phòng <b>{doiTuongXoa.tenPhong}</b>?</p>
            <div className="modal-actions">
              <button onClick={() => setDoiTuongXoa(null)}>Hủy</button>
              <button className="btn-danger" onClick={xacNhanXoa}>Xóa</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
