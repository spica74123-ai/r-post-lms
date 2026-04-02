import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export default async function AnnouncementsPage() {
  const announcements = await prisma.announcement.findMany({
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="max-w-6xl mx-auto w-full animate-fade-in pb-20">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-8 border-b border-gray-200 dark:border-army-700 pb-5">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white mt-2 flex items-center">
            <i className="fa-solid fa-bullhorn text-rta-DEFAULT dark:text-rta-accent mr-3"></i>
            ข่าวสารประกาศ <span className="text-rta-DEFAULT dark:text-rta-accent ml-2">(Announcements)</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium text-sm mt-2 ml-10">
            อัปเดตข่าวสาร การแจ้งเตือน และข้อมูลด่วนจากส่วนกลางกองทัพบก
          </p>
        </div>
      </div>

      {announcements.length === 0 ? (
        <div className="bg-white dark:bg-army-800 rounded-3xl p-16 text-center border border-gray-100 dark:border-army-700 shadow-sm mt-6">
          <div className="w-28 h-28 bg-gray-50 dark:bg-army-700/50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <i className="fa-solid fa-bell-slash text-5xl text-gray-300 dark:text-gray-500"></i>
          </div>
          <h3 className="text-2xl font-black text-gray-800 dark:text-white mb-3">ยังไม่มีข่าวสารประกาศในขณะนี้</h3>
        </div>
      ) : (
        <div className="space-y-6">
          {announcements.map((ann) => (
            <div key={ann.id} className={`bg-white dark:bg-army-800 rounded-3xl p-6 md:p-8 border-l-8 shadow-sm flex flex-col md:flex-row gap-6 relative overflow-hidden ${ann.type === 'Alert' ? 'border-red-500 shadow-red-100 dark:shadow-red-900/20' : 'border-rta-DEFAULT dark:border-rta-accent shadow-gray-100 dark:shadow-gray-900/20'}`}>
              
              <div className="md:w-32 flex-shrink-0 flex flex-col items-center justify-center text-center px-4 md:border-r border-gray-100 dark:border-army-700">
                <i className={`fa-solid ${ann.type === 'Alert' ? 'fa-triangle-exclamation text-red-500' : 'fa-bell text-rta-DEFAULT dark:text-rta-accent'} text-3xl mb-3`}></i>
                <div className={`text-xs font-black px-3 py-1 rounded-lg ${ann.type === 'Alert' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-[#f1f4e6] text-rta-DEFAULT dark:bg-rta-accent/20 dark:text-rta-accent'}`}>
                  {ann.type === 'Alert' ? 'ด่วนมาก' : 'แจ้งให้ทราบ'}
                </div>
              </div>

              <div className="flex-1 shrink min-w-0 pr-4">
                <h3 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white mb-3 break-words leading-tight">{ann.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap font-medium text-sm md:text-base leading-relaxed bg-gray-50 dark:bg-army-900/50 p-4 rounded-xl border border-gray-100 dark:border-army-700">
                  {ann.content}
                </p>
                <div className="mt-5 flex items-center text-xs font-bold text-gray-400 dark:text-gray-500">
                  <i className="fa-regular fa-clock mr-1.5 border border-gray-300 dark:border-gray-600 rounded-full p-1"></i>
                  ประกาศเมื่อ: {new Date(ann.createdAt).toLocaleString("th-TH")}
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
