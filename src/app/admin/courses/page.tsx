"use client";

import { useState, useEffect } from "react";

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // ดึงข้อมูลวิชาเมื่อเปิดหน้าเว็บ
  const fetchCourses = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/courses");
    const data = await res.json();
    if (data.success) setCourses(data.courses);
    setLoading(false);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("ยืนยันการลบหลักสูตรนี้?")) return;
    await fetch(`/api/admin/courses?id=${id}`, { method: "DELETE" });
    fetchCourses();
  };

  return (
    <div className="max-w-6xl mx-auto w-full animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4 border-b border-gray-200 dark:border-army-700 pb-4">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
          <i className="fa-solid fa-book-medical text-rta-DEFAULT dark:text-rta-accent mr-2"></i> จัดการหลักสูตร R-POST
        </h3>
        <button 
          onClick={() => alert("ระบบพร้อมให้คุณเชื่อมต่อ Modal ฟอร์มในสเต็ปถัดไป!")}
          className="bg-rta-DEFAULT text-white px-6 py-3 rounded-xl text-sm font-bold shadow-lg hover:bg-rta-dark transition"
        >
          <i className="fa-solid fa-plus mr-2"></i> เพิ่มหลักสูตรใหม่
        </button>
      </div>

      <div className="bg-white dark:bg-army-800 rounded-3xl shadow-lg overflow-hidden border border-gray-100 dark:border-army-700">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 dark:bg-army-700/50 border-b border-gray-200 dark:border-army-600 text-gray-700 dark:text-gray-200 uppercase text-xs">
              <tr>
                <th className="p-5 font-bold">รหัสวิชา</th>
                <th className="p-5 font-bold">หมวดหมู่</th>
                <th className="p-5 font-bold">ชื่อหลักสูตร</th>
                <th className="p-5 text-center font-bold">ตอนย่อย</th>
                <th className="p-5 text-center font-bold">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-army-700 text-gray-800 dark:text-gray-200 font-medium">
              {loading ? (
                <tr><td colSpan={5} className="text-center p-10"><i className="fa-solid fa-spinner fa-spin text-3xl text-rta-DEFAULT"></i></td></tr>
              ) : courses.length === 0 ? (
                <tr><td colSpan={5} className="text-center p-10 text-gray-500">ไม่มีข้อมูลหลักสูตร</td></tr>
              ) : (
                courses.map((c: any) => (
                  <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-army-700/50 transition">
                    <td className="p-5 font-black text-rta-DEFAULT dark:text-rta-accent">{c.courseCode}</td>
                    <td className="p-5"><span className="bg-gray-100 dark:bg-army-700 px-3 py-1 rounded-lg text-xs font-bold shadow-sm">{c.category}</span></td>
                    <td className="p-5 font-bold truncate max-w-[200px]">{c.name}</td>
                    <td className="p-5 text-center font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/20">{c.chapters?.length || 0} ตอน</td>
                    <td className="p-5 text-center">
                      <button className="text-blue-600 bg-blue-50 hover:bg-blue-100 p-3 rounded-xl mr-2 transition"><i className="fa-solid fa-pen"></i></button>
                      <button onClick={() => handleDelete(c.id)} className="text-red-600 bg-red-50 hover:bg-red-100 p-3 rounded-xl transition"><i className="fa-solid fa-trash"></i></button>
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
