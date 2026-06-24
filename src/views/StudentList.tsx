import { ArrowRight, Search, Plus, Trash2, Edit3, Eye } from 'lucide-react';
import { ViewState } from '../types';

interface StudentListProps {
  setView: (view: ViewState) => void;
}

export default function StudentList({ setView }: StudentListProps) {
  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* Top Bar */}
      <div className="flex items-center p-4">
        <div className="flex-1 text-center">
          <h1 className="font-bold text-gray-900 text-lg">عرض سجلات الطلاب</h1>
        </div>
        <button onClick={() => setView('home')} className="absolute right-4 p-1">
          <ArrowRight className="w-6 h-6 text-gray-500" />
        </button>
      </div>

      {/* Search and Add */}
      <div className="px-4 pb-2">
        <div className="flex items-center gap-2">
          <button className="bg-[#1a5b48] text-white px-4 py-2 rounded-lg font-bold shadow-sm whitespace-nowrap">
            إضافة
          </button>
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="بحث بالاسم أو رقم الجلوس"
              className="w-full border border-gray-300 rounded-lg py-2 px-4 text-sm text-right focus:outline-none focus:border-[#4a2b85]"
              dir="rtl"
            />
          </div>
        </div>
        <div className="flex justify-between items-center mt-2 text-xs text-gray-500 px-1">
          <span>السجلات: 2 • الظاهر: 2</span>
        </div>
      </div>

      {/* List Area */}
      <div className="flex-1 overflow-auto bg-gray-50 px-2 pb-4 space-y-3">
        {/* Student Card 1 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-3 border-b border-gray-100 flex justify-between items-start">
            <div className="flex flex-col gap-1 w-full text-right">
              <div className="flex justify-between items-center w-full">
                <span className="bg-orange-100 text-orange-800 text-xs px-2 py-0.5 rounded-full font-bold self-start">ذكر</span>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-gray-900 text-base">محمد عبدالله احمد علي الصبري</h3>
                  <span className="text-[#c16857] font-bold">1</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 ml-auto">تعز • مشرعه وحدنان • 01/01/2009</p>
            </div>
          </div>
          
          <div className="px-3 py-2 bg-[#f8f9fa] border-b border-gray-100 flex justify-between items-center text-sm font-bold">
            <div className="flex items-center text-teal-700 bg-teal-50 px-2 py-0.5 rounded text-xs border border-teal-100">
              مقعد: <span className="mr-1">—</span>
            </div>
            <div className="flex gap-2">
              <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded text-xs border border-blue-100">2025 / 2026</span>
            </div>
          </div>

          <div className="p-3 text-right text-xs text-gray-700 space-y-1.5 leading-relaxed">
            <p className="font-bold text-gray-900 text-sm">شعيب المجبرين</p>
            <p>الميلاد : 01/01/2009 • تعز • مشرعه وحدنان</p>
            <p>ولي الأمر : عبدالله احمد علي</p>
            <p>سادس : 2022 / 2023 • شعيب المجبرين • تعز • مشرعه وحدنان</p>
            <p>سابع : 2023 / 2024 • شعيب المجبرين • تعز • مشرعه وحدنان</p>
            <p>ثامن : 2024 / 2025 • شعيب المجبرين • تعز • مشرعه وحدنان</p>
          </div>

          <div className="flex bg-gray-50 border-t border-gray-200">
            <button className="flex-1 py-2.5 text-center text-xs font-bold text-gray-600 hover:bg-gray-100 border-l border-gray-200">
              إخفاء
            </button>
            <button className="flex-1 py-2.5 text-center text-xs font-bold text-teal-600 hover:bg-gray-100 border-l border-gray-200">
              تعديل
            </button>
            <button className="flex-1 py-2.5 text-center text-xs font-bold text-red-600 hover:bg-gray-100">
              حذف
            </button>
          </div>
        </div>

        {/* Student Card 2 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden opacity-90">
          <div className="p-3 border-b border-gray-100 flex justify-between items-start">
            <div className="flex flex-col gap-1 w-full text-right">
              <div className="flex justify-between items-center w-full">
                <span className="bg-orange-100 text-orange-800 text-xs px-2 py-0.5 rounded-full font-bold self-start">ذكر</span>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-gray-900 text-base">محمد نبيل عبدالقادر سعيد عبدالاله</h3>
                  <span className="text-[#c16857] font-bold">2</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 ml-auto">تعز • مشرعه وحدنان • 01/01/2009</p>
            </div>
          </div>

          <div className="flex bg-gray-50 border-t border-gray-200">
            <button className="flex-1 py-2.5 text-center text-xs font-bold text-gray-600 hover:bg-gray-100 border-l border-gray-200">
              تفاصيل
            </button>
            <button className="flex-1 py-2.5 text-center text-xs font-bold text-teal-600 hover:bg-gray-100 border-l border-gray-200">
              تعديل
            </button>
            <button className="flex-1 py-2.5 text-center text-xs font-bold text-red-600 hover:bg-gray-100">
              حذف
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
