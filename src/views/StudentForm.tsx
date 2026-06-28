import { ArrowRight, ChevronDown, Sparkles } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { ViewState, Student } from '../types';
import { useStore } from '../store';

const COMMON_NAMES = [
  { name: 'أحمد محمد علي', gender: 'ذكر', birthPlace: 'صنعاء' },
  { name: 'فاطمة عبدالله صالح', gender: 'أنثى', birthPlace: 'تعز' },
  { name: 'عمر خالد حسن', gender: 'ذكر', birthPlace: 'عدن' },
  { name: 'سارة عبدالرحمن', gender: 'أنثى', birthPlace: 'إب' },
  { name: 'علي يحيى منصور', gender: 'ذكر', birthPlace: 'صنعاء' }
];

interface StudentFormProps {
  setView: (view: ViewState) => void;
}

export default function StudentForm({ setView }: StudentFormProps) {
  const { addStudent, updateStudent, students, editingStudentId } = useStore();
  const [showPredictions, setShowPredictions] = useState(false);
  
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
    <div className="flex flex-col h-full bg-[#121619] relative text-gray-200">
      {/* Top Bar */}
      <div className="bg-[#0f291e]/90 backdrop-blur-xl text-white flex items-center justify-between p-4 shadow-[0_4px_30px_rgba(16,185,129,0.15)] z-10 sticky top-0 border-b border-emerald-500/20">
        <button onClick={() => setView('student_list')} className="p-2 hover:bg-white/10 rounded-xl transition-colors group">
          <ArrowRight className="w-5 h-5 text-emerald-400 group-hover:text-emerald-300" />
        </button>
        <div className="text-center flex-1">
          <h1 className="font-black text-lg text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 tracking-wide">إدخال بيانات الطالب</h1>
          <p className="text-xs text-emerald-300/80">سجل {editingStudentId ? 'تعديل' : 'جديد'}</p>
        </div>
        <div className="w-9"></div> {/* Spacer for centering */}
      </div>

      <div className="flex-1 overflow-auto p-4 md:p-8 w-full max-w-3xl mx-auto space-y-6 text-right pb-32" dir="rtl">
        
        {/* Basic Info Section */}
        <div className="bg-[#1a2320]/60 backdrop-blur-xl p-6 rounded-3xl shadow-[0_0_30px_rgba(16,185,129,0.1)] border border-emerald-500/20 space-y-4">
          <h2 className="font-bold text-teal-400 text-base border-b border-emerald-500/30 pb-3 flex items-center gap-2">
            البيانات الأساسية
          </h2>
          <div className="relative">
            <label className="text-sm font-bold text-gray-400 block mb-2 flex items-center gap-2">
              اسم الطالب رباعياً
              <span className="text-xs bg-gradient-to-r from-emerald-500 to-teal-500 text-transparent bg-clip-text font-black flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-teal-400" /> إدخال تنبؤي ذكي
              </span>
            </label>
            <input 
              type="text" 
              value={formData.name}
              onFocus={() => setShowPredictions(true)}
              onBlur={() => setTimeout(() => setShowPredictions(false), 200)}
              onChange={e => {
                setFormData({...formData, name: e.target.value});
                setShowPredictions(true);
              }}
              className="w-full border border-emerald-500/30 rounded-2xl py-3 px-4 text-base bg-[#0a1712]/50 text-white focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all" 
              placeholder="اكتب الحرف الأول..."
            />
            {showPredictions && formData.name && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-gray-900 border border-purple-500/30 rounded-xl overflow-hidden shadow-2xl z-50">
                {COMMON_NAMES.filter(n => n.name.startsWith(formData.name || '')).map((prediction, idx) => (
                  <div 
                    key={idx}
                    className="p-3 hover:bg-purple-900/40 cursor-pointer text-gray-200 border-b border-gray-800 last:border-0 flex justify-between items-center transition-colors"
                    onClick={() => {
                      setFormData({
                        ...formData, 
                        name: prediction.name, 
                        gender: prediction.gender as 'ذكر' | 'أنثى',
                        birthPlace: prediction.birthPlace
                      });
                      setShowPredictions(false);
                    }}
                  >
                    <span className="font-bold text-cyan-400">{prediction.name}</span>
                    <span className="text-xs text-gray-500">إكمال تلقائي للبيانات ⚡</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-bold text-gray-400 block mb-2">الجنس</label>
              <select 
                value={formData.gender}
                onChange={e => setFormData({...formData, gender: e.target.value as any})}
                className="w-full border border-purple-500/30 rounded-2xl py-3 px-4 text-base bg-black/50 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all appearance-none"
              >
                <option value="ذكر">ذكر</option>
                <option value="أنثى">أنثى</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-bold text-gray-400 block mb-2">تاريخ الميلاد</label>
              <input 
                type="date" 
                value={formData.birthDate}
                onChange={e => setFormData({...formData, birthDate: e.target.value})}
                className="w-full border border-purple-500/30 rounded-2xl py-3 px-4 text-base bg-black/50 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all" 
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-bold text-gray-400 block mb-2">مكان الميلاد</label>
            <input 
              type="text" 
              value={formData.birthPlace}
              onChange={e => setFormData({...formData, birthPlace: e.target.value})}
              className="w-full border border-purple-500/30 rounded-2xl py-3 px-4 text-base bg-black/50 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all" 
            />
          </div>
          <div>
            <label className="text-sm font-bold text-gray-400 block mb-2">ولي الأمر</label>
            <input 
              type="text" 
              value={formData.guardian}
              onChange={e => setFormData({...formData, guardian: e.target.value})}
              className="w-full border border-purple-500/30 rounded-2xl py-3 px-4 text-base bg-black/50 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all" 
            />
          </div>
          <div>
             <label className="text-sm font-bold text-gray-400 block mb-2">العام الدراسي</label>
             <div className="relative">
                <select 
                  value={formData.schoolYear}
                  onChange={e => setFormData({...formData, schoolYear: e.target.value})}
                  className="w-full border border-purple-500/30 rounded-2xl py-3 px-4 text-base bg-black/50 text-white text-right focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all appearance-none"
                >
                  <option>2025 / 2026</option>
                  <option>2024 / 2025</option>
                </select>
                <ChevronDown className="w-5 h-5 text-purple-400 absolute left-4 top-3.5 pointer-events-none" />
             </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-gray-900/90 backdrop-blur-xl p-4 border-t border-purple-500/30 flex justify-between gap-4 z-20" dir="rtl">
        <button onClick={handleSave} className="flex-1 bg-gradient-to-r from-purple-600 to-cyan-600 text-white py-4 rounded-2xl font-bold text-base shadow-[0_0_15px_rgba(147,51,234,0.3)] hover:from-purple-500 hover:to-cyan-500 hover:shadow-[0_0_25px_rgba(34,211,238,0.4)] transition-all">
          حفظ البيانات
        </button>
        <button onClick={() => setView('student_list')} className="flex-1 bg-black/50 text-gray-300 py-4 rounded-2xl font-bold text-base border border-purple-500/30 hover:bg-gray-800 hover:text-white transition-all">
          إلغاء
        </button>
      </div>

    </div>
  );
}
