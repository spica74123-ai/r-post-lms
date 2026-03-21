"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

export default function Sidebar({ isOpen, toggleSidebar }: { isOpen: boolean; toggleSidebar: () => void }) {
  const { data: session } = useSession();
  const pathname = usePathname();

  const navItems = [
    { label: "ข่าวสารประกาศ", icon: "fa-bullhorn", path: "/dashboard/announcements" },
    { label: "หลักสูตรออนไลน์", icon: "fa-book-open-reader", path: "/dashboard" },
    { label: "คลังความรู้", icon: "fa-book-bookmark", path: "/dashboard/knowledge" },
    { label: "โปรไฟล์ / ใบประกาศ", icon: "fa-id-badge", path: "/dashboard/profile" },
  ];

  const adminItems = [
    { label: "สถิติภาพรวม", icon: "fa-chart-pie", path: "/admin/stats" },
    { label: "จัดการหลักสูตร", icon: "fa-book-medical", path: "/admin/courses" },
    { label: "นำเข้าข้อสอบ", icon: "fa-file-circle-check", path: "/admin/quiz" },
    { label: "จัดการสิทธิ์บัญชี", icon: "fa-users-gear", path: "/admin/users" },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-sm" onClick={toggleSidebar}></div>}

      <aside className={`bg-white dark:bg-army-800 border-r border-gray-200 dark:border-army-700 w-64 flex-shrink-0 transition-transform duration-300 flex flex-col z-40 fixed md:relative h-full ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"} shadow-2xl md:shadow-none`}>
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100 dark:border-army-700 bg-gray-50 dark:bg-army-900/50">
          <div className="flex items-center space-x-3 text-rta-DEFAULT dark:text-rta-accent">
            <i className="fa-solid fa-shield-halved text-2xl drop-shadow"></i>
            <span className="font-black text-xl tracking-wider">R-POST</span>
          </div>
          <button onClick={toggleSidebar} className="md:hidden text-gray-500 hover:text-rta-DEFAULT"><i className="fa-solid fa-times text-xl"></i></button>
        </div>

        <div className="p-4 border-b border-gray-100 dark:border-army-700 flex items-center space-x-3">
          <div className="w-11 h-11 rounded-full bg-gray-200 dark:bg-army-600 flex items-center justify-center font-bold overflow-hidden shadow-inner">
             <i className="fa-solid fa-user text-gray-400 dark:text-gray-300"></i>
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{session?.user?.name || "กำลังโหลด..."}</p>
            <p className="text-xs text-rta-DEFAULT dark:text-rta-accent font-bold bg-[#f1f4e6] dark:bg-rta-DEFAULT/20 px-2 py-0.5 rounded w-max mt-0.5">{session?.user?.role || "Learner"}</p>
          </div>
        </div>

        <nav className="flex-1 py-4 overflow-y-auto space-y-1 px-3 font-medium">
          <div className="text-xs font-bold text-gray-400 uppercase px-2 mb-2 tracking-widest"><i className="fa-solid fa-folder-tree mr-1"></i> ผู้เรียน (ทั่วไป)</div>
          {navItems.map((item) => (
            <Link key={item.path} href={item.path} className={`flex items-center px-3 py-3 rounded-xl transition ${pathname === item.path ? "bg-[#f1f4e6] dark:bg-army-700 text-rta-DEFAULT dark:text-rta-accent font-bold" : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-army-700"}`}>
              <i className={`fa-solid ${item.icon} w-6 text-center text-lg`}></i><span className="ml-3">{item.label}</span>
            </Link>
          ))}

          {session?.user?.role === "Admin" && (
            <>
              <div className="text-xs font-bold text-rta-DEFAULT dark:text-rta-accent uppercase px-2 mb-2 mt-6 tracking-widest"><i className="fa-solid fa-lock mr-1"></i> ระบบหลังบ้าน</div>
              {adminItems.map((item) => (
                <Link key={item.path} href={item.path} className={`flex items-center px-3 py-3 rounded-xl transition ${pathname.startsWith(item.path) ? "bg-[#f1f4e6] dark:bg-army-700 text-rta-DEFAULT dark:text-rta-accent font-bold" : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-army-700"}`}>
                  <i className={`fa-solid ${item.icon} w-6 text-center text-lg`}></i><span className="ml-3">{item.label}</span>
                </Link>
              ))}
            </>
          )}
        </nav>

        <div className="p-4 border-t border-gray-100 dark:border-army-700 bg-gray-50 dark:bg-army-900/50">
          <button onClick={() => signOut({ callbackUrl: "/login" })} className="w-full flex items-center px-3 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition font-bold">
            <i className="fa-solid fa-right-from-bracket w-6 text-center text-lg"></i><span className="ml-3">ออกจากระบบ</span>
          </button>
        </div>
      </aside>
    </>
  );
}
