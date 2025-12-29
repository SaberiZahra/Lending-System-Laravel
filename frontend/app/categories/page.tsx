import React from "react";
import { ReactNode } from "react";
import Link from 'next/link';
import Image from 'next/image';
import { BookOpenIcon, CakeIcon , GlobeAltIcon } from "@heroicons/react/20/solid";

interface CategoryItem {
  title: string;
  description: string;
  bgClass: string;
  image: string;
  
}

const Categories: CategoryItem[] = [
  {
    title: "لوازم آرایشی",
    description: "انواع لوازم آرایشی از برندهای مختلف را کاربران با شما به اشتراک میگذارند",
    bgClass: "bg-gray-50",
    image:'/makeup.jpg',
    
  },
  {
    title: "بازی و سرگرمی",
    description:
      "انواع بازی های فکری و گروهی و حتی بازی های کامپیوتری رو اینجا می تونی پیدا کنی",
    bgClass: "bg-gray-50",
    image: '/Games.jpg',
  },
  {
    title: "لواز آشپزی",
    description:
      "وسایلی که توی هر آشپزخانه ای می تونه باشه یا لازمه که باشه",
    bgClass: "bg-gray-50",
    image:'/cooking.jpg',
  },
  {
    title: "ابزار آلات",
    description:
      "هر مدل ابزاری که برای تعمیر هر چیزی می تونه لازمت بشه",
    bgClass: "bg-gray-50",
    image: '/mechanic.jpg',
  },
  {
    title: "کتاب",
    description:
      "انواع کتاب ها در ژانرها و نویسنده های مختلف که خیلی وقتا پولشون رو نداری",
    bgClass: "bg-gray-50",
    image: '/book.jpg',
  },
  {
    title: "لوازم ورزشی",
    description:
      "خیلی وقتا میخواهی بری باشگاه ولی پولشو نداری و لوازمش رو هم نداری :( اینجا دیگه از این نگرانی ها خبری نیست",
    bgClass: "bg-gray-50",
    image:'/gym.jpg',
  },
];

const ServicesSection: React.FC = () => {
  return (
    <div className="py-10 px-6">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {Categories.map((Category, index) => (
      <div
        key={index}
        className="flex w-full bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 h-48"
      >
        {/* سمت چپ: مشخصات */}
        <div className="flex-1 p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-2xl font-bold text-right mb-2">{Category.title}</h3>
            <p className="text-right text-gray-700">{Category.description}</p>
          </div>
          <div className="mt-auto flex justify-start">  {/* دکمه سمت چپ */}
            <Link
              href="#"
              className="w-full inline-flex justify-center rounded-md bg-blue-50 px-6 py-2
                         text-sm font-semibold text-blue-700 hover:bg-blue-600 hover:text-white
                         transition-all duration-300"
            >
              بزن بریم
            </Link>
          </div>
        </div>

        {/* سمت راست: عکس */}
        <div className="flex-shrink-0 w-48 h-full">
          <Image
            src={Category.image}
            alt={Category.title}
            width={400}
            height={400}
            className="h-full w-full object-cover rounded-r-xl"
          />
        </div>
      </div>
    ))}
  </div>
</div>






  );
};

export default ServicesSection;
