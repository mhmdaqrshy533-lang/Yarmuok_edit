import { ArrowRight, BadgeInfo, CalendarDays, LineChart, FileText, ClipboardEdit, Users } from 'lucide-react';
import { ViewState } from '../types';

interface ProgressDashboardProps {
  setView: (view: ViewState) => void;
}

export default function ProgressDashboard({ setView }: ProgressDashboardProps) {
  return (
    <div className="flex flex-col h-full bg-black relative text-gray-200">
      {/* Header Area */}
      <div className="bg-gray-900/90 backdrop-blur-xl text-white pt-4 pb-12 px-4 rounded-b-[2.5rem] shadow-[0_4px_40px_rgba(147,51,234,0.15)] border-b border-purple-500/20 relative">
        <div className="flex items-center mb-6">
          <button onClick={() => setView('home')} className="p-2 rounded-xl hover:bg-white/10 transition-colors group">
            <ArrowRight className="w-6 h-6 text-purple-400 group-hover:text-cyan-400 transition-colors" />
          </button>
          <div className="absolute left-4 top-4 bg-gradient-to-r from-purple-600 to-cyan-600 text-xs font-bold px-4 py-1.5 rounded-full text-white shadow-[0_0_15px_rgba(147,51,234,0.3)]">
            الواجهة الرئيسية
          </div>
        </div>
        
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">كشوفات التقدم الصف التاسع أساسي</h1>
          <p className="text-sm text-cyan-200/70">لوحة رئيسية للأقسام الأساسية</p>
        </div>
      </div>

      {/* Info Cards */}
      <div className="px-4 -mt-8 relative z-10 w-full max-w-2xl mx-auto">
        <div className="bg-gray-900/60 backdrop-blur-xl rounded-3xl shadow-lg p-5 mb-4 border border-purple-500/20">
          <p className="text-xs text-cyan-400 font-bold mb-3">العام الدراسي</p>
          <div className="flex items-center justify-between bg-black/40 p-4 rounded-2xl border border-purple-500/30">
            <span className="font-bold text-white text-lg">2025 / 2026</span>
            <CalendarDays className="w-6 h-6 text-purple-400" />
          </div>
        </div>

        <div className="bg-gray-900/60 backdrop-blur-xl rounded-3xl shadow-lg p-5 mb-6 border border-purple-500/20 flex items-center justify-between hover:shadow-[0_0_20px_rgba(147,51,234,0.15)] transition-all">
          <div className="flex items-center space-x-4 space-x-reverse">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-cyan-600 rounded-full flex items-center justify-center text-white shadow-[0_0_15px_rgba(147,51,234,0.3)]">
              <Users className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm font-bold text-white mb-1">إجمالي الطلاب المسجلين</p>
              <p className="text-xs text-gray-400">يتغير بحسب العام الدراسي المختار</p>
            </div>
          </div>
          <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">131</div>
        </div>

        {/* Sections Grid */}
        <h2 className="text-lg font-bold text-cyan-400 mb-4 px-2">الأقسام الرئيسية</h2>
        
        <div className="grid grid-cols-2 gap-4 pb-8">
          <button 
            onClick={() => setView('card_view')}
            className="bg-gray-900/40 backdrop-blur-xl p-6 rounded-3xl shadow-lg border border-purple-500/20 flex flex-col items-center justify-center text-center hover:bg-gray-900/60 hover:border-cyan-500/40 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)] transition-all active:scale-95 group"
          >
            <div className="w-16 h-16 rounded-2xl bg-black/50 border border-purple-500/30 flex items-center justify-center mb-4 shadow-inner group-hover:border-cyan-500/50 transition-colors">
               <BadgeInfo className="w-8 h-8 text-purple-400 group-hover:text-cyan-400 transition-colors" />
            </div>
            <h3 className="font-bold text-white mb-1">أرقام الجلوس</h3>
            <p className="text-[10px] text-gray-400">إدارة وعرض أرقام الجلوس</p>
          </button>

          <button className="bg-gray-900/40 backdrop-blur-xl p-6 rounded-3xl shadow-lg border border-purple-500/20 flex flex-col items-center justify-center text-center hover:bg-gray-900/60 hover:border-cyan-500/40 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)] transition-all active:scale-95 group">
            <div className="w-16 h-16 rounded-2xl bg-black/50 border border-purple-500/30 flex items-center justify-center mb-4 shadow-inner group-hover:border-cyan-500/50 transition-colors">
               <FileText className="w-8 h-8 text-purple-400 group-hover:text-cyan-400 transition-colors" />
            </div>
            <h3 className="font-bold text-white mb-1">بطاقات التقدم</h3>
            <p className="text-[10px] text-gray-400">عرض وطباعة بطاقات التقدم</p>
          </button>

          <button className="bg-gray-900/40 backdrop-blur-xl p-6 rounded-3xl shadow-lg border border-purple-500/20 flex flex-col items-center justify-center text-center hover:bg-gray-900/60 hover:border-cyan-500/40 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)] transition-all active:scale-95 group">
            <div className="w-16 h-16 rounded-2xl bg-black/50 border border-purple-500/30 flex items-center justify-center mb-4 shadow-inner group-hover:border-cyan-500/50 transition-colors">
               <LineChart className="w-8 h-8 text-purple-400 group-hover:text-cyan-400 transition-colors" />
            </div>
            <h3 className="font-bold text-white mb-1">كشوفات التقدم</h3>
            <p className="text-[10px] text-gray-400">استعراض الكشوفات والتقارير</p>
          </button>

          <button 
            onClick={() => setView('student_form')}
            className="bg-gray-900/40 backdrop-blur-xl p-6 rounded-3xl shadow-lg border border-purple-500/20 flex flex-col items-center justify-center text-center hover:bg-gray-900/60 hover:border-cyan-500/40 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)] transition-all active:scale-95 group"
          >
            <div className="w-16 h-16 rounded-2xl bg-black/50 border border-purple-500/30 flex items-center justify-center mb-4 shadow-inner group-hover:border-cyan-500/50 transition-colors">
               <ClipboardEdit className="w-8 h-8 text-purple-400 group-hover:text-cyan-400 transition-colors" />
            </div>
            <h3 className="font-bold text-white mb-1">بيانات الطلاب</h3>
            <p className="text-[10px] text-gray-400">إدخال وتعديل بيانات الطلاب</p>
          </button>
        </div>
      </div>
    </div>
  );
}
