import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "Admin") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
    }

    // ดึงผลสอบ พร้อมดึงข้อมูลคนสอบและวิชามาด้วย (Relation)
    const results = await prisma.quizResult.findMany({
      include: {
        user: {
          select: { rank: true, firstName: true, lastName: true, unit: true }
        },
        course: {
          select: { name: true }
        }
      },
      orderBy: { createdAt: "desc" },
    });

    // จัดรูปแบบข้อมูลให้พร้อมใช้หน้าเว็บ
    const formattedData = results.map(r => ({
      id: r.id,
      date: new Date(r.createdAt).toLocaleDateString("th-TH"),
      userName: `${r.user.rank}${r.user.firstName} ${r.user.lastName}`,
      unit: r.user.unit,
      courseName: r.course.name,
      score: `${r.score}/${r.total}`,
      status: r.isPassed ? "ผ่าน" : "ไม่ผ่าน"
    }));

    return NextResponse.json({ success: true, data: formattedData });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
