import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function DashboardPage() {
  // ดึงข้อมูลจาก PostgreSQL ผ่าน Prisma ทันทีตอน Render (SSR)
  const courses = await prisma.course.findMany({
    include: { chapters: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="max-w-6xl mx-auto w-full animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between md:items-end mb-8 gap-4 border-b border-gray-200 dark:border-army-700 pb-4">
        <div>
          <h3 className="text-3xl font-black text-gray-900 dark:text-white">แคตตาล็อกหลักสูตร</h3>
          <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">เลือกเรียนตามหมวดหมู่เพื่อพัฒนาศักยภาพของคุณ</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.length === 0 ? (
          <div className="col-span-full p-10 bg-white dark:bg-army-800 rounded-3xl text-center border border-gray-100 dark:border-army-700">
            <i className="fa-solid fa-box-open text-6xl mb-4 text-gray-300 dark:text-army-600"></i>
            <p className="font-bold text-gray-500 dark:text-gray-400">ยังไม่มีหลักสูตรในระบบ</p>
          </div>
        ) : (
          courses.map((course) => (
            <Link key={course.id} href={`/dashboard/course/${course.id}`} className="bg-white/80 dark:bg-army-800/80 backdrop-blur-lg rounded-[2rem] shadow-lg border border-white/50 dark:border-army-700 hover:-translate-y-4 hover:scale-[1.02] hover:shadow-[0_20px_40px_rgba(212,175,55,0.15)] dark:hover:shadow-[0_20px_40px_rgba(212,175,55,0.05)] transition-all duration-500 flex flex-col overflow-hidden group">
              <div className="h-52 overflow-hidden relative">
                <span className="absolute top-4 left-4 bg-red-600/90 backdrop-blur-md text-white text-xs font-black px-3 py-1.5 rounded-lg shadow-lg z-10 border border-red-400/30 tracking-widest">
                  <i className="fa-solid fa-list-ol mr-1"></i> {course.chapters.length} ตอน
                </span>
                <img src={course.coverImage} alt={course.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-rta-dark/80 to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex items-end p-5">
                  <span className="text-white font-bold bg-rta-DEFAULT/90 px-4 py-2 rounded-xl backdrop-blur-sm border border-white/20 shadow-lg">
                    <i className="fa-solid fa-play text-rta-accent mr-2"></i> เข้าห้องเรียน
                  </span>
                </div>
              </div>
              <div className="p-6 md:p-8 flex-1 flex flex-col relative bg-gradient-to-b from-transparent to-white/50 dark:to-army-900/50">
                <div className="absolute -top-6 right-6 bg-white dark:bg-army-800 p-2 rounded-2xl shadow-xl border border-gray-100 dark:border-army-700 group-hover:-translate-y-2 transition-transform duration-500">
                  <span className="text-[10px] font-black text-rta-DEFAULT dark:text-rta-accent bg-[#f1f4e6] dark:bg-army-700/50 px-3 py-1.5 rounded-xl border border-rta-DEFAULT/20 dark:border-army-600">R-POST</span>
                </div>
                <p className="text-xs font-bold text-gray-400 dark:text-gray-500 mb-2 uppercase tracking-widest">{course.category}</p>
                <h3 className="text-xl font-black text-gray-900 dark:text-white leading-tight mb-3 group-hover:text-rta-DEFAULT dark:group-hover:text-rta-accent transition">{course.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mt-auto font-medium">{course.description}</p>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
