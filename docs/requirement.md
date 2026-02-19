# 📚 QuizCard - Ứng dụng Học Từ Vựng Thông Minh

## Product Requirements Document (PRD)

**Phiên bản:** 1.1  
**Ngày tạo:** 18/02/2026  
**Cập nhật lần cuối:** 18/02/2026  
**Loại dự án:** Web Application (có thể mở rộng Mobile)

---

## 1. Tổng quan dự án

### 1.1 Mô tả

QuizCard là nền tảng học từ vựng trực tuyến sử dụng phương pháp flashcard kết hợp trí tuệ nhân tạo (AI). Người dùng có thể tạo, chia sẻ và học các bộ từ vựng một cách hiệu quả thông qua các chế độ học đa dạng. Điểm nổi bật là khả năng **tạo tự động các cặp từ vựng bằng Google Gemini AI** từ một câu prompt đơn giản.

### 1.2 Mục tiêu

- Cung cấp công cụ học từ vựng hiệu quả, trực quan (tương tự Quizlet)
- Tích hợp Google Gemini AI để tự động hóa việc tạo nội dung học tập
- Hỗ trợ đa ngôn ngữ (Việt, Anh, Nhật, Hàn...)
- Xây dựng cộng đồng chia sẻ bộ từ vựng chất lượng

### 1.3 Đối tượng người dùng

- Học sinh / Sinh viên luyện thi TOEIC, IELTS, JLPT...
- Người đi làm muốn nâng cao vốn từ vựng
- Giáo viên muốn tạo tài liệu học tập cho học sinh
- Bất kỳ ai muốn học từ vựng ngoại ngữ

---

## 2. Chức năng chính (Features)

### 2.1 Quản lý Tài khoản (Authentication)

#### 2.1.1 Đăng ký (Register)

| Bước | Mô tả | Độ ưu tiên |
|------|--------|-------------|
| 1. Nhập thông tin | Email, password, display name | P0 |
| 2. Gửi email xác thực | Hệ thống gửi email chứa link/mã OTP xác thực | P0 |
| 3. Xác thực email | User click link hoặc nhập OTP để kích hoạt tài khoản | P0 |
| 4. Hoàn tất | Tài khoản được kích hoạt, có thể đăng nhập | P0 |

**Lưu ý quan trọng:**
- Email **bắt buộc phải xác thực** trước khi sử dụng được tài khoản
- Tài khoản chưa xác thực sẽ không thể đăng nhập
- Link xác thực có thời hạn (VD: 24 giờ), hết hạn thì cho phép gửi lại
- Cho phép gửi lại email xác thực (có cooldown 60 giây)

#### 2.1.2 Đăng nhập (Login)

| Chức năng | Mô tả | Độ ưu tiên |
|-----------|--------|-------------|
| Đăng nhập | Email + Password (chỉ tài khoản đã xác thực email) | P0 |
| Remember me | Lưu phiên đăng nhập | P1 |
| Quản lý phiên | JWT access token + refresh token | P0 |

> **Không hỗ trợ OAuth2** (Google, Facebook...). Chỉ sử dụng đăng nhập bằng email + password.

#### 2.1.3 Quên mật khẩu (Forgot Password)

**Flow:**

```
[User nhập email đã đăng ký & đã xác thực]
       ↓
[Hệ thống kiểm tra email tồn tại + đã xác thực]
       ↓
[Gửi email chứa link reset password (có token, hết hạn sau 1 giờ)]
       ↓
[User click link → trang đặt mật khẩu mới]
       ↓
[Nhập mật khẩu mới + xác nhận → Cập nhật thành công]
```

**Lưu ý:**
- Chỉ email **đã xác thực** mới được phép reset password
- Nếu email chưa xác thực → thông báo cần xác thực email trước
- Link reset có thời hạn (1 giờ), mỗi lần chỉ có 1 link active
- Rate limit: tối đa 3 lần request reset / giờ

#### 2.1.4 Hồ sơ cá nhân & Phân quyền

| Chức năng | Mô tả | Độ ưu tiên |
|-----------|--------|-------------|
| Hồ sơ cá nhân | Avatar, tên hiển thị, bio, thống kê học tập | P1 |
| Đổi mật khẩu | Nhập mật khẩu cũ + mật khẩu mới | P1 |
| Phân quyền | User / Admin | P1 |

### 2.2 Quản lý Study Sets (Bộ từ vựng)

| Chức năng | Mô tả | Độ ưu tiên |
|-----------|--------|-------------|
| Tạo Study Set | Tên, mô tả, danh mục, ngôn ngữ gốc/đích | P0 |
| Thêm Term (thuật ngữ) | Cặp term - definition, hỗ trợ hình ảnh, audio | P0 |
| Chỉnh sửa / Xóa | CRUD đầy đủ cho set và từng term | P0 |
| Import / Export | Import từ CSV, Excel; Export ra CSV, PDF | P1 |
| Phân loại | Tags, categories (TOEIC, IELTS, N1, N2...) | P1 |
| Quyền truy cập | Public / Private / Shared (link) | P0 |
| Sao chép bộ từ | Clone study set của người khác về thư viện | P1 |

### 2.3 🤖 Tạo từ vựng bằng AI (AI-Powered Generation)

Đây là tính năng cốt lõi khác biệt của QuizCard. Sử dụng **Google Gemini API** với API key do admin cấu hình trên server.

#### 2.3.1 Giới hạn sử dụng AI

