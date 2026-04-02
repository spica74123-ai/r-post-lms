"use client";

import { useState, useEffect } from "react";

export default function AdminKnowledgeBasePage() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("คู่มือการใช้งาน");
  const [fileUrl, setFileUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/knowledge");
      const data = await res.json();
      if (data.success) {
        setDocuments(data.knowledgeBase);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/knowledge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, category, fileUrl }),
      });
      const data = await res.json();
      
      if (data.success) {
        setTitle("");
        setCategory("คู่มือการใช้งาน");
        setFileUrl("");
        fetchDocuments();
        alert("เพิ่มเอกสารเข้าคลังความรู้สำเร็จ");
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
    if (!confirm("ยืนยันการลบเอกสารนี้ออกจากคลังความรู้?")) return;
    try {
      const res = await fetch(`/api/admin/knowledge?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        fetchDocuments();
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
          <i className="fa-solid fa-folder-open text-rta-DEFAULT dark:text-rta-accent mr-2"></i> จัดการคลังความรู้ (Knowledge Base)
        </h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ฟอร์มเพิ่มเอกสารใหม่ */}
        <div className="bg-white dark:bg-army-800 rounded-3xl shadow-lg border border-gray-100 dark:border-army-700 p-6 lg:col-span-1 h-max top-4 sticky">
          <h4 className="font-bold text-lg mb-4 text-gray-900 dark:text-white border-l-4 border-rta-DEFAULT pl-3">อัปโหลดเอกสารใหม่</h4>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">ชื่อเอกสาร <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-gray-300 dark:border-army-600 rounded-xl p-3 bg-gray-50 dark:bg-army-900 text-gray-900 dark:text-white outline-none focus:border-rta-DEFAULT transition text-sm"
                required
                placeholder="เช่น ระเบียบกองทัพบกว่าด้วย..."
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">หมวดหมู่ <span className="text-red-500">*</span></label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border border-gray-300 dark:border-army-600 rounded-xl p-3 bg-gray-50 dark:bg-army-900 text-gray-900 dark:text-white outline-none focus:border-rta-DEFAULT transition text-sm font-bold"
              >
                <option value="คู่มือการใช้งาน">คู่มือการใช้งาน</option>
                <option value="ระเบียบ/คำสั่ง">ระเบียบ / คำสั่ง</option>
                <option value="สรุปบทเรียน">สรุปบทเรียน (Lesson Learned)</option>
                <option value="อื่นๆ">อื่นๆ</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">ลิงก์เอกสาร (URL) <span className="text-red-500">*</span></label>
              <input
                type="url"
                value={fileUrl}
                onChange={(e) => setFileUrl(e.target.value)}
                className="w-full border border-gray-300 dark:border-army-600 rounded-xl p-3 bg-gray-50 dark:bg-army-900 text-gray-900 dark:text-white outline-none focus:border-rta-DEFAULT transition text-sm text-blue-600 font-medium"
                required
                placeholder="https://drive.google.com/file/d/..."
              />
              <p className="text-[10px] text-gray-500 mt-2 font-medium bg-gray-100 dark:bg-army-700 px-3 py-2 rounded-lg"><i className="fa-solid fa-circle-info text-blue-500 mr-1"></i> รองรับลิงก์จาก Google Drive, OneDrive หรือเว็บไซต์ฝากไฟล์ต่างๆ</p>
            </div>

            <button type="submit" disabled={isSubmitting} className="w-full bg-rta-DEFAULT text-white font-bold py-3 mt-4 rounded-xl shadow-lg hover:bg-rta-dark transition flex justify-center items-center">
              {isSubmitting ? <i className="fa-solid fa-spinner fa-spin mr-2"></i> : <i className="fa-solid fa-cloud-arrow-up mr-2"></i>} 
              บันทึกเข้าคลัง
            </button>
          </form>
        </div>

        {/* รายการเอกสารทั้งหมด */}
        <div className="bg-white dark:bg-army-800 rounded-3xl shadow-lg border border-gray-100 dark:border-army-700 p-6 lg:col-span-2">
          <h4 className="font-bold text-lg mb-4 text-gray-900 dark:text-white border-l-4 border-rta-DEFAULT pl-3">
            รายการเอกสารในระบบ <span className="text-sm font-normal text-gray-500">({documents.length} รายการ)</span>
          </h4>

          {loading ? (
             <div className="py-20 flex justify-center text-rta-DEFAULT">
               <i className="fa-solid fa-spinner fa-spin text-4xl"></i>
             </div>
          ) : documents.length === 0 ? (
             <div className="py-20 text-center text-gray-400 flex flex-col items-center">
               <i className="fa-solid fa-folder-open text-5xl mb-4 text-gray-300 dark:text-gray-600"></i>
               <p className="font-bold">ยังไม่มีเอกสารในคลังความรู้</p>
             </div>
          ) : (
            <div className="overflow-x-auto relative">
               <table className="w-full text-left text-sm whitespace-nowrap">
                 <thead className="bg-gray-50 dark:bg-army-700/50 border-b border-gray-200 dark:border-army-600 text-gray-700 dark:text-gray-200 uppercase text-xs">
                   <tr>
                     <th className="p-4 font-bold">ชื่อเอกสาร</th>
                     <th className="p-4 font-bold">หมวดหมู่</th>
                     <th className="p-4 font-bold">วันที่อัปโหลด</th>
                     <th className="p-4 text-center font-bold">จัดการ</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-100 dark:divide-army-700 font-medium">
                   {documents.map((doc) => (
                     <tr key={doc.id} className="hover:bg-gray-50 dark:hover:bg-army-700/50 transition truncate">
                       <td className="p-4 font-bold text-gray-900 dark:text-white max-w-[200px] truncate">
                         <i className="fa-solid fa-file-pdf text-red-500 mr-2"></i> {doc.title}
                       </td>
                       <td className="p-4 text-gray-600 dark:text-gray-400">
                         <span className="bg-gray-100 dark:bg-army-700 px-2.5 py-1 rounded-md text-xs font-bold">{doc.category}</span>
                       </td>
                       <td className="p-4 text-gray-500 text-xs">
                         {new Date(doc.createdAt).toLocaleDateString("th-TH")}
                       </td>
                       <td className="p-4 text-center">
                         <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg transition mr-2">
                           <i className="fa-solid fa-eye"></i> ดูลำดับ
                         </a>
                         <button onClick={() => handleDelete(doc.id)} className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-lg transition">
                           <i className="fa-solid fa-trash"></i> ลบ
                         </button>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
