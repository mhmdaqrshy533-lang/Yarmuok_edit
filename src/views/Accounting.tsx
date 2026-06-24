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
    <div className="flex flex-col h-full bg-gray-50 relative">
      {/* Top Bar */}
      <div className="bg-[#1a5b48] text-white flex items-center justify-between p-4 shadow-md z-10 rounded-b-xl">
        <button onClick={() => setView('home')} className="p-1 hover:bg-white/10 rounded-full">
          <ArrowRight className="w-5 h-5 text-white" />
        </button>
        <div className="text-center flex-1">
          <h1 className="font-bold text-lg">كشف حساب الطالب</h1>
        </div>
        <div className="w-6"></div>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-4 text-right" dir="rtl">
        {/* Student Selector */}
        <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
          <label className="text-xs font-bold text-gray-500 block mb-1">اختر الطالب</label>
          <select 
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:border-[#1a5b48]"
          >
            {students.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>

        {selectedStudent && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 text-center">
                <span className="block text-[10px] text-gray-500 font-bold mb-1">إجمالي الرسوم</span>
                <span className="font-bold text-[#1a3a6c]">{totalCharges.toLocaleString()}</span>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 text-center">
                <span className="block text-[10px] text-gray-500 font-bold mb-1">المدفوع</span>
                <span className="font-bold text-teal-600">{totalPayments.toLocaleString()}</span>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 text-center">
                <span className="block text-[10px] text-gray-500 font-bold mb-1">المتبقي</span>
                <span className="font-bold text-red-600">{remaining.toLocaleString()}</span>
              </div>
            </div>

            {/* Transactions List */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gray-100 p-3 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-bold text-gray-800 text-sm">الحركات المالية</h3>
                <button 
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="bg-[#1a5b48] text-white p-1 rounded hover:bg-[#124233]"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {showAddForm && (
                <div className="p-3 bg-gray-50 border-b border-gray-200 space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <input 
                      type="number" 
                      placeholder="المبلغ"
                      value={amount}
                      onChange={e => setAmount(e.target.value)}
                      className="border border-gray-300 rounded px-2 py-1.5 text-sm"
                    />
                    <select 
                      value={type}
                      onChange={e => setType(e.target.value as any)}
                      className="border border-gray-300 rounded px-2 py-1.5 text-sm"
                    >
                      <option value="payment">سداد (دفعة)</option>
                      <option value="charge">قيد (رسوم)</option>
                    </select>
                  </div>
                  <input 
                    type="text" 
                    placeholder="البيان (ملاحظات)"
                    value={note}
                    onChange={e => setNote(e.target.value)}
                    className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
                  />
                  <button onClick={handleAddTransaction} className="w-full bg-[#1a5b48] text-white py-2 rounded text-sm font-bold">
                    حفظ العملية
                  </button>
                </div>
              )}

              <div className="divide-y divide-gray-100">
                {transactions.length === 0 ? (
                  <div className="p-8 text-center text-gray-400 text-sm">
                    <Receipt className="w-8 h-8 mx-auto mb-2 opacity-20" />
                    لا توجد حركات مالية
                  </div>
                ) : (
                  transactions.map(t => (
                    <div key={t.id} className="p-3 flex justify-between items-center text-sm group">
                      <div>
                        <p className="font-bold text-gray-800">{t.note}</p>
                        <p className="text-xs text-gray-500 mt-1">{t.date}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className={`font-bold ${t.type === 'payment' ? 'text-teal-600' : 'text-orange-600'}`}>
                          {t.type === 'payment' ? '+' : '-'}{t.amount.toLocaleString()}
                        </div>
                        <button 
                          onClick={() => {
                            if(confirm('هل أنت متأكد من حذف هذه الحركة؟')) {
                              deleteTransaction(selectedStudentId, t.id);
                            }
                          }}
                          className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
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
        )}
      </div>
    </div>
  );
}