> **Mỗi tài khoản được generate từ vựng bằng AI tối đa 5 lần/ngày. Không cộng dồn.**

| Quy tắc | Chi tiết |
|---------|----------|
| Số lượt/ngày | **5 lần** (mỗi lần gọi API generate = 1 lượt) |
| Reset | Tự động reset về 5 lượt vào **00:00 hàng ngày** (theo timezone server, VD: Asia/Ho_Chi_Minh) |
| Cộng dồn | **KHÔNG cộng dồn**. Nếu hôm nay dùng 2 lượt, ngày mai vẫn chỉ có 5 lượt (không phải 8) |
| Áp dụng | Tất cả endpoint AI generate (`generate-terms`, `extract-from-text`) |
| Hiển thị | Frontend hiển thị số lượt còn lại: "Còn 3/5 lượt AI hôm nay" |
| Hết lượt | Trả về HTTP 429 + message rõ ràng |

**Cơ chế tracking:**

```
Bảng ai_usage_daily:
├── id (PK)
├── user_id (FK → users)
├── usage_date (DATE)            — ngày sử dụng (VD: 2026-02-18)
├── usage_count (INT, default 0) — số lần đã dùng trong ngày (max 5)
├── created_at
└── updated_at

UNIQUE constraint: (user_id, usage_date)
```

**Logic xử lý:**
1. Khi user gọi API AI → kiểm tra record `ai_usage_daily` với `user_id` + `usage_date = TODAY`
2. Nếu chưa có record → tạo mới với `usage_count = 0`
3. Nếu `usage_count >= 5` → reject (HTTP 429)
4. Nếu `usage_count < 5` → gọi Gemini API → nếu thành công thì `usage_count += 1`
5. Không cần cronjob xóa/reset — mỗi ngày mới tự động là record mới

#### 2.3.2 Tạo từ prompt

Người dùng nhập prompt bằng ngôn ngữ tự nhiên, Gemini AI tự động sinh ra danh sách cặp từ vựng.

**Ví dụ prompt:**

| Prompt | Kết quả |
|--------|---------|
| "50 từ vựng TOEIC chủ đề Marketing" | 50 cặp từ tiếng Anh - tiếng Việt về marketing |
| "Kanji N3 liên quan đến công việc" | Danh sách Kanji + Hiragana + nghĩa tiếng Việt |
| "Từ vựng IELTS Academic band 7+" | Từ vựng nâng cao kèm nghĩa và ví dụ |
| "Thành ngữ tiếng Anh thông dụng trong kinh doanh" | Idioms kèm nghĩa và ngữ cảnh sử dụng |

**Flow:**

```
[User nhập prompt] → [Chọn số lượng từ + ngôn ngữ đích]
       ↓
[Kiểm tra giới hạn AI (còn lượt không?)]
       ↓  ← Nếu hết lượt → Thông báo "Hết lượt hôm nay"
[Gọi Gemini API → sinh danh sách từ vựng]
       ↓
[Tăng usage_count += 1]
       ↓
[User review, chỉnh sửa, thêm/bớt từ vựng]
       ↓
[Lưu thành Study Set]
```

#### 2.3.3 Tạo từ văn bản / tài liệu

- Upload file (PDF, DOCX, TXT) hoặc paste nội dung
- AI trích xuất từ vựng quan trọng và tạo definition tương ứng
- Mỗi lần extract = **1 lượt AI** (tính vào giới hạn 5 lượt/ngày)
- Hữu ích cho: đọc bài báo, sách, tài liệu chuyên ngành

#### 2.3.4 Gợi ý và bổ sung thông minh

- AI gợi ý thêm **câu ví dụ** (example sentence) cho từng từ
- AI tạo **phiên âm IPA** tự động cho từ tiếng Anh
- AI gợi ý **từ đồng nghĩa / trái nghĩa** liên quan
- AI đề xuất **hình ảnh minh họa** phù hợp (qua image search API)
- AI phát hiện và cảnh báo **từ trùng lặp** trong cùng study set

#### 2.3.5 Auto-categorize

AI tự động phân loại bộ từ vựng vào các danh mục phù hợp (TOEIC, IELTS, giao tiếp, chuyên ngành...) dựa trên nội dung.

### 2.4 Chế độ học (Learning Modes)

#### 2.4.1 Flashcard Mode (Lật thẻ)

- Hiển thị term, click để lật xem definition
- Điều hướng bằng nút hoặc phím mũi tên ← →
- Thanh progress bar hiển thị tiến trình (1/148)
- Tùy chọn: hiển thị term trước hoặc definition trước
- Shuffle (xáo trộn) thứ tự thẻ
- Đánh dấu thẻ "đã thuộc" / "cần ôn lại"

#### 2.4.2 Quiz Mode (Kiểm tra)

| Dạng câu hỏi | Mô tả |
|---------------|--------|
| Multiple Choice | Chọn đáp án đúng trong 4 phương án |
| True / False | Đúng hoặc sai |
| Fill in the blank | Điền từ vào chỗ trống |
| Matching | Nối term với definition tương ứng |

**Cấu hình Quiz:**
- Chọn số lượng câu hỏi
- Chọn dạng câu hỏi (mix hoặc single type)
- Giới hạn thời gian (optional)
- Hiển thị kết quả + đáp án chi tiết sau khi hoàn thành

#### 2.4.3 Spaced Repetition (Lặp lại ngắt quãng) — Đề xuất thêm

