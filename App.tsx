import React, { useState, useCallback } from 'react';
import WifiForm from './components/WifiForm';
import GuestCard from './components/GuestCard';
import { WifiConfig, QRResult } from './types';
import { generateQRCode } from './services/qrService';
import { Sparkles } from 'lucide-react';

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
      const qrDataUrl = await generateQRCode(config);
      
      setResult({
        qrDataUrl,
        config: { ...config },
        isAiLoading: false
      });

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
        <div className="absolute top-[-10%] right-[-5%] w-[60%] h-[60%] bg-[#ff3152]/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[50%] h-[50%] bg-[#ff8c31]/10 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(5,5,5,0.9)_100%)]" />
      </div>

      <div className="container mx-auto px-4 py-20 flex flex-col items-center relative z-10">
        {!result && (
          <div className="w-full flex flex-col items-center">
            <header className="mb-12 text-center no-print">
              <div className="flex flex-col items-center justify-center">
                {/* Stylized Branding */}
                <h1 className="text-5xl md:text-8xl font-black text-white font-outfit tracking-tighter leading-none select-none mb-8">
                  GuestPass<span className="inline-block text-transparent bg-clip-text bg-gradient-to-br from-[#ff3152] via-[#ff5f3d] to-[#ff8c31] pr-[0.15em]">Pro</span>
                </h1>

                {/* stylized "Professional Guest Management" graphic pill moved BELOW */}
                <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-white/[0.03] border border-white/10 text-[#ff8c31] text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl backdrop-blur-md">
                  <Sparkles size={14} className="fill-[#ff8c31]/20" />
                  <span>Professional Guest Management</span>
                </div>
              </div>
            </header>

            <main className="w-full flex justify-center no-print">
              <WifiForm key={formKey} onSubmit={handleGenerate} isLoading={false} />
            </main>

            <footer className="mt-24 mb-8 text-center no-print">
              <p className="text-slate-700 text-[10px] font-bold uppercase tracking-[0.3em] opacity-50">GuestPass Pro Systems • 2026</p>
            </footer>
          </div>
        )}

        {result && <GuestCard result={result} onClose={handleClose} />}
      </div>
    </div>
  );
};

export default App;