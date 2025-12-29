import { ReactNode } from "react";
import Link from "next/link";
import { UserIcon } from "@heroicons/react/24/outline";

export default function ProfileLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-blue-50">
      {/* Top Banner */}
      <div className="w-full bg-blue-100 p-6 md:p-10 rounded-b-2xl shadow-md mb-8 flex items-center justify-between">
        {/* سمت چپ: لوگو و نام سایت */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
            LOGO
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-blue-800">
            نام سایت شما
          </h1>
        </div>

        
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="bg-white shadow-lg rounded-2xl p-6 md:p-10">
          {children}
        </div>
      </main>
    </div>
  );
}