Áp dụng thuật toán SM-2 (hoặc tương tự) để lên lịch ôn tập tối ưu:

- Từ mới → ôn sau 1 ngày
- Nhớ tốt → tăng interval (3 ngày → 7 ngày → 14 ngày → 30 ngày)
- Quên → reset về interval ngắn
- Dashboard hiển thị số từ cần ôn hôm nay

#### 2.4.4 Writing Mode — Đề xuất thêm

- Hiển thị definition, người dùng phải gõ đúng term
- Hỗ trợ kiểm tra chính tả linh hoạt (chấp nhận gần đúng)
- Đặc biệt hữu ích cho việc học Kanji, Hanzi

#### 2.4.5 Speed Challenge — Đề xuất thêm

- Chế độ thi đấu tốc độ: trả lời đúng càng nhanh càng nhiều điểm
- Leaderboard cho từng study set
- Có thể thách đấu với bạn bè (real-time hoặc async)

### 2.5 Trang chủ (Home Page)

- Hiển thị các study set được **đề xuất** (trending, mới nhất, phù hợp)
- Study sets gần đây của user
- Quick access vào chế độ ôn tập hàng ngày (Spaced Repetition)
- Thống kê nhanh: streak, số từ đã học hôm nay
- Hiển thị số lượt AI còn lại hôm nay

### 2.6 Thư viện (Library)

- Danh sách tất cả study sets của user (đã tạo + đã lưu)
- Bộ lọc: theo danh mục, ngôn ngữ, ngày tạo, quyền truy cập
- Tìm kiếm trong thư viện cá nhân
- Badge "PUBLIC" / "PRIVATE" trên mỗi set
- Hiển thị: tên set, số lượng terms, tác giả

### 2.7 Khám phá & Cộng đồng (Explore) — Đề xuất thêm

- Tìm kiếm study sets public theo keyword, category
- Xếp hạng study sets phổ biến nhất
- Follow tác giả yêu thích
- Đánh giá & review study sets (rating 1-5 sao)
- Lớp học (Classroom): giáo viên tạo lớp, giao bài, theo dõi tiến trình học sinh

### 2.8 Thông báo (Notifications)

- Nhắc nhở ôn tập hàng ngày (push notification / email)
- Thông báo khi có người follow, like, clone study set
- Cập nhật từ study sets đã lưu (khi tác giả gốc chỉnh sửa)

### 2.9 Gamification — Đề xuất thêm

| Element | Mô tả |
|---------|--------|
| Streak | Chuỗi ngày học liên tiếp |
| XP Points | Điểm kinh nghiệm nhận được khi học |
| Badges | Huy hiệu thành tích (100 từ đầu tiên, 7-day streak...) |
| Level System | Hệ thống cấp độ dựa trên XP |
| Leaderboard | Bảng xếp hạng tuần/tháng |

---

## 3. Tích hợp AI — Chi tiết kỹ thuật

### 3.1 AI Provider

| Cấu hình | Chi tiết |
|-----------|----------|
| Provider | **Google Gemini** |
| API Key | Do admin cấu hình trên server (biến môi trường `GEMINI_API_KEY`) |
| Model | `gemini-2.0-flash` (hoặc model phù hợp tại thời điểm triển khai) |
| Vị trí gọi API | **Chỉ gọi từ Backend** (Spring Boot). Frontend KHÔNG bao giờ chứa API key |
| Response format | Yêu cầu Gemini trả về JSON có cấu trúc (structured output) |

### 3.2 Giới hạn sử dụng AI (tổng hợp)

| Quy tắc | Giá trị |
|---------|---------|
| Lượt / ngày / user | **5 lượt** |
| Reset | 00:00 hàng ngày (Asia/Ho_Chi_Minh) |
| Cộng dồn | **KHÔNG** — mỗi ngày luôn là 5 lượt mới |
| Endpoint tính lượt | `generate-terms`, `extract-from-text` |
| Endpoint KHÔNG tính lượt | `suggest-examples`, `suggest-synonyms` (nếu dùng logic local thay vì AI) |

### 3.3 API Endpoints liên quan AI

```
POST /api/ai/generate-terms
Headers: Authorization: Bearer <jwt_token>
Body: {
  "prompt": "50 từ vựng TOEIC chủ đề Finance",
  "count": 50,
  "sourceLanguage": "en",
  "targetLanguage": "vi",
  "difficulty": "intermediate",
  "includeExamples": true,
  "includeIpa": true
}

Response 200: {
  "remainingUsage": 4,
  "terms": [
    {
      "term": "revenue",
      "definition": "doanh thu",
      "ipa": "/ˈrevənjuː/",
      "example": "The company's revenue increased by 20% this quarter.",
      "exampleTranslation": "Doanh thu của công ty tăng 20% trong quý này.",
      "synonyms": ["income", "earnings"],
      "category": "Finance"
    }
  ]
}

Response 429: {
  "error": "AI_LIMIT_EXCEEDED",
  "message": "Bạn đã hết lượt sử dụng AI hôm nay (5/5). Vui lòng quay lại vào ngày mai.",
  "resetAt": "2026-02-19T00:00:00+07:00"
}
```

```
GET  /api/ai/usage       — Lấy thông tin lượt AI còn lại hôm nay
POST /api/ai/extract-from-text  — Trích xuất từ văn bản (tính 1 lượt)
```

