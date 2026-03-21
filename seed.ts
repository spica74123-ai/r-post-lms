import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const email = 'admin@rta.mi.th'
  const password = 'password1234'
  
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    console.log("Admin account already exists.")
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10)
  
  const admin = await prisma.user.create({
    data: {
      email,
      passwordHash,
      nationalId: `NID-${Date.now()}`,
      militaryId: `MID-${Date.now()}`,
      rank: "Admin",
      firstName: "ผู้ดูแลระบบ",
      lastName: "R-POST",
      unit: "ส่วนกลาง",
      role: "Admin"
    }
  })
  console.log("Admin account created successfully!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
