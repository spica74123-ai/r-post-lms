"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function AdminUsersPage() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/users");
    const data = await res.json();
    if (data.success) setUsers(data.users);
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleRoleChange = async (userId: string, newRole: string) => {
    if (!confirm(`ยืนยันการเปลี่ยนสิทธิ์เป็น ${newRole}?`)) return;
    
    const res = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, newRole })
    });
    
    const data = await res.json();
    if (data.success) {
      fetchUsers();
    } else {
      alert("เกิดข้อผิดพลาด: " + data.message);
    }
  };

  const filteredUsers = users.filter(u => 
    `${u.rank}${u.firstName} ${u.lastName}`.includes(search) || u.unit.includes(search)
  );

  return (
    <div className="max-w-6xl mx-auto w-full animate-fade-in">
      <div className="flex flex-col lg:flex-row justify-between lg:items-center mb-6 gap-4 border-b border-gray-200 dark:border-army-700 pb-4">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <i className="fa-solid fa-users-gear text-rta-DEFAULT dark:text-rta-accent mr-3"></i> จัดการสิทธิ์กำลังพล
          <a href="/api/admin/export" className="ml-4 bg-[#f1f4e6] text-rta-DEFAULT hover:bg-rta-DEFAULT hover:text-white dark:bg-army-700 dark:text-rta-accent dark:hover:bg-rta-accent dark:hover:text-army-900 text-[11px] px-3 py-1.5 rounded-lg transition shadow-sm font-bold border border-rta-DEFAULT/20 dark:border-army-600 flex items-center">
            <i className="fa-solid fa-file-excel mr-1.5"></i> ส่งออกรายงาน CSV
          </a>
        </h3>
        <div className="relative w-full lg:w-64">
          <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          <input 
            type="text" 
            placeholder="ค้นหาชื่อ หรือ สังกัด..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-300 dark:border-army-600 rounded-xl py-3 pl-10 pr-4 text-sm bg-white dark:bg-army-800 text-gray-900 dark:text-white outline-none focus:border-rta-DEFAULT transition shadow-sm"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-army-800 rounded-3xl shadow-lg overflow-hidden border border-gray-100 dark:border-army-700">
        <div className="overflow-x-auto min-h-[300px]">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 dark:bg-army-700/50 border-b border-gray-200 dark:border-army-600 text-gray-700 dark:text-gray-200 uppercase text-xs">
              <tr>
                <th className="p-5 font-bold">ยศ-ชื่อ-สกุล</th>
                <th className="p-5 font-bold">สังกัดหน่วย</th>
                <th className="p-5 font-bold">สิทธิ์ปัจจุบัน</th>
                <th className="p-5 font-bold">ปรับสิทธิ์</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-army-700 font-medium">
              {loading ? (
                <tr><td colSpan={4} className="text-center p-10"><i className="fa-solid fa-spinner fa-spin text-3xl text-rta-DEFAULT"></i></td></tr>
              ) : (
                filteredUsers.map((u, i) => (
                  <tr key={u.id} className="hover:bg-white dark:hover:bg-army-700/80 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md relative z-0 hover:z-10 bg-transparent animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
                    <td className="p-5 font-bold text-gray-900 dark:text-white">{u.rank}{u.firstName} {u.lastName}</td>
                    <td className="p-5 text-gray-600 dark:text-gray-400">{u.unit}</td>
                    <td className="p-5">
                      <span className="bg-[#f1f4e6] dark:bg-rta-DEFAULT/20 text-rta-DEFAULT dark:text-rta-accent px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest">{u.role}</span>
                    </td>
                    <td className="p-5">
                      {u.id === session?.user?.id ? (
                        <span className="bg-gray-100 dark:bg-army-700 px-4 py-2 rounded-xl text-xs font-black text-gray-800 dark:text-gray-200"><i className="fa-solid fa-user-check mr-1"></i> บัญชีของคุณ</span>
                      ) : (
                        <select 
                          value={u.role}
                          onChange={(e) => handleRoleChange(u.id, e.target.value)}
                          className="border border-gray-300 dark:border-army-600 rounded-xl p-2 text-xs font-black bg-white dark:bg-army-800 text-gray-900 dark:text-white outline-none cursor-pointer focus:border-rta-DEFAULT transition"
                        >
                          <option value="Learner">ผู้เรียน (Learner)</option>
                          <option value="Commander">ผู้บังคับหน่วย (Commander)</option>
                          <option value="Admin">ผู้ดูแลระบบ (Admin)</option>
                        </select>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
