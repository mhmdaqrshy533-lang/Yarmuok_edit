import { ArrowLeft, Settings, Printer, PieChart, PanelTop, Maximize2, ChevronLeft, ChevronRight, Check, Edit3 } from 'lucide-react';
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
    <div className="flex flex-col h-full bg-gradient-to-b from-[#5a3696] to-[#cdb4db] relative">
      {/* Top Header */}
      <div className="bg-[#482880] text-white flex items-center justify-between p-3 shadow-md z-10 print:hidden">
        <button onClick={() => setView('progress_dashboard')} className="p-2 rounded-full hover:bg-white/10">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center bg-white/10 rounded-full px-4 py-1">
          <PieChart className="w-4 h-4 ml-2" />
          <span className="font-bold text-sm">الصف : التاسع | 2025-2026</span>
        </div>
        <div className="flex space-x-2 space-x-reverse">
          <button onClick={() => setShowSettings(!showSettings)} className="p-2 rounded-full hover:bg-white/10">
            <Settings className="w-5 h-5" />
          </button>
          <button onClick={() => handlePrint()} className="p-2 rounded-full hover:bg-white/10">
            <Printer className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white shadow-sm overflow-x-auto hide-scrollbar z-10 print:hidden">
        <div className="flex p-2 space-x-2 space-x-reverse min-w-max">
          {['رقم جلوس', 'رقم جلوس Lux', 'بطاقة تقدم عادية', 'بطاقة تقدم Lux'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-colors whitespace-nowrap ${
                activeTab === tab 
                  ? 'bg-[#e91e63] text-white shadow-md' 
                  : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area (The Card) */}
      <div className="flex-1 overflow-auto p-4 flex flex-col items-center print:p-0 print:bg-white print:block">
        
        {/* Student Info Bar */}
        <div className="w-full bg-[#593996]/80 backdrop-blur-sm text-white rounded-full px-4 py-2 flex items-center justify-between mb-4 shadow-lg text-xs font-bold border border-white/20 print:hidden">
          <div className="flex items-center">
            <span className="bg-white text-[#593996] px-2 py-0.5 rounded-full mr-2">142578</span>
            <span>الطالب : نبيل عبدالقادر علي</span>
          </div>
          <span className="bg-black/30 px-3 py-1 rounded-full">الصف : CLASS_NAME</span>
        </div>

        {/* The Document/Card */}
        <div ref={componentRef} className="bg-white w-full max-w-[800px] rounded-lg shadow-2xl overflow-hidden border-4 border-amber-100/50 relative print:shadow-none print:border-none print:max-w-none print:w-full print:p-4">
          {/* Watermark/Background Pattern simulation */}
          <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-900 via-transparent to-transparent"></div>
          
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
      <div className="absolute bottom-16 left-0 right-0 flex justify-between px-4 pointer-events-none print:hidden">
        <div className="bg-[#482880]/80 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-xs font-bold pointer-events-auto flex items-center shadow-lg border border-white/20">
          عرض قابل للتكبير والتحريك
        </div>
        <div className="flex space-x-2 space-x-reverse pointer-events-auto">
          <button className="w-10 h-10 bg-[#482880]/80 backdrop-blur-md text-white rounded-full flex items-center justify-center shadow-lg border border-white/20 hover:bg-[#593996]">
            <PanelTop className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 bg-[#482880]/80 backdrop-blur-md text-white rounded-full flex items-center justify-center shadow-lg border border-white/20 hover:bg-[#593996]">
            <Maximize2 className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 bg-[#482880]/80 backdrop-blur-md text-white rounded-full flex items-center justify-center shadow-lg border border-white/20 hover:bg-[#593996]">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Bottom Navigation (Student Scroller) */}
      <div className="bg-[#593996] text-white p-2 pb-safe flex flex-col z-20 print:hidden">
        <div className="flex justify-between items-center text-xs font-bold px-2 mb-2">
          <span>التنقل بين الطلاب</span>
          <span className="bg-white/20 px-2 py-0.5 rounded-full">4</span>
        </div>
        <div className="flex space-x-2 space-x-reverse overflow-x-auto hide-scrollbar pb-1">
          <button className="bg-white text-[#593996] px-4 py-2 rounded-xl text-sm font-bold shadow-md flex items-center whitespace-nowrap min-w-max">
            <span className="bg-[#593996] text-white w-5 h-5 rounded-full flex items-center justify-center text-xs mr-2">1</span>
            نبيل عبدالقادر علي
          </button>
          <button className="bg-white/10 text-white px-4 py-2 rounded-xl text-sm font-bold border border-white/20 flex items-center whitespace-nowrap min-w-max">
            <span className="bg-white/20 w-5 h-5 rounded-full flex items-center justify-center text-xs mr-2">2</span>
            محمد أحمد علي عبدالله...
          </button>
          <button className="bg-white/10 text-white px-4 py-2 rounded-xl text-sm font-bold border border-white/20 flex items-center whitespace-nowrap min-w-max">
            <span className="bg-white/20 w-5 h-5 rounded-full flex items-center justify-center text-xs mr-2">3</span>
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
