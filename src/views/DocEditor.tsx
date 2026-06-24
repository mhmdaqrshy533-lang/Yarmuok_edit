import { ArrowRight, Printer } from 'lucide-react';
import { ViewState } from '../types';
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

interface DocEditorProps {
  setView: (view: ViewState) => void;
}

export default function DocEditor({ setView }: DocEditorProps) {
  const componentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: 'وثيقة_رسمية',
  });

  return (
    <div className="flex flex-col h-full bg-gray-100">
      {/* Top Bar */}
      <div className="bg-[#482880] text-white flex items-center justify-between p-4 shadow-md z-10 print:hidden">
        <button onClick={() => setView('home')} className="p-1 hover:bg-white/10 rounded-full">
          <ArrowRight className="w-5 h-5 text-white" />
        </button>
        <div className="text-center flex-1">
          <h1 className="font-bold text-lg">محرر الوثائق الرسمية</h1>
        </div>
        <button onClick={() => handlePrint()} className="p-1 hover:bg-white/10 rounded-full">
          <Printer className="w-5 h-5 text-white" />
        </button>
      </div>

      <div className="flex-1 overflow-auto p-4 print:p-0 print:overflow-visible">
        <div 
          ref={componentRef} 
          className="bg-white w-[210mm] min-h-[297mm] shadow-lg border border-gray-200 relative p-12 print:p-0 print:shadow-none print:border-none print:w-full mx-auto font-serif"
          dir="rtl"
        >
          {/* Official Header */}
          <div className="flex justify-between items-start border-b-2 border-black pb-4 mb-12 text-sm font-bold">
            <div className="text-right space-y-1 w-1/3">
              <p contentEditable suppressContentEditableWarning>الجمهورية اليمنية</p>
              <p contentEditable suppressContentEditableWarning>وزارة التربية والتعليم</p>
              <p contentEditable suppressContentEditableWarning>مكتب التربية والتعليم بمحافظة ...</p>
              <p contentEditable suppressContentEditableWarning>إدارة مدرسة ...</p>
            </div>
            <div className="text-center w-1/3 flex flex-col items-center justify-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full border-2 border-gray-800 flex items-center justify-center mb-2 text-xl text-gray-400">
                شعار
              </div>
            </div>
            <div className="text-right space-y-2 w-1/3 border-r-2 border-black pr-4">
              <div className="flex gap-2">
                <span>الرقم:</span>
                <span className="flex-1 border-b border-dotted border-black" contentEditable suppressContentEditableWarning></span>
              </div>
              <div className="flex gap-2">
                <span>التاريخ:</span>
                <span className="flex-1 border-b border-dotted border-black" contentEditable suppressContentEditableWarning></span>
              </div>
              <div className="flex gap-2">
                <span>الموافق:</span>
                <span className="flex-1 border-b border-dotted border-black" contentEditable suppressContentEditableWarning></span>
              </div>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-center mb-12 underline underline-offset-8" contentEditable suppressContentEditableWarning>
            إفادة مدرسية
          </h1>

          <div className="text-xl leading-loose space-y-8 text-justify" contentEditable suppressContentEditableWarning>
            <p className="font-bold">
              إلى من يهمه الأمر،،،
            </p>
            <p>
              تفيد إدارة المدرسة بأن الطالب / ............................................................................
              <br/><br/>
              المقيد بالصف ........................... للعام الدراسي ...........................
              <br/><br/>
              مستمر في دراسته لدينا ويتمتع بسيرة حسنة وسلوك منتظم.
            </p>
            <p>
              وقد أعطيت له هذه الإفادة بناءً على طلبه لتقديمها إلى جهة الاختصاص دون أدنى مسؤولية على المدرسة.
            </p>
          </div>

          <div className="mt-32 flex justify-between font-bold text-center text-lg">
            <div>
              <p className="mb-12" contentEditable suppressContentEditableWarning>شؤون الطلاب</p>
              <p contentEditable suppressContentEditableWarning>........................</p>
            </div>
            <div>
              <p className="mb-12 text-gray-400 border-2 border-gray-400 rounded-full w-24 h-24 flex items-center justify-center mx-auto" contentEditable suppressContentEditableWarning>الختم الرسمي</p>
            </div>
            <div>
              <p className="mb-12" contentEditable suppressContentEditableWarning>مدير المدرسة</p>
              <p contentEditable suppressContentEditableWarning>........................</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
