import { ArrowRight, Printer, LayoutTemplate, FilePlus2 } from 'lucide-react';
import { ViewState } from '../types';
import { useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

interface ExamEditorProps {
  setView: (view: ViewState) => void;
}

export default function ExamEditor({ setView }: ExamEditorProps) {
  const [template, setTemplate] = useState<'classic' | 'bubble'>('classic');
  const componentRef = useRef<HTMLDivElement>(null);
  const [questions, setQuestions] = useState<number[]>(Array.from({length: 20}, (_, i) => i + 1));

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: 'نموذج_اختبار',
  });

  const addQuestion = () => setQuestions([...questions, questions.length + 1]);

  return (
    <div className="flex flex-col h-full bg-gray-100">
      {/* Top Bar */}
      <div className="bg-[#1a3a6c] text-white flex items-center justify-between p-4 shadow-md z-10 print:hidden">
        <button onClick={() => setView('home')} className="p-1 hover:bg-white/10 rounded-full">
          <ArrowRight className="w-5 h-5 text-white" />
        </button>
        <div className="text-center flex-1">
          <h1 className="font-bold text-lg">محرر الاختبارات الشامل</h1>
        </div>
        <button onClick={() => handlePrint()} className="p-1 hover:bg-white/10 rounded-full">
          <Printer className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white shadow-sm flex items-center justify-center gap-4 px-4 py-2 text-sm text-gray-600 print:hidden" dir="rtl">
        <button 
          onClick={() => setTemplate('classic')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-bold ${template === 'classic' ? 'bg-[#1a3a6c] text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
        >
          <LayoutTemplate className="w-4 h-4" />
          ورقة أسئلة كلاسيكية
        </button>
        <button 
          onClick={() => setTemplate('bubble')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-bold ${template === 'bubble' ? 'bg-[#1a3a6c] text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
        >
          <LayoutTemplate className="w-4 h-4" />
          ورقة تظليل (بابل شيت)
        </button>
      </div>

      <div className="flex-1 overflow-auto p-4 print:p-0 print:overflow-visible">
        <div 
          ref={componentRef} 
          className="bg-white w-[210mm] min-h-[297mm] shadow-lg border border-gray-200 relative p-8 print:p-0 print:shadow-none print:border-none print:w-full mx-auto"
          dir="rtl"
        >
          {template === 'classic' && (
            <>
              {/* Header */}
              <div className="flex justify-between items-start border-b-2 border-black pb-4 mb-4 text-sm font-bold">
                <div className="text-right space-y-1 w-1/3">
                  <p contentEditable suppressContentEditableWarning>الجمهورية اليمنية</p>
                  <p contentEditable suppressContentEditableWarning>وزارة التربية والتعليم</p>
                  <p contentEditable suppressContentEditableWarning>مكتب التربية والتعليم بمحافظة ...</p>
                  <p contentEditable suppressContentEditableWarning>مدرسة .........................</p>
                </div>
                <div className="text-center w-1/3 flex flex-col items-center justify-center">
                  <div className="w-20 h-20 bg-gray-100 rounded-full border-2 border-gray-800 flex items-center justify-center mb-2">
                    شعار
                  </div>
                </div>
                <div className="text-right space-y-2 w-1/3 border-r-2 border-black pr-4">
                  <div className="flex gap-2">
                    <span>المادة:</span>
                    <span className="flex-1 border-b border-dotted border-black" contentEditable suppressContentEditableWarning></span>
                  </div>
                  <div className="flex gap-2">
                    <span>الصف:</span>
                    <span className="flex-1 border-b border-dotted border-black" contentEditable suppressContentEditableWarning></span>
                  </div>
                  <div className="flex gap-2">
                    <span>الزمن:</span>
                    <span className="flex-1 border-b border-dotted border-black" contentEditable suppressContentEditableWarning></span>
                  </div>
                </div>
              </div>

              {/* Student Info */}
              <div className="flex gap-4 mb-8 text-sm font-bold">
                <div className="flex items-center gap-2 flex-1">
                  <span>اسم الطالب:</span>
                  <div className="flex-1 bg-gray-100 border border-gray-300 rounded h-8"></div>
                </div>
                <div className="flex items-center gap-2 w-64">
                  <span>رقم الجلوس:</span>
                  <div className="flex-1 bg-gray-100 border border-gray-300 rounded h-8"></div>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-6">
                <div>
                  <h3 className="font-bold mb-4 text-lg" contentEditable suppressContentEditableWarning>السؤال الأول: ضع علامة (صح) أو (خطأ) أمام العبارات التالية:</h3>
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex gap-3 text-lg items-center">
                        <span className="w-6">{i}-</span>
                        <span className="flex-1 border-b border-dotted border-gray-400 min-h-[1.5rem]" contentEditable suppressContentEditableWarning></span>
                        <span className="w-16 text-center border border-black rounded inline-block">(   )</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-bold mb-4 mt-8 text-lg" contentEditable suppressContentEditableWarning>السؤال الثاني: اختر الإجابة الصحيحة من بين الأقواس:</h3>
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex gap-3 text-lg items-center">
                        <span className="w-6">{i}-</span>
                        <span className="flex-1 border-b border-dotted border-gray-400 min-h-[1.5rem]" contentEditable suppressContentEditableWarning></span>
                        <span className="w-64 text-center border-b border-dotted border-gray-400" contentEditable suppressContentEditableWarning>( .... / .... / .... )</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {template === 'bubble' && (
            <>
              {/* Header */}
              <div className="flex justify-between items-start border-b border-black pb-2 mb-4 text-xs font-bold">
                <div className="text-right w-1/4">
                  <p contentEditable suppressContentEditableWarning>وزارة التربية والتعليم</p>
                  <p contentEditable suppressContentEditableWarning>قطاع المناهج والتوجيه</p>
                </div>
                <div className="text-center flex-1">
                  <h2 className="text-lg font-black border border-black p-1 mb-1" contentEditable suppressContentEditableWarning>اختبار الشهادة الأساسية (الصف التاسع)</h2>
                  <div className="flex justify-center gap-2">
                    <span className="border border-black px-4 py-1" contentEditable suppressContentEditableWarning>المادة: القرآن الكريم</span>
                  </div>
                </div>
                <div className="text-right space-y-1 w-1/4 border-r border-black pr-2">
                  <div className="flex gap-2">
                    <span>التاريخ:</span>
                    <span className="flex-1 border-b border-dotted border-black" contentEditable suppressContentEditableWarning></span>
                  </div>
                  <div className="flex gap-2">
                    <span>الصف:</span>
                    <span className="flex-1 border-b border-dotted border-black" contentEditable suppressContentEditableWarning>التاسع</span>
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-gray-100 border border-gray-800 p-2 text-center text-xs font-bold mb-4" contentEditable suppressContentEditableWarning>
                ظلل في ورقة الإجابة الدائرة التي تحتوي على الحرف المناسب للإجابة الصحيحة بحسب رقم الفقرة.
              </div>

              {/* Bubble Sheet Grid */}
              <div className="grid grid-cols-2 gap-8">
                {/* Column 1 */}
                <table className="w-full text-sm border-collapse">
                  <tbody>
                    {questions.slice(0, Math.ceil(questions.length/2)).map((q) => (
                      <tr key={q}>
                        <td className="border border-gray-800 p-1.5 w-8 text-center font-bold bg-gray-50">{q}</td>
                        <td className="border border-gray-800 p-1.5 text-right" contentEditable suppressContentEditableWarning>اكتب السؤال هنا...</td>
                        <td className="border border-gray-800 p-1.5 w-24 text-center">
                           <div className="flex justify-center gap-2">
                             <div className="w-5 h-5 rounded-full border border-black flex items-center justify-center text-[10px] text-gray-400">أ</div>
                             <div className="w-5 h-5 rounded-full border border-black flex items-center justify-center text-[10px] text-gray-400">ب</div>
                             <div className="w-5 h-5 rounded-full border border-black flex items-center justify-center text-[10px] text-gray-400">ج</div>
                             <div className="w-5 h-5 rounded-full border border-black flex items-center justify-center text-[10px] text-gray-400">د</div>
                           </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {/* Column 2 */}
                <table className="w-full text-sm border-collapse">
                  <tbody>
                    {questions.slice(Math.ceil(questions.length/2)).map((q) => (
                      <tr key={q}>
                        <td className="border border-gray-800 p-1.5 w-8 text-center font-bold bg-gray-50">{q}</td>
                        <td className="border border-gray-800 p-1.5 text-right" contentEditable suppressContentEditableWarning>اكتب السؤال هنا...</td>
                        <td className="border border-gray-800 p-1.5 w-24 text-center">
                           <div className="flex justify-center gap-2">
                             <div className="w-5 h-5 rounded-full border border-black flex items-center justify-center text-[10px] text-gray-400">أ</div>
                             <div className="w-5 h-5 rounded-full border border-black flex items-center justify-center text-[10px] text-gray-400">ب</div>
                             <div className="w-5 h-5 rounded-full border border-black flex items-center justify-center text-[10px] text-gray-400">ج</div>
                             <div className="w-5 h-5 rounded-full border border-black flex items-center justify-center text-[10px] text-gray-400">د</div>
                           </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-8 flex justify-center print:hidden">
                <button 
                  onClick={addQuestion}
                  className="flex items-center gap-2 bg-[#1a3a6c] text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md hover:bg-[#12284b] transition-colors"
                >
                  <FilePlus2 className="w-4 h-4" />
                  إضافة سؤال جديد
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
