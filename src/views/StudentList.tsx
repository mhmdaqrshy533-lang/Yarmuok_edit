import { ArrowRight, Search, Plus, Trash2, Edit3, Eye } from 'lucide-react';
import { useState } from 'react';
import { ViewState } from '../types';
import { useStore } from '../store';

interface StudentListProps {
  setView: (view: ViewState) => void;
}

export default function StudentList({ setView }: StudentListProps) {
  const { students, deleteStudent, setEditingStudentId } = useStore();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStudents = students.filter(s => 
    s.name.includes(searchTerm) || (s.seatNumber && s.seatNumber.includes(searchTerm))
  );

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
          <button 
            onClick={() => {
              setEditingStudentId(null);
              setView('student_form');
            }}
            className="bg-[#1a5b48] text-white px-4 py-2 rounded-lg font-bold shadow-sm whitespace-nowrap"
          >
            إضافة
          </button>
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="بحث بالاسم أو رقم الجلوس"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-gray-300 rounded-lg py-2 px-4 text-sm text-right focus:outline-none focus:border-[#4a2b85]"
              dir="rtl"
            />
          </div>
        </div>
        <div className="flex justify-between items-center mt-2 text-xs text-gray-500 px-1">
          <span>السجلات: {students.length} • الظاهر: {filteredStudents.length}</span>
        </div>
      </div>

      {/* List Area */}
      <div className="flex-1 overflow-auto bg-gray-50 px-2 pb-4 space-y-3">
        {filteredStudents.map((student, index) => (
          <div key={student.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-3 border-b border-gray-100 flex justify-between items-start">
              <div className="flex flex-col gap-1 w-full text-right">
                <div className="flex justify-between items-center w-full">
                  <span className="bg-orange-100 text-orange-800 text-xs px-2 py-0.5 rounded-full font-bold self-start">{student.gender}</span>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-gray-900 text-base">{student.name}</h3>
                    <span className="text-[#c16857] font-bold">{index + 1}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 ml-auto">{student.birthPlace} • {student.birthDate}</p>
              </div>
            </div>
            
            <div className="px-3 py-2 bg-[#f8f9fa] border-b border-gray-100 flex justify-between items-center text-sm font-bold">
              <div className="flex items-center text-teal-700 bg-teal-50 px-2 py-0.5 rounded text-xs border border-teal-100">
                مقعد: <span className="mr-1">{student.seatNumber || '—'}</span>
              </div>
              <div className="flex gap-2">
                <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded text-xs border border-blue-100">{student.schoolYear}</span>
              </div>
            </div>

            <div className="p-3 text-right text-xs text-gray-700 space-y-1.5 leading-relaxed">
              <p className="font-bold text-gray-900 text-sm">{student.grade8?.school || student.grade7?.school || student.grade6?.school || 'غير محدد'}</p>
              <p>الميلاد : {student.birthDate} • {student.birthPlace}</p>
              <p>ولي الأمر : {student.guardian}</p>
              {student.grade6 && (
                <p>سادس : {student.grade6.year} • {student.grade6.school} • {student.grade6.governorate} • {student.grade6.directorate}</p>
              )}
              {student.grade7 && (
                <p>سابع : {student.grade7.year} • {student.grade7.school} • {student.grade7.governorate} • {student.grade7.directorate}</p>
              )}
              {student.grade8 && (
                <p>ثامن : {student.grade8.year} • {student.grade8.school} • {student.grade8.governorate} • {student.grade8.directorate}</p>
              )}
            </div>

            <div className="flex bg-gray-50 border-t border-gray-200">
              <button 
                onClick={() => {
                  setEditingStudentId(student.id);
                  setView('student_form');
                }}
                className="flex-1 py-2.5 text-center text-xs font-bold text-teal-600 hover:bg-gray-100 border-l border-gray-200"
              >
                تعديل
              </button>
              <button 
                onClick={() => {
                  if(confirm('هل أنت متأكد من حذف هذا السجل؟')) deleteStudent(student.id);
                }}
                className="flex-1 py-2.5 text-center text-xs font-bold text-red-600 hover:bg-gray-100"
              >
                حذف
              </button>
            </div>
          </div>
        ))}
        {filteredStudents.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            لا توجد سجلات مطابقة
          </div>
        )}
      </div>
    </div>
  );
}
