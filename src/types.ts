export type ViewState = 'home' | 'monthly_results' | 'progress_dashboard' | 'card_view' | 'student_list' | 'certificate';

export interface Student {
  id: number;
  name: string;
  homework: number | string;
  attendance: number | string;
  oral: number | string;
  written: number | string;
  total: number;
  final: number;
}
