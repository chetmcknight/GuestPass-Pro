import React from 'react';
import { Printer, Wifi } from 'lucide-react';
import { QRResult } from '../types';

interface GuestCardProps {
  result: QRResult;
  onClose: () => void;
}

const GuestCard: React.FC<GuestCardProps> = ({ result, onClose }) => {
  const { qrDataUrl, config } = result;

  const handlePrint = () => {
    const originalTitle = document.title;
    const safeSSID = config.ssid.replace(/[^a-z0-9\s\-_]/gi, '').trim();
    document.title = `GuestPassPro - ${safeSSID || 'Network'}`;
    window.print();
    setTimeout(() => { document.title = originalTitle; }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 guest-card-overlay overflow-y-auto animate-in fade-in zoom-in-95 duration-300 print:animate-none print:p-0 print:overflow-visible" style={{ willChange: 'transform, opacity' }}>
      <div className="relative w-full max-w-[340px] my-auto flex flex-col items-center print:w-auto print:max-w-none print:my-0">
        
        {/* The Card Component - Precise 5:7 Portrait Layout */}
        <div className="guest-card-container bg-white rounded-[1.25rem] px-8 pt-10 pb-4 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)] text-slate-900 w-full aspect-[5/7] flex flex-col items-center justify-between overflow-hidden relative" style={{ backfaceVisibility: 'hidden' }}>
          
          {/* Header Section */}
          <div className="flex flex-col items-center w-full shrink-0 z-10">
            <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 border border-slate-100 rotate-3 print:border-slate-200 shadow-sm transition-transform hover:rotate-6 duration-500">
              <Wifi size={24} className="text-slate-900" strokeWidth={2.5} />
            </div>
            
            <div className="text-center px-4 space-y-0.5">
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight font-outfit leading-none">Connect to WiFi</h2>
              <p className="text-slate-400 font-medium text-xs tracking-wide">Scan code to join network</p>
            </div>
          </div>

          {/* QR Code Section - Optically Centered with negative margin to offset header weight */}
          <div className="flex-grow w-full flex items-center justify-center min-h-0 relative -translate-y-3 z-0 print:translate-y-0">
            <div className="w-full h-full max-w-[200px] max-h-[200px] aspect-square flex items-center justify-center relative">
              <img 
                src={qrDataUrl} 
                alt="WiFi QR Code" 
                className="qr-code-img w-full h-full object-contain" 
                style={{ imageRendering: 'pixelated' }}
              />
            </div>
          </div>

          {/* Footer Branding */}
          <div className="w-full shrink-0 mt-auto flex flex-col items-center gap-2 z-10">
            {config.companyName && (
               <div className="relative mb-0.5">
                 <p className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] text-center relative z-10">
                   {config.companyName}
                 </p>
                 <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-[#ff8c31]/30 rounded-full"></div>
               </div>
            )}
            
            <p className="text-[8px] font-bold text-slate-300 tracking-widest select-none">
              GuestCardPro
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 w-full grid grid-cols-2 gap-3 no-print px-2 pb-8">
          <button 
            onClick={handlePrint}
            className="col-span-1 bg-white/10 backdrop-blur-md text-white border border-white/10 font-bold py-4 rounded-2xl shadow-xl hover:bg-white/20 transition-all active:scale-95 flex items-center justify-center gap-2 text-lg"
          >
            <Printer size={20} />
            <span>Print</span>
          </button>
          
          <button onClick={onClose} className="col-span-1 relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#ff8c31] to-[#ff5f3d] rounded-2xl blur opacity-40 group-hover:opacity-100 transition duration-300"></div>
            <div className="relative bg-gradient-to-r from-[#ff8c31] to-[#ff5f3d] text-white font-bold py-4 rounded-2xl shadow-lg transition-all active:scale-95 flex items-center justify-center text-lg gap-2">
              <span>Create New</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default GuestCard;