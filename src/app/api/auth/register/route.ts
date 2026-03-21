import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, nationalId, militaryId, rank, firstName, lastName, unit, position, affiliation, gender, age, nationality, phone } = body;

    // 1. เช็คว่ามีอีเมลนี้หรือยัง
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ success: false, message: "อีเมลนี้ถูกใช้งานแล้ว" }, { status: 400 });
    }

    // 2. เข้ารหัสผ่านด้วย Bcrypt (ปลอดภัยกว่า SHA-256 หลายเท่า)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. กำหนด Role (คนแรกที่สมัครให้เป็น Admin อัตโนมัติ)
    const totalUsers = await prisma.user.count();
    const role = totalUsers === 0 ? "Admin" : "Learner";

    // 4. บันทึกลง PostgreSQL
    const newUser = await prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
        nationalId,
        militaryId,
        rank,
        firstName,
        lastName,
        unit,
        position,
        affiliation,
        gender,
        age,
        nationality,
        phone,
        role,
      },
    });

    // 5. ส่ง LINE Notify (ถ้ามีการตั้งค่า ENV ไว้)
    const lineToken = process.env.LINE_NOTIFY_TOKEN;
    if (lineToken) {
      const message = `\n👤 มีกำลังพลลงทะเบียนใหม่ (R-POST)\nยศ-ชื่อ: ${rank}${firstName} ${lastName}\nสังกัด: ${unit}\nตำแหน่ง: ${position || "-"}`;
      await fetch("https://notify-api.line.me/api/notify", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${lineToken}`,
        },
        body: new URLSearchParams({ message }),
      }).catch(err => console.error("LINE Notify Error:", err));
    }

    return NextResponse.json({ success: true, message: "ลงทะเบียนสำเร็จ" }, { status: 201 });

  } catch (error: any) {
    return NextResponse.json({ success: false, message: "เกิดข้อผิดพลาด: " + error.message }, { status: 500 });
  }
}
