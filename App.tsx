import React, { useState, useCallback } from 'react';
import WifiForm from './components/WifiForm';
import GuestCard from './components/GuestCard';
import { WifiConfig, QRResult } from './types';
import { generateQRCode } from './services/qrService';
import { Printer, Wifi, Sparkles } from 'lucide-react';

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbya3dTzGTObx5-KKSas_85pAgDkQYmwmUBr_OAhDPXpcf7H4mL8e6uInIyF0ri7m6mf9w/exec'; 

const App: React.FC = () => {
  const [result, setResult] = useState<QRResult | null>(null);
  const [formKey, setFormKey] = useState(0);

  const submitToGoogleSheets = useCallback(async (config: WifiConfig) => {
    if (!GOOGLE_SCRIPT_URL) return;

    try {
      const formData = new URLSearchParams();
      formData.append('ssid', config.ssid);
      formData.append('security', config.security);
      formData.append('password', config.password || '');
      formData.append('companyName', config.companyName || '');
      formData.append('companyWebsite', config.companyWebsite || '');
      formData.append('contactName', config.contactName || '');
      formData.append('contactEmail', config.contactEmail || '');
      formData.append('contactPhone', config.contactPhone || '');
      formData.append('contactAddress', config.contactAddress || '');
      formData.append('notes', config.notes || '');

      // keepalive ensures the request finishes even if the user interacts with the UI
      fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
        keepalive: true
      });
    } catch (error) {
      console.error("Async submission failed", error);
    }
  }, []);

  const handleGenerate = async (config: WifiConfig) => {
    try {
      // 1. Generate QR Code locally (extremely fast)
      const qrDataUrl = await generateQRCode(config);
      
      // 2. Display Result Immediately
      setResult({
        qrDataUrl,
        config: { ...config },
        isAiLoading: false
      });

      // 3. Fire-and-forget background submission (non-blocking)
      submitToGoogleSheets(config);
    } catch (error) {
      console.error("Failed to generate guest card", error);
    }
  };

  const handleClose = useCallback(() => {
    setResult(null);
    setFormKey(prev => prev + 1);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#050505] overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[60%] h-[60%] bg-[#ff3152]/20 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[50%] h-[50%] bg-[#ff8c31]/15 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(5,5,5,0.8)_100%)]" />
      </div>

      <div className="container mx-auto px-4 py-16 flex flex-col items-center relative z-10">
        {!result && (
          <div className="w-full flex flex-col items-center">
            <header className="mb-16 text-center no-print">
              <div className="flex flex-col items-center justify-center mb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[#ff8c31] text-xs font-bold uppercase tracking-widest mb-4">
                  <Sparkles size={12} />
                  <span>Professional Guest Management</span>
                </div>
                <h1 className="text-4xl md:text-7xl font-extrabold text-white font-outfit tracking-tighter">
                  GuestPass<span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#ff3152] to-[#ff8c31] pr-[0.1em]"> Pro</span>
                </h1>
              </div>
              <p className="text-slate-400 max-w-lg mx-auto text-lg leading-relaxed font-medium">
                Generate beautiful WiFi cards for your guests instantly.
              </p>
            </header>

            <main className="w-full flex justify-center no-print">
              <WifiForm key={formKey} onSubmit={handleGenerate} isLoading={false} />
            </main>

            <section className="mt-28 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl no-print w-full px-4">
              <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-md">
                <div className="w-12 h-12 rounded-2xl bg-[#ff3152]/10 flex items-center justify-center text-[#ff3152] mb-6 shadow-[0_0_15px_-3px_rgba(255,49,82,0.3)]">
                  <Wifi size={24} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 font-outfit">Instant Scan</h3>
                <p className="text-slate-500 text-sm leading-relaxed">Join the network automatically. No manual typing required.</p>
              </div>
              <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-md">
                <div className="w-12 h-12 rounded-2xl bg-[#ff8c31]/10 flex items-center justify-center text-[#ff8c31] mb-6 shadow-[0_0_15px_-3px_rgba(255,140,49,0.3)]">
                  <Printer size={24} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 font-outfit">Print Ready</h3>
                <p className="text-slate-500 text-sm leading-relaxed">Perfectly formatted for printing or saving as a high-quality PDF.</p>
              </div>
              <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-md">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-6 shadow-[0_0_15px_-3px_rgba(99,102,241,0.3)]">
                  <Wifi size={24} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 font-outfit">Secure Access</h3>
                <p className="text-slate-500 text-sm leading-relaxed">Encrypted QR protocols for reliable guest networking.</p>
              </div>
            </section>

            <footer className="mt-32 mb-8 text-center no-print">
              <p className="text-slate-600 text-xs uppercase tracking-[0.2em]">© 2026 GuestPass Pro</p>
            </footer>
          </div>
        )}

        {result && <GuestCard result={result} onClose={handleClose} />}
      </div>
    </div>
  );
};

export default App;