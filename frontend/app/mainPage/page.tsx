"use client";
import AppLogo from '@/app/ui/acme-logo';
import { ArrowRightIcon, UserIcon , MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import {lusitana700} from '@/app/ui/fonts';
import {lusitana400} from '@/app/ui/fonts';
import Image from 'next/image';
import { title } from 'process';
import { BookOpen, Hammer, Home, Cpu, Gift, Activity } from "lucide-react";
// React components
import { Swiper, SwiperSlide } from "swiper/react";
// ماژول ها
import { Autoplay } from "swiper/modules";  // << این مسیر جدید
import "swiper/css";  // css پایه swiper
import { Facebook, Instagram, Twitter } from "lucide-react";

type BannerImage = {
  id: number;
  title?: string;
  imageUrl: string;
  link?: string;
};
type Item = {
  id: number;
  title: string;
  imageUrl: string;
  link?: string;
};


export default function Page() {
 const items: Item[] = [
  {
    id: 1,
    title: "کالای نمونه ۱",
    imageUrl: "https://via.placeholder.com/400x300/cccccc/000000?text=Item+1",
    link: "#"
  },
  {
    id: 2,
    title: "کالای نمونه ۲",
    imageUrl: "https://via.placeholder.com/400x300/cccccc/000000?text=Item+2",
    link: "#"
  },
  {
    id: 3,
    title: "کالای نمونه ۳",
    imageUrl: "https://via.placeholder.com/400x300/cccccc/000000?text=Item+3",
    link: "#"
  },
  {
    id: 4,
    title: "کالای نمونه ۴",
    imageUrl: "https://via.placeholder.com/400x300/cccccc/000000?text=Item+4",
    link: "#"
  },
  {
    id: 5,
    title: "کالای نمونه 5",
    imageUrl: "https://via.placeholder.com/400x300/cccccc/000000?text=Item+3",
    link: "#"
  },
  {
    id: 6,
    title: "کالای نمونه 6",
    imageUrl: "https://via.placeholder.com/400x300/cccccc/000000?text=Item+4",
    link: "#"
  },
];

  const categories = [
  { id: 1, title: "کتاب", icon: BookOpen },
  { id: 2, title: "ابزار", icon: Hammer },
  { id: 3, title: "لوازم خانگی", icon: Home },
  { id: 4, title: "الکترونیکی", icon: Cpu },
  { id: 5, title: "اسباب بازی", icon: Gift },
  { id: 6, title: "ورزشی", icon: Activity },
];
const images: BannerImage[] = [
    {
      id: 1,
      title: "",
      imageUrl: "https://berozkala.com/Upload/Files/png/bf247ebe71754014a4e64fd72851b280.png",
      link: "#",
    },
    {
      id: 2,
      title: "",
      imageUrl: "	https://media.rtlcdn.com/2022/03/4c8644462eb3e6dfe231c057453140e5f1f1b61918efba-1050x520.jpg",
      link: "#",
    },
    {
      id: 3,
      title: "",
      imageUrl: "https://pikfree.ir/wp-content/uploads/edd/2022/07/grand-opening-sale-banner-template-with-luxury-red-silk-velvet-curtains-Top.jpg",
      link: "#",
    },
  ];


  return (
   <main className="flex min-h-screen flex-col p-6 gap-10">
    

  <section className="flex flex-col gap-2 px-6">
  {/* تیتر + دسته‌بندی‌ها در یک خط */}
  <div className="flex items-center gap-4 overflow-x-auto no-scrollbar justify-end">

    {/* دکمه‌های دسته‌بندی جلو تیتر */}
    <div className="flex gap-4">
      {categories.map(category => (
        <div key={category.id} className="shrink-0">
          <Link
            href="/categories"
            className="flex flex-row-reverse items-center gap-3 rounded-lg
                       bg-gradient-to-r from-blue-500 to-indigo-500
                       px-5 py-2 text-sm font-semibold text-white shadow-md
                       hover:scale-105 hover:shadow-xl transition-all duration-300 md:text-base"
          >
            <span>{category.title}</span>
            {category.icon && <category.icon className="w-5 h-5" />}
          </Link>
        </div>
      ))}
    </div>
    {/* تیتر سمت راست */}
    <p className={`${lusitana700.className} text-right text-2xl font-bold flex-shrink-0`}>
      :دسته‌بندی‌ها
    </p>
  </div>
</section>


{/* Hero Banner */}
<div className="w-full mt-2 px-6">  {/* mt-2 = 0.5rem */}

  <Swiper
    modules={[Autoplay]}
    spaceBetween={0}
    slidesPerView={1}
    autoplay={{ delay: 3000 }}
    loop={true}
  >
    {images.map((banner) => (
      <SwiperSlide key={banner.id}>
        <a href={banner.link}>
          <div className="relative w-full h-64 md:h-80 lg:h-[500px]">
            <img
              src={banner.imageUrl}
              alt={banner.title || `banner-${banner.id}`}
              className="w-full h-full object-cover rounded-lg"
            />
            {banner.title && (
              <div className="absolute inset-0 flex items-center justify-center">
                <h2 className="text-white text-3xl md:text-5xl font-bold drop-shadow-lg">
                  {banner.title}
                </h2>
              </div>
            )}
          </div>
        </a>
      </SwiperSlide>
    ))}
  </Swiper>
</div>


  {/* ========== جدیدترین‌ها و بیشترین امانت‌شده‌ها ========== */}
{["جدیدترین‌ها", "بیشترین امانت‌شده‌ها"].map((sectionTitle, idx) => (
  <section key={idx} className="flex flex-col gap-6">
    <p className={`${lusitana700.className} text-right text-2xl font-bold`}>
      :{sectionTitle}
    </p>

    <div className="flex gap-6 overflow-x-auto no-scrollbar pb-4">
      {items.map(item => (
        <div key={item.id} className="shrink-0 w-64 md:w-72">
          <div className="group flex flex-col rounded-2xl bg-white shadow-md overflow-hidden
                          hover:shadow-xl hover:-translate-y-1 transition-all duration-300">

            {/* کادر عکس */}
            <div className="h-32 w-full border rounded-lg overflow-hidden mx-4 mt-4">
              <img
                src={item.imageUrl}   // <-- تصاویر از آرایه items
                alt={item.title}
                className="h-full w-full object-cover"
              />
            </div>

            {/* متن و دکمه */}
            <div className="p-4 flex flex-col gap-3 items-center">
              <h3 className="text-center font-semibold text-lg">{item.title}</h3>
              <Link
                href={item.link || "#"}
                className="w-full inline-flex justify-center rounded-md bg-blue-50 px-6 py-2
                           text-sm font-semibold text-blue-700 hover:bg-blue-600 hover:text-white
                           transition-all duration-300"
              >
                مشاهده محصول
              </Link>
            </div>

          </div>
        </div>
      ))}
    </div>
  </section>
))}
<footer className="bg-white text-black py-12 px-6 md:px-20 shadow-inner">
  <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-10 text-right">

    {/* لوگو و توضیح */}
    <div className="flex flex-col gap-3 items-end">
      <h2 className="text-3xl font-extrabold">امانت کالا</h2>
      <p className="text-sm max-w-xs">
        بهترین سایت برای امانت کالاهای متنوع، با تجربه کاربری ساده و سریع
      </p>
    </div>

    {/* لینک‌های مفید */}
    <div className="flex flex-col gap-3 items-end">
      <h3 className="font-semibold text-lg">لینک‌های مفید</h3>
      <Link href="/" className="hover:text-gray-700 transition-colors duration-300 text-right">خانه</Link>
      <Link href="/about" className="hover:text-gray-700 transition-colors duration-300 text-right">درباره ما</Link>
      <Link href="/contact" className="hover:text-gray-700 transition-colors duration-300 text-right">تماس با ما</Link>
      <Link href="/categories" className="hover:text-gray-700 transition-colors duration-300 text-right">دسته‌بندی‌ها</Link>
    </div>

    {/* شبکه‌های اجتماعی */}
    <div className="flex flex-col gap-3 items-end">
      <h3 className="font-semibold text-lg">ما را دنبال کنید</h3>
      <div className="flex gap-4 mt-2 justify-end">
        <Link href="#" className="hover:text-gray-700 transition-colors duration-300">
          <Facebook className="w-6 h-6" />
        </Link>
        <Link href="#" className="hover:text-gray-700 transition-colors duration-300">
          <Instagram className="w-6 h-6" />
        </Link>
        <Link href="#" className="hover:text-gray-700 transition-colors duration-300">
          <Twitter className="w-6 h-6" />
        </Link>
      </div>
    </div>

  </div>

  {/* کپی‌رایت */}
  <div className="mt-12 border-t border-gray-200 pt-4 text-center text-sm">
    © 2025 امانت کالا تمامی حقوق برای این سایت محفوظ است
  </div>
</footer>



</main>




  );
}
