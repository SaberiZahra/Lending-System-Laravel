import AppLogo from '@/app/ui/acme-logo';
import { ArrowRightIcon, UserIcon , MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import {lusitana700} from '@/app/ui/fonts';
import {lusitana400} from '@/app/ui/fonts';
import Image from 'next/image';
import { title } from 'process';


export default function Layout({ children }: { children: React.ReactNode }) {
  return (
  <main>
    <header className="w-full bg-white shadow-sm px-6 py-4 flex items-center justify-between">
      
      {/* سمت چپ: لوگو و اسم سایت */}
      <div className="flex items-center gap-4">
        {/* لوگو */}
        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
          LOGO
        </div>
        {/* اسم سایت */}
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">
          نام سایت شما
        </h1>
      </div>

      {/* وسط: باکس جستجو */}
      <div className="flex flex-1 justify-center px-4">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="جستجو..."
            className="w-full px-4 py-2 pr-10 rounded-lg border border-gray-300 text-right placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <MagnifyingGlassIcon className="absolute top-1/2 right-3 -translate-y-1/2 w-5 h-5 text-gray-500" />
        </div>
      </div>

      {/* سمت راست: دکمه ورود / ثبت نام */}
      <div className="flex items-center gap-3">
        <Link
  href="/login"
  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium 
             shadow-md hover:bg-blue-500 hover:scale-105 hover:shadow-xl active:scale-95 
             transition-all duration-300"
>
  <UserIcon className="w-5 h-5" />
  <span>ورود / ثبت نام</span>
</Link>

      </div>
      
    </header>


    <div>{children}</div>
  </main>
);

}