**Response GET /api/ai/usage:**
```json
{
  "date": "2026-02-18",
  "usageCount": 2,
  "maxUsage": 5,
  "remaining": 3,
  "resetAt": "2026-02-19T00:00:00+07:00"
}
```

### 3.4 Prompt Template (Backend gửi cho Gemini)

Backend sẽ wrap prompt của user vào system prompt chuẩn hóa:

```
Bạn là trợ lý tạo từ vựng. Dựa trên yêu cầu của người dùng, hãy tạo danh sách từ vựng
với format JSON như sau:
[
  {
    "term": "từ gốc",
    "definition": "nghĩa",
    "ipa": "phiên âm (nếu có)",
    "example": "câu ví dụ sử dụng từ",
    "exampleTranslation": "dịch câu ví dụ"
  }
]

Yêu cầu của người dùng: {user_prompt}
Số lượng từ: {count}
Ngôn ngữ gốc: {source_language}
Ngôn ngữ đích: {target_language}
Độ khó: {difficulty}

Chỉ trả về JSON array, không giải thích thêm.
```

### 3.5 Text-to-Speech (TTS)

- Tích hợp Web Speech API (frontend, miễn phí)
- Phát âm tự động cho term (tiếng Anh, Nhật, Hàn...)
- Cho phép user nghe lại nhiều lần

---

## 4. UI/UX Design

### 4.1 Layout chung

- **Sidebar trái:** Điều hướng chính (Trang chủ, Thư viện, Thông báo, Khám phá)
- **Main content:** Chiếm phần lớn không gian
- **Theme:** Dark mode (mặc định, như trong mockup), hỗ trợ Light mode
- **Responsive:** Desktop-first, hỗ trợ tablet và mobile

### 4.2 Trang chủ

- Grid layout hiển thị các study set cards (4 cột trên desktop)
- Mỗi card gồm: icon, tên set, số thuật ngữ, tác giả
- Phân vùng: "Tiếp tục học", "Được đề xuất", "Phổ biến"
- Hiển thị AI usage badge: "🤖 Còn 3/5 lượt AI hôm nay"

### 4.3 Study Set Library

- Grid layout với cards
- Badge trạng thái (PUBLIC/PRIVATE)
- Hiển thị: tên, số terms, tác giả
- Toolbar: search, filter, sort, view mode (grid/list)

### 4.4 Flashcard View

- Header: tên study set, tác giả, số terms, nút "Start Quiz"
- Progress: "1 / 148" + progress bar
- Card lật (flip animation): mặt trước (TERM) / mặt sau (DEFINITION)
- Gradient card design (tím - xanh như mockup)
- Navigation: nút ← → hoặc phím mũi tên
- Hướng dẫn: "Click card to flip", "← / → to navigate"

### 4.5 Trang AI Generate

- Input prompt (textarea)
- Các option: số lượng từ, ngôn ngữ, độ khó
- Hiển thị rõ ràng: **"Còn X/5 lượt hôm nay"**
- Nút generate (disabled + tooltip khi hết lượt)
- Khu vực preview kết quả → cho phép edit từng term trước khi lưu
- Nút "Lưu thành Study Set"

### 4.6 Auth Pages

- **Register:** Form email + password + display name → thông báo "Kiểm tra email để xác thực"
- **Verify Email:** Trang xác nhận thành công / hết hạn link
- **Login:** Form email + password, link "Quên mật khẩu?"
- **Forgot Password:** Nhập email → thông báo "Đã gửi link reset"
- **Reset Password:** Form nhập mật khẩu mới + xác nhận

### 4.7 Design System

| Element | Giá trị |
|---------|---------|
| Background | `#0f172a` (dark navy) |
| Card background | `#1e3a5f` (dark blue) |
| Accent / Active | `#22c55e` (green) |
| Card gradient | `linear-gradient(135deg, #6366f1, #a855f7, #6366f1)` |
| Text primary | `#ffffff` |
| Text secondary | `#94a3b8` |
| Border | `#334155` |
| Font | Inter / Noto Sans (hỗ trợ tiếng Việt, Nhật) |
| Border radius | 12px (cards), 8px (buttons) |

---

## 5. Kiến trúc kỹ thuật (Technical Architecture)

### 5.1 Tech Stack

| Layer | Công nghệ |
|-------|-----------|
| **Frontend** | **Angular 17+** (standalone components) + TypeScript |
| UI Framework | Angular Material hoặc PrimeNG + Tailwind CSS |
| State Management | NgRx hoặc Angular Signals |
| **Backend** | **Spring Boot 3.x** (Java 17+) |
| Security | Spring Security + JWT (access token + refresh token) |
| Email | Spring Boot Mail (SMTP) |
| **Database** | **PostgreSQL trên Supabase** |
| ORM | Spring Data JPA / Hibernate |
| **AI Integration** | **Google Gemini API** (API key cấu hình trên server) |
| TTS | Web Speech API (frontend) |
| File Storage | Supabase Storage (hình ảnh, audio) |
| Deployment | Docker + VPS hoặc Railway (BE) + Vercel/Netlify (FE) |
| CI/CD | GitLab CI/CD hoặc GitHub Actions |

### 5.2 Cấu hình Supabase

Supabase được sử dụng **chủ yếu như PostgreSQL managed database** (và tùy chọn Storage). Toàn bộ business logic, authentication, authorization đều nằm ở **Spring Boot backend**.

```
Supabase Project:
├── PostgreSQL Database    — Database chính
├── Supabase Storage       — Lưu trữ hình ảnh, audio (optional)
└── Connection Pooling     — PgBouncer cho connection management
```

