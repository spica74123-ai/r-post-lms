export default function AdminLoading() {
  return (
    <div className="max-w-6xl mx-auto w-full flex flex-col items-center justify-center min-h-[60vh] animate-fade-in-up">
      <div className="relative flex items-center justify-center mb-8">
        {/* Outer glowing rings - Admin styles (Red/Gold) */}
        <div className="absolute inset-0 w-32 h-32 -ml-6 -mt-6 rounded-full border border-red-500/20 dark:border-red-500/20 border-r-red-500 animate-[spin_1.5s_linear_infinite] shadow-[0_0_15px_rgba(239,68,68,0.4)]"></div>
        <div className="absolute inset-0 w-24 h-24 -ml-2 -mt-2 rounded-full border border-rta-accent/20 dark:border-rta-accent/10 border-l-rta-accent animate-[spin_2.5s_linear_reverse_infinite]"></div>
        
        {/* Pulsing Logo in Center */}
        <div className="relative w-20 h-20 bg-white/10 dark:bg-army-900/50 backdrop-blur-md rounded-full shadow-[0_0_20px_rgba(212,175,55,0.2)] border border-red-500/30 flex items-center justify-center animate-pulse-glow">
          <img src="/logo.png" alt="Admin Loading" className="w-12 h-12 object-contain drop-shadow-xl" />
        </div>
      </div>
      <p className="text-gray-600 dark:text-gray-400 font-black tracking-[0.2em] text-xs uppercase animate-pulse flex items-center">
        <i className="fa-solid fa-server mr-2 text-red-500"></i> รอสักครู่ ระบบจัดการกำลังทำงาน...
      </p>
    </div>
  );
}
