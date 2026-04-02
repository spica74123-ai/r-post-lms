"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Sidebar({ isOpen, toggleSidebar }: { isOpen: boolean; toggleSidebar: () => void }) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { label: "ข่าวสารประกาศ", icon: "fa-bullhorn", path: "/dashboard/announcements", color: "text-blue-500 dark:text-blue-400" },
    { label: "หลักสูตรออนไลน์", icon: "fa-book-open-reader", path: "/dashboard", color: "text-rta-DEFAULT dark:text-rta-accent" },
    { label: "คลังความรู้", icon: "fa-book-bookmark", path: "/dashboard/knowledge", color: "text-purple-600 dark:text-purple-400" },
    { label: "โปรไฟล์ / ใบประกาศ", icon: "fa-id-badge", path: "/dashboard/profile", color: "text-amber-600 dark:text-amber-400" },
  ];

  const adminItems = [
    { label: "สถิติภาพรวม", icon: "fa-chart-pie", path: "/admin/stats", color: "text-indigo-500 dark:text-indigo-400" },
    { label: "จัดการหลักสูตร", icon: "fa-book-medical", path: "/admin/courses", color: "text-emerald-600 dark:text-emerald-400" },
    { label: "นำเข้าข้อสอบ", icon: "fa-file-circle-check", path: "/admin/quiz", color: "text-rose-500 dark:text-rose-400" },
    { label: "จัดการสิทธิ์บัญชี", icon: "fa-users-gear", path: "/admin/users", color: "text-cyan-600 dark:text-cyan-400" },
    { label: "จัดการประกาศ", icon: "fa-bullhorn", path: "/admin/announcements", color: "text-blue-500 dark:text-blue-400" },
    { label: "จัดการคลังความรู้", icon: "fa-folder-open", path: "/admin/knowledge", color: "text-purple-600 dark:text-purple-400" },
  ];

  const commanderItems = [
    { label: "แฟ้มประวัติกำลังพล", icon: "fa-users-viewfinder", path: "/dashboard/unit", color: "text-orange-600 dark:text-orange-500" },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-sm" onClick={toggleSidebar}></div>}

      <aside className={`${isCollapsed ? "w-20" : "w-64"} flex-shrink-0 bg-white/80 dark:bg-army-900/80 backdrop-blur-2xl border-r border-gray-200/50 dark:border-army-700/50 transition-all duration-500 ease-in-out flex flex-col z-40 fixed md:relative h-full ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"} shadow-2xl md:shadow-none overflow-hidden hover:w-64 group/sidebar`}>
        <div className="h-20 flex items-center justify-between px-4 border-b border-gray-100 dark:border-army-700 bg-gray-50/50 dark:bg-army-900/50 relative">
          <div className="flex items-center space-x-3 text-rta-DEFAULT dark:text-rta-accent w-full justify-center md:justify-start">
            <img src="/logo.png" alt="Logo" className={`w-9 h-9 object-contain drop-shadow transition-all duration-500 animate-pulse-glow`} />
            <span className={`font-black text-xl tracking-wider transition-all duration-500 absolute left-14 ${isCollapsed ? "opacity-0 -translate-x-4 pointer-events-none" : "opacity-100 translate-x-0"} group-hover/sidebar:opacity-100 group-hover/sidebar:translate-x-0 group-hover/sidebar:pointer-events-auto`}>R-POST</span>
          </div>
          
          {/* Desktop Collapse Toggle */}
          <button onClick={() => setIsCollapsed(!isCollapsed)} className={`hidden md:flex absolute right-2 w-8 h-8 rounded-full bg-white dark:bg-army-800 shadow-md border border-gray-200 dark:border-army-700 items-center justify-center text-gray-500 hover:text-rta-DEFAULT transition-all duration-500 ${isCollapsed ? "opacity-0 scale-50" : "opacity-100 scale-100"} group-hover/sidebar:opacity-100 group-hover/sidebar:scale-100 z-10 hover:shadow-lg`}>
            <i className={`fa-solid fa-chevron-left transition-transform duration-500 ${isCollapsed ? "rotate-180" : "rotate-0"}`}></i>
          </button>
          
          <button onClick={toggleSidebar} className="md:hidden absolute right-4 text-gray-500 hover:text-rta-DEFAULT"><i className="fa-solid fa-times text-xl"></i></button>
        </div>

        <div className={`p-4 border-b border-gray-100 dark:border-army-700 flex items-center justify-center md:justify-start transition-all duration-500 relative`}>
          <div className="w-11 h-11 flex-shrink-0 rounded-full bg-gray-200 dark:bg-army-600 flex items-center justify-center font-bold overflow-hidden shadow-inner flex-grow-0">
             <i className="fa-solid fa-user text-gray-400 dark:text-gray-300"></i>
          </div>
          <div className={`absolute left-16 overflow-hidden transition-all duration-500 ${isCollapsed ? "opacity-0 -translate-x-4 pointer-events-none" : "opacity-100 translate-x-0"} group-hover/sidebar:opacity-100 group-hover/sidebar:translate-x-0 group-hover/sidebar:pointer-events-auto w-40`}>
            <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{session?.user?.name || "กำลังโหลด..."}</p>
            <p className="text-[10px] text-rta-DEFAULT dark:text-rta-accent font-black bg-[#f1f4e6] dark:bg-rta-DEFAULT/20 px-2.5 py-0.5 rounded w-max mt-0.5 shadow-sm">{session?.user?.role || "Learner"}</p>
          </div>
        </div>

        <nav className="flex-1 py-4 overflow-y-auto space-y-1 px-3 font-medium custom-scrollbar overflow-x-hidden relative">
          <div className={`text-[10px] font-black text-gray-400 uppercase px-2 mb-2 tracking-widest transition-all duration-500 ${isCollapsed ? "opacity-0 h-0 overflow-hidden" : "opacity-100 h-auto"} group-hover/sidebar:opacity-100 group-hover/sidebar:h-auto whitespace-nowrap`}><i className="fa-solid fa-folder-tree mr-1"></i> ผู้เรียน (ทั่วไป)</div>
          
          {navItems.map((item) => (
            <Link key={item.path} href={item.path} className={`group flex items-center py-3 rounded-xl transition-all duration-300 active:scale-95 ${pathname === item.path ? "bg-[#f1f4e6] dark:bg-army-700 text-rta-DEFAULT dark:text-rta-accent font-black shadow-sm" : "text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-army-700 hover:shadow-sm"} ${isCollapsed ? "px-0 justify-center" : "px-3"} group-hover/sidebar:px-3 group-hover/sidebar:justify-start relative overflow-hidden`} title={isCollapsed ? item.label : undefined}>
              <i className={`fa-solid ${item.icon} ${pathname === item.path ? "" : item.color} w-6 text-center text-[18px] transform group-hover:scale-110 transition-transform duration-300 ${pathname === item.path ? "animate-pulse" : ""} ${isCollapsed ? "" : "ml-1"} group-hover/sidebar:ml-1`}></i>
              <span className={`transform group-hover:translate-x-1 transition-all duration-500 whitespace-nowrap absolute left-12 ${isCollapsed ? "opacity-0 -translate-x-4" : "opacity-100 translate-x-0"} group-hover/sidebar:opacity-100 group-hover/sidebar:translate-x-0`}>{item.label}</span>
            </Link>
          ))}

          {(session?.user?.role === "Commander" || session?.user?.role === "Admin") && (
            <>
              <div className={`text-[10px] font-black text-orange-600 dark:text-orange-400 uppercase px-2 mb-2 mt-6 tracking-widest transition-all duration-500 ${isCollapsed ? "opacity-0 h-0 overflow-hidden" : "opacity-100 h-auto"} group-hover/sidebar:opacity-100 group-hover/sidebar:h-auto whitespace-nowrap`}><i className="fa-solid fa-star mr-1"></i> ผู้บังคับบัญชา</div>
              {commanderItems.map((item) => (
                <Link key={item.path} href={item.path} className={`group flex items-center py-3 rounded-xl transition-all duration-300 active:scale-95 ${pathname.startsWith(item.path) ? "bg-orange-50 dark:bg-army-700 text-orange-600 dark:text-orange-400 font-black shadow-sm" : "text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-army-700 hover:shadow-sm"} ${isCollapsed ? "px-0 justify-center" : "px-3"} group-hover/sidebar:px-3 group-hover/sidebar:justify-start relative overflow-hidden`} title={isCollapsed ? item.label : undefined}>
                  <i className={`fa-solid ${item.icon} ${pathname.startsWith(item.path) ? "" : item.color} w-6 text-center text-[18px] transform group-hover:scale-110 transition-transform duration-300 ${isCollapsed ? "" : "ml-1"} group-hover/sidebar:ml-1`}></i>
                  <span className={`transform group-hover:translate-x-1 transition-all duration-500 whitespace-nowrap absolute left-12 ${isCollapsed ? "opacity-0 -translate-x-4" : "opacity-100 translate-x-0"} group-hover/sidebar:opacity-100 group-hover/sidebar:translate-x-0`}>{item.label}</span>
                </Link>
              ))}
            </>
          )}

          {session?.user?.role === "Admin" && (
            <>
              <div className={`text-[10px] font-black text-rta-DEFAULT dark:text-rta-accent uppercase px-2 mb-2 mt-6 tracking-widest transition-all duration-500 ${isCollapsed ? "opacity-0 h-0 overflow-hidden" : "opacity-100 h-auto"} group-hover/sidebar:opacity-100 group-hover/sidebar:h-auto whitespace-nowrap`}><i className="fa-solid fa-lock mr-1"></i> ระบบหลังบ้าน</div>
              {adminItems.map((item) => (
                <Link key={item.path} href={item.path} className={`group flex items-center py-3 rounded-xl transition-all duration-300 active:scale-95 ${pathname.startsWith(item.path) ? "bg-[#f1f4e6] dark:bg-army-700 text-rta-DEFAULT dark:text-rta-accent font-black shadow-sm" : "text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-army-700 hover:shadow-sm"} ${isCollapsed ? "px-0 justify-center" : "px-3"} group-hover/sidebar:px-3 group-hover/sidebar:justify-start relative overflow-hidden`} title={isCollapsed ? item.label : undefined}>
                  <i className={`fa-solid ${item.icon} ${pathname.startsWith(item.path) ? "" : item.color} w-6 text-center text-[18px] transform group-hover:scale-110 transition-transform duration-300 ${isCollapsed ? "" : "ml-1"} group-hover/sidebar:ml-1`}></i>
                  <span className={`transform group-hover:translate-x-1 transition-all duration-500 whitespace-nowrap absolute left-12 ${isCollapsed ? "opacity-0 -translate-x-4" : "opacity-100 translate-x-0"} group-hover/sidebar:opacity-100 group-hover/sidebar:translate-x-0`}>{item.label}</span>
                </Link>
              ))}
            </>
          )}
        </nav>

        <div className={`p-4 border-t border-gray-100 dark:border-army-700 bg-gray-50 dark:bg-army-900/50 transition-all duration-500 ${isCollapsed ? "px-2" : "px-4"} group-hover/sidebar:px-4`}>
          <button onClick={() => signOut({ callbackUrl: "/login" })} className={`group w-full flex items-center py-3 text-red-500 hover:bg-red-50 hover:shadow-sm dark:hover:bg-red-900/30 rounded-xl transition-all duration-300 active:scale-95 font-bold relative overflow-hidden ${isCollapsed ? "justify-center" : "px-3"} group-hover/sidebar:px-3 group-hover/sidebar:justify-start`}>
            <i className={`fa-solid fa-right-from-bracket w-6 text-center text-[18px] transform group-hover:scale-110 transition-transform duration-300`}></i>
            <span className={`transition-all duration-500 whitespace-nowrap absolute left-12 ${isCollapsed ? "opacity-0 translate-x-4" : "opacity-100 translate-x-0"} group-hover/sidebar:opacity-100 group-hover/sidebar:translate-x-0`}>ออกจากระบบ</span>
          </button>
        </div>
      </aside>
    </>
  );
}