**Kết nối từ Spring Boot (`application.yml`):**
```yaml
spring:
  datasource:
    url: jdbc:postgresql://<SUPABASE_HOST>:5432/postgres
    username: postgres
    password: ${SUPABASE_DB_PASSWORD}
    driver-class-name: org.postgresql.Driver
  jpa:
    hibernate:
      ddl-auto: validate
    properties:
      hibernate.dialect: org.hibernate.dialect.PostgreSQLDialect

  # Email (SMTP)
  mail:
    host: smtp.gmail.com
    port: 587
    username: ${MAIL_USERNAME}
    password: ${MAIL_PASSWORD}
    properties:
      mail.smtp.auth: true
      mail.smtp.starttls.enable: true

# Gemini API
gemini:
  api-key: ${GEMINI_API_KEY}
  model: gemini-2.0-flash

# JWT
jwt:
  secret: ${JWT_SECRET}
  access-token-expiration: 3600000      # 1 giờ
  refresh-token-expiration: 604800000    # 7 ngày

# AI Usage
ai:
  daily-limit: 5
  timezone: Asia/Ho_Chi_Minh
```

### 5.3 Database Schema

```sql
-- =============================================
-- AUTHENTICATION & USERS
-- =============================================

CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email           VARCHAR(255) UNIQUE NOT NULL,
    password_hash   VARCHAR(255) NOT NULL,
    display_name    VARCHAR(100) NOT NULL,
    avatar_url      TEXT,
    bio             TEXT,
    role            VARCHAR(20) DEFAULT 'USER',           -- USER, ADMIN
    email_verified  BOOLEAN DEFAULT FALSE,
    streak_count    INT DEFAULT 0,
    xp_points       INT DEFAULT 0,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE email_verification_tokens (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token           VARCHAR(255) UNIQUE NOT NULL,
    expires_at      TIMESTAMPTZ NOT NULL,                -- Hết hạn sau 24 giờ
    used            BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE password_reset_tokens (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token           VARCHAR(255) UNIQUE NOT NULL,
    expires_at      TIMESTAMPTZ NOT NULL,                -- Hết hạn sau 1 giờ
    used            BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE refresh_tokens (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token           VARCHAR(255) UNIQUE NOT NULL,
    expires_at      TIMESTAMPTZ NOT NULL,
    revoked         BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- AI USAGE TRACKING (5 lượt/ngày, không cộng dồn)
-- =============================================

CREATE TABLE ai_usage_daily (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    usage_date      DATE NOT NULL,                        -- Ngày sử dụng
    usage_count     INT DEFAULT 0,                        -- Số lần đã dùng (max 5)
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, usage_date)                           -- 1 record / user / ngày
);

CREATE INDEX idx_ai_usage_user_date ON ai_usage_daily(user_id, usage_date);

-- =============================================
-- STUDY SETS & TERMS
-- =============================================

CREATE TABLE study_sets (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title               VARCHAR(255) NOT NULL,
    description         TEXT,
    source_language     VARCHAR(10),                      -- en, vi, ja, ko...
    target_language     VARCHAR(10),
    category            VARCHAR(100),
    tags                JSONB DEFAULT '[]',
    visibility          VARCHAR(20) DEFAULT 'PRIVATE',    -- PUBLIC, PRIVATE, SHARED
    terms_count         INT DEFAULT 0,
    clone_count         INT DEFAULT 0,
    rating_avg          DECIMAL(3,2) DEFAULT 0,
    created_at          TIMESTAMPTZ DEFAULT NOW(),
    updated_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_study_sets_user ON study_sets(user_id);
CREATE INDEX idx_study_sets_visibility ON study_sets(visibility);

CREATE TABLE terms (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    study_set_id            UUID NOT NULL REFERENCES study_sets(id) ON DELETE CASCADE,
    term                    TEXT NOT NULL,
    definition              TEXT NOT NULL,
    ipa                     VARCHAR(255),
    example_sentence        TEXT,
    example_translation     TEXT,
    image_url               TEXT,
    audio_url               TEXT,
    synonyms                JSONB DEFAULT '[]',
    antonyms                JSONB DEFAULT '[]',
    order_index             INT DEFAULT 0,
    created_at              TIMESTAMPTZ DEFAULT NOW(),
    updated_at              TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_terms_study_set ON terms(study_set_id);

-- =============================================
-- LEARNING & PROGRESS
-- =============================================

CREATE TABLE user_progress (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    term_id             UUID NOT NULL REFERENCES terms(id) ON DELETE CASCADE,
    study_set_id        UUID NOT NULL REFERENCES study_sets(id) ON DELETE CASCADE,
    status              VARCHAR(20) DEFAULT 'NEW',        -- NEW, LEARNING, MASTERED
    ease_factor         DECIMAL(4,2) DEFAULT 2.5,         -- SM-2 algorithm
    interval_days       INT DEFAULT 0,
    next_review_date    DATE,
    review_count        INT DEFAULT 0,
    correct_count       INT DEFAULT 0,
    last_reviewed_at    TIMESTAMPTZ,
    updated_at          TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, term_id)
);

CREATE TABLE quiz_results (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    study_set_id        UUID NOT NULL REFERENCES study_sets(id) ON DELETE CASCADE,
    quiz_type           VARCHAR(50),                      -- multiple_choice, fill_blank, matching, mixed
    total_questions     INT NOT NULL,
    correct_answers     INT NOT NULL,
    score               DECIMAL(5,2),
    time_spent_seconds  INT,
    details             JSONB,                            -- Chi tiết từng câu
    created_at          TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- COMMUNITY (Đề xuất thêm)
-- =============================================

CREATE TABLE classrooms (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name            VARCHAR(255) NOT NULL,
    description     TEXT,
    invite_code     VARCHAR(20) UNIQUE NOT NULL,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE classroom_members (
    classroom_id    UUID NOT NULL REFERENCES classrooms(id) ON DELETE CASCADE,
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role            VARCHAR(20) DEFAULT 'STUDENT',        -- TEACHER, STUDENT
    joined_at       TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY(classroom_id, user_id)
);
```

