import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// ตรวจสอบสิทธิ์ว่าเป็น Admin หรือไม่
async function checkAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "Admin") {
    throw new Error("Unauthorized");
  }
}

// 1. ดึงข้อมูลหลักสูตรทั้งหมดมาแสดงในตาราง
export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      include: { chapters: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, courses });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// 2. เพิ่มวิชาใหม่ หรือ แก้ไขวิชาเดิม (พร้อม Chapters)
export async function POST(req: Request) {
  try {
    await checkAdmin();
    const body = await req.json();
    const { id, courseCode, name, description, instructor, coverImage, videoUrl, category, chapters } = body;

    let course;

    if (id) {
      // กรณีแก้ไข (Update)
      course = await prisma.course.update({
        where: { id },
        data: { courseCode, name, description, instructor, coverImage, videoUrl, category },
      });
      // ลบบทเรียนเก่าออก แล้วสร้างใหม่ทั้งหมดเพื่อความชัวร์
      await prisma.chapter.deleteMany({ where: { courseId: id } });
    } else {
      // กรณีสร้างใหม่ (Create)
      course = await prisma.course.create({
        data: { courseCode, name, description, instructor, coverImage, videoUrl, category },
      });
    }

    // สร้างบทเรียนย่อย (Chapters)
    if (chapters && chapters.length > 0) {
      const chapterData = chapters.map((ch: any, index: number) => ({
        courseId: course.id,
        title: ch.title,
        videoUrl: ch.url,
        orderIndex: index,
      }));
      await prisma.chapter.createMany({ data: chapterData });
    }

    return NextResponse.json({ success: true, message: "บันทึกหลักสูตรสำเร็จ!" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// 3. ลบหลักสูตร
export async function DELETE(req: Request) {
  try {
    await checkAdmin();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) throw new Error("ไม่พบ ID หลักสูตร");

    await prisma.course.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "ลบหลักสูตรสำเร็จ" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
