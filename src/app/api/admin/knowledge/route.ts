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
    const knowledgeBase = await prisma.knowledgeBase.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, knowledgeBase });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await checkAdmin();
    const body = await req.json();
    const { title, category, fileUrl } = body;

    if (!title || !category || !fileUrl) {
      return NextResponse.json({ success: false, message: "โปรดกรอกข้อมูลให้ครบถ้วน" }, { status: 400 });
    }

    const kb = await prisma.knowledgeBase.create({
      data: { title, category, fileUrl },
    });

    return NextResponse.json({ success: true, message: "อัปโหลดเอกสารสำเร็จ", knowledgeBase: kb });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await checkAdmin();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) throw new Error("ไม่พบ ID ของเอกสาร");

    await prisma.knowledgeBase.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "ลบเอกสารสำเร็จ" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
