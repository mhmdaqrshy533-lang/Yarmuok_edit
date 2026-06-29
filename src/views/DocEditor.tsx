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
    { id: '1', type: 'title', content: 'إفادة مدرسية رسمية' },
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
      id: Math.random().toString(36).substring(7),
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
    <div className="flex flex-col h-full bg-[#121619] relative text-gray-200 font-sans">
      {/* Top Bar */}
      <div className="bg-[#0f291e] text-white flex items-center justify-between p-4 shadow-[0_4px_30px_rgba(16,185,129,0.1)] z-20 sticky top-0 border-b border-emerald-900/50 print:hidden">
        <button onClick={() => setView('home')} className="p-2 hover:bg-emerald-950/40 rounded-xl transition-colors group">
          <ArrowRight className="w-5 h-5 text-emerald-400 group-hover:text-emerald-300" />
        </button>
        <div className="text-center flex-1">
          <h1 className="font-bold text-lg text-emerald-400">منشئ الوثائق والمحررات الرسمية</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-black/50 border border-emerald-900/30 rounded-xl p-1" dir="ltr">
            <button onClick={() => setZoom(z => Math.max(0.5, z - 0.1))} className="px-2 py-0.5 hover:bg-emerald-950/40 rounded-lg text-emerald-400 hover:text-emerald-300 font-bold text-sm">-</button>
            <span className="text-xs font-mono w-10 text-center text-emerald-300">{Math.round(zoom * 100)}%</span>
            <button onClick={() => setZoom(z => Math.min(2, z + 0.1))} className="px-2 py-0.5 hover:bg-emerald-950/40 rounded-lg text-emerald-400 hover:text-emerald-300 font-bold text-sm">+</button>
          </div>
          <button onClick={() => handlePrint()} data-print="true" className="p-2 hover:bg-[#1a2320]/60 rounded-xl transition-colors group border border-emerald-900/30">
            <Printer className="w-5 h-5 text-emerald-400 group-hover:text-emerald-300" />
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden" dir="rtl">
        {/* Sidebar Builder Controls */}
        <div className="w-64 bg-[#171c20] border-l border-emerald-900/30 p-4 flex flex-col gap-4 overflow-y-auto print:hidden shadow-lg z-10">
          <h2 className="font-bold text-emerald-400 text-sm mb-2 border-b border-emerald-900/20 pb-2">أدوات بناء المستند</h2>
          
          <button onClick={() => addBlock('title')} className="flex items-center gap-3 bg-black/50 border border-emerald-900/20 p-3 rounded-xl hover:bg-emerald-950/20 hover:border-emerald-500/50 transition-all text-sm font-bold group">
            <Type className="w-4 h-4 text-emerald-400" /> إضافة عنوان مستند
          </button>
          
          <button onClick={() => addBlock('paragraph')} className="flex items-center gap-3 bg-black/50 border border-emerald-900/20 p-3 rounded-xl hover:bg-emerald-950/20 hover:border-emerald-500/50 transition-all text-sm font-bold group">
            <AlignLeft className="w-4 h-4 text-emerald-400" /> إضافة فقرة جديدة
          </button>

          <button onClick={() => addBlock('line')} className="flex items-center gap-3 bg-black/50 border border-emerald-900/20 p-3 rounded-xl hover:bg-emerald-950/20 hover:border-emerald-500/50 transition-all text-sm font-bold group">
            <Minus className="w-4 h-4 text-emerald-400" /> إضافة خط فاصل
          </button>
          
          <button onClick={() => addBlock('signature')} className="flex items-center gap-3 bg-black/50 border border-emerald-900/20 p-3 rounded-xl hover:bg-emerald-950/20 hover:border-emerald-500/50 transition-all text-sm font-bold group">
            <PenTool className="w-4 h-4 text-emerald-400" /> إضافة حقل توقيعات
          </button>

          <div className="mt-auto bg-emerald-950/10 border border-emerald-900/30 p-4 rounded-xl">
             <p className="text-[11px] text-emerald-500 leading-relaxed text-center font-bold">يمكنك تعديل أي نص في الوثيقة أو حذف أي سطر مباشرة بمجرد النقر عليه والبدء بالكتابة!</p>
          </div>
        </div>

        {/* Document Canvas */}
        <div className="flex-1 overflow-auto p-4 md:p-8 bg-gray-950 print:p-0 print:bg-white relative flex justify-center items-start">
          <div 
            ref={componentRef} 
            style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
            className="bg-white text-black w-[210mm] min-h-[297mm] shadow-[0_0_40px_rgba(16,185,129,0.05)] relative p-12 print:p-0 print:shadow-none print:w-full mx-auto font-serif print:transform-none transition-transform duration-200"
            dir="rtl"
          >
            {/* Official Header */}
            <div className="flex justify-between items-start border-b-2 border-black pb-4 mb-12 text-sm font-bold">
              <div className="text-right space-y-1 w-1/3">
                <p>{settings.country}</p>
                <p>{settings.ministry}</p>
                <p>مكتب التربية والتعليم بمحافظة {settings.governorate}</p>
                <p>مدرسة {settings.schoolName}</p>
              </div>
              <div className="text-center w-1/3 flex flex-col items-center justify-center gap-1">
                {settings.customLogo && (
                  <img src={settings.customLogo} alt="Logo" className="w-12 h-12 object-contain" />
                )}
                {settings.customSeal ? (
                  <img src={settings.customSeal} alt="Seal" className="w-16 h-16 object-contain rounded-full border border-emerald-600/30 p-0.5 bg-white/50" />
                ) : (
                  <div className="w-20 h-20 bg-yellow-100/30 rounded-full border-2 border-emerald-800 flex items-center justify-center text-xs text-emerald-900 font-bold shadow-sm">
                    الختم الرسمي
                  </div>
                )}
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
              {blocks.map((block) => (
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
                    <p 
                      className="text-lg leading-relaxed text-justify whitespace-pre-wrap focus:outline-none focus:bg-gray-50 rounded p-2" 
                      contentEditable 
                      suppressContentEditableWarning
                      onBlur={(e) => updateBlock(block.id, e.currentTarget.textContent || '')}
                    >
                      {block.content}
                    </p>
                  )}

                  {block.type === 'line' && (
                    <hr className="my-6 border-t-2 border-black" />
                  )}

                  {block.type === 'signature' && (
                    <div className="flex justify-between items-center mt-12 text-base font-bold text-center px-8">
                      <div>
                        <p>مربي الصف</p>
                        <p className="mt-12">................................</p>
                      </div>
                      
                      <div className="flex flex-col items-center justify-center opacity-85" title="الختم السيادي المعتمد">
                         <div className="w-16 h-16 border-4 border-double border-emerald-600 rounded-full flex flex-col items-center justify-center mb-1 relative">
                           <div className="absolute inset-0 border border-emerald-400 rounded-full scale-[0.8] rotate-45 border-dashed"></div>
                           <div className="text-emerald-700 font-black text-[10px] leading-none">ΣIGMA</div>
                           <div className="text-[5px] text-emerald-600 mt-0.5 uppercase">Certified</div>
                         </div>
                      </div>

                      <div>
                        <p>مدير المدرسة / المخول</p>
                        <p className="mt-12">{settings.principalName}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Print Footer Watermark */}
            {settings.showWatermark && (
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center text-[10px] text-gray-400 font-bold border-t border-gray-200 pt-2 print:flex hidden">
                <span>تم الإنشاء والتدقيق بواسطة منصة ΣIGMA التعليمية</span>
                <span>النظام السيادي اليمني لإدارة المدارس الأهلية والحكومية</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
