import { 
  FileSpreadsheet, 
  Cpu, 
  FileText, 
  GraduationCap, 
  ClipboardList, 
  UserCheck, 
  Award, 
  BadgeInfo, 
  LineChart, 
  Users, 
  Calculator, 
  Book, 
  ScrollText, 
  PlusCircle, 
  LayoutGrid,
  Youtube,
  Send,
  MessageCircle,
  BookOpen,
  Lock,
  Settings,
  Info
} from 'lucide-react';
import { ViewState } from '../types';
import { useStore } from '../store';
import { useState } from 'react';

interface HomeProps {
  setView: (view: ViewState) => void;
}

const modules = [
  { title: 'المحصلات الشهرية', subtitle: 'إدارة محصلات الطلاب شهريا', icon: FileSpreadsheet, view: 'monthly_results' as ViewState, color: 'text-purple-400', bg: 'bg-purple-900/40 border-purple-500/30' },
  { title: 'الشهادات النهائية', subtitle: 'إصدار شهادات النجاح النهائية', icon: Award, view: 'certificate' as ViewState, color: 'text-blue-400', bg: 'bg-blue-900/40 border-blue-500/30' },
  { title: 'المسجل العام', subtitle: 'إدارة بيانات الطلاب والسجلات', icon: Users, view: 'student_list' as ViewState, color: 'text-fuchsia-400', bg: 'bg-fuchsia-900/40 border-fuchsia-500/30' },
  { title: 'المحاسب المدرسي', subtitle: 'إدارة الرسوم والحسابات', icon: Calculator, view: 'accounting' as ViewState, color: 'text-indigo-400', bg: 'bg-indigo-900/40 border-indigo-500/30' },
  { title: 'محرر الاختبارات', subtitle: 'تصميم وطباعة نماذج الاختبارات', icon: Book, view: 'exam_editor' as ViewState, color: 'text-cyan-400', bg: 'bg-cyan-900/40 border-cyan-500/30' },
  { title: 'محرر الوثائق', subtitle: 'إنشاء الخطابات والنماذج الرسمية', icon: ScrollText, view: 'doc_editor' as ViewState, color: 'text-violet-400', bg: 'bg-violet-900/40 border-violet-500/30' },
  { title: 'البطاقات المدرسية', subtitle: 'بطائق تعريفية مدرسية للطلاب', icon: BadgeInfo, view: 'card_view' as ViewState, color: 'text-sky-400', bg: 'bg-sky-900/40 border-sky-500/30' },
  { title: 'بطاقات التقدم', subtitle: 'عرض وطباعة بطاقات التقدم', icon: LineChart, view: 'progress_dashboard' as ViewState, color: 'text-purple-300', bg: 'bg-purple-900/40 border-purple-500/30' },
];

export default function Home({ setView }: HomeProps) {
  const { settings } = useStore();
  const [showAbout, setShowAbout] = useState(false);

  return (
    <div className="flex flex-col h-full bg-black overflow-y-auto text-white">
      {/* Header Area - Glassmorphism Dark */}
      <div className="bg-gradient-to-b from-purple-950 to-black/90 backdrop-blur-xl rounded-b-[2.5rem] md:rounded-b-[3rem] p-8 pb-12 relative shadow-[0_10px_40px_-10px_rgba(147,51,234,0.3)] border-b border-purple-500/20">
        <div className="flex flex-col items-center mt-4 md:mt-8">
          <div className="w-20 h-20 bg-black/50 backdrop-blur-md rounded-2xl flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(147,51,234,0.4)] border border-purple-500/40">
            <BookOpen className="w-10 h-10 text-cyan-400" />
          </div>
          <h1 className="text-xl md:text-2xl font-medium opacity-90 mb-2 text-purple-200">{settings.schoolName}</h1>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 drop-shadow-sm">نظام يرموك</h2>
        </div>

        {/* Action Row */}
        <div className="flex justify-center gap-4 md:gap-8 items-center bg-gray-900/80 backdrop-blur-xl border border-purple-500/30 rounded-2xl mx-auto w-max px-6 py-3 mt-8 shadow-[0_0_30px_rgba(147,51,234,0.15)] absolute -bottom-7 left-0 right-0">
          <button onClick={() => setView('settings')} className="p-2 hover:bg-white/10 rounded-xl transition-all group flex items-center gap-2">
            <Settings className="w-5 h-5 text-purple-400 group-hover:text-cyan-400" />
            <span className="text-sm font-medium text-purple-200 hidden md:block">الإعدادات</span>
          </button>
          <div className="w-px h-6 bg-purple-500/30 hidden md:block"></div>
          <button onClick={() => setShowAbout(true)} className="p-2 hover:bg-white/10 rounded-xl transition-all group flex items-center gap-2">
            <Info className="w-5 h-5 text-cyan-400 group-hover:text-purple-400" />
            <span className="text-sm font-medium text-cyan-200 hidden md:block">حول التطبيق</span>
          </button>
        </div>
      </div>

      {/* Modules Grid */}
      <div className="px-6 md:px-12 pt-16 pb-12 flex-1 max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {modules.map((mod, idx) => {
            const Icon = mod.icon;
            return (
              <button 
                key={idx}
                onClick={() => setView(mod.view)}
                className="bg-gray-900/60 backdrop-blur-md rounded-3xl p-6 flex flex-col items-center justify-center text-center shadow-lg border border-gray-800 hover:border-purple-500/50 hover:shadow-[0_0_25px_rgba(147,51,234,0.2)] hover:-translate-y-1 transition-all active:scale-95 group"
              >
                <div className={`w-16 h-16 rounded-2xl border ${mod.bg} flex items-center justify-center mb-4 shadow-inner group-hover:scale-110 transition-transform group-hover:shadow-[0_0_15px_rgba(34,211,238,0.3)]`}>
                  <Icon className={`w-8 h-8 ${mod.color}`} />
                </div>
                <h3 className="text-sm md:text-base font-bold text-gray-200 leading-tight mb-2 group-hover:text-white transition-colors">{mod.title}</h3>
                <p className="text-xs text-gray-400 leading-tight hidden md:block group-hover:text-gray-300">{mod.subtitle}</p>
              </button>
            )
          })}
        </div>
      </div>

      {/* About Dialog */}
      {showAbout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowAbout(false)}>
          <div 
            className="bg-gray-900/90 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-8 max-w-md w-full shadow-[0_0_50px_rgba(147,51,234,0.3)] text-center relative overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-purple-500 to-fuchsia-500"></div>
            <div className="w-20 h-20 bg-black/50 rounded-full flex items-center justify-center mx-auto mb-6 border border-cyan-500/40 shadow-[0_0_20px_rgba(34,211,238,0.2)]">
              <BookOpen className="w-10 h-10 text-purple-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">نظام يرموك</h2>
            <h3 className="text-lg font-medium text-cyan-400 mb-6">{settings.schoolName}</h3>
            
            <div className="bg-black/40 rounded-xl p-4 border border-gray-800 mb-6">
              <p className="text-sm text-gray-300 mb-1">إعداد المهندس</p>
              <p className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">سهيل الهزبري</p>
              <p className="text-lg font-mono text-purple-300 mt-2">715562996</p>
            </div>
            
            <button 
              onClick={() => setShowAbout(false)}
              className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-bold py-3 px-8 rounded-xl w-full hover:from-purple-500 hover:to-cyan-500 transition-all shadow-[0_0_20px_rgba(147,51,234,0.4)]"
            >
              إغلاق
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
