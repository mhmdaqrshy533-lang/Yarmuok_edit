import { ArrowRight, Printer, LayoutTemplate, FilePlus2, CloudDownload, Moon, Sun, Wand2, Save, BarChart3 } from 'lucide-react';
import { ViewState } from '../types';
import { useState, useRef, useEffect } from 'react';
import { useReactToPrint } from 'react-to-print';
import { useStore } from '../store';

interface ExamEditorProps {
  setView: (view: ViewState) => void;
}

export default function ExamEditor({ setView }: ExamEditorProps) {
  const { settings } = useStore();
  const [template, setTemplate] = useState<'classic' | 'bubble' | 'saudi_classic' | 'saudi_bubble' | 'algerian_classic' | 'saudi_vision' | 'yemen_sovereign'>('yemen_sovereign');
  const componentRef = useRef<HTMLDivElement>(null);
  const [questions, setQuestions] = useState<number[]>(Array.from({length: 20}, (_, i) => i + 1));
  const [lockerOpen, setLockerOpen] = useState(false);
  const [points, setPoints] = useState(1250);
  const [documentSize, setDocumentSize] = useState<'A4' | 'Ledger' | 'Custom'>('A4');

  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showSetupDialog, setShowSetupDialog] = useState(true);
  const [examConfig, setExamConfig] = useState({
    subject: '',
    academicYear: '2025/2026',
    duration: 'ساعتان',
    schoolName: settings.schoolName || 'مدرسة اليرموك',
    logo: null as string | null
  });
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [newQuestion, setNewQuestion] = useState({ text: '', type: 'اختياري', points: '1' });
  const isScience = ['الرياضيات', 'الفيزياء', 'رياضيات', 'فيزياء', 'math', 'physics'].includes(examConfig.subject);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: 'نموذج_اختبار',
  });

  const [lastSaved, setLastSaved] = useState<Date | null>(new Date());

  // Auto-Save feature
  // (In a real app, this would use a debounced effect listening to exam content changes)
  
  const addQuestion = () => {
    setQuestions([...questions, questions.length + 1]);
    setPoints(p => p + 50);
    setLastSaved(new Date());
  };
  const [zoom, setZoom] = useState(1);

  return (
    <div className={`flex flex-col h-full relative ${theme === 'dark' ? 'bg-black text-gray-200' : 'bg-gray-50 text-gray-900'} transition-colors duration-300`}>
      {/* Top Bar - Sovereign Yemeni Identity */}
      <div className={`transition-all duration-300 ${theme === 'dark' ? 'bg-black/90 backdrop-blur-xl border-b-2 border-red-600' : 'bg-white/90 backdrop-blur-xl border-b-2 border-red-600'} flex items-center justify-between p-4 shadow-[0_4px_30px_rgba(220,38,38,0.15)] z-20 sticky top-0 print:hidden`}>
        <button onClick={() => setView('home')} className={`p-2 rounded-xl transition-colors group ${theme === 'dark' ? 'hover:bg-white/10 text-gray-200' : 'hover:bg-gray-100 text-gray-800'}`}>
          <ArrowRight className="w-5 h-5 group-hover:text-red-500 transition-colors" />
        </button>
        <div className="text-center flex-1 flex items-center justify-center gap-3">
          <div className="flex gap-1">
             <div className="w-3 h-3 rounded-full bg-red-600"></div>
             <div className="w-3 h-3 rounded-full bg-white border border-gray-300"></div>
             <div className="w-3 h-3 rounded-full bg-black"></div>
          </div>
          <h1 className={`font-black text-xl tracking-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            نظام يرموك السيادي <span className="text-[#39ff14] drop-shadow-[0_0_8px_rgba(57,255,20,0.8)] font-normal text-sm ml-2 hidden sm:inline-block">محرر الاختبارات الذكي</span>
          </h1>
          {/* Gamification Points Badge */}
          <div className={`hidden sm:flex items-center gap-1 px-3 py-1 rounded-full border ${theme === 'dark' ? 'bg-black/50 border-yellow-500/30' : 'bg-yellow-50 border-yellow-200'} cursor-pointer hover:scale-105 transition-transform`} title="نقاط الدوبامين لإنجازاتك">
            <span className="text-yellow-500 font-black text-sm">{points}</span>
            <span className="text-xs font-bold text-gray-500">نقطة</span>
            <span className="text-yellow-400">🏆</span>
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <button onClick={() => setShowAnalytics(true)} className={`flex items-center gap-2 ${theme === 'dark' ? 'bg-purple-900/30 border-purple-500/30 text-purple-400 hover:text-white' : 'bg-purple-100 border-purple-200 text-purple-600 hover:bg-purple-200'} font-bold px-3 py-2 rounded-xl border transition-colors`} title="لوحة تحليل أداء الطلاب">
            <BarChart3 className="w-5 h-5"/>
            <span className="hidden md:inline">التحليلات الذكية</span>
          </button>
          <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className={`p-2 rounded-xl transition-colors ${theme === 'dark' ? 'text-yellow-400 hover:bg-white/10' : 'text-gray-800 hover:bg-gray-100'}`}>
             {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button onClick={() => setLockerOpen(!lockerOpen)} className={`flex items-center gap-2 ${theme === 'dark' ? 'bg-blue-900/30 border-blue-500/30 text-blue-400 hover:text-white' : 'bg-blue-100 border-blue-200 text-blue-600 hover:bg-blue-200'} font-bold px-3 py-2 rounded-xl border transition-colors`} title="خزانة الموارد التشاركية">
            <CloudDownload className="w-5 h-5"/>
            <span className="hidden md:inline">الخزانة التشاركية</span>
          </button>
          <button onClick={() => handlePrint()} className={`p-2 rounded-xl transition-colors group ${theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}>
            <Printer className={`w-5 h-5 ${theme === 'dark' ? 'text-cyan-400 group-hover:text-purple-400' : 'text-cyan-600 group-hover:text-purple-600'}`} />
          </button>
        </div>
      </div>

      {/* Setup Dialog */}
      {showAnalytics && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center print:hidden" dir="rtl">
          <div className={`w-full max-w-2xl ${theme === 'dark' ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-200 text-black'} border rounded-2xl shadow-2xl p-6 transform transition-all scale-100 m-4`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-purple-500" />
                تحليل أداء الطلاب (مدعوم بالذكاء الاصطناعي)
              </h2>
              <button onClick={() => setShowAnalytics(false)} className="text-gray-500 hover:text-red-500 transition-colors">
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mb-6">
               <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'} text-center`}>
                  <div className="text-3xl font-black text-green-500 mb-1">85%</div>
                  <div className="text-sm font-bold text-gray-500">متوسط درجات الفصل</div>
               </div>
               <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'} text-center`}>
                  <div className="text-3xl font-black text-yellow-500 mb-1">السؤال 3</div>
                  <div className="text-sm font-bold text-gray-500">الأكثر صعوبة للاستيعاب</div>
               </div>
               <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'} text-center`}>
                  <div className="text-3xl font-black text-blue-500 mb-1">+12%</div>
                  <div className="text-sm font-bold text-gray-500">تحسن الأداء هذا الشهر</div>
               </div>
            </div>

            <div className={`w-full h-48 rounded-xl border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'} flex items-end justify-between p-4 px-8`}>
               {/* Mock Bar Chart */}
               {[60, 40, 80, 50, 90, 70, 85].map((h, i) => (
                 <div key={i} className="w-8 bg-gradient-to-t from-purple-600 to-cyan-500 rounded-t-sm" style={{ height: `${h}%` }}></div>
               ))}
            </div>
            <div className="flex justify-between px-8 mt-2 text-xs font-bold text-gray-500">
               <span>الوحدة 1</span><span>الوحدة 2</span><span>الوحدة 3</span><span>الوحدة 4</span><span>الوحدة 5</span><span>الوحدة 6</span><span>الوحدة 7</span>
            </div>
            
            <div className="mt-6 p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
               <h3 className="font-bold text-purple-400 mb-2 flex items-center gap-2"><Wand2 className="w-4 h-4"/> توصية النظام:</h3>
               <p className="text-sm leading-relaxed">بناءً على نتائج الطلاب الأخيرة، يُنصح بتضمين المزيد من الأسئلة الاستنتاجية في مادة {examConfig.subject} وتخفيف أسئلة الحفظ المباشر.</p>
            </div>
          </div>
        </div>
      )}

      {/* Setup Dialog */}
      {showSetupDialog && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center print:hidden" dir="rtl">
          <div className={`w-full max-w-md ${theme === 'dark' ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-200 text-black'} border rounded-2xl shadow-2xl p-6 transform transition-all scale-100 m-4`}>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-black mb-1 flex items-center justify-center gap-2">
                <Wand2 className="w-6 h-6 text-green-500" />
                تهيئة الاختبار
              </h2>
              <p className="text-sm opacity-70">الاقتصاد المعرفي: نجهز لك القالب المثالي</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-1">اسم المدرسة</label>
                <select 
                  className={`w-full p-3 rounded-xl border ${theme === 'dark' ? 'bg-black/50 border-gray-700 text-white' : 'bg-gray-50 border-gray-300 text-black'} focus:outline-none focus:border-green-500 transition-colors`}
                  value={examConfig.schoolName}
                  onChange={e => setExamConfig({...examConfig, schoolName: e.target.value})}
                >
                  <option value="مدرسة اليرموك">مدرسة اليرموك</option>
                  <option value="مدرسة أبي ذر الغفاري">مدرسة أبي ذر الغفاري</option>
                  <option value="مدرسة بلقيس">مدرسة بلقيس</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">المادة</label>
                <input 
                  type="text" 
                  placeholder="مثال: الرياضيات، الفيزياء، لغة عربية"
                  className={`w-full p-3 rounded-xl border ${theme === 'dark' ? 'bg-black/50 border-gray-700 text-white' : 'bg-gray-50 border-gray-300 text-black'} focus:outline-none focus:border-green-500 transition-colors`}
                  value={examConfig.subject}
                  onChange={e => setExamConfig({...examConfig, subject: e.target.value})}
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-bold mb-1">العام الدراسي</label>
                  <input type="text" className={`w-full p-3 rounded-xl border ${theme === 'dark' ? 'bg-black/50 border-gray-700 text-white' : 'bg-gray-50 border-gray-300 text-black'} focus:outline-none`} value={examConfig.academicYear} onChange={e => setExamConfig({...examConfig, academicYear: e.target.value})} />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-bold mb-1">الزمن</label>
                  <input type="text" className={`w-full p-3 rounded-xl border ${theme === 'dark' ? 'bg-black/50 border-gray-700 text-white' : 'bg-gray-50 border-gray-300 text-black'} focus:outline-none`} value={examConfig.duration} onChange={e => setExamConfig({...examConfig, duration: e.target.value})} />
                </div>
              </div>
              <div>
                 <label className="block text-sm font-bold mb-1">شعار المدرسة</label>
                 <div className={`w-full p-4 border-2 border-dashed rounded-xl text-center cursor-pointer ${theme === 'dark' ? 'border-gray-600 hover:border-green-500 hover:bg-gray-800' : 'border-gray-300 hover:border-green-500 hover:bg-gray-50'} transition-all`}>
                    <span className="text-sm">انقر لرفع الشعار من الهاتف</span>
                 </div>
              </div>
            </div>
            
            <button 
              onClick={() => setShowSetupDialog(false)}
              className="w-full mt-6 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white font-black text-lg py-3 rounded-xl shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
              بدء التحضير 🚀
            </button>
          </div>
        </div>
      )}

      {/* Context-Aware Toolbar */}
      {!showSetupDialog && (
        <div className={`border-b ${theme === 'dark' ? 'border-emerald-500/30 bg-[#0f291e] text-emerald-50' : 'border-emerald-200 bg-emerald-50 text-emerald-900'} flex flex-wrap items-center justify-center gap-2 px-4 py-2 print:hidden shadow-sm`} dir="rtl">
           <span className={`text-xs font-bold flex items-center gap-1 ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-700'}`}>
             <Wand2 className="w-3 h-3"/> رموز علمية متطورة:
           </span>
           
           <div className="flex flex-wrap gap-2 items-center">
             <button className={`px-3 py-1.5 flex items-center gap-1 rounded shadow-sm text-xs font-bold transition-all active:scale-95 ${theme === 'dark' ? 'bg-[#1a2320] border border-emerald-900 hover:border-emerald-500 hover:text-emerald-400' : 'bg-white border border-emerald-200 hover:border-emerald-500 hover:text-emerald-700'}`}>
               معادلات رياضيات
             </button>
             <button className={`px-3 py-1.5 flex items-center gap-1 rounded shadow-sm text-xs font-bold transition-all active:scale-95 ${theme === 'dark' ? 'bg-[#1a2320] border border-emerald-900 hover:border-emerald-500 hover:text-emerald-400' : 'bg-white border border-emerald-200 hover:border-emerald-500 hover:text-emerald-700'}`}>
               معادلات كيميائية
             </button>
             <button className={`px-3 py-1.5 flex items-center gap-1 rounded shadow-sm text-xs font-bold transition-all active:scale-95 ${theme === 'dark' ? 'bg-[#1a2320] border border-emerald-900 hover:border-emerald-500 hover:text-emerald-400' : 'bg-white border border-emerald-200 hover:border-emerald-500 hover:text-emerald-700'}`}>
               نص جديد
             </button>
           </div>
           
           <div className={`h-6 w-px mx-1 ${theme === 'dark' ? 'bg-emerald-900' : 'bg-emerald-200'}`}></div>
           
           <div className="flex flex-wrap gap-1 items-center">
             {['كسر', 'جذور', 'الأسس', 'لوغاريتم', 'النهايات', 'تكامل', 'مقياس', 'تباديل', 'توافيق', 'مجموع'].map(tool => (
               <button key={tool} className={`px-2 py-1 rounded shadow-sm text-[10px] font-bold transition-all active:scale-95 ${theme === 'dark' ? 'bg-black border border-emerald-900/50 hover:border-emerald-500 hover:bg-emerald-900/20 text-emerald-100' : 'bg-white border border-emerald-200 hover:border-emerald-500 hover:bg-emerald-50 text-emerald-800'}`}>
                 {tool}
               </button>
             ))}
           </div>
        </div>
      )}

      {/* Shortcuts Toolbar */}
      {!showSetupDialog && (
        <div className={`border-b ${theme === 'dark' ? 'border-purple-500/30 bg-[#121619]' : 'border-purple-200 bg-white'} overflow-x-auto whitespace-nowrap flex items-center gap-2 px-4 py-2 print:hidden`} dir="rtl">
           <span className={`text-xs font-bold flex items-center gap-1 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-700'} shrink-0`}>
             <LayoutTemplate className="w-3 h-3"/> اختصارات (نموذج أسئلة):
           </span>
           
           <div className="flex gap-1 items-center">
             {[
               'اكتب من أول سورة (  ) الى قوله تعالى (  ).',
               'اكمل من قوله تعالى (  ) إلى قوله تعالى (  ).',
               'اذكر معاني الكلمات الاتيه :-',
               'اذكر سبب نزول قوله تعالى (   )',
               'اشرح بإيجاز قوله تعالى (   ) .',
               'ضع علامة ( ✓ ) أمام العبارة الصحيحة وعلامة ( X ) امام العبارة الخاطئة في ما ياتي :-',
               'اختر الاجابة الصحيحة من بين الاقواس :-',
               'اكمل الفراغ بالكلمة المناسبة في كلٍ مما ياتي :-',
               'عرف كلاً مما يلي :-'
             ].map((shortcut, idx) => (
               <button key={idx} title={shortcut} className={`px-3 py-1.5 rounded shadow-sm text-xs font-bold transition-all active:scale-95 shrink-0 ${theme === 'dark' ? 'bg-[#1a2320] border border-purple-900 hover:border-purple-500 hover:text-purple-400 text-gray-300' : 'bg-gray-50 border border-purple-200 hover:border-purple-500 hover:text-purple-700 text-gray-700'}`}>
                 {shortcut.substring(0, 25)}...
               </button>
             ))}
           </div>
        </div>
      )}

      {/* Toolbar */}
      <div className={`${theme === 'dark' ? 'bg-gray-900/60 border-purple-500/20 text-gray-300' : 'bg-white/60 border-purple-200 text-gray-700'} backdrop-blur-md border-b flex flex-wrap items-center justify-center gap-4 px-4 py-3 text-sm print:hidden shadow-lg relative`} dir="rtl">
        
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
            className={`${theme === 'dark' ? 'bg-black/50 border-purple-500/30 text-white focus:border-cyan-500/50 hover:bg-purple-900/40' : 'bg-gray-100 border-purple-300 text-black focus:border-purple-500 hover:bg-gray-200'} border rounded-xl px-4 py-2 font-bold focus:outline-none appearance-none transition-colors`}
          >
            <option value="yemen_sovereign">الجمهورية اليمنية (سيادي)</option>
            <option value="classic">كلاسيكي (أساسي)</option>
            <option value="bubble">بابل شيت (أساسي)</option>
            <option value="saudi_classic">السعودية (مقالي)</option>
            <option value="saudi_bubble">السعودية (بابل شيت)</option>
            <option value="saudi_vision">السعودية (رؤية 2030)</option>
            <option value="algerian_classic">الجزائر (تمارين)</option>
          </select>
        </div>
        
        {/* Document Size Selector */}
        <div className={`h-6 w-px mx-2 hidden md:block ${theme === 'dark' ? 'bg-purple-500/30' : 'bg-purple-200'}`}></div>
        <div className="flex items-center gap-2">
          <span className="font-bold">حجم الورقة:</span>
          <select 
            value={documentSize} 
            onChange={e => setDocumentSize(e.target.value as any)}
            className={`${theme === 'dark' ? 'bg-black/50 border-purple-500/30 text-white focus:border-cyan-500/50 hover:bg-purple-900/40' : 'bg-gray-100 border-purple-300 text-black focus:border-purple-500 hover:bg-gray-200'} border rounded-xl px-4 py-1 text-sm font-bold focus:outline-none appearance-none transition-colors`}
          >
            <option value="A4">A4</option>
            <option value="Ledger">Ledger (A3)</option>
            <option value="Custom">مخصص</option>
          </select>
        </div>
        
        {/* Auto Backup Indicator */}
        <div className={`h-6 w-px mx-2 hidden md:block ${theme === 'dark' ? 'bg-purple-500/30' : 'bg-purple-200'}`}></div>
        <div className={`flex items-center gap-1 px-3 py-1 rounded-full ${theme === 'dark' ? 'bg-green-900/20 text-green-400' : 'bg-green-50 text-green-600'} text-xs font-bold`}>
           <Save className="w-3 h-3" />
           تم الحفظ {lastSaved?.toLocaleTimeString('ar-SA')}
        </div>

        <div className={`h-6 w-px mx-2 hidden md:block ${theme === 'dark' ? 'bg-purple-500/30' : 'bg-purple-200'}`}></div>
        <div className={`flex items-center gap-2 border rounded-xl p-1 ${theme === 'dark' ? 'bg-black/50 border-purple-500/30' : 'bg-gray-100 border-purple-200'}`}>
          <button onClick={() => setZoom(z => Math.max(0.5, z - 0.1))} className={`p-1 rounded-lg font-bold ${theme === 'dark' ? 'hover:bg-purple-900/40 text-purple-400 hover:text-cyan-400' : 'hover:bg-gray-200 text-purple-600 hover:text-cyan-600'}`}>-</button>
          <span className={`text-xs font-mono w-12 text-center ${theme === 'dark' ? 'text-cyan-300' : 'text-cyan-700'}`}>{Math.round(zoom * 100)}%</span>
          <button onClick={() => setZoom(z => Math.min(2, z + 0.1))} className={`p-1 rounded-lg font-bold ${theme === 'dark' ? 'hover:bg-purple-900/40 text-purple-400 hover:text-cyan-400' : 'hover:bg-gray-200 text-purple-600 hover:text-cyan-600'}`}>+</button>
        </div>
      </div>

      <div className={`flex-1 overflow-auto p-4 md:p-8 print:p-0 print:overflow-visible flex justify-center items-start ${theme === 'dark' ? '' : 'bg-gray-100'}`}>
        <div 
          ref={componentRef} 
          style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
          className={`bg-white text-black ${documentSize === 'A4' ? 'w-[210mm] min-h-[297mm]' : documentSize === 'Ledger' ? 'w-[279mm] min-h-[432mm]' : 'w-[250mm] min-h-[350mm]'} shadow-[0_0_40px_rgba(147,51,234,0.15)] relative p-8 print:p-0 print:shadow-none print:w-full mx-auto print:transform-none transition-all duration-300`}
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
                    <span className="flex-1 border-b border-dotted border-black" contentEditable suppressContentEditableWarning>{examConfig.subject}</span>
                  </div>
                  <div className="flex gap-2">
                    <span>الصف:</span>
                    <span className="flex-1 border-b border-dotted border-black" contentEditable suppressContentEditableWarning></span>
                  </div>
                  <div className="flex gap-2">
                    <span>الزمن:</span>
                    <span className="flex-1 border-b border-dotted border-black" contentEditable suppressContentEditableWarning>{examConfig.duration}</span>
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
                    <span className="flex-1 border-r border-gray-400 pr-1" contentEditable suppressContentEditableWarning>{examConfig.subject}</span>
                  </div>
                  <div className="flex w-3/4 bg-gray-200 rounded p-1 border border-gray-300">
                    <span className="w-12 text-xs">الصف:</span>
                    <span className="flex-1 border-r border-gray-400 pr-1" contentEditable suppressContentEditableWarning></span>
                  </div>
                  <div className="flex w-3/4 bg-gray-200 rounded p-1 border border-gray-300">
                    <span className="w-12 text-xs">الزمن:</span>
                    <span className="flex-1 border-r border-gray-400 pr-1" contentEditable suppressContentEditableWarning>{examConfig.duration}</span>
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
                أسئلة اختبار الفصل الدراسي <span className="border-b border-dotted border-black inline-block w-24" contentEditable suppressContentEditableWarning></span> (الدور <span className="border-b border-dotted border-black inline-block w-16" contentEditable suppressContentEditableWarning></span>) للعام الدراسي <span className="border-b border-dotted border-black inline-block w-24" contentEditable suppressContentEditableWarning>{examConfig.academicYear}</span>
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

          {template === 'yemen_sovereign' && (
            <div className="font-serif border-[4px] border-[#10b981] p-4 relative bg-white text-black min-h-[1000px]">
              {/* Watermark */}
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.05] pointer-events-none z-0">
                <div className="text-[200px] font-black text-emerald-800 -rotate-45">ΣIGMA</div>
              </div>
              
              <div className="flex justify-between items-center mb-6 relative z-10 border-b-4 border-double border-emerald-600 pb-4">
                <div className="text-right font-bold w-1/3 text-sm">
                  <p>الجمهورية اليمنية</p>
                  <p>وزارة التربية والتعليم</p>
                  <p>مكتب التربية والتعليم م/............</p>
                  <p>مدرسة: <span contentEditable suppressContentEditableWarning className="text-emerald-700">{examConfig.school}</span></p>
                </div>
                
                <div className="w-1/3 flex flex-col items-center justify-center">
                  <div className="w-20 h-20 mb-2 border-4 border-emerald-600 rounded-full flex items-center justify-center bg-emerald-50">
                    <span className="text-4xl font-serif text-emerald-600 font-bold">Σ</span>
                  </div>
                  <div className="font-bold text-center bg-gray-100 px-4 py-1 border-2 border-emerald-800 rounded-lg shadow-sm">
                    اختبار <span contentEditable suppressContentEditableWarning>نهاية الفصل الأول</span>
                  </div>
                </div>
                
                <div className="text-right font-bold w-1/3 text-sm pr-4 flex flex-col items-end gap-1">
                  <div className="w-full flex">
                    <span className="w-16 text-emerald-800">المادة:</span>
                    <span className="flex-1 border-b-2 border-dotted border-emerald-800" contentEditable suppressContentEditableWarning>{examConfig.subject}</span>
                  </div>
                  <div className="w-full flex">
                    <span className="w-16 text-emerald-800">الصف:</span>
                    <span className="flex-1 border-b-2 border-dotted border-emerald-800" contentEditable suppressContentEditableWarning>....................</span>
                  </div>
                  <div className="w-full flex">
                    <span className="w-16 text-emerald-800">الزمن:</span>
                    <span className="flex-1 border-b-2 border-dotted border-emerald-800" contentEditable suppressContentEditableWarning>{examConfig.duration}</span>
                  </div>
                  <div className="w-full flex">
                    <span className="w-16 text-emerald-800">العام:</span>
                    <span className="flex-1 border-b-2 border-dotted border-emerald-800" contentEditable suppressContentEditableWarning>{examConfig.year}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mb-6 relative z-10">
                <div className="flex-1 border-2 border-emerald-800 rounded-xl p-2 bg-emerald-50/50 flex items-center gap-2 font-bold shadow-sm">
                  <span className="text-emerald-900">اسم الطالب الرباعي:</span>
                  <span className="flex-1 border-b-2 border-emerald-800 inline-block h-6" contentEditable suppressContentEditableWarning></span>
                </div>
                <div className="w-48 border-2 border-emerald-800 rounded-xl p-2 bg-emerald-50/50 flex items-center gap-2 font-bold shadow-sm">
                  <span className="text-emerald-900">رقم الجلوس:</span>
                  <span className="flex-1 border-b-2 border-emerald-800 inline-block h-6 text-center" contentEditable suppressContentEditableWarning></span>
                </div>
              </div>

              <div className="relative z-10 w-full mb-6">
                <table className="border-collapse border-2 border-emerald-800 w-full text-center text-sm font-bold shadow-sm">
                  <thead>
                    <tr className="bg-emerald-100 text-emerald-900">
                      <th className="border-2 border-emerald-800 py-2 w-1/4">الدرجة رقماً</th>
                      <th className="border-2 border-emerald-800 py-2 w-1/4">الدرجة كتابةً</th>
                      <th className="border-2 border-emerald-800 py-2 w-1/4">توقيع المصحح</th>
                      <th className="border-2 border-emerald-800 py-2 w-1/4">توقيع المراجع</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border-2 border-emerald-800 h-12 bg-white" contentEditable suppressContentEditableWarning></td>
                      <td className="border-2 border-emerald-800 h-12 bg-white" contentEditable suppressContentEditableWarning></td>
                      <td className="border-2 border-emerald-800 h-12 bg-white" contentEditable suppressContentEditableWarning></td>
                      <td className="border-2 border-emerald-800 h-12 bg-white" contentEditable suppressContentEditableWarning></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="relative z-10 text-right font-bold text-sm mb-4 text-emerald-900 bg-emerald-50 inline-block px-4 py-1 rounded-full border border-emerald-200">
                أجب مستعيناً بالله عن جميع الأسئلة الآتية:
              </div>

              <div className="relative z-10 border-2 border-emerald-200 mt-2 min-h-[400px] p-4 text-right rounded-xl focus:outline-none focus:bg-emerald-50/20 focus:border-emerald-500 transition-colors" contentEditable suppressContentEditableWarning>
                 السؤال الأول: ...
              </div>

              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center text-xs font-bold text-emerald-800 z-10">
                <div className="border-t-2 border-emerald-800 pt-1 w-48 text-center" contentEditable suppressContentEditableWarning>توقيع معلم المادة</div>
                <div className="border-t-2 border-emerald-800 pt-1 w-48 text-center flex items-center justify-center gap-1" contentEditable suppressContentEditableWarning>الختم الرقمي <div className="w-8 h-8 rounded-full border-2 border-emerald-500 text-emerald-500 flex items-center justify-center text-[8px] rotate-12 opacity-80 shadow-sm bg-white">معتمد</div></div>
                <div className="border-t-2 border-emerald-800 pt-1 w-48 text-center" contentEditable suppressContentEditableWarning>توقيع مدير المدرسة</div>
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
      
      {/* Quick Add Question */}
      {showAddQuestion && (
        <div className="fixed bottom-24 right-8 z-50 w-80 bg-gray-900 border border-green-500/40 rounded-2xl shadow-2xl p-4 text-white print:hidden transform transition-all" dir="rtl">
           <h3 className="font-bold text-green-400 mb-3 border-b border-gray-700 pb-2">مسرع إضافة سؤال</h3>
           <textarea 
             placeholder="نص السؤال (توقع ذكي مفعل)..." 
             className="w-full bg-black/50 border border-gray-700 rounded-xl p-3 text-sm focus:outline-none focus:border-green-500 mb-3 min-h-[80px] text-white"
             value={newQuestion.text}
             onChange={e => setNewQuestion({...newQuestion, text: e.target.value})}
           ></textarea>
           <div className="flex gap-2 mb-4">
              <select className="flex-1 bg-black/50 border border-gray-700 rounded-xl p-2 text-sm focus:outline-none text-white" value={newQuestion.type} onChange={e => setNewQuestion({...newQuestion, type: e.target.value})}>
                 <option>اختياري</option>
                 <option>مقالي</option>
                 <option>صح وخطأ</option>
              </select>
              <input type="number" className="w-20 bg-black/50 border border-gray-700 rounded-xl p-2 text-sm focus:outline-none text-center text-white" placeholder="النقاط" value={newQuestion.points} onChange={e => setNewQuestion({...newQuestion, points: e.target.value})}/>
           </div>
           <div className="flex gap-2">
             <button onClick={() => { addQuestion(); setShowAddQuestion(false); setNewQuestion({text:'', type:'اختياري', points:'1'}); }} className="flex-1 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white font-bold py-2 rounded-xl text-sm transition-colors active:scale-95">إدراج فوراً</button>
             <button onClick={() => setShowAddQuestion(false)} className="px-4 bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 rounded-xl text-sm transition-colors active:scale-95">إلغاء</button>
           </div>
        </div>
      )}
      
      {/* FAB */}
      {!showSetupDialog && (
        <button onClick={() => setShowAddQuestion(true)} className="fixed bottom-8 right-8 z-40 bg-gradient-to-r from-green-600 to-green-500 text-white w-14 h-14 rounded-full shadow-[0_4px_20px_rgba(34,197,94,0.4)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all print:hidden" title="إضافة سؤال سريع">
           <FilePlus2 className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}
