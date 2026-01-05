
import React, { useState } from 'react';
import WifiForm from './components/WifiForm';
import GuestCard from './components/GuestCard';
import { WifiConfig, QRResult } from './types';
import { generateQRCode } from './services/qrService';
import { generateAIWelcome } from './services/geminiService';
import { Github, Heart, Wifi } from 'lucide-react';

const App: React.FC = () => {
  const [result, setResult] = useState<QRResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (config: WifiConfig) => {
    setLoading(true);
    try {
      // Parallel generation: QR Code and AI Welcome Message
      const [qrDataUrl, welcomeMessage] = await Promise.all([
        generateQRCode(config),
        generateAIWelcome(config.ssid)
      ]);

      setResult({
        qrDataUrl,
        config: {
          ...config,
          welcomeMessage
        }
      });
    } catch (error) {
      console.error("Failed to generate guest card", error);
      alert("Something went wrong generating your card. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen selection:bg-indigo-500/30">
      {/* Background Orbs */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none opacity-50">
        <div className="absolute top-[10%] left-[10%] w-[30rem] h-[30rem] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[10%] right-[10%] w-[40rem] h-[40rem] bg-violet-600/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="container mx-auto px-4 py-12 flex flex-col items-center">
        {/* Header */}
        <header className="mb-12 text-center no-print">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center text-indigo-600 transform -rotate-6">
              <Wifi size={28} />
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white font-outfit tracking-tight">
              Guest<span className="text-indigo-400">Pass</span>
            </h1>
          </div>
          <p className="text-indigo-200/60 max-w-lg mx-auto text-lg leading-relaxed">
            Beautiful WiFi QR codes for your home or office. Provide a seamless experience for your guests with premium printable cards.
          </p>
        </header>

        {/* Main Form */}
        <main className="w-full flex justify-center no-print">
          <WifiForm onSubmit={handleGenerate} isLoading={loading} />
        </main>

        {/* Features / Benefits */}
        <section className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl no-print">
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4 group-hover:scale-110 transition-transform">
              <Wifi size={24} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 font-outfit">Instant Scan</h3>
            <p className="text-indigo-200/50 text-sm">Guests scan the QR code with their camera app to join the network automatically. No typing required.</p>
          </div>
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-pink-500/20 flex items-center justify-center text-pink-400 mb-4 group-hover:scale-110 transition-transform">
              <Heart size={24} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 font-outfit">AI Powered</h3>
            <p className="text-indigo-200/50 text-sm">Uses Gemini AI to generate personalized welcome notes for your network, making your guests feel at home.</p>
          </div>
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
              <Github size={24} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 font-outfit">Privacy First</h3>
            <p className="text-indigo-200/50 text-sm">All processing happens in-memory. We never store your SSID or WiFi passwords. Security is our priority.</p>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-24 text-center text-indigo-200/30 text-xs no-print flex flex-col items-center gap-4">
          <div className="flex items-center space-x-1">
            <span>Built with</span>
            <Heart size={12} className="text-pink-500 fill-pink-500" />
            <span>for visitors everywhere</span>
          </div>
          <p>© 2026 Chet McKnight. All rights reserved.</p>
        </footer>

        {/* Modal Overlay for Card */}
        {result && <GuestCard result={result} onClose={() => setResult(null)} />}
      </div>
    </div>
  );
};

export default App;
