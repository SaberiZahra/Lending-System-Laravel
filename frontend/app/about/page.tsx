"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

    
      <div dir="rtl" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 mb-8 text-white text-center">
          <h1 className="text-4xl font-bold mb-2">درباره ما</h1>
          <p className="text-blue-100">آشنایی با "اجاره چی" و تیم ما</p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-8 text-right">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-right">ماموریت ما</h2>
            <p className="text-gray-700 leading-relaxed text-right">
              "اجاره چی" با هدف ایجاد جامعه‌ای پایدار و صرفه‌جو راه‌اندازی شده است. 
              ما معتقدیم که به اشتراک گذاری کالاها می‌تواند به کاهش مصرف و صرفه‌جویی در هزینه‌ها کمک کند.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-right">چرا ما؟</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700 text-right pr-4">
              <li>روند ساده و سریع برای امانت گرفتن و دادن</li>
              <li>سیستم امن و قابل اعتماد</li>
              <li>قیمت‌های مناسب و منصفانه</li>
              <li>پشتیبانی 24/7</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-right">تیم ما</h2>
            <p className="text-gray-700 leading-relaxed text-right">
              تیم "اجاره چی" متشکل از افراد متخصص و با تجربه است که به ارائه بهترین 
              تجربه کاربری متعهد هستند.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-right">تماس با ما</h2>
            <div className="space-y-2 text-gray-700 text-right">
              <p>ایمیل: info@ejarechi.com</p>
              <p>تلفن: 09123456789</p>
              <p>آدرس: تهران، ایران</p>
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}