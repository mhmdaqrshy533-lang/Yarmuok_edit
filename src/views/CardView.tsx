import { ArrowLeft, Settings, Printer, PieChart, PanelTop, Maximize2, ChevronLeft, ChevronRight, Check, Edit3, MessageCircle } from 'lucide-react';
import { ViewState } from '../types';
import { useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

interface CardViewProps {
  setView: (view: ViewState) => void;
}

export default function CardView({ setView }: CardViewProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [activeTab, setActiveTab] = useState('رقم جلوس');
  const componentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: 'بطاقة_طالب',
  });

  return (
    <div className="flex flex-col h-full bg-black relative text-gray-200">
      {/* Top Header */}
      <div className="bg-gray-900/90 backdrop-blur-xl text-white flex items-center justify-between p-4 shadow-[0_4px_30px_rgba(147,51,234,0.15)] z-10 sticky top-0 border-b border-purple-500/20 print:hidden">
        <button onClick={() => setView('progress_dashboard')} className="p-2 hover:bg-white/10 rounded-xl transition-colors group">
          <ArrowLeft className="w-5 h-5 text-purple-400 group-hover:text-cyan-400" />
        </button>
        <div className="flex items-center bg-black/50 border border-purple-500/30 rounded-xl px-4 py-1.5 shadow-inner">
          <PieChart className="w-4 h-4 ml-2 text-cyan-400" />
          <span className="font-bold text-sm text-white">الصف : التاسع | 2025-2026</span>
        </div>
        <div className="flex space-x-2 space-x-reverse">
          <button onClick={() => setShowSettings(!showSettings)} className="p-2 hover:bg-white/10 rounded-xl transition-colors group">
            <Settings className="w-5 h-5 text-purple-400 group-hover:text-cyan-400" />
          </button>
          <button className="p-2 hover:bg-white/10 rounded-xl transition-colors group" title="مشاركة عبر واتساب">
            <MessageCircle className="w-5 h-5 text-green-400 group-hover:text-green-300" />
          </button>
          <button onClick={() => handlePrint()} className="p-2 hover:bg-white/10 rounded-xl transition-colors group">
            <Printer className="w-5 h-5 text-cyan-400 group-hover:text-purple-400" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-gray-900/60 backdrop-blur-md border-b border-purple-500/20 overflow-x-auto hide-scrollbar z-10 print:hidden shadow-lg">
        <div className="flex p-3 space-x-2 space-x-reverse min-w-max justify-center">
          {['رقم جلوس', 'رقم جلوس Lux', 'بطاقة تقدم عادية', 'بطاقة تقدم Lux'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === tab 
                  ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.3)] border border-purple-400/50' 
                  : 'bg-black/50 text-gray-300 border border-purple-500/30 hover:bg-purple-900/40 hover:border-cyan-500/50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area (The Card) */}
      <div className="flex-1 overflow-auto p-4 md:p-8 flex flex-col items-center print:p-0 print:bg-white print:block">
        
        {/* Student Info Bar */}
        <div className="w-full max-w-[800px] bg-gray-900/60 backdrop-blur-xl border border-purple-500/30 text-white rounded-2xl px-5 py-3 flex items-center justify-between mb-6 shadow-[0_0_20px_rgba(147,51,234,0.15)] text-sm font-bold print:hidden">
          <div className="flex items-center">
            <span className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-3 py-1 rounded-lg ml-3 shadow-md">142578</span>
            <span className="text-gray-200">الطالب : <span className="text-white">نبيل عبدالقادر علي</span></span>
          </div>
          <span className="bg-black/50 border border-purple-500/30 text-cyan-300 px-4 py-1.5 rounded-lg">الصف : التاسع</span>
        </div>

        {/* The Document/Card */}
        <div ref={componentRef} className="bg-white text-black w-full max-w-[800px] rounded-xl shadow-[0_0_40px_rgba(147,51,234,0.15)] overflow-hidden border-2 border-purple-500/20 relative print:shadow-none print:border-none print:max-w-none print:w-full print:p-4 mb-24">
          {/* Watermark/Background Pattern simulation */}
          <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-900 via-transparent to-transparent"></div>
          <div className="hidden print:flex absolute inset-0 items-center justify-center pointer-events-none z-0 opacity-[0.03]">
             <h1 className="text-[150px] font-black -rotate-45 text-black">نظام يرموك</h1>
          </div>
          
          <div className="p-6 relative z-10">
            {/* Document Header */}
            <div className="flex justify-between items-start mb-6 border-b-2 border-amber-200 pb-4">
              <div className="w-24 h-32 border-2 border-gray-300 rounded flex flex-col items-center justify-center text-gray-400 bg-gray-50 text-[10px] text-center p-2">
                <span className="mb-2">صورة الطالب 4x6</span>
                <span>تختم بختم المدرسة على الصورة</span>
              </div>
              
              <div className="flex-1 flex flex-col items-center text-center mx-4">
                <div className="w-16 h-16 bg-contain bg-no-repeat bg-center mb-2 flex items-center justify-center">
                   {/* Placeholder for Republic Logo */}
                   <div className="w-12 h-12 rounded-full border-2 border-red-800 flex items-center justify-center bg-yellow-100 text-red-800 font-bold text-xs">شعار<br/>الجمهورية</div>
                </div>
                <h2 className="text-xl font-bold text-gray-800 mb-1">بطاقة تحقيق الشخصية</h2>
                <h3 className="text-sm font-bold text-gray-600 mb-3">اختبارات شهادة إتمام التعليم الأساسي</h3>
                
                <div className="flex justify-center space-x-4 space-x-reverse text-sm font-bold">
                  <div className="flex items-center">
                    <span className="text-gray-500 ml-2">العام الدراسي</span>
                    <span className="bg-gray-100 px-4 py-1 rounded border border-gray-200">2025 / 2026</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-500 ml-2">رقم الجلوس</span>
                    <span className="bg-gray-100 px-4 py-1 rounded border border-gray-200">142578</span>
                  </div>
                </div>
              </div>

              <div className="text-right text-[10px] font-bold text-gray-700 leading-relaxed">
                <p>الجمهورية اليمنية</p>
                <p>وزارة التربية والتعليم</p>
                <p>قطاع المناهج والتوجيه</p>
                <p>الإدارة العامة للاختبارات</p>
              </div>
            </div>

            {/* Document Body */}
            <div className="space-y-3 text-sm font-bold">
              <div className="flex items-center">
                <span className="w-48 text-gray-600">اسم الطالب رباعيا مع اللقب</span>
                <div className="flex-1 bg-gray-50 px-3 py-2 rounded border border-gray-200 text-center text-lg text-blue-900">
                  نبيل عبدالقادر علي
                </div>
              </div>

              <div className="flex space-x-4 space-x-reverse">
                <div className="flex-1 flex items-center">
                  <span className="w-32 text-gray-600">المدرسة المتقدم منها</span>
                  <div className="flex-1 bg-gray-50 px-3 py-2 rounded border border-gray-200 text-center">مدرسة النهضة الحديثة</div>
                </div>
              </div>

              <div className="flex space-x-4 space-x-reverse">
                 <div className="flex-1 flex items-center">
                  <span className="w-16 text-gray-600">المحافظة</span>
                  <div className="flex-1 bg-gray-50 px-3 py-2 rounded border border-gray-200 text-center">تعز</div>
                </div>
                <div className="flex-1 flex items-center">
                  <span className="w-16 text-gray-600">المديرية</span>
                  <div className="flex-1 bg-gray-50 px-3 py-2 rounded border border-gray-200 text-center">القاهرة</div>
                </div>
              </div>

              <div className="flex flex-col pt-2">
                <span className="text-gray-600 mb-1">محل وتاريخ الميلاد من واقع البطاقة العائلية للأب</span>
                <div className="bg-gray-50 h-10 rounded border border-gray-200"></div>
              </div>

            </div>

            {/* Document Footer / Signatures */}
            <div className="mt-8 flex justify-between space-x-4 space-x-reverse text-center text-xs font-bold text-gray-600">
              <div className="flex-1 border border-gray-200 rounded p-2 pt-8 relative">
                <span className="absolute bottom-2 left-0 right-0">مدير المدرسة</span>
              </div>
              <div className="flex-1 border border-gray-200 rounded p-2 pt-8 relative">
                <span className="absolute bottom-2 left-0 right-0">مدير الاختبارات بالمحافظة</span>
              </div>
              <div className="flex-1 border border-gray-200 rounded p-2 pt-8 relative">
                <span className="absolute bottom-2 left-0 right-0">يعتمد / مدير مكتب التربية بالمحافظة</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Bottom Floating Controls */}
      <div className="fixed bottom-24 left-0 right-0 flex justify-between px-4 md:px-8 pointer-events-none print:hidden z-30 max-w-7xl mx-auto w-full">
        <div className="bg-gray-900/80 backdrop-blur-xl text-cyan-400 px-5 py-2.5 rounded-xl text-xs font-bold pointer-events-auto flex items-center shadow-[0_0_20px_rgba(147,51,234,0.2)] border border-purple-500/30">
          عرض قابل للتكبير والتحريك
        </div>
        <div className="flex space-x-2 space-x-reverse pointer-events-auto">
          <button className="w-12 h-12 bg-gray-900/80 backdrop-blur-xl text-purple-400 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(147,51,234,0.2)] border border-purple-500/30 hover:text-cyan-400 hover:border-cyan-500/50 transition-colors">
            <PanelTop className="w-5 h-5" />
          </button>
          <button className="w-12 h-12 bg-gray-900/80 backdrop-blur-xl text-purple-400 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(147,51,234,0.2)] border border-purple-500/30 hover:text-cyan-400 hover:border-cyan-500/50 transition-colors">
            <Maximize2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Bottom Navigation (Student Scroller) */}
      <div className="bg-gray-900/90 backdrop-blur-xl border-t border-purple-500/20 text-white p-3 pb-safe flex flex-col z-20 print:hidden fixed bottom-0 w-full shadow-[0_-4px_30px_rgba(147,51,234,0.15)]">
        <div className="flex justify-between items-center text-xs font-bold px-4 mb-3">
          <span className="text-cyan-400">التنقل بين الطلاب</span>
          <span className="bg-black/50 border border-purple-500/30 px-3 py-1 rounded-full text-purple-300">4</span>
        </div>
        <div className="flex space-x-3 space-x-reverse overflow-x-auto hide-scrollbar pb-2 px-2">
          <button className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-[0_0_15px_rgba(147,51,234,0.3)] flex items-center whitespace-nowrap min-w-max border border-purple-400/50">
            <span className="bg-white text-purple-900 w-6 h-6 rounded-full flex items-center justify-center text-xs ml-3 font-black shadow-inner">1</span>
            نبيل عبدالقادر علي
          </button>
          <button className="bg-black/50 text-gray-300 px-5 py-2.5 rounded-xl text-sm font-bold border border-purple-500/30 flex items-center whitespace-nowrap min-w-max hover:bg-purple-900/40 hover:border-cyan-500/50 transition-colors">
            <span className="bg-gray-800 text-gray-400 w-6 h-6 rounded-full flex items-center justify-center text-xs ml-3 border border-purple-500/20">2</span>
            محمد أحمد علي عبدالله...
          </button>
          <button className="bg-black/50 text-gray-300 px-5 py-2.5 rounded-xl text-sm font-bold border border-purple-500/30 flex items-center whitespace-nowrap min-w-max hover:bg-purple-900/40 hover:border-cyan-500/50 transition-colors">
            <span className="bg-gray-800 text-gray-400 w-6 h-6 rounded-full flex items-center justify-center text-xs ml-3 border border-purple-500/20">3</span>
            أسماء محمد حسين
          </button>
        </div>
      </div>

      {/* Settings Overlay Modal */}
      {showSettings && (
        <div className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="bg-[#d2a659] p-4 flex justify-between items-center text-white">
              <h3 className="font-bold text-lg flex items-center"><Settings className="w-5 h-5 ml-2" /> إعدادات بطاقات التقدم</h3>
              <button onClick={() => setShowSettings(false)} className="p-1 hover:bg-black/10 rounded-full">
                <ArrowLeft className="w-6 h-6 rotate-180" />
              </button>
            </div>
            
            <div className="p-1 bg-gray-100 text-center text-xs text-gray-500 border-b border-gray-200">
              تحكم سريع بالترويسة, التوقيعات, الثيمات, الإطار المزخرف, العلامة
            </div>

            <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
              
              {/* Settings Item */}
              <div className="border-b border-gray-100 pb-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-gray-800 flex items-center"><PanelTop className="w-4 h-4 ml-2" /> الترويسة</span>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-sm font-bold text-green-600">تشغيل</span>
                    <div className="w-10 h-5 bg-green-500 rounded-full relative">
                      <div className="absolute left-1 top-0.5 w-4 h-4 bg-white rounded-full shadow"></div>
                    </div>
                  </div>
                </div>
                <button className="w-full bg-[#d2a659] text-white py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-[#c8994a]">
                  الذهاب إلى إعداد ترويسة الصفحة
                </button>
              </div>

              {/* Settings Item */}
              <div className="border-b border-gray-100 pb-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-gray-800 flex items-center"><Edit3 className="w-4 h-4 ml-2" /> التوقيعات</span>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-sm font-bold text-gray-400">تعطيل</span>
                    <div className="w-10 h-5 bg-gray-300 rounded-full relative">
                      <div className="absolute right-1 top-0.5 w-4 h-4 bg-white rounded-full shadow"></div>
                    </div>
                  </div>
                </div>
                <button className="w-full bg-gray-200 text-gray-500 py-2 rounded-lg text-sm font-bold shadow-sm" disabled>
                  الذهاب إلى إعداد التوقيعات
                </button>
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="font-bold text-gray-800 flex items-center"><ArrowLeft className="w-4 h-4 ml-2" /> لغة الأرقام</span>
                <div className="flex bg-gray-100 rounded-lg p-1 border border-gray-200">
                  <button className="px-4 py-1 rounded text-sm font-bold text-gray-500 hover:bg-white hover:shadow-sm">العربية</button>
                  <button className="px-4 py-1 rounded text-sm font-bold bg-white text-[#d2a659] shadow-sm border border-gray-200">English</button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
