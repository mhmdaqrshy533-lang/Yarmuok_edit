import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Student, AppSettings } from '../types';

interface AppState {
  settings: AppSettings;
  updateSettings: (settings: Partial<AppSettings>) => void;
  students: Student[];
  editingStudentId: string | null;
  setEditingStudentId: (id: string | null) => void;
  addStudent: (student: Student) => void;
  updateStudent: (id: string, updates: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  updateGrade: (studentId: string, month: 'month1' | 'month2' | 'month3', field: keyof Student['grades']['month1'], value: number | null) => void;
  addTransaction: (studentId: string, transaction: { amount: number, type: 'payment' | 'charge', note: string }) => void;
  deleteTransaction: (studentId: string, transactionId: string) => void;
}

const defaultSettings: AppSettings = {
  country: 'الجمهورية اليمنية',
  ministry: 'وزارة التربية والتعليم',
  governorate: 'محافظة ...',
  directorate: 'مديرية ...',
  schoolName: 'مدرسة أبي ذر الغفاري',
  principalName: 'أ. مدير المدرسة',
  schoolSealText: 'الختم الرسمي للمدرسة',
  year: '2025 / 2026',
  numberLanguage: 'arabic',
  highlightColor: '#FFE1BEE7',
  showHeader: true,
  showMirror: true,
  showWatermark: true,
  showFrame: true,
  maxPoints: {
    homework: 20,
    attendance: 20,
    oral: 20,
    written: 40,
    behavior: 0 // Optional extra depending on specific configuration
  }
};

const defaultStudents: Student[] = [
  {
    id: '1',
    name: 'طالب تجريبي 1',
    gender: 'ذكر',
    birthDate: '2010/01/01',
    birthPlace: 'المدينة',
    guardian: 'ولي الأمر 1',
    schoolYear: '2025 / 2026',
    grade6: { year: '2022 / 2023', school: 'مدرسة سابقة', governorate: 'محافظة', directorate: 'مديرية' },
    grade7: { year: '2023 / 2024', school: 'مدرسة سابقة', governorate: 'محافظة', directorate: 'مديرية' },
    grade8: { year: '2024 / 2025', school: 'مدرسة سابقة', governorate: 'محافظة', directorate: 'مديرية' },
    grades: {
      month1: { homework: 20, attendance: 20, oral: 20, written: 40 }
    },
    accounting: {
      totalFees: 50000,
      paidFees: 20000,
      transactions: [
        { id: 't1', date: '2025-01-01', amount: 50000, type: 'charge', note: 'رسوم دراسية' },
        { id: 't2', date: '2025-02-15', amount: 20000, type: 'payment', note: 'دفعة أولى' }
      ]
    }
  },
  {
    id: '2',
    name: 'طالبة تجريبية 2',
    gender: 'أنثى',
    birthDate: '2010/05/15',
    birthPlace: 'المدينة',
    guardian: 'ولي الأمر 2',
    schoolYear: '2025 / 2026',
    grades: {
      month1: { homework: null, attendance: null, oral: null, written: null }
    },
    accounting: {
      totalFees: 50000,
      paidFees: 50000,
      transactions: [
        { id: 't3', date: '2025-01-01', amount: 50000, type: 'charge', note: 'رسوم دراسية' },
        { id: 't4', date: '2025-01-10', amount: 50000, type: 'payment', note: 'دفع كامل' }
      ]
    }
  }
];

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      settings: defaultSettings,
      updateSettings: (updates) => set((state) => ({ settings: { ...state.settings, ...updates } })),
      students: defaultStudents,
      editingStudentId: null,
      setEditingStudentId: (id) => set({ editingStudentId: id }),
      addStudent: (student) => set((state) => ({ students: [...state.students, student] })),
      updateStudent: (id, updates) => set((state) => ({
        students: state.students.map((s) => s.id === id ? { ...s, ...updates } : s)
      })),
      deleteStudent: (id) => set((state) => ({
        students: state.students.filter((s) => s.id !== id)
      })),
      updateGrade: (studentId, month, field, value) => set((state) => ({
        students: state.students.map((s) => {
          if (s.id === studentId) {
            const currentGrades = s.grades || {};
            const currentMonth = currentGrades[month] || { homework: null, attendance: null, oral: null, written: null };
            return {
              ...s,
              grades: {
                ...currentGrades,
                [month]: {
                  ...currentMonth,
                  [field]: value
                }
              }
            };
          }
          return s;
        })
      })),
      addTransaction: (studentId, transaction) => set((state) => ({
        students: state.students.map((s) => {
          if (s.id === studentId) {
            const currentAccounting = s.accounting || { totalFees: 0, paidFees: 0, transactions: [] };
            const newTransaction = {
              id: Math.random().toString(36).substring(7),
              date: new Date().toISOString().split('T')[0],
              amount: transaction.amount,
              type: transaction.type,
              note: transaction.note
            };
            return {
              ...s,
              accounting: {
                ...currentAccounting,
                totalFees: transaction.type === 'charge' ? currentAccounting.totalFees + transaction.amount : currentAccounting.totalFees,
                paidFees: transaction.type === 'payment' ? currentAccounting.paidFees + transaction.amount : currentAccounting.paidFees,
                transactions: [...(currentAccounting.transactions || []), newTransaction]
              }
            };
          }
          return s;
        })
      })),
      deleteTransaction: (studentId, transactionId) => set((state) => ({
        students: state.students.map((s) => {
          if (s.id === studentId && s.accounting) {
            const currentAccounting = s.accounting;
            const transactionToDelete = currentAccounting.transactions?.find(t => t.id === transactionId);
            
            if (!transactionToDelete) return s;

            return {
              ...s,
              accounting: {
                ...currentAccounting,
                totalFees: transactionToDelete.type === 'charge' ? currentAccounting.totalFees - transactionToDelete.amount : currentAccounting.totalFees,
                paidFees: transactionToDelete.type === 'payment' ? currentAccounting.paidFees - transactionToDelete.amount : currentAccounting.paidFees,
                transactions: currentAccounting.transactions?.filter(t => t.id !== transactionId) || []
              }
            };
          }
          return s;
        })
      }))
    }),
    {
      name: 'school-management-storage',
    }
  )
);
