"use client";

import { useState, useEffect } from "react";

export default function AdminQuizPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Form State
  const [question, setQuestion] = useState("");
  const [optA, setOptA] = useState("");
  const [optB, setOptB] = useState("");
  const [optC, setOptC] = useState("");
  const [optD, setOptD] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("A");

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      fetchQuestions(selectedCourse);
    } else {
      setQuestions([]);
    }
  }, [selectedCourse]);

  const fetchCourses = async () => {
    const res = await fetch("/api/admin/courses");
    const data = await res.json();
    if (data.success) {
      setCourses(data.courses);
    }
  };

  const fetchQuestions = async (courseId: string) => {
    setLoading(true);
    const res = await fetch(`/api/admin/quiz?courseId=${courseId}`);
    const data = await res.json();
    if (data.success) {
      setQuestions(data.questions);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse) {
      alert("กรุณาเลือกหลักสูตรก่อนเพิ่มข้อสอบ");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/admin/quiz", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        courseId: selectedCourse,
        question,
        optA,
        optB,
        optC,
        optD,
        correctAnswer,
      }),
    });

    const data = await res.json();
    if (data.success) {
      alert("เพิ่มข้อสอบสำเร็จ");
      setQuestion("");
      setOptA("");
      setOptB("");
      setOptC("");
      setOptD("");
      setCorrectAnswer("A");
      fetchQuestions(selectedCourse);
    } else {
      alert(data.message);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("ยืนยันการลบข้อสอบนี้?")) return;
    
    setLoading(true);
    const res = await fetch(`/api/admin/quiz?id=${id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.success) {
      fetchQuestions(selectedCourse);
    } else {
      alert(data.message);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-6xl mx-auto w-full animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4 border-b border-gray-200 dark:border-army-700 pb-4">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
          <i className="fa-solid fa-file-circle-check text-rta-DEFAULT dark:text-rta-accent mr-2"></i> จัดการข้อสอบ
        </h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ฟอร์มเพิ่มข้อสอบ */}
        <div className="bg-white dark:bg-army-800 rounded-3xl shadow-lg border border-gray-100 dark:border-army-700 p-6 lg:col-span-1">
          <h4 className="font-bold text-lg mb-4 text-gray-900 dark:text-white border-l-4 border-rta-DEFAULT pl-3">เพิ่มข้อสอบใหม่</h4>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">เลือกหลักสูตร</label>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full border border-gray-300 dark:border-army-600 rounded-xl p-3 bg-gray-50 dark:bg-army-900 text-gray-900 dark:text-white outline-none focus:border-rta-DEFAULT transition text-sm"
                required
              >
                <option value="">-- เลือกหลักสูตร --</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.courseCode}: {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">คำถาม</label>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="w-full border border-gray-300 dark:border-army-600 rounded-xl p-3 bg-gray-50 dark:bg-army-900 text-gray-900 dark:text-white outline-none focus:border-rta-DEFAULT transition text-sm min-h-[80px]"
                required
                placeholder="ระบุคำถาม..."
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">ก. (Opt A)</label>
                <input type="text" value={optA} onChange={(e) => setOptA(e.target.value)} required className="w-full border border-gray-300 dark:border-army-600 rounded-xl p-2 bg-gray-50 dark:bg-army-900 text-gray-900 dark:text-white outline-none focus:border-rta-DEFAULT text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">ข. (Opt B)</label>
                <input type="text" value={optB} onChange={(e) => setOptB(e.target.value)} required className="w-full border border-gray-300 dark:border-army-600 rounded-xl p-2 bg-gray-50 dark:bg-army-900 text-gray-900 dark:text-white outline-none focus:border-rta-DEFAULT text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">ค. (Opt C)</label>
                <input type="text" value={optC} onChange={(e) => setOptC(e.target.value)} required className="w-full border border-gray-300 dark:border-army-600 rounded-xl p-2 bg-gray-50 dark:bg-army-900 text-gray-900 dark:text-white outline-none focus:border-rta-DEFAULT text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">ง. (Opt D)</label>
                <input type="text" value={optD} onChange={(e) => setOptD(e.target.value)} required className="w-full border border-gray-300 dark:border-army-600 rounded-xl p-2 bg-gray-50 dark:bg-army-900 text-gray-900 dark:text-white outline-none focus:border-rta-DEFAULT text-sm" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">เฉลย (ข้อที่ถูกต้อง)</label>
              <select
                value={correctAnswer}
                onChange={(e) => setCorrectAnswer(e.target.value)}
                className="w-full border border-gray-300 dark:border-army-600 rounded-xl p-3 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-400 font-bold outline-none focus:border-green-500 transition text-sm"
              >
                <option value="A">ก. (Opt A)</option>
                <option value="B">ข. (Opt B)</option>
                <option value="C">ค. (Opt C)</option>
                <option value="D">ง. (Opt D)</option>
              </select>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-rta-DEFAULT text-white font-bold py-3 mt-4 rounded-xl shadow-lg hover:bg-rta-dark transition flex justify-center items-center">
              {loading ? <i className="fa-solid fa-spinner fa-spin mr-2"></i> : <i className="fa-solid fa-plus mr-2"></i>} 
              บันทึกข้อสอบ
            </button>
          </form>
        </div>

        {/* รายการข้อสอบ */}
        <div className="bg-white dark:bg-army-800 rounded-3xl shadow-lg border border-gray-100 dark:border-army-700 p-6 lg:col-span-2 flex flex-col h-[700px]">
          <h4 className="font-bold text-lg mb-4 text-gray-900 dark:text-white border-l-4 border-rta-DEFAULT pl-3">
            รายการข้อสอบ <span className="text-gray-500 text-sm font-normal">({questions.length} ข้อ)</span>
          </h4>
          
          {!selectedCourse ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
              <i className="fa-solid fa-hand-pointer text-4xl mb-3"></i>
              <p>กรุณาเลือกหลักสูตรที่แถบด้านซ้าย</p>
            </div>
          ) : loading && questions.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-rta-DEFAULT">
              <i className="fa-solid fa-spinner fa-spin text-3xl"></i>
            </div>
          ) : questions.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
              <i className="fa-solid fa-box-open text-4xl mb-3"></i>
              <p>ยังไม่มีข้อสอบในหลักสูตรนี้</p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
              {questions.map((q, index) => (
                <div key={q.id} className="p-4 border border-gray-200 dark:border-army-600 rounded-2xl bg-gray-50 dark:bg-army-900/50 relative group">
                  <div className="absolute top-4 right-4 text-red-500 opacity-0 group-hover:opacity-100 transition cursor-pointer" onClick={() => handleDelete(q.id)}>
                    <i className="fa-solid fa-trash hover:scale-110"></i>
                  </div>
                  <p className="font-bold text-gray-900 dark:text-white pr-8 mb-3"><span className="text-rta-DEFAULT mr-1">ข้อ {index + 1}.</span> {q.question}</p>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <div className={`p-2 rounded-lg border ${q.correctAnswer === 'A' ? 'bg-green-100 border-green-300 text-green-800 dark:bg-green-900/30 dark:border-green-600 dark:text-green-400 font-bold' : 'border-gray-200 dark:border-army-600'}`}>
                      ก. {q.optA}
                    </div>
                    <div className={`p-2 rounded-lg border ${q.correctAnswer === 'B' ? 'bg-green-100 border-green-300 text-green-800 dark:bg-green-900/30 dark:border-green-600 dark:text-green-400 font-bold' : 'border-gray-200 dark:border-army-600'}`}>
                      ข. {q.optB}
                    </div>
                    <div className={`p-2 rounded-lg border ${q.correctAnswer === 'C' ? 'bg-green-100 border-green-300 text-green-800 dark:bg-green-900/30 dark:border-green-600 dark:text-green-400 font-bold' : 'border-gray-200 dark:border-army-600'}`}>
                      ค. {q.optC}
                    </div>
                    <div className={`p-2 rounded-lg border ${q.correctAnswer === 'D' ? 'bg-green-100 border-green-300 text-green-800 dark:bg-green-900/30 dark:border-green-600 dark:text-green-400 font-bold' : 'border-gray-200 dark:border-army-600'}`}>
                      ง. {q.optD}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
