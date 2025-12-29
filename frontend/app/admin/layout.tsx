import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-slate-100">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white p-6 space-y-6">
        <div>
          <h2 className="text-xl font-bold">پنل ادمین</h2>
          <p className="text-sm text-slate-400 mt-1">
            مدیریت سیستم
          </p>
        </div>

        <nav className="space-y-2">
          <MenuItem href="/admin">پروفایل ادمین</MenuItem>
          <MenuItem href="/admin/users">کاربران</MenuItem>
          <MenuItem href="/admin/reports">گزارش‌ها</MenuItem>
          <MenuItem href="/admin/messages">پیام‌ها</MenuItem>
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}

function MenuItem({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="block px-4 py-2 rounded-lg hover:bg-blue-500 transition"
    >
      {children}
    </Link>
  );
}
