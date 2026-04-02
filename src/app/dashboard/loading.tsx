export default function DashboardLoading() {
  return (
    <div className="max-w-6xl mx-auto w-full flex flex-col items-center justify-center min-h-[60vh] animate-fade-in-up">
      <div className="relative flex items-center justify-center mb-8">
        {/* Outer glowing rings */}
        <div className="absolute inset-0 w-32 h-32 -ml-6 -mt-6 rounded-full border border-rta-accent/30 dark:border-rta-accent/20 border-t-rta-accent animate-spin shadow-[0_0_15px_rgba(212,175,55,0.5)]"></div>
        <div className="absolute inset-0 w-24 h-24 -ml-2 -mt-2 rounded-full border border-army-600/30 dark:border-army-500/20 border-b-rta-DEFAULT dark:border-b-rta-accent animate-[spin_2s_linear_reverse]"></div>
        
        {/* Pulsing Logo in Center */}
        <div className="relative w-20 h-20 bg-white/10 dark:bg-army-800/50 backdrop-blur-md rounded-full shadow-[0_0_25px_rgba(212,175,55,0.3)] flex items-center justify-center animate-pulse-glow">
          <img src="/logo.png" alt="Loading" className="w-12 h-12 object-contain drop-shadow-xl" />
        </div>
      </div>
      <p className="text-gray-600 dark:text-gray-400 font-bold tracking-[0.2em] text-xs uppercase animate-pulse">กำลังซิงค์ฐานข้อมูลศูนย์การเรียนรู้...</p>
    </div>
  );
}
