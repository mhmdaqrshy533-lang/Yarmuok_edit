import { ArrowRight, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import { ViewState, Student } from '../types';
import { useStore } from '../store';

interface StudentFormProps {
  setView: (view: ViewState) => void;
}

export default function StudentForm({ setView }: StudentFormProps) {
  const { addStudent, updateStudent, students, editingStudentId } = useStore();
  
  const [formData, setFormData] = useState<Partial<Student>>({
    name: '',
    gender: 'ذكر',
    birthDate: '',
    birthPlace: '',
    guardian: '',
    schoolYear: '2025 / 2026'
  });

  useEffect(() => {
    if (editingStudentId) {
      const student = students.find(s => s.id === editingStudentId);
      if (student) {
        setFormData(student);
      }
    }
  }, [editingStudentId, students]);

  const handleSave = () => {
    if (!formData.name) {
      alert('يرجى إدخال اسم الطالب');
      return;
    }
    
    if (editingStudentId) {
      updateStudent(editingStudentId, formData);
    } else {
      const newStudent: Student = {
        id: Math.random().toString(36).substring(7),
        name: formData.name || '',
        gender: (formData.gender as 'ذكر' | 'أنثى') || 'ذكر',
        birthDate: formData.birthDate || '',
        birthPlace: formData.birthPlace || '',
        guardian: formData.guardian || '',
        schoolYear: formData.schoolYear || '2025 / 2026',
      };
      addStudent(newStudent);
    }
    setView('student_list');
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 relative">
      {/* Top Bar */}
      <div className="bg-[#1a3a6c] text-white flex items-center justify-between p-4 shadow-md z-10 rounded-b-xl">
        <button onClick={() => setView('student_list')} className="p-1 hover:bg-white/10 rounded-full">
          <ArrowRight className="w-5 h-5 text-white" />
        </button>
        <div className="text-center flex-1">
          <h1 className="font-bold text-lg">إدخال مختصر للطلاب</h1>
          <p className="text-xs text-blue-200">سجل جديد</p>
        </div>
        <div className="w-6"></div> {/* Spacer for centering */}
      </div>

      <div className="flex-1 overflow-auto p-4 pb-20 space-y-4 text-right" dir="rtl">
        
        {/* Basic Info Section */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 space-y-3">
          <h2 className="font-bold text-[#1a3a6c] text-sm border-b pb-2">البيانات الأساسية</h2>
          <div>
            <label className="text-xs font-bold text-gray-500 block mb-1">اسم الطالب رباعياً</label>
            <input 
              type="text" 
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:border-[#1a3a6c]" 
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-500 block mb-1">الجنس</label>
              <select 
                value={formData.gender}
                onChange={e => setFormData({...formData, gender: e.target.value as any})}
                className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:border-[#1a3a6c]"
              >
                <option value="ذكر">ذكر</option>
                <option value="أنثى">أنثى</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 block mb-1">تاريخ الميلاد</label>
              <input 
                type="date" 
                value={formData.birthDate}
                onChange={e => setFormData({...formData, birthDate: e.target.value})}
                className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:border-[#1a3a6c]" 
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 block mb-1">مكان الميلاد</label>
            <input 
              type="text" 
              value={formData.birthPlace}
              onChange={e => setFormData({...formData, birthPlace: e.target.value})}
              className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:border-[#1a3a6c]" 
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 block mb-1">ولي الأمر</label>
            <input 
              type="text" 
              value={formData.guardian}
              onChange={e => setFormData({...formData, guardian: e.target.value})}
              className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:border-[#1a3a6c]" 
            />
          </div>
          <div>
             <label className="text-xs font-bold text-gray-500 block mb-1">العام الدراسي</label>
             <div className="relative">
                <select 
                  value={formData.schoolYear}
                  onChange={e => setFormData({...formData, schoolYear: e.target.value})}
                  className="w-full appearance-none border border-gray-300 rounded-md py-2 px-3 text-sm text-right text-gray-800 bg-white"
                >
                  <option>2025 / 2026</option>
                  <option>2024 / 2025</option>
                </select>
                <ChevronDown className="w-4 h-4 text-gray-400 absolute left-3 top-2.5 pointer-events-none" />
             </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-white p-3 border-t border-gray-200 flex justify-between gap-2 z-20" dir="rtl">
        <button onClick={handleSave} className="flex-1 bg-[#1a3a6c] text-white py-3 rounded-lg font-bold text-sm">
          حفظ وإغلاق
        </button>
        <button onClick={() => setView('student_list')} className="flex-1 bg-[#f4f7f6] text-gray-700 py-3 rounded-lg font-bold text-sm border border-gray-300">
          إلغاء
        </button>
      </div>

    </div>
  );
}
