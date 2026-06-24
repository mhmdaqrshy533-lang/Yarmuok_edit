import { ArrowRight, ChevronDown } from 'lucide-react';
import { ViewState } from '../types';

interface StudentFormProps {
  setView: (view: ViewState) => void;
}

export default function StudentForm({ setView }: StudentFormProps) {
  return (
    <div className="flex flex-col h-full bg-gray-50 relative">
      {/* Top Bar */}
      <div className="bg-[#1a3a6c] text-white flex items-center justify-between p-4 shadow-md z-10 rounded-b-xl">
        <button onClick={() => setView('progress_dashboard')} className="p-1 hover:bg-white/10 rounded-full">
          <ArrowRight className="w-5 h-5 text-white" />
        </button>
        <div className="text-center flex-1">
          <h1 className="font-bold text-lg">إدخال مختصر للطلاب</h1>
          <p className="text-xs text-blue-200">سجل جديد</p>
        </div>
        <div className="w-6"></div> {/* Spacer for centering */}
      </div>

      <div className="flex-1 overflow-auto p-4 pb-20 space-y-4">
        
        {/* Main Settings Section */}
        <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
          <div className="text-right mb-2">
             <label className="text-xs font-bold text-gray-500 block mb-1">العام الدراسي</label>
             <div className="relative">
                <select className="w-full appearance-none border border-gray-300 rounded-md py-2 px-3 text-sm text-right text-gray-800 bg-white" dir="rtl">
                  <option>2025 / 2026</option>
                </select>
                <ChevronDown className="w-4 h-4 text-gray-400 absolute left-3 top-2.5 pointer-events-none" />
             </div>
          </div>
        </div>

        {/* Card Grades Section */}
        <div className="text-right">
          <h2 className="font-bold text-[#1a3a6c] mb-3 pr-1 text-sm">بطاقة السادس والسابع والثامن</h2>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 space-y-5">
            {/* 6th Grade */}
            <div>
              <h3 className="font-bold text-gray-800 text-sm mb-3">السادس</h3>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <div className="relative">
                    <select className="w-full appearance-none border-b border-gray-300 py-1 px-2 text-sm text-right text-gray-800 bg-transparent focus:outline-none focus:border-[#1a3a6c]" dir="rtl">
                      <option>2022 / 2023</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-gray-400 absolute left-1 top-1.5 pointer-events-none" />
                  </div>
                  <label className="text-[10px] text-gray-400 block mt-1 text-center">العام الدراسي</label>
                </div>
                <div>
                  <input type="text" defaultValue="شعيب المجبرين" className="w-full border border-gray-300 rounded py-1.5 px-2 text-sm text-center text-gray-800 focus:outline-none focus:border-[#1a3a6c]" />
                  <label className="text-[10px] text-gray-400 block mt-1 text-center">المدرسة</label>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <input type="text" defaultValue="تعز" className="w-full border border-gray-300 rounded py-1.5 px-2 text-sm text-center text-gray-800 focus:outline-none focus:border-[#1a3a6c]" />
                  <label className="text-[10px] text-gray-400 block mt-1 text-center">المحافظة</label>
                </div>
                <div>
                  <input type="text" defaultValue="مشرعه وحدنان" className="w-full border border-gray-300 rounded py-1.5 px-2 text-sm text-center text-gray-800 focus:outline-none focus:border-[#1a3a6c]" />
                  <label className="text-[10px] text-gray-400 block mt-1 text-center">المديرية</label>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-100"></div>

            {/* 7th Grade */}
            <div>
              <h3 className="font-bold text-gray-800 text-sm mb-3">السابع</h3>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <div className="relative">
                    <select className="w-full appearance-none border-b border-gray-300 py-1 px-2 text-sm text-right text-gray-800 bg-transparent focus:outline-none focus:border-[#1a3a6c]" dir="rtl">
                      <option>2023 / 2024</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-gray-400 absolute left-1 top-1.5 pointer-events-none" />
                  </div>
                  <label className="text-[10px] text-gray-400 block mt-1 text-center">العام الدراسي</label>
                </div>
                <div>
                  <input type="text" defaultValue="شعيب المجبرين" className="w-full border border-gray-300 rounded py-1.5 px-2 text-sm text-center text-gray-800 focus:outline-none focus:border-[#1a3a6c]" />
                  <label className="text-[10px] text-gray-400 block mt-1 text-center">المدرسة</label>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <input type="text" defaultValue="تعز" className="w-full border border-gray-300 rounded py-1.5 px-2 text-sm text-center text-gray-800 focus:outline-none focus:border-[#1a3a6c]" />
                  <label className="text-[10px] text-gray-400 block mt-1 text-center">المحافظة</label>
                </div>
                <div>
                  <input type="text" defaultValue="مشرعه وحدنان" className="w-full border border-gray-300 rounded py-1.5 px-2 text-sm text-center text-gray-800 focus:outline-none focus:border-[#1a3a6c]" />
                  <label className="text-[10px] text-gray-400 block mt-1 text-center">المديرية</label>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-100"></div>

            {/* 8th Grade */}
            <div>
              <h3 className="font-bold text-gray-800 text-sm mb-3">الثامن</h3>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <div className="relative">
                    <select className="w-full appearance-none border-b border-gray-300 py-1 px-2 text-sm text-right text-gray-800 bg-transparent focus:outline-none focus:border-[#1a3a6c]" dir="rtl">
                      <option>2024 / 2025</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-gray-400 absolute left-1 top-1.5 pointer-events-none" />
                  </div>
                  <label className="text-[10px] text-gray-400 block mt-1 text-center">العام الدراسي</label>
                </div>
                <div>
                  <input type="text" defaultValue="شعيب المجبرين" className="w-full border border-gray-300 rounded py-1.5 px-2 text-sm text-center text-gray-800 focus:outline-none focus:border-[#1a3a6c]" />
                  <label className="text-[10px] text-gray-400 block mt-1 text-center">المدرسة</label>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <input type="text" defaultValue="تعز" className="w-full border border-gray-300 rounded py-1.5 px-2 text-sm text-center text-gray-800 focus:outline-none focus:border-[#1a3a6c]" />
                  <label className="text-[10px] text-gray-400 block mt-1 text-center">المحافظة</label>
                </div>
                <div>
                  <input type="text" defaultValue="مشرعه وحدنان" className="w-full border border-gray-300 rounded py-1.5 px-2 text-sm text-center text-gray-800 focus:outline-none focus:border-[#1a3a6c]" />
                  <label className="text-[10px] text-gray-400 block mt-1 text-center">المديرية</label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Completion Card */}
        <div className="text-right mt-4">
          <h2 className="font-bold text-[#1a3a6c] mb-3 pr-1 text-sm">بطاقة الإكمال والملاحظات</h2>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <input type="text" placeholder="رقم جلوس الإكمال" className="w-full border border-gray-300 rounded py-1.5 px-2 text-sm text-center text-gray-800 focus:outline-none focus:border-[#1a3a6c]" />
              </div>
              <div>
                <div className="relative">
                  <select className="w-full appearance-none border border-gray-300 rounded py-1.5 px-2 text-sm text-right text-gray-800 bg-transparent focus:outline-none focus:border-[#1a3a6c]" dir="rtl">
                    <option>عام الإكمال</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-400 absolute left-2 top-2 pointer-events-none" />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <input type="text" placeholder="مادة الإكمال الأولى" className="w-full border border-gray-300 rounded py-1.5 px-2 text-sm text-center text-gray-800 focus:outline-none focus:border-[#1a3a6c]" />
              </div>
              <div>
                <input type="text" placeholder="مادة الإكمال الثانية" className="w-full border border-gray-300 rounded py-1.5 px-2 text-sm text-center text-gray-800 focus:outline-none focus:border-[#1a3a6c]" />
              </div>
            </div>
            <div>
              <input type="text" placeholder="ملاحظات" className="w-full border border-gray-300 rounded py-1.5 px-2 text-sm text-right text-gray-800 focus:outline-none focus:border-[#1a3a6c]" dir="rtl" />
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Action Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-white p-3 border-t border-gray-200 flex justify-between gap-2 z-20">
        <button className="flex-1 bg-[#1a3a6c] text-white py-3 rounded-lg font-bold text-sm">
          حفظ
        </button>
        <button className="flex-1 bg-[#f4f7f6] text-gray-700 py-3 rounded-lg font-bold text-sm">
          التالي
        </button>
        <button className="flex-1 bg-[#ffebe6] text-[#c16857] py-3 rounded-lg font-bold text-sm">
          حذف
        </button>
        <button className="flex-1 bg-[#e4eef6] text-[#1a3a6c] py-3 rounded-lg font-bold text-sm">
          السابق
        </button>
      </div>

    </div>
  );
}
