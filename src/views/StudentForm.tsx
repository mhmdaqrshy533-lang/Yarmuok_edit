import { ArrowRight, ChevronDown, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import { ViewState, Student } from '../types';
import { useStore } from '../store';

const COMMON_NAMES = [
  { name: 'أحمد محمد علي المقطري', gender: 'ذكر', birthPlace: 'صنعاء' },
  { name: 'فاطمة عبدالله صالح الحميري', gender: 'أنثى', birthPlace: 'تعز' },
  { name: 'عمر خالد حسن الأنسي', gender: 'ذكر', birthPlace: 'عدن' },
  { name: 'سارة عبدالرحمن الوصابي', gender: 'أنثى', birthPlace: 'إب' },
  { name: 'علي يحيى منصور الشميري', gender: 'ذكر', birthPlace: 'صنعاء' }
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
    seatNumber: '',
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
      alert('يرجى إدخال اسم الطالب ثلاثياً أو رباعياً على الأقل.');
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
        seatNumber: formData.seatNumber || '',
        schoolYear: formData.schoolYear || '2025 / 2026',
        grades: {}
      };
      addStudent(newStudent);
    }
    setView('student_list');
  };

  return (
    <div className="flex flex-col h-full bg-[#121619] relative text-gray-200 font-sans">
      {/* Top Bar */}
      <div className="bg-[#0f291e] text-white flex items-center justify-between p-4 shadow-[0_4px_30px_rgba(16,185,129,0.1)] z-10 sticky top-0 border-b border-emerald-900/50">
        <button onClick={() => setView('student_list')} className="p-2 hover:bg-emerald-950/40 rounded-xl transition-colors group">
          <ArrowRight className="w-5 h-5 text-emerald-400 group-hover:text-emerald-300" />
        </button>
        <div className="text-center flex-1">
          <h1 className="font-bold text-lg text-emerald-400">تسجيل وإدخال بيانات الطالب</h1>
          <p className="text-xs text-emerald-500">{editingStudentId ? 'تعديل السجل النشط' : 'إضافة طالب جديد'}</p>
        </div>
        <div className="w-9"></div>
      </div>

      <div className="flex-1 overflow-auto p-4 md:p-8 w-full max-w-3xl mx-auto space-y-6 text-right pb-32" dir="rtl">
        
        {/* Basic Info Section */}
        <div className="bg-[#1a2024] p-6 rounded-3xl border border-emerald-900/30 shadow-xl space-y-4">
          <h2 className="font-bold text-emerald-400 text-base border-b border-emerald-900/20 pb-3 flex items-center gap-2">
            <span>📝</span> البيانات الشخصية الأساسية
          </h2>

          <div className="relative">
            <label className="text-sm font-bold text-gray-300 block mb-2 flex items-center gap-2">
              اسم الطالب رباعياً
              <span className="text-xs bg-gradient-to-r from-emerald-400 to-emerald-500 text-transparent bg-clip-text font-black flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-400" /> تنبؤ ذكي مدمج
              </span>
            </label>
            <input 
              type="text" 
              value={formData.name}
              onFocus={() => setShowPredictions(true)}
              onBlur={() => setTimeout(() => setShowPredictions(false), 250)}
              onChange={e => {
                setFormData({...formData, name: e.target.value});
                setShowPredictions(true);
              }}
              className="w-full border border-emerald-900/30 rounded-2xl py-3 px-4 text-base bg-[#111517] text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-bold" 
              placeholder="اكتب اسم الطالب الكامل أو الحرف الأول للتنبؤ..."
            />
            {showPredictions && formData.name && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-[#151a1d] border border-emerald-900/50 rounded-xl overflow-hidden shadow-2xl z-50">
                {COMMON_NAMES.filter(n => n.name.startsWith(formData.name || '')).map((prediction, idx) => (
                  <div 
                    key={idx}
                    className="p-3 hover:bg-emerald-950/20 cursor-pointer text-gray-200 border-b border-[#1f282d] last:border-0 flex justify-between items-center transition-colors"
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
                    <span className="font-bold text-emerald-400">{prediction.name}</span>
                    <span className="text-[10px] text-emerald-600">إكمال تلقائي للبيانات ⚡</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-bold text-gray-300 block mb-2">الجنس</label>
              <select 
                value={formData.gender}
                onChange={e => setFormData({...formData, gender: e.target.value as any})}
                className="w-full border border-emerald-900/30 rounded-2xl py-3 px-4 text-base bg-[#111517] text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-bold appearance-none"
              >
                <option value="ذكر">ذكر</option>
                <option value="أنثى">أنثى</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-bold text-gray-300 block mb-2">تاريخ الميلاد</label>
              <input 
                type="date" 
                value={formData.birthDate}
                onChange={e => setFormData({...formData, birthDate: e.target.value})}
                className="w-full border border-emerald-900/30 rounded-2xl py-3 px-4 text-base bg-[#111517] text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-mono font-bold" 
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-bold text-gray-300 block mb-2">مكان الميلاد</label>
              <input 
                type="text" 
                value={formData.birthPlace}
                onChange={e => setFormData({...formData, birthPlace: e.target.value})}
                className="w-full border border-emerald-900/30 rounded-2xl py-3 px-4 text-base bg-[#111517] text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium" 
                placeholder="المحافظة / المدينة"
              />
            </div>
            <div>
              <label className="text-sm font-bold text-gray-300 block mb-2">رقم الجلوس / المقعد</label>
              <input 
                type="text" 
                value={formData.seatNumber}
                onChange={e => setFormData({...formData, seatNumber: e.target.value})}
                className="w-full border border-emerald-900/30 rounded-2xl py-3 px-4 text-base bg-[#111517] text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-mono font-bold" 
                placeholder="اختياري (أعمال الامتحانات)"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-bold text-gray-300 block mb-2">اسم ولي الأمر / الوصي</label>
            <input 
              type="text" 
              value={formData.guardian}
              onChange={e => setFormData({...formData, guardian: e.target.value})}
              className="w-full border border-emerald-900/30 rounded-2xl py-3 px-4 text-base bg-[#111517] text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium" 
              placeholder="الاسم الكامل لولي الأمر ورقم الهاتف"
            />
          </div>

          <div>
             <label className="text-sm font-bold text-gray-300 block mb-2">العام الدراسي للمقيد</label>
             <div className="relative">
                <select 
                  value={formData.schoolYear}
                  onChange={e => setFormData({...formData, schoolYear: e.target.value})}
                  className="w-full border border-emerald-900/30 rounded-2xl py-3 px-4 text-base bg-[#111517] text-white text-right focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-bold appearance-none"
                >
                  <option>2025 / 2026</option>
                  <option>2024 / 2025</option>
                </select>
                <ChevronDown className="w-5 h-5 text-emerald-400 absolute left-4 top-3.5 pointer-events-none" />
             </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-[#0d1214] p-4 border-t border-emerald-900/30 flex justify-between gap-4 z-20" dir="rtl">
        <button onClick={handleSave} className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-4 rounded-2xl font-bold text-base shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all">
          حفظ واعتماد بيانات الطالب
        </button>
        <button onClick={() => setView('student_list')} className="flex-1 bg-black/50 text-gray-400 py-4 rounded-2xl font-bold text-base border border-emerald-900/30 hover:bg-[#1a2024] hover:text-white transition-all">
          إلغاء وتراجع
        </button>
      </div>

    </div>
  );
}
