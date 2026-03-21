"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // States สำหรับ Login & Register
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rank, setRank] = useState("ส.อ.");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [unit, setUnit] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMsg("");

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError(res.error);
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, rank, firstName, lastName, unit })
      });
      const data = await res.json();
      
      if (data.success) {
        setSuccessMsg("ลงทะเบียนสำเร็จ! ระบบกำลังพากลับไปหน้าเข้าสู่ระบบ...");
        setTimeout(() => {
          setIsLogin(true);
          setSuccessMsg("");
          setPassword("");
        }, 2000);
      } else {
        setError(data.message || "การลงทะเบียนล้มเหลว");
      }
    } catch (err) {
      setError("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-200 dark:bg-army-900 transition-colors">
      <div className="w-full max-w-4xl bg-white/90 dark:bg-army-800/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-rta-accent/30 flex flex-col md:flex-row">
        
        {/* ฝั่งซ้าย: Banner */}
        <div className="bg-rta-DEFAULT text-white p-8 md:w-5/12 flex flex-col justify-center items-center relative">
          <div className="relative z-10 text-center w-full">
            <h1 className="text-4xl font-black tracking-widest mb-2 drop-shadow-md">R-POST</h1>
            <p className="text-sm font-bold text-rta-accent uppercase tracking-wider mb-2">RTA Personnel Operator Skill Test</p>
            <div className="w-16 h-1 bg-rta-accent mx-auto my-4 rounded-full"></div>
            <div className="mt-6 text-sm font-medium text-gray-200 bg-black/20 py-2 px-4 rounded-lg inline-block border border-white/10">
               Enterprise LMS 2026
            </div>
          </div>
        </div>

        {/* ฝั่งขวา: ฟอร์ม */}
        <div className="p-8 md:w-7/12 relative">
          <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6 border-l-4 border-rta-DEFAULT dark:border-rta-accent pl-3">
            {isLogin ? "เข้าสู่ระบบ (Login)" : "ลงทะเบียนใหม่ (Register)"}
          </h2>

          {/* ฟอร์ม Login */}
          {isLogin && (
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-bold mb-2 text-gray-800 dark:text-gray-300">อีเมลทางการ</label>
                <input 
                  type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-army-600 rounded-xl focus:ring-2 focus:ring-rta-DEFAULT bg-white dark:bg-army-700 text-gray-900 dark:text-white outline-none transition font-medium" 
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2 text-gray-800 dark:text-gray-300">รหัสผ่าน</label>
                <input 
                  type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-army-600 rounded-xl focus:ring-2 focus:ring-rta-DEFAULT bg-white dark:bg-army-700 text-gray-900 dark:text-white outline-none transition font-medium" 
                />
              </div>
              
              {error && <div className="p-3 rounded-xl text-sm text-center font-bold bg-red-50 text-red-600 border border-red-200">{error}</div>}
              {successMsg && <div className="p-3 rounded-xl text-sm text-center font-bold bg-green-50 text-green-600 border border-green-200">{successMsg}</div>}
              
              <button type="submit" disabled={loading} className="w-full bg-rta-DEFAULT text-white font-bold py-3 rounded-xl hover:bg-rta-dark transition shadow-lg flex justify-center items-center">
                {loading ? "กำลังตรวจสอบ..." : "เข้าสู่ระบบ R-POST"}
              </button>
            </form>
          )}

          {/* ฟอร์ม Register */}
          {!isLogin && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1 text-gray-800 dark:text-gray-300">ยศ</label>
                  <input type="text" required value={rank} onChange={(e) => setRank(e.target.value)} placeholder="ส.อ." className="w-full px-3 py-2 border border-gray-300 dark:border-army-600 rounded-xl focus:ring-2 focus:ring-rta-DEFAULT bg-white dark:bg-army-700 text-gray-900 dark:text-white outline-none transition text-sm font-medium" />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1 text-gray-800 dark:text-gray-300">สังกัดหน่วย</label>
                  <input type="text" required value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="ร.1 พัน.1 รอ." className="w-full px-3 py-2 border border-gray-300 dark:border-army-600 rounded-xl focus:ring-2 focus:ring-rta-DEFAULT bg-white dark:bg-army-700 text-gray-900 dark:text-white outline-none transition text-sm font-medium" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1 text-gray-800 dark:text-gray-300">ชื่อ</label>
                  <input type="text" required value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-army-600 rounded-xl focus:ring-2 focus:ring-rta-DEFAULT bg-white dark:bg-army-700 text-gray-900 dark:text-white outline-none transition text-sm font-medium" />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1 text-gray-800 dark:text-gray-300">สกุล</label>
                  <input type="text" required value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-army-600 rounded-xl focus:ring-2 focus:ring-rta-DEFAULT bg-white dark:bg-army-700 text-gray-900 dark:text-white outline-none transition text-sm font-medium" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold mb-1 text-gray-800 dark:text-gray-300">อีเมล (ใช้เข้าระบบ)</label>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-army-600 rounded-xl focus:ring-2 focus:ring-rta-DEFAULT bg-white dark:bg-army-700 text-gray-900 dark:text-white outline-none transition text-sm font-medium" />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1 text-gray-800 dark:text-gray-300">รหัสผ่าน</label>
                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-army-600 rounded-xl focus:ring-2 focus:ring-rta-DEFAULT bg-white dark:bg-army-700 text-gray-900 dark:text-white outline-none transition text-sm font-medium" />
              </div>

              {error && <div className="p-2 rounded-xl text-xs text-center font-bold bg-red-50 text-red-600 border border-red-200">{error}</div>}
              {successMsg && <div className="p-2 rounded-xl text-xs text-center font-bold bg-green-50 text-green-600 border border-green-200">{successMsg}</div>}
              
              <button type="submit" disabled={loading} className="w-full bg-[#107c41] text-white font-bold py-3 mt-2 rounded-xl hover:bg-green-700 transition shadow-lg flex justify-center items-center">
                {loading ? "กำลังส่งข้อมูล..." : "ลงทะเบียนสร้างบัญชีใหม่"}
              </button>
            </form>
          )}

          {/* ปรับสลับโหมด */}
          <p className="text-center text-sm mt-6 text-gray-600 dark:text-gray-400 font-medium border-t border-gray-100 dark:border-army-700 pt-4">
            {isLogin ? "กำลังพลใหม่?" : "มีบัญชีแล้ว?"} {" "}
            <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-rta-DEFAULT dark:text-rta-accent font-bold hover:underline">
              {isLogin ? "ลงทะเบียนเข้าใช้งาน" : "กลับไปหน้าเข้าสู่ระบบ"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
