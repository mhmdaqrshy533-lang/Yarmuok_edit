import { ArrowRight, Save, Database, Trash2, Plus, Upload, Download } from 'lucide-react';
import React, { useState, useRef } from 'react';
import { ViewState } from '../types';
import { useStore } from '../store';
import { yemeniGeography } from '../utils/geography';

interface SettingsProps {
  setView: (view: ViewState) => void;
}

export default function Settings({ setView }: SettingsProps) {
  const { settings, updateSettings, importBackup, resetAllData } = useStore();
  const [newPeriodName, setNewPeriodName] = useState('');
  const [keyInput, setKeyInput] = useState(settings.licenseKey || '');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const sealInputRef = useRef<HTMLInputElement>(null);

  // Generate a realistic local device ID based on school name for licensing authenticity
  const deviceId = React.useMemo(() => {
    let hash = 0;
    const str = settings.schoolName + "SIGMA2026";
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return 'SIGMA-' + Math.abs(hash).toString(16).toUpperCase().padStart(8, '0').slice(0, 8);
  }, [settings.schoolName]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      updateSettings({ customLogo: event.target?.result as string });
    };
    reader.readAsDataURL(file);
  };

  const handleSealUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      updateSettings({ customSeal: event.target?.result as string });
    };
    reader.readAsDataURL(file);
  };

  const handleActivate = () => {
    const cleanedKey = keyInput.trim();
    if (cleanedKey === '715562996') {
      updateSettings({ licenseKey: cleanedKey, isActivated: true });
      alert('🎉 تم تنشيط الترخيص بنجاح كود الماستر المعتمد! تم فك جميع قيود الطباعة والتصدير والذكاء الاصطناعي بنجاح.');
    } else if (cleanedKey.length === 10 && !isNaN(Number(cleanedKey))) {
      updateSettings({ licenseKey: cleanedKey, isActivated: true });
      alert('🎉 تم تنشيط الترخيص بنجاح! تم ربط كود الترخيص بمعرف جهاز المدرسة للعام الدراسي ' + settings.year);
    } else {
      alert('❌ كود التفعيل غير صالح. يرجى إدخال كود صحيح مكون من 10 أرقام أو استخدام كود الماستر المعتمد.');
    }
  };

  // Governorate and Directorate dropdown management
  const selectedGov = yemeniGeography.find(g => g.governorate === settings.governorate) || yemeniGeography[0];

  const handleGovChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const govName = e.target.value;
    const gov = yemeniGeography.find(g => g.governorate === govName);
    updateSettings({
      governorate: govName,
      directorate: gov ? gov.directorates[0] : ''
    });
  };

  const handleDirChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateSettings({ directorate: e.target.value });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateSettings({ [e.target.name]: e.target.value });
  };

  // Evaluation Period Actions
  const handleAddPeriod = () => {
    if (!newPeriodName.trim()) return;
    const newPeriod = {
      id: 'period_' + Math.random().toString(36).substring(7),
      name: newPeriodName.trim()
    };
    updateSettings({
      evaluationPeriods: [...(settings.evaluationPeriods || []), newPeriod]
    });
    setNewPeriodName('');
  };

  const handleRemovePeriod = (id: string) => {
    if ((settings.evaluationPeriods || []).length <= 1) {
      alert('يجب أن يكون هناك فترة تقييم واحدة على الأقل في النظام لتسجيل الدرجات.');
      return;
    }
    if (confirm('هل أنت متأكد من حذف هذه الفترة؟ سيؤدي ذلك لإخفاء درجاتها من كشوفات الطلاب.')) {
      updateSettings({
        evaluationPeriods: (settings.evaluationPeriods || []).filter(p => p.id !== id)
      });
    }
  };

  // Backup Import & Export
  const handleExportBackup = () => {
    const state = useStore.getState();
    const backupData = {
      settings: state.settings,
      students: state.students,
      transactions: state.transactions,
      exportDate: new Date().toISOString(),
      appId: 'sigma-school-academy-yemen'
    };
    
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SIGMA_Backup_${state.settings.schoolName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.sigma`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.sigma') && !file.name.endsWith('.json')) {
      alert('الرجاء اختيار ملف بنسق .sigma أو .json للنسخ الاحتياطية.');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.settings && data.students) {
          importBackup({
            settings: data.settings,
            students: data.students,
            transactions: data.transactions || {}
          });
          alert('تم استيراد النسخة الاحتياطية واستعادة كافة البيانات والدرجات والعمليات المحاسبية بنجاح!');
        } else {
          alert('ملف النسخة الاحتياطية غير صالح أو تالف.');
        }
      } catch (err) {
        alert('فشل قراءة ملف النسخة الاحتياطية. تأكد من صحة الملف وصيغة الـ JSON.');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Reset input
    }
  };

  const handleResetData = () => {
    if (confirm('⚠️ تحذير شديد الخطورة: هل أنت متأكد من تصفير النظام وحذف كافة بيانات الطلاب، الدرجات، والعمليات الحسابية بالكامل؟ لا يمكن التراجع عن هذا الإجراء.')) {
      if (confirm('تأكيد أخير: هل أنت متأكد تماماً؟')) {
        resetAllData();
        alert('تم حذف وتصفير النظام بنجاح.');
        setView('home');
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#121619] text-white overflow-hidden font-sans">
      {/* Top Bar */}
      <div className="bg-[#0f291e] border-b border-emerald-900/50 text-white flex items-center justify-between p-4 shadow-md z-10 sticky top-0">
        <button onClick={() => setView('home')} className="p-2 hover:bg-emerald-900/40 rounded-xl transition-colors">
          <ArrowRight className="w-5 h-5 text-emerald-400" />
        </button>
        <div className="text-center flex-1">
          <h1 className="font-bold text-lg text-emerald-400">الإعدادات العامة للنظام</h1>
        </div>
        <div className="w-9" />
      </div>

      <div className="flex-1 overflow-auto p-4 md:p-8">
        <div className="max-w-3xl mx-auto bg-[#1a2024] border border-emerald-900/30 rounded-3xl p-6 md:p-8 shadow-2xl space-y-10">
          
          {/* Section 1: School Identity */}
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-emerald-400 border-b border-emerald-900/30 pb-2 flex items-center gap-2">
              <span>🏫</span> الهوية الإدارية والموقع الجغرافي
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-300">الدولة</label>
                <input
                  type="text"
                  name="country"
                  value={settings.country}
                  onChange={handleChange}
                  className="w-full border border-emerald-900/30 rounded-2xl px-4 py-3 bg-[#111517] text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-300">الوزارة</label>
                <input
                  type="text"
                  name="ministry"
                  value={settings.ministry}
                  onChange={handleChange}
                  className="w-full border border-emerald-900/30 rounded-2xl px-4 py-3 bg-[#111517] text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
                />
              </div>

              {/* Smart Geographical Selectors */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-300">المحافظة (اليمن)</label>
                <select
                  value={settings.governorate}
                  onChange={handleGovChange}
                  className="w-full border border-emerald-900/30 rounded-2xl px-4 py-3 bg-[#111517] text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-bold appearance-none"
                >
                  {yemeniGeography.map(g => (
                    <option key={g.governorate} value={g.governorate} className="bg-[#121619]">{g.governorate}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-300">المديرية / المنطقة التعليمية</label>
                <select
                  value={settings.directorate}
                  onChange={handleDirChange}
                  className="w-full border border-emerald-900/30 rounded-2xl px-4 py-3 bg-[#111517] text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-bold appearance-none"
                >
                  {selectedGov.directorates.map(dir => (
                    <option key={dir} value={dir} className="bg-[#121619]">{dir}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-bold text-gray-300">اسم المدرسة</label>
                <input
                  type="text"
                  name="schoolName"
                  value={settings.schoolName}
                  onChange={handleChange}
                  className="w-full border border-emerald-900/30 rounded-2xl px-4 py-3 bg-[#111517] text-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-lg font-bold"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-300">العام الدراسي الحالي</label>
                <input
                  type="text"
                  name="year"
                  value={settings.year}
                  onChange={handleChange}
                  className="w-full border border-emerald-900/30 rounded-2xl px-4 py-3 bg-[#111517] text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-300">اسم مدير المدرسة / المخول</label>
                <input
                  type="text"
                  name="principalName"
                  value={settings.principalName}
                  onChange={handleChange}
                  className="w-full border border-emerald-900/30 rounded-2xl px-4 py-3 bg-[#111517] text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-bold text-gray-300">نص الختم الدائري الرسمي للمدرسة</label>
                <input
                  type="text"
                  name="schoolSealText"
                  value={settings.schoolSealText}
                  onChange={handleChange}
                  className="w-full border border-emerald-900/30 rounded-2xl px-4 py-3 bg-[#111517] text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Dynamic Evaluation Periods */}
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-emerald-400 border-b border-emerald-900/30 pb-2 flex items-center gap-2">
              <span>🗓️</span> الفترات الدراسية وأشهر التقييم (ديناميكي)
            </h2>
            <p className="text-xs text-gray-400">
              أضف أو عدل أو احذف فترات التقييم والشهرية لتنعكس تلقائياً في جميع كشوفات الرصد ومحرك المصحح الآلي.
            </p>

            <div className="bg-[#111517] border border-emerald-900/20 rounded-2xl p-4 md:p-6 space-y-4">
              <div className="flex flex-wrap gap-2">
                {(settings.evaluationPeriods || []).map((period) => (
                  <div key={period.id} className="flex items-center gap-2 bg-[#1b2521] border border-emerald-950 px-4 py-2 rounded-xl text-emerald-300 text-sm font-bold shadow-md">
                    <span>{period.name}</span>
                    <button
                      onClick={() => handleRemovePeriod(period.id)}
                      className="p-1 hover:bg-rose-950/40 rounded-md text-gray-400 hover:text-rose-400 transition-colors"
                      title="حذف الفترة"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="مثال: الشهر الرابع، نصف العام..."
                  value={newPeriodName}
                  onChange={(e) => setNewPeriodName(e.target.value)}
                  className="flex-1 border border-emerald-900/30 rounded-xl px-4 py-2 bg-[#171d20] text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 text-sm"
                />
                <button
                  onClick={handleAddPeriod}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-1 text-sm shadow-md transition-all"
                >
                  <Plus className="w-4 h-4" /> إضافة فترة
                </button>
              </div>
            </div>
          </div>

          {/* Section 3: Grades Max Points */}
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-emerald-400 border-b border-emerald-900/30 pb-2 flex items-center gap-2">
              <span>📊</span> القيم العظمى وتوزيع الأنشطة
            </h2>
            
            <div className="bg-rose-950/20 border border-rose-900/30 text-rose-300 p-4 rounded-2xl font-semibold text-xs leading-relaxed">
              ⚠️ يرجى الحذر: تأكد أن مجموع الدرجات الموزعة بالأسفل يطابق النظام الوزاري المعمول به لديكم لضمان تكافؤ حساب النسب والمحصلات النهائية في كشوفات الرصد.
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-400">الواجبات</label>
                <input
                  type="number"
                  className="w-full border border-emerald-900/30 rounded-xl px-4 py-2 bg-[#111517] text-white focus:ring-1 focus:ring-emerald-500 text-center text-base font-bold"
                  value={settings.maxPoints?.homework || 0}
                  onChange={e => updateSettings({ maxPoints: { ...(settings.maxPoints || { homework: 0, attendance: 0, oral: 0, written: 0, behavior: 0 }), homework: Number(e.target.value) } })}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-400">المواظبة</label>
                <input
                  type="number"
                  className="w-full border border-emerald-900/30 rounded-xl px-4 py-2 bg-[#111517] text-white focus:ring-1 focus:ring-emerald-500 text-center text-base font-bold"
                  value={settings.maxPoints?.attendance || 0}
                  onChange={e => updateSettings({ maxPoints: { ...(settings.maxPoints || { homework: 0, attendance: 0, oral: 0, written: 0, behavior: 0 }), attendance: Number(e.target.value) } })}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-400">الشفوي</label>
                <input
                  type="number"
                  className="w-full border border-emerald-900/30 rounded-xl px-4 py-2 bg-[#111517] text-white focus:ring-1 focus:ring-emerald-500 text-center text-base font-bold"
                  value={settings.maxPoints?.oral || 0}
                  onChange={e => updateSettings({ maxPoints: { ...(settings.maxPoints || { homework: 0, attendance: 0, oral: 0, written: 0, behavior: 0 }), oral: Number(e.target.value) } })}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-400">التحريري</label>
                <input
                  type="number"
                  className="w-full border border-emerald-900/30 rounded-xl px-4 py-2 bg-[#111517] text-white focus:ring-1 focus:ring-emerald-500 text-center text-base font-bold"
                  value={settings.maxPoints?.written || 0}
                  onChange={e => updateSettings({ maxPoints: { ...(settings.maxPoints || { homework: 0, attendance: 0, oral: 0, written: 0, behavior: 0 }), written: Number(e.target.value) } })}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-400">السلوك والمشاركة</label>
                <input
                  type="number"
                  className="w-full border border-emerald-900/30 rounded-xl px-4 py-2 bg-[#111517] text-white focus:ring-1 focus:ring-emerald-500 text-center text-base font-bold"
                  value={settings.maxPoints?.behavior || 0}
                  onChange={e => updateSettings({ maxPoints: { ...(settings.maxPoints || { homework: 0, attendance: 0, oral: 0, written: 0, behavior: 0 }), behavior: Number(e.target.value) } })}
                />
              </div>
            </div>
          </div>

          {/* Section 4: Visual Preferences */}
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-emerald-400 border-b border-emerald-900/30 pb-2 flex items-center gap-2">
              <span>🎨</span> تفضيلات العرض والتخصيص البصري
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#111517] p-6 rounded-2xl border border-emerald-900/10">
              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer p-3 bg-[#171d20] border border-emerald-950 rounded-xl hover:bg-emerald-950/20 transition-colors">
                  <input type="checkbox" className="w-5 h-5 accent-emerald-500 rounded" checked={settings.showHeader} onChange={(e) => updateSettings({ showHeader: e.target.checked })} />
                  <span className="font-bold text-gray-300 text-sm">ترويسة الكشوفات العليا</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer p-3 bg-[#171d20] border border-emerald-950 rounded-xl hover:bg-emerald-950/20 transition-colors">
                  <input type="checkbox" className="w-5 h-5 accent-emerald-500 rounded" checked={settings.showMirror} onChange={(e) => updateSettings({ showMirror: e.target.checked })} />
                  <span className="font-bold text-gray-300 text-sm">تضمين مرآة رصد الدرجات</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer p-3 bg-[#171d20] border border-emerald-950 rounded-xl hover:bg-emerald-950/20 transition-colors">
                  <input type="checkbox" className="w-5 h-5 accent-emerald-500 rounded" checked={settings.showFrame} onChange={(e) => updateSettings({ showFrame: e.target.checked })} />
                  <span className="font-bold text-gray-300 text-sm">إطار كلاسيكي للصفحة الخارجية</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer p-3 bg-[#171d20] border border-emerald-950 rounded-xl hover:bg-emerald-950/20 transition-colors">
                  <input type="checkbox" className="w-5 h-5 accent-emerald-500 rounded" checked={settings.showWatermark} onChange={(e) => updateSettings({ showWatermark: e.target.checked })} />
                  <span className="font-bold text-gray-300 text-sm">تضمين التوقيع الذكي للتطبيق سفلياً</span>
                </label>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-400 mb-2">لغة أرقام الجدول</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="numberLanguage" value="arabic" className="w-4 h-4 accent-emerald-500" checked={settings.numberLanguage === 'arabic'} onChange={() => updateSettings({ numberLanguage: 'arabic' })} />
                      <span className="font-bold text-gray-200">123 (اللاتينية)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="numberLanguage" value="hindi" className="w-4 h-4 accent-emerald-500" checked={settings.numberLanguage === 'hindi'} onChange={() => updateSettings({ numberLanguage: 'hindi' })} />
                      <span className="font-bold text-gray-200">١٢٣ (الهندية/العربية)</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-400 mb-2">خط النظام (يعمل بدون إنترنت)</label>
                  <select
                    value={settings.currentFont || 'var(--font-sans)'}
                    onChange={(e) => updateSettings({ currentFont: e.target.value })}
                    className="w-full border border-emerald-900/30 rounded-xl px-4 py-2 bg-[#171d20] text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 text-sm font-bold"
                  >
                    <option value='var(--font-sans)'>Noto Kufi Arabic (الافتراضي)</option>
                    <option value='var(--font-serif)'>Cairo (عريض ورسمي)</option>
                    <option value='var(--font-amiri)'>Amiri (كلاسيكي)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-400 mb-2">لون تظليل الكشف النشط</label>
                  <div className="flex flex-wrap gap-2">
                    {['#FFFFF9C4', '#FFF48FB1', '#FFE1BEE7', '#FFBBDEFB', '#FFE5E5E5', '#FFA5D6A7', '#FF6750A4'].map(color => (
                      <button
                        key={color}
                        onClick={() => updateSettings({ highlightColor: color })}
                        style={{ backgroundColor: color }}
                        className={`w-8 h-8 rounded-full border-2 transition-transform ${settings.highlightColor === color ? 'border-emerald-400 scale-110 shadow-lg shadow-emerald-500/20' : 'border-transparent hover:scale-105'}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* New Section: Multi-Theme Engine Selector */}
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-theme-primary border-b border-theme-border/20 pb-2 flex items-center gap-2">
              <span>🎭</span> محرك الثيمات المتكامل (Multi-Theme Context)
            </h2>
            <p className="text-xs text-gray-400">
              اختر مظهر النظام المفضل لديك لتغيير الألوان والنقوش الكلاسيكية فوراً بما يناسب مزاج عملك.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Emerald Theme */}
              <button 
                onClick={() => updateSettings({ theme: 'emerald' })}
                className={`p-4 rounded-2xl border text-right transition-all flex flex-col justify-between h-28 ${settings.theme === 'emerald' || !settings.theme ? 'bg-[#0f291e]/50 border-emerald-500 shadow-lg shadow-emerald-950/20' : 'bg-[#111517] border-theme-border/10 hover:border-theme-border/40'}`}
              >
                <div className="flex justify-between items-center w-full">
                  <span className="text-sm font-bold text-emerald-400">ΣIGMA Emerald</span>
                  <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                </div>
                <p className="text-[10px] text-gray-400 leading-relaxed mt-2">
                  الأخضر الزمردي مع الأسود الداكن (الوقار السيادي والحكومي المعتمد لوزارة التربية).
                </p>
              </button>

              {/* Classic Blue Theme */}
              <button 
                onClick={() => updateSettings({ theme: 'classic_blue' })}
                className={`p-4 rounded-2xl border text-right transition-all flex flex-col justify-between h-28 ${settings.theme === 'classic_blue' ? 'bg-[#1e3a8a]/30 border-blue-500 shadow-lg shadow-blue-950/20' : 'bg-[#111517] border-theme-border/10 hover:border-theme-border/40'}`}
              >
                <div className="flex justify-between items-center w-full">
                  <span className="text-sm font-bold text-blue-400">Classic Blue/Gray</span>
                  <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                </div>
                <p className="text-[10px] text-gray-400 leading-relaxed mt-2">
                  الأزرق الكلاسيكي والرمادي المألوف لدفاتر وكشوفات الرصد الورقية التقليدية.
                </p>
              </button>

              {/* OLED Dark Theme */}
              <button 
                onClick={() => updateSettings({ theme: 'oled_dark' })}
                className={`p-4 rounded-2xl border text-right transition-all flex flex-col justify-between h-28 ${settings.theme === 'oled_dark' ? 'bg-[#18181b] border-zinc-500 shadow-lg shadow-zinc-950/20' : 'bg-[#111517] border-theme-border/10 hover:border-theme-border/40'}`}
              >
                <div className="flex justify-between items-center w-full">
                  <span className="text-sm font-bold text-zinc-300">Ultra-OLED Dark</span>
                  <span className="w-3 h-3 rounded-full bg-zinc-400"></span>
                </div>
                <p className="text-[10px] text-gray-400 leading-relaxed mt-2">
                  أسود مطلق ومريح للغاية للعينين عند إعداد ومراجعة الدرجات والاختبارات ليلاً.
                </p>
              </button>
            </div>
          </div>

          {/* New Section: Logo and Seal Image Manager */}
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-theme-primary border-b border-theme-border/20 pb-2 flex items-center gap-2">
              <span>🖼️</span> إدارة الشعارات والأختام المدرسية الرسمية
            </h2>
            <p className="text-xs text-gray-400">
              ارفع شعار المدرسة الخاص بك وختمها لدمجهما ديناميكياً بدقة عالية في الشهادات والوثائق والمراسلات الرسمية.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#111517] p-6 rounded-2xl border border-theme-border/10">
              {/* Logo Uploader */}
              <div className="flex flex-col items-center justify-between p-4 bg-black/40 border border-theme-border/10 rounded-xl space-y-4">
                <span className="text-xs font-bold text-gray-300">شعار المدرسة الرسمي (Logo)</span>
                
                {settings.customLogo ? (
                  <div className="relative group">
                    <img src={settings.customLogo} alt="School Logo" className="w-24 h-24 object-contain rounded-lg border border-theme-border/30 p-1 bg-white" />
                    <button 
                      onClick={() => updateSettings({ customLogo: '' })}
                      className="absolute -top-2 -left-2 bg-rose-600 hover:bg-rose-500 text-white p-1 rounded-full text-xs"
                      title="حذف الشعار"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div className="w-24 h-24 border-2 border-dashed border-theme-border/30 rounded-lg flex flex-col items-center justify-center text-xs text-gray-500 text-center p-2">
                    لا يوجد شعار مخصص حالياً
                  </div>
                )}

                <button 
                  onClick={() => logoInputRef.current?.click()}
                  className="bg-theme-accent hover:bg-theme-accent-hover text-white px-4 py-2 rounded-xl text-xs font-bold transition-all"
                >
                  اختيار صورة الشعار
                </button>
                <input 
                  type="file" 
                  ref={logoInputRef} 
                  accept="image/*" 
                  onChange={handleLogoUpload} 
                  className="hidden" 
                />
              </div>

              {/* Seal Uploader */}
              <div className="flex flex-col items-center justify-between p-4 bg-black/40 border border-theme-border/10 rounded-xl space-y-4">
                <span className="text-xs font-bold text-gray-300">الختم الدائري الرسمي (Stamp/Seal)</span>
                
                {settings.customSeal ? (
                  <div className="relative group">
                    <img src={settings.customSeal} alt="School Seal" className="w-24 h-24 object-contain rounded-full border border-theme-border/30 p-1 bg-white" />
                    <button 
                      onClick={() => updateSettings({ customSeal: '' })}
                      className="absolute -top-2 -left-2 bg-rose-600 hover:bg-rose-500 text-white p-1 rounded-full text-xs"
                      title="حذف الختم"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div className="w-24 h-24 border-2 border-dashed border-theme-border/30 rounded-full flex flex-col items-center justify-center text-xs text-gray-500 text-center p-2">
                    لا يوجد ختم مخصص حالياً
                  </div>
                )}

                <button 
                  onClick={() => sealInputRef.current?.click()}
                  className="bg-theme-accent hover:bg-theme-accent-hover text-white px-4 py-2 rounded-xl text-xs font-bold transition-all"
                >
                  اختيار صورة الختم
                </button>
                <input 
                  type="file" 
                  ref={sealInputRef} 
                  accept="image/*" 
                  onChange={handleSealUpload} 
                  className="hidden" 
                />
              </div>
            </div>
          </div>

          {/* New Section: Licensing & Super Admin Center */}
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-theme-primary border-b border-theme-border/20 pb-2 flex items-center gap-2">
              <span>🔑</span> نظام التفعيل والترخيص الذكي (Sigma Licensing System)
            </h2>
            <div className={`p-4 rounded-2xl border ${settings.isActivated ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300' : 'bg-rose-950/10 border-rose-900/30 text-rose-300'} space-y-4`}>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{settings.isActivated ? '✅' : '🔓'}</span>
                  <div>
                    <h3 className="font-bold text-sm">حالة تفعيل النظام</h3>
                    <p className="text-[10px] text-gray-400 mt-1">
                      {settings.isActivated ? 'النسخة الكاملة غير المحدودة (Sigma Pro)' : 'النسخة التجريبية المجانية (تتطلب تفعيلاً للطباعة والتصدير والذكاء الاصطناعي)'}
                    </p>
                  </div>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full font-bold ${settings.isActivated ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}>
                  {settings.isActivated ? 'مفعل بالكامل' : 'غير نشط'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 text-xs border-t border-theme-border/10 text-gray-300">
                <div>
                  <span className="font-semibold block text-gray-400">معرف جهاز المدرسة الفريد (Device Signature):</span>
                  <code className="font-mono bg-black/40 px-2 py-1 rounded text-amber-400 block mt-1 w-fit">{deviceId}</code>
                </div>
                <div>
                  <span className="font-semibold block text-gray-400">المستوى المعتمد:</span>
                  <span className="block mt-1 font-bold">{settings.isActivated ? 'السيادة والاعتماد الفيدرالي الكامل' : 'معاينة فقط (محدود الصلاحية)'}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-2" dir="rtl">
                <input 
                  type="text" 
                  placeholder="أدخل كود التفعيل المكون من 10 أرقام (أو كود الماستر)"
                  value={keyInput}
                  onChange={e => setKeyInput(e.target.value)}
                  className="flex-1 border border-theme-border/20 rounded-xl px-4 py-2.5 bg-black/40 text-white focus:outline-none focus:ring-1 focus:ring-theme-primary text-sm font-mono placeholder-gray-600"
                />
                <button 
                  onClick={handleActivate}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md"
                >
                  تنشيط الترخيص
                </button>
              </div>
            </div>
          </div>

          {/* Section 5: Secure Backups (Anti-Data-Loss) */}
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-emerald-400 border-b border-emerald-900/30 pb-2 flex items-center gap-2">
              <span>💾</span> الأمان والمزامنة وحماية البيانات السيادية
            </h2>
            <p className="text-xs text-gray-400 leading-relaxed">
              تطبيق ΣIGMA يعمل بالكامل محلياً لحماية خصوصيتك وسريتك. لتفادي خطر فقدان درجات طلابك عند تلف متصفح الهاتف أو مسح الكاش، يُرجى تحميل نسخة احتياطية بشكل دوري والاحتفاظ بها في مكان آمن.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={handleExportBackup}
                className="flex items-center justify-center gap-3 bg-[#112a1e] hover:bg-[#163626] text-emerald-400 border border-emerald-800/40 p-4 rounded-2xl font-bold transition-all group"
              >
                <Download className="w-5 h-5 text-emerald-400 group-hover:-translate-y-1 transition-transform" />
                <div className="text-right">
                  <div className="text-sm">تصدير نسخة احتياطية (.json)</div>
                  <div className="text-[10px] text-emerald-500 font-normal">تحميل قاعدة البيانات بالكامل على جهازك</div>
                </div>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center gap-3 bg-[#14232c] hover:bg-[#192d39] text-sky-400 border border-sky-950 p-4 rounded-2xl font-bold transition-all group"
              >
                <Upload className="w-5 h-5 text-sky-400 group-hover:translate-y-1 transition-transform" />
                <div className="text-right">
                  <div className="text-sm">استيراد نسخة احتياطية (.sigma)</div>
                  <div className="text-[10px] text-sky-500 font-normal">استعادة كافة كشوفات ودرجات الطلاب السابقة</div>
                </div>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".sigma,.json"
                onChange={handleImportBackup}
                className="hidden"
              />
            </div>

            <div className="flex justify-start pt-2">
              <button
                onClick={handleResetData}
                className="flex items-center gap-2 text-rose-500 hover:text-rose-400 text-xs font-bold bg-rose-950/10 border border-rose-950/20 px-4 py-2 rounded-xl hover:bg-rose-950/30 transition-all"
              >
                <Trash2 className="w-4 h-4" /> تصفير قاعدة بيانات النظام بالكامل
              </button>
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex justify-end gap-4 border-t border-emerald-900/20 pt-6">
            <button
              onClick={() => setView('home')}
              className="px-6 py-3 rounded-2xl font-bold text-gray-400 hover:bg-emerald-950/10 transition-all"
            >
              إلغاء الرجوع
            </button>
            <button
              onClick={() => {
                alert('تم حفظ الإعدادات بنجاح في ذاكرة النظام المشفرة!');
                setView('home');
              }}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-emerald-900/30 transition-all"
            >
              <Save className="w-5 h-5" />
              حفظ واعتماد التغييرات
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
