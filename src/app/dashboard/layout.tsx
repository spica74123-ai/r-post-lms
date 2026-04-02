"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-army-900 transition-colors duration-300">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative w-full">
        {/* Topbar */}
        <header className="h-20 bg-white/60 dark:bg-army-900/60 backdrop-blur-2xl border-b border-gray-200/50 dark:border-army-700/50 flex items-center justify-between px-8 shadow-sm transition-colors duration-300 sticky top-0 z-30">
          <div className="flex items-center">
            <button onClick={() => setIsSidebarOpen(true)} className="md:hidden text-gray-500 hover:text-rta-DEFAULT mr-4">
              <i className="fa-solid fa-bars text-xl"></i>
            </button>
            <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white truncate">
              <i className="fa-solid fa-crosshairs mr-2 text-rta-DEFAULT dark:text-rta-accent"></i> ศูนย์การเรียนรู้ R-POST
            </h2>
          </div>
          <button onClick={toggleTheme} className="text-gray-600 dark:text-rta-accent hover:text-rta-DEFAULT transition p-2 bg-gray-100 dark:bg-army-700 rounded-full w-10 h-10 flex items-center justify-center">
            <i className="fa-solid fa-moon"></i>
          </button>
        </header>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 relative flex flex-col custom-scrollbar">
          <div className="animate-fade-in-up flex-1 w-full relative">
            {children}
          </div>
          
          <footer className="mt-12 text-center text-[10px] font-bold text-gray-400 dark:text-gray-500 border-t border-gray-200/50 dark:border-army-700/50 pt-4 pb-2 animate-fade-in uppercase tracking-widest">
             © 2026 R-POST Enterprise LMS. Proudly Built & Developed by <span className="text-rta-DEFAULT dark:text-rta-accent">SPK-RTA</span>. All rights reserved.
          </footer>
        </div>
      </main>
    </div>
  );
}
