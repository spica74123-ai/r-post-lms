import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

async function checkAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "Admin") throw new Error("Unauthorized");
}

export async function GET() {
  try {
    const announcements = await prisma.announcement.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, announcements });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await checkAdmin();
    const body = await req.json();
    const { title, content, type } = body;

    if (!title || !content) {
      return NextResponse.json({ success: false, message: "โปรดระบุหัวข้อและเนื้อหา" }, { status: 400 });
    }

    const ann = await prisma.announcement.create({
      data: { title, content, type: type || 'Info' },
    });

    return NextResponse.json({ success: true, message: "สร้างประกาศแล้ว", announcement: ann });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await checkAdmin();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) throw new Error("ไม่พบ ID ของประกาศ");

    await prisma.announcement.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "ลบประกาศสำเร็จ" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
