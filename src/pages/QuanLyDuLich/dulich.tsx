import * as React from "react";
import { useState } from "react";
import {
  Layout,
  Menu,
  Card,
  Select,
  InputNumber,
  Button,
  Row,
  Col,
  List,
  Form,
  Input,
  Table,
  Alert,
  Space,
  Upload,
  message
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import "antd/dist/antd.css";
import "./App.css";

const { Header, Content } = Layout;
const { Option } = Select;

type DiaDiem = {
  id: number;
  ten: string;
  loai: string;
  gia: number;
  danhGia: number;
  hinh: string;
  thoiGian: number;
  anUong: number;
  khachSan: number;
  diChuyen: number;
  moTa?: string;
};

const duLieuMau: DiaDiem[] = [
  {
    id: 1,
    ten: "Hà Nội",
    loai: "city",
    gia: 2000000,
    danhGia: 4.5,
    hinh: "https://picsum.photos/300/200",
    thoiGian: 3,
    anUong: 500000,
    khachSan: 800000,
    diChuyen: 700000,
    moTa: "Thủ đô"
  }
];

export default function App() {
  const [tab, setTab] = useState("home");
  const [duLieu, setDuLieu] = useState(duLieuMau);
  const [lichTrinh, setLichTrinh] = useState<DiaDiem[]>([]);
  const [nganSach, setNganSach] = useState(5000000);
  const [locLoai, setLocLoai] = useState<string>();
  const [sapXep, setSapXep] = useState<string>();
  const [dangSua, setDangSua] = useState<DiaDiem | null>(null);
  const [form] = Form.useForm();

  let danhSach = duLieu.filter((d) => !locLoai || d.loai === locLoai);

  if (sapXep === "gia") danhSach.sort((a, b) => a.gia - b.gia);
  if (sapXep === "danhGia") danhSach.sort((a, b) => b.danhGia - a.danhGia);

  const them = (d: DiaDiem) => setLichTrinh([...lichTrinh, d]);

  const xoa = (i: number) => {
    const arr = [...lichTrinh];
    arr.splice(i, 1);
    setLichTrinh(arr);
  };

  const diChuyen = (i: number, dir: number) => {
    const newIndex = i + dir;
    if (newIndex < 0 || newIndex >= lichTrinh.length) return;
    const arr = [...lichTrinh];
    [arr[i], arr[newIndex]] = [arr[newIndex], arr[i]];
    setLichTrinh(arr);
  };

  const tongTien = lichTrinh.reduce(
    (t, p) => t + (p?.anUong || 0) + (p?.khachSan || 0) + (p?.diChuyen || 0),
    0
  );

  const tongNgay = lichTrinh.reduce((t, p) => t + (p?.thoiGian || 0), 0);

  const chartData = [
    { name: "Ăn", value: lichTrinh.reduce((s, p) => s + (p?.anUong || 0), 0) },
    { name: "Khách sạn", value: lichTrinh.reduce((s, p) => s + (p?.khachSan || 0), 0) },
    { name: "Di chuyển", value: lichTrinh.reduce((s, p) => s + (p?.diChuyen || 0), 0) }
  ];

  const suaDiaDiem = (item: DiaDiem) => {
    setDangSua(item);
    form.setFieldsValue(item);
  };

  const themHoacSua = (values: any) => {
    if (dangSua) {
      setDuLieu(
        duLieu.map((d) =>
          d.id === dangSua.id ? { ...d, ...values } : d
        )
      );
      message.success("Cập nhật thành công");
      setDangSua(null);
    } else {
      setDuLieu([
        ...duLieu,
        {
          id: Date.now(),
          hinh: "https://picsum.photos/300/210",
          ...values
        }
      ]);
      message.success("Thêm thành công");
    }
    form.resetFields();
  };

  const xoaDiaDiem = (id: number) =>
    setDuLieu(duLieu.filter((d) => d.id !== id));

  const thongKe = {
    tongLich: lichTrinh.length,
    tongTien,
    diaDiemPhoBien:
      lichTrinh.length > 0 ? lichTrinh[0].ten : "Chưa có"
  };

  const columns = [
    { title: "Tên", dataIndex: "ten" },
    { title: "Loại", dataIndex: "loai" },
    {
      title: "Giá",
      dataIndex: "gia",
      render: (v: number) => v.toLocaleString("vi-VN") + " đ"
    },
    {
      title: "Hành động",
      render: (_: any, record: DiaDiem) => (
        <Space>
          <Button onClick={() => suaDiaDiem(record)}>Sửa</Button>
          <Button danger onClick={() => xoaDiaDiem(record.id)}>Xóa</Button>
        </Space>
      )
    }
  ];

  const formatVND = (v: number) => v.toLocaleString("vi-VN") + " đ";

  return (
    <Layout className="layout">
      <Header className="header">Travel Planner</Header>

      <Menu
        mode="horizontal"
        selectedKeys={[tab]}
        onClick={(e: any) => setTab(e.key)}
        items={[
          { key: "home", label: "Trang chủ" },
          { key: "plan", label: "Lịch trình" },
          { key: "budget", label: "Ngân sách" },
          { key: "admin", label: "Admin" }
        ]}
      />

      <Content className="content">
        {tab === "home" && (
          <>
            <Space className="filter">
              <Select placeholder="Lọc" onChange={setLocLoai} allowClear>
                <Option value="beach">Biển</Option>
                <Option value="mountain">Núi</Option>
                <Option value="city">Thành phố</Option>
              </Select>

              <Select placeholder="Sắp xếp" onChange={setSapXep}>
                <Option value="gia">Giá</Option>
                <Option value="danhGia">Đánh giá</Option>
              </Select>
            </Space>

            <Row gutter={[16, 16]}>
              {danhSach.map((d) => (
                <Col xs={24} sm={12} md={8} key={d.id}>
                  <Card className="card" hoverable cover={<img src={d.hinh} />}>
                    <h3>{d.ten}</h3>
                    <p>{d.moTa}</p>
                    <p>⭐ {d.danhGia}</p>
                    <p>{formatVND(d.gia)}</p>
                    <Button type="primary" onClick={() => them(d)}>
                      Thêm
                    </Button>
                  </Card>
                </Col>
              ))}
            </Row>
          </>
        )}

        {tab === "plan" && (
          <>
            <List
              bordered
              dataSource={lichTrinh}
              renderItem={(d, i) => (
                <List.Item
                  actions={[
                    <Button disabled={i === 0} onClick={() => diChuyen(i, -1)}>↑</Button>,
                    <Button disabled={i === lichTrinh.length - 1} onClick={() => diChuyen(i, 1)}>↓</Button>,
                    <Button onClick={() => xoa(i)}>Xóa</Button>
                  ]}
                >
                  Ngày {i + 1}: {d.ten}
                </List.Item>
              )}
            />

            <h3>Tổng ngày: {tongNgay}</h3>
            <h3>Tổng tiền: {formatVND(tongTien)}</h3>
          </>
        )}

        {tab === "budget" && (
          <>
            <InputNumber
              min={0}
              value={nganSach}
              className="input-budget"
              formatter={(v) =>
                `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " đ"
              }
              parser={(v) => Number(v?.replace(/\D/g, "") || 0)}
              onChange={(v: any) => setNganSach(Number(v) || 0)}
            />

            <h3>Ngân sách: {formatVND(nganSach)}</h3>
            <h3>Đã dùng: {formatVND(tongTien)}</h3>
            <h3>Còn lại: {formatVND(nganSach - tongTien)}</h3>

            {tongTien > nganSach && (
              <Alert message="⚠️ Vượt ngân sách!" type="error" />
            )}

            
            <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
              {(() => {
                const total = chartData.reduce((s, c) => s + c.value, 0) || 1;
                const colors = ['#f87171', '#60a5fa', '#34d399'];
                return chartData.map((c, i) => (
                  <div key={i} style={{ flex: 1, background: '#fff', padding: 12, borderRadius: 6, textAlign: 'center', border: '1px solid #e5e7eb' }}>
                    <div style={{ height: 36, background: colors[i % colors.length], borderRadius: 4 }} />
                    <div style={{ marginTop: 8, fontWeight: 700 }}>{c.name}</div>
                    <div style={{ marginTop: 6 }}>{formatVND(c.value)}</div>
                    <div style={{ color: '#6b7280', marginTop: 4 }}>{Math.round((c.value / total) * 100)}%</div>
                  </div>
                ));
              })()}
            </div>
          </>
        )}

        {tab === "admin" && (
          <>
            <Form form={form} onFinish={themHoacSua} layout="vertical">
              <Form.Item name="ten" label="Tên">
                <Input />
              </Form.Item>

              <Form.Item name="loai" label="Loại">
                <Select>
                  <Option value="beach">Biển</Option>
                  <Option value="mountain">Núi</Option>
                  <Option value="city">Thành phố</Option>
                </Select>
              </Form.Item>

              <Form.Item name="gia" label="Giá">
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>

              <Form.Item name="danhGia" label="Đánh giá">
                <InputNumber step={0.1} />
              </Form.Item>

              <Button htmlType="submit">
                {dangSua ? "Cập nhật" : "Thêm"}
              </Button>
            </Form>

            <Table dataSource={duLieu} columns={columns} rowKey="id" />

            <h3>📊 Thống kê</h3>
            <p>Số lịch trình: {thongKe.tongLich}</p>
            <p>Tổng tiền: {formatVND(thongKe.tongTien)}</p>
            <p>Địa điểm phổ biến: {thongKe.diaDiemPhoBien}</p>
          </>
        )}
      </Content>
    </Layout>
  );
}
