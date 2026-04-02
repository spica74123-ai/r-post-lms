"use client";

import { useState, useEffect } from "react";

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState("Info");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/announcements");
      const data = await res.json();
      if (data.success) {
        setAnnouncements(data.announcements);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, type }),
      });
      const data = await res.json();
      
      if (data.success) {
        setTitle("");
        setContent("");
        setType("Info");
        fetchAnnouncements();
        alert("บันทึกประกาศสำเร็จ");
      } else {
        alert(data.message);
      }
    } catch (e) {
      alert("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("ยืนยันการลบประกาศฉบับนี้?")) return;
    try {
      const res = await fetch(`/api/admin/announcements?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        fetchAnnouncements();
      } else {
        alert(data.message);
      }
    } catch (e) {
      alert("เกิดข้อผิดพลาด");
    }
  };

  return (
    <div className="max-w-6xl mx-auto w-full animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4 border-b border-gray-200 dark:border-army-700 pb-4">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
          <i className="fa-solid fa-bullhorn text-rta-DEFAULT dark:text-rta-accent mr-2"></i> จัดการประกาศข่าวสาร (Announcements)
        </h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ฟอร์มสร้างประกาศใหม่ */}
        <div className="bg-white dark:bg-army-800 rounded-3xl shadow-lg border border-gray-100 dark:border-army-700 p-6 lg:col-span-1 h-max top-4 sticky">
          <h4 className="font-bold text-lg mb-4 text-gray-900 dark:text-white border-l-4 border-rta-DEFAULT pl-3">สร้างประกาศใหม่</h4>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">หัวข้อประกาศ <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-gray-300 dark:border-army-600 rounded-xl p-3 bg-gray-50 dark:bg-army-900 text-gray-900 dark:text-white outline-none focus:border-rta-DEFAULT transition text-sm"
                required
                placeholder="เช่น กำหนดการสอบประจำเดือน..."
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">ประเภทประกาศ</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className={`w-full border rounded-xl p-3 outline-none transition text-sm font-bold focus:border-rta-DEFAULT ${type === 'Alert' ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400' : 'bg-gray-50 text-gray-900 border-gray-300 dark:bg-army-900 dark:border-army-600 dark:text-white'}`}
              >
                <option value="Info" className="text-gray-900 font-medium">แจ้งให้ทราบ (ทั่วไป)</option>
                <option value="Alert" className="text-red-600 font-medium">ด่วนมาก (สำคัญ)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">รายละเอียด / เนื้อหา <span className="text-red-500">*</span></label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full border border-gray-300 dark:border-army-600 rounded-xl p-3 bg-gray-50 dark:bg-army-900 text-gray-900 dark:text-white outline-none focus:border-rta-DEFAULT transition text-sm min-h-[150px]"
                required
                placeholder="รายละเอียดข่าวสารสามารถเว้นบรรทัดได้..."
              />
            </div>

            <button type="submit" disabled={isSubmitting} className="w-full bg-rta-DEFAULT text-white font-bold py-3 mt-4 rounded-xl shadow-lg hover:bg-rta-dark transition flex justify-center items-center">
              {isSubmitting ? <i className="fa-solid fa-spinner fa-spin mr-2"></i> : <i className="fa-solid fa-paper-plane mr-2"></i>} 
              เผยแพร่ประกาศ
            </button>
          </form>
        </div>

        {/* รายการประกาศทั้งหมด */}
        <div className="bg-white dark:bg-army-800 rounded-3xl shadow-lg border border-gray-100 dark:border-army-700 p-6 lg:col-span-2">
          <h4 className="font-bold text-lg mb-4 text-gray-900 dark:text-white border-l-4 border-rta-DEFAULT pl-3">
            รายการประกาศ 
          </h4>

          {loading ? (
             <div className="py-20 flex justify-center text-rta-DEFAULT">
               <i className="fa-solid fa-spinner fa-spin text-4xl"></i>
             </div>
          ) : announcements.length === 0 ? (
             <div className="py-20 text-center text-gray-400 flex flex-col items-center">
               <i className="fa-regular fa-folder-open text-5xl mb-4 text-gray-300 dark:text-gray-600"></i>
               <p className="font-bold">ยังไม่มีข้อมูลประกาศ</p>
             </div>
          ) : (
            <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2 custom-scrollbar">
               {announcements.map((ann) => (
                 <div key={ann.id} className="p-5 border border-gray-200 dark:border-army-700 rounded-2xl relative group bg-gray-50 dark:bg-army-900/30 hover:shadow-md transition">
                    <button onClick={() => handleDelete(ann.id)} className="absolute top-5 right-5 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition z-10 w-8 h-8 flex items-center justify-center bg-white dark:bg-army-800 rounded-full shadow-sm">
                      <i className="fa-solid fa-trash"></i>
                    </button>
                    
                    <div className="flex items-center gap-3 mb-2 pr-10">
                      <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-md tracking-wider ${ann.type === 'Alert' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'}`}>
                        {ann.type === 'Alert' ? 'ด่วน' : 'แจ้งทราบ'}
                      </span>
                      <h5 className="font-black text-gray-900 dark:text-white leading-tight truncate">{ann.title}</h5>
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3 bg-white dark:bg-army-800 p-3 rounded-lg border border-gray-100 dark:border-army-700">
                      {ann.content}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs font-bold text-gray-500">
                       <span><i className="fa-regular fa-clock mr-1"></i> {new Date(ann.createdAt).toLocaleString("th-TH")}</span>
                    </div>
                 </div>
               ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
