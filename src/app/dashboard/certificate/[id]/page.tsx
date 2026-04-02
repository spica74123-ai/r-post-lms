import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";

export default async function CertificatePage({ params }: { params: { id: string } }) {
  const result = await prisma.quizResult.findUnique({
    where: { id: params.id },
    include: {
      user: true,
      course: true
    }
  });

  if (!result || !result.isPassed) {
    return notFound();
  }

  // วันที่สำหรับสลักลงบนใบประกาศ
  const dateOptions: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = new Date(result.createdAt).toLocaleDateString('th-TH', dateOptions);

  return (
    <div className="min-h-screen bg-gray-200 py-10 flex items-center justify-center font-sans print:bg-white print:p-0 print:m-0">
      <div className="w-[1123px] h-[794px] bg-white shadow-2xl relative overflow-hidden print:shadow-none print:w-[297mm] print:h-[210mm] flex flex-col items-center justify-center border-[16px] border-[#4b5320]">
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgPgo8cGF0aCBkPSJNMzAuNSAyOS41SDYxVjMwLjVINzBMMiAuNSAwbS41IDAgSDYwVjAgbVoiIGZpbGw9IiMwMDAwMDAiLz4KPC9zdmc+')] pointer-events-none"></div>
        
        {/* Decorative Corners */}
        <div className="absolute top-8 left-8 w-16 h-16 border-t-4 border-l-4 border-[#d4af37]"></div>
        <div className="absolute top-8 right-8 w-16 h-16 border-t-4 border-r-4 border-[#d4af37]"></div>
        <div className="absolute bottom-8 left-8 w-16 h-16 border-b-4 border-l-4 border-[#d4af37]"></div>
        <div className="absolute bottom-8 right-8 w-16 h-16 border-b-4 border-r-4 border-[#d4af37]"></div>

        {/* Content Container */}
        <div className="relative z-10 flex flex-col items-center text-center px-20">
          
          <div className="w-28 h-28 mb-6">
            <img src="/logo.png" alt="RTA Logo" className="w-full h-full object-contain filter drop-shadow-md" />
          </div>

          <h1 className="text-4xl font-black tracking-widest text-[#4b5320] mb-2 uppercase">ประกาศนียบัตรเชิดชูเกียรติ</h1>
          <h2 className="text-xl font-bold text-[#d4af37] tracking-wider mb-10">ROYAL THAI ARMY E-LEARNING CERTIFICATE</h2>

          <p className="text-gray-600 font-medium text-lg mb-4">ใบประกาศนียบัตรฉบับนี้ให้ไว้เพื่อแสดงว่า</p>
          
          <h3 className="text-4xl font-black text-gray-900 mb-2 border-b border-gray-300 pb-2 px-10 inline-block min-w-[500px]">
            {result.user.rank}{result.user.firstName} {result.user.lastName}
          </h3>
          <p className="text-gray-500 font-bold mb-10 text-sm">สังกัด: {result.user.unit}</p>

          <p className="text-gray-600 font-medium text-lg mb-4">ได้ผ่านการทดสอบหลักสูตรและการฝึกอบรมอิเล็กทรอนิกส์</p>
          
          <h4 className="text-3xl font-black text-[#4b5320] mb-3">"{result.course.name}"</h4>
          <div className="flex items-center gap-4 text-sm font-bold text-green-700 bg-green-50 px-4 py-1.5 rounded-full border border-green-200 mb-10">
            <span>คะแนนทดสอบ: {result.score}/{result.total}</span>
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
            <span>ระดับการประเมิน: ผ่านเกณฑ์ดีเยี่ยม</span>
          </div>

          <p className="text-gray-600 font-medium mb-12">ให้ไว้ ณ วันที่ {formattedDate}</p>

          <div className="flex justify-between w-full max-w-3xl mt-4 px-10">
            <div className="flex flex-col items-center">
              <div className="w-48 border-b border-gray-400 mb-2"></div>
              <p className="font-bold text-gray-800">(.............................................)</p>
              <p className="text-sm font-medium text-gray-500">ผู้อำนวยการหลักสูตร</p>
            </div>
            
            <div className="w-24 h-24 border-4 border-[#d4af37] rounded-full flex items-center justify-center relative overflow-hidden bg-white shadow-inner opacity-80">
               <span className="text-xs font-black text-[#d4af37] rotate-[-30deg] tracking-widest text-center leading-tight">RTA<br/>APPROVED</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-48 border-b border-gray-400 mb-2"></div>
              <p className="font-bold text-gray-800">(แนวทดสอบระบบ R-POST)</p>
              <p className="text-sm font-medium text-gray-500">ผู้บัญชาการหน่วยประเมิน</p>
            </div>
          </div>

        </div>
        
        {/* Print Instruction - Non-printable */}
        <div className="absolute top-4 right-4 print:hidden">
          <button onClick={() => window.print()} className="bg-[#4b5320] text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-[#3a4119] transition flex items-center">
            <i className="fa-solid fa-print mr-2"></i> สั่งพิมพ์ / บันทึกเป็น PDF
          </button>
        </div>
        <div className="absolute bottom-4 right-4 print:hidden text-xs text-gray-500 bg-white/80 p-2 rounded">
          * แนะนำให้ตั้งค่าการพิมพ์เป็น Landscape (แนวนอน) และเปิด Background graphics
        </div>
      </div>
    </div>
  );
}
