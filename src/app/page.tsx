import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-army-900 text-white relative overflow-hidden font-sans flex flex-col justify-between selection:bg-rta-accent selection:text-black">
      
      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-army-900 to-army-800 opacity-90"></div>
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-rta-DEFAULT/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 animate-pulse-glow"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-rta-accent/10 rounded-full blur-[120px] translate-y-1/3 -translate-x-1/4 animate-float"></div>
        {/* Army Net Pattern */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgPjxwYXRoIGQ9Ik0wIDIwaDQwdjFIwaHptMjAgMGgxdjIwaC0xeiIgZmlsbD0iI2ZmZiIvPjwvc3ZnPg==')]"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-20 flex items-center justify-between px-8 py-6 md:px-16 animate-fade-in-down">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full p-1 border border-white/20 shadow-[0_0_15px_rgba(212,175,55,0.3)]">
            <img src="/logo.png" alt="R-POST Logo" className="w-full h-full object-contain filter drop-shadow-md" />
          </div>
          <span className="font-black tracking-widest text-xl text-white drop-shadow-lg">R-POST<span className="text-rta-accent ml-1">LMS</span></span>
        </div>
        <div className="hidden md:flex items-center gap-8 font-bold text-sm text-gray-300">
          <a href="#" className="hover:text-white transition">เกี่ยวกับโครงการ</a>
          <a href="#" className="hover:text-white transition">คู่มือการใช้งาน</a>
          <a href="#" className="hover:text-white transition">ติดต่อผู้ดูแลระบบ</a>
        </div>
        <Link href="/login" className="bg-rta-accent/10 hover:bg-rta-accent text-rta-accent hover:text-army-900 border border-rta-accent/50 px-6 py-2.5 rounded-full font-black text-sm transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:shadow-[0_0_25px_rgba(212,175,55,0.6)]">
          เข้าสู่ระบบ
        </Link>
      </nav>

      {/* Main Hero Section */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          <span className="text-xs font-bold text-gray-300 tracking-wider">ระบบจัดการเรียนการสอนอิเล็กทรอนิกส์ กองทัพบก</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight tracking-tight animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          ยกระดับศักยภาพกำลังพลด้วย <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-rta-accent to-yellow-200 filter drop-shadow-[0_2px_10px_rgba(212,175,55,0.4)]">
            ความรู้ที่ไร้ขีดจำกัด
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto font-medium leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          แพลตฟอร์ม R-POST (Royal Thai Army Personnel Operator Skill Test) ศูนย์รวมหลักสูตรออนไลน์ การพัฒนาทักษะ และการประเมินค่าอย่างเป็นระบบสำหรับกำลังพลทุกระดับ
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <Link href="/login" className="bg-rta-DEFAULT hover:bg-rta-light text-white px-8 py-4 rounded-xl font-black text-lg transition-all duration-300 shadow-[0_10px_30px_rgba(75,83,32,0.4)] hover:shadow-[0_10px_40px_rgba(107,142,35,0.6)] hover:-translate-y-1 flex items-center justify-center">
            เริ่มต้นใช้งานระบบ <i className="fa-solid fa-arrow-right ml-3"></i>
          </Link>
          <a href="#" className="bg-white/5 hover:bg-white/10 text-white border border-white/20 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 backdrop-blur-md flex items-center justify-center">
             <i className="fa-regular fa-circle-play mr-3"></i> ดูวิดีโอแนะนำ
          </a>
        </div>
      </main>

      <div className="relative z-10 border-t border-white/10 bg-army-900/50 backdrop-blur-3xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10 animate-fade-in" style={{ animationDelay: '0.6s' }}>
          {[
            { label: "หลักสูตรทั้งหมด", value: "Loading+" },
            { label: "ผู้เรียนในระบบ", value: "Secure" },
            { label: "ใบประกาศแจกแล้ว", value: "Verified" },
            { label: "ความเสถียรระบบ", value: "99.9%" }
          ].map((stat, i) => (
            <div key={i} className="bg-army-900/80 p-6 md:p-8 text-center flex flex-col justify-center">
              <h4 className="text-2xl md:text-3xl font-black text-rta-accent mb-1">{stat.value}</h4>
              <span className="text-xs text-gray-500 font-bold uppercase tracking-widest">{stat.label}</span>
            </div>
          ))}
        </div>
        
        {/* Footer Credit */}
        <footer className="text-center py-6 text-xs text-gray-500/80 tracking-widest font-medium">
          © 2026 R-POST Enterprise LMS. Proudly Built & Developed by <span className="text-rta-accent font-black drop-shadow-md">SPK-RTA</span>. All rights reserved.
        </footer>
      </div>
      
    </div>
  );
}
