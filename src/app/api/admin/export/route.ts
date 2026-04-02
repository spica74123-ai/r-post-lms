import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "Admin") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
    }

    // ดึงข้อมูล User ทั้งหมด รวมถึงผลการสอบที่ผ่านมา (เพื่อทำสรุปรวมคะแนน)
    const users = await prisma.user.findMany({
      include: {
        quizResults: true
      },
      orderBy: { unit: 'asc' }
    });

    // สร้าง Header ของ CSV (พร้อม BOM สำหรับรองรับภาษาไทยใน Excel)
    let csvContent = '\uFEFF'; 
    csvContent += "ลำดับ,เลขประจำตัวประชาชน,เลขประจำตัวทหาร,ยศ,ชื่อ,นามสกุล,ตำแหน่ง,สังกัด,หน่วย,การผ่านหลักสูตร (จำนวน)\n";

    users.forEach((u, index) => {
      const passedCount = u.quizResults.filter(r => r.isPassed).length;
      const row = [
        index + 1,
        u.nationalId,
        u.militaryId,
        u.rank,
        u.firstName,
        u.lastName,
        u.position || '-',
        u.affiliation || '-',
        u.unit,
        passedCount
      ].map(field => `"${String(field).replace(/"/g, '""')}"`).join(',');
      
      csvContent += row + "\n";
    });

    const headers = new Headers();
    headers.set("Content-Type", "text/csv; charset=utf-8");
    headers.set("Content-Disposition", `attachment; filename="RPOST_Users_Report_${new Date().toISOString().split('T')[0]}.csv"`);

    return new NextResponse(csvContent, { headers });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
