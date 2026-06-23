import { ArrowRight, Printer, Settings, Users, Edit3, Type, Save } from 'lucide-react';
import { ViewState, Student } from '../types';
import { useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

interface MonthlyResultsProps {
  setView: (view: ViewState) => void;
}

const mockStudents: Student[] = [
  { id: 1, name: 'أبرار دارس عبدالله محمد رضوان', homework: 0, attendance: 0, oral: 'غ', written: 'غ', total: 0, final: 0 },
  { id: 2, name: 'أديبة محمد عبدالله محمود', homework: 12, attendance: 13, oral: 14, written: 15, total: 54, final: 11 },
  { id: 3, name: 'أربكان محمد رضوان أحمد رضوان', homework: 14, attendance: 14, oral: 14, written: 14, total: 56, final: 11 },
  { id: 4, name: 'أركان محمد سعد الحاج حسين المشيرعي', homework: 12, attendance: 15, oral: 15, written: 17, total: 59, final: 12 },
  { id: 5, name: 'أروى ماجد حيدر ناصر الذراع', homework: 13, attendance: 12, oral: 14, written: 16, total: 55, final: 11 },
  { id: 6, name: 'أروى منير غانم علي المشيرعي', homework: 15, attendance: 15, oral: 15, written: 15, total: 60, final: 12 },
  { id: 7, name: 'إسماعيل فتح صالح سعد جابر', homework: 15, attendance: '', oral: '', written: '', total: 15, final: 3 },
  { id: 8, name: 'آلاف جمال محمد حسن الركب', homework: 0, attendance: 0, oral: 0, written: 0, total: 0, final: 0 },
  { id: 9, name: 'أمان نوح عبدالرحيم علي رضوان', homework: 0, attendance: 0, oral: 0, written: 0, total: 0, final: 0 },
  { id: 10, name: 'أمل عوض قائد أحمد الركب', homework: 0, attendance: 0, oral: 0, written: 0, total: 0, final: 0 },
  { id: 11, name: 'أيمن أمين محمد حسين العديني', homework: 0, attendance: 0, oral: 0, written: 0, total: 0, final: 0 },
  { id: 12, name: 'أيمن محمد عبدالله محمد الفقيه', homework: 0, attendance: 0, oral: 0, written: 0, total: 0, final: 0 },
  { id: 13, name: 'بليغ محمد عمر محمد المشيرعي', homework: 0, attendance: 0, oral: 0, written: 0, total: 0, final: 0 },
  { id: 14, name: 'ثريا سفيان محمد حسن محمد', homework: 0, attendance: 0, oral: 0, written: 0, total: 0, final: 0 },
  { id: 15, name: 'خالد علي محمد عز الدين المشيرعي', homework: 'غ', attendance: 'غ', oral: 'غ', written: 'غ', total: 0, final: 0 },
];

export default function MonthlyResults({ setView }: MonthlyResultsProps) {
  const [activeTab, setActiveTab] = useState(1);
  const componentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: 'محصلات_شهرية',
  });

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200 print:hidden">
        <button onClick={() => setView('home')} className="p-2 rounded-full hover:bg-gray-100">
          <ArrowRight className="w-5 h-5 text-gray-700" />
        </button>
        <div className="text-center flex-1">
          <h1 className="font-bold text-gray-900">محصلات الصف : السادس</h1>
          <p className="text-xs text-gray-500">المادة : اللغة العربية</p>
        </div>
        <button onClick={() => handlePrint()} className="w-10 h-10 rounded-full bg-[#593996] flex items-center justify-center text-white shadow-md">
          <Printer className="w-5 h-5" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 text-sm font-bold print:hidden">
        {[1, 2, 3].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 text-center transition-colors relative ${
              activeTab === tab ? 'text-black' : 'text-gray-400'
            }`}
          >
            {tab === 1 ? 'الشهر الأول' : tab === 2 ? 'الشهر الثاني' : 'الشهر الثالث'}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-black rounded-t-md mx-4"></div>
            )}
          </button>
        ))}
      </div>

      {/* Table Area */}
      <div ref={componentRef} className="flex-1 overflow-auto bg-gray-50 print:bg-white print:overflow-visible">
        <div className="hidden print:block text-center mb-4 pt-4">
          <h1 className="font-bold text-xl text-gray-900">محصلات الصف : السادس</h1>
          <p className="text-lg text-gray-600">المادة : اللغة العربية - الشهر {activeTab}</p>
        </div>
        <table className="w-full text-xs text-center border-collapse">
          <thead className="bg-gray-100 sticky top-0 z-10 shadow-sm text-gray-700">
            <tr>
              <th className="py-2 px-1 border-b border-l border-gray-200 w-8">م</th>
              <th className="py-2 px-2 border-b border-l border-gray-200 text-right">إسم الطالب رباعيا</th>
              <th className="py-2 px-1 border-b border-l border-gray-200 w-10"><div className="-rotate-90 whitespace-nowrap h-16 flex items-center justify-center">الواجبات</div></th>
              <th className="py-2 px-1 border-b border-l border-gray-200 w-10"><div className="-rotate-90 whitespace-nowrap h-16 flex items-center justify-center">المواظبة</div></th>
              <th className="py-2 px-1 border-b border-l border-gray-200 w-10"><div className="-rotate-90 whitespace-nowrap h-16 flex items-center justify-center">الشفهي</div></th>
              <th className="py-2 px-1 border-b border-l border-gray-200 w-10"><div className="-rotate-90 whitespace-nowrap h-16 flex items-center justify-center">التحريري</div></th>
              <th className="py-2 px-1 border-b border-l border-gray-200 w-10 bg-blue-50 font-bold"><div className="-rotate-90 whitespace-nowrap h-16 flex items-center justify-center">المجموع</div></th>
              <th className="py-2 px-1 border-b border-gray-200 w-10 bg-red-50 font-bold"><div className="-rotate-90 whitespace-nowrap h-16 flex items-center justify-center">المحصلة</div></th>
            </tr>
            <tr className="bg-white font-bold text-gray-500 border-b-2 border-gray-300">
              <th className="py-1 border-l border-gray-200"></th>
              <th className="py-1 border-l border-gray-200"></th>
              <th className="py-1 border-l border-gray-200">20</th>
              <th className="py-1 border-l border-gray-200">20</th>
              <th className="py-1 border-l border-gray-200">20</th>
              <th className="py-1 border-l border-gray-200">40</th>
              <th className="py-1 border-l border-gray-200 bg-blue-50">100</th>
              <th className="py-1 bg-red-50">20</th>
            </tr>
          </thead>
          <tbody>
            {mockStudents.map((student, idx) => (
              <tr key={student.id} className={`border-b border-gray-200 hover:bg-purple-50 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                <td className="py-2 px-1 border-l border-gray-200 font-bold text-gray-500">{student.id}</td>
                <td className="py-2 px-2 border-l border-gray-200 text-right font-medium text-gray-900">{student.name}</td>
                <td className={`py-2 px-1 border-l border-gray-200 ${student.homework === 'غ' ? 'text-red-500 font-bold' : ''}`}>{student.homework}</td>
                <td className={`py-2 px-1 border-l border-gray-200 ${student.attendance === 'غ' ? 'text-red-500 font-bold' : ''}`}>{student.attendance}</td>
                <td className={`py-2 px-1 border-l border-gray-200 ${student.oral === 'غ' ? 'text-red-500 font-bold' : ''}`}>{student.oral}</td>
                <td className={`py-2 px-1 border-l border-gray-200 ${student.written === 'غ' ? 'text-red-500 font-bold' : ''}`}>{student.written}</td>
                <td className="py-2 px-1 border-l border-gray-200 bg-blue-50/30 font-bold">{student.total}</td>
                <td className="py-2 px-1 bg-red-50/30 font-bold">{student.final}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bottom Navigation */}
      <div className="bg-[#4a2b85] text-white flex rounded-t-xl overflow-hidden shadow-[0_-4px_10px_rgba(0,0,0,0.1)] print:hidden">
        <button className="flex-1 py-3 flex flex-col items-center justify-center hover:bg-white/10 transition-colors">
          <Type className="w-5 h-5 mb-1" />
          <span className="text-[10px] font-bold">لغة الأرقام</span>
        </button>
        <button className="flex-1 py-3 flex flex-col items-center justify-center border-r border-white/20 hover:bg-white/10 transition-colors">
          <Settings className="w-5 h-5 mb-1" />
          <span className="text-[10px] font-bold">إعدادات</span>
        </button>
        <button className="flex-1 py-3 flex flex-col items-center justify-center border-r border-white/20 hover:bg-white/10 transition-colors">
          <Printer className="w-5 h-5 mb-1" />
          <span className="text-[10px] font-bold">الطباعة</span>
        </button>
        <button className="flex-1 py-3 flex flex-col items-center justify-center border-r border-white/20 bg-white/10 hover:bg-white/20 transition-colors relative">
          <Edit3 className="w-5 h-5 mb-1" />
          <span className="text-[10px] font-bold">إدخال الدرجات</span>
          <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full m-2"></div>
        </button>
        <button className="flex-1 py-3 flex flex-col items-center justify-center border-r border-white/20 hover:bg-white/10 transition-colors">
          <Users className="w-5 h-5 mb-1" />
          <span className="text-[10px] font-bold">الطلاب</span>
        </button>
      </div>
    </div>
  );
}
