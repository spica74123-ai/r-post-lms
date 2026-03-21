import { redirect } from 'next/navigation';

export default function Home() {
  // รูทหลัก (Landing page) - ตอนนี้ Redirect ไปที่ Login เบื้องต้น
  redirect('/login');
}
