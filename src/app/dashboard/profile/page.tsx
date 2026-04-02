import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    redirect("/login");
  }

  // ดึงข้อมูล User พร้อม QuizResults (ใบประกาศ)
  const user = await prisma.user.findUnique({
    where: { id: (session.user as any).id },
    include: {
      quizResults: {
        include: { course: true },
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!user) return <div>ไม่พบผู้ใช้งาน</div>;

  return (
    <div className="max-w-6xl mx-auto w-full animate-fade-in pb-20">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-8 border-b border-gray-200 dark:border-army-700 pb-5">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white mt-2 flex items-center">
            <i className="fa-solid fa-id-badge text-rta-DEFAULT dark:text-rta-accent mr-3"></i>
            โปรไฟล์และใบประกาศ 
          </h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium text-sm mt-2 ml-10">
            แฟ้มประวัติกำลังพล และหลักฐานการผ่านหลักสูตรอิเล็กทรอนิกส์
          </p>
        </div>
        <button className="mt-4 sm:mt-0 px-5 py-2.5 bg-gray-100 dark:bg-army-700 text-gray-800 dark:text-gray-200 rounded-xl font-bold hover:bg-gray-200 transition shadow-sm border border-gray-200 dark:border-army-600 text-sm">
          <i className="fa-solid fa-pen-to-square mr-2"></i> แก้ไขข้อมูล (เร็วๆนี้)
        </button>
      </div>

      {/* บัตรข้าราชการ / โปรไฟล์ */}
      <div className="bg-white dark:bg-army-800 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-army-700 mb-10 flex flex-col md:flex-row relative">
         <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-rta-DEFAULT/10 dark:from-rta-accent/5 to-transparent pointer-events-none"></div>
         
         <div className="bg-[#4b5320] text-white p-8 md:w-1/3 flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgPgo8cGF0aCBkPSJNMzAuNSAyOS41SDYxVjMwLjVINzBMMiAuNSAwbS41IDAgSDYwVjAgbVoiIGZpbGw9IiNmZmZmZmYiLz4KPC9zdmc+')] pointer-events-none"></div>
            <div className="w-32 h-32 bg-white rounded-full p-1 shadow-2xl mb-5 border-4 border-[#d4af37]/30 relative z-10">
               <img src="/logo.png" alt="Profile avatar" className="w-full h-full rounded-full object-contain bg-gray-50" />
            </div>
            <h2 className="text-xl font-black text-center relative z-10 mb-1">{user.rank}{user.firstName} {user.lastName}</h2>
            <p className="text-[#d4af37] font-bold text-sm bg-black/20 px-4 py-1 rounded-full relative z-10 backdrop-blur-sm border border-white/10 uppercase tracking-widest">{user.role}</p>
         </div>

         <div className="p-8 md:w-2/3 flex flex-col justify-center relative z-10 bg-white/50 dark:bg-army-800/50 backdrop-blur">
            <h3 className="text-lg font-black text-gray-800 dark:text-white mb-6 flex items-center pb-2 border-b border-gray-100 dark:border-army-700 w-max pr-8">
              <i className="fa-solid fa-address-card mr-2 text-rta-DEFAULT dark:text-rta-accent"></i> ข้อมูลเครื่องหมายการแสดงสังกัด
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
              <div>
                <p className="text-xs text-gray-500 font-bold mb-1"><i className="fa-regular fa-building mr-1"></i> สังกัดหน่วย (Unit)</p>
                <p className="font-black text-gray-900 dark:text-white text-base bg-gray-50 dark:bg-army-900/50 py-2 px-3 rounded-lg border border-gray-100 dark:border-army-700">{user.unit}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-bold mb-1"><i className="fa-solid fa-sitemap mr-1"></i> เหล่า/สายวิทยาการ</p>
                <p className="font-black text-gray-900 dark:text-white text-base bg-gray-50 dark:bg-army-900/50 py-2 px-3 rounded-lg border border-gray-100 dark:border-army-700">{user.affiliation || "-"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-bold mb-1"><i className="fa-regular fa-id-card mr-1"></i> เลขประจำตัวประชาชน</p>
                <p className="font-black text-gray-900 dark:text-white text-base bg-gray-50 dark:bg-army-900/50 py-2 px-3 rounded-lg border border-gray-100 dark:border-army-700">{user.nationalId}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-bold mb-1"><i className="fa-solid fa-hashtag mr-1"></i> เลชประจำตัวทหาร</p>
                <p className="font-black text-gray-900 dark:text-white text-base bg-gray-50 dark:bg-army-900/50 py-2 px-3 rounded-lg border border-gray-100 dark:border-army-700">{user.militaryId}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-bold mb-1"><i className="fa-solid fa-envelope mr-1"></i> อีเมลติดต่อ</p>
                <p className="font-black text-gray-900 dark:text-white text-base bg-gray-50 dark:bg-army-900/50 py-2 px-3 rounded-lg border border-gray-100 dark:border-army-700 truncate">{user.email}</p>
              </div>
            </div>
         </div>
      </div>

      {/* ใบประกาศนียบัตร */}
      <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6 border-l-4 border-rta-DEFAULT dark:border-rta-accent pl-3">
        แฟ้มประวัติผลการศึกษา (Certificates)
      </h2>

      {user.quizResults.length === 0 ? (
        <div className="bg-gray-50 dark:bg-army-800 rounded-3xl p-10 text-center border border-dashed border-gray-300 dark:border-army-600">
           <i className="fa-solid fa-folder-open text-4xl text-gray-300 dark:text-gray-600 mb-3"></i>
           <p className="text-gray-500 dark:text-gray-400 font-bold">ยังไม่พบประวัติการผ่านหลักสูตร ทบทวนเนื้อหาและทำข้อสอบเพื่อรับใบประกาศ</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {user.quizResults.map((result) => (
             <div key={result.id} className="bg-white dark:bg-army-800 rounded-2xl p-6 border border-gray-100 dark:border-army-700 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-black px-4 py-1 rounded-bl-xl shadow-sm z-10 tracking-widest">
                  PASSED
                </div>
                
                <h3 className="font-black text-lg text-gray-900 dark:text-white mb-1 pr-16">{result.course.name}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 font-bold flex items-center">
                  <i className="fa-solid fa-award mr-1 text-rta-accent"></i> ออกเมื่อ: {new Date(result.createdAt).toLocaleDateString('th-TH')}
                </p>
                
                <div className="bg-gray-50 dark:bg-army-900/50 rounded-xl p-4 mb-4 border border-gray-100 dark:border-army-600 flex justify-between items-center group-hover:border-rta-DEFAULT/30 transition">
                   <div>
                     <p className="text-xs text-gray-500 font-bold mb-1">ผลคะแนนสอบประเมินค่า</p>
                     <p className="font-black text-xl text-rta-DEFAULT dark:text-rta-accent">{result.score} <span className="text-sm text-gray-400">/ {result.total}</span></p>
                   </div>
                   <div className="text-right">
                     <p className="text-xs text-gray-500 font-bold mb-1">สถานะ</p>
                     <p className="font-black text-sm text-green-600 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded-md">ผ่านเกณฑ์</p>
                   </div>
                </div>

                <a 
                  href={`/dashboard/certificate/${result.id}`} 
                  target="_blank"
                  className="w-full flex items-center justify-center py-3 bg-[#f1f4e6] dark:bg-army-700 hover:bg-rta-DEFAULT hover:text-white text-rta-DEFAULT dark:text-rta-accent dark:hover:bg-rta-accent dark:hover:text-army-900 rounded-xl font-bold transition-all border border-rta-DEFAULT/20 dark:border-army-600 duration-300"
                >
                  <i className="fa-solid fa-print mr-2"></i> พิมพ์ใบประกาศเชิดชูเกียรติ
                </a>
             </div>
          ))}
        </div>
      )}
    </div>
  );
}
