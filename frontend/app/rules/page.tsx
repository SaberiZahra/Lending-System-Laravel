"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function RulesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 mb-8 text-white text-center">
          <h1 className="text-4xl font-bold mb-2">قوانین امانت</h1>
          <p className="text-blue-100">راهنمای کامل برای امانت گرفتن و دادن کالا</p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-8 text-right">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-right">1. شرایط امانت</h2>
            <p className="text-gray-700 leading-relaxed mb-4 text-right">
              برای امانت گرفتن کالا باید:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 text-right pr-4">
              <li>حساب کاربری معتبر داشته باشید</li>
              <li>مبلغ ضمانت را پرداخت کنید</li>
              <li>در تاریخ توافق شده کالا را بازگردانید</li>
              <li>از کالا به درستی نگهداری کنید</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-right">2. مدت زمان امانت</h2>
            <p className="text-gray-700 leading-relaxed text-right">
              مدت زمان امانت باید در زمان درخواست مشخص شود. 
              در صورت نیاز به تمدید، باید با صاحب کالا هماهنگ کنید.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-right">3. مسئولیت‌ها</h2>
            <p className="text-gray-700 leading-relaxed mb-4 text-right">
              کاربر امانت‌گیرنده مسئول است:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 text-right pr-4">
              <li>کالا را در همان شرایط اولیه بازگرداند</li>
              <li>در صورت آسیب، خسارت را جبران کند</li>
              <li>کالا را در زمان مقرر بازگرداند</li>
              <li>از استفاده غیرمجاز خودداری کند</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-right">4. پرداخت</h2>
            <p className="text-gray-700 leading-relaxed text-right">
              هزینه امانت باید قبل از دریافت کالا پرداخت شود. 
              مبلغ ضمانت پس از بازگشت سالم کالا به شما بازگردانده می‌شود.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-right">5. لغو درخواست</h2>
            <p className="text-gray-700 leading-relaxed text-right">
              درخواست امانت می‌تواند توسط هر دو طرف لغو شود. 
              در صورت لغو توسط امانت‌گیرنده، ممکن است هزینه‌ای کسر شود.
            </p>
          </section>
        </div>
      </div>
    </div>
    <Footer />
    </div>
  );
}