import React, { useState, useCallback } from 'react';
import WifiForm from './components/WifiForm';
import GuestCard from './components/GuestCard';
import { WifiConfig, QRResult } from './types';
import { generateQRCode } from './services/qrService';

// LATEST DEPLOYED URL
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwfVab6ULGhbQLTL2YBvx7rlNXlhPJk8FnQzEzGYS_3S0G2tU4Cu97zj9fCRtdGQnncwg/exec'; 

const App: React.FC = () => {
  const [result, setResult] = useState<QRResult | null>(null);
  const [formKey, setFormKey] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  const submitToGoogleSheets = useCallback(async (config: WifiConfig) => {
    if (!GOOGLE_SCRIPT_URL) return;

    try {
      const formData = new URLSearchParams();
      
      // Standardized keys matching the latest backend script
      formData.append('networkName', config.ssid);
      formData.append('password', config.password || '');
      formData.append('security', config.security);
      formData.append('companyName', config.companyName || '');
      formData.append('companyAddress', config.contactAddress || '');
      formData.append('companyWebsite', config.companyWebsite || '');
      formData.append('contactName', config.contactName || '');
      formData.append('contactEmail', config.contactEmail || '');
      formData.append('contactPhone', config.contactPhone || '');
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
      console.error("Data submission failed", error);
    }
  }, []);

  const handleGenerate = async (config: WifiConfig) => {
    setIsGenerating(true);
    try {
      const qrDataUrl = await generateQRCode(config);
      
      setResult({
        qrDataUrl,
        config: { ...config },
        isAiLoading: false
      });

      // Background submission to Google Sheets
      submitToGoogleSheets(config);
    } catch (error) {
      console.error("Failed to generate guest card", error);
    } finally {
      setIsGenerating(false);
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

      <div className="container mx-auto px-4 py-12 md:py-24 flex flex-col items-center relative z-10">
        {!result && (
          <div className="w-full flex flex-col items-center">
            <main className="w-full flex justify-center no-print">
              <WifiForm key={formKey} onSubmit={handleGenerate} isLoading={isGenerating} />
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