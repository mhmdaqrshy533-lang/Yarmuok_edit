import { ArrowRight, Search, Plus, Trash2, Edit3, Eye, Download, Upload } from 'lucide-react';
import React, { useState, useRef } from 'react';
import { ViewState, Student } from '../types';
import { useStore } from '../store';

interface StudentListProps {
  setView: (view: ViewState) => void;
}

export default function StudentList({ setView }: StudentListProps) {
  const { students, deleteStudent, setEditingStudentId, addStudent } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredStudents = students.filter(s => 
    s.name.includes(searchTerm) || (s.seatNumber && s.seatNumber.includes(searchTerm))
  );

  const exportToCSV = () => {
    const headers = ['الاسم', 'رقم الجلوس', 'تاريخ الميلاد', 'مكان الميلاد', 'الجنس'];
    const rows = students.map(s => [s.name, s.seatNumber || '', s.birthDate || '', s.birthPlace || '', s.gender || ''].join(','));
    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'الطلاب.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const importFromCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n');
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        const parts = line.split(',');
        if (parts.length >= 1 && parts[0].trim() !== '') {
          addStudent({
            id: crypto.randomUUID(),
            name: parts[0].trim(),
            seatNumber: parts[1]?.trim() || '',
            birthDate: parts[2]?.trim() || '',
            birthPlace: parts[3]?.trim() || '',
            gender: (parts[4]?.trim() as any) || 'ذكر',
            guardian: '',
            schoolYear: '2025 / 2026',
            grades: {
              month1: { homework: null, attendance: null, oral: null, written: null }
            },
            accounting: {
              totalFees: 0,
              paidFees: 0,
              transactions: []
            }
          });
        }
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      alert('تم الاستيراد بنجاح!');
    };
    reader.readAsText(file, 'utf-8');
  };

  return (
    <div className="flex flex-col h-full bg-black relative text-gray-200">
      {/* Top Bar */}
      <div className="bg-gray-900/90 backdrop-blur-xl text-white flex items-center p-4 shadow-[0_4px_30px_rgba(147,51,234,0.15)] z-10 sticky top-0 border-b border-purple-500/20">
        <button onClick={() => setView('home')} className="absolute right-4 p-2 hover:bg-white/10 rounded-xl transition-colors group">
          <ArrowRight className="w-5 h-5 text-purple-400 group-hover:text-cyan-400" />
        </button>
        <div className="flex-1 text-center flex items-center justify-center gap-4">
          <h1 className="font-bold text-lg text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">سجلات الطلاب</h1>
          <div className="hidden md:flex gap-2 bg-black/30 p-1 rounded-xl border border-purple-500/30">
            <button onClick={exportToCSV} className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-purple-900/50 text-cyan-300 transition-colors text-sm font-bold">
              <Download className="w-4 h-4" /> تصدير
            </button>
            <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-purple-900/50 text-fuchsia-300 transition-colors text-sm font-bold">
              <Upload className="w-4 h-4" /> استيراد
            </button>
            <input type="file" accept=".csv" ref={fileInputRef} className="hidden" onChange={importFromCSV} />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 md:p-8 w-full max-w-5xl mx-auto flex flex-col space-y-6">
        {/* Search and Add */}
        <div className="bg-gray-900/60 backdrop-blur-xl p-5 rounded-3xl shadow-[0_0_30px_rgba(147,51,234,0.1)] border border-purple-500/20">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <button 
              onClick={() => {
                setEditingStudentId(null);
                setView('student_form');
              }}
              className="w-full md:w-auto bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-8 py-3 rounded-2xl font-bold shadow-[0_0_15px_rgba(147,51,234,0.3)] hover:from-purple-500 hover:to-cyan-500 hover:shadow-[0_0_25px_rgba(34,211,238,0.4)] transition-all whitespace-nowrap flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              طالب جديد
            </button>
            <div className="relative w-full md:flex-1">
              <input
                type="text"
                placeholder="بحث بالاسم أو رقم الجلوس"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-purple-500/30 rounded-2xl py-3 px-4 text-base bg-black/50 text-white text-right focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all font-medium placeholder-gray-500"
                dir="rtl"
              />
            </div>
          </div>
          <div className="flex justify-between items-center mt-4 text-sm text-cyan-200/70 px-2 font-medium">
            <span>إجمالي السجلات: {students.length}</span>
            <span>الظاهر: {filteredStudents.length}</span>
          </div>
        </div>

        {/* List Area */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredStudents.map((student, index) => (
            <div key={student.id} className="bg-gray-900/40 backdrop-blur-xl rounded-3xl shadow-lg border border-gray-800 hover:border-purple-500/40 overflow-hidden hover:shadow-[0_0_20px_rgba(147,51,234,0.15)] transition-all group">
            <div className="p-4 border-b border-gray-800 flex justify-between items-start bg-black/20">
              <div className="flex flex-col gap-1 w-full text-right">
                <div className="flex justify-between items-center w-full mb-2">
                  <span className="bg-purple-900/40 text-purple-300 text-xs px-3 py-1 rounded-full font-bold self-start border border-purple-500/30">{student.gender}</span>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-gray-100 text-base group-hover:text-cyan-400 transition-colors">{student.name}</h3>
                    <span className="text-purple-400 font-bold bg-purple-900/30 px-2 py-0.5 rounded-md">{index + 1}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-400 ml-auto">{student.birthPlace} • {student.birthDate}</p>
              </div>
            </div>
            
            <div className="px-4 py-3 bg-black/40 border-b border-gray-800 flex justify-between items-center text-sm font-bold">
              <div className="flex items-center text-cyan-300 bg-cyan-900/30 px-3 py-1 rounded-lg text-xs border border-cyan-500/30">
                مقعد: <span className="mr-1 text-white">{student.seatNumber || '—'}</span>
              </div>
              <div className="flex gap-2">
                <span className="text-fuchsia-300 bg-fuchsia-900/30 px-3 py-1 rounded-lg text-xs border border-fuchsia-500/30">{student.schoolYear}</span>
              </div>
            </div>

            <div className="p-4 text-right text-xs text-gray-400 space-y-2 leading-relaxed">
              <p className="font-bold text-gray-200 text-sm">{student.grade8?.school || student.grade7?.school || student.grade6?.school || 'غير محدد'}</p>
              <p>الميلاد : <span className="text-gray-300">{student.birthDate}</span> • {student.birthPlace}</p>
              <p>ولي الأمر : <span className="text-gray-300">{student.guardian}</span></p>
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

            <div className="flex bg-black/60 border-t border-gray-800">
              <button 
                onClick={() => {
                  setEditingStudentId(student.id);
                  setView('student_form');
                }}
                className="flex-1 py-3 text-center text-sm font-bold text-cyan-400 hover:bg-purple-900/40 border-l border-gray-800 transition-colors"
              >
                تعديل السجل
              </button>
              <button 
                onClick={() => {
                  if(confirm('هل أنت متأكد من حذف هذا السجل؟')) deleteStudent(student.id);
                }}
                className="flex-1 py-3 text-center text-sm font-bold text-rose-400 hover:bg-rose-900/40 transition-colors"
              >
                حذف السجل
              </button>
            </div>
          </div>
        ))}
        {filteredStudents.length === 0 && (
          <div className="col-span-1 md:col-span-2 text-center py-16 text-gray-500 bg-gray-900/40 backdrop-blur-md rounded-3xl border border-gray-800">
            <Search className="w-12 h-12 mx-auto mb-4 text-purple-500/30" />
            <p className="font-medium text-lg">لا توجد سجلات مطابقة للبحث</p>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
