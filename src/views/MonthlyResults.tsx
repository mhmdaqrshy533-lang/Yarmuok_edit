import { ArrowRight, Printer, Settings, Users, Edit3, Type, Save } from 'lucide-react';
import { ViewState, Student, MonthGrades } from '../types';
import { useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { useStore } from '../store';

interface MonthlyResultsProps {
  setView: (view: ViewState) => void;
}

export default function MonthlyResults({ setView }: MonthlyResultsProps) {
  const { students, updateGrade } = useStore();
  const [activeTab, setActiveTab] = useState<'month1' | 'month2' | 'month3'>('month1');
  const [editingCell, setEditingCell] = useState<{ studentId: string; field: keyof MonthGrades } | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const componentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: 'محصلات_شهرية',
  });

  const handleCellClick = (studentId: string, field: keyof MonthGrades, currentValue: number | null) => {
    setEditingCell({ studentId, field });
    setEditValue(currentValue !== null ? currentValue.toString() : '');
  };

  const handleBlur = () => {
    if (editingCell) {
      const numValue = editValue === '' ? null : parseInt(editValue, 10);
      updateGrade(editingCell.studentId, activeTab, editingCell.field, isNaN(numValue as any) ? null : numValue);
    }
    setEditingCell(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBlur();
    }
  };

  const calculateTotal = (grades?: MonthGrades) => {
    if (!grades) return 0;
    return (grades.homework || 0) + (grades.attendance || 0) + (grades.oral || 0) + (grades.written || 0);
  };

  const calculateFinal = (total: number) => {
    return Math.round(total / 5); // Example calculation
  };

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
        {(['month1', 'month2', 'month3'] as const).map((tab, idx) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 text-center transition-colors relative ${
              activeTab === tab ? 'text-black' : 'text-gray-400'
            }`}
          >
            {idx === 0 ? 'الشهر الأول' : idx === 1 ? 'الشهر الثاني' : 'الشهر الثالث'}
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
          <p className="text-lg text-gray-600">المادة : اللغة العربية - {activeTab === 'month1' ? 'الشهر الأول' : activeTab === 'month2' ? 'الشهر الثاني' : 'الشهر الثالث'}</p>
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
            {students.map((student, idx) => {
              const grades = student.grades?.[activeTab];
              const total = calculateTotal(grades);
              const final = calculateFinal(total);

              const renderCell = (field: keyof MonthGrades, value: number | null) => {
                const isEditing = editingCell?.studentId === student.id && editingCell?.field === field;
                if (isEditing) {
                  return (
                    <input
                      type="number"
                      autoFocus
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onBlur={handleBlur}
                      onKeyDown={handleKeyDown}
                      className="w-full text-center bg-transparent focus:outline-none focus:ring-1 ring-[#593996]"
                    />
                  );
                }
                return (
                  <div 
                    onClick={() => handleCellClick(student.id, field, value)}
                    className="w-full h-full cursor-pointer hover:bg-purple-100 min-h-[20px]"
                  >
                    {value === null ? '' : value}
                  </div>
                );
              };

              return (
                <tr key={student.id} className={`border-b border-gray-200 hover:bg-purple-50 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                  <td className="py-2 px-1 border-l border-gray-200 font-bold text-gray-500">{idx + 1}</td>
                  <td className="py-2 px-2 border-l border-gray-200 text-right font-medium text-gray-900">{student.name}</td>
                  <td className="py-2 px-1 border-l border-gray-200">{renderCell('homework', grades?.homework ?? null)}</td>
                  <td className="py-2 px-1 border-l border-gray-200">{renderCell('attendance', grades?.attendance ?? null)}</td>
                  <td className="py-2 px-1 border-l border-gray-200">{renderCell('oral', grades?.oral ?? null)}</td>
                  <td className="py-2 px-1 border-l border-gray-200">{renderCell('written', grades?.written ?? null)}</td>
                  <td className="py-2 px-1 border-l border-gray-200 bg-blue-50/30 font-bold">{total}</td>
                  <td className="py-2 px-1 bg-red-50/30 font-bold">{final}</td>
                </tr>
              );
            })}
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
        <button onClick={() => handlePrint()} className="flex-1 py-3 flex flex-col items-center justify-center border-r border-white/20 hover:bg-white/10 transition-colors">
          <Printer className="w-5 h-5 mb-1" />
          <span className="text-[10px] font-bold">الطباعة</span>
        </button>
        <button className="flex-1 py-3 flex flex-col items-center justify-center border-r border-white/20 bg-white/10 hover:bg-white/20 transition-colors relative">
          <Edit3 className="w-5 h-5 mb-1" />
          <span className="text-[10px] font-bold">إدخال الدرجات</span>
          <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full m-2"></div>
        </button>
        <button onClick={() => setView('student_list')} className="flex-1 py-3 flex flex-col items-center justify-center border-r border-white/20 hover:bg-white/10 transition-colors">
          <Users className="w-5 h-5 mb-1" />
          <span className="text-[10px] font-bold">الطلاب</span>
        </button>
      </div>
    </div>
  );
}
