"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function CoursePlayer({ course }: { course: any }) {
  const { data: session } = useSession();
  const [activeChapter, setActiveChapter] = useState(course.chapters[0]);
  const [isQuizMode, setIsQuizMode] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [quizResult, setQuizResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // ฟังก์ชันสลับตอนวิดีโอ
  const handlePlay = (chapter: any) => {
    setActiveChapter(chapter);
    setIsQuizMode(false);
  };

  // ฟังก์ชันเลือกคำตอบข้อสอบ
  const handleAnswer = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  // ฟังก์ชันส่งข้อสอบไปตรวจที่ API
  const submitQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.keys(answers).length < course.questions.length) {
      alert("กรุณาตอบคำถามให้ครบทุกข้อ");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/quiz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: session?.user?.id,
          courseId: course.id,
          answers,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setQuizResult(data.result);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
      alert("เกิดข้อผิดพลาดในการส่งข้อสอบ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Link href="/dashboard" className="mb-5 text-rta-DEFAULT dark:text-rta-accent font-bold hover:underline flex items-center group bg-white dark:bg-army-800 px-4 py-2 rounded-xl shadow-sm border dark:border-army-700 w-max">
        <i className="fa-solid fa-arrow-left mr-2 group-hover:-translate-x-1 transition"></i> ย้อนกลับแคตตาล็อก
      </Link>

      {!isQuizMode && !quizResult && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* ส่วนเล่นวิดีโอ */}
          <div className="lg:col-span-2">
            <div className="aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl border border-gray-200 dark:border-army-700 relative">
              <iframe src={activeChapter?.videoUrl || course.videoUrl} className="w-full h-full absolute inset-0" frameBorder="0" allowFullScreen></iframe>
            </div>
            <h3 className="text-2xl font-black mt-5 text-gray-900 dark:text-white border-l-4 border-rta-DEFAULT dark:border-rta-accent pl-3">
              <i className="fa-solid fa-play text-red-500 mr-2"></i> {activeChapter?.title || course.name}
            </h3>
          </div>

          {/* สารบัญบทเรียน Playlist */}
          <div className="bg-white dark:bg-army-800 rounded-3xl shadow-lg border border-gray-100 dark:border-army-700 flex flex-col overflow-hidden max-h-[500px]">
            <div className="p-5 bg-gray-50 dark:bg-army-900/50 border-b border-gray-100 dark:border-army-700 flex justify-between items-center">
              <h4 className="font-black text-lg text-gray-900 dark:text-white"><i className="fa-solid fa-list-ul text-rta-DEFAULT dark:text-rta-accent mr-2"></i> สารบัญบทเรียน</h4>
            </div>
            <div className="p-3 space-y-2 overflow-y-auto custom-scrollbar flex-1">
              {course.chapters.length > 0 ? (
                course.chapters.map((ch: any, idx: number) => (
                  <button key={ch.id} onClick={() => handlePlay(ch)} className={`w-full text-left p-4 rounded-xl transition flex items-center gap-3 group border mb-2 ${activeChapter?.id === ch.id ? 'bg-[#f1f4e6] dark:bg-rta-DEFAULT/20 border-rta-DEFAULT/30' : 'hover:bg-gray-100 dark:hover:bg-army-700 border-transparent dark:border-army-700'}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-black transition shadow-inner ${activeChapter?.id === ch.id ? 'bg-rta-DEFAULT text-white' : 'bg-gray-200 dark:bg-army-600 text-gray-600 dark:text-gray-300 group-hover:bg-rta-DEFAULT group-hover:text-white'}`}>
                      {idx + 1}
                    </div>
                    <div className="flex-1 truncate">
                      <p className={`font-bold text-sm transition truncate ${activeChapter?.id === ch.id ? 'text-rta-DEFAULT dark:text-rta-accent' : 'text-gray-800 dark:text-gray-200 group-hover:text-rta-DEFAULT dark:group-hover:text-rta-accent'}`}>
                        {ch.title}
                      </p>
                    </div>
                    <i className={`fa-solid fa-circle-play text-lg ${activeChapter?.id === ch.id ? 'text-rta-DEFAULT dark:text-rta-accent' : 'text-gray-300 dark:text-army-600 group-hover:text-rta-DEFAULT dark:group-hover:text-rta-accent'}`}></i>
                  </button>
                ))
              ) : (
                <div className="p-6 text-center text-gray-500 font-bold bg-gray-50 dark:bg-army-800 rounded-xl m-2 border border-gray-200 dark:border-army-700">วิดีโอเดี่ยว (ไม่มีตอนย่อย)</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* รายละเอียดวิชา และปุ่มเข้าสอบ */}
      {!isQuizMode && !quizResult && (
        <div className="bg-white dark:bg-army-800 rounded-3xl shadow-lg p-6 md:p-10 border border-gray-100 dark:border-army-700 relative overflow-hidden">
          <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white mb-4 leading-tight">{course.name}</h2>
          <div className="mb-4">
            <span className="text-sm text-gray-600 dark:text-gray-400 font-bold bg-gray-50 dark:bg-army-900/50 px-4 py-2 rounded-lg border dark:border-army-700">
              <i className="fa-solid fa-chalkboard-user mr-2 text-rta-accent"></i> อ. {course.instructor}
            </span>
          </div>
          <p className="text-gray-700 dark:text-gray-300 text-sm md:text-base leading-relaxed font-medium bg-gray-50 dark:bg-army-700/30 p-5 rounded-xl border border-gray-100 dark:border-army-600">{course.description}</p>
          
          <hr className="my-8 border-gray-200 dark:border-army-700" />
          
          <div className="flex flex-col sm:flex-row justify-between sm:items-center bg-[#f1f4e6] dark:bg-rta-DEFAULT/10 p-6 md:p-8 rounded-2xl gap-5 border border-rta-light/30 dark:border-rta-accent/20 shadow-inner">
            <div>
              <h3 className="font-black text-gray-900 dark:text-white text-xl mb-1"><i className="fa-solid fa-clipboard-question text-rta-DEFAULT dark:text-rta-accent mr-2"></i>ทำแบบทดสอบประเมินผล</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">เกณฑ์การผ่าน <span className="font-bold text-red-500">80% ขึ้นไป</span> เพื่อรับใบประกาศนียบัตร</p>
            </div>
            <button onClick={() => setIsQuizMode(true)} className="bg-rta-DEFAULT text-white px-8 py-4 rounded-xl font-bold hover:bg-rta-dark transition shadow-lg flex items-center justify-center">
              <i className="fa-regular fa-pen-to-square mr-2 text-xl"></i> เริ่มทำแบบทดสอบ
            </button>
          </div>
        </div>
      )}

      {/* หน้าทำข้อสอบ */}
      {isQuizMode && !quizResult && (
        <div className="bg-white dark:bg-army-800 rounded-3xl shadow-2xl border border-gray-100 dark:border-army-700 p-6 md:p-12 relative overflow-hidden animate-slide-up">
          <div className="absolute top-0 inset-x-0 h-2 bg-rta-DEFAULT dark:bg-rta-accent"></div>
          <div className="text-center mb-10 border-b border-gray-200 dark:border-army-700 pb-6">
            <span className="inline-block bg-yellow-100 dark:text-yellow-500 text-yellow-800 text-xs font-black px-4 py-1.5 rounded-full mb-4 shadow-sm tracking-widest">R-POST EXAMINATION</span>
            <h2 className="text-3xl font-black text-gray-900 dark:text-white">แบบทดสอบประเมินผล</h2>
          </div>
          
          <form onSubmit={submitQuiz}>
            <div className="space-y-8">
              {course.questions.map((q: any, i: number) => (
                <div key={q.id} className="bg-gray-50 dark:bg-army-800 border border-gray-200 dark:border-army-600 rounded-3xl p-8 shadow-sm relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-2 bg-rta-DEFAULT dark:bg-rta-accent"></div>
                  <h4 className="font-black mb-5 text-xl text-gray-900 dark:text-white pl-4"><span className="text-rta-DEFAULT dark:text-rta-accent mr-2">ข้อ {i+1}.</span> {q.question}</h4>
                  <div className="space-y-4 pl-4">
                    {['A', 'B', 'C', 'D'].map((opt) => (
                      <label key={opt} className="flex items-center p-5 border border-gray-300 dark:border-army-600 rounded-2xl cursor-pointer hover:bg-white dark:hover:bg-army-700 transition bg-white dark:bg-army-800 shadow-sm group">
                        <input type="radio" name={`q_${q.id}`} value={opt} onChange={() => handleAnswer(q.id, opt)} required className="hidden quiz-radio" />
                        <div className={`w-6 h-6 border-2 rounded-full mr-4 flex-shrink-0 flex items-center justify-center transition ${answers[q.id] === opt ? 'border-rta-DEFAULT bg-rta-DEFAULT' : 'border-gray-400 group-hover:border-rta-DEFAULT'}`}>
                          {answers[q.id] === opt && <div className="w-2 h-2 bg-white rounded-full"></div>}
                        </div>
                        <span className="text-gray-800 dark:text-gray-200 font-bold text-base">{q[`opt${opt}`]}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-10 pt-8 border-t border-gray-200 dark:border-army-700 flex flex-col md:flex-row justify-end gap-4">
              <button type="button" onClick={() => setIsQuizMode(false)} className="text-gray-600 dark:text-gray-400 font-bold px-8 py-4 hover:bg-gray-100 dark:hover:bg-army-700 rounded-xl transition border border-gray-200 dark:border-army-600">ยกเลิก / ปิดข้อสอบ</button>
              <button type="submit" disabled={loading} className="bg-rta-DEFAULT text-white font-bold py-4 px-12 rounded-xl shadow-lg hover:bg-rta-dark transition flex justify-center items-center text-lg">
                <i className="fa-solid fa-paper-plane mr-2"></i> {loading ? "กำลังตรวจคำตอบ..." : "ส่งคำตอบ"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* หน้าผลลัพธ์การสอบ */}
      {quizResult && (
        <div className="max-w-2xl mx-auto w-full animate-slide-up mt-6">
          <div className="bg-white dark:bg-army-800 rounded-3xl shadow-2xl border border-gray-100 dark:border-army-700 text-center p-8 md:p-12 relative overflow-hidden">
            {quizResult.isPassed ? (
              <>
                <i className="fa-solid fa-circle-check text-7xl text-green-500 mb-6 drop-shadow-lg"></i>
                <h2 className="text-3xl font-black mb-3 text-green-600 dark:text-green-400">ยินดีด้วย! คุณสอบผ่านเกณฑ์</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-8 font-medium">คะแนนของคุณถูกบันทึกลงในฐานข้อมูลของกองทัพบกเรียบร้อยแล้ว</p>
              </>
            ) : (
              <>
                <i className="fa-solid fa-circle-xmark text-7xl text-red-500 mb-6 drop-shadow-lg"></i>
                <h2 className="text-3xl font-black mb-3 text-red-600 dark:text-red-400">คุณยังไม่ผ่านเกณฑ์การประเมิน</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-8 font-medium">โปรดกลับไปทบทวนเนื้อหาและทำข้อสอบใหม่อีกครั้ง</p>
              </>
            )}

            <div className="text-6xl font-black mb-10 p-8 bg-gray-50 dark:bg-army-900/50 rounded-3xl inline-block border border-gray-200 dark:border-army-700 w-full max-w-sm shadow-inner">
              <span className="text-rta-DEFAULT dark:text-rta-accent">{quizResult.score}</span>
              <span className="text-4xl text-gray-400 dark:text-gray-600"> / {quizResult.total}</span>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/dashboard" className="bg-gray-200 dark:bg-army-700 text-gray-800 dark:text-gray-200 font-bold py-4 px-8 rounded-xl w-full hover:bg-gray-300 dark:hover:bg-army-600 transition text-center border dark:border-army-600">
                <i className="fa-solid fa-house mr-2"></i> กลับหน้าหลัก
              </Link>
              {!quizResult.isPassed && (
                <button onClick={() => { setIsQuizMode(true); setQuizResult(null); setAnswers({}); }} className="bg-rta-DEFAULT text-white font-bold py-4 px-8 rounded-xl w-full shadow-lg hover:bg-rta-dark transition">
                  <i className="fa-solid fa-rotate-right mr-2"></i> สอบซ่อมอีกครั้ง
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
