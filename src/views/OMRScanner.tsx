import { useState, useRef } from 'react';
import { ArrowRight, Camera, Upload, CheckCircle2, AlertCircle, RefreshCw, BarChart2, Check, X, Printer, Settings as SettingsIcon } from 'lucide-react';
import { ViewState } from '../types';
import { useStore } from '../store';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { BubbleSheetSVG } from '../components/BubbleSheetSVG';

interface OMRScannerProps {
  setView: (view: ViewState) => void;
}

export default function OMRScanner({ setView }: OMRScannerProps) {
  const { students, updateGrade } = useStore();
  const [activeTab, setActiveTab] = useState<'camera' | 'key' | 'print' | 'analytics'>('camera');
  const [questionCount, setTotalQuestions] = useState<number>(20);
  
  // OMR Answer Key
  const [answerKey, setAnswerKey] = useState<Record<number, string>>(() => {
    const initial: Record<number, string> = {};
    for (let i = 1; i <= 20; i++) {
      initial[i] = ['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)];
    }
    return initial;
  });

  // Camera Scanner Simulation States
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<{
    studentName: string;
    studentId: string;
    score: number;
    total: number;
    answers: Record<number, string>;
    correctCount: number;
  } | null>(null);

  const [selectedStudent, setSelectedStudent] = useState<string>(students[0]?.id || '');
  const [recordingStatus, setRecordingStatus] = useState<'idle' | 'success'>('idle');

  const handleKeyChange = (qNum: number, answer: string) => {
    setAnswerKey(prev => ({ ...prev, [qNum]: answer }));
  };

  const simulateScan = () => {
    if (!selectedStudent) return;
    setScanning(true);
    setScanResult(null);
    setRecordingStatus('idle');

    setTimeout(() => {
      setScanning(false);
      const student = students.find(s => s.id === selectedStudent);
      const correctRatio = 0.6 + Math.random() * 0.35; // 60% to 95% correct
      const correctCount = Math.round(questionCount * correctRatio);
      
      // Simulate student answers
      const studentAnswers: Record<number, string> = {};
      let correctlyAnswered = 0;
      for (let i = 1; i <= questionCount; i++) {
        const isCorrect = correctlyAnswered < correctCount && (Math.random() < 0.8 || i === questionCount);
        if (isCorrect) {
          studentAnswers[i] = answerKey[i];
          correctlyAnswered++;
        } else {
          const options = ['A', 'B', 'C', 'D'].filter(o => o !== answerKey[i]);
          studentAnswers[i] = options[Math.floor(Math.random() * options.length)];
        }
      }

      setScanResult({
        studentName: student ? student.name : 'طالب تجريبي',
        studentId: selectedStudent,
        score: correctlyAnswered,
        total: questionCount,
        answers: studentAnswers,
        correctCount: correctlyAnswered
      });
    }, 2000);
  };

  const saveScoreToDatabase = () => {
    if (!scanResult || !scanResult.studentId) return;
    
    // Scale score to maximum of written points (standard 40 points)
    const scaledScore = Math.round((scanResult.score / scanResult.total) * 40);

    // Save grades in Store using the store's updateGrade method
    updateGrade(scanResult.studentId, 'month1', 'written', scaledScore);
    updateGrade(scanResult.studentId, 'month1', 'homework', 18);
    updateGrade(scanResult.studentId, 'month1', 'attendance', 19);
    updateGrade(scanResult.studentId, 'month1', 'oral', 18);

    setRecordingStatus('success');
    setTimeout(() => {
      setRecordingStatus('idle');
    }, 3000);
  };

  // Sample analytics data for the active sheet
  const analyticsData = Array.from({ length: questionCount }, (_, i) => ({
    name: `س${i + 1}`,
    correct: Math.floor(65 + Math.random() * 30),
    incorrect: Math.floor(5 + Math.random() * 25)
  }));

  return (
    <div className="flex flex-col h-full bg-[#121619] text-white">
      {/* Top Bar */}
      <div className="bg-[#0f291e]/90 backdrop-blur-xl text-white flex items-center justify-between p-4 shadow-md z-10 sticky top-0 border-b border-emerald-500/20">
        <button onClick={() => setView('home')} className="p-2 hover:bg-white/10 rounded-xl transition-colors group">
          <ArrowRight className="w-5 h-5 text-emerald-400 group-hover:text-emerald-300" />
        </button>
        <div className="text-center flex-1">
          <h1 className="font-black text-lg text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 tracking-wide">المصحح الآلي (OMR)</h1>
          <p className="text-[10px] text-emerald-400/80">تصحيح أوراق الإجابات (Bubble Sheet) في ثوانٍ</p>
        </div>
        <div className="w-9" />
      </div>

      {/* Tabs */}
      <div className="flex border-b border-emerald-900/30 bg-[#0c0f0d] p-1 print:hidden" dir="rtl">
        {[
          { id: 'camera', label: 'كاميرا التصحيح', icon: Camera },
          { id: 'key', label: 'مفتاح الإجابة النموذجية', icon: SettingsIcon },
          { id: 'print', label: 'طباعة أوراق الإجابة', icon: Printer },
          { id: 'analytics', label: 'التحليل الإحصائي', icon: BarChart2 }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex flex-col sm:flex-row items-center justify-center gap-2 py-3 px-1 rounded-xl text-xs sm:text-sm font-bold transition-all ${activeTab === tab.id ? 'bg-[#1a2320] text-emerald-400 border border-emerald-500/20' : 'text-gray-400 hover:text-gray-200'}`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Workspace */}
      <div className="flex-1 overflow-auto p-4 md:p-6" dir="rtl">
        
        {/* CAMERA SCANNER TAB */}
        {activeTab === 'camera' && (
          <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Viewfinder Column */}
            <div className="lg:col-span-7 bg-[#1a2320] border border-emerald-900/40 rounded-3xl p-4 shadow-lg flex flex-col">
              <h2 className="text-lg font-bold text-emerald-400 mb-4 flex items-center gap-2">
                <Camera className="w-5 h-5 text-emerald-500" />
                كاميرا التصحيح الذكية
              </h2>
              
              {/* Virtual Viewfinder */}
              <div className="relative aspect-[4/3] w-full rounded-2xl bg-[#0c100e] border border-emerald-800/30 overflow-hidden flex flex-col items-center justify-center">
                {scanning ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 z-20">
                    <RefreshCw className="w-10 h-10 text-emerald-400 animate-spin mb-4" />
                    <span className="text-sm font-bold text-emerald-200">جاري قراءة العلامات البصرية...</span>
                    {/* Scan Line */}
                    <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_10px_#10b981] animate-[bounce_2s_infinite]"></div>
                  </div>
                ) : (
                  <div className="absolute inset-0 border-2 border-emerald-500/20 m-6 rounded-xl pointer-events-none flex items-center justify-center">
                    {/* Corners */}
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-emerald-400"></div>
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-emerald-400"></div>
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-emerald-400"></div>
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-emerald-400"></div>
                    
                    <span className="text-xs font-bold text-emerald-500/60 text-center px-4">
                      ضع ورقة الإجابة (Bubble Sheet) بوضوح داخل الإطار
                    </span>
                  </div>
                )}
                
                {/* simulated camera grid patterns */}
                <div className="w-full h-full opacity-35 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>
              </div>

              {/* Selector / Trigger */}
              <div className="mt-6 flex flex-col sm:flex-row gap-4 items-center">
                <div className="flex-1 w-full">
                  <label className="block text-xs text-gray-400 mb-2 font-bold">حدد اسم الطالب للتجربة:</label>
                  <select 
                    value={selectedStudent} 
                    onChange={e => setSelectedStudent(e.target.value)}
                    className="w-full bg-[#121619] border border-emerald-900/50 rounded-xl px-4 py-3 text-sm font-bold text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="">-- اختر طالب من السجل --</option>
                    {students.map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.gender})</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={simulateScan}
                  disabled={scanning || !selectedStudent}
                  className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white disabled:opacity-50 font-black px-8 py-3.5 rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 whitespace-nowrap self-end"
                >
                  <Camera className="w-5 h-5" />
                  ابدأ التصحيح الآن
                </button>
              </div>
            </div>

            {/* Scan Results Column */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              
              {/* Grading Console */}
              <div className="bg-[#1a2320] border border-emerald-900/40 rounded-3xl p-6 shadow-lg flex-1">
                <h3 className="text-lg font-bold text-emerald-400 mb-4 pb-2 border-b border-emerald-900/30">نتيجة التصحيح الآلي</h3>
                
                {scanResult ? (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-black text-lg text-white">{scanResult.studentName}</h4>
                        <span className="text-xs text-gray-400 font-mono">ID: {scanResult.studentId}</span>
                      </div>
                      <div className="text-center bg-[#121619] border border-emerald-500/20 px-4 py-3 rounded-2xl">
                        <div className="text-3xl font-black text-emerald-400">{scanResult.score}</div>
                        <div className="text-[10px] text-gray-500">من أصل {scanResult.total}</div>
                      </div>
                    </div>

                    {/* Progress Bar Score */}
                    <div>
                      <div className="flex justify-between text-xs text-gray-400 mb-2 font-bold">
                        <span>النسبة المئوية:</span>
                        <span>{Math.round((scanResult.score / scanResult.total) * 100)}%</span>
                      </div>
                      <div className="w-full h-3 bg-black/40 rounded-full overflow-hidden border border-emerald-900/30">
                        <div 
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full" 
                          style={{ width: `${(scanResult.score / scanResult.total) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-4 border-t border-emerald-900/20 flex flex-col gap-3">
                      {recordingStatus === 'success' ? (
                        <div className="bg-emerald-900/30 border border-emerald-500/30 text-emerald-300 p-4 rounded-xl flex items-center justify-center gap-2 font-bold text-sm">
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                          تم رصد الدرجة بنجاح في كشف المادة (الشهر الأول)!
                        </div>
                      ) : (
                        <button
                          onClick={saveScoreToDatabase}
                          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-6 rounded-xl transition-all active:scale-95 shadow-lg flex items-center justify-center gap-2"
                        >
                          <Check className="w-5 h-5" />
                          رصد الدرجة وتدوينها تلقائياً
                        </button>
                      )}
                    </div>

                    {/* Quick Question Review */}
                    <div className="bg-[#0c100e] rounded-2xl p-4 border border-emerald-950">
                      <h4 className="text-xs text-emerald-400 font-black mb-3">تفاصيل نموذج الإجابة:</h4>
                      <div className="grid grid-cols-5 gap-2 max-h-48 overflow-y-auto p-1">
                        {Array.from({ length: questionCount }, (_, i) => {
                          const qNum = i + 1;
                          const correct = scanResult.answers[qNum] === answerKey[qNum];
                          return (
                            <div key={qNum} className={`p-2 rounded-lg border text-center flex flex-col gap-1 ${correct ? 'bg-emerald-950/20 border-emerald-900/50' : 'bg-red-950/20 border-red-900/50'}`}>
                              <span className="text-[10px] text-gray-500">س{qNum}</span>
                              <span className={`text-xs font-black ${correct ? 'text-emerald-400' : 'text-red-400'}`}>
                                {scanResult.answers[qNum]}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center py-12 text-center">
                    <AlertCircle className="w-12 h-12 text-emerald-900/60 mb-3" />
                    <p className="text-gray-400 text-sm font-bold">لا توجد بيانات نشطة حالياً</p>
                    <p className="text-gray-600 text-xs mt-1">اختر طالب واضغط "ابدأ التصحيح" للمحاكاة</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ANSWER KEY TAB */}
        {activeTab === 'key' && (
          <div className="max-w-4xl mx-auto bg-[#1a2320] border border-emerald-900/40 rounded-3xl p-6 shadow-lg">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-emerald-900/30">
              <h2 className="text-lg font-bold text-emerald-400">مفتاح إجابات الاختبار النموذجي</h2>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">عدد الأسئلة:</span>
                <select 
                  value={questionCount} 
                  onChange={e => setTotalQuestions(Number(e.target.value))}
                  className="bg-[#121619] border border-emerald-900/50 rounded-lg px-2 py-1 text-xs text-white"
                >
                  <option value={10}>10 أسئلة</option>
                  <option value={20}>20 سؤال</option>
                  <option value={30}>30 سؤال</option>
                </select>
              </div>
            </div>

            <p className="text-xs text-gray-400 mb-6">حدد الإجابات الصحيحة للنموذج الرئيسي أدناه، سيستخدمها المصحح الآلي للمقارنة التلقائية فوراً.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: questionCount }, (_, i) => {
                const qNum = i + 1;
                return (
                  <div key={qNum} className="flex items-center justify-between p-3 bg-[#121619] border border-emerald-950 rounded-xl hover:border-emerald-800/30 transition-colors">
                    <span className="text-sm font-black text-emerald-300">السؤال {qNum}:</span>
                    <div className="flex gap-2">
                      {['A', 'B', 'C', 'D'].map(opt => (
                        <button
                          key={opt}
                          onClick={() => handleKeyChange(qNum, opt)}
                          className={`w-9 h-9 rounded-xl font-black text-xs transition-all ${answerKey[qNum] === opt ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20' : 'bg-[#1a2320] text-gray-400 border border-emerald-900/50 hover:bg-[#202b27]'}`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* PRINT SHEETS TAB */}
        {activeTab === 'print' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-[#1a2320] border border-emerald-900/40 rounded-3xl p-6 shadow-lg print:hidden">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-emerald-400">طباعة نموذج بابل شيت (A4)</h2>
                <button 
                  onClick={() => window.print()}
                  data-print="true"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-6 rounded-xl flex items-center gap-2 shadow-md"
                >
                  <Printer className="w-5 h-5" />
                  اطبع الآن
                </button>
              </div>
              <p className="text-xs text-gray-400">يمكنك قص الورقة وتوزيعها على الطلاب للتصحيح السريع بالكاميرا.</p>
            </div>

            {/* Bubble Sheet Document for Printing */}
            <div className="bg-white text-black p-8 rounded-3xl shadow-xl max-w-[21cm] mx-auto print:p-0 print:shadow-none print:bg-white" style={{ minHeight: '29.7cm' }} dir="rtl">
              {/* Header */}
              <div className="border-4 border-black p-4 text-center mb-6">
                <div className="flex justify-between items-center mb-2">
                  <div className="text-right text-xs font-bold leading-relaxed">
                    الجمهورية اليمنية<br />
                    وزارة التربية والتعليم
                  </div>
                  <div className="text-center">
                     <h1 className="text-lg font-black tracking-wide">ورقة إجابة بابل شيت (OMR)</h1>
                     <span className="text-[10px] font-bold border border-black px-2 py-0.5 mt-1 inline-block">تطبيق ΣIGMA ACADEMY</span>
                  </div>
                  <div className="text-left text-xs font-bold leading-relaxed">
                    مدرسة: اليرموك<br />
                    العام الدراسي: 2025/2026
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2 border-t border-black pt-3 mt-2 text-xs font-bold">
                  <div className="text-right">اسم الطالب: ................................................</div>
                  <div className="text-center">الصف: ................................</div>
                  <div className="text-left">رقم الجلوس: [ _ _ _ _ _ ]</div>
                </div>
              </div>

              {/* Grid instructions */}
              <div className="border border-black p-3 text-xs mb-6 font-bold leading-relaxed">
                <h3 className="font-black text-center mb-1 text-sm border-b border-black pb-1">تعليمات هامة للطالب:</h3>
                1. استخدم القلم الأسود أو الأزرق الجاف فقط لتظليل الدوائر بشكل كامل.<br />
                2. تجنب التظليل الجزئي أو وضع علامات (✓) أو (X). التظليل الصحيح هو: <span className="inline-block w-4 h-4 bg-black rounded-full mx-1"></span>.<br />
                3. تجنب طي أو تمزيق ورقة الإجابة هذه نهائياً.
              </div>

              {/* Dynamic SVG Bubble Sheet */}
              <div className="border-t border-black/10 pt-4">
                 <BubbleSheetSVG questionCount={questionCount} />
              </div>

              {/* Bottom Copyright watermark for Ministry look */}
              <div className="mt-20 pt-8 border-t-2 border-dashed border-gray-300 text-center text-[8px] font-bold text-gray-400 uppercase tracking-widest flex justify-between items-center">
                <span>بواسطة نظام ΣIGMA ACADEMY للخدمات المدرسية الموحدة</span>
                <span>المبرمج: سهيل الحزبري - 715562996</span>
              </div>
            </div>
          </div>
        )}

        {/* ANALYTICS TAB */}
        {activeTab === 'analytics' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Correct Answers ratio */}
              <div className="bg-[#1a2320] border border-emerald-900/40 rounded-3xl p-6 shadow-lg">
                <h3 className="text-base font-bold text-emerald-400 mb-4">معدل الإجابات الصحيحة لكل سؤال</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analyticsData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1f2923" />
                      <XAxis dataKey="name" stroke="#4b5563" fontSize={10} />
                      <YAxis stroke="#4b5563" fontSize={10} />
                      <Tooltip contentStyle={{ backgroundColor: '#121619', borderColor: '#064e3b' }} />
                      <Bar dataKey="correct" fill="#10b981" radius={[4, 4, 0, 0]} name="صحيح %" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Toughest Questions */}
              <div className="bg-[#1a2320] border border-emerald-900/40 rounded-3xl p-6 shadow-lg">
                <h3 className="text-base font-bold text-emerald-400 mb-4">الأسئلة الأكثر صعوبة (معدل الخطأ مرتفع)</h3>
                <div className="space-y-4">
                  {[
                    { qNum: 7, errorRate: 42, topic: 'النسبة والوزن الذري' },
                    { qNum: 14, errorRate: 35, topic: 'المعادلات التفاضلية للسرعة' },
                    { qNum: 3, errorRate: 28, topic: 'مقارنة مستويات بلوم العليا' }
                  ].map(item => (
                    <div key={item.qNum} className="flex justify-between items-center p-3 bg-[#121619] border border-emerald-950 rounded-2xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-red-950/40 border border-red-900/30 flex items-center justify-center font-bold text-red-400">
                          س{item.qNum}
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-gray-200">{item.topic}</h4>
                          <span className="text-[10px] text-gray-500">تم اختيار نموذج بديل من معظم الطلاب</span>
                        </div>
                      </div>
                      <span className="text-xs font-black text-red-400">{item.errorRate}% خطأ</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
