import React, { useRef, useState } from 'react';
import { Printer, Wifi, Download, Loader2 } from 'lucide-react';
import { QRResult } from '../types';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface GuestCardProps {
  result: QRResult;
  onClose: () => void;
}

const GuestCard: React.FC<GuestCardProps> = ({ result, onClose }) => {
  const { qrDataUrl, config } = result;
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    if (!cardRef.current) return;
    setIsDownloading(true);

    try {
      // Capture the card with optimized settings for size
      // Scale 2 is enough for print quality (approx 300dpi for small prints) but keeps file size low
      const canvas = await html2canvas(cardRef.current, {
        scale: 2, 
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
      });

      // Use JPEG with 0.8 quality to drastically reduce file size (~300kb target)
      // Since background is white, we don't need PNG transparency
      const imgData = canvas.toDataURL('image/jpeg', 0.8);
      
      // Calculate dimensions (matches 9:16 aspect ratio)
      // Standard printable width, e.g., 90mm x 160mm
      const pdfWidth = 90; 
      const pdfHeight = 160; 
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [pdfWidth, pdfHeight]
      });

      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${config.ssid}-guest-pass.pdf`);
    } catch (error) {
      console.error('PDF Generation failed', error);
      alert('Could not generate PDF. Please try printing instead.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-in fade-in duration-300 guest-card-overlay overflow-y-auto">
      <div className="relative w-full max-w-[360px] my-auto flex flex-col items-center">
        
        {/* The Card Component - Precise 9:16 Portrait Layout */}
        <div 
          ref={cardRef}
          className="guest-card-container bg-white rounded-[1.5rem] p-6 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)] text-slate-900 w-full aspect-[9/16] flex flex-col items-center overflow-hidden relative"
        >
          {/* Top WiFi Icon Badge */}
          <div 
            className="w-12 h-12 bg-black rounded-xl flex items-center justify-center mb-6 mt-4 shadow-lg shrink-0"
            style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}
          >
            <Wifi size={24} className="text-white" />
          </div>

          {/* Centered Typography */}
          <div className="text-center mb-6 shrink-0">
            <h2 className="text-3xl font-bold text-slate-900 mb-1 tracking-tight">WiFi</h2>
            <p className="text-slate-500 font-medium text-xs uppercase tracking-widest">Scan to connect</p>
          </div>

          {/* Prominent QR Code - Centered in remaining space */}
          <div className="w-full flex-grow flex items-center justify-center px-2 mb-6 min-h-0">
            <div className="w-full max-w-[200px] aspect-square flex items-center justify-center p-4">
              <img 
                src={qrDataUrl} 
                alt="WiFi QR Code" 
                className="w-full h-full object-contain mix-blend-multiply" 
              />
            </div>
          </div>

          {/* Information Detail Boxes */}
          <div className="w-full space-y-3 mb-8 shrink-0">
            {/* Network Name Container */}
            <div className="bg-[#f3f4f6]/80 p-3.5 rounded-xl text-center w-full border border-slate-100/50">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Network</span>
              <p className="text-base font-bold font-outfit break-all text-slate-800 leading-tight">{config.ssid}</p>
            </div>

            {/* Password Container - Only shown if security is not open */}
            {config.security !== 'nopass' && config.password && (
              <div className="bg-[#f3f4f6]/80 p-3.5 rounded-xl text-center w-full border border-slate-100/50 animate-in fade-in slide-in-from-bottom-1 duration-500">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Password</span>
                <p className="text-base font-bold font-outfit break-all text-slate-800 leading-tight">{config.password}</p>
              </div>
            )}
          </div>
          
          {/* Subtle footer credit */}
          <div className="text-[7px] text-slate-300 font-black uppercase tracking-[0.2em] mt-auto mb-4">
            GuestPass Premium
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 w-full grid grid-cols-2 gap-3 no-print px-2">
          <button 
            onClick={handlePrint}
            className="col-span-1 bg-white text-black font-bold py-3.5 rounded-xl shadow-xl hover:bg-slate-50 transition-all active:scale-95 flex items-center justify-center gap-2 text-sm"
          >
            <Printer size={18} />
            <span>Print</span>
          </button>
          
          <button 
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            className="col-span-1 bg-white text-black font-bold py-3.5 rounded-xl shadow-xl hover:bg-slate-50 transition-all active:scale-95 flex items-center justify-center gap-2 text-sm disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isDownloading ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
            <span>{isDownloading ? 'Saving...' : 'PDF'}</span>
          </button>
          
          <button 
            onClick={onClose}
            className="col-span-2 bg-[#141414] text-white font-bold py-4 rounded-xl shadow-xl hover:bg-black transition-all active:scale-95 flex items-center justify-center text-base"
          >
            <span>Create New</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default GuestCard;