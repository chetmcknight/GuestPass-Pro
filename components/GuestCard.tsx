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
    document.title = `GuestPass Pro - ${safeSSID || 'Network'}`;
    
    window.print();
    
    setTimeout(() => {
      document.title = originalTitle;
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 guest-card-overlay overflow-y-auto animate-in fade-in zoom-in-95 duration-300 print:animate-none print:p-0 print:overflow-visible">
      {/* Intermediate wrapper for screen layout, reset in print CSS */}
      <div className="relative w-full max-w-[340px] my-auto flex flex-col items-center print:w-auto print:max-w-none print:my-0">
        
        {/* The Card Component - Precise 5:7 Portrait Layout */}
        <div 
          className="guest-card-container bg-white rounded-[1.25rem] p-6 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)] text-slate-900 w-full aspect-[5/7] flex flex-col items-center justify-between overflow-hidden relative"
        >
          {/* Header Section */}
          <div className="flex flex-col items-center w-full shrink-0 pt-2">
             <div 
              className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center mb-3 border border-slate-300 shadow-sm print:shadow-none overflow-hidden print:bg-white print:border-slate-900"
              style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}
            >
              <Wifi size={20} className="text-slate-900" strokeWidth={2.5} />
            </div>

            <div className="text-center">
              <h2 className="text-3xl font-bold text-slate-900 tracking-tighter font-outfit leading-none mb-1">WiFi</h2>
              <p className="text-slate-400 font-medium text-xl">Scan to Connect</p>
            </div>
          </div>

          {/* Center Section: QR Code */}
          <div className="flex-grow w-full flex items-center justify-center py-2 min-h-0 print:bg-white">
            <div className="w-full h-full max-w-[200px] max-h-[200px] aspect-square bg-white flex items-center justify-center print:bg-white">
              <img 
                src={qrDataUrl} 
                alt="WiFi QR Code" 
                className="qr-code-img w-full h-full object-contain p-1" 
                style={{ imageRendering: 'pixelated' }}
              />
            </div>
          </div>

          {/* Footer Section: Details - Label: Value Format - Left Aligned */}
          <div className="w-full shrink-0 mb-1 mt-auto">
            <div className="w-full flex flex-col items-start gap-1">
              <div className="flex flex-wrap items-baseline justify-start gap-x-2 w-full text-left">
                <span className="text-sm font-medium text-slate-400">Network Name:</span>
                <span className="text-lg font-medium font-outfit text-slate-900 break-all leading-tight">{config.ssid}</span>
              </div>

              {config.security !== 'nopass' && config.password && (
                <div className="flex flex-wrap items-baseline justify-start gap-x-2 w-full text-left">
                  <span className="text-sm font-medium text-slate-400">Password:</span>
                  <span className="text-lg font-medium font-outfit text-slate-900 break-all leading-tight">{config.password}</span>
                </div>
              )}
            </div>
            
            <div className="pt-6 flex justify-center">
              <p className="text-[8px] text-slate-300 font-medium uppercase tracking-[0.2em]">GuestPass Pro</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 w-full grid grid-cols-2 gap-3 no-print px-2">
          <button 
            onClick={handlePrint}
            className="col-span-1 bg-white/10 backdrop-blur-md text-white border border-white/10 font-bold py-4 rounded-2xl shadow-xl hover:bg-white/20 transition-all active:scale-95 flex items-center justify-center gap-2 text-lg"
          >
            <Printer size={20} />
            <span>Print</span>
          </button>
          
          <button 
            onClick={onClose}
            className="col-span-1 relative group"
          >
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