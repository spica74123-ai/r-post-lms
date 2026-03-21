import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { userId, courseId, answers } = await req.json();

    if (!userId || !courseId || !answers) {
      return NextResponse.json({ success: false, message: "ข้อมูลไม่ครบถ้วน" }, { status: 400 });
    }

    // ดึงเฉลยทั้งหมดของวิชานี้มาจากฐานข้อมูล
    const questions = await prisma.quizQuestion.findMany({
      where: { courseId }
    });

    if (questions.length === 0) {
      return NextResponse.json({ success: false, message: "ไม่พบข้อสอบในระบบ" }, { status: 404 });
    }

    // ตรวจคะแนน
    let score = 0;
    const totalQuestions = questions.length;

    questions.forEach((q) => {
      if (answers[q.id] === q.correctAnswer) {
        score++;
      }
    });

    const isPassed = (score / totalQuestions) >= 0.8;

    // บันทึกผลสอบลงฐานข้อมูล PostgreSQL
    const result = await prisma.quizResult.create({
      data: {
        userId,
        courseId,
        score,
        total: totalQuestions,
        isPassed,
      }
    });

    // ดึงข้อมูลผู้ใช้และวิชา เพื่อส่ง LINE Notify
    if (isPassed) {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      const course = await prisma.course.findUnique({ where: { id: courseId } });
      
      const lineToken = process.env.LINE_NOTIFY_TOKEN;
      if (lineToken && user && course) {
        const message = `\n🎉 ประกาศผลการทดสอบ (R-POST)\nยศ-ชื่อ: ${user.rank}${user.firstName} ${user.lastName}\nสังกัด: ${user.unit}\nวิชา: ${course.name}\nผลประเมิน: ผ่านเกณฑ์ (${score}/${totalQuestions} คะแนน)`;
        
        await fetch("https://notify-api.line.me/api/notify", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Bearer ${lineToken}`,
          },
          body: new URLSearchParams({ message }),
        }).catch(err => console.error("LINE Error:", err));
      }
    }

    return NextResponse.json({ 
      success: true, 
      result: { score, total: totalQuestions, isPassed, id: result.id } 
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
