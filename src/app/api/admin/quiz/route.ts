import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

async function checkAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "Admin") throw new Error("Unauthorized");
}

// ดึงข้อสอบตาม Course ID
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("courseId");

    if (!courseId) return NextResponse.json({ success: false, message: "โปรดระบุรหัสวิชา" }, { status: 400 });

    const questions = await prisma.quizQuestion.findMany({
      where: { courseId },
      orderBy: { id: "asc" },
    });
    return NextResponse.json({ success: true, questions });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// เพิ่มข้อสอบใหม่
export async function POST(req: Request) {
  try {
    await checkAdmin();
    const body = await req.json();
    const { courseId, question, optA, optB, optC, optD, correctAnswer } = body;

    await prisma.quizQuestion.create({
      data: { courseId, question, optA, optB, optC, optD, correctAnswer },
    });

    return NextResponse.json({ success: true, message: "เพิ่มข้อสอบสำเร็จ!" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// ลบข้อสอบ
export async function DELETE(req: Request) {
  try {
    await checkAdmin();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) throw new Error("ไม่พบ ID ข้อสอบ");

    await prisma.quizQuestion.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "ลบข้อสอบสำเร็จ" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
