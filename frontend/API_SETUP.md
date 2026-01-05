# راهنمای اتصال فرانت به بکند

## تنظیمات اولیه

### 1. ایجاد فایل `.env.local`

در ریشه پوشه `frontend` یک فایل با نام `.env.local` ایجاد کنید و محتوای زیر را در آن قرار دهید:

```
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api
```

**نکته:** اگر بکند شما روی پورت دیگری اجرا می‌شود، آدرس را تغییر دهید.

### 2. بررسی تنظیمات CORS

فایل `backend/config/cors.php` باید به درستی تنظیم شده باشد. اگر فرانت شما روی پورت دیگری اجرا می‌شود، باید آن را به `allowed_origins` اضافه کنید.

مثال:
```php
'allowed_origins' => ['http://localhost:3000', 'http://localhost:3001'],
```

### 3. اجرای پروژه

#### بکند (Laravel):
```bash
cd backend
php artisan serve
```

#### فرانت (Next.js):
```bash
cd frontend
pnpm dev
# یا
npm run dev
```

## استفاده از API

### Authentication

```typescript
import { authAPI } from '@/lib/api';

// ثبت نام
await authAPI.register({
  full_name: 'نام کامل',
  username: 'نام_کاربری',
  email: 'email@example.com',
  password: 'رمزعبور'
});

// ورود
await authAPI.login({
  login: 'نام_کاربری یا ایمیل',
  password: 'رمزعبور'
});

// خروج
await authAPI.logout();

// دریافت اطلاعات کاربر
await authAPI.me();
```

### استفاده از Helper Functions

```typescript
import { getAuthToken, getUser, isAuthenticated, clearAuth } from '@/lib/auth';

// بررسی اینکه کاربر لاگین است یا نه
if (isAuthenticated()) {
  const user = getUser();
  const token = getAuthToken();
}

// پاک کردن اطلاعات احراز هویت
clearAuth();
```

## API های موجود

- `authAPI` - احراز هویت (register, login, logout, me)
- `itemsAPI` - مدیریت آیتم‌ها
- `listingsAPI` - مدیریت لیستینگ‌ها
- `loansAPI` - مدیریت وام‌ها
- `categoriesAPI` - دسته‌بندی‌ها
- `messagesAPI` - پیام‌ها
- `profileAPI` - پروفایل کاربر

## نکات مهم

1. Token به صورت خودکار در localStorage ذخیره می‌شود
2. در صورت 401 (Unauthorized)، کاربر به صفحه login هدایت می‌شود
3. تمام درخواست‌ها به صورت خودکار token را در header اضافه می‌کنند

