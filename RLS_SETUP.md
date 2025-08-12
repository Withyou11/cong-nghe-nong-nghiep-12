# Hướng dẫn sửa lỗi RLS Policy

## Lỗi hiện tại

```
{
    "code": "42501",
    "details": null,
    "hint": null,
    "message": "new row violates row-level security policy for table \"quizzes\""
}
```

## Cách sửa lỗi

### Phương án 1: Tắt RLS (Đơn giản nhất)

1. Vào Supabase Dashboard
2. Chọn project của bạn
3. Vào **Authentication** > **Policies**
4. Tìm bảng `quizzes`
5. Tắt **Row Level Security** cho bảng này

### Phương án 2: Tạo RLS Policy cho phép INSERT

1. Vào Supabase Dashboard
2. Chọn project của bạn
3. Vào **Authentication** > **Policies**
4. Tìm bảng `quizzes`
5. Tạo policy mới với các thông tin:
   - **Policy Name**: `Enable insert for all users`
   - **Target roles**: `authenticated`
   - **Policy definition**: `true`
   - **Operation**: `INSERT`

### Phương án 3: Sử dụng Service Role Key

1. Vào Supabase Dashboard
2. Chọn project của bạn
3. Vào **Settings** > **API**
4. Copy **service_role** key
5. Thay thế **anon** key trong file `.env.local`

## Khuyến nghị

- **Cho development**: Sử dụng Phương án 1 (tắt RLS)
- **Cho production**: Sử dụng Phương án 2 (tạo policy phù hợp)
