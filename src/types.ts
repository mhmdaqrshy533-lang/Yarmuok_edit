export type ViewState = 'home' | 'monthly_results' | 'progress_dashboard' | 'card_view' | 'student_list' | 'certificate' | 'student_form' | 'accounting' | 'exam_editor' | 'doc_editor' | 'settings' | 'plan' | 'attendance' | 'omr_scanner' | 'spec_table' | 'ai_generator';

export interface AppSettings {
  country: string;
  ministry: string;
  governorate: string;
  directorate: string;
  schoolName: string;
  principalName: string;
  schoolSealText: string;
  year: string;
  
  // Customization Options from UI XML
  numberLanguage: 'arabic' | 'hindi'; // '123' | '١٢٣'
  highlightColor: string;
  showHeader: boolean;
  showMirror: boolean;
  showWatermark: boolean;
  showFrame: boolean;
  
  // Max Points Config
  maxPoints: {
    homework: number;
    attendance: number;
    oral: number;
    written: number;
    behavior: number;
  };
}

export interface Student {
  id: string;
  name: string;
  gender: 'ذكر' | 'أنثى';
  birthDate: string;
  birthPlace: string;
  guardian: string;
  seatNumber?: string;
  schoolYear: string;
  // History
  grade6?: { year: string; school: string; governorate: string; directorate: string; };
  grade7?: { year: string; school: string; governorate: string; directorate: string; };
  grade8?: { year: string; school: string; governorate: string; directorate: string; };
  // Monthly Grades
  grades?: {
    month1?: MonthGrades;
    month2?: MonthGrades;
    month3?: MonthGrades;
  };
  // Accounting
  accounting?: {
    totalFees: number;
    paidFees: number;
    transactions?: Transaction[];
  };
}

export interface MonthGrades {
  homework: number | null;
  attendance: number | null;
  oral: number | null;
  written: number | null;
}

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  type: 'payment' | 'charge';
  note: string;
}
