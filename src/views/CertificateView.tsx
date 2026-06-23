import { ArrowLeft, Printer, Share2, ZoomIn, ZoomOut } from 'lucide-react';
import { ViewState } from '../types';
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

interface CertificateViewProps {
  setView: (view: ViewState) => void;
}

export default function CertificateView({ setView }: CertificateViewProps) {
  const componentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: 'شهادة_تقييم_تلميذ',
  });

  return (
    <div className="flex flex-col h-full bg-gray-100">
      {/* Top Bar */}
      <div className="bg-[#482880] text-white flex items-center justify-between p-3 shadow-md z-10">
        <button onClick={() => setView('home')} className="p-2 rounded-full hover:bg-white/10">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center bg-white/10 rounded-full px-4 py-1">
          <span className="font-bold text-sm">الشهادات النهائية</span>
        </div>
        <div className="flex space-x-2 space-x-reverse">
          <button onClick={() => handlePrint()} className="p-2 rounded-full hover:bg-white/10 bg-[#e91e63] shadow-md">
            <Printer className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white shadow-sm flex items-center justify-between px-4 py-2 text-sm text-gray-600">
        <div className="flex items-center space-x-4 space-x-reverse">
           <button className="flex items-center hover:text-purple-600 font-medium"><ZoomIn className="w-4 h-4 mr-1"/> تكبير</button>
           <button className="flex items-center hover:text-purple-600 font-medium"><ZoomOut className="w-4 h-4 mr-1"/> تصغير</button>
        </div>
        <button className="flex items-center text-[#482880] font-bold"><Share2 className="w-4 h-4 mr-1"/> مشاركة (PDF)</button>
      </div>

      {/* Main Print Container */}
      <div className="flex-1 overflow-auto p-4 flex justify-center pb-20">
        <div 
          ref={componentRef} 
          className="bg-white w-[210mm] min-h-[297mm] shadow-lg border border-gray-200 relative p-8 print:p-0 print:shadow-none print:border-none print:w-full"
          style={{
            // A4 styling for screen, print media query will handle actual printing
            margin: '0 auto',
          }}
        >
          {/* Certificate Content */}
          <div className="flex justify-between items-start mb-4 text-sm font-bold text-gray-800 border-b-2 border-[#1a3a6c] pb-4">
            <div className="text-right leading-tight w-1/3">
              <p>الجمهورية اليمنية</p>
              <p>وزارة التربية والتعليم</p>
              <p>مكتب التربية والتعليم بمحافظة <span className="text-red-600 font-normal">تعز</span></p>
              <p>إدارة التربية والتعليم بمديرية <span className="text-red-600 font-normal">القاهرة</span></p>
              <p>مدرسة <span className="text-red-600 font-normal">النهضة الحديثة</span></p>
            </div>
            <div className="w-1/3 flex justify-center">
              <div className="w-20 h-20 bg-yellow-100 rounded-full border-2 border-red-800 flex items-center justify-center text-red-800 text-xs text-center leading-tight shadow-sm">
                شعار<br/>الجمهورية
              </div>
            </div>
            <div className="text-left leading-tight w-1/3 text-xs" dir="ltr">
              <p>Republic of Yemen</p>
              <p>Ministry of Education</p>
              <p>EDUCATION OFFICE: <span className="text-red-600 font-normal border-b border-dotted border-gray-400">Taiz</span></p>
              <p>GOVERNORATE: <span className="text-red-600 font-normal border-b border-dotted border-gray-400">Al-Qahira</span></p>
              <p>SCHOOL: <span className="text-red-600 font-normal border-b border-dotted border-gray-400">Al-Nahda</span></p>
            </div>
          </div>

          <div className="text-center mb-6">
            <h1 className="text-xl font-black text-[#1a3a6c] mb-1">شهادة تقييم التلميذ في أعمال السنة والاختبارات المدرسية لمرحلة التعليم الأساسي</h1>
            <h2 className="text-sm font-bold text-gray-700 uppercase tracking-tight mb-1" dir="ltr">Student's Academic Conduct and Final Exam Evaluation for the Basic Education Level</h2>
            <h3 className="text-sm font-bold text-[#1a3a6c]">(للصفوف من الصف الرابع إلى الصف الثامن)</h3>
            <div className="mt-2 inline-block px-6 py-1 bg-gray-100 rounded-full border border-gray-300 font-bold text-[#e91e63]">
              للعام الدراسي 2025 / 2026 ACADEMIC YEAR
            </div>
          </div>

          <div className="flex mb-6 text-sm">
            <div className="w-24 h-32 border-2 border-gray-300 rounded ml-4 flex items-center justify-center bg-gray-50 text-gray-400 text-xs text-center shrink-0">
               صورة<br/>الطالب
            </div>
            <div className="flex-1 grid grid-cols-2 gap-x-6 gap-y-2 font-bold text-gray-700">
              <div className="col-span-2 border-b border-dotted border-gray-400 pb-1 flex">
                <span className="w-24">الاســــم:</span>
                <span className="text-red-600 flex-1">نبيل عبدالقادر علي الصبري</span>
                <span className="w-16" dir="ltr">:Name</span>
              </div>
              <div className="border-b border-dotted border-gray-400 pb-1 flex">
                <span className="w-24">الجنـسـية:</span>
                <span className="text-red-600 flex-1">يمني</span>
                <span className="w-24" dir="ltr">:Nationality</span>
              </div>
              <div className="border-b border-dotted border-gray-400 pb-1 flex">
                <span className="w-24">رقـم الجـلوس:</span>
                <span className="text-red-600 flex-1">124578</span>
                <span className="w-24" dir="ltr">:Seat No.</span>
              </div>
              <div className="border-b border-dotted border-gray-400 pb-1 flex">
                <span className="w-24">محل وتاريخ الميلاد:</span>
                <span className="text-red-600 flex-1">تعز - 2009</span>
                <span className="w-24" dir="ltr">:Date of Birth</span>
              </div>
              <div className="border-b border-dotted border-gray-400 pb-1 flex">
                <span className="w-24">الديـــانة:</span>
                <span className="text-red-600 flex-1">مسلم</span>
                <span className="w-24" dir="ltr">:Religion</span>
              </div>
              <div className="border-b border-dotted border-gray-400 pb-1 flex">
                <span className="w-24">الصـف الـدراسـي:</span>
                <span className="text-red-600 flex-1">الثامن أساسي</span>
                <span className="w-24" dir="ltr">:Class/Grade</span>
              </div>
              <div className="border-b border-dotted border-gray-400 pb-1 flex">
                <span className="w-24">الشـعـبة:</span>
                <span className="text-red-600 flex-1">( أ )</span>
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
              {[
                { ar: 'القرآن الكريم', en: 'Holy Quran', m1: 18, e1: 28, t1: 46, m2: 19, e2: 29, t2: 48, ft: 94 },
                { ar: 'التربية الإسلامية', en: 'Islamic Education', m1: 19, e1: 25, t1: 44, m2: 20, e2: 27, t2: 47, ft: 91 },
                { ar: 'اللغة العربية', en: 'Arabic Language', m1: 17, e1: 26, t1: 43, m2: 18, e2: 28, t2: 46, ft: 89 },
                { ar: 'اللغة الإنجليزية', en: 'English Language', m1: 20, e1: 29, t1: 49, m2: 20, e2: 30, t2: 50, ft: 99 },
                { ar: 'الرياضيات', en: 'Mathematics', m1: 19, e1: 30, t1: 49, m2: 20, e2: 30, t2: 50, ft: 99 },
                { ar: 'العلوم', en: 'Science', m1: 20, e1: 27, t1: 47, m2: 19, e2: 28, t2: 47, ft: 94 },
                { ar: 'المجتمعيات', en: 'Social Studies', m1: 19, e1: 29, t1: 48, m2: 20, e2: 29, t2: 49, ft: 97 },
              ].map((sub, i) => (
                <tr key={i}>
                  <td className="border border-gray-800 p-1 text-right pr-2">
                    <div className="flex justify-between">
                      <span>{sub.ar}</span>
                      <span className="text-gray-500 text-xs font-normal" dir="ltr">{sub.en}</span>
                    </div>
                  </td>
                  <td className="border border-gray-800 p-1">{sub.m1}</td>
                  <td className="border border-gray-800 p-1">{sub.e1}</td>
                  <td className="border border-gray-800 p-1 text-blue-900 bg-blue-50/30">{sub.t1}</td>
                  <td className="border border-gray-800 p-1">{sub.m2}</td>
                  <td className="border border-gray-800 p-1">{sub.e2}</td>
                  <td className="border border-gray-800 p-1 text-green-900 bg-green-50/30">{sub.t2}</td>
                  <td className="border border-gray-800 p-1 text-red-900 bg-red-50/30 font-black">{sub.ft}</td>
                </tr>
              ))}
              <tr className="bg-gray-100">
                <td className="border border-gray-800 p-2 font-black text-center">المجموع Total</td>
                <td className="border border-gray-800 p-2 text-center" colSpan={2}></td>
                <td className="border border-gray-800 p-2 text-center text-blue-900 font-black">326</td>
                <td className="border border-gray-800 p-2 text-center" colSpan={2}></td>
                <td className="border border-gray-800 p-2 text-center text-green-900 font-black">337</td>
                <td className="border border-gray-800 p-2 text-center text-red-900 font-black text-lg">663</td>
              </tr>
            </tbody>
          </table>

          <div className="flex justify-between text-sm font-bold text-gray-800 mt-8 px-4 text-center">
            <div className="flex flex-col items-center">
              <span className="mb-8">النتيجة: <span className="text-red-600 border-b border-dotted border-gray-400">ناجــــــح</span> :Result</span>
              <span className="border-t border-gray-400 pt-2 w-48">مربي الصف<br/>Class Teacher</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="mb-8">النسبة المئوية: <span className="text-red-600 border-b border-dotted border-gray-400">94.71%</span> :Percentage</span>
              <span className="border-t border-gray-400 pt-2 w-48">مدير المدرسة<br/>School Principal</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="mb-8">الترتيب: <span className="text-red-600 border-b border-dotted border-gray-400">الأول</span> :Rank</span>
              <span className="border-t border-gray-400 pt-2 w-64">يعتمد مدير مكتب التربية والتعليم بالمديرية<br/>Education Office Approval</span>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
