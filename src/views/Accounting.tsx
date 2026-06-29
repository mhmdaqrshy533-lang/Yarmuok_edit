import { ArrowRight, Plus, Receipt, Trash2, Coins } from 'lucide-react';
import { ViewState } from '../types';
import { useState } from 'react';
import { useStore } from '../store';

interface AccountingProps {
  setView: (view: ViewState) => void;
}

export default function Accounting({ setView }: AccountingProps) {
  const { students, addTransaction, deleteTransaction, transactions } = useStore();
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || '');
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [type, setType] = useState<'payment' | 'charge'>('payment');

  const selectedStudent = students.find(s => s.id === selectedStudentId);

  const handleAddTransaction = () => {
    if (!amount || isNaN(Number(amount))) {
      alert('يرجى إدخال مبلغ صحيح.');
      return;
    }
    
    addTransaction(selectedStudentId, {
      amount: Number(amount),
      type,
      note: note || (type === 'payment' ? 'سداد رسوم' : 'إضافة قيد رسوم جديدة')
    });
    
    setAmount('');
    setNote('');
    setShowAddForm(false);
  };

  const studentTransactions = selectedStudentId ? (transactions[selectedStudentId] || []) : [];
  
  // Recalculate totals based on transactions instead of manual properties
  const totalCharges = studentTransactions.filter(t => t.type === 'charge').reduce((acc, t) => acc + t.amount, 0);
  const totalPayments = studentTransactions.filter(t => t.type === 'payment').reduce((acc, t) => acc + t.amount, 0);
  const remaining = totalCharges - totalPayments;

  return (
    <div className="flex flex-col h-full bg-[#121619] relative text-gray-200 font-sans">
      {/* Top Bar */}
      <div className="bg-[#0f291e] text-white flex items-center justify-between p-4 shadow-[0_4px_30px_rgba(16,185,129,0.1)] z-10 sticky top-0 border-b border-emerald-900/50">
        <button onClick={() => setView('home')} className="p-2 hover:bg-emerald-950/40 rounded-xl transition-colors group">
          <ArrowRight className="w-5 h-5 text-emerald-400 group-hover:text-emerald-300" />
        </button>
        <div className="text-center flex-1">
          <h1 className="font-bold text-lg text-emerald-400">النظام المالي والمحاسبي المدرسي</h1>
        </div>
        <div className="w-9"></div>
      </div>

      <div className="flex-1 overflow-auto p-4 md:p-8 space-y-6 text-right w-full max-w-4xl mx-auto" dir="rtl">
        
        {/* Student Selector Card */}
        <div className="bg-[#1a2024] p-6 rounded-3xl border border-emerald-900/30 shadow-xl">
          <label className="text-sm font-bold text-emerald-400 block mb-3 flex items-center gap-2">
            <span>👤</span> اختر الطالب المستعلم لتعديل كشفه المالي:
          </label>
          <select 
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            className="w-full border border-emerald-900/30 bg-[#111517] rounded-2xl py-3 px-4 text-base focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-bold text-white appearance-none"
          >
            {students.length === 0 ? (
              <option value="">لا يوجد طلاب مسجلين حالياً</option>
            ) : (
              students.map(s => (
                <option key={s.id} value={s.id} className="bg-gray-900 text-white">{s.name}</option>
              ))
            )}
          </select>
        </div>

        {selectedStudent ? (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-[#1a2024] border border-emerald-900/30 rounded-3xl p-4 md:p-6 text-center shadow-lg">
                <span className="block text-xs md:text-sm text-gray-400 font-bold mb-2">إجمالي الرسوم المقيدة</span>
                <span className="font-bold text-xl md:text-2xl text-white font-mono">{totalCharges.toLocaleString()}</span>
              </div>
              <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-3xl p-4 md:p-6 text-center shadow-lg">
                <span className="block text-xs md:text-sm text-emerald-400 font-bold mb-2">إجمالي المسدد</span>
                <span className="font-bold text-xl md:text-2xl text-emerald-300 font-mono">{totalPayments.toLocaleString()}</span>
              </div>
              <div className={`${remaining > 0 ? 'bg-rose-950/20 border-rose-500/30 text-rose-300' : 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'} border rounded-3xl p-4 md:p-6 text-center shadow-lg`}>
                <span className="block text-xs md:text-sm text-gray-400 font-bold mb-2">المتبقي المطلوب سداده</span>
                <span className="font-bold text-xl md:text-2xl font-mono">{remaining.toLocaleString()}</span>
              </div>
            </div>

            {/* Transactions List */}
            <div className="bg-[#1a2024] rounded-3xl shadow-xl border border-emerald-900/30 overflow-hidden">
              <div className="bg-[#121619]/60 p-5 border-b border-emerald-900/30 flex justify-between items-center">
                <h3 className="font-bold text-emerald-400 text-base">سجل السندات والحركات المالية</h3>
                <button 
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl transition-all shadow-md flex items-center gap-2 text-sm font-bold"
                >
                  <Plus className="w-4 h-4" />
                  إضافة حركة / سند مالي
                </button>
              </div>

              {showAddForm && (
                <div className="p-6 bg-[#161c20] border-b border-emerald-900/30 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <input 
                      type="number" 
                      placeholder="المبلغ بالريال"
                      value={amount}
                      onChange={e => setAmount(e.target.value)}
                      className="border border-emerald-900/30 rounded-2xl px-4 py-3 text-base bg-[#111517] text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-bold placeholder-gray-500"
                    />
                    <select 
                      value={type}
                      onChange={e => setType(e.target.value as any)}
                      className="border border-emerald-900/30 rounded-2xl px-4 py-3 text-base bg-[#111517] text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-bold appearance-none"
                    >
                      <option value="payment">سداد دفعة (مقبوضات من الطالب)</option>
                      <option value="charge">قيد رسوم مستحقة (فاتورة / رسم جديد)</option>
                    </select>
                  </div>
                  <input 
                    type="text" 
                    placeholder="البيان أو الملاحظات (مثال: سداد القسط الثاني...)"
                    value={note}
                    onChange={e => setNote(e.target.value)}
                    className="w-full border border-emerald-900/30 rounded-2xl px-4 py-3 text-base bg-[#111517] text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all placeholder-gray-500 font-medium"
                  />
                  <div className="flex justify-end gap-2 pt-2">
                    <button onClick={() => setShowAddForm(false)} className="px-4 py-2 text-xs font-bold text-gray-400 hover:bg-emerald-950/10 rounded-xl transition-all">إلغاء</button>
                    <button onClick={handleAddTransaction} className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-xl text-xs font-bold transition-all shadow-md">
                      اعتماد السند وحفظ العملية
                    </button>
                  </div>
                </div>
              )}

              <div className="divide-y divide-[#121619]">
                {studentTransactions.length === 0 ? (
                  <div className="p-12 text-center text-gray-500">
                    <Receipt className="w-12 h-12 mx-auto mb-4 opacity-20 text-emerald-400" />
                    <p className="font-bold text-sm text-gray-400">لا توجد حركات مالية مسجلة لهذا الطالب بعد.</p>
                    <p className="text-xs text-gray-600 mt-1">ابدأ بإضافة حركة كقيد رسوم أو سداد دفعة.</p>
                  </div>
                ) : (
                  studentTransactions.map(t => (
                    <div key={t.id} className="p-5 flex justify-between items-center group hover:bg-emerald-950/10 transition-colors">
                      <div>
                        <p className="font-bold text-gray-100 text-sm">{t.note}</p>
                        <p className="text-[10px] font-mono text-gray-500 mt-1">{t.date}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className={`font-bold text-sm font-mono px-3 py-1 rounded-lg border ${t.type === 'payment' ? 'text-emerald-300 bg-emerald-950/20 border-emerald-500/30' : 'text-rose-300 bg-rose-950/20 border-rose-500/30'}`}>
                          {t.type === 'payment' ? '+' : '-'}{t.amount.toLocaleString()}
                        </div>
                        <button 
                          onClick={() => {
                            if(confirm('هل أنت متأكد من حذف هذه الحركة؟')) {
                              deleteTransaction(selectedStudentId, t.id);
                            }
                          }}
                          className="text-rose-400 hover:text-rose-300 hover:bg-rose-950/20 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                          title="حذف الحركة"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="p-12 text-center bg-[#1a2024] border border-emerald-900/30 rounded-3xl text-gray-500 shadow-xl">
             <Coins className="w-16 h-16 text-emerald-400/20 mx-auto mb-4" />
             <p className="font-bold">يرجى تسجيل وإضافة طلاب أولاً للتمكن من إدارة العمليات الحسابية والرسوم.</p>
          </div>
        )}
      </div>
    </div>
  );
}
