"use client";

import { useState, useEffect } from "react";

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    id: "",
    courseCode: "",
    name: "",
    description: "",
    instructor: "",
    coverImage: "",
    videoUrl: "",
    category: "ทั่วไป",
  });
  
  const [chapters, setChapters] = useState<{title: string, url: string}[]>([]);

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

  const openAddModal = () => {
    setFormData({ id: "", courseCode: "", name: "", description: "", instructor: "", coverImage: "", videoUrl: "", category: "ทั่วไป" });
    setChapters([]);
    setIsModalOpen(true);
  };

  const openEditModal = (course: any) => {
    setFormData({
      id: course.id,
      courseCode: course.courseCode,
      name: course.name,
      description: course.description,
      instructor: course.instructor,
      coverImage: course.coverImage,
      videoUrl: course.videoUrl || "",
      category: course.category,
    });
    setChapters(course.chapters.map((ch: any) => ({ title: ch.title, url: ch.videoUrl })));
    setIsModalOpen(true);
  };

  const handleAddChapter = () => {
    setChapters([...chapters, { title: "", url: "" }]);
  };

  const handleChapterChange = (index: number, field: string, value: string) => {
    const newChapters = [...chapters];
    (newChapters[index] as any)[field] = value;
    setChapters(newChapters);
  };

  const handleRemoveChapter = (index: number) => {
    setChapters(chapters.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/admin/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, chapters }),
      });
      const data = await res.json();
      
      if (data.success) {
        setIsModalOpen(false);
        fetchCourses();
        alert(data.message);
      } else {
        alert("เกิดข้อผิดพลาด: " + data.message);
      }
    } catch (err) {
      alert("เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto w-full animate-fade-in relative">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4 border-b border-gray-200 dark:border-army-700 pb-4">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
          <i className="fa-solid fa-book-medical text-rta-DEFAULT dark:text-rta-accent mr-2"></i> จัดการหลักสูตร R-POST
        </h3>
        <button 
          onClick={openAddModal}
          className="bg-rta-DEFAULT text-white px-6 py-3 rounded-xl text-sm font-bold shadow-lg hover:bg-rta-dark transition"
        >
          <i className="fa-solid fa-plus mr-2"></i> เพิ่มหลักสูตรใหม่
        </button>
      </div>

      <div className="bg-white dark:bg-army-800 rounded-3xl shadow-lg overflow-hidden border border-gray-100 dark:border-army-700">
        <div className="overflow-x-auto min-h-[400px]">
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
                <tr><td colSpan={5} className="text-center p-10 text-gray-500 font-bold">ไม่มีข้อมูลหลักสูตรในระบบ</td></tr>
              ) : (
                courses.map((c: any) => (
                  <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-army-700/50 transition">
                    <td className="p-5 font-black text-rta-DEFAULT dark:text-rta-accent">{c.courseCode}</td>
                    <td className="p-5"><span className="bg-gray-100 dark:bg-army-700 px-3 py-1 rounded-lg text-xs font-bold shadow-sm">{c.category}</span></td>
                    <td className="p-5 font-bold truncate max-w-[250px]">{c.name}</td>
                    <td className="p-5 text-center font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/20">{c.chapters?.length || 0} ตอน</td>
                    <td className="p-5 text-center">
                      <button onClick={() => openEditModal(c)} className="text-blue-600 bg-blue-50 hover:bg-blue-100 p-3 rounded-xl mr-2 transition"><i className="fa-solid fa-pen"></i></button>
                      <button onClick={() => handleDelete(c.id)} className="text-red-600 bg-red-50 hover:bg-red-100 p-3 rounded-xl transition"><i className="fa-solid fa-trash"></i></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal ฟอร์มสร้าง/แก้ไขหลักสูตร */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-army-800 w-full max-w-4xl rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-gray-100 dark:border-army-700 animate-slide-up">
            <div className="p-6 border-b border-gray-200 dark:border-army-700 flex justify-between items-center bg-gray-50 dark:bg-army-900/50">
              <h2 className="text-xl font-black text-gray-900 dark:text-white">
                <i className="fa-solid fa-book-open mr-2 text-rta-DEFAULT dark:text-rta-accent"></i> 
                {formData.id ? "แก้ไขหลักสูตร" : "เพิ่มหลักสูตรใหม่"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500 transition w-8 h-8 flex items-center justify-center rounded-full bg-white dark:bg-army-800 shadow-sm"><i className="fa-solid fa-times"></i></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
              <form id="courseForm" onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">รหัสวิชา</label>
                    <input type="text" value={formData.courseCode} onChange={(e) => setFormData({...formData, courseCode: e.target.value})} required placeholder="เช่น RTA-101" className="w-full border border-gray-300 dark:border-army-600 rounded-xl p-3 bg-gray-50 dark:bg-army-900 text-gray-900 dark:text-white outline-none focus:border-rta-DEFAULT transition text-sm font-bold" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">หมวดหมู่</label>
                    <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full border border-gray-300 dark:border-army-600 rounded-xl p-3 bg-gray-50 dark:bg-army-900 text-gray-900 dark:text-white outline-none focus:border-rta-DEFAULT transition text-sm font-bold">
                      <option value="ทั่วไป">ทั่วไป</option>
                      <option value="ส่งกำลังบำรุง">ส่งกำลังบำรุง</option>
                      <option value="ยุทธวิธี">ยุทธวิธี</option>
                      <option value="สื่อสาร">สื่อสารและไซเบอร์</option>
                      <option value="แผนที่">แผนที่ทหาร</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">ชื่อหลักสูตร</label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required placeholder="ชื่อวิชาแบบเต็ม" className="w-full border border-gray-300 dark:border-army-600 rounded-xl p-3 bg-gray-50 dark:bg-army-900 text-gray-900 dark:text-white outline-none focus:border-rta-DEFAULT transition text-sm font-bold" />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">รายละเอียดวิชา</label>
                  <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} required placeholder="อธิบายเกี่ยวกับเนื้อหาที่เรียน" className="w-full border border-gray-300 dark:border-army-600 rounded-xl p-3 bg-gray-50 dark:bg-army-900 text-gray-900 dark:text-white outline-none focus:border-rta-DEFAULT transition text-sm min-h-[100px]" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">ชื่อวิทยากร / อาจารย์</label>
                    <input type="text" value={formData.instructor} onChange={(e) => setFormData({...formData, instructor: e.target.value})} required placeholder="ยศ-ชื่อ-สกุล" className="w-full border border-gray-300 dark:border-army-600 rounded-xl p-3 bg-gray-50 dark:bg-army-900 text-gray-900 dark:text-white outline-none focus:border-rta-DEFAULT transition text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">รูปหน้าปก (URL)</label>
                    <input type="url" value={formData.coverImage} onChange={(e) => setFormData({...formData, coverImage: e.target.value})} required placeholder="https://..." className="w-full border border-gray-300 dark:border-army-600 rounded-xl p-3 bg-gray-50 dark:bg-army-900 text-gray-900 dark:text-white outline-none focus:border-rta-DEFAULT transition text-sm text-blue-600" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">วิดีโอหลัก (ถ้าเป็นคลิปเดียวจบ)</label>
                  <input type="url" value={formData.videoUrl} onChange={(e) => setFormData({...formData, videoUrl: e.target.value})} placeholder="ลิงก์ YouTube (Embed) กรณีไม่มีตอนย่อย" className="w-full border border-gray-300 dark:border-army-600 rounded-xl p-3 bg-gray-50 dark:bg-army-900 text-gray-900 dark:text-white outline-none focus:border-rta-DEFAULT transition text-sm text-blue-600" />
                </div>

                {/* ส่วนของตอนย่อย (Chapters) */}
                <div className="bg-gray-50 dark:bg-army-900/50 p-6 rounded-2xl border border-gray-200 dark:border-army-700">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-bold text-gray-900 dark:text-white border-l-4 border-rta-DEFAULT pl-2">ตอนย่อย (Chapters)</h4>
                    <button type="button" onClick={handleAddChapter} className="text-xs bg-white dark:bg-army-800 font-bold border border-gray-300 dark:border-army-600 px-4 py-2 rounded-lg shadow-sm hover:text-rta-DEFAULT transition">
                      <i className="fa-solid fa-plus mr-1"></i> เพิ่มตอนย่อย
                    </button>
                  </div>
                  
                  {chapters.length === 0 ? (
                    <p className="text-sm text-gray-500 font-bold text-center py-4">วิชานี้มีวิดีโอเดียวตอนจบ (ไม่มีตอนย่อย)</p>
                  ) : (
                    <div className="space-y-4">
                      {chapters.map((ch, idx) => (
                        <div key={idx} className="flex flex-col sm:flex-row gap-3 items-start bg-white dark:bg-army-800 p-4 rounded-xl border border-gray-200 dark:border-army-600 shadow-sm relative group">
                           <div className="w-8 h-8 bg-gray-100 dark:bg-army-700 rounded-lg flex items-center justify-center font-black text-gray-500 flex-shrink-0">{idx + 1}</div>
                           <div className="flex-1 w-full space-y-3">
                             <input type="text" value={ch.title} onChange={(e) => handleChapterChange(idx, 'title', e.target.value)} placeholder="ชื่อตอน (เช่น ตอนที่ 1: บทนำ)" required className="w-full border border-gray-300 dark:border-army-600 rounded-lg p-2.5 bg-gray-50 dark:bg-army-900 text-sm font-bold outline-none focus:border-rta-DEFAULT" />
                             <input type="url" value={ch.url} onChange={(e) => handleChapterChange(idx, 'url', e.target.value)} placeholder="ลิงก์วิดีโอ Embed (เช่น Youtube)" required className="w-full border border-gray-300 dark:border-army-600 rounded-lg p-2.5 bg-gray-50 dark:bg-army-900 text-sm text-blue-600 outline-none focus:border-rta-DEFAULT" />
                           </div>
                           <button type="button" onClick={() => handleRemoveChapter(idx)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition sm:mt-0 mt-2 sm:self-center self-end">
                             <i className="fa-solid fa-trash"></i>
                           </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </form>
            </div>
            
            <div className="p-6 border-t border-gray-200 dark:border-army-700 bg-gray-50 dark:bg-army-900/50 flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-6 py-3 font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-army-700 rounded-xl transition">ยกเลิก</button>
              <button form="courseForm" type="submit" disabled={isSubmitting} className="bg-rta-DEFAULT text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-rta-dark transition flex items-center">
                {isSubmitting ? <i className="fa-solid fa-spinner fa-spin mr-2"></i> : <i className="fa-solid fa-save mr-2"></i>}
                บันทึกข้อมูล
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
