import React, { useState } from 'react';
import WifiForm from './components/WifiForm';
import GuestCard from './components/GuestCard';
import { WifiConfig, QRResult } from './types';
import { generateQRCode } from './services/qrService';
import { Github, Printer, Wifi } from 'lucide-react';

const App: React.FC = () => {
  const [result, setResult] = useState<QRResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (config: WifiConfig) => {
    setLoading(true);
    try {
      // 1. Generate QR Code locally (Instant)
      const qrDataUrl = await generateQRCode(config);
      
      // 2. Show the result immediately
      setResult({
        qrDataUrl,
        config: {
          ...config,
          welcomeMessage: "" 
        },
        isAiLoading: false
      });
      
      setLoading(false);
    } catch (error) {
      console.error("Failed to generate guest card", error);
      alert("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen selection:bg-[#ff3152]/30 bg-[#050505] overflow-hidden">
      {/* Premium Mesh Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-900/20 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] right-[-10%] w-[60%] h-[60%] bg-[#ff3152]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] bg-blue-900/20 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 py-16 flex flex-col items-center relative z-10">
        {/* Header */}
        <header className="mb-16 text-center no-print">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <h1 className="text-4xl md:text-7xl font-extrabold text-white font-outfit tracking-tighter drop-shadow-2xl">
              GuestPass<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff3152] to-[#ff8c31]"> Premium</span>
            </h1>
          </div>
          <p className="text-slate-400 max-w-lg mx-auto text-lg leading-relaxed font-medium">
            Generate beautiful, scan-to-connect WiFi cards for your guests instantly.
          </p>
        </header>

        {/* Main Form */}
        <main className="w-full flex justify-center no-print">
          <WifiForm onSubmit={handleGenerate} isLoading={loading} />
        </main>

        {/* Features / Benefits */}
        <section className="mt-28 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl no-print w-full px-4">
          <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-all group backdrop-blur-sm">
            <div className="w-12 h-12 rounded-2xl bg-[#ff3152]/10 flex items-center justify-center text-[#ff3152] mb-6 group-hover:scale-110 transition-transform shadow-[0_0_15px_-3px_rgba(255,49,82,0.3)]">
              <Wifi size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-3 font-outfit">Instant Scan</h3>
            <p className="text-slate-500 text-sm leading-relaxed">Join the network automatically. No manual typing required.</p>
          </div>
          <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-all group backdrop-blur-sm">
            <div className="w-12 h-12 rounded-2xl bg-[#ff8c31]/10 flex items-center justify-center text-[#ff8c31] mb-6 group-hover:scale-110 transition-transform shadow-[0_0_15px_-3px_rgba(255,140,49,0.3)]">
              <Printer size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-3 font-outfit">Print Ready</h3>
            <p className="text-slate-500 text-sm leading-relaxed">Perfectly formatted for printing or saving as a high-quality PDF.</p>
          </div>
          <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-all group backdrop-blur-sm">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 transition-transform shadow-[0_0_15px_-3px_rgba(99,102,241,0.3)]">
              <Github size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-3 font-outfit">Fast & Secure</h3>
            <p className="text-slate-500 text-sm leading-relaxed">Optimized local processing ensures your card is ready in milliseconds.</p>
          </div>
        </section>

        <footer className="mt-32 text-center text-slate-600 text-sm no-print">
          <p>© 2026 GuestPass Premium</p>
        </footer>

        {result && <GuestCard result={result} onClose={() => setResult(null)} />}
      </div>
    </div>
  );
};

export default App;