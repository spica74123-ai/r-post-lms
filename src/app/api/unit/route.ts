import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    // ต้องล็อกอินและมีสิทธิ์ Commander
    if (!session || (session.user?.role !== "Commander" && session.user?.role !== "Admin")) {
      return NextResponse.json({ success: false, message: "Unauthorized: Requires Commander privileges" }, { status: 403 });
    }

    // ดึงรหัส User ปัจจุบันเพื่อไปหาสังกัด (Unit)
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id }
    });

    if (!currentUser) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    // ดึงลูกน้องทั้งหมดใน "สังกัดเดียวกัน"
    const unitPersonnel = await prisma.user.findMany({
      where: {
        unit: currentUser.unit,
        // ไม่ต้องเอา Admin หรือ Commander มาปน ถ้าไม่อยากให้เห็น
        // แต่เพื่อให้แอดมินทดสอบได้ จะดึงมาหมดในหน่วย ยกเว้นตัวเอง
        NOT: { id: currentUser.id }
      },
      include: {
        quizResults: {
          include: {
            course: { select: { name: true } }
          }
        }
      },
      orderBy: { firstName: 'asc' }
    });

    return NextResponse.json({ 
      success: true, 
      unit: currentUser.unit,
      personnel: unitPersonnel 
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
