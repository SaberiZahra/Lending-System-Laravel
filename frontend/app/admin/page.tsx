export default function AdminProfilePage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="bg-white rounded-2xl shadow p-6 flex items-center gap-6">
        <div className="h-20 w-20 rounded-full bg-slate-200" />

        <div>
          <h1 className="text-2xl font-bold">ادمین سیستم</h1>
          <p className="text-slate-500">admin@site.com</p>

          <span className="inline-block mt-2 text-sm bg-red-100 text-red-700 px-3 py-1 rounded-full">
            Administrator
          </span>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard title="تعداد کاربران" value="1,245" />
        <StatCard title="گزارش‌های باز" value="18" />
        <StatCard title="پیام‌های جدید" value="7" />
      </section>

      {/* Shortcuts */}
      <section>
        <h2 className="text-xl font-semibold mb-4">
          دسترسی سریع
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <ShortcutCard
            title="مدیریت کاربران"
            description="مشاهده، مسدودسازی و بررسی کاربران"
            href="/admin/users"
          />
          <ShortcutCard
            title="گزارش‌ها"
            description="بررسی تخلفات و گزارش‌های ثبت‌شده"
            href="/admin/reports"
          />
          <ShortcutCard
            title="پیام‌ها"
            description="پیام‌های ارسال‌شده به ادمین"
            href="/admin/messages"
          />
        </div>
      </section>
    </div>
  );
}

function StatCard({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <p className="text-sm text-slate-500">{title}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  );
}

function ShortcutCard({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <a
      href={href}
      className="bg-white rounded-xl shadow p-5 hover:shadow-lg transition block"
    >
      <h3 className="font-semibold">{title}</h3>
      <p className="text-sm text-slate-500 mt-1">
        {description}
      </p>
    </a>
  );
}
