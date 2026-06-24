import { ArrowRight, BadgeInfo, CalendarDays, LineChart, FileText, ClipboardEdit, Users } from 'lucide-react';
import { ViewState } from '../types';

interface ProgressDashboardProps {
  setView: (view: ViewState) => void;
}

export default function ProgressDashboard({ setView }: ProgressDashboardProps) {
  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header Area */}
      <div className="bg-[#1b3a6e] text-white pt-4 pb-10 px-4 rounded-b-[2rem] shadow-md relative">
        <div className="flex items-center mb-6">
          <button onClick={() => setView('home')} className="p-2 rounded-full hover:bg-white/10 transition-colors">
            <ArrowRight className="w-6 h-6" />
          </button>
          <div className="absolute left-4 top-4 bg-[#c8994a] text-xs font-bold px-3 py-1 rounded-full text-white">
            الواجهة الرئيسية
          </div>
        </div>
        
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">كشوفات التقدم الصف التاسع أساسي</h1>
          <p className="text-sm opacity-80 text-blue-200">لوحة رئيسية للأقسام الأساسية</p>
        </div>
      </div>

      {/* Info Cards */}
      <div className="px-4 -mt-6">
        <div className="bg-white rounded-2xl shadow-md p-4 mb-4 border border-gray-100">
          <p className="text-xs text-gray-500 font-bold mb-2">العام الدراسي</p>
          <div className="flex items-center justify-between bg-gray-50 p-3 rounded-xl border border-gray-200">
            <span className="font-bold text-gray-800">2025 / 2026</span>
            <CalendarDays className="w-5 h-5 text-gray-400" />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-4 mb-6 border border-gray-100 flex items-center justify-between">
          <div className="flex items-center space-x-4 space-x-reverse">
            <div className="w-12 h-12 bg-gradient-to-br from-[#c8994a] to-[#8b6528] rounded-full flex items-center justify-center text-white shadow-inner">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800 mb-1">إجمالي الطلاب المسجلين</p>
              <p className="text-xs text-gray-500">يتغير بحسب العام الدراسي المختار</p>
            </div>
          </div>
          <div className="text-3xl font-black text-[#1b3a6e]">131</div>
        </div>

        {/* Sections Grid */}
        <h2 className="text-lg font-bold text-gray-800 mb-4 px-2">الأقسام الرئيسية</h2>
        
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => setView('card_view')}
            className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow active:scale-95"
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#2a4d8c] to-[#142952] flex items-center justify-center mb-3 shadow-md relative overflow-hidden">
               <div className="absolute inset-0 bg-[#c8994a] opacity-20 mix-blend-overlay"></div>
               <BadgeInfo className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-bold text-gray-800 mb-1">أرقام الجلوس</h3>
            <p className="text-[10px] text-gray-500">إدارة وعرض أرقام الجلوس</p>
          </button>

          <button className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow active:scale-95">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#2a4d8c] to-[#142952] flex items-center justify-center mb-3 shadow-md relative overflow-hidden">
               <div className="absolute inset-0 bg-[#c8994a] opacity-20 mix-blend-overlay"></div>
               <FileText className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-bold text-gray-800 mb-1">بطاقات التقدم</h3>
            <p className="text-[10px] text-gray-500">عرض وطباعة بطاقات التقدم</p>
          </button>

          <button className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow active:scale-95">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#2a4d8c] to-[#142952] flex items-center justify-center mb-3 shadow-md relative overflow-hidden">
               <div className="absolute inset-0 bg-[#c8994a] opacity-20 mix-blend-overlay"></div>
               <LineChart className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-bold text-gray-800 mb-1">كشوفات التقدم</h3>
            <p className="text-[10px] text-gray-500">استعراض الكشوفات والتقارير</p>
          </button>

          <button 
            onClick={() => setView('student_form')}
            className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow active:scale-95"
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#2a4d8c] to-[#142952] flex items-center justify-center mb-3 shadow-md relative overflow-hidden">
               <div className="absolute inset-0 bg-[#c8994a] opacity-20 mix-blend-overlay"></div>
               <ClipboardEdit className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-bold text-gray-800 mb-1">تعبئة بيانات الطلاب</h3>
            <p className="text-[10px] text-gray-500">إدخال وتعديل بيانات الطلاب</p>
          </button>
        </div>
      </div>
    </div>
  );
}