### 5.4 API Endpoints

```
# =============================================
# AUTH (Không dùng OAuth2)
# =============================================
POST   /api/auth/register                 — Đăng ký (gửi email xác thực)
POST   /api/auth/verify-email             — Xác thực email bằng token
POST   /api/auth/resend-verification      — Gửi lại email xác thực (cooldown 60s)
POST   /api/auth/login                    — Đăng nhập (chỉ email đã verified)
POST   /api/auth/refresh                  — Refresh access token
POST   /api/auth/logout                   — Thu hồi refresh token
POST   /api/auth/forgot-password          — Yêu cầu reset password (gửi email)
POST   /api/auth/reset-password           — Đặt mật khẩu mới (với token)
PUT    /api/auth/change-password           — Đổi mật khẩu (đã đăng nhập)

# =============================================
# USER PROFILE
# =============================================
GET    /api/users/me                       — Lấy thông tin user hiện tại
PUT    /api/users/me                       — Cập nhật profile
POST   /api/users/me/avatar               — Upload avatar

# =============================================
# STUDY SETS
# =============================================
GET    /api/study-sets                     — Danh sách (filter, search, paginate)
GET    /api/study-sets/:id                 — Chi tiết + terms
POST   /api/study-sets                     — Tạo mới
PUT    /api/study-sets/:id                 — Cập nhật
DELETE /api/study-sets/:id                 — Xóa
POST   /api/study-sets/:id/clone           — Clone về thư viện
POST   /api/study-sets/import              — Import từ CSV/Excel

# =============================================
# TERMS
# =============================================
POST   /api/study-sets/:id/terms           — Thêm term
PUT    /api/terms/:id                      — Sửa term
DELETE /api/terms/:id                      — Xóa term

# =============================================
# AI (Gemini) — Giới hạn 5 lượt/ngày, không cộng dồn
# =============================================
GET    /api/ai/usage                       — Lấy số lượt AI còn lại hôm nay
POST   /api/ai/generate-terms              — Tạo từ vựng từ prompt (tính 1 lượt)
POST   /api/ai/extract-from-text           — Trích xuất từ văn bản (tính 1 lượt)

# =============================================
# LEARNING
# =============================================
GET    /api/learning/today                 — Từ cần ôn hôm nay (Spaced Repetition)
POST   /api/learning/review                — Ghi nhận kết quả ôn tập
GET    /api/learning/stats                 — Thống kê học tập

# =============================================
# QUIZ
# =============================================
POST   /api/quiz/generate                  — Tạo quiz từ study set
POST   /api/quiz/submit                    — Nộp bài quiz
GET    /api/quiz/history                   — Lịch sử quiz

# =============================================
# EXPLORE
# =============================================
GET    /api/explore/trending                — Study sets trending
GET    /api/explore/search                  — Tìm kiếm public sets
GET    /api/explore/categories              — Danh mục

# =============================================
# NOTIFICATIONS
# =============================================
GET    /api/notifications                   — Danh sách thông báo
PUT    /api/notifications/:id/read          — Đánh dấu đã đọc
```

### 5.5 Cấu trúc project

**Backend (Spring Boot):**

```
quizcard-api/
├── src/main/java/com/quizcard/
│   ├── QuizCardApplication.java
│   ├── config/
│   │   ├── SecurityConfig.java
│   │   ├── JwtConfig.java
│   │   ├── CorsConfig.java
│   │   └── GeminiConfig.java
│   ├── controller/
│   │   ├── AuthController.java
│   │   ├── UserController.java
│   │   ├── StudySetController.java
│   │   ├── TermController.java
│   │   ├── AiController.java
│   │   ├── QuizController.java
│   │   ├── LearningController.java
│   │   └── ExploreController.java
│   ├── service/
│   │   ├── AuthService.java
│   │   ├── EmailService.java
│   │   ├── JwtService.java
│   │   ├── UserService.java
│   │   ├── StudySetService.java
│   │   ├── TermService.java
│   │   ├── GeminiService.java           ← Gọi Gemini API
│   │   ├── AiUsageService.java          ← Quản lý giới hạn 5 lượt/ngày
│   │   ├── QuizService.java
│   │   └── LearningService.java
│   ├── model/entity/
│   │   ├── User.java
│   │   ├── EmailVerificationToken.java
│   │   ├── PasswordResetToken.java
│   │   ├── RefreshToken.java
│   │   ├── AiUsageDaily.java
│   │   ├── StudySet.java
│   │   ├── Term.java
│   │   ├── UserProgress.java
│   │   └── QuizResult.java
│   ├── model/dto/
│   │   ├── request/
│   │   │   ├── RegisterRequest.java
│   │   │   ├── LoginRequest.java
│   │   │   ├── ForgotPasswordRequest.java
│   │   │   ├── ResetPasswordRequest.java
│   │   │   ├── AiGenerateRequest.java
│   │   │   └── ...
│   │   └── response/
│   │       ├── AuthResponse.java
│   │       ├── AiGenerateResponse.java
│   │       ├── AiUsageResponse.java
│   │       └── ...
│   ├── repository/
│   │   ├── UserRepository.java
│   │   ├── AiUsageDailyRepository.java
│   │   ├── StudySetRepository.java
│   │   ├── EmailVerificationTokenRepository.java
│   │   ├── PasswordResetTokenRepository.java
│   │   └── ...
│   ├── security/
│   │   ├── JwtAuthenticationFilter.java
│   │   └── JwtTokenProvider.java
│   └── exception/
│       ├── AiLimitExceededException.java
│       ├── EmailNotVerifiedException.java
│       └── GlobalExceptionHandler.java
├── src/main/resources/
│   ├── application.yml
│   ├── templates/
│   │   ├── email-verification.html      ← Template email xác thực
│   │   └── password-reset.html          ← Template email reset password
│   └── db/migration/                    ← Flyway migrations
└── pom.xml
```

