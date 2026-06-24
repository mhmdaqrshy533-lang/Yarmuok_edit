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
  Settings
} from 'lucide-react';
import { ViewState } from '../types';

interface HomeProps {
  setView: (view: ViewState) => void;
}

const modules = [
  { title: 'المحصلات الشهرية', subtitle: 'إدارة محصلات الطلاب شهريا', icon: FileSpreadsheet, view: 'monthly_results' as ViewState, color: 'text-purple-600', bg: 'bg-purple-100' },
  { title: 'محرر الأتمتة', subtitle: 'نماذج وأسئلة آلية ذكية', icon: Cpu, view: 'home' as ViewState, color: 'text-blue-600', bg: 'bg-blue-100' },
  { title: 'محرر الامتحانات', subtitle: 'إنشاء وتنسيق وطباعة الاختبارات', icon: FileText, view: 'home' as ViewState, color: 'text-indigo-600', bg: 'bg-indigo-100' },
  { title: 'النتائج النهائية', subtitle: 'تقارير النجاح والرسوب النهائية', icon: GraduationCap, view: 'home' as ViewState, color: 'text-amber-600', bg: 'bg-amber-100' },
  { title: 'النتائج الشهرية', subtitle: 'إدخال واستعراض نتائج الأشهر', icon: ClipboardList, view: 'home' as ViewState, color: 'text-emerald-600', bg: 'bg-emerald-100' },
  { title: 'حضور وغياب الطلاب', subtitle: 'متابعة الحضور والغياب اليومي', icon: UserCheck, view: 'home' as ViewState, color: 'text-rose-600', bg: 'bg-rose-100' },
  { title: 'الشهادات النهائية', subtitle: 'إصدار شهادات النجاح النهائية', icon: Award, view: 'certificate' as ViewState, color: 'text-yellow-600', bg: 'bg-yellow-100' },
  { title: 'البطاقات المدرسية', subtitle: 'بطائق تعريفية مدرسية للطلاب', icon: BadgeInfo, view: 'home' as ViewState, color: 'text-sky-600', bg: 'bg-sky-100' },
  { title: 'بطاقات التقدم', subtitle: 'عرض وطباعة بطاقات التقدم', icon: LineChart, view: 'progress_dashboard' as ViewState, color: 'text-orange-600', bg: 'bg-orange-100' },
  { title: 'المسجل العام', subtitle: 'إدارة بيانات الطلاب والسجلات', icon: Users, view: 'student_list' as ViewState, color: 'text-teal-600', bg: 'bg-teal-100' },
  { title: 'المحاسب المدرسي', subtitle: 'إدارة الرسوم والحسابات', icon: Calculator, view: 'accounting' as ViewState, color: 'text-cyan-600', bg: 'bg-cyan-100' },
  { title: 'محرر الكتب والملخصات', subtitle: 'تنسيق الكتب والملازم التعليمية', icon: Book, view: 'home' as ViewState, color: 'text-fuchsia-600', bg: 'bg-fuchsia-100' },
  { title: 'محرر الوثائق الرسمية', subtitle: 'إنشاء الخطابات والنماذج الرسمية', icon: ScrollText, view: 'home' as ViewState, color: 'text-stone-600', bg: 'bg-stone-100' },
  { title: 'قسم جديد', subtitle: 'مساحة جاهزة لقسم قادم', icon: PlusCircle, view: 'home' as ViewState, color: 'text-gray-600', bg: 'bg-gray-100' },
  { title: 'إضافي', subtitle: 'أدوات وخدمات إضافية', icon: LayoutGrid, view: 'home' as ViewState, color: 'text-slate-600', bg: 'bg-slate-100' },
];

export default function Home({ setView }: HomeProps) {
  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-y-auto">
      {/* Header Area */}
      <div className="bg-gradient-to-b from-[#381a6c] to-[#6a35b8] rounded-b-[2.5rem] p-6 pb-8 text-white relative shadow-lg">
        <div className="absolute top-6 left-6 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold border border-white/30">
          Pro 40.1
        </div>
        
        <div className="flex flex-col items-center mt-4">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-3 shadow-md border-4 border-purple-300/30">
            <BookOpen className="w-8 h-8 text-[#512396]" />
          </div>
          <h1 className="text-lg font-medium opacity-90 mb-1">حقيبة المعلم العربي</h1>
          <h2 className="text-2xl font-bold mb-2 tracking-tight">المحرر المدرسي الشامل</h2>
          <p className="text-xs opacity-75 font-medium bg-black/20 px-3 py-1 rounded-full">
            م / نبيل عبدالقادر الصبري - YE 772 666 391
          </p>
        </div>

        {/* Action Row */}
        <div className="flex justify-between items-center bg-white rounded-2xl mx-auto max-w-[90%] px-4 py-3 mt-6 shadow-md absolute -bottom-6 left-0 right-0">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors"><Youtube className="w-5 h-5 text-red-500" /></button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors"><Send className="w-5 h-5 text-blue-500" /></button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors"><MessageCircle className="w-5 h-5 text-green-500" /></button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors"><Settings className="w-5 h-5 text-purple-600" /></button>
          <div className="w-px h-6 bg-gray-200"></div>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors"><Lock className="w-5 h-5 text-amber-500" /></button>
        </div>
      </div>

      {/* Modules Grid */}
      <div className="px-4 pt-12 pb-8 flex-1">
        <div className="bg-[#593996] text-white px-4 py-2 rounded-xl mb-4 flex justify-between items-center shadow-sm">
          <span className="font-bold text-sm">الأقسام الرئيسية</span>
          <span className="bg-white/20 px-2 py-0.5 rounded-md text-xs">15</span>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {modules.map((mod, idx) => {
            const Icon = mod.icon;
            return (
              <button 
                key={idx}
                onClick={() => setView(mod.view)}
                className="bg-white rounded-2xl p-3 flex flex-col items-center justify-center text-center shadow-sm border border-gray-100 hover:shadow-md transition-shadow active:scale-95"
              >
                <div className={`w-12 h-12 rounded-full ${mod.bg} ${mod.color} flex items-center justify-center mb-3 shadow-inner`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xs font-bold text-gray-800 leading-tight mb-1">{mod.title}</h3>
                {/* <p className="text-[9px] text-gray-400 leading-tight">{mod.subtitle}</p> */}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  );
}
