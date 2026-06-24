import { ArrowRight, Printer, LayoutTemplate, FilePlus2, CloudDownload } from 'lucide-react';
import { ViewState } from '../types';
import { useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { useStore } from '../store';

interface ExamEditorProps {
  setView: (view: ViewState) => void;
}

export default function ExamEditor({ setView }: ExamEditorProps) {
  const { settings } = useStore();
  const [template, setTemplate] = useState<'classic' | 'bubble' | 'saudi_classic' | 'saudi_bubble' | 'algerian_classic' | 'saudi_vision'>('classic');
  const componentRef = useRef<HTMLDivElement>(null);
  const [questions, setQuestions] = useState<number[]>(Array.from({length: 20}, (_, i) => i + 1));
  const [lockerOpen, setLockerOpen] = useState(false);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: 'نموذج_اختبار',
  });

  const addQuestion = () => setQuestions([...questions, questions.length + 1]);
  const [zoom, setZoom] = useState(1);

  return (
    <div className="flex flex-col h-full bg-black relative text-gray-200">
      {/* Top Bar */}
      <div className="bg-gray-900/90 backdrop-blur-xl text-white flex items-center justify-between p-4 shadow-[0_4px_30px_rgba(147,51,234,0.15)] z-10 sticky top-0 border-b border-purple-500/20 print:hidden">
        <button onClick={() => setView('home')} className="p-2 hover:bg-white/10 rounded-xl transition-colors group">
          <ArrowRight className="w-5 h-5 text-purple-400 group-hover:text-cyan-400" />
        </button>
        <div className="text-center flex-1">
          <h1 className="font-bold text-lg text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">محرر الاختبارات الشامل</h1>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setLockerOpen(!lockerOpen)} className="flex items-center gap-2 bg-blue-900/30 border border-blue-500/30 text-blue-400 font-bold px-3 py-2 rounded-xl hover:text-white transition-colors" title="خزانة الموارد التشاركية">
            <CloudDownload className="w-5 h-5"/>
            <span className="hidden md:inline">الخزانة التشاركية</span>
          </button>
          <button onClick={() => handlePrint()} className="p-2 hover:bg-white/10 rounded-xl transition-colors group">
            <Printer className="w-5 h-5 text-cyan-400 group-hover:text-purple-400" />
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-gray-900/60 backdrop-blur-md border-b border-purple-500/20 flex flex-wrap items-center justify-center gap-4 px-4 py-3 text-sm text-gray-300 print:hidden shadow-lg relative" dir="rtl">
        
        {lockerOpen && (
          <div className="absolute top-16 left-4 bg-gray-900/95 backdrop-blur-xl border border-blue-500/40 shadow-[0_10px_40px_-10px_rgba(59,130,246,0.4)] rounded-2xl p-4 w-80 z-50 text-right">
            <h3 className="font-bold text-blue-400 mb-3 border-b border-blue-500/20 pb-2">خزانة الموارد التشاركية</h3>
            <p className="text-xs text-gray-300 mb-4">استيراد بنك أسئلة من زملائك المعلمين في مدرسة {settings.schoolName}</p>
            <div className="space-y-2">
              <button onClick={() => { alert('تم استيراد الأسئلة بنجاح!'); setLockerOpen(false); }} className="w-full text-right p-3 bg-black/40 hover:bg-blue-900/40 border border-gray-800 hover:border-blue-500/40 rounded-xl transition-all">
                <div className="font-bold text-white text-sm">بنك أسئلة لغة عربية - أ. أحمد</div>
                <div className="text-xs text-gray-400 mt-1">الصف التاسع • 20 سؤال • قبل يومين</div>
              </button>
              <button onClick={() => { alert('تم استيراد الأسئلة بنجاح!'); setLockerOpen(false); }} className="w-full text-right p-3 bg-black/40 hover:bg-blue-900/40 border border-gray-800 hover:border-blue-500/40 rounded-xl transition-all">
                <div className="font-bold text-white text-sm">اختبار رياضيات نصفي - أ. فاطمة</div>
                <div className="text-xs text-gray-400 mt-1">الصف الثامن • 15 سؤال • الأسبوع الماضي</div>
              </button>
            </div>
            <button className="w-full mt-4 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded-xl transition-colors text-sm">
              رفع أسئلتي للخزانة
            </button>
          </div>
        )}

        <div className="flex items-center gap-3">
          <LayoutTemplate className="w-5 h-5 text-purple-400" />
          <span className="font-bold">قالب الاختبار:</span>
          <select 
            value={template} 
            onChange={e => setTemplate(e.target.value as any)}
            className="bg-black/50 border border-purple-500/30 rounded-xl px-4 py-2 text-white font-bold focus:outline-none focus:border-cyan-500/50 appearance-none hover:bg-purple-900/40 transition-colors"
          >
            <option value="classic">كلاسيكي (أساسي)</option>
            <option value="bubble">بابل شيت (أساسي)</option>
            <option value="saudi_classic">السعودية (مقالي)</option>
            <option value="saudi_bubble">السعودية (بابل شيت)</option>
            <option value="saudi_vision">السعودية (رؤية 2030)</option>
            <option value="algerian_classic">الجزائر (تمارين)</option>
          </select>
        </div>
        <div className="h-6 w-px bg-purple-500/30 mx-2 hidden md:block"></div>
        <div className="flex items-center gap-2 bg-black/50 border border-purple-500/30 rounded-xl p-1">
          <button onClick={() => setZoom(z => Math.max(0.5, z - 0.1))} className="p-1 hover:bg-purple-900/40 rounded-lg text-purple-400 hover:text-cyan-400 font-bold">-</button>
          <span className="text-xs font-mono w-12 text-center text-cyan-300">{Math.round(zoom * 100)}%</span>
          <button onClick={() => setZoom(z => Math.min(2, z + 0.1))} className="p-1 hover:bg-purple-900/40 rounded-lg text-purple-400 hover:text-cyan-400 font-bold">+</button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 md:p-8 print:p-0 print:overflow-visible flex justify-center items-start">
        <div 
          ref={componentRef} 
          style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
          className="bg-white text-black w-[210mm] min-h-[297mm] shadow-[0_0_40px_rgba(147,51,234,0.15)] relative p-8 print:p-0 print:shadow-none print:w-full mx-auto print:transform-none transition-transform duration-200"
          dir="rtl"
        >
          {template === 'classic' && (
            <>
              {/* Header */}
              <div className="flex justify-between items-start border-b-2 border-black pb-4 mb-4 text-sm font-bold">
                <div className="text-right space-y-1 w-1/3">
                  <p>{settings.country}</p>
                  <p>{settings.ministry}</p>
                  <p>مكتب التربية والتعليم بمحافظة <span className="font-normal">{settings.governorate}</span></p>
                  <p>مدرسة <span className="font-normal">{settings.schoolName}</span></p>
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
                  <p>{settings.ministry}</p>
                  <p>{settings.governorate}</p>
                  <p>{settings.schoolName}</p>
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

          {template === 'saudi_classic' && (
            <div className="font-serif">
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                {/* Right */}
                <div className="text-right text-xs font-bold space-y-1 w-1/3">
                  <p>المملكة العربية السعودية</p>
                  <p>وزارة التعليم</p>
                  <p>الإدارة العامة للتعليم بمنطقة <span contentEditable suppressContentEditableWarning>الرياض</span></p>
                  <p>مكتب تعليم <span contentEditable suppressContentEditableWarning>.........</span></p>
                  <p>مدرسة <span contentEditable suppressContentEditableWarning>.........</span></p>
                </div>
                
                {/* Center */}
                <div className="text-center w-1/3 flex flex-col items-center">
                  <div className="w-20 h-20 border-2 border-gray-300 rounded-full flex items-center justify-center mb-4 text-gray-400 text-sm">شعار</div>
                  <div className="flex gap-2 text-sm font-bold w-full justify-center">
                    <span>اسم الطالب:</span>
                    <span className="flex-1 bg-gray-200 min-w-[150px] min-h-[1.5rem] rounded border border-gray-300" contentEditable suppressContentEditableWarning></span>
                  </div>
                </div>

                {/* Left */}
                <div className="text-right text-sm font-bold space-y-2 w-1/3 pr-4 flex flex-col items-end">
                  <div className="flex w-3/4 bg-gray-200 rounded p-1 border border-gray-300">
                    <span className="w-12 text-xs">المادة:</span>
                    <span className="flex-1 border-r border-gray-400 pr-1" contentEditable suppressContentEditableWarning></span>
                  </div>
                  <div className="flex w-3/4 bg-gray-200 rounded p-1 border border-gray-300">
                    <span className="w-12 text-xs">الصف:</span>
                    <span className="flex-1 border-r border-gray-400 pr-1" contentEditable suppressContentEditableWarning></span>
                  </div>
                  <div className="flex w-3/4 bg-gray-200 rounded p-1 border border-gray-300">
                    <span className="w-12 text-xs">الزمن:</span>
                    <span className="flex-1 border-r border-gray-400 pr-1" contentEditable suppressContentEditableWarning></span>
                  </div>
                </div>
              </div>

              {/* Grades & Signatures */}
              <div className="flex gap-4 mb-4 items-end">
                <table className="border-collapse border border-teal-600 w-1/2 text-center text-sm font-bold">
                  <thead>
                    <tr className="bg-teal-600 text-white">
                       <th className="border border-teal-600 py-1">الدرجة من 50</th>
                       <th className="border border-teal-600 py-1">الدرجة كتابة (من 50)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                       <td className="border border-teal-600 h-10 w-1/3" contentEditable suppressContentEditableWarning></td>
                       <td className="border border-teal-600 h-10 w-2/3" contentEditable suppressContentEditableWarning></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div className="text-center font-bold text-sm mb-4">
                أسئلة اختبار الفصل الدراسي <span className="border-b border-dotted border-black inline-block w-24" contentEditable suppressContentEditableWarning></span> (الدور <span className="border-b border-dotted border-black inline-block w-16" contentEditable suppressContentEditableWarning></span>) للعام الدراسي <span className="border-b border-dotted border-black inline-block w-24" contentEditable suppressContentEditableWarning></span> هـ
              </div>

              <div className="w-full">
                <table className="border-collapse border border-teal-600 w-full text-center text-sm font-bold">
                  <thead>
                    <tr className="bg-teal-600 text-white">
                      <th className="border border-teal-600 py-1 px-4">المصحح</th>
                      <th className="border border-teal-600 py-1 px-8">التوقيع</th>
                      <th className="border border-teal-600 py-1 px-4">المراجع</th>
                      <th className="border border-teal-600 py-1 px-8">التوقيع</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-teal-600 h-8" contentEditable suppressContentEditableWarning></td>
                      <td className="border border-teal-600 h-8" contentEditable suppressContentEditableWarning></td>
                      <td className="border border-teal-600 h-8" contentEditable suppressContentEditableWarning></td>
                      <td className="border border-teal-600 h-8" contentEditable suppressContentEditableWarning></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="border-2 border-gray-400 mt-4 min-h-[400px] p-4 text-right rounded-2xl focus:outline-none focus:bg-gray-50" contentEditable suppressContentEditableWarning>
                 اكتب الأسئلة هنا...
              </div>
            </div>
          )}

          {template === 'saudi_bubble' && (
            <div className="font-serif border-4 border-black p-1">
              <div className="border border-black p-2">
                {/* Header */}
                <div className="flex justify-between items-start mb-2 text-xs font-bold">
                  {/* Left (Table) */}
                  <div className="w-1/3 text-right">
                    <p>المملكة العربية السعودية</p>
                    <p>وزارة التعليم</p>
                    <p>إدارة التعليم بمحافظة <span contentEditable suppressContentEditableWarning>.........</span></p>
                    <p>مكتب تعليم <span contentEditable suppressContentEditableWarning>.........</span></p>
                    <p>مدرسة <span contentEditable suppressContentEditableWarning>.........</span></p>
                  </div>

                  {/* Center (Logo) */}
                  <div className="w-1/3 flex flex-col items-center">
                     <div className="w-16 h-16 mb-1 text-sm font-bold flex items-center justify-center text-green-700">شعار الوزارة</div>
                  </div>

                  {/* Right (Text) */}
                  <div className="w-1/3 flex justify-end">
                    <table className="border-collapse border border-black w-48 text-center text-[10px]">
                      <tbody>
                        <tr><td className="border border-black p-1 w-12 bg-gray-100">التاريخ</td><td className="border border-black p-1" contentEditable suppressContentEditableWarning></td></tr>
                        <tr><td className="border border-black p-1 w-12 bg-gray-100">المادة</td><td className="border border-black p-1" contentEditable suppressContentEditableWarning></td></tr>
                        <tr><td className="border border-black p-1 w-12 bg-gray-100">الصف</td><td className="border border-black p-1" contentEditable suppressContentEditableWarning></td></tr>
                        <tr><td className="border border-black p-1 w-12 bg-gray-100">الزمن</td><td className="border border-black p-1" contentEditable suppressContentEditableWarning></td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Student Info */}
                <div className="flex gap-4 border-t-2 border-black pt-2 mb-2 text-sm font-bold bg-gray-100 p-1">
                  <div className="flex-1 flex gap-2">
                    <span>اسم الطالب /</span>
                    <span className="flex-1 border-b border-dotted border-black bg-white" contentEditable suppressContentEditableWarning></span>
                  </div>
                  <div className="flex-1 flex gap-2">
                    <span>رقم الجلوس:</span>
                    <span className="flex-1 border-b border-dotted border-black bg-white text-center" contentEditable suppressContentEditableWarning>(                  )</span>
                  </div>
                </div>

                {/* Semester */}
                <div className="text-center border-t-2 border-b-2 border-black py-1 mb-2 text-sm font-bold">
                  اختبار الفصل الدراسي <span contentEditable suppressContentEditableWarning>الثاني</span> (الدور <span contentEditable suppressContentEditableWarning>الأول</span>) لعام <span contentEditable suppressContentEditableWarning>١٤٤٣</span> هـ
                </div>

                {/* Grades Table */}
                <table className="border-collapse border border-black w-full text-center text-xs font-bold mb-2">
                   <tbody>
                     <tr className="bg-gray-100">
                       <td className="border border-black p-1 w-16" rowSpan={2}>توقيعه</td>
                       <td className="border border-black p-1 w-24" rowSpan={2}>اسم المراجع</td>
                       <td className="border border-black p-1 w-24" rowSpan={2}>توقيع المصحح</td>
                       <td className="border border-black p-1 w-24" rowSpan={2}>اسم المصحح</td>
                       <td className="border border-black p-1 h-6"></td>
                       <td className="border border-black p-1" rowSpan={2}>الدرجة كتابة</td>
                       <td className="border border-black p-1 w-12 bg-white">40</td>
                       <td className="border border-black p-1 w-16" rowSpan={2}>الدرجة رقما</td>
                     </tr>
                     <tr className="bg-gray-100">
                       <td className="border border-black p-1 text-[10px]">درجة فقط</td>
                       <td className="border border-black p-1 bg-white"></td>
                     </tr>
                   </tbody>
                </table>

                {/* Instructions */}
                <div className="border-2 border-black p-1 text-center text-[11px] font-bold mb-2 flex">
                  <span className="flex-1">استعن بالله أولا ، ثم أجب على الأسئلة الآتية وتأكد من إجابتك على جميع الأسئلة قبل تسليم ورقة الإجابة</span>
                </div>

                {/* Questions Header */}
                <div className="flex items-center text-xs font-bold mb-2 underline bg-gray-50 border border-black p-1 relative">
                  السؤال الأول / أ- اختر الإجابة الصحيحة فيما يلي :-
                  <div className="absolute left-1 top-1 w-10 h-6 border-2 border-black bg-white rounded flex items-center justify-center shadow-[2px_2px_0px_#000]">
                    25
                  </div>
                </div>

                {/* Questions Grid */}
                <div className="space-y-[6px]">
                  {questions.slice(0, 10).map((q) => (
                    <table key={q} className="border-collapse border border-black w-full text-center text-[11px]">
                      <tbody>
                        <tr>
                          <td className="border border-black p-1 w-8 font-bold bg-gray-50">{q}</td>
                          <td className="border border-black p-0 w-8 font-bold bg-gray-50">أ</td>
                          <td className="border border-black p-1 w-1/4 cursor-text" contentEditable suppressContentEditableWarning></td>
                          <td className="border border-black p-0 w-8 font-bold bg-gray-50">ب</td>
                          <td className="border border-black p-1 w-1/4 cursor-text" contentEditable suppressContentEditableWarning></td>
                          <td className="border border-black p-0 w-8 font-bold bg-gray-50">ج</td>
                          <td className="border border-black p-1 w-1/4 cursor-text" contentEditable suppressContentEditableWarning></td>
                          <td className="border border-black p-0 w-8 font-bold bg-gray-50">د</td>
                          <td className="border border-black p-1 w-1/4 cursor-text" contentEditable suppressContentEditableWarning></td>
                        </tr>
                      </tbody>
                    </table>
                  ))}
                </div>

                <div className="flex justify-start mt-2 border border-black w-48 text-[10px] p-1 items-center font-bold">
                  <div className="w-4 h-4 border border-black ml-2 flex items-center justify-center">←</div>
                  تابع بقية الأسئلة خلف الورقة
                </div>
              </div>
            </div>
          )}

          {template === 'algerian_classic' && (
            <div className="font-serif border-[3px] border-black p-1">
              <div className="border border-black p-1 flex items-stretch mb-1 text-[11px] font-bold text-center">
                <div className="w-1/4 border-l border-black p-1 flex flex-col justify-center gap-2">
                   <div>وزارة التربية الوطنية</div>
                   <div>المستوى: <span className="border-b border-dotted border-black inline-block w-20" contentEditable suppressContentEditableWarning></span></div>
                </div>
                <div className="flex-1 p-1 flex flex-col justify-center items-center gap-1">
                   <div className="text-sm">الجمهورية الجزائرية الديمقراطية الشعبية</div>
                   <div>السنة الدراسية: <span className="border-b border-dotted border-black inline-block w-24" contentEditable suppressContentEditableWarning></span></div>
                   <div className="bg-gray-200 border border-black rounded px-2 py-1 w-[90%] mx-auto" contentEditable suppressContentEditableWarning>
                     الاختبار الثالث في مادة العلوم الفيزيائية والتكنولوجيا
                   </div>
                </div>
                <div className="w-1/4 border-r border-black p-1 flex flex-col justify-center text-right gap-2 pr-2">
                   <div>الزمن: <span contentEditable suppressContentEditableWarning>ساعة ونصف</span></div>
                   <div>التاريخ: <span contentEditable suppressContentEditableWarning>  /  / 202 م</span></div>
                </div>
              </div>

              <table className="border-collapse border border-black w-full text-xs font-bold text-center">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-black p-1 w-8">الجزء</th>
                    <th className="border border-black p-1">أجب / أجيبي عن جميع الأسئلة</th>
                    <th className="border border-black p-1 w-8">النقاط</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-black p-1 w-8 break-words align-middle" rowSpan={2}>
                      <div className="h-full flex items-center justify-center" style={{ writingMode: 'vertical-rl' }}>الجزء الأول</div>
                    </td>
                    <td className="border border-black p-2 text-right align-top min-h-[150px] relative">
                       <div className="absolute top-2 left-2 underline decoration-black decoration-2 underline-offset-4" contentEditable suppressContentEditableWarning>التمرين الأول:</div>
                       <div className="mt-8 min-h-[120px] focus:outline-none focus:bg-gray-50 rounded" contentEditable suppressContentEditableWarning></div>
                    </td>
                    <td className="border border-black p-1 w-8">
                       <div className="border-b border-black w-4 mx-auto mb-1">6</div>
                       <div></div>
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-black p-2 text-right align-top min-h-[150px] relative">
                       <div className="absolute top-2 left-2 underline decoration-black decoration-2 underline-offset-4" contentEditable suppressContentEditableWarning>التمرين الثاني:</div>
                       <div className="mt-8 min-h-[120px] focus:outline-none focus:bg-gray-50 rounded" contentEditable suppressContentEditableWarning></div>
                    </td>
                    <td className="border border-black p-1 w-8">
                       <div className="border-b border-black w-4 mx-auto mb-1">6</div>
                       <div></div>
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-black p-1 w-8 break-words align-middle">
                      <div className="h-full flex items-center justify-center" style={{ writingMode: 'vertical-rl' }}>الجزء الثاني</div>
                    </td>
                    <td className="border border-black p-2 text-right align-top min-h-[250px] relative">
                       <div className="absolute top-2 left-2 underline decoration-black decoration-2 underline-offset-4" contentEditable suppressContentEditableWarning>الوضعية الإدماجية:</div>
                       <div className="mt-8 min-h-[200px] focus:outline-none focus:bg-gray-50 rounded" contentEditable suppressContentEditableWarning></div>
                    </td>
                    <td className="border border-black p-1 w-8">
                       <div className="border-b border-black w-4 mx-auto mb-1">8</div>
                       <div></div>
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="border border-black text-center text-[10px] p-1 mt-1 bg-gray-50 font-bold" contentEditable suppressContentEditableWarning>
                 انتهت الأسئلة .... بالتوفيق والنجاح. مدرس المقرر / ....................................
              </div>
            </div>
          )}

          {template === 'saudi_vision' && (
            <div className="font-serif border-[3px] border-black p-2">
              <div className="border border-black mb-4 flex items-stretch text-xs font-bold text-center">
                <div className="w-[30%] border-l border-black p-1 flex flex-col justify-center">
                   <div>المملكة العربية السعودية</div>
                   <div>وزارة التعليم</div>
                   <div>إدارة تعليم <span contentEditable suppressContentEditableWarning>.........</span></div>
                   <div>مدرسة <span contentEditable suppressContentEditableWarning>.........</span></div>
                </div>
                <div className="flex-1 p-2 flex flex-col justify-center items-center">
                   <div className="text-base mb-1">بسم الله الرحمن الرحيم</div>
                   <div className="flex items-center justify-center mb-1">
                      <div className="text-teal-700 font-bold text-xl ml-2">رؤية</div>
                      <div className="text-teal-700 font-bold text-2xl tracking-widest">2030</div>
                      <div className="text-teal-700 font-bold text-lg ml-2">VISION</div>
                   </div>
                   <div className="text-[10px] text-teal-700">المملكة العربية السعودية</div>
                   <div className="text-[10px] text-teal-700">KINGDOM OF SAUDI ARABIA</div>
                </div>
                <div className="w-[35%] border-r border-black p-1 text-right flex flex-col justify-center gap-1 pr-2">
                   <div>المادة: <span contentEditable suppressContentEditableWarning>الدراسات الاجتماعية</span></div>
                   <div>الصف: <span contentEditable suppressContentEditableWarning>الرابع الابتدائي</span></div>
                   <div>الفصل الدراسي <span contentEditable suppressContentEditableWarning>الأول 1445 هـ</span></div>
                   <div>إختبار <span contentEditable suppressContentEditableWarning>منتصف الفصل (الفترة)</span></div>
                </div>
              </div>

              <div className="flex items-center justify-between font-bold mb-4">
                 <div>اسم الطالب: <span className="border-b border-dotted border-black inline-block w-48" contentEditable suppressContentEditableWarning></span></div>
                 <div className="border border-black w-20 flex flex-col items-center justify-center">
                    <div className="border-b border-black w-full text-center text-xs h-6"></div>
                    <div className="font-bold h-6 flex items-center justify-center" contentEditable suppressContentEditableWarning>20</div>
                 </div>
              </div>

              <div className="mb-4">
                 <div className="font-bold text-sm mb-2" contentEditable suppressContentEditableWarning>
                   السؤال الأول: ضع علامة (✓) أمام العبارة الصحيحة وعلامة (X) أمام العبارة الخاطئة:
                 </div>
                 <table className="border-collapse border border-black w-full text-sm text-right">
                    <tbody>
                      {questions.slice(0, 10).map((q) => (
                        <tr key={`t1-${q}`}>
                          <td className="border border-black p-1 w-6 text-center font-bold bg-gray-50">{q}</td>
                          <td className="border border-black p-1 cursor-text" contentEditable suppressContentEditableWarning>اكتب العبارة هنا...</td>
                          <td className="border border-black p-1 w-12 text-center" contentEditable suppressContentEditableWarning>(   )</td>
                        </tr>
                      ))}
                    </tbody>
                 </table>
              </div>

              <div className="mb-4">
                 <div className="font-bold text-sm mb-2" contentEditable suppressContentEditableWarning>
                   السؤال الثاني: ضع الكلمات التالية في الفراغات المناسبة:
                 </div>
                 <div className="text-center font-bold text-sm mb-4 cursor-text" contentEditable suppressContentEditableWarning>
                   ( العلم )  ( 22 فبراير )  ( الملك سلمان )  ( ملكي )  ( توحيد البلاد )
                 </div>
                 <table className="border-collapse border border-black w-full text-sm text-right">
                    <tbody>
                      {[1, 2, 3, 4, 5].map((q) => (
                        <tr key={`t2-${q}`}>
                          <td className="border border-black p-1 w-6 text-center font-bold bg-gray-50">{q}</td>
                          <td className="border border-black p-1 cursor-text" contentEditable suppressContentEditableWarning>........................................</td>
                        </tr>
                      ))}
                    </tbody>
                 </table>
              </div>

              <div className="mb-4">
                 <div className="font-bold text-sm mb-2" contentEditable suppressContentEditableWarning>
                   السؤال الثالث: اختر من المجموعة (أ) ما يناسبها في المجموعة (ب) مستعينا "بالأرقام"
                 </div>
                 <table className="border-collapse border border-black w-full text-sm text-center">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-black p-1 w-6"></th>
                        <th className="border border-black p-1">المجموعة (أ)</th>
                        <th className="border border-black p-1 w-16">الرقم</th>
                        <th className="border border-black p-1">المجموعة (ب)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[1, 2, 3, 4, 5].map((q) => (
                        <tr key={`t3-${q}`}>
                          <td className="border border-black p-1 font-bold bg-gray-50">{q}</td>
                          <td className="border border-black p-1 text-right cursor-text" contentEditable suppressContentEditableWarning>....................</td>
                          <td className="border border-black p-1" contentEditable suppressContentEditableWarning>(   )</td>
                          <td className="border border-black p-1 text-right cursor-text" contentEditable suppressContentEditableWarning>....................</td>
                        </tr>
                      ))}
                    </tbody>
                 </table>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
