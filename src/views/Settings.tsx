import { ArrowRight, Save } from 'lucide-react';
import React from 'react';
import { ViewState } from '../types';
import { useStore } from '../store';

interface SettingsProps {
  setView: (view: ViewState) => void;
}

export default function Settings({ setView }: SettingsProps) {
  const { settings, updateSettings } = useStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateSettings({ [e.target.name]: e.target.value });
  };

  return (
    <div className="flex flex-col h-full bg-slate-50/50">
      {/* Top Bar */}
      <div className="bg-slate-900/90 backdrop-blur-md text-white flex items-center justify-between p-4 shadow-md z-10 sticky top-0">
        <button onClick={() => setView('home')} className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <ArrowRight className="w-5 h-5 text-white" />
        </button>
        <div className="text-center flex-1">
          <h1 className="font-bold text-lg">إعدادات النظام</h1>
        </div>
        <div className="w-9" /> {/* Spacer */}
      </div>

      <div className="flex-1 overflow-auto p-4 md:p-8">
        <div className="max-w-2xl mx-auto bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6 md:p-8">
          <h2 className="text-xl font-bold text-slate-800 mb-6 border-b border-slate-200 pb-4">بيانات المدرسة والمنطقة</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">الدولة</label>
              <input
                type="text"
                name="country"
                value={settings.country}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white/50 focus:outline-none focus:ring-2 focus:ring-slate-500 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">الوزارة</label>
              <input
                type="text"
                name="ministry"
                value={settings.ministry}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white/50 focus:outline-none focus:ring-2 focus:ring-slate-500 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">المحافظة</label>
              <input
                type="text"
                name="governorate"
                value={settings.governorate}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white/50 focus:outline-none focus:ring-2 focus:ring-slate-500 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">المديرية / المنطقة التعليمية</label>
              <input
                type="text"
                name="directorate"
                value={settings.directorate}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white/50 focus:outline-none focus:ring-2 focus:ring-slate-500 transition-all"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700">اسم المدرسة</label>
              <input
                type="text"
                name="schoolName"
                value={settings.schoolName}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white/50 focus:outline-none focus:ring-2 focus:ring-slate-500 transition-all text-lg font-bold text-slate-900"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">العام الدراسي</label>
              <input
                type="text"
                name="year"
                value={settings.year}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white/50 focus:outline-none focus:ring-2 focus:ring-slate-500 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">اسم مدير المدرسة</label>
              <input
                type="text"
                name="principalName"
                value={settings.principalName}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white/50 focus:outline-none focus:ring-2 focus:ring-slate-500 transition-all"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700">نص الختم الرسمي</label>
              <input
                type="text"
                name="schoolSealText"
                value={settings.schoolSealText}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white/50 focus:outline-none focus:ring-2 focus:ring-slate-500 transition-all"
              />
            </div>
          </div>
          
          {/* Customization & Appearance Settings */}
          <h2 className="text-xl font-bold text-slate-800 mt-10 mb-6 border-b border-slate-200 pb-4">إعدادات العرض الأساسية (الكشوفات)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-200">
             
             {/* Toggles */}
             <div className="space-y-4">
               <label className="flex items-center gap-3 cursor-pointer p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                  <input type="checkbox" className="w-5 h-5 accent-emerald-500 rounded border-slate-300" checked={settings.showHeader} onChange={(e) => updateSettings({ showHeader: e.target.checked })} />
                  <span className="font-bold text-slate-700">ترويسة أعلى الصفحة</span>
               </label>
               <label className="flex items-center gap-3 cursor-pointer p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                  <input type="checkbox" className="w-5 h-5 accent-emerald-500 rounded border-slate-300" checked={settings.showMirror} onChange={(e) => updateSettings({ showMirror: e.target.checked })} />
                  <span className="font-bold text-slate-700">مرايا الدرجات</span>
               </label>
               <label className="flex items-center gap-3 cursor-pointer p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                  <input type="checkbox" className="w-5 h-5 accent-emerald-500 rounded border-slate-300" checked={settings.showFrame} onChange={(e) => updateSettings({ showFrame: e.target.checked })} />
                  <span className="font-bold text-slate-700">تسطير إطار للصفحة</span>
               </label>
               <label className="flex items-center gap-3 cursor-pointer p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                  <input type="checkbox" className="w-5 h-5 accent-emerald-500 rounded border-slate-300" checked={settings.showWatermark} onChange={(e) => updateSettings({ showWatermark: e.target.checked })} />
                  <span className="font-bold text-slate-700">عبارة (بواسطة تطبيق ΣIGMA ACADEMY)</span>
               </label>
             </div>

             <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">لغة الأرقام</label>
                  <div className="flex gap-4">
                     <label className="flex items-center gap-2">
                       <input type="radio" name="numberLanguage" value="arabic" className="w-4 h-4 accent-emerald-500" checked={settings.numberLanguage === 'arabic'} onChange={(e) => updateSettings({ numberLanguage: e.target.value as any })} />
                       <span className="font-bold">123 (إنجليزية)</span>
                     </label>
                     <label className="flex items-center gap-2">
                       <input type="radio" name="numberLanguage" value="hindi" className="w-4 h-4 accent-emerald-500" checked={settings.numberLanguage === 'hindi'} onChange={(e) => updateSettings({ numberLanguage: e.target.value as any })} />
                       <span className="font-bold">١٢٣ (عربية)</span>
                     </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">لون التظليل (للكشوفات)</label>
                  <div className="flex flex-wrap gap-2">
                     {['#FFFFF9C4', '#FFF48FB1', '#FFE1BEE7', '#FFBBDEFB', '#FFE5E5E5', '#FFA5D6A7', '#FF6750A4'].map(color => (
                       <button
                         key={color}
                         onClick={() => updateSettings({ highlightColor: color })}
                         style={{ backgroundColor: color }}
                         className={`w-10 h-10 rounded-full border-2 transition-transform ${settings.highlightColor === color ? 'border-emerald-500 scale-110 shadow-lg' : 'border-transparent hover:scale-105'}`}
                       />
                     ))}
                  </div>
                </div>
             </div>
          </div>

          {/* Grades Settings */}
          <h2 className="text-xl font-bold text-slate-800 mt-10 mb-6 border-b border-slate-200 pb-4">إعداد القيم العظمى للدرجات (الأنشطة الشهرية)</h2>
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 font-bold text-sm border border-red-200">
             ملاحظة : يجب ان يكون مجموع الدرجات يساوي 100
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
             <div className="space-y-2">
               <label className="block text-sm font-bold text-slate-700">الواجبات</label>
               <input type="number" className="w-full border border-slate-300 rounded-xl px-4 py-2 bg-white focus:ring-2 focus:ring-emerald-500" value={settings.maxPoints?.homework || 0} onChange={e => updateSettings({ maxPoints: { ...(settings.maxPoints || { homework: 0, attendance: 0, oral: 0, written: 0, behavior: 0 }), homework: Number(e.target.value) } })} />
             </div>
             <div className="space-y-2">
               <label className="block text-sm font-bold text-slate-700">المواظبة</label>
               <input type="number" className="w-full border border-slate-300 rounded-xl px-4 py-2 bg-white focus:ring-2 focus:ring-emerald-500" value={settings.maxPoints?.attendance || 0} onChange={e => updateSettings({ maxPoints: { ...(settings.maxPoints || { homework: 0, attendance: 0, oral: 0, written: 0, behavior: 0 }), attendance: Number(e.target.value) } })} />
             </div>
             <div className="space-y-2">
               <label className="block text-sm font-bold text-slate-700">الشفوي</label>
               <input type="number" className="w-full border border-slate-300 rounded-xl px-4 py-2 bg-white focus:ring-2 focus:ring-emerald-500" value={settings.maxPoints?.oral || 0} onChange={e => updateSettings({ maxPoints: { ...(settings.maxPoints || { homework: 0, attendance: 0, oral: 0, written: 0, behavior: 0 }), oral: Number(e.target.value) } })} />
             </div>
             <div className="space-y-2">
               <label className="block text-sm font-bold text-slate-700">التحريري</label>
               <input type="number" className="w-full border border-slate-300 rounded-xl px-4 py-2 bg-white focus:ring-2 focus:ring-emerald-500" value={settings.maxPoints?.written || 0} onChange={e => updateSettings({ maxPoints: { ...(settings.maxPoints || { homework: 0, attendance: 0, oral: 0, written: 0, behavior: 0 }), written: Number(e.target.value) } })} />
             </div>
             <div className="space-y-2">
               <label className="block text-sm font-bold text-slate-700">السلوك</label>
               <input type="number" className="w-full border border-slate-300 rounded-xl px-4 py-2 bg-white focus:ring-2 focus:ring-emerald-500" value={settings.maxPoints?.behavior || 0} onChange={e => updateSettings({ maxPoints: { ...(settings.maxPoints || { homework: 0, attendance: 0, oral: 0, written: 0, behavior: 0 }), behavior: Number(e.target.value) } })} />
             </div>
          </div>
          
          <div className="mt-10 flex justify-end gap-4 border-t border-slate-200 pt-6">
            <button
              onClick={() => setView('home')}
              className="px-6 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-all"
            >
              إلغاء
            </button>
            <button
              onClick={() => setView('home')}
              className="flex items-center gap-2 bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-emerald-500 hover:shadow-xl transition-all"
            >
              <Save className="w-5 h-5" />
              حفظ التغييرات
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
