"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

    <div className="min-h-screen bg-gray-50" dir="rtl">
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 mb-8 text-white text-center">
          <h1 className="text-4xl font-bold mb-2">شرایط استفاده</h1>
          <p className="text-blue-100">لطفاً قبل از استفاده از سرویس، این شرایط را مطالعه کنید</p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-8 text-right">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-right">1. پذیرش شرایط</h2>
            <p className="text-gray-700 leading-relaxed text-right">
              با استفاده از سرویس "اجاره چی"، شما شرایط و قوانین استفاده از این پلتفرم را می‌پذیرید. 
              در صورت عدم پذیرش این شرایط، لطفاً از استفاده از سرویس خودداری کنید.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-right">2. استفاده از سرویس</h2>
            <p className="text-gray-700 leading-relaxed mb-4 text-right">
              شما موظف هستید:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 text-right pr-4">
              <li>اطلاعات دقیق و صحیح ارائه دهید</li>
              <li>از سرویس به صورت قانونی استفاده کنید</li>
              <li>از انجام هرگونه فعالیت غیرقانونی خودداری کنید</li>
              <li>به حقوق دیگر کاربران احترام بگذارید</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-right">3. مسئولیت‌ها</h2>
            <p className="text-gray-700 leading-relaxed text-right">
              کاربران مسئول حفظ و نگهداری کالاهای امانت گرفته شده هستند. 
              در صورت آسیب یا گم شدن کالا، کاربر موظف به جبران خسارت است.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-right">4. پرداخت‌ها</h2>
            <p className="text-gray-700 leading-relaxed text-right">
              تمام پرداخت‌ها باید طبق توافق انجام شده انجام شود. 
              در صورت تأخیر در بازپرداخت، جریمه‌های مربوطه اعمال خواهد شد.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-right">5. تغییرات در شرایط</h2>
            <p className="text-gray-700 leading-relaxed text-right">
              ما حق تغییر این شرایط را در هر زمان محفوظ می‌داریم. 
              تغییرات از طریق سایت اطلاع‌رسانی خواهد شد.
            </p>
          </section>
        </div>
      </div>
      
    </div>
    <Footer />
    </div>
  );
}