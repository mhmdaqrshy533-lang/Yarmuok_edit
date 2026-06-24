import { ArrowRight, Save } from 'lucide-react';
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
          
          <div className="mt-8 flex justify-end">
            <button
              onClick={() => setView('home')}
              className="flex items-center gap-2 bg-slate-800 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-slate-700 hover:shadow-xl transition-all"
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
