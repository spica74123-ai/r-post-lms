"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-army-900 transition-colors duration-300">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative w-full">
        {/* Admin Topbar */}
        <header className="h-20 bg-yellow-50/50 dark:bg-army-900/80 backdrop-blur-3xl border-b border-rta-DEFAULT/20 dark:border-rta-accent/20 flex items-center justify-between px-4 sm:px-8 shadow-sm transition-colors duration-300 sticky top-0 z-30">
          <div className="flex items-center">
            <button onClick={() => setIsSidebarOpen(true)} className="md:hidden text-gray-500 hover:text-rta-DEFAULT mr-4">
              <i className="fa-solid fa-bars text-xl"></i>
            </button>
            <button 
              onClick={() => router.back()} 
              className="mr-3 sm:mr-5 bg-white dark:bg-army-800 text-gray-700 dark:text-gray-300 w-10 h-10 rounded-full shadow hover:text-rta-DEFAULT hover:shadow-md dark:hover:text-rta-accent transition flex items-center justify-center border border-gray-200 dark:border-army-600"
              title="ย้อนกลับ"
            >
              <i className="fa-solid fa-arrow-left"></i>
            </button>
            <h2 className="text-md sm:text-xl font-bold text-gray-900 dark:text-white truncate flex items-center">
              <i className="fa-solid fa-user-shield mr-2 text-rta-DEFAULT dark:text-rta-accent"></i> 
              <span className="hidden sm:inline">ระบบจัดการหลังบ้าน (Admin Center)</span>
              <span className="inline sm:hidden">Admin</span>
            </h2>
          </div>
          
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="hidden sm:flex items-center text-sm font-bold text-gray-700 dark:text-gray-200 hover:text-rta-DEFAULT hover:bg-white dark:hover:text-rta-accent transition bg-white/60 dark:bg-army-800 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-army-700 shadow-sm">
              <i className="fa-solid fa-house mr-2"></i> กลับระบบหน้าบ้าน
            </Link>
            <button onClick={toggleTheme} className="text-gray-600 dark:text-rta-accent hover:text-rta-DEFAULT transition p-2 bg-white dark:bg-army-800 rounded-full w-10 h-10 flex items-center justify-center shadow-sm border border-gray-200 dark:border-army-700">
              <i className="fa-solid fa-moon"></i>
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 relative flex flex-col custom-scrollbar bg-gray-50 dark:bg-army-900">
          <div className="animate-fade-in-up flex-1 w-full relative z-10">
            {children}
          </div>
          
          <footer className="mt-12 text-center text-[10px] font-bold text-gray-400 dark:text-gray-500 border-t border-gray-200/50 dark:border-army-700/50 pt-4 pb-2 animate-fade-in uppercase tracking-widest relative z-10">
             © 2026 R-POST Enterprise Admin. Proudly Built & Developed by <span className="text-rta-DEFAULT dark:text-rta-accent">SPK-RTA</span>. All rights reserved.
          </footer>
        </div>
      </main>
    </div>
  );
}
