import { ArrowRight, Save } from 'lucide-react';
import { ViewState } from '../types';
import { useStore } from '../store';

interface AttendanceProps {
  setView: (view: ViewState) => void;
}

export default function Attendance({ setView }: AttendanceProps) {
  return (
    <div className="flex flex-col h-full bg-[#121619] text-white">
       {/* Top Bar */}
       <div className="bg-[#0f291e]/90 backdrop-blur-xl text-white flex items-center justify-between p-4 shadow-md z-10 sticky top-0 border-b border-emerald-500/20">
        <button onClick={() => setView('home')} className="p-2 hover:bg-white/10 rounded-xl transition-colors group">
          <ArrowRight className="w-5 h-5 text-emerald-400 group-hover:text-emerald-300" />
        </button>
        <div className="text-center flex-1">
          <h1 className="font-black text-lg text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 tracking-wide">حضور وغياب الطلاب</h1>
        </div>
        <div className="w-9" />
      </div>

      <div className="flex-1 overflow-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto bg-[#1a2320] border border-emerald-900/40 rounded-3xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-teal-400 mb-6 border-b border-emerald-900/30 pb-4">سجل الحضور</h2>
          <div className="text-gray-400 text-center py-20">
             (جاري تنفيذ واجهة الحضور والغياب بناءً على تصميم activity_st_gheabb.xml)
          </div>
        </div>
      </div>
    </div>
  );
}
