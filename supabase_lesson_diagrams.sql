-- Bổ sung cột lưu URL sơ đồ tổng hợp bài học (chạy trong Supabase SQL Editor)
-- 1. Thêm cột vào bảng lessons
alter table public.lessons
  add column if not exists summary_diagram_url text null;

comment on column public.lessons.summary_diagram_url is 'Public URL của ảnh sơ đồ tổng hợp bài học (lưu trong Storage)';

-- 2. TẠO BUCKET CHO ẢNH SƠ ĐỒ (QUAN TRỌNG - PHẢI LÀM TRƯỚC KHI CHẠY CÁC POLICY BÊN DƯỚI)
-- 
-- CÁCH 1: Tạo qua Supabase Dashboard (KHUYẾN NGHỊ)
--   - Vào Storage → New bucket
--   - Tên bucket: lesson-diagrams
--   - Bật "Public bucket" (quan trọng!)
--   - Click Create
--
-- CÁCH 2: Tạo bằng SQL (thử nếu CÁCH 1 không được)
--   Uncomment dòng dưới và chạy:
--   select storage.create_bucket('lesson-diagrams', public := true);
--
-- LƯU Ý: Nếu gặp lỗi "Bucket not found" khi upload, nghĩa là bucket chưa được tạo!

-- 3. Policy Storage: cho phép mọi người đọc ảnh trong bucket lesson-diagrams
drop policy if exists "lesson_diagrams_public_read" on storage.objects;
create policy "lesson_diagrams_public_read"
  on storage.objects for select
  to public
  using (bucket_id = 'lesson-diagrams');

-- 4. Policy Storage: cho phép anon/authenticated upload (admin dùng anon key trong app có thể cần bật insert)
-- Nếu app chỉ dùng anon key, cần cho phép anon insert vào bucket này.
drop policy if exists "lesson_diagrams_anon_insert" on storage.objects;
create policy "lesson_diagrams_anon_insert"
  on storage.objects for insert
  to anon, authenticated
  with check (bucket_id = 'lesson-diagrams');

drop policy if exists "lesson_diagrams_anon_delete" on storage.objects;
create policy "lesson_diagrams_anon_delete"
  on storage.objects for delete
  to anon, authenticated
  using (bucket_id = 'lesson-diagrams');

drop policy if exists "lesson_diagrams_anon_update" on storage.objects;
create policy "lesson_diagrams_anon_update"
  on storage.objects for update
  to anon, authenticated
  using (bucket_id = 'lesson-diagrams');
