import prisma from "@/lib/prisma";
import Link from "next/link";

// Server Component ดึงข้อมูลจากฐานข้อมูลตรงๆ
export default async function KnowledgeBasePage() {
  // ดึงเอกสารทั้งหมดเรียงตามวันที่ล่าสุด
  const documents = await prisma.knowledgeBase.findMany({
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="max-w-6xl mx-auto w-full animate-fade-in pb-20">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-8 border-b border-gray-200 dark:border-army-700 pb-5">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white mt-2 flex items-center">
            <i className="fa-solid fa-book-bookmark text-rta-DEFAULT dark:text-rta-accent mr-3"></i>
            คลังความรู้ <span className="text-rta-DEFAULT dark:text-rta-accent ml-2">(Knowledge Base)</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium text-sm mt-2 ml-10">
            แหล่งรวมเอกสาร คู่มือ และคู่มือปฏิบัติการทางการทหารสำหรับการทบทวนด้วยตนเอง
          </p>
        </div>
      </div>

      {documents.length === 0 ? (
        <div className="bg-white dark:bg-army-800 rounded-3xl p-16 text-center border border-gray-100 dark:border-army-700 shadow-sm mt-6 transition-all duration-300">
          <div className="w-28 h-28 bg-gray-50 dark:bg-army-700/50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <i className="fa-solid fa-folder-open text-5xl text-gray-300 dark:text-gray-500"></i>
          </div>
          <h3 className="text-2xl font-black text-gray-800 dark:text-white mb-3">ยังไม่มีเอกสารในคลังความรู้</h3>
          <p className="text-gray-500 dark:text-gray-400 font-medium">รอการจัดเตรียมและอัปโหลดเอกสารประกอบการเรียนการสอนจากผู้ดูแลระบบเร็วๆ นี้</p>
          <button className="mt-8 px-6 py-2.5 bg-gray-100 dark:bg-army-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-army-600 rounded-xl font-bold transition duration-200">
            <i className="fa-solid fa-rotate-right mr-2"></i> โหลดข้อมูลใหม่
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((doc) => (
             <div key={doc.id} className="bg-white dark:bg-army-800 rounded-2xl p-6 border border-gray-100 dark:border-army-700 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between mb-5">
                    <div className="w-14 h-14 rounded-2xl bg-rta-DEFAULT/10 dark:bg-rta-accent/10 flex items-center justify-center text-rta-DEFAULT dark:text-rta-accent text-2xl shadow-sm">
                      <i className="fa-solid fa-file-pdf"></i>
                    </div>
                    <span className="text-xs font-bold px-3 py-1.5 bg-gray-100 dark:bg-army-700 rounded-lg text-gray-600 dark:text-gray-300">
                      <i className="fa-solid fa-tag mr-1 text-gray-400"></i> {doc.category}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 group-hover:text-rta-DEFAULT dark:group-hover:text-rta-accent transition duration-200 line-clamp-2">
                    {doc.title}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-6 font-medium flex items-center">
                    <i className="fa-regular fa-calendar mr-1"></i> เพิ่มเมื่อ: {new Date(doc.createdAt).toLocaleDateString("th-TH")}
                  </p>
                </div>
                
                <a 
                  href={doc.fileUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block w-full text-center bg-gray-50 dark:bg-army-700/50 hover:bg-rta-DEFAULT hover:text-white dark:hover:bg-rta-accent dark:hover:text-army-900 text-gray-700 dark:text-gray-300 font-bold py-3 mt-4 rounded-xl transition-all duration-200 border border-gray-200 dark:border-army-600 hover:border-transparent cursor-pointer"
                >
                  <i className="fa-solid fa-download mr-1.5"></i> ดาวน์โหลด PDF
                </a>
             </div>
          ))}
        </div>
      )}
    </div>
  );
}
