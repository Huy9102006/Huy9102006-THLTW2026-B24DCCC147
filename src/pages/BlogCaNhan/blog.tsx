import { useState, useEffect, useMemo, useCallback, ReactNode } from "react";
import "./App.css";

type Status = "published" | "draft";

interface Tag {
  id: number;
  name: string;
}

interface Post {
  id: number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  thumbnail: string;
  tags: number[];
  status: Status;
  author: string;
  createdAt: string;
  views: number;
}

type Page = "home" | "detail" | "about" | "admin-posts" | "admin-tags";

const SEED_TAGS: Tag[] = [
  { id: 1, name: "React" },
  { id: 2, name: "JavaScript" },
  { id: 3, name: "CSS" },
  { id: 4, name: "Node.js" },
  { id: 5, name: "Python" },
  { id: 6, name: "DevOps" },
];

const SEED_POSTS: Post[] = [
  {
    id: 1, title: "Bắt đầu với React Hooks", slug: "bat-dau-voi-react-hooks",
    summary: "Tìm hiểu cách sử dụng useState, useEffect và các hook phổ biến trong React.",
    content: `# Bắt đầu với React Hooks\n\nReact Hooks ra đời từ phiên bản **16.8**, thay đổi hoàn toàn cách viết component.\n\n## useState\n\nQuản lý state cục bộ:\n\n\`\`\`js\nconst [count, setCount] = useState(0);\n\`\`\`\n\n## useEffect\n\nXử lý side effects:\n\n\`\`\`js\nuseEffect(() => {\n  document.title = \`Count: \${count}\`;\n}, [count]);\n\`\`\`\n\n## Kết luận\n\nHooks giúp code **ngắn gọn** và **dễ tái sử dụng** hơn rất nhiều so với class component.`,
    thumbnail: "https://picsum.photos/seed/react/600/300",
    tags: [1, 2], status: "published", author: "Nguyễn Văn An",
    createdAt: "2024-01-15", views: 142,
  },
  {
    id: 2, title: "CSS Grid vs Flexbox", slug: "css-grid-vs-flexbox",
    summary: "So sánh hai hệ thống layout mạnh mẽ nhất trong CSS hiện đại.",
    content: `# CSS Grid vs Flexbox\n\n## Khi nào dùng Flexbox?\n\nFlexbox tối ưu cho layout **một chiều** (hàng hoặc cột).\n\n\`\`\`css\n.container {\n  display: flex;\n  gap: 16px;\n  align-items: center;\n}\n\`\`\`\n\n## Khi nào dùng Grid?\n\nGrid phù hợp layout **hai chiều** — vừa hàng vừa cột.\n\n\`\`\`css\n.grid {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 20px;\n}\n\`\`\`\n\n## Kết hợp\n\nDùng Grid cho layout tổng thể, Flexbox cho thành phần bên trong.`,
    thumbnail: "https://picsum.photos/seed/css/600/300",
    tags: [3], status: "published", author: "Nguyễn Văn An",
    createdAt: "2024-01-20", views: 98,
  },
  {
    id: 3, title: "Node.js và Express cơ bản", slug: "nodejs-express-co-ban",
    summary: "Xây dựng REST API đơn giản với Node.js và Express framework.",
    content: `# Node.js và Express cơ bản\n\n## Cài đặt\n\n\`\`\`bash\nnpm init -y\nnpm install express\n\`\`\`\n\n## Tạo server\n\n\`\`\`js\nconst express = require('express');\nconst app = express();\n\napp.use(express.json());\n\napp.get('/api/posts', (req, res) => {\n  res.json({ posts: [] });\n});\n\napp.listen(3000, () => console.log('Server running'));\n\`\`\`\n\n## Kết luận\n\nExpress giúp tạo REST API **nhanh** và **đơn giản**.`,
    thumbnail: "https://picsum.photos/seed/node/600/300",
    tags: [4, 2], status: "published", author: "Nguyễn Văn An",
    createdAt: "2024-02-01", views: 201,
  },
  {
    id: 4, title: "Python cho người mới bắt đầu", slug: "python-cho-nguoi-moi",
    summary: "Hướng dẫn cơ bản về Python, từ cú pháp đến lập trình hướng đối tượng.",
    content: `# Python cho người mới\n\n## Biến và kiểu dữ liệu\n\n\`\`\`python\nname = "Python"\nversion = 3.12\nis_awesome = True\nnumbers = [1, 2, 3]\n\`\`\`\n\n## Vòng lặp\n\n\`\`\`python\nfor i in range(10):\n    print(f"Số: {i}")\n\`\`\`\n\n## Hàm\n\n\`\`\`python\ndef greet(name: str) -> str:\n    return f"Xin chào, {name}!"\n\nprint(greet("An"))\n\`\`\`\n\n## Class\n\n\`\`\`python\nclass Dog:\n    def __init__(self, name: str):\n        self.name = name\n    def bark(self):\n        return "Gâu gâu!"\n\`\`\``,
    thumbnail: "https://picsum.photos/seed/python/600/300",
    tags: [5], status: "published", author: "Nguyễn Văn An",
    createdAt: "2024-02-10", views: 315,
  },
  {
    id: 5, title: "Docker cơ bản cho Developer", slug: "docker-co-ban",
    summary: "Tìm hiểu Docker container, image và cách triển khai ứng dụng.",
    content: `# Docker cơ bản\n\n## Container là gì?\n\nContainer là môi trường **đóng gói** ứng dụng cùng dependencies, chạy nhất quán mọi nơi.\n\n## Lệnh cơ bản\n\n\`\`\`bash\ndocker pull nginx          # Tải image\ndocker run -d -p 80:80 nginx  # Chạy container\ndocker ps                  # Liệt kê container\ndocker stop <id>           # Dừng container\n\`\`\`\n\n## Dockerfile\n\n\`\`\`dockerfile\nFROM node:18-alpine\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci\nCOPY . .\nEXPOSE 3000\nCMD ["node", "index.js"]\n\`\`\``,
    thumbnail: "https://picsum.photos/seed/docker/600/300",
    tags: [6, 4], status: "published", author: "Nguyễn Văn An",
    createdAt: "2024-02-20", views: 178,
  },
  {
    id: 6, title: "JavaScript ES2024 tính năng mới", slug: "javascript-es2024",
    summary: "Những tính năng mới nhất trong JavaScript ES2024 bạn cần biết.",
    content: `# JavaScript ES2024\n\n## Object.groupBy\n\nNhóm phần tử theo key:\n\n\`\`\`js\nconst items = [{type:'a',v:1},{type:'b',v:2},{type:'a',v:3}];\nconst grouped = Object.groupBy(items, ({type}) => type);\n// { a: [{...},{...}], b: [{...}] }\n\`\`\`\n\n## Promise.withResolvers\n\n\`\`\`js\nconst { promise, resolve, reject } = Promise.withResolvers();\nsetTimeout(() => resolve('done'), 1000);\n\`\`\`\n\n## Array.prototype.toSorted / toReversed\n\n\`\`\`js\nconst arr = [3, 1, 2];\nconst sorted = arr.toSorted(); // [1,2,3] — không mutate arr gốc\n\`\`\``,
    thumbnail: "https://picsum.photos/seed/js2024/600/300",
    tags: [2], status: "draft", author: "Nguyễn Văn An",
    createdAt: "2024-03-01", views: 55,
  },
  {
    id: 7, title: "Tối ưu hiệu năng React App", slug: "toi-uu-react-app",
    summary: "Các kỹ thuật tối ưu hiệu năng cho ứng dụng React của bạn.",
    content: `# Tối ưu hiệu năng React\n\n## useMemo\n\nCache kết quả tính toán nặng:\n\n\`\`\`tsx\nconst filtered = useMemo(\n  () => list.filter(i => i.active),\n  [list]\n);\n\`\`\`\n\n## useCallback\n\nTránh tạo lại function mỗi render:\n\n\`\`\`tsx\nconst handleClick = useCallback((id: number) => {\n  setSelected(id);\n}, []);\n\`\`\`\n\n## React.memo\n\nSkip re-render khi props không đổi:\n\n\`\`\`tsx\nconst Card = React.memo(({ title }: { title: string }) => (\n  <div>{title}</div>\n));\n\`\`\`\n\n## Code Splitting\n\n\`\`\`tsx\nconst LazyPage = React.lazy(() => import('./Page'));\n\`\`\``,
    thumbnail: "https://picsum.photos/seed/perf/600/300",
    tags: [1, 2], status: "published", author: "Nguyễn Văn An",
    createdAt: "2024-03-05", views: 267,
  },
  {
    id: 8, title: "CI/CD với GitHub Actions", slug: "cicd-github-actions",
    summary: "Thiết lập pipeline CI/CD tự động với GitHub Actions từ A đến Z.",
    content: `# CI/CD với GitHub Actions\n\n## Workflow cơ bản\n\n\`\`\`yaml\nname: CI/CD Pipeline\non:\n  push:\n    branches: [main]\n  pull_request:\n    branches: [main]\n\njobs:\n  build-and-deploy:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-node@v4\n        with:\n          node-version: 20\n      - run: npm ci\n      - run: npm test\n      - run: npm run build\n      - name: Deploy\n        run: echo "Deploy here"\n\`\`\`\n\n## Kết luận\n\nGitHub Actions giúp **tự động hóa** hoàn toàn quy trình kiểm thử và triển khai.`,
    thumbnail: "https://picsum.photos/seed/cicd/600/300",
    tags: [6], status: "published", author: "Nguyễn Văn An",
    createdAt: "2024-03-10", views: 134,
  },
  {
    id: 9, title: "TypeScript cho React Developer", slug: "typescript-react",
    summary: "Áp dụng TypeScript vào dự án React để code an toàn hơn.",
    content: `# TypeScript cho React Developer\n\n## Tại sao dùng TypeScript?\n\n- **Type safety**: Phát hiện lỗi lúc compile\n- **Autocomplete**: IDE hỗ trợ tốt hơn\n- **Refactoring**: An toàn khi đổi tên, cấu trúc lại code\n\n## Props typing\n\n\`\`\`tsx\ninterface ButtonProps {\n  label: string;\n  onClick: () => void;\n  disabled?: boolean;\n  variant?: 'primary' | 'secondary';\n}\n\nconst Button = ({ label, onClick, disabled = false }: ButtonProps) => (\n  <button onClick={onClick} disabled={disabled}>\n    {label}\n  </button>\n);\n\`\`\`\n\n## useState với type\n\n\`\`\`tsx\nconst [user, setUser] = useState<User | null>(null);\n\`\`\``,
    thumbnail: "https://picsum.photos/seed/typescript/600/300",
    tags: [1, 2], status: "published", author: "Nguyễn Văn An",
    createdAt: "2024-03-15", views: 189,
  },
  {
    id: 10, title: "FastAPI với Python", slug: "fastapi-python",
    summary: "Xây dựng REST API nhanh chóng với FastAPI framework hiện đại.",
    content: `# FastAPI với Python\n\n## Tại sao FastAPI?\n\n- **Nhanh**: Hiệu năng ngang Node.js\n- **Type hint**: Tích hợp Pydantic\n- **Docs tự động**: Swagger UI built-in\n\n## Cài đặt\n\n\`\`\`bash\npip install fastapi uvicorn[standard]\n\`\`\`\n\n## Ví dụ\n\n\`\`\`python\nfrom fastapi import FastAPI\nfrom pydantic import BaseModel\n\napp = FastAPI()\n\nclass Post(BaseModel):\n    title: str\n    content: str\n\n@app.post("/posts")\ndef create_post(post: Post):\n    return {"id": 1, **post.dict()}\n\`\`\`\n\n## Chạy server\n\n\`\`\`bash\nuvicorn main:app --reload\n\`\`\``,
    thumbnail: "https://picsum.photos/seed/fastapi/600/300",
    tags: [5], status: "draft", author: "Nguyễn Văn An",
    createdAt: "2024-03-20", views: 43,
  },
];

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState<T>(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

function parseMarkdown(md: string): string {
  return md
    .replace(
      /```(\w*)\n([\s\S]*?)```/g,
      (_, _lang, code) =>
        `<pre style="background:#1a1a2e;color:#e0e0ff;padding:14px 16px;border-radius:8px;overflow-x:auto;font-size:13px;line-height:1.6"><code>${code
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")}</code></pre>`
    )
    .replace(
      /`([^`]+)`/g,
      `<code style="background:#f0f4ff;color:#4f46e5;padding:2px 6px;border-radius:4px;font-family:monospace;font-size:0.9em">$1</code>`
    )
    .replace(/^### (.+)$/gm, `<h3 style="margin:20px 0 8px;color:#1e293b">$1</h3>`)
    .replace(/^## (.+)$/gm, `<h2 style="margin:28px 0 10px;color:#0f172a;border-bottom:2px solid #e2e8f0;padding-bottom:6px">$1</h2>`)
    .replace(/^# (.+)$/gm, `<h1 style="margin:0 0 24px;color:#0f172a;font-size:1.8em">$1</h1>`)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/^- (.+)$/gm, `<li style="margin:4px 0">$1</li>`)
    .replace(/(<li.*<\/li>)/g, `<ul style="margin:10px 0;padding-left:24px">$1</ul>`)
    .split(/\n\n+/)
    .map((block) =>
      block.startsWith("<") ? block : `<p style="margin:0 0 14px;line-height:1.8">${block}</p>`
    )
    .join("\n");
}

interface TagBadgeProps {
  tag: Tag;
  active?: boolean;
  onClick?: () => void;
}
const TagBadge = ({ tag, active = false, onClick }: TagBadgeProps) => (
  <span
    onClick={onClick}
    className={`tag-badge ${active ? 'tag-badge-active' : 'tag-badge-default'} ${onClick ? 'tag-badge-clickable' : ''}`}
  >
    {tag.name}
  </span>
);

interface PaginationProps {
  page: number;
  total: number;
  perPage: number;
  onChange: (p: number) => void;
}
const Pagination = ({ page, total, perPage, onChange }: PaginationProps) => {
  const totalPages = Math.ceil(total / perPage);
  if (totalPages <= 1) return null;
  return (
    <div className="pagination">
      <button
        className={`pagination-button ${page === 1 ? 'pagination-button-disabled' : 'pagination-button-default'}`}
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
      >
        «
      </button>
      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i}
          className={`pagination-button ${page === i + 1 ? 'pagination-button-active' : 'pagination-button-default'}`}
          onClick={() => onChange(i + 1)}
        >
          {i + 1}
        </button>
      ))}
      <button
        className={`pagination-button ${page === totalPages ? 'pagination-button-disabled' : 'pagination-button-default'}`}
        disabled={page === totalPages}
        onClick={() => onChange(page + 1)}
      >
        »
      </button>
    </div>
  );
};

interface ModalProps {
  title: string;
  wide?: boolean;
  onClose: () => void;
  children: ReactNode;
}
const Modal = ({ title, wide, onClose, children }: ModalProps) => (
  <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
    <div className={`modal-container ${wide ? 'modal-container-wide' : ''}`}>
      <div className="modal-header">
        <h3 className="modal-title">{title}</h3>
        <button className="modal-close" onClick={onClose}>×</button>
      </div>
      {children}
    </div>
  </div>
);

interface PostCardProps {
  post: Post;
  tags: Tag[];
  onView: (post: Post) => void;
  onTagClick: (tagId: number) => void;
}
const PostCard = ({ post, tags, onView, onTagClick }: PostCardProps) => (
  <div className="post-card">
    <img src={post.thumbnail} alt={post.title} className="post-card-image" onClick={() => onView(post)} />
    <div className="post-card-content">
      <div className="post-card-meta">
        {post.createdAt} · {post.author} · {post.views}
      </div>
      <h3 className="post-card-title" onClick={() => onView(post)}>
        {post.title}
      </h3>
      <p className="post-card-summary">{post.summary}</p>
      <div className="post-card-tags">
        {post.tags.map((tid) => {
          const t = tags.find((t) => t.id === tid);
          return t ? <TagBadge key={tid} tag={t} onClick={() => onTagClick(tid)} /> : null;
        })}
      </div>
    </div>
  </div>
);

interface HomePageProps {
  posts: Post[];
  tags: Tag[];
  onView: (post: Post) => void;
}
function HomePage({ posts, tags, onView }: HomePageProps) {
  const PER_PAGE = 9;
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search, 300);

  const published = posts.filter((p) => p.status === "published");

  const filtered = useMemo(() => {
    let result = published;
    if (activeTag !== null) result = result.filter((p) => p.tags.includes(activeTag));
    if (debouncedSearch)
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          p.summary.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
    return result;
  }, [published, activeTag, debouncedSearch]);

  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleTagClick = (tid: number) => {
    setActiveTag((prev) => (prev === tid ? null : tid));
    setPage(1);
  };

  return (
    <div>
      <input
        className="search-input"
        placeholder="Tìm kiếm bài viết..."
        value={search}
        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
      />
      <div className="filter-section">
        <span className="filter-label">Lọc:</span>
        {tags.map((t) => (
          <TagBadge key={t.id} tag={t} active={activeTag === t.id} onClick={() => handleTagClick(t.id)} />
        ))}
        {activeTag !== null && (
          <button className="clear-filter" onClick={() => { setActiveTag(null); setPage(1); }}>
            Xóa lọc
          </button>
        )}
      </div>
      <div className="result-count">{filtered.length} bài viết</div>
      {paginated.length === 0 ? (
        <div className="empty-state">Không tìm thấy bài viết nào.</div>
      ) : (
        <div className="posts-grid">
          {paginated.map((post) => (
            <PostCard key={post.id} post={post} tags={tags} onView={onView} onTagClick={handleTagClick} />
          ))}
        </div>
      )}
      <Pagination page={page} total={filtered.length} perPage={PER_PAGE} onChange={setPage} />
    </div>
  );
}

interface PostDetailPageProps {
  post: Post;
  posts: Post[];
  tags: Tag[];
  onBack: () => void;
  onView: (post: Post) => void;
  onIncrementView: (id: number) => void;
}
function PostDetailPage({ post, posts, tags, onBack, onView, onIncrementView }: PostDetailPageProps) {
  useEffect(() => { onIncrementView(post.id); }, [post.id]);

  const related = posts
    .filter((p) => p.id !== post.id && p.status === "published" && p.tags.some((t) => post.tags.includes(t)))
    .slice(0, 3);

  const postTags = tags.filter((t) => post.tags.includes(t.id));

  return (
    <div className="post-detail-container">
      <button className="back-button" onClick={onBack}>
        ← Quay lại
      </button>
      <img src={post.thumbnail} alt={post.title} className="post-detail-image" />
      <h1 className="post-detail-title">{post.title}</h1>
      <div className="post-detail-meta">
        <strong>{post.author}</strong> · {post.createdAt} · {post.views} lượt xem
      </div>
      <div className="post-detail-tags">
        {postTags.map((t) => <TagBadge key={t.id} tag={t} />)}
      </div>
      <div className="post-content" dangerouslySetInnerHTML={{ __html: parseMarkdown(post.content) }} />
      {related.length > 0 && (
        <div className="related-section">
          <h3 className="related-title">Bài viết liên quan</h3>
          <div className="related-grid">
            {related.map((p) => (
              <div key={p.id} className="related-card" onClick={() => onView(p)}>
                <img src={p.thumbnail} alt={p.title} className="related-image" />
                <div className="related-content">
                  <div className="related-title-text">{p.title}</div>
                  <div className="related-date">{p.createdAt}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function AboutPage() {
  const skills = ["React", "TypeScript", "Node.js", "Python", "Docker", "PostgreSQL", "CSS", "Git"];
  const socials = [
    { label: "GitHub", url: "#", icon: "🐙" },
    { label: "LinkedIn", url: "#", icon: "💼" },
    { label: "Twitter/X", url: "#", icon: "🐦" },
    { label: "Email", url: "mailto:an@example.com", icon: "📧" },
  ];
  
  return (
    <div className="about-container">
      <div className="about-header">
        <img src="https://picsum.photos/seed/author/150/150" alt="Avatar" className="about-avatar" />
        <h1 className="about-name">Nguyễn Quang Huy</h1>
        <p className="about-title">Full-Stack Developer · Technical Writer</p>
      </div>
      
      <div className="about-bio">
        <p>Xin chào! Tôi là Huy — lập trình viên với hơn 5 năm kinh nghiệm xây dựng web application.
        Đam mê chia sẻ kiến thức qua blog và các dự án mã nguồn mở.</p>
        <p style={{ marginTop: 12 }}>Blog này ghi lại hành trình học tập của tôi — từ frontend, backend đến DevOps và best practices.</p>
      </div>
      
      <div className="stats-section">
        <div className="stat-item">
          <span className="stat-number">5+</span>
          <span className="stat-label">Năm kinh nghiệm</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">50+</span>
          <span className="stat-label">Bài viết</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">10k+</span>
          <span className="stat-label">Lượt xem</span>
        </div>
      </div>
      
      <div className="skills-section">
        <h3 className="skills-title">Kỹ năng</h3>
        <div className="skills-list">
          {skills.map((s) => (
            <span key={s} className="skill-badge">{s}</span>
          ))}
        </div>
      </div>
      
      <div className="social-section">
        <h3 className="social-title">Kết nối với tôi</h3>
        <div className="social-links">
          {socials.map((s) => (
            <a key={s.label} href={s.url} className="social-link">
              {s.icon} {s.label}
            </a>
          ))}
        </div>
      </div>
      
      <div className="quote-box">
        "Code là thơ, và mỗi dòng code đều kể một câu chuyện"
      </div>
    </div>
  );
}

type PostFormData = Pick<Post, "title" | "slug" | "summary" | "content" | "thumbnail" | "tags" | "status">;

interface PostFormProps {
  post?: Post;
  tags: Tag[];
  onSave: (data: PostFormData) => void;
  onClose: () => void;
}
function PostForm({ post, tags, onSave, onClose }: PostFormProps) {
  const [form, setForm] = useState<PostFormData>({
    title: post?.title ?? "",
    slug: post?.slug ?? "",
    summary: post?.summary ?? "",
    content: post?.content ?? "",
    thumbnail: post?.thumbnail ?? "",
    tags: post?.tags ?? [],
    status: post?.status ?? "draft",
  });

  const set = <K extends keyof PostFormData>(k: K, v: PostFormData[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const toggleTag = (id: number) =>
    set("tags", form.tags.includes(id) ? form.tags.filter((t) => t !== id) : [...form.tags, id]);

  const autoSlug = (title: string) =>
    title.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");

  const handleSubmit = () => {
    if (!form.title.trim()) return alert("Tiêu đề không được để trống!");
    if (!form.slug.trim()) return alert("Slug không được để trống!");
    onSave(form);
  };

  return (
    <Modal title={post ? "Sửa bài viết" : "Thêm bài viết mới"} wide onClose={onClose}>
      <div className="form-grid">
        <label className="form-label">
          Tiêu đề *
          <input className="form-input" value={form.title}
            onChange={(e) => { set("title", e.target.value); set("slug", autoSlug(e.target.value)); }} />
        </label>
        <label className="form-label">
          Slug *
          <input className="form-input" value={form.slug} onChange={(e) => set("slug", e.target.value)} />
        </label>
      </div>
      <label className="form-label">
        Tóm tắt
        <input className="form-input" value={form.summary} onChange={(e) => set("summary", e.target.value)} />
      </label>
      <label className="form-label">
        Ảnh đại diện (URL)
        <input className="form-input" placeholder="https://..." value={form.thumbnail} onChange={(e) => set("thumbnail", e.target.value)} />
      </label>
      <label className="form-label">
        Nội dung (Markdown)
        <textarea className="form-textarea" value={form.content} onChange={(e) => set("content", e.target.value)} />
      </label>
      <div className="tags-selector">
        <div className="tags-label">Thẻ</div>
        <div className="tags-list">
          {tags.map((t) => (
            <span key={t.id} onClick={() => toggleTag(t.id)}
              className={`tag-option ${form.tags.includes(t.id) ? 'tag-option-selected' : 'tag-option-unselected'}`}>
              {t.name}
            </span>
          ))}
        </div>
      </div>
      <label className="form-label">
        Trạng thái
        <select className="form-input" value={form.status} onChange={(e) => set("status", e.target.value as Status)}>
          <option value="draft">Nháp</option>
          <option value="published">Đã đăng</option>
        </select>
      </label>
      <div className="form-actions">
        <button className="cancel-button" onClick={onClose}>Hủy</button>
        <button className="submit-button" onClick={handleSubmit}>{post ? "Cập nhật" : "Thêm mới"}</button>
      </div>
    </Modal>
  );
}

interface AdminPostsPageProps {
  posts: Post[];
  tags: Tag[];
  onAdd: (data: PostFormData) => void;
  onEdit: (post: Post) => void;
  onDelete: (id: number) => void;
}
function AdminPostsPage({ posts, tags, onAdd, onEdit, onDelete }: AdminPostsPageProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | Status>("all");
  const [showForm, setShowForm] = useState(false);
  const [editPost, setEditPost] = useState<Post | undefined>();
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const debouncedSearch = useDebounce(search, 300);

  const filtered = posts.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(debouncedSearch.toLowerCase());
    const matchStatus = statusFilter === "all" || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleSave = (data: PostFormData) => {
    if (editPost) onEdit({ ...editPost, ...data });
    else onAdd(data);
    setShowForm(false);
    setEditPost(undefined);
  };

  return (
    <div>
      <div className="admin-header">
        <h2 className="admin-title">Quản lý bài viết</h2>
        <button className="admin-add-button" onClick={() => { setEditPost(undefined); setShowForm(true); }}>
          + Thêm bài viết
        </button>
      </div>
      <div className="admin-filters">
        <input className="admin-search" placeholder="Tìm theo tiêu đề..." value={search}
          onChange={(e) => setSearch(e.target.value)} />
        <select className="admin-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as "all" | Status)}>
          <option value="all">Tất cả</option>
          <option value="published">Đã đăng</option>
          <option value="draft">Nháp</option>
        </select>
      </div>
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              {["Tiêu đề", "Trạng thái", "Thẻ", "Lượt xem", "Ngày tạo", "Thao tác"].map((h) => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((post) => (
              <tr key={post.id}>
                <td style={{ fontWeight: 500, color: "#0f172a" }}>{post.title}</td>
                <td>
                  <span className={`status-badge ${post.status === "published" ? 'status-published' : 'status-draft'}`}>
                    {post.status === "published" ? "Đã đăng" : "Nháp"}
                  </span>
                </td>
                <td>
                  {post.tags.map((tid) => {
                    const t = tags.find((t) => t.id === tid);
                    return t ? <TagBadge key={tid} tag={t} /> : null;
                  })}
                </td>
                <td>{post.views}</td>
                <td>{post.createdAt}</td>
                <td>
                  <button className="edit-button" onClick={() => { setEditPost(post); setShowForm(true); }}>
                    Sửa
                  </button>
                  <button className="delete-button" onClick={() => setDeleteId(post.id)}>
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="empty-state">Không tìm thấy bài viết nào.</div>
        )}
      </div>
      {showForm && (
        <PostForm post={editPost} tags={tags} onSave={handleSave}
          onClose={() => { setShowForm(false); setEditPost(undefined); }} />
      )}
      {deleteId !== null && (
        <Modal title="Xác nhận xóa" onClose={() => setDeleteId(null)}>
          <p style={{ color: "#475569", marginTop: 0 }}>Bạn có chắc muốn xóa bài viết này? Hành động này không thể hoàn tác.</p>
          <div className="form-actions">
            <button className="cancel-button" onClick={() => setDeleteId(null)}>Hủy</button>
            <button className="modal-danger-button" onClick={() => { onDelete(deleteId!); setDeleteId(null); }}>
              Xóa
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

interface AdminTagsPageProps {
  tags: Tag[];
  posts: Post[];
  onAddTag: (name: string) => void;
  onEditTag: (id: number, name: string) => void;
  onDeleteTag: (id: number) => void;
}
function AdminTagsPage({ tags, posts, onAddTag, onEditTag, onDeleteTag }: AdminTagsPageProps) {
  const [input, setInput] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const getCount = (tid: number) => posts.filter((p) => p.tags.includes(tid)).length;

  const handleAdd = () => {
    if (!input.trim()) return;
    onAddTag(input.trim());
    setInput("");
  };

  const handleSaveEdit = (id: number) => {
    if (!editName.trim()) return;
    onEditTag(id, editName.trim());
    setEditId(null);
  };

  return (
    <div>
      <h2 className="admin-title" style={{ marginBottom: 20 }}>Quản lý thẻ</h2>
      <div className="tag-input-group">
        <input className="tag-input" value={input} onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          placeholder="Tên thẻ mới... (Enter để thêm)" />
        <button className="tag-add-button" onClick={handleAdd}>+ Thêm</button>
      </div>
      <div className="tag-table-container">
        <table className="tag-table">
          <thead>
            <tr>
              {["Tên thẻ", "Số bài viết", "Thao tác"].map((h) => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tags.map((tag) => (
              <tr key={tag.id}>
                <td>
                  {editId === tag.id ? (
                    <div className="tag-edit-group">
                      <input className="tag-edit-input" value={editName} onChange={(e) => setEditName(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSaveEdit(tag.id)} autoFocus />
                      <button className="tag-save-button" onClick={() => handleSaveEdit(tag.id)}>Lưu</button>
                      <button className="tag-cancel-button" onClick={() => setEditId(null)}>Hủy</button>
                    </div>
                  ) : (
                    <TagBadge tag={tag} />
                  )}
                </td>
                <td>{getCount(tag.id)} bài</td>
                <td>
                  <button className="edit-button" onClick={() => { setEditId(tag.id); setEditName(tag.name); }}>
                    Sửa
                  </button>
                  <button className="delete-button" onClick={() => setDeleteId(tag.id)}>Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {deleteId !== null && (
        <Modal title="Xác nhận xóa thẻ" onClose={() => setDeleteId(null)}>
          <p style={{ color: "#475569", marginTop: 0 }}>Xóa thẻ này sẽ gỡ nó khỏi tất cả bài viết. Bạn có chắc không?</p>
          <div className="form-actions">
            <button className="cancel-button" onClick={() => setDeleteId(null)}>Hủy</button>
            <button className="modal-danger-button" onClick={() => { onDeleteTag(deleteId!); setDeleteId(null); }}>
              Xóa
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

let postIdCounter = SEED_POSTS.length + 1;
let tagIdCounter = SEED_TAGS.length + 1;

export default function App() {
  const [posts, setPosts] = useState<Post[]>(SEED_POSTS);
  const [tags, setTags] = useState<Tag[]>(SEED_TAGS);
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const navItems: { key: Page; label: string }[] = [
    { key: "home", label: "Trang chủ" },
    { key: "about", label: "Giới thiệu" },
    { key: "admin-posts", label: "Quản lý bài viết" },
    { key: "admin-tags", label: "Quản lý thẻ" },
  ];

  const navigate = useCallback((page: Page) => {
    setCurrentPage(page);
    setSelectedPost(null);
  }, []);

  const handleViewPost = useCallback((post: Post) => {
    setSelectedPost(post);
    setCurrentPage("detail");
  }, []);

  const handleIncrementView = useCallback((id: number) => {
    setPosts((ps) => ps.map((p) => (p.id === id ? { ...p, views: p.views + 1 } : p)));
  }, []);

  const handleAddPost = useCallback((data: PostFormData) => {
    const newPost: Post = {
      ...data,
      id: postIdCounter++,
      author: "Nguyễn Văn An",
      createdAt: new Date().toISOString().split("T")[0],
      views: 0,
    };
    setPosts((ps) => [newPost, ...ps]);
  }, []);

  const handleEditPost = useCallback((updated: Post) => {
    setPosts((ps) => ps.map((p) => (p.id === updated.id ? updated : p)));
  }, []);

  const handleDeletePost = useCallback((id: number) => {
    setPosts((ps) => ps.filter((p) => p.id !== id));
  }, []);

  const handleAddTag = useCallback((name: string) => {
    setTags((ts) => [...ts, { id: tagIdCounter++, name }]);
  }, []);

  const handleEditTag = useCallback((id: number, name: string) => {
    setTags((ts) => ts.map((t) => (t.id === id ? { ...t, name } : t)));
  }, []);

  const handleDeleteTag = useCallback((id: number) => {
    setTags((ts) => ts.filter((t) => t.id !== id));
    setPosts((ps) => ps.map((p) => ({ ...p, tags: p.tags.filter((t) => t !== id) })));
  }, []);

  const currentPost = selectedPost ? posts.find((p) => p.id === selectedPost.id) ?? selectedPost : null;

  return (
    <div className="app">
      <nav className="nav">
        <div className="nav-logo">MyBlog</div>
        {navItems.map((item) => (
          <button
            key={item.key}
            onClick={() => navigate(item.key)}
            className={`nav-button ${currentPage === item.key ? 'active' : ''}`}
          >
            {item.label}
          </button>
        ))}
      </nav>
      <main className="main">
        {currentPage === "home" && <HomePage posts={posts} tags={tags} onView={handleViewPost} />}
        {currentPage === "detail" && currentPost && (
          <PostDetailPage
            post={currentPost} posts={posts} tags={tags}
            onBack={() => navigate("home")}
            onView={handleViewPost}
            onIncrementView={handleIncrementView}
          />
        )}
        {currentPage === "about" && <AboutPage />}
        {currentPage === "admin-posts" && (
          <AdminPostsPage posts={posts} tags={tags}
            onAdd={handleAddPost} onEdit={handleEditPost} onDelete={handleDeletePost} />
        )}
        {currentPage === "admin-tags" && (
          <AdminTagsPage tags={tags} posts={posts}
            onAddTag={handleAddTag} onEditTag={handleEditTag} onDeleteTag={handleDeleteTag} />
        )}
      </main>
    </div>
  );
}
