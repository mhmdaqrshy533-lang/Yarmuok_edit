import { useState } from 'react';
import { ArrowRight, TableProperties, Plus, Trash2, Printer, Percent, CheckCircle2 } from 'lucide-react';
import { ViewState } from '../types';

interface SpecTableProps {
  setView: (view: ViewState) => void;
}

interface Chapter {
  id: string;
  name: string;
  lessonsCount: number; // relative weight based on lessons / hours
}

export default function SpecTable({ setView }: SpecTableProps) {
  const [totalMarks, setTotalQuestions] = useState<number>(100);
  const [chapters, setChapters] = useState<Chapter[]>([
    { id: '1', name: 'الباب الأول: الميكانيكا والحرارة', lessonsCount: 8 },
    { id: '2', name: 'الباب الثاني: الكهرباء الساكنة', lessonsCount: 6 },
    { id: '3', name: 'الباب الثالث: المغناطيسية والقرن 20', lessonsCount: 10 },
  ]);

  const [cognitiveWeights, setCognitiveWeights] = useState({
    remember: 30, // % remembering
    understand: 30, // % understanding
    apply: 25, // % application
    analyze: 15, // % analysis
  });

  const [newChapterName, setNewChapterName] = useState('');
  const [newChapterLessons, setNewChapterLessons] = useState(4);

  const addChapter = () => {
    if (!newChapterName) return;
    setChapters(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        name: newChapterName,
        lessonsCount: Number(newChapterLessons)
      }
    ]);
    setNewChapterName('');
  };

  const removeChapter = (id: string) => {
    setChapters(prev => prev.filter(c => s => c.id !== id));
    setChapters(prev => prev.filter(c => c.id !== id));
  };

  // Calculations
  const totalLessons = chapters.reduce((acc, curr) => acc + curr.lessonsCount, 0);

  const calculateSpecTable = () => {
    return chapters.map(ch => {
      const chapterWeight = totalLessons > 0 ? (ch.lessonsCount / totalLessons) : 0;
      const chapterMarks = chapterWeight * totalMarks;
      
      const rememberMarks = (cognitiveWeights.remember / 100) * chapterMarks;
      const understandMarks = (cognitiveWeights.understand / 100) * chapterMarks;
      const applyMarks = (cognitiveWeights.apply / 100) * chapterMarks;
      const analyzeMarks = (cognitiveWeights.analyze / 100) * chapterMarks;

      return {
        ...ch,
        weight: chapterWeight * 100,
        marks: chapterMarks,
        remember: rememberMarks,
        understand: understandMarks,
        apply: applyMarks,
        analyze: analyzeMarks,
      };
    });
  };

  const results = calculateSpecTable();

  return (
    <div className="flex flex-col h-full bg-[#121619] text-white">
      {/* Top Bar */}
      <div className="bg-[#0f291e]/90 backdrop-blur-xl text-white flex items-center justify-between p-4 shadow-md z-10 sticky top-0 border-b border-emerald-500/20">
        <button onClick={() => setView('home')} className="p-2 hover:bg-white/10 rounded-xl transition-colors group">
          <ArrowRight className="w-5 h-5 text-emerald-400 group-hover:text-emerald-300" />
        </button>
        <div className="text-center flex-1">
          <h1 className="font-black text-lg text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 tracking-wide">جدول المواصفات والوزن النسبي</h1>
          <p className="text-[10px] text-emerald-400/80">المعايير المعتمدة لوزارة التربية والتعليم اليمنية</p>
        </div>
        <div className="w-9" />
      </div>

      <div className="flex-1 overflow-auto p-4 md:p-6" dir="rtl">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Inputs Column */}
          <div className="lg:col-span-4 bg-[#1a2320] border border-emerald-900/40 rounded-3xl p-6 shadow-lg space-y-6 print:hidden">
            <h3 className="text-base font-black text-emerald-400 pb-2 border-b border-emerald-900/30">معايير التوزيع</h3>
            
            {/* Target Total Marks */}
            <div>
              <label className="block text-xs text-gray-400 mb-2 font-bold">الدرجة الإجمالية للاختبار:</label>
              <input 
                type="number" 
                value={totalMarks}
                onChange={e => setTotalQuestions(Number(e.target.value))}
                className="w-full bg-[#121619] border border-emerald-900/50 rounded-xl px-4 py-3 text-sm font-bold text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Cognitive weights */}
            <div className="space-y-4">
              <label className="block text-xs text-gray-400 font-bold border-b border-emerald-900/25 pb-1">مستويات بلوم المعرفية (%):</label>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[11px] font-bold text-emerald-300 block mb-1">التذكر (%):</span>
                  <input 
                    type="number"
                    value={cognitiveWeights.remember}
                    onChange={e => setCognitiveWeights(p => ({ ...p, remember: Number(e.target.value) }))}
                    className="w-full bg-[#121619] border border-emerald-900/50 rounded-lg p-2 text-xs text-center font-bold text-white"
                  />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-emerald-300 block mb-1">الفهم (%):</span>
                  <input 
                    type="number"
                    value={cognitiveWeights.understand}
                    onChange={e => setCognitiveWeights(p => ({ ...p, understand: Number(e.target.value) }))}
                    className="w-full bg-[#121619] border border-emerald-900/50 rounded-lg p-2 text-xs text-center font-bold text-white"
                  />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-emerald-300 block mb-1">التطبيق (%):</span>
                  <input 
                    type="number"
                    value={cognitiveWeights.apply}
                    onChange={e => setCognitiveWeights(p => ({ ...p, apply: Number(e.target.value) }))}
                    className="w-full bg-[#121619] border border-emerald-900/50 rounded-lg p-2 text-xs text-center font-bold text-white"
                  />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-emerald-300 block mb-1">التحليل (%):</span>
                  <input 
                    type="number"
                    value={cognitiveWeights.analyze}
                    onChange={e => setCognitiveWeights(p => ({ ...p, analyze: Number(e.target.value) }))}
                    className="w-full bg-[#121619] border border-emerald-900/50 rounded-lg p-2 text-xs text-center font-bold text-white"
                  />
                </div>
              </div>

              {cognitiveWeights.remember + cognitiveWeights.understand + cognitiveWeights.apply + cognitiveWeights.analyze !== 100 && (
                <p className="text-[10px] text-red-400 font-bold bg-red-950/20 p-2 rounded-lg border border-red-900/30">
                  تنبيه: يجب أن يكون مجموع النِسَب المعرفية مساوياً لـ 100% حالياً: {cognitiveWeights.remember + cognitiveWeights.understand + cognitiveWeights.apply + cognitiveWeights.analyze}%
                </p>
              )}
            </div>

            {/* Chapters Input */}
            <div className="space-y-3 pt-4 border-t border-emerald-900/20">
              <label className="block text-xs text-gray-400 font-bold">إضافة باب/فصل دراسي جديد:</label>
              <input 
                type="text" 
                placeholder="اسم الباب أو الفصل..."
                value={newChapterName}
                onChange={e => setNewChapterName(e.target.value)}
                className="w-full bg-[#121619] border border-emerald-900/50 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-emerald-500"
              />
              <div className="flex gap-2 items-center">
                <span className="text-[10px] text-gray-500 whitespace-nowrap">الوزن (عدد الدروس/الحصص):</span>
                <input 
                  type="number" 
                  value={newChapterLessons}
                  onChange={e => setNewChapterLessons(Number(e.target.value))}
                  className="w-16 bg-[#121619] border border-emerald-900/50 rounded-lg p-1.5 text-xs text-center font-bold text-white"
                />
              </div>
              <button 
                onClick={addChapter}
                className="w-full bg-emerald-800 hover:bg-emerald-700 text-emerald-100 text-xs font-bold py-2 rounded-xl flex items-center justify-center gap-1 transition-colors"
              >
                <Plus className="w-4 h-4" />
                إضافة الفصل للمخطط
              </button>
            </div>
          </div>

          {/* Table Results Column */}
          <div className="lg:col-span-8 bg-[#1a2320] border border-emerald-900/40 rounded-3xl p-6 shadow-lg flex flex-col justify-between print:bg-white print:text-black print:p-0 print:border-none print:shadow-none">
            
            <div>
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-emerald-900/30 print:hidden">
                <h3 className="text-lg font-black text-emerald-400 flex items-center gap-2">
                  <TableProperties className="w-5 h-5" />
                  مصفوفة جدول المواصفات النهائي
                </h3>
                <button 
                  onClick={() => window.print()}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-5 rounded-xl text-xs flex items-center gap-2 shadow-md"
                >
                  <Printer className="w-4 h-4" />
                  طباعة المخطط
                </button>
              </div>

              {/* Specification Table */}
              <div className="overflow-x-auto rounded-2xl border border-emerald-950 bg-black/20 p-2 print:border-black print:bg-white">
                <table className="w-full text-right text-xs leading-normal font-sans border-collapse" dir="rtl">
                  <thead>
                    <tr className="bg-[#121619] text-emerald-400 font-black border-b border-emerald-900/50 print:bg-gray-100 print:text-black print:border-black">
                      <th className="p-3 text-right">الفصل الدراسي / الباب</th>
                      <th className="p-3 text-center">عدد الحصص</th>
                      <th className="p-3 text-center">الوزن النسبي %</th>
                      <th className="p-3 text-center">الدرجة المستحقة</th>
                      <th className="p-3 text-center">تذكر ({cognitiveWeights.remember}%)</th>
                      <th className="p-3 text-center">فهم ({cognitiveWeights.understand}%)</th>
                      <th className="p-3 text-center">تطبيق ({cognitiveWeights.apply}%)</th>
                      <th className="p-3 text-center">تحليل ({cognitiveWeights.analyze}%)</th>
                      <th className="p-3 text-center print:hidden">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map(row => (
                      <tr key={row.id} className="border-b border-emerald-950/30 hover:bg-[#1a2320]/60 transition-colors print:border-black print:text-black">
                        <td className="p-3 font-bold text-gray-100 print:text-black">{row.name}</td>
                        <td className="p-3 text-center font-bold text-emerald-100 print:text-black">{row.lessonsCount}</td>
                        <td className="p-3 text-center font-bold text-cyan-400 print:text-black">%{row.weight.toFixed(1)}</td>
                        <td className="p-3 text-center font-black text-emerald-400 print:text-black">{row.marks.toFixed(1)}</td>
                        <td className="p-3 text-center text-gray-300 print:text-black">{row.remember.toFixed(1)}</td>
                        <td className="p-3 text-center text-gray-300 print:text-black">{row.understand.toFixed(1)}</td>
                        <td className="p-3 text-center text-gray-300 print:text-black">{row.apply.toFixed(1)}</td>
                        <td className="p-3 text-center text-gray-300 print:text-black">{row.analyze.toFixed(1)}</td>
                        <td className="p-3 text-center print:hidden">
                          <button 
                            onClick={() => removeChapter(row.id)}
                            className="p-1.5 hover:bg-red-950/50 rounded-lg text-red-500 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-[#121619] font-black text-emerald-400 border-t-2 border-emerald-900 print:bg-gray-100 print:text-black print:border-black">
                      <td className="p-3">الإجمالي</td>
                      <td className="p-3 text-center">{totalLessons}</td>
                      <td className="p-3 text-center">%100.0</td>
                      <td className="p-3 text-center text-emerald-400 print:text-black">{totalMarks}</td>
                      <td className="p-3 text-center">{(cognitiveWeights.remember/100 * totalMarks).toFixed(1)}</td>
                      <td className="p-3 text-center">{(cognitiveWeights.understand/100 * totalMarks).toFixed(1)}</td>
                      <td className="p-3 text-center">{(cognitiveWeights.apply/100 * totalMarks).toFixed(1)}</td>
                      <td className="p-3 text-center">{(cognitiveWeights.analyze/100 * totalMarks).toFixed(1)}</td>
                      <td className="p-3 print:hidden"></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <div className="mt-8 border-t border-emerald-900/20 pt-6 flex justify-between items-center text-xs text-gray-500 print:hidden">
              <div className="flex items-center gap-2 text-emerald-500">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>المعادلات الحسابية مطابقة للمعايير الوزارية اليمنية لعام 2025/2026.</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
