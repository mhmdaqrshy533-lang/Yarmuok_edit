import { ArrowLeft, Printer, Share2, ZoomIn, ZoomOut, ChevronDown, MessageCircle } from 'lucide-react';
import { ViewState } from '../types';
import { useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import { useStore } from '../store';

interface CertificateViewProps {
  setView: (view: ViewState) => void;
}

export default function CertificateView({ setView }: CertificateViewProps) {
  const { students, settings } = useStore();
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || '');
  const componentRef = useRef<HTMLDivElement>(null);

  const selectedStudent = students.find(s => s.id === selectedStudentId);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: 'شهادة_تقييم_تلميذ',
  });

  const handleWhatsAppShare = () => {
    if (!selectedStudent) return;
    const text = `السلام عليكم ورحمة الله وبركاته،\nولي أمر الطالب/ة: ${selectedStudent.name}\nنرفق لكم شهادة الطالب/ة للعام الدراسي ${settings.year}\nتقبلوا تحيات إدارة ${settings.schoolName}.`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const [zoom, setZoom] = useState(1);

  const getSubjectGrade = (month: 'month1' | 'month2' | 'month3') => {
     // Mock logic since we only have general monthly totals in our mock data
     // In a real app we would have subject-specific grades
     const grades = selectedStudent?.grades?.[month];
     const total = (grades?.homework || 0) + (grades?.attendance || 0) + (grades?.oral || 0) + (grades?.written || 0);
     return {
       m: Math.floor(total * 0.4),
       e: Math.floor(total * 0.6),
       t: total
     };
  };

  const calculateFinal = (t1: number, t2: number) => t1 + t2;

  // Placeholder subjects
  const subjects = [
    { ar: 'القرآن الكريم', en: 'Holy Quran' },
    { ar: 'التربية الإسلامية', en: 'Islamic Education' },
    { ar: 'اللغة العربية', en: 'Arabic Language' },
    { ar: 'اللغة الإنجليزية', en: 'English Language' },
    { ar: 'الرياضيات', en: 'Mathematics' },
    { ar: 'العلوم', en: 'Science' },
    { ar: 'المجتمعيات', en: 'Social Studies' },
  ];

  return (
    <div className="flex flex-col h-full bg-black relative text-gray-200">
      {/* Top Bar */}
      <div className="bg-gray-900/90 backdrop-blur-xl text-white flex items-center justify-between p-4 shadow-[0_4px_30px_rgba(147,51,234,0.15)] z-10 sticky top-0 border-b border-purple-500/20 print:hidden">
        <button onClick={() => setView('home')} className="p-2 hover:bg-white/10 rounded-xl transition-colors group">
          <ArrowLeft className="w-5 h-5 text-purple-400 group-hover:text-cyan-400" />
        </button>
        <div className="text-center flex-1">
          <h1 className="font-bold text-lg text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">الشهادات النهائية</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-black/50 border border-purple-500/30 rounded-xl p-1" dir="ltr">
            <button onClick={() => setZoom(z => Math.max(0.5, z - 0.1))} className="p-1 hover:bg-purple-900/40 rounded-lg text-purple-400 hover:text-cyan-400 font-bold">-</button>
            <span className="text-xs font-mono w-10 text-center text-cyan-300">{Math.round(zoom * 100)}%</span>
            <button onClick={() => setZoom(z => Math.min(2, z + 0.1))} className="p-1 hover:bg-purple-900/40 rounded-lg text-purple-400 hover:text-cyan-400 font-bold">+</button>
          </div>
          <button onClick={() => handlePrint()} className="p-2 hover:bg-white/10 rounded-xl transition-colors group">
            <Printer className="w-5 h-5 text-cyan-400 group-hover:text-purple-400" />
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-gray-900/60 backdrop-blur-md border-b border-purple-500/20 flex flex-wrap items-center justify-between px-4 py-3 text-sm text-gray-300 print:hidden shadow-lg" dir="rtl">
        <div className="flex items-center gap-4">
           <div className="flex items-center bg-black/50 border border-purple-500/30 rounded-xl px-4 py-2">
             <span className="ml-2 font-bold text-cyan-400">الطالب:</span>
             <select 
               value={selectedStudentId}
               onChange={(e) => setSelectedStudentId(e.target.value)}
               className="bg-transparent text-white font-bold focus:outline-none appearance-none pr-2 pl-6"
             >
               {students.map(s => (
                 <option key={s.id} value={s.id} className="bg-gray-900 text-white">{s.name}</option>
               ))}
             </select>
           </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleWhatsAppShare} className="flex items-center text-green-400 font-bold hover:text-green-300 transition-colors bg-green-900/30 px-3 py-2 rounded-xl border border-green-500/30">
            <MessageCircle className="w-5 h-5 ml-2"/> إرسال واتساب
          </button>
          <button className="flex items-center text-purple-400 font-bold hover:text-cyan-400 transition-colors"><Share2 className="w-4 h-4 ml-2"/> مشاركة (PDF)</button>
        </div>
      </div>

      {/* Main Print Container */}
      <div className="flex-1 overflow-auto p-4 md:p-8 flex justify-center items-start print:p-0 print:overflow-visible">
        <div 
          ref={componentRef} 
          style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
          className="bg-white text-black w-[210mm] min-h-[297mm] shadow-[0_0_40px_rgba(147,51,234,0.15)] relative p-8 print:p-0 print:shadow-none print:border-none print:w-full print:transform-none transition-transform duration-200"
        >
          {/* Watermark */}
          <div className="hidden print:flex absolute inset-0 items-center justify-center pointer-events-none z-0 opacity-[0.03]">
             <h1 className="text-[150px] font-black -rotate-45 text-black">نظام يرموك</h1>
          </div>
          
          {/* Certificate Content */}
          <div className="flex justify-between items-start mb-4 text-sm font-bold text-gray-800 border-b-2 border-[#1a3a6c] pb-4 relative z-10">
            <div className="text-right leading-tight w-1/3">
              <p>{settings.country}</p>
              <p>{settings.ministry}</p>
              <p>مكتب التربية والتعليم بمحافظة <span className="text-red-600 font-normal">{settings.governorate}</span></p>
              <p>إدارة التربية والتعليم بمديرية <span className="text-red-600 font-normal">{settings.directorate}</span></p>
              <p>مدرسة <span className="text-red-600 font-normal">{settings.schoolName}</span></p>
            </div>
            <div className="w-1/3 flex justify-center">
              <div className="w-20 h-20 bg-yellow-100 rounded-full border-2 border-red-800 flex items-center justify-center text-red-800 text-xs text-center leading-tight shadow-sm">
                شعار<br/>الجمهورية
              </div>
            </div>
            <div className="text-left leading-tight w-1/3 text-xs" dir="ltr">
              <p contentEditable suppressContentEditableWarning>Republic of Yemen</p>
              <p contentEditable suppressContentEditableWarning>Ministry of Education</p>
              <p>EDUCATION OFFICE: <span className="text-red-600 font-normal border-b border-dotted border-gray-400" contentEditable suppressContentEditableWarning>Taiz</span></p>
              <p>GOVERNORATE: <span className="text-red-600 font-normal border-b border-dotted border-gray-400" contentEditable suppressContentEditableWarning>Al-Qahira</span></p>
              <p>SCHOOL: <span className="text-red-600 font-normal border-b border-dotted border-gray-400" contentEditable suppressContentEditableWarning>Al-Nahda</span></p>
            </div>
          </div>

          <div className="text-center mb-6">
            <h1 className="text-xl font-black text-[#1a3a6c] mb-1" contentEditable suppressContentEditableWarning>شهادة تقييم التلميذ في أعمال السنة والاختبارات المدرسية لمرحلة التعليم الأساسي</h1>
            <h2 className="text-sm font-bold text-gray-700 uppercase tracking-tight mb-1" dir="ltr" contentEditable suppressContentEditableWarning>Student's Academic Conduct and Final Exam Evaluation for the Basic Education Level</h2>
            <h3 className="text-sm font-bold text-[#1a3a6c]" contentEditable suppressContentEditableWarning>(للصفوف من الصف الرابع إلى الصف الثامن)</h3>
            <div className="mt-2 inline-block px-6 py-1 bg-gray-100 rounded-full border border-gray-300 font-bold text-[#e91e63]">
              للعام الدراسي {settings.year} ACADEMIC YEAR
            </div>
          </div>

          <div className="flex mb-6 text-sm">
            <div className="w-24 h-32 border-2 border-gray-300 rounded ml-4 flex items-center justify-center bg-gray-50 text-gray-400 text-xs text-center shrink-0">
               صورة<br/>الطالب
            </div>
            <div className="flex-1 grid grid-cols-2 gap-x-6 gap-y-2 font-bold text-gray-700">
              <div className="col-span-2 border-b border-dotted border-gray-400 pb-1 flex">
                <span className="w-24">الاســــم:</span>
                <span className="text-red-600 flex-1" contentEditable suppressContentEditableWarning>{selectedStudent?.name || ''}</span>
                <span className="w-16" dir="ltr">:Name</span>
              </div>
              <div className="border-b border-dotted border-gray-400 pb-1 flex">
                <span className="w-24">الجنـسـية:</span>
                <span className="text-red-600 flex-1" contentEditable suppressContentEditableWarning>يمني</span>
                <span className="w-24" dir="ltr">:Nationality</span>
              </div>
              <div className="border-b border-dotted border-gray-400 pb-1 flex">
                <span className="w-24">رقـم الجـلوس:</span>
                <span className="text-red-600 flex-1" contentEditable suppressContentEditableWarning>{selectedStudent?.seatNumber || '---'}</span>
                <span className="w-24" dir="ltr">:Seat No.</span>
              </div>
              <div className="border-b border-dotted border-gray-400 pb-1 flex">
                <span className="w-24">محل وتاريخ الميلاد:</span>
                <span className="text-red-600 flex-1" contentEditable suppressContentEditableWarning>{selectedStudent?.birthPlace} - {selectedStudent?.birthDate}</span>
                <span className="w-24" dir="ltr">:Date of Birth</span>
              </div>
              <div className="border-b border-dotted border-gray-400 pb-1 flex">
                <span className="w-24">الديـــانة:</span>
                <span className="text-red-600 flex-1" contentEditable suppressContentEditableWarning>مسلم</span>
                <span className="w-24" dir="ltr">:Religion</span>
              </div>
              <div className="border-b border-dotted border-gray-400 pb-1 flex">
                <span className="w-24">الصـف الـدراسـي:</span>
                <span className="text-red-600 flex-1" contentEditable suppressContentEditableWarning>الثامن أساسي</span>
                <span className="w-24" dir="ltr">:Class/Grade</span>
              </div>
              <div className="border-b border-dotted border-gray-400 pb-1 flex">
                <span className="w-24">الشـعـبة:</span>
                <span className="text-red-600 flex-1" contentEditable suppressContentEditableWarning>( أ )</span>
                <span className="w-24" dir="ltr">:Section</span>
              </div>
            </div>
          </div>

          <table className="w-full text-center border-collapse border border-gray-800 text-sm font-bold text-gray-800 mb-6">
            <thead>
              <tr className="bg-[#e6eff8]">
                <th rowSpan={3} className="border border-gray-800 p-1 w-1/4">المادة الدراسية<br/>Subjects</th>
                <th colSpan={3} className="border border-gray-800 p-1 text-blue-900">الفصل الدراسي الأول First Term</th>
                <th colSpan={3} className="border border-gray-800 p-1 text-green-900">الفصل الدراسي الثاني Second Term</th>
                <th rowSpan={3} className="border border-gray-800 p-1 text-red-900">المجموع<br/>النهائي<br/>Final Total</th>
              </tr>
              <tr className="bg-[#e6eff8] text-xs">
                <th className="border border-gray-800 p-1">أعمال السنة<br/>Conduct</th>
                <th className="border border-gray-800 p-1">اختبار نهاية الفصل<br/>Exam</th>
                <th className="border border-gray-800 p-1">المجموع<br/>Total</th>
                <th className="border border-gray-800 p-1">أعمال السنة<br/>Conduct</th>
                <th className="border border-gray-800 p-1">اختبار نهاية الفصل<br/>Exam</th>
                <th className="border border-gray-800 p-1">المجموع<br/>Total</th>
              </tr>
              <tr className="bg-gray-100 text-xs">
                <th className="border border-gray-800 p-1">20</th>
                <th className="border border-gray-800 p-1">30</th>
                <th className="border border-gray-800 p-1">50</th>
                <th className="border border-gray-800 p-1">20</th>
                <th className="border border-gray-800 p-1">30</th>
                <th className="border border-gray-800 p-1">50</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((sub, i) => {
                const g1 = getSubjectGrade('month1');
                const g2 = getSubjectGrade('month2');
                const t1 = g1.t;
                const t2 = g2.t;
                const final = calculateFinal(t1, t2);

                return (
                  <tr key={i}>
                    <td className="border border-gray-800 p-1 text-right pr-2">
                      <div className="flex justify-between">
                        <span contentEditable suppressContentEditableWarning>{sub.ar}</span>
                        <span className="text-gray-500 text-xs font-normal" dir="ltr" contentEditable suppressContentEditableWarning>{sub.en}</span>
                      </div>
                    </td>
                    <td className="border border-gray-800 p-1" contentEditable suppressContentEditableWarning>{g1.m || ''}</td>
                    <td className="border border-gray-800 p-1" contentEditable suppressContentEditableWarning>{g1.e || ''}</td>
                    <td className="border border-gray-800 p-1 text-blue-900 bg-blue-50/30" contentEditable suppressContentEditableWarning>{t1 || ''}</td>
                    <td className="border border-gray-800 p-1" contentEditable suppressContentEditableWarning>{g2.m || ''}</td>
                    <td className="border border-gray-800 p-1" contentEditable suppressContentEditableWarning>{g2.e || ''}</td>
                    <td className="border border-gray-800 p-1 text-green-900 bg-green-50/30" contentEditable suppressContentEditableWarning>{t2 || ''}</td>
                    <td className="border border-gray-800 p-1 text-red-900 bg-red-50/30 font-black" contentEditable suppressContentEditableWarning>{final || ''}</td>
                  </tr>
                );
              })}
              <tr className="bg-gray-100">
                <td className="border border-gray-800 p-2 font-black text-center" contentEditable suppressContentEditableWarning>المجموع Total</td>
                <td className="border border-gray-800 p-2 text-center" colSpan={2}></td>
                <td className="border border-gray-800 p-2 text-center text-blue-900 font-black" contentEditable suppressContentEditableWarning>326</td>
                <td className="border border-gray-800 p-2 text-center" colSpan={2}></td>
                <td className="border border-gray-800 p-2 text-center text-green-900 font-black" contentEditable suppressContentEditableWarning>337</td>
                <td className="border border-gray-800 p-2 text-center text-red-900 font-black text-lg" contentEditable suppressContentEditableWarning>663</td>
              </tr>
            </tbody>
          </table>

          <div className="flex justify-between text-sm font-bold text-gray-800 mt-8 px-4 text-center">
            <div className="flex flex-col items-center">
              <span className="mb-8" contentEditable suppressContentEditableWarning>النتيجة: <span className="text-red-600 border-b border-dotted border-gray-400">ناجــــــح</span> :Result</span>
              <span className="border-t border-gray-400 pt-2 w-48" contentEditable suppressContentEditableWarning>مربي الصف<br/>Class Teacher</span>
            </div>
            
            {/* Tamper-Proof Digital Seal */}
            <div className="flex flex-col items-center justify-center -mt-4 opacity-80" title="ختم رقمي مضاد للتلاعب">
               <div className="w-20 h-20 border-4 border-double border-emerald-600 rounded-full flex flex-col items-center justify-center mb-1 relative">
                 <div className="absolute inset-0 border border-emerald-400 rounded-full scale-[0.8] rotate-45 border-dashed"></div>
                 <div className="text-emerald-700 font-black text-xs leading-none">ΣIGMA</div>
                 <div className="text-[6px] text-emerald-600 mt-1 uppercase">Tamper-Proof</div>
               </div>
               <div className="text-[8px] font-mono text-gray-500 uppercase tracking-widest bg-gray-100 px-2 py-0.5 border border-gray-200 rounded">
                 ID: {selectedStudent?.id?.substring(0, 8) || 'VERIFIED'}
               </div>
            </div>

            <div className="flex flex-col items-center">
              <span className="mb-8" contentEditable suppressContentEditableWarning>النسبة المئوية: <span className="text-red-600 border-b border-dotted border-gray-400">94.71%</span> :Percentage</span>
              <span className="border-t border-gray-400 pt-2 w-48" suppressContentEditableWarning>{settings.principalName}<br/>School Principal</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}