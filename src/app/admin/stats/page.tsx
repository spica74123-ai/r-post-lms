"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function AdminReportPage() {
  const { data: session } = useSession();
  const [reports, setReports] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    setLoading(true);
    // Adjusted to /api/admin/stats to match the API route created earlier
    const res = await fetch("/api/admin/stats");
    const data = await res.json();
    if (data.success) setReports(data.data);
    setLoading(false);
  };

  useEffect(() => { fetchReports(); }, []);

  const exportToCSV = () => {
    if (reports.length === 0) return alert("ไม่มีข้อมูลให้ส่งออก");
    
    let csvContent = "data:text/csv;charset=utf-8,\uFEFF"; // รองรับภาษาไทย (BOM)
    csvContent += "วันที่ทำรายการ,ยศ-ชื่อ-สกุล,สังกัดหน่วย,หลักสูตรประเมิน,คะแนน,สถานะ\n";
    
    filteredReports.forEach(r => {
      csvContent += `"${r.date}","${r.userName}","${r.unit}","${r.courseName}","${r.score}","${r.status}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `RPOST_Report_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredReports = reports.filter(r => 
    r.userName.includes(search) || r.unit.includes(search) || r.courseName.includes(search)
  );

  return (
    <div className="max-w-6xl mx-auto w-full animate-fade-in">
      <div className="flex flex-col lg:flex-row justify-between lg:items-center mb-6 gap-4 border-b border-gray-200 dark:border-army-700 pb-4">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
          <i className="fa-solid fa-file-excel text-rta-DEFAULT dark:text-rta-accent mr-2"></i> รายงานผลการประเมิน
        </h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <input 
            type="text" 
            placeholder="ค้นหาชื่อ, สังกัด, วิชา..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-64 border border-gray-300 dark:border-army-600 rounded-xl py-3 px-4 text-sm bg-white dark:bg-army-800 text-gray-900 dark:text-white outline-none focus:border-rta-DEFAULT"
          />
          <button onClick={exportToCSV} className="bg-[#107c41] text-white px-6 py-3 rounded-xl text-sm font-bold shadow-lg hover:bg-green-700 transition flex items-center justify-center">
            <i className="fa-solid fa-file-csv mr-2 text-lg"></i> โหลด CSV
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-army-800 rounded-3xl shadow-lg overflow-hidden border border-gray-100 dark:border-army-700">
        <div className="overflow-x-auto min-h-[300px]">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 dark:bg-army-700/50 border-b border-gray-200 dark:border-army-600 text-gray-700 dark:text-gray-200 uppercase text-xs">
              <tr>
                <th className="p-5 font-bold">วันที่บันทึก</th>
                <th className="p-5 font-bold">ยศ-ชื่อ-สกุล</th>
                <th className="p-5 font-bold">สังกัดหน่วย</th>
                <th className="p-5 font-bold">ชื่อหลักสูตร</th>
                <th className="p-5 font-bold text-center">คะแนน</th>
                <th className="p-5 font-bold text-center">สถานะ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-army-700 font-medium">
              {loading ? (
                <tr><td colSpan={6} className="text-center p-10"><i className="fa-solid fa-spinner fa-spin text-3xl text-rta-DEFAULT"></i></td></tr>
              ) : (
                filteredReports.map(r => (
                  <tr key={r.id} className="hover:bg-gray-50 dark:hover:bg-army-700/50 transition">
                    <td className="p-5 text-gray-500 dark:text-gray-400 text-xs font-bold">{r.date}</td>
                    <td className="p-5 font-black text-gray-900 dark:text-white">{r.userName}</td>
                    <td className="p-5 text-gray-600 dark:text-gray-400 text-xs">{r.unit}</td>
                    <td className="p-5 truncate max-w-[200px] text-gray-800 dark:text-gray-200 font-bold">{r.courseName}</td>
                    <td className="p-5 text-center font-black text-rta-DEFAULT dark:text-rta-accent">{r.score}</td>
                    <td className="p-5 text-center">
                      {r.status === "ผ่าน" ? (
                        <span className="text-green-600 font-black"><i className="fa-solid fa-check mr-1"></i>ผ่าน</span>
                      ) : (
                        <span className="text-red-600 font-black"><i className="fa-solid fa-xmark mr-1"></i>ไม่ผ่าน</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
