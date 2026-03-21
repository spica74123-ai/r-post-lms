import { Bell, Search, UserCircle } from 'lucide-react';

export default function Topbar() {
  return (
    <header className="h-24 px-4 sm:px-8 flex items-center justify-between bg-transparent w-full pt-4 sm:pt-0">
      <div className="w-full glassmorphism h-16 px-4 sm:px-6 flex items-center justify-between shadow-lg sm:mt-4 mx-0">
        <div className="relative w-48 sm:w-64 md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
          <input 
            type="text" 
            placeholder="Search..." 
            className="w-full bg-black/20 border border-white/10 rounded-full py-2 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-rta-accent/50 transition-colors placeholder:text-white/30"
          />
        </div>
        
        <div className="flex items-center gap-4 sm:gap-6">
          <button className="relative text-white/70 hover:text-rta-accent transition-colors">
            <Bell size={22} />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-army-800"></span>
          </button>
          
          <div className="flex items-center gap-3 border-l border-white/10 pl-4 sm:pl-6 cursor-pointer hover:opacity-80 transition-opacity">
            <div className="text-right hidden md:block">
              <p className="text-sm font-semibold text-white">Lt. Somchai</p>
              <p className="text-xs text-rta-accent">Instructor</p>
            </div>
            <UserCircle size={36} className="text-white/80" />
          </div>
        </div>
      </div>
    </header>
  );
}
