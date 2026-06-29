import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { Shield, Key, AlertTriangle, Lock } from 'lucide-react';

export function LicenseShield({ children }: { children: React.ReactNode }) {
  const { settings, updateSettings } = useStore();
  const [showModal, setShowModal] = useState(false);
  const [licenseInput, setLicenseInput] = useState('');
  const [deviceId, setDeviceId] = useState('');

  useEffect(() => {
    // Generate a pseudo device ID based on user agent and screen
    const rawId = `${navigator.userAgent}-${window.screen.width}x${window.screen.height}`;
    let hash = 0;
    for (let i = 0; i < rawId.length; i++) {
      const char = rawId.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    const deviceHash = Math.abs(hash).toString(16).toUpperCase();
    setDeviceId(`SIGMA-${deviceHash.substring(0, 8)}`);
  }, []);

  const handlePrintIntercept = (e: MouseEvent) => {
    // Intercept clicks on print buttons if not activated
    const target = e.target as HTMLElement;
    const printBtn = target.closest('button[data-print="true"]');
    if (printBtn && !settings.isActivated) {
      e.stopPropagation();
      e.preventDefault();
      setShowModal(true);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handlePrintIntercept, true);
    return () => {
      document.removeEventListener('click', handlePrintIntercept, true);
    };
  }, [settings.isActivated]);

  const activate = () => {
    // Super Admin Activation Logic (demo: accepts any code starting with "SIGMA")
    if (licenseInput.startsWith('SIGMA-')) {
      updateSettings({ isActivated: true, licenseKey: licenseInput });
      setShowModal(false);
      alert('تم تفعيل النظام السيادي بنجاح!');
    } else {
      alert('كود التفعيل غير صحيح!');
    }
  };

  return (
    <>
      {children}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4" dir="rtl">
          <div className="bg-[#121619] border border-emerald-500/30 w-full max-w-md p-6 rounded-2xl shadow-2xl">
            <div className="flex items-center justify-center mb-6 text-emerald-500">
              <Shield className="w-16 h-16" />
            </div>
            <h2 className="text-2xl font-black text-center text-emerald-400 mb-2">النظام محمي - الترخيص مطلوب</h2>
            <p className="text-sm text-gray-400 text-center mb-6 leading-relaxed">
              هذه الميزة (الطباعة وتوليد الشهادات) تتطلب تفعيل النسخة المتميزة لحماية حقوق الملكية الفكرية.
            </p>
            
            <div className="bg-black/50 border border-gray-800 p-4 rounded-xl mb-6">
              <div className="text-xs text-gray-500 mb-1">معرف جهازك (Device ID):</div>
              <div className="font-mono text-lg text-emerald-300 font-bold tracking-widest">{deviceId}</div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-400 mb-2">أدخل كود التفعيل المعتمد:</label>
              <div className="relative">
                <Key className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input 
                  type="text" 
                  value={licenseInput}
                  onChange={e => setLicenseInput(e.target.value)}
                  placeholder="SIGMA-XXXX-XXXX-XXXX"
                  className="w-full bg-[#1a2320] border border-emerald-900/50 rounded-xl py-3 pr-10 pl-4 text-white text-left font-mono tracking-widest focus:outline-none focus:border-emerald-500 transition-colors"
                  dir="ltr"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setShowModal(false)} className="flex-1 py-3 bg-gray-800 text-white font-bold rounded-xl hover:bg-gray-700 transition-colors">
                إلغاء
              </button>
              <button onClick={activate} className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center gap-2">
                <Lock className="w-4 h-4" /> تفعيل الآن
              </button>
            </div>
            <div className="mt-4 text-center text-[10px] text-gray-500">
              للحصول على الترخيص، يرجى التواصل مع المطور: سهيل الهزبري
            </div>
          </div>
        </div>
      )}
    </>
  );
}
