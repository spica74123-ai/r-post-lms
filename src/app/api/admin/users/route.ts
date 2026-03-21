import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

async function checkAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "Admin") throw new Error("Unauthorized");
}

// 1. ดึงรายชื่อผู้ใช้งานทั้งหมด
export async function GET() {
  try {
    await checkAdmin();
    const users = await prisma.user.findMany({
      select: {
        id: true,
        rank: true,
        firstName: true,
        lastName: true,
        unit: true,
        email: true,
        role: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, users });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// 2. อัปเดตสิทธิ์การใช้งาน (Role)
export async function PATCH(req: Request) {
  try {
    await checkAdmin();
    const { userId, newRole } = await req.json();

    if (!userId || !newRole) {
      return NextResponse.json({ success: false, message: "ข้อมูลไม่ครบถ้วน" }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
    });

    return NextResponse.json({ success: true, message: "อัปเดตสิทธิ์สำเร็จ" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
