import { 
  FileSpreadsheet, 
  Cpu, 
  FileText, 
  GraduationCap, 
  ClipboardCheck, 
  UserPen, 
  Award, 
  ShieldCheck, 
  LineChart, 
  Users, 
  Calculator, 
  Book, 
  ScrollText, 
  Settings,
  Info,
  CalendarDays,
  MoreVertical,
  Eye,
  Sigma
} from 'lucide-react';
import { ViewState } from '../types';
import { useStore } from '../store';
import { useState } from 'react';

interface HomeProps {
  setView: (view: ViewState) => void;
}

const modules = [
  { title: 'أرقام الجلوس', subtitle: 'إدارة وعرض أرقام الجلوس', icon: ShieldCheck, view: 'card_view' as ViewState },
  { title: 'بطاقات التقدم', subtitle: 'عرض وطباعة بطاقات التقدم', icon: ClipboardCheck, view: 'progress_dashboard' as ViewState },
  { title: 'كشوفات التقدم', subtitle: 'استعراض الكشوفات والتقارير', icon: LineChart, view: 'monthly_results' as ViewState },
  { title: 'تعبئة بيانات الطلاب', subtitle: 'إدخال وتعديل بيانات الطلاب', icon: UserPen, view: 'student_list' as ViewState },
  { title: 'الشهادات النهائية', subtitle: 'إصدار شهادات النجاح النهائية', icon: Award, view: 'certificate' as ViewState },
  { title: 'المحاسب المدرسي', subtitle: 'إدارة الرسوم والحسابات', icon: Calculator, view: 'accounting' as ViewState },
  { title: 'محرر الاختبارات', subtitle: 'تصميم وطباعة نماذج الاختبارات', icon: Book, view: 'exam_editor' as ViewState },
  { title: 'محرر الوثائق', subtitle: 'إنشاء الخطابات والنماذج الرسمية', icon: ScrollText, view: 'doc_editor' as ViewState },
];

