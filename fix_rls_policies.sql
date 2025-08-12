-- Script để sửa RLS policies cho bảng quizzes và questions
-- Chạy script này trong Supabase SQL Editor

-- 1. Tắt RLS cho bảng quizzes (cách đơn giản nhất)
ALTER TABLE quizzes DISABLE ROW LEVEL SECURITY;

-- 2. Tắt RLS cho bảng questions
ALTER TABLE questions DISABLE ROW LEVEL SECURITY;

-- Hoặc nếu muốn giữ RLS, tạo policies cho phép tất cả operations:
-- 3. Tạo policy cho bảng quizzes (nếu muốn giữ RLS)
-- DROP POLICY IF EXISTS "Enable all operations for quizzes" ON quizzes;
-- CREATE POLICY "Enable all operations for quizzes" ON quizzes
--     FOR ALL
--     TO authenticated
--     USING (true)
--     WITH CHECK (true);

-- 4. Tạo policy cho bảng questions (nếu muốn giữ RLS)
-- DROP POLICY IF EXISTS "Enable all operations for questions" ON questions;
-- CREATE POLICY "Enable all operations for questions" ON questions
--     FOR ALL
--     TO authenticated
--     USING (true)
--     WITH CHECK (true);

-- 5. Kiểm tra trạng thái RLS
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('quizzes', 'questions'); 