# Hướng dẫn thiết lập PowerPoint Bài học

## Bước 1: Tạo bucket Storage trong Supabase

**QUAN TRỌNG:** Phải tạo bucket trước khi upload PowerPoint!

### Cách tạo bucket:

1. Đăng nhập vào [Supabase Dashboard](https://supabase.com/dashboard)
2. Chọn project của bạn
3. Vào **Storage** (menu bên trái)
4. Click **New bucket**
5. Điền thông tin:
   - **Name:** `lesson-powerpoints` (phải đúng tên này!)
   - **Public bucket:** ✅ **BẬT** (quan trọng để học sinh có thể tải về file)
   - **File size limit:** (khuyến nghị: 50MB hoặc lớn hơn cho file PowerPoint)
   - **Allowed MIME types:** (tùy chọn, ví dụ: `application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation`)
6. Click **Create bucket**

✅ Sau khi tạo xong, bạn sẽ thấy bucket `lesson-powerpoints` trong danh sách Storage.

---

## Bước 2: Chạy SQL migration

1. Vào **SQL Editor** trong Supabase Dashboard
2. Click **New query**
3. Mở file `supabase_lesson_powerpoints.sql` trong project
4. Copy toàn bộ nội dung và dán vào SQL Editor
5. Click **Run** (hoặc nhấn Ctrl+Enter)

Script này sẽ:
- ✅ Thêm cột `powerpoint_url` vào bảng `lessons`
- ✅ Tạo các policy Storage để cho phép đọc/ghi/xóa file PowerPoint trong bucket `lesson-powerpoints`

**Lưu ý:** Nếu bạn chưa tạo bucket ở Bước 1, các policy sẽ không hoạt động và bạn sẽ gặp lỗi khi upload.

---

## Bước 3: Kiểm tra

Sau khi hoàn thành Bước 1 và 2:

1. Mở app và đăng nhập Admin
2. Vào trang Admin → tab **PowerPoint**
3. Tìm bài học bạn muốn upload PowerPoint
4. Click **"Tải lên PowerPoint"** và chọn file PowerPoint (.ppt hoặc .pptx)
5. Nếu upload thành công → ✅ Hoàn tất!

---

## Xử lý lỗi

### Lỗi: "Bucket not found" (404)

**Nguyên nhân:** Bucket `lesson-powerpoints` chưa được tạo.

**Giải pháp:**
- Quay lại **Bước 1** và tạo bucket `lesson-powerpoints` trong Supabase Dashboard
- Đảm bảo tên bucket đúng chính xác: `lesson-powerpoints` (không có khoảng trắng, chữ thường)

### Lỗi: "new row violates row-level security policy"

**Nguyên nhân:** Policy Storage chưa được tạo hoặc chưa đúng.

**Giải pháp:**
- Chạy lại script SQL trong `supabase_lesson_powerpoints.sql` (Bước 2)
- Kiểm tra trong **Storage** → `lesson-powerpoints` → **Policies** xem có các policy:
  - `lesson_powerpoints_public_read` (SELECT)
  - `lesson_powerpoints_anon_insert` (INSERT)
  - `lesson_powerpoints_anon_delete` (DELETE)
  - `lesson_powerpoints_anon_update` (UPDATE)

### Lỗi: "permission denied"

**Nguyên nhân:** Bucket không phải Public hoặc policy không cho phép anon.

**Giải pháp:**
- Kiểm tra bucket `lesson-powerpoints` có bật **Public bucket** không
- Kiểm tra các policy Storage có cho phép `anon` và `authenticated` không

### Lỗi: "File quá lớn"

**Nguyên nhân:** File PowerPoint vượt quá giới hạn kích thước của bucket.

**Giải pháp:**
- Kiểm tra **File size limit** của bucket `lesson-powerpoints` trong Supabase Dashboard
- Tăng giới hạn kích thước file nếu cần (khuyến nghị: 50MB trở lên)

---

## Cấu trúc thư mục trong bucket

Sau khi upload, file PowerPoint sẽ được lưu theo cấu trúc:
```
lesson-powerpoints/
  └── {lesson_id}/
      └── {timestamp}_{filename}.pptx
```

Ví dụ: `lesson-powerpoints/1/1705123456789_bai-hoc-1.pptx`

---

## Xóa PowerPoint

Trong tab **PowerPoint** của Admin:
- Click **"Xóa"** (biểu tượng 🗑️) trên bài học có PowerPoint → URL trong DB sẽ được set về `null`
- File trong Storage vẫn còn (có thể xóa thủ công nếu cần)

---

## Thay đổi PowerPoint

Trong tab **PowerPoint** của Admin:
- Click **"Thay đổi"** trên bài học đã có PowerPoint
- Chọn file PowerPoint mới → File cũ sẽ được thay thế tự động

---

## Lưu ý

- Mỗi bài học chỉ có thể có **một** file PowerPoint
- File PowerPoint được lưu công khai (public), học sinh có thể tải về trực tiếp
- Hỗ trợ định dạng: `.ppt` và `.pptx`
- Khuyến nghị kích thước file: dưới 50MB để đảm bảo hiệu suất tốt
