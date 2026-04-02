"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function UnitCommanderPage() {
  const { data: session } = useSession();
  const [personnel, setPersonnel] = useState<any[]>([]);
  const [unitName, setUnitName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUnitData = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/unit");
        const data = await res.json();
        
        if (data.success) {
          setPersonnel(data.personnel);
          setUnitName(data.unit);
        }
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };

    fetchUnitData();
  }, []);

  if (session?.user?.role !== "Commander" && session?.user?.role !== "Admin") {
    return (
      <div className="flex items-center justify-center h-96 animate-fade-in">
        <div className="text-center">
          <i className="fa-solid fa-lock text-5xl text-gray-300 dark:text-gray-600 mb-4"></i>
          <h2 className="text-xl font-bold text-gray-700 dark:text-gray-400">เนื้อหาสงวนสิทธิ์เฉพาะผู้บังคับหน่วย</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto w-full animate-fade-in">
      <div className="mb-8 p-8 bg-gradient-to-r from-rta-DEFAULT to-army-800 rounded-3xl shadow-lg border border-white/10 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[50px] -translate-y-1/2 translate-x-1/3"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h2 className="text-3xl font-black mb-2 flex items-center">
              <i className="fa-solid fa-users-viewfinder mr-3 text-rta-accent"></i> 
              แฟ้มประวัติกำลังพล
            </h2>
            <p className="text-sm font-bold text-gray-300 uppercase tracking-widest"><i className="fa-solid fa-location-crosshairs mr-1"></i> สังกัดหน่วย: {unitName || "กำลังโหลด..."}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/20 text-center">
            <span className="block text-2xl font-black text-rta-accent drop-shadow-md">{personnel.length}</span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-gray-300">ยอดกำลังพล (นาย)</span>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-army-800 rounded-3xl shadow-lg overflow-hidden border border-gray-100 dark:border-army-700">
        <div className="overflow-x-auto min-h-[300px]">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#f1f4e6] dark:bg-army-700/50 border-b border-rta-DEFAULT/20 dark:border-army-600 text-rta-DEFAULT dark:text-rta-accent uppercase text-xs">
              <tr>
                <th className="p-5 font-black">ยศ-ชื่อ-สกุล</th>
                <th className="p-5 font-black">ตำแหน่ง</th>
                <th className="p-5 font-black">หลักสูตรที่ผ่าน</th>
                <th className="p-5 font-black">ล่าสุดเมื่อ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-army-700 font-medium font-sans">
              {loading ? (
                <tr><td colSpan={4} className="text-center p-10"><i className="fa-solid fa-spinner fa-spin text-3xl text-rta-DEFAULT"></i></td></tr>
              ) : personnel.length === 0 ? (
                <tr><td colSpan={4} className="text-center p-10 text-gray-500 font-bold">ไม่พบรายชื่อกำลังพลในสังกัดเดียวกันที่คุณดูแล</td></tr>
              ) : (
                personnel.map(u => {
                  const passedResults = u.quizResults?.filter((r: any) => r.isPassed) || [];
                  const lastPassed = passedResults.length > 0 
                    ? new Date(Math.max(...passedResults.map((r:any) => new Date(r.createdAt).getTime()))) 
                    : null;
                  
                  return (
                    <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-army-700/30 transition">
                      <td className="p-5 font-bold text-gray-900 dark:text-white">
                        <div className="flex items-center">
                          <i className="fa-solid fa-user-tie text-gray-300 dark:text-gray-600 mr-3 text-lg"></i>
                          <div>
                            <div>{u.rank}{u.firstName} {u.lastName}</div>
                            <div className="text-[10px] text-gray-400 mt-0.5">เลขประจำตัว: {u.militaryId || u.nationalId}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-5 text-gray-600 dark:text-gray-400">{u.position || "-"}</td>
                      <td className="p-5">
                        {passedResults.length > 0 ? (
                          <div className="flex gap-2">
                             <span className="bg-green-100 text-green-700 border border-green-200 text-xs px-2.5 py-1 rounded-md font-bold">
                               {passedResults.length} หลักสูตร
                             </span>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400 font-bold bg-gray-100 dark:bg-army-700 px-2 py-1 rounded-md">ยังไม่ผ่านหลักสูตรใด</span>
                        )}
                      </td>
                      <td className="p-5 text-gray-500 text-xs">
                        {lastPassed ? lastPassed.toLocaleDateString("th-TH") : "-"}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
