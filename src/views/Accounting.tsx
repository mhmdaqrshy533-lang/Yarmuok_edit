import { ArrowRight, Plus, Receipt, Trash2 } from 'lucide-react';
import { ViewState } from '../types';
import { useState } from 'react';
import { useStore } from '../store';

interface AccountingProps {
  setView: (view: ViewState) => void;
}

export default function Accounting({ setView }: AccountingProps) {
  const { students, addTransaction, deleteTransaction } = useStore();
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || '');
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [type, setType] = useState<'payment' | 'charge'>('payment');

  const selectedStudent = students.find(s => s.id === selectedStudentId);

  const handleAddTransaction = () => {
    if (!amount || isNaN(Number(amount))) return;
    
    addTransaction(selectedStudentId, {
      amount: Number(amount),
      type,
      note: note || (type === 'payment' ? 'سداد رسوم' : 'إضافة رسوم')
    });
    
    setAmount('');
    setNote('');
    setShowAddForm(false);
  };

  const accounting = selectedStudent?.accounting || { totalFees: 0, paidFees: 0, transactions: [] };
  const transactions = accounting.transactions || [];
  
  // Recalculate totals based on transactions instead of manual properties
  const totalCharges = transactions.filter(t => t.type === 'charge').reduce((acc, t) => acc + t.amount, 0) + (accounting.totalFees || 0);
  const totalPayments = transactions.filter(t => t.type === 'payment').reduce((acc, t) => acc + t.amount, 0);
  const remaining = totalCharges - totalPayments;

  return (
    <div className="flex flex-col h-full bg-black relative text-gray-200">
      {/* Top Bar */}
      <div className="bg-gray-900/90 backdrop-blur-xl text-white flex items-center justify-between p-4 shadow-[0_4px_30px_rgba(147,51,234,0.15)] z-10 sticky top-0 border-b border-purple-500/20">
        <button onClick={() => setView('home')} className="p-2 hover:bg-white/10 rounded-xl transition-colors group">
          <ArrowRight className="w-5 h-5 text-purple-400 group-hover:text-cyan-400" />
        </button>
        <div className="text-center flex-1">
          <h1 className="font-bold text-lg text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">المحاسب المدرسي</h1>
        </div>
        <div className="w-9"></div>
      </div>

      <div className="flex-1 overflow-auto p-4 md:p-8 space-y-6 text-right w-full max-w-4xl mx-auto" dir="rtl">
        {/* Student Selector */}
        <div className="bg-gray-900/60 backdrop-blur-xl p-6 rounded-3xl shadow-[0_0_30px_rgba(147,51,234,0.1)] border border-purple-500/20">
          <label className="text-sm font-semibold text-cyan-400 block mb-3">تحديد الطالب</label>
          <select 
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            className="w-full border border-purple-500/30 bg-black/50 rounded-2xl py-3 px-4 text-base focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all font-medium text-white appearance-none"
          >
            {students.map(s => (
              <option key={s.id} value={s.id} className="bg-gray-900 text-white">{s.name}</option>
            ))}
          </select>
        </div>

        {selectedStudent && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-900/40 backdrop-blur-xl rounded-3xl shadow-lg border border-purple-500/30 p-4 md:p-6 text-center hover:shadow-[0_0_20px_rgba(147,51,234,0.15)] transition-all">
                <span className="block text-xs md:text-sm text-gray-400 font-bold mb-2">إجمالي الرسوم</span>
                <span className="font-bold text-xl md:text-2xl text-white">{totalCharges.toLocaleString()}</span>
              </div>
              <div className="bg-cyan-900/20 backdrop-blur-xl rounded-3xl shadow-lg border border-cyan-500/30 p-4 md:p-6 text-center hover:shadow-[0_0_20px_rgba(34,211,238,0.15)] transition-all">
                <span className="block text-xs md:text-sm text-cyan-400 font-bold mb-2">المدفوع</span>
                <span className="font-bold text-xl md:text-2xl text-cyan-300">{totalPayments.toLocaleString()}</span>
              </div>
              <div className="bg-rose-900/20 backdrop-blur-xl rounded-3xl shadow-lg border border-rose-500/30 p-4 md:p-6 text-center hover:shadow-[0_0_20px_rgba(244,63,94,0.15)] transition-all">
                <span className="block text-xs md:text-sm text-rose-400 font-bold mb-2">المتبقي</span>
                <span className="font-bold text-xl md:text-2xl text-rose-300">{remaining.toLocaleString()}</span>
              </div>
            </div>

            {/* Transactions List */}
            <div className="bg-gray-900/40 backdrop-blur-xl rounded-3xl shadow-[0_0_30px_rgba(147,51,234,0.1)] border border-purple-500/20 overflow-hidden">
              <div className="bg-black/40 p-5 border-b border-purple-500/20 flex justify-between items-center">
                <h3 className="font-bold text-white text-lg">الحركات المالية</h3>
                <button 
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white p-2 md:px-4 md:py-2 rounded-xl hover:from-purple-500 hover:to-cyan-500 transition-all shadow-[0_0_15px_rgba(147,51,234,0.3)] flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  <span className="hidden md:block font-bold text-sm">إضافة حركة</span>
                </button>
              </div>

              {showAddForm && (
                <div className="p-6 bg-gray-900/60 border-b border-purple-500/20 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <input 
                      type="number" 
                      placeholder="المبلغ"
                      value={amount}
                      onChange={e => setAmount(e.target.value)}
                      className="border border-purple-500/30 rounded-2xl px-4 py-3 text-base bg-black/50 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all placeholder-gray-500"
                    />
                    <select 
                      value={type}
                      onChange={e => setType(e.target.value as any)}
                      className="border border-purple-500/30 rounded-2xl px-4 py-3 text-base bg-black/50 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all appearance-none"
                    >
                      <option value="payment">سداد دفعة (مقبوضات)</option>
                      <option value="charge">قيد رسوم (استحقاق)</option>
                    </select>
                  </div>
                  <input 
                    type="text" 
                    placeholder="البيان أو الملاحظات"
                    value={note}
                    onChange={e => setNote(e.target.value)}
                    className="w-full border border-purple-500/30 rounded-2xl px-4 py-3 text-base bg-black/50 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all placeholder-gray-500"
                  />
                  <button onClick={handleAddTransaction} className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 text-white py-3 rounded-2xl text-base font-bold hover:from-purple-500 hover:to-cyan-500 transition-all shadow-[0_0_15px_rgba(147,51,234,0.3)]">
                    حفظ العملية
                  </button>
                </div>
              )}

              <div className="divide-y divide-purple-500/10">
                {transactions.length === 0 ? (
                  <div className="p-12 text-center text-gray-500">
                    <Receipt className="w-16 h-16 mx-auto mb-4 opacity-20 text-purple-400" />
                    <p className="font-medium text-lg">لا توجد حركات مالية مسجلة</p>
                  </div>
                ) : (
                  transactions.map(t => (
                    <div key={t.id} className="p-5 flex justify-between items-center group hover:bg-purple-900/20 transition-colors">
                      <div>
                        <p className="font-bold text-gray-100 text-base">{t.note}</p>
                        <p className="text-sm text-gray-400 mt-1">{t.date}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className={`font-bold text-lg px-3 py-1 rounded-lg border ${t.type === 'payment' ? 'text-cyan-300 bg-cyan-900/20 border-cyan-500/30' : 'text-rose-300 bg-rose-900/20 border-rose-500/30'}`}>
                          {t.type === 'payment' ? '+' : '-'}{t.amount.toLocaleString()}
                        </div>
                        <button 
                          onClick={() => {
                            if(confirm('هل أنت متأكد من حذف هذه الحركة؟')) {
                              deleteTransaction(selectedStudentId, t.id);
                            }
                          }}
                          className="text-rose-400 hover:text-rose-300 hover:bg-rose-900/30 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