**Frontend (Angular):**

```
quizcard-web/
├── src/
│   ├── app/
│   │   ├── core/
│   │   │   ├── services/
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── study-set.service.ts
│   │   │   │   ├── ai.service.ts
│   │   │   │   ├── quiz.service.ts
│   │   │   │   └── learning.service.ts
│   │   │   ├── guards/
│   │   │   │   └── auth.guard.ts
│   │   │   ├── interceptors/
│   │   │   │   ├── jwt.interceptor.ts
│   │   │   │   └── error.interceptor.ts
│   │   │   └── models/
│   │   │       ├── user.model.ts
│   │   │       ├── study-set.model.ts
│   │   │       ├── term.model.ts
│   │   │       └── ai-usage.model.ts
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   │   ├── login/
│   │   │   │   ├── register/
│   │   │   │   ├── verify-email/
│   │   │   │   ├── forgot-password/
│   │   │   │   └── reset-password/
│   │   │   ├── home/
│   │   │   ├── library/
│   │   │   ├── study-set/
│   │   │   │   ├── create/
│   │   │   │   ├── detail/
│   │   │   │   └── edit/
│   │   │   ├── flashcard/
│   │   │   ├── quiz/
│   │   │   ├── ai-generate/              ← Trang tạo từ vựng bằng AI
│   │   │   ├── explore/
│   │   │   └── profile/
│   │   ├── shared/
│   │   │   ├── components/
│   │   │   │   ├── sidebar/
│   │   │   │   ├── card/
│   │   │   │   ├── ai-usage-badge/       ← Component "Còn X/5 lượt"
│   │   │   │   └── loading/
│   │   │   └── pipes/
│   │   └── app.routes.ts
│   ├── environments/
│   │   ├── environment.ts
│   │   └── environment.prod.ts
│   └── styles.scss
├── angular.json
├── tailwind.config.js
└── package.json
```

---

## 6. Luồng xử lý chính (Key Flows)

### 6.1 Flow Đăng ký & Xác thực Email

```
User                    Frontend (Angular)           Backend (Spring Boot)         Email Server
 |                           |                              |                          |
 |-- Nhập email, pw, name-->|                              |                          |
 |                           |-- POST /auth/register ------>|                          |
 |                           |                              |-- Tạo user (verified=false)
 |                           |                              |-- Tạo verification token
 |                           |                              |-- Gửi email ------------->|
 |                           |<-- 201: "Kiểm tra email" ---|                          |
 |                           |                              |                          |
 |<-- Nhận email chứa link -|-------------------------------|------------- Email ------|
 |                           |                              |                          |
 |-- Click link ----------->|                              |                          |
 |                           |-- POST /auth/verify-email -->|                          |
 |                           |                              |-- Verify token còn hạn?
 |                           |                              |-- Set email_verified=true
 |                           |<-- 200: "Xác thực OK" ------|                          |
 |                           |                              |                          |
 |-- Đăng nhập bình thường->|                              |                          |
```

### 6.2 Flow Quên mật khẩu

```
User                    Frontend (Angular)           Backend (Spring Boot)         Email Server
 |                           |                              |                          |
 |-- Nhập email ----------->|                              |                          |
 |                           |-- POST /auth/forgot-pw ----->|                          |
 |                           |                              |-- Check: email tồn tại?
 |                           |                              |-- Check: email_verified?
 |                           |                              |   (Nếu chưa → 400)
 |                           |                              |-- Tạo reset token (1h)
 |                           |                              |-- Gửi email ------------->|
 |                           |<-- 200: "Đã gửi email" -----|                          |
 |                           |                              |                          |
 |<-- Nhận email chứa link -|-------------------------------|------------- Email ------|
 |                           |                              |                          |
 |-- Click link ----------->|-- Mở trang reset-password    |                          |
 |-- Nhập mật khẩu mới ---->|                              |                          |
 |                           |-- POST /auth/reset-pw ------>|                          |
 |                           |                              |-- Verify token + còn hạn?
 |                           |                              |-- Update password_hash
 |                           |                              |-- Đánh dấu token đã dùng
 |                           |<-- 200: "Đổi MK OK" --------|                          |
```

### 6.3 Flow AI Generate (với giới hạn 5 lượt/ngày)