export default function Home({ setView }: HomeProps) {
  const { settings, students } = useStore();
  const [showAbout, setShowAbout] = useState(false);

  return (
    <div className="flex flex-col h-full bg-[#121619] overflow-y-auto text-white font-sans selection:bg-emerald-500/30">
      
      {/* Top Header Panel */}
      <div className="bg-[#0f291e] border-b border-emerald-900/50 rounded-b-3xl p-6 shadow-[0_10px_30px_-15px_rgba(16,185,129,0.3)] relative z-10 flex justify-between items-center">
        <div className="flex flex-col">
          <h1 className="text-xl md:text-2xl font-black text-white mb-1 tracking-tight flex items-center gap-2">
            محفظة الإنجاز الشاملة: ΣIGMA
          </h1>
          <h2 className="text-sm md:text-base font-medium text-emerald-300/80">لوحة التحكم للإدارة والمتابعة</h2>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <button onClick={() => setShowAbout(true)} className="p-2 hover:bg-emerald-800/40 rounded-full transition-colors">
              <Eye className="w-5 h-5 text-emerald-400" />
            </button>
            <button onClick={() => setView('settings')} className="p-2 hover:bg-emerald-800/40 rounded-full transition-colors">
              <Settings className="w-5 h-5 text-emerald-400" />
            </button>
            <button className="p-2 hover:bg-emerald-800/40 rounded-full transition-colors">
              <MoreVertical className="w-5 h-5 text-emerald-400" />
            </button>
          </div>
          
          {/* Logo Seal */}
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-emerald-600/50 bg-gradient-to-br from-[#1a382d] to-[#0a1712] flex items-center justify-center shadow-[inset_0_0_15px_rgba(16,185,129,0.2),0_0_10px_rgba(16,185,129,0.3)] relative">
            <div className="absolute inset-2 border border-emerald-500/30 rounded-full border-dashed rotate-45"></div>
            <Sigma className="w-8 h-8 md:w-10 md:h-10 text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            <svg className="absolute inset-0 w-full h-full text-[7px] font-bold text-emerald-500/70 uppercase tracking-widest animate-[spin_60s_linear_infinite]" viewBox="0 0 100 100">
              <path id="circlePath" d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" fill="none" />
              <text><textPath href="#circlePath" startOffset="0%">• SIGMA ACADEMY • 2026</textPath></text>
            </svg>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-8 py-6 max-w-5xl mx-auto w-full flex-1 flex flex-col gap-6">
        
        {/* Info Cards */}
        <div className="flex flex-col gap-4">
          <div className="bg-[#1a2320] border border-emerald-900/40 rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-emerald-700/50 transition-colors">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-600/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
            <div className="flex justify-between items-center mb-3">
               <h3 className="text-lg font-bold text-gray-200">العام الدراسي</h3>
               <CalendarDays className="w-5 h-5 text-emerald-500/70" />
            </div>
            <div className="bg-[#121815] border border-emerald-900/30 rounded-xl p-4 flex justify-end items-center">
              <span className="text-xl font-black tracking-wider text-emerald-50">2025 - 2026</span>
            </div>
          </div>

          <div className="bg-[#1a2320] border border-emerald-900/40 rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-emerald-700/50 transition-colors">
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-cyan-600/10 rounded-full blur-3xl -ml-10 -mb-10"></div>
            <div className="flex justify-between items-center mb-3">
               <h3 className="text-lg font-bold text-gray-200">عدد الطلاب</h3>
            </div>
            <div className="bg-[#121815] border border-emerald-900/30 rounded-xl p-4 flex justify-between items-center">
              <span className="text-3xl font-black text-white">{students.length}</span>
              <div className="flex flex-col items-end gap-1">
                 <div className="flex items-center gap-3">
                   <span className="text-base font-bold text-gray-200">إجمالي الطلاب المسجلين</span>
                   <div className="w-8 h-8 rounded-full bg-emerald-900/50 border border-emerald-500/30 flex items-center justify-center">
                     <Sigma className="w-4 h-4 text-emerald-400" />
                   </div>
                 </div>
                 <span className="text-xs text-gray-500">تتغير حسب العام الدراسي المحدد</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section Header */}
        <div className="bg-[#0f291e] border-l-4 border-emerald-500 px-4 py-2 rounded-r-lg mt-2 flex items-center justify-between">
           <h3 className="text-lg font-bold text-emerald-50">الأقسام الرئيسية</h3>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 pb-8">
          {modules.map((mod, idx) => {
            const Icon = mod.icon;
            return (
              <button 
                key={idx}
                onClick={() => setView(mod.view)}
                className="bg-[#1a2320] border border-emerald-900/40 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-lg hover:border-emerald-500/50 hover:bg-[#1f2b27] transition-all group overflow-hidden relative"
              >
                {/* Glow Effect */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-400/20 transition-colors"></div>
                
                <div className="relative mb-5 transform group-hover:-translate-y-2 transition-transform duration-300">
                  <div className="w-20 h-20 bg-gradient-to-b from-[#233830] to-[#121c18] rounded-[2rem] border border-emerald-700/50 shadow-[0_10px_20px_rgba(0,0,0,0.5),inset_0_2px_5px_rgba(255,255,255,0.1)] flex flex-col items-center justify-center rotate-3 group-hover:rotate-0 transition-transform">
                    <Icon className="w-8 h-8 text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)] mb-1" />
                    {idx === 0 && <span className="text-[10px] font-black text-emerald-300/80">39</span>}
                  </div>
                  {/* Decorative corner brackets */}
                  <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-emerald-500/40 rounded-tl-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-emerald-500/40 rounded-br-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                
                <h3 className="text-xl font-bold text-gray-100 mb-2 relative z-10">{mod.title}</h3>
                <p className="text-sm text-gray-400 relative z-10">{mod.subtitle}</p>
              </button>
            )
          })}
        </div>

      </div>

      {/* About Dialog */}
      {showAbout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md" onClick={() => setShowAbout(false)}>
          <div 
            className="bg-[#121815] border border-emerald-600/30 rounded-3xl p-8 max-w-md w-full shadow-[0_0_50px_rgba(16,185,129,0.2)] text-center relative overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500"></div>
            <div className="w-24 h-24 bg-[#1a2b24] rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-emerald-500/40 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
              <Sigma className="w-12 h-12 text-emerald-400" />
            </div>
            <h2 className="text-2xl font-black text-white mb-2 tracking-wide">ΣIGMA ACADEMY</h2>
            <h3 className="text-sm font-medium text-emerald-400 mb-8 uppercase tracking-widest">Sovereign Administrative System</h3>
            
            <div className="bg-[#0c100e] rounded-2xl p-6 border border-emerald-900/50 mb-8 shadow-inner">
              <p className="text-sm text-gray-400 mb-2 font-medium">Developed & Engineered by</p>
              <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 drop-shadow-sm">Suhail Al-Hazbari</p>
              <div className="mt-4 pt-4 border-t border-emerald-900/30 flex justify-center items-center gap-2">
                 <span className="text-emerald-500 font-mono font-bold tracking-widest text-lg">715562996</span>
              </div>
            </div>
            
            <button 
              onClick={() => setShowAbout(false)}
              className="bg-gradient-to-r from-emerald-700 to-teal-700 text-white font-bold py-3 px-8 rounded-xl w-full hover:from-emerald-600 hover:to-teal-600 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] uppercase tracking-wide"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

