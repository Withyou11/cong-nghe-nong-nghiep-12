# Hướng dẫn thiết lập Sơ đồ Tổng hợp Bài học

## Bước 1: Tạo bucket Storage trong Supabase

**QUAN TRỌNG:** Phải tạo bucket trước khi upload sơ đồ!

### Cách tạo bucket:

1. Đăng nhập vào [Supabase Dashboard](https://supabase.com/dashboard)
2. Chọn project của bạn
3. Vào **Storage** (menu bên trái)
4. Click **New bucket**
5. Điền thông tin:
   - **Name:** `lesson-diagrams` (phải đúng tên này!)
   - **Public bucket:** ✅ **BẬT** (quan trọng để học sinh có thể xem ảnh)
   - **File size limit:** (tùy chọn, ví dụ: 5MB)
   - **Allowed MIME types:** (tùy chọn, ví dụ: `image/*`)
6. Click **Create bucket**

✅ Sau khi tạo xong, bạn sẽ thấy bucket `lesson-diagrams` trong danh sách Storage.

---

## Bước 2: Chạy SQL migration

1. Vào **SQL Editor** trong Supabase Dashboard
2. Click **New query**
3. Mở file `supabase_lesson_diagrams.sql` trong project
4. Copy toàn bộ nội dung và dán vào SQL Editor
5. Click **Run** (hoặc nhấn Ctrl+Enter)

Script này sẽ:
- ✅ Thêm cột `summary_diagram_url` vào bảng `lessons`
- ✅ Tạo các policy Storage để cho phép đọc/ghi/xóa ảnh trong bucket `lesson-diagrams`

**Lưu ý:** Nếu bạn chưa tạo bucket ở Bước 1, các policy sẽ không hoạt động và bạn sẽ gặp lỗi khi upload.

---

## Bước 3: Kiểm tra

Sau khi hoàn thành Bước 1 và 2:

1. Mở app và đăng nhập Admin
2. Vào trang Admin → tab **Lessons**
3. Click **Edit** (biểu tượng ✏️) trên một bài học
4. Scroll xuống phần **"Sơ đồ tổng hợp bài học"**
5. Click **"Tải lên ảnh sơ đồ"** và chọn một file ảnh
6. Nếu upload thành công → ✅ Hoàn tất!

---

## Xử lý lỗi

### Lỗi: "Bucket not found" (404)

**Nguyên nhân:** Bucket `lesson-diagrams` chưa được tạo.

**Giải pháp:**
- Quay lại **Bước 1** và tạo bucket `lesson-diagrams` trong Supabase Dashboard
- Đảm bảo tên bucket đúng chính xác: `lesson-diagrams` (không có khoảng trắng, chữ thường)

### Lỗi: "new row violates row-level security policy"

**Nguyên nhân:** Policy Storage chưa được tạo hoặc chưa đúng.

**Giải pháp:**
- Chạy lại script SQL trong `supabase_lesson_diagrams.sql` (Bước 2)
- Kiểm tra trong **Storage** → `lesson-diagrams` → **Policies** xem có các policy:
  - `lesson_diagrams_public_read` (SELECT)
  - `lesson_diagrams_anon_insert` (INSERT)
  - `lesson_diagrams_anon_delete` (DELETE)
  - `lesson_diagrams_anon_update` (UPDATE)

### Lỗi: "permission denied"

**Nguyên nhân:** Bucket không phải Public hoặc policy không cho phép anon.

**Giải pháp:**
- Kiểm tra bucket `lesson-diagrams` có bật **Public bucket** không
- Kiểm tra các policy Storage có cho phép `anon` và `authenticated` không

---

## Cấu trúc thư mục trong bucket

Sau khi upload, ảnh sẽ được lưu theo cấu trúc:
```
lesson-diagrams/
  └── {lesson_id}/
      └── {timestamp}_{filename}.jpg
```

Ví dụ: `lesson-diagrams/1/1705123456789_so-do-bai-hoc.jpg`

---

## Xóa sơ đồ

Trong form chỉnh sửa bài học:
- Click **"Xóa sơ đồ"** → URL trong DB sẽ được set về `null`
- File trong Storage vẫn còn (có thể xóa thủ công nếu cần)
