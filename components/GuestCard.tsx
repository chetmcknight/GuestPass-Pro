
import React, { useRef, useState } from 'react';
import { Printer, Download, X, Wifi, Shield, FileText, Loader2 } from 'lucide-react';
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
  const [isExporting, setIsExporting] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const captureCard = async (): Promise<HTMLCanvasElement | null> => {
    if (!cardRef.current) return null;
    setIsExporting(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        onclone: (clonedDoc) => {
          const element = clonedDoc.querySelector('.guest-card-container') as HTMLElement;
          if (element) {
            element.style.borderRadius = '32px';
            element.style.boxShadow = 'none';
          }
        }
      });
      return canvas;
    } catch (error) {
      console.error("Failed to capture card:", error);
      return null;
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadImage = async () => {
    const canvas = await captureCard();
    if (!canvas) return;
    
    const image = canvas.toDataURL("image/png");
    const link = document.createElement('a');
    link.href = image;
    link.download = `GuestPass_${config.ssid}.png`;
    link.click();
  };

  const handleDownloadPDF = async () => {
    const canvas = await captureCard();
    if (!canvas) return;

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [canvas.width / 3, canvas.height / 3]
    });

    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 3, canvas.height / 3);
    pdf.save(`GuestPass_${config.ssid}.pdf`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-300 guest-card-overlay">
      <div className="relative w-full max-w-3xl">
        <div className="absolute -top-12 left-0 right-0 flex justify-between items-center text-white px-4 no-print">
          <p className="text-sm font-medium opacity-70 italic">Tip: You can print, or download as Image/PDF</p>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Card Canvas */}
        <div 
          ref={cardRef}
          className="guest-card-container bg-white rounded-[2.5rem] p-12 shadow-2xl text-slate-900 overflow-hidden w-full"
        >
          <div className="flex flex-col md:flex-row gap-12 items-stretch">
            {/* Left Column: QR Code Section */}
            <div className="w-full md:w-[45%] flex flex-col items-center">
              <div className="bg-[#f1f3f5] p-6 rounded-[2.5rem] w-full flex items-center justify-center aspect-square mb-6">
                <img src={qrDataUrl} alt="WiFi QR Code" className="w-full h-full object-contain mix-blend-multiply" />
              </div>
              <p className="text-[14px] text-[#94a3b8] font-bold uppercase tracking-[0.25em] text-center">Scan to Connect</p>
            </div>

            {/* Right Column: Information Section */}
            <div className="w-full md:w-[55%] flex flex-col justify-between pt-2">
              <div className="space-y-6">
                <div className="flex justify-start">
                  <div className="px-5 py-1.5 bg-[#eef2ff] text-[#4f46e5] rounded-full text-[13px] font-extrabold uppercase tracking-widest">
                    Guest WiFi
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-5xl font-black font-outfit text-[#0f172a] tracking-tight">{config.ssid}</h4>
                  {config.welcomeMessage && (
                     <p className="text-[#64748b] italic text-lg font-medium leading-snug">"{config.welcomeMessage}"</p>
                  )}
                </div>

                <div className="h-[1px] bg-[#f1f5f9] w-full my-6"></div>

                <div className="space-y-5">
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold text-[#94a3b8] uppercase tracking-[0.15em]">Network Name</span>
                    <p className="text-xl font-bold text-[#1e293b] font-outfit">{config.ssid}</p>
                  </div>
                  
                  {config.security !== 'nopass' && (
                    <div className="flex items-center space-x-4">
                      <span className="text-[11px] font-bold text-[#94a3b8] uppercase tracking-[0.15em] whitespace-nowrap">Password</span>
                      <div className="bg-[#f8fafc] px-5 py-2.5 rounded-2xl border border-[#f1f5f9]">
                        <p className="text-xl font-bold text-[#0f172a] font-outfit tracking-tight">
                          {config.password}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center text-[12px] font-bold text-[#6366f1] uppercase tracking-wider pt-2">
                    <Shield size={16} className="mr-2" />
                    Secure {config.security} Network
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-10 flex items-center justify-between text-[11px] text-[#cbd5e1] font-bold uppercase tracking-wider">
                <span>GUESTPASS GENERATOR</span>
                <span className="w-1.5 h-1.5 bg-[#e2e8f0] rounded-full mx-2"></span>
                <span>FAST & SECURE</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 no-print">
          <button 
            disabled={isExporting}
            onClick={handlePrint}
            className="bg-white text-indigo-600 hover:bg-slate-50 font-bold py-4 px-2 rounded-2xl shadow-xl flex flex-col items-center justify-center gap-1 transition-all active:scale-95 text-xs disabled:opacity-50"
          >
            <Printer size={20} />
            <span>Print Card</span>
          </button>
          
          <button 
            disabled={isExporting}
            onClick={handleDownloadImage}
            className="bg-indigo-600 text-white hover:bg-indigo-500 font-bold py-4 px-2 rounded-2xl shadow-xl flex flex-col items-center justify-center gap-1 transition-all active:scale-95 text-xs disabled:opacity-50"
          >
            {isExporting ? <Loader2 size={20} className="animate-spin" /> : <Download size={20} />}
            <span>Download PNG</span>
          </button>

          <button 
            disabled={isExporting}
            onClick={handleDownloadPDF}
            className="bg-indigo-600 text-white hover:bg-indigo-500 font-bold py-4 px-2 rounded-2xl shadow-xl flex flex-col items-center justify-center gap-1 transition-all active:scale-95 text-xs disabled:opacity-50"
          >
            {isExporting ? <Loader2 size={20} className="animate-spin" /> : <FileText size={20} />}
            <span>Download PDF</span>
          </button>

          <button 
            onClick={onClose}
            className="bg-slate-800 text-white hover:bg-slate-700 font-bold py-4 px-2 rounded-2xl shadow-xl flex flex-col items-center justify-center gap-1 transition-all active:scale-95 text-xs"
          >
            <X size={20} />
            <span>Dismiss</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default GuestCard;
