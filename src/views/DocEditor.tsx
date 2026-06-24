import { ArrowRight, Printer, PlusCircle, Type, AlignLeft, Minus, PenTool, LayoutTemplate } from 'lucide-react';
import { ViewState } from '../types';
import { useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import { useStore } from '../store';

interface DocEditorProps {
  setView: (view: ViewState) => void;
}

type BlockType = 'title' | 'paragraph' | 'line' | 'signature';

interface Block {
  id: string;
  type: BlockType;
  content: string;
}

export default function DocEditor({ setView }: DocEditorProps) {
  const { settings } = useStore();
  const componentRef = useRef<HTMLDivElement>(null);

  const [blocks, setBlocks] = useState<Block[]>([
    { id: '1', type: 'title', content: 'إفادة مدرسية' },
    { id: '2', type: 'paragraph', content: 'إلى من يهمه الأمر،،،\n\nتفيد إدارة المدرسة بأن الطالب / ............................................................................\n\nالمقيد بالصف ........................... للعام الدراسي ...........................\n\nمستمر في دراسته لدينا ويتمتع بسيرة حسنة وسلوك منتظم.' },
    { id: '3', type: 'paragraph', content: 'وقد أعطيت له هذه الإفادة بناءً على طلبه لتقديمها إلى جهة الاختصاص دون أدنى مسؤولية على المدرسة.' },
    { id: '4', type: 'signature', content: '' }
  ]);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: 'وثيقة_رسمية',
  });

  const [zoom, setZoom] = useState(1);

  const addBlock = (type: BlockType) => {
    const newBlock: Block = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      content: type === 'title' ? 'عنوان جديد' : type === 'paragraph' ? 'اكتب النص هنا...' : ''
    };
    setBlocks([...blocks, newBlock]);
  };

  const updateBlock = (id: string, content: string) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, content } : b));
  };

  const removeBlock = (id: string) => {
    setBlocks(blocks.filter(b => b.id !== id));
  };

  return (
    <div className="flex flex-col h-full bg-black relative text-gray-200">
      {/* Top Bar */}
      <div className="bg-gray-900/90 backdrop-blur-xl text-white flex items-center justify-between p-4 shadow-[0_4px_30px_rgba(147,51,234,0.15)] z-20 sticky top-0 border-b border-purple-500/20 print:hidden">
        <button onClick={() => setView('home')} className="p-2 hover:bg-white/10 rounded-xl transition-colors group">
          <ArrowRight className="w-5 h-5 text-purple-400 group-hover:text-cyan-400" />
        </button>
        <div className="text-center flex-1">
          <h1 className="font-bold text-lg text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">منشئ الوثائق المتقدم (Form Builder)</h1>
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

      <div className="flex flex-1 overflow-hidden" dir="rtl">
        {/* Sidebar Builder Controls */}
        <div className="w-64 bg-gray-900/60 backdrop-blur-xl border-l border-purple-500/20 p-4 flex flex-col gap-4 overflow-y-auto print:hidden shadow-[0_0_30px_rgba(147,51,234,0.1)] z-10">
          <h2 className="font-bold text-cyan-400 text-sm mb-2 border-b border-purple-500/30 pb-2">أدوات البناء</h2>
          
          <button onClick={() => addBlock('title')} className="flex items-center gap-3 bg-black/50 border border-purple-500/30 p-3 rounded-xl hover:bg-purple-900/40 hover:border-cyan-500/50 transition-all text-sm font-bold group">
            <Type className="w-4 h-4 text-purple-400 group-hover:text-cyan-400" /> إضافة عنوان
          </button>
          
          <button onClick={() => addBlock('paragraph')} className="flex items-center gap-3 bg-black/50 border border-purple-500/30 p-3 rounded-xl hover:bg-purple-900/40 hover:border-cyan-500/50 transition-all text-sm font-bold group">
            <AlignLeft className="w-4 h-4 text-purple-400 group-hover:text-cyan-400" /> إضافة فقرة نصية
          </button>

          <button onClick={() => addBlock('line')} className="flex items-center gap-3 bg-black/50 border border-purple-500/30 p-3 rounded-xl hover:bg-purple-900/40 hover:border-cyan-500/50 transition-all text-sm font-bold group">
            <Minus className="w-4 h-4 text-purple-400 group-hover:text-cyan-400" /> إضافة خط فاصل
          </button>
          
          <button onClick={() => addBlock('signature')} className="flex items-center gap-3 bg-black/50 border border-purple-500/30 p-3 rounded-xl hover:bg-purple-900/40 hover:border-cyan-500/50 transition-all text-sm font-bold group">
            <PenTool className="w-4 h-4 text-purple-400 group-hover:text-cyan-400" /> إضافة قسم توقيعات
          </button>

          <div className="mt-auto bg-purple-900/20 border border-purple-500/30 p-4 rounded-xl">
             <p className="text-xs text-purple-300 leading-relaxed text-center">انقر على أي عنصر في الورقة لتعديل النص مباشرة.</p>
          </div>
        </div>

        {/* Document Canvas */}
        <div className="flex-1 overflow-auto p-4 md:p-8 bg-gray-950 print:p-0 print:bg-white relative flex justify-center items-start">
          <div 
            ref={componentRef} 
            style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
            className="bg-white text-black w-[210mm] min-h-[297mm] shadow-[0_0_40px_rgba(147,51,234,0.15)] relative p-12 print:p-0 print:shadow-none print:w-full mx-auto font-serif print:transform-none transition-transform duration-200"
            dir="rtl"
          >
            {/* Official Header (Fixed) */}
            <div className="flex justify-between items-start border-b-2 border-black pb-4 mb-12 text-sm font-bold">
              <div className="text-right space-y-1 w-1/3">
                <p>{settings.country}</p>
                <p>{settings.ministry}</p>
                <p>مكتب التربية والتعليم بمحافظة {settings.governorate}</p>
                <p>مدرسة {settings.schoolName}</p>
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

            {/* Dynamic Blocks */}
            <div className="space-y-6">
              {blocks.map((block, index) => (
                <div key={block.id} className="relative group">
                  {/* Delete button (only in editor) */}
                  <button 
                    onClick={() => removeBlock(block.id)}
                    className="absolute -right-12 top-1/2 -translate-y-1/2 text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-rose-50 rounded-full print:hidden hover:bg-rose-100"
                  >
                     <Minus className="w-4 h-4" />
                  </button>

                  {block.type === 'title' && (
                    <h1 
                      className="text-3xl font-bold text-center underline underline-offset-8 focus:outline-none focus:bg-gray-50 rounded p-2" 
                      contentEditable 
                      suppressContentEditableWarning
                      onBlur={(e) => updateBlock(block.id, e.currentTarget.textContent || '')}
                    >
                      {block.content}
                    </h1>
                  )}

                  {block.type === 'paragraph' && (
                    <div 
                      className="text-xl leading-loose text-justify focus:outline-none focus:bg-gray-50 rounded p-2 whitespace-pre-wrap" 
                      contentEditable 
                      suppressContentEditableWarning
                      onBlur={(e) => updateBlock(block.id, e.currentTarget.textContent || '')}
                    >
                      {block.content}
                    </div>
                  )}

                  {block.type === 'line' && (
                    <hr className="border-t-2 border-gray-400 my-8" />
                  )}

                  {block.type === 'signature' && (
                    <div className="mt-20 flex justify-between font-bold text-center text-lg">
                      <div>
                        <p className="mb-12" contentEditable suppressContentEditableWarning>شؤون الطلاب</p>
                        <p contentEditable suppressContentEditableWarning>........................</p>
                      </div>
                      <div>
                        <p className="mb-12 text-gray-400 border-2 border-gray-400 rounded-full w-24 h-24 flex items-center justify-center mx-auto text-sm" suppressContentEditableWarning>{settings.schoolSealText}</p>
                      </div>
                      <div>
                        <p className="mb-12" suppressContentEditableWarning>مدير المدرسة</p>
                        <p suppressContentEditableWarning>{settings.principalName}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
