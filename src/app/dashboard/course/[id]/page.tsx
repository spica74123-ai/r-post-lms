import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import CoursePlayer from "@/components/CoursePlayer";

export default async function CoursePage({ params }: { params: { id: string } }) {
  const { id } = params;

  // ดึงข้อมูลหลักสูตร บทเรียน และข้อสอบ จาก Database
  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      chapters: {
        orderBy: { orderIndex: 'asc' } // เรียงลำดับตอน EP.1, EP.2
      },
      questions: true,
    }
  });

  if (!course) {
    notFound();
  }

  return (
    <div className="max-w-6xl mx-auto w-full animate-fade-in">
      {/* โยนข้อมูลที่ดึงมาได้ไปให้ Client Component จัดการต่อ */}
      <CoursePlayer course={course} />
    </div>
  );
}
