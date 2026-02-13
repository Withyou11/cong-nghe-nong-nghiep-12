# Hướng dẫn lấy script DB từ Supabase

## 1. Chạy script có sẵn trong project

- File **`supabase_lesson_diagrams.sql`** (ở thư mục gốc): thêm cột `summary_diagram_url` và cấu hình Storage cho sơ đồ bài học.
- File **`supabase_exam_files.sql`**: tạo bảng và Storage cho đề thi.

**Cách chạy:**  
Vào [Supabase Dashboard](https://supabase.com/dashboard) → chọn project → **SQL Editor** → New query → dán nội dung file `.sql` → Run.

**Lưu ý:** Bucket `lesson-diagrams` có thể không tạo được bằng SQL. Nếu gặp lỗi, tạo bucket thủ công: **Storage** → **New bucket** → tên `lesson-diagrams` → bật **Public bucket** → Create.

---

## 2. Xuất schema / script DB từ Supabase

### Cách 1: SQL Editor (xem định nghĩa bảng)

Trong **SQL Editor** chạy:

```sql
-- Liệt kê cột của một bảng (thay public.lessons bằng tên bảng nếu cần)
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'lessons'
ORDER BY ordinal_position;
```

Để lấy script **CREATE TABLE** tương đương, có thể dùng extension hoặc công cụ bên ngoài (pg_dump).

### Cách 2: Supabase CLI (khuyến nghị – xuất toàn bộ schema)

1. Cài Supabase CLI (nếu chưa có):

   ```bash
   npm install -g supabase
   ```

2. Đăng nhập:

   ```bash
   supabase login
   ```

3. Link project (Project Settings → General → Reference ID):

   ```bash
   supabase link --project-ref <PROJECT_REF_ID>
   ```

4. Xuất schema (chỉ cấu trúc, không dữ liệu):

   ```bash
   supabase db dump -f schema.sql --schema public
   ```

   File `schema.sql` sẽ chứa các lệnh `CREATE TABLE`, `ALTER TABLE`, v.v. cho schema `public`.

5. (Tùy chọn) Xuất cả dữ liệu:

   ```bash
   supabase db dump -f full_dump.sql --data-only
   ```

### Cách 3: Dashboard – Database → Schema

- Vào **Database** → **Schema Visualizer** hoặc **Tables**: xem cấu trúc bảng trực quan.
- **Table Editor** → chọn bảng → xem cột và kiểu dữ liệu (không xuất ra file script).

### Cách 4: Generate TypeScript types từ DB

- **Project Settings** → **API** → **Project URL** và **anon key** dùng trong app.
- Để sinh type TypeScript từ schema:

  ```bash
  npx supabase gen types typescript --project-id <PROJECT_REF_ID> > src/lib/database.types.ts
  ```

  Hoặc dùng [Supabase CLI](https://supabase.com/docs/guides/cli): `supabase gen types typescript`.

---

## 3. Tóm tắt

| Mục đích              | Cách làm |
|-----------------------|----------|
| Chạy migration sơ đồ  | SQL Editor → dán `supabase_lesson_diagrams.sql` → Run, tạo bucket `lesson-diagrams` qua Storage nếu cần. |
| Xem cấu trúc bảng     | SQL Editor: query `information_schema.columns` hoặc Database → Tables. |
| Xuất full schema SQL  | Supabase CLI: `supabase db dump -f schema.sql --schema public`. |
| Sinh TypeScript types | Supabase CLI: `supabase gen types typescript`. |

Nếu bạn gửi file `schema.sql` hoặc danh sách bảng/cột hiện tại, có thể soạn thêm migration hoặc script phù hợp với cấu trúc DB của bạn.
