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
import Plan from './views/Plan';
import Attendance from './views/Attendance';
import OMRScanner from './views/OMRScanner';
import SpecTable from './views/SpecTable';
import AIGenerator from './views/AIGenerator';
import { ViewState } from './types';
import { useStore } from './store';
import { LicenseShield } from './components/LicenseShield';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>('home');
  const { settings } = useStore();
  const themeClass = settings.theme ? `theme-${settings.theme}` : 'theme-emerald';
  const fontStyle = settings.currentFont ? { fontFamily: settings.currentFont } : {};

  return (
    <div className={`min-h-screen bg-black flex justify-center ${themeClass}`} dir="rtl" style={fontStyle}>
      <LicenseShield>
        {/* Global wrapper, full screen on mobile, max-width on desktop */}
        <div className="w-full max-w-[1600px] bg-theme-bg-main text-theme-text-light min-h-screen shadow-2xl relative overflow-hidden flex flex-col mx-auto border-x border-theme-border/20 scrollable-content">
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
          {currentView === 'plan' && <Plan setView={setCurrentView} />}
          {currentView === 'attendance' && <Attendance setView={setCurrentView} />}
          {currentView === 'omr_scanner' && <OMRScanner setView={setCurrentView} />}
          {currentView === 'spec_table' && <SpecTable setView={setCurrentView} />}
          {currentView === 'ai_generator' && <AIGenerator setView={setCurrentView} />}
        </div>
      </LicenseShield>
    </div>
  );
}
