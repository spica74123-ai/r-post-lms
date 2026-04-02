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
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [militaryId, setMilitaryId] = useState("");
  const [rank, setRank] = useState("ยศ");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [position, setPosition] = useState("");
  const [affiliation, setAffiliation] = useState("");
  const [unit, setUnit] = useState("");
  const [gender, setGender] = useState("ชาย");
  const [age, setAge] = useState("");
  const [nationality, setNationality] = useState("ไทย");

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

    if (password !== confirmPassword) {
      setError("รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email, password, nationalId, militaryId, rank, firstName, lastName, 
          position, affiliation, unit, gender, age: age ? parseInt(age) : null, nationality 
        })
      });
      const data = await res.json();
      
      if (data.success) {
        setSuccessMsg("ลงทะเบียนสำเร็จ! กำลังพากลับไปหน้าเข้าสู่ระบบ...");
        setTimeout(() => {
          setIsLogin(true);
          setSuccessMsg("");
          setPassword("");
          setConfirmPassword("");
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
    <div className="min-h-screen flex items-center justify-center p-4 bg-army-900 relative overflow-hidden font-sans">
      
      {/* Premium Animated Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-army-900 to-army-800 opacity-90"></div>
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-rta-DEFAULT/30 rounded-full blur-[100px] -translate-y-1/2 -translate-x-1/2 animate-pulse-glow"></div>
        <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-rta-accent/15 rounded-full blur-[150px] translate-y-1/3 translate-x-1/3 animate-float"></div>
        <div className="absolute inset-0 opacity-[0.05] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgPjxwYXRoIGQ9Ik0wIDIwaDQwdjFIwaHptMjAgMGgxdjIwaC0xeiIgZmlsbD0iI2ZmZiIvPjwvc3ZnPg==')]"></div>
      </div>

      <div className={`w-full ${isLogin ? 'max-w-[900px]' : 'max-w-[1000px]'} animate-fade-in-up bg-white/10 backdrop-blur-3xl rounded-[2rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] border border-white/20 flex flex-col md:flex-row relative z-10 overflow-hidden min-h-[550px] transition-all duration-500`}>
        
        {/* ฝั่งซ้าย: Olive Green Banner */}
        <div className={`bg-gradient-to-br from-rta-DEFAULT to-army-800 text-white p-10 flex flex-col justify-center items-center relative overflow-hidden ${isLogin ? 'md:w-[40%]' : 'md:w-[40%]'}`}>
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}></div>
          
          <div className="relative z-10 text-center w-full flex flex-col items-center">
            <div className="w-28 h-28 mb-4 drop-shadow-2xl relative hover:scale-105 transition-transform duration-300">
              <img src="/logo.png" alt="R-POST Logo" className="w-full h-full object-contain" />
            </div>
            <h1 className="text-4xl font-black tracking-[0.2em] mb-1 drop-shadow-sm text-white">R-POST</h1>
            <p className="text-[10px] font-bold text-[#d4af37] uppercase tracking-[0.15em] mb-6 leading-tight max-w-[200px] text-center">
              RTA Personnel Operator Skill Test
            </p>
            <div className="w-12 h-0.5 bg-[#d4af37] mx-auto my-0 opacity-60"></div>
            <div className="mt-8 text-[11px] font-bold text-white/90 bg-black/20 py-2.5 px-5 rounded-lg border border-white/5 backdrop-blur-sm shadow-inner uppercase tracking-wider flex items-center">
               <i className="fa-solid fa-server mr-2 opacity-80 text-[#d4af37]"></i> Enterprise LMS 2026
            </div>
          </div>
        </div>

        {/* ฝั่งขวา: ฟอร์ม Login / Register */}
        <div className={`p-8 md:p-10 ${isLogin ? 'md:w-[60%]' : 'md:w-[60%]'} relative flex flex-col bg-white/95 backdrop-blur-sm z-20`}>
          
          <div className="flex-1 flex flex-col justify-center">

            {/* ฟอร์ม Login */}
            {isLogin && (
              <div className="bg-white rounded-[1.5rem] p-8 shadow-xl border border-gray-100">
                <div className="absolute top-6 right-6 text-gray-300 hover:text-gray-500 cursor-pointer transition">
                  <i className="fa-solid fa-moon text-xl"></i>
                </div>
                
                <h2 className="text-2xl font-black text-gray-900 mb-8 flex items-center border-l-4 border-[#4b5320] pl-3">
                   เข้าสู่ระบบ (Login)
                </h2>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold mb-1.5 text-gray-700"><i className="fa-solid fa-envelope mr-1.5 opacity-60"></i>อีเมลทางการ</label>
                    <input 
                      type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4b5320]/20 focus:border-[#4b5320] bg-gray-50 text-gray-900 outline-none transition text-sm font-bold placeholder-gray-400" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1.5 text-gray-700"><i className="fa-solid fa-lock mr-1.5 opacity-60"></i>รหัสผ่าน</label>
                    <input 
                      type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4b5320]/20 focus:border-[#4b5320] bg-gray-50 text-gray-900 outline-none transition text-sm font-bold placeholder-gray-400" 
                    />
                  </div>
                  
                  {error && <div className="p-3 rounded-lg text-xs text-center font-bold bg-red-50 text-red-600 border border-red-100">{error}</div>}
                  {successMsg && <div className="p-3 rounded-lg text-xs text-center font-bold bg-green-50 text-green-600 border border-green-100">{successMsg}</div>}
                  
                  <button type="submit" disabled={loading} className="w-full bg-[#4b5320] text-white font-bold py-3 mt-4 rounded-xl hover:bg-[#3a4119] transition shadow-md flex justify-center items-center tracking-wide">
                    {loading ? "กำลังตรวจสอบ..." : "เข้าสู่ระบบ R-POST"} <i className="fa-solid fa-arrow-right-to-bracket ml-2"></i>
                  </button>

                  <div className="flex items-center my-6">
                    <div className="flex-1 border-t border-gray-200"></div>
                    <span className="px-3 text-xs text-gray-400 font-bold bg-white rounded-full mx-2">หรือเข้าสู่ระบบด้วย</span>
                    <div className="flex-1 border-t border-gray-200"></div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button type="button" className="flex items-center justify-center py-2.5 px-4 border border-blue-600 bg-white rounded-xl hover:bg-blue-50 transition w-full shadow-sm">
                      <span className="text-blue-600 font-black text-sm tracking-wide flex items-center"><i className="fa-solid fa-id-card mr-2 text-blue-500"></i> ThaiD</span>
                    </button>
                    <button type="button" className="flex items-center justify-center py-2.5 px-4 border border-red-600 bg-white rounded-xl hover:bg-red-50 transition w-full shadow-sm">
                      <span className="text-red-600 font-black text-sm tracking-wide flex items-center"><i className="fa-solid fa-building-columns mr-2 text-red-500"></i> ทางรัฐ</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* ฟอร์ม Register (โคลน UI ต้นฉบับ) */}
            {!isLogin && (
              <div className="flex-1 flex flex-col justify-center">
                <div className="flex items-center justify-between mb-8 border-b border-gray-200 pb-5">
                  <div className="flex items-center">
                    <button type="button" onClick={() => setIsLogin(true)} className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center text-gray-500 hover:text-[#4b5320] hover:shadow-md transition mr-4 cursor-pointer z-20">
                      <i className="fa-solid fa-arrow-left"></i>
                    </button>
                    <h2 className="text-xl font-black text-gray-800 tracking-wide">ลงทะเบียนกำลังพลใหม่</h2>
                  </div>
                  <button type="button" className="text-gray-400 hover:text-gray-600 transition"><i className="fa-solid fa-moon text-xl"></i></button>
                </div>

                <form onSubmit={handleRegister} className="space-y-3">
                  {/* Grid 4 แถว */}
                  <div className="grid grid-cols-2 gap-3">
                    <input type="text" required value={nationalId} onChange={(e) => setNationalId(e.target.value)} placeholder="เลข ปชช. 13 หลัก" className="w-full px-4 py-3 border-transparent rounded-xl focus:ring-2 focus:ring-[#4b5320]/20 outline-none text-sm font-bold text-gray-800 placeholder-gray-400 shadow-sm bg-white" />
                    <input type="text" required value={militaryId} onChange={(e) => setMilitaryId(e.target.value)} placeholder="เลขทหาร" className="w-full px-4 py-3 border-transparent rounded-xl focus:ring-2 focus:ring-[#4b5320]/20 outline-none text-sm font-bold text-gray-800 placeholder-gray-400 shadow-sm bg-white" />
                  </div>
                  
                  <div className="grid grid-cols-12 gap-3">
                    <select value={rank} onChange={(e) => setRank(e.target.value)} className="col-span-4 px-4 py-3 border-transparent rounded-xl focus:ring-2 focus:ring-[#4b5320]/20 outline-none text-sm font-bold text-gray-800 shadow-sm bg-white appearance-none cursor-pointer">
                      <option value="ยศ">ยศ</option><option value="สอ.">ส.อ.</option><option value="จสอ.">จ.ส.อ.</option><option value="รต.">ร.ต.</option><option value="รท.">ร.ท.</option><option value="รอ.">ร.อ.</option><option value="พต.">พ.ต.</option><option value="พท.">พ.ท.</option><option value="พอ.">พ.อ.</option>
                    </select>
                    <input type="text" required value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="ชื่อ" className="col-span-4 px-4 py-3 border-transparent rounded-xl focus:ring-2 focus:ring-[#4b5320]/20 outline-none text-sm font-bold text-gray-800 placeholder-gray-400 shadow-sm bg-white" />
                    <input type="text" required value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="สกุล" className="col-span-4 px-4 py-3 border-transparent rounded-xl focus:ring-2 focus:ring-[#4b5320]/20 outline-none text-sm font-bold text-gray-800 placeholder-gray-400 shadow-sm bg-white" />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <input type="text" value={position} onChange={(e) => setPosition(e.target.value)} placeholder="ตำแหน่ง" className="w-full px-4 py-3 border-transparent rounded-xl focus:ring-2 focus:ring-[#4b5320]/20 outline-none text-sm font-bold text-gray-800 placeholder-gray-400 shadow-sm bg-white" />
                    <input type="text" value={affiliation} onChange={(e) => setAffiliation(e.target.value)} placeholder="สังกัด" className="w-full px-4 py-3 border-transparent rounded-xl focus:ring-2 focus:ring-[#4b5320]/20 outline-none text-sm font-bold text-gray-800 placeholder-gray-400 shadow-sm bg-white" />
                    <input type="text" required value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="หน่วย" className="w-full px-4 py-3 border-transparent rounded-xl focus:ring-2 focus:ring-[#4b5320]/20 outline-none text-sm font-bold text-gray-800 placeholder-gray-400 shadow-sm bg-white" />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <select value={gender} onChange={(e) => setGender(e.target.value)} className="w-full px-4 py-3 border-transparent rounded-xl focus:ring-2 focus:ring-[#4b5320]/20 outline-none text-sm font-bold text-gray-800 shadow-sm bg-white appearance-none cursor-pointer">
                      <option value="ชาย">ชาย</option><option value="หญิง">หญิง</option>
                    </select>
                    <input type="text" value={age} onChange={(e) => setAge(e.target.value)} placeholder="อายุ" className="w-full px-4 py-3 border-transparent rounded-xl focus:ring-2 focus:ring-[#4b5320]/20 outline-none text-sm font-bold text-gray-800 placeholder-gray-400 shadow-sm bg-white" />
                    <input type="text" value={nationality} onChange={(e) => setNationality(e.target.value)} placeholder="ไทย" className="w-full px-4 py-3 border-transparent rounded-xl focus:ring-2 focus:ring-[#4b5320]/20 outline-none text-sm font-bold text-gray-800 placeholder-gray-700 shadow-sm bg-white" />
                  </div>

                  {/* กล่องตั้งรหัสผ่าน - ดีไซน์โปร่งใส */}
                  <div className="mt-6 pt-5 bg-white/70 backdrop-blur-md rounded-2xl p-5 border border-white shadow-sm ring-1 ring-gray-200">
                    <h3 className="text-xs font-black text-gray-800 mb-4 flex items-center tracking-wide"><i className="fa-solid fa-key mr-2 opacity-70"></i>ตั้งค่ารหัสผ่านเข้าใช้งาน</h3>
                    <div className="space-y-3">
                      <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="อีเมลทางการ (ใช้ล็อกอิน)" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4b5320]/20 outline-none text-sm font-bold text-gray-800 placeholder-gray-400 shadow-sm bg-white" />
                      
                      <div className="grid grid-cols-2 gap-3">
                        <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="ตั้งรหัสผ่าน" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4b5320]/20 outline-none text-sm font-bold text-gray-800 placeholder-gray-400 shadow-sm bg-white" />
                        <input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="ยืนยันรหัสผ่าน" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4b5320]/20 outline-none text-sm font-bold text-gray-800 placeholder-gray-400 shadow-sm bg-white" />
                      </div>
                    </div>
                  </div>

                  {error && <div className="p-3 rounded-xl text-xs text-center font-bold bg-red-50 text-red-600 border border-red-100 mt-2">{error}</div>}
                  {successMsg && <div className="p-3 rounded-xl text-xs text-center font-bold bg-green-50 text-green-600 border border-green-100 mt-2">{successMsg}</div>}
                  
                  <button type="submit" disabled={loading} className="w-full bg-[#4b5320] text-white font-bold py-3.5 mt-5 rounded-xl hover:bg-[#3a4119] transition shadow-lg flex justify-center items-center tracking-wide text-sm border-b-4 border-[#3a4119] active:border-b-0 active:translate-y-1">
                    {loading ? "กำลังส่งข้อมูล..." : <><i className="fa-solid fa-user-plus mr-2"></i> ยืนยันลงทะเบียน</>}
                  </button>
                </form>
              </div>
            )}

            {/* ปรับสลับโหมด - ซ่อนเมื่อกำลังลงทะเบียนเพื่อดูคลีนขึ้นเหมือนภาพ */}
            {isLogin && (
              <div className="mt-8 text-center bg-gray-50 p-4 rounded-xl border border-gray-100/50 relative z-20">
                <span className="text-[11px] text-gray-500 font-medium">
                  กำลังพลใหม่?
                </span>
                <button type="button" onClick={() => setIsLogin(false)} className="ml-2 text-[11px] text-[#4b5320] font-black hover:underline tracking-wide bg-white px-3 py-1.5 rounded-md shadow-sm border border-gray-200">
                  ลงทะเบียนสร้างบัญชีเข้าใช้งาน
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