```
User                    Frontend (Angular)           Backend (Spring Boot)         Gemini API
 |                           |                              |                          |
 |-- Mở trang AI Generate ->|                              |                          |
 |                           |-- GET /ai/usage ------------>|                          |
 |                           |                              |-- Query ai_usage_daily
 |                           |<-- {remaining: 3, max: 5} ---|                          |
 |                           |                              |                          |
 |-- Thấy "Còn 3/5 lượt" --|                              |                          |
 |                           |                              |                          |
 |-- Nhập prompt + Submit -->|                              |                          |
 |                           |-- POST /ai/generate-terms -->|                          |
 |                           |                              |-- Check usage_count < 5?
 |                           |                              |   (Nếu >= 5 → HTTP 429)
 |                           |                              |-- Wrap prompt template
 |                           |                              |-- Gọi Gemini API ------->|
 |                           |                              |                          |-- Generate
 |                           |                              |<-- JSON response --------|
 |                           |                              |-- usage_count += 1
 |                           |<-- {remaining:2, terms:[...]}|                          |
 |                           |                              |                          |
 |-- Review & edit terms --->|                              |                          |
 |-- Bấm "Lưu Study Set" -->|                              |                          |
 |                           |-- POST /study-sets --------->|                          |
 |                           |<-- 201: Study Set created ---|                          |
```

---

## 7. Lộ trình phát triển (Roadmap)

### Phase 1 — MVP (4-6 tuần)

- Setup project: Angular 17+ / Spring Boot 3.x / Supabase PostgreSQL
- Authentication: Đăng ký với **xác thực email bắt buộc**, Đăng nhập, Quên mật khẩu
- JWT access token + refresh token
- CRUD Study Sets + Terms
- Flashcard Mode (lật thẻ, navigation, progress)
- Study Sets Library (grid view, public/private)
- Trang chủ cơ bản
- Responsive design (desktop + mobile)

### Phase 2 — AI & Quiz (3-4 tuần)

- Tích hợp **Gemini AI** tạo từ vựng từ prompt
- Hệ thống **giới hạn 5 lượt AI/ngày** (không cộng dồn)
- Quiz Mode (multiple choice, fill-in-the-blank)
- Import/Export CSV
- Text-to-Speech (Web Speech API)
- Hệ thống thông báo cơ bản

### Phase 3 — Smart Learning (3-4 tuần)

- Spaced Repetition (thuật toán SM-2)
- AI trích xuất từ văn bản/tài liệu
- Writing Mode
- Thống kê học tập chi tiết

### Phase 4 — Community & Gamification (3-4 tuần)

- Explore: tìm kiếm, trending, categories
- Clone study sets
- Rating & reviews
- Gamification (streak, XP, badges, leaderboard)
- Speed Challenge mode

### Phase 5 — Classroom & Nâng cao (2-3 tuần)

- Classroom cho giáo viên
- Admin dashboard (quản lý users, content, AI usage)
- Mobile app (Flutter) — nếu cần

---

## 8. Yêu cầu phi chức năng (Non-Functional Requirements)

| Tiêu chí | Yêu cầu |
|-----------|----------|
| Performance | Trang load < 2s, API response < 500ms |
| Scalability | Hỗ trợ 10,000+ concurrent users |
| Security | HTTPS, SQL injection prevention, XSS protection, rate limiting, BCrypt password hashing |
| Email Security | Token có thời hạn, one-time use, rate limit gửi email |
| AI Security | **API key Gemini chỉ nằm ở backend**, không expose ra frontend |
| Availability | Uptime 99.5%+ |
| Accessibility | WCAG 2.1 AA compliance |
| i18n | Hỗ trợ giao diện tiếng Việt, tiếng Anh |
| Data Backup | Supabase auto backup + manual backup định kỳ |

---

## 9. Metrics & KPIs

| Metric | Mục tiêu (3 tháng đầu) |
|--------|-------------------------|
| DAU (Daily Active Users) | 500+ |
| Study Sets created | 2,000+ |
| AI generations / day | Theo dõi avg usage per user |
| Avg. session duration | > 10 phút |
| User retention (7-day) | > 40% |
| Quiz completion rate | > 70% |
| Email verification rate | > 80% |

---

## 10. Rủi ro & Giải pháp

| Rủi ro | Giải pháp |
|--------|-----------|
| Gemini API key bị lộ | Key chỉ nằm ở env variable trên server, không gửi về frontend |
| Chi phí Gemini API | Giới hạn 5 lượt/ngày/user, không cộng dồn + caching kết quả tương tự |
| AI sinh nội dung sai | Luôn cho user review & edit trước khi lưu |
| Email spam (verification) | Rate limit gửi email, cooldown 60s giữa các lần resend |
| Abuse tạo account hàng loạt | Captcha khi đăng ký, rate limit theo IP |
| Supabase downtime | Monitor + alert, cân nhắc backup connection |
| Performance với lượng data lớn | Pagination, lazy loading, database indexing |

---

## 11. Tài liệu tham khảo

- UI mockup: 3 ảnh đính kèm (Trang chủ, Library, Flashcard View)
- Quizlet (https://quizlet.com) — tham khảo UX
- Anki — tham khảo thuật toán Spaced Repetition SM-2
- Google Gemini API docs (https://ai.google.dev/docs)
- Supabase docs (https://supabase.com/docs)
- Angular docs (https://angular.dev)
- Spring Boot docs (https://docs.spring.io/spring-boot)