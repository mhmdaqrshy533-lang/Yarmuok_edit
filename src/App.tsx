import { useState } from 'react';
import Home from './views/Home';
import MonthlyResults from './views/MonthlyResults';
import ProgressDashboard from './views/ProgressDashboard';
import CardView from './views/CardView';
import CertificateView from './views/CertificateView';
import StudentList from './views/StudentList';
import StudentForm from './views/StudentForm';
import Accounting from './views/Accounting';
import ExamEditor from './views/ExamEditor';
import DocEditor from './views/DocEditor';
import Settings from './views/Settings';
import { ViewState } from './types';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>('home');

  return (
    <div className="min-h-screen bg-black font-sans flex justify-center" dir="rtl">
      {/* Global wrapper, full screen on mobile, max-width on desktop */}
      <div className="w-full max-w-[1600px] bg-black text-white min-h-screen shadow-2xl relative overflow-hidden flex flex-col mx-auto">
        {currentView === 'home' && <Home setView={setCurrentView} />}
        {currentView === 'monthly_results' && <MonthlyResults setView={setCurrentView} />}
        {currentView === 'progress_dashboard' && <ProgressDashboard setView={setCurrentView} />}
        {currentView === 'card_view' && <CardView setView={setCurrentView} />}
        {currentView === 'certificate' && <CertificateView setView={setCurrentView} />}
        {currentView === 'student_list' && <StudentList setView={setCurrentView} />}
        {currentView === 'student_form' && <StudentForm setView={setCurrentView} />}
        {currentView === 'accounting' && <Accounting setView={setCurrentView} />}
        {currentView === 'exam_editor' && <ExamEditor setView={setCurrentView} />}
        {currentView === 'doc_editor' && <DocEditor setView={setCurrentView} />}
        {currentView === 'settings' && <Settings setView={setCurrentView} />}
      </div>
    </div>
  );
}
