
import React, { useState } from 'react';
import { Wifi, Lock, Eye, EyeOff, ShieldCheck, Sparkles, Loader2, ArrowRight } from 'lucide-react';
import { WifiConfig, SecurityType } from '../types';

interface WifiFormProps {
  onSubmit: (config: WifiConfig) => void;
  isLoading: boolean;
}

const WifiForm: React.FC<WifiFormProps> = ({ onSubmit, isLoading }) => {
  const [config, setConfig] = useState<WifiConfig>({
    ssid: '',
    password: '',
    security: 'WPA',
    hidden: false,
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(config);
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className="bg-[#111111] border border-white/5 rounded-[2.5rem] p-10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] w-full max-w-md mx-auto relative overflow-hidden"
    >
      {/* Floating Glowing Icon */}
      <div className="absolute top-10 right-10 w-12 h-12 bg-gradient-to-br from-[#ff5f3d] to-[#ff3152] rounded-full flex items-center justify-center text-white shadow-[0_0_25px_rgba(255,49,82,0.4)]">
        <Wifi size={24} />
      </div>

      <div className="space-y-1 mb-10">
        <h2 className="text-3xl font-bold text-white font-outfit tracking-tight">
          GuestPass<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff3152] to-[#ff8c31]"> Premium</span>
        </h2>
        <p className="text-slate-500 text-sm font-medium">New network setup</p>
      </div>

      <div className="space-y-8">
        {/* SSID Input */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Network Name</label>
          <div className="relative">
            <input
              required
              type="text"
              placeholder="e.g. MySuperFastWiFi"
              className="w-full bg-[#1a1a1a] border-none rounded-2xl py-4 px-6 text-white placeholder-slate-700 focus:outline-none focus:ring-1 focus:ring-[#ff3152]/30 transition-all font-medium"
              value={config.ssid}
              onChange={(e) => setConfig({ ...config, ssid: e.target.value })}
            />
          </div>
        </div>

        {/* Password Input */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Password</label>
          <div className="relative group">
            <input
              required={config.security !== 'nopass'}
              disabled={config.security === 'nopass'}
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="w-full bg-[#1a1a1a] border-none rounded-2xl py-4 px-6 text-white placeholder-slate-700 focus:outline-none focus:ring-1 focus:ring-[#ff3152]/30 transition-all font-medium disabled:opacity-30"
              value={config.password}
              onChange={(e) => setConfig({ ...config, password: e.target.value })}
            />
            {config.security !== 'nopass' && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-5 flex items-center text-slate-600 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            )}
          </div>
        </div>

        <button
          disabled={isLoading || !config.ssid}
          type="submit"
          className="w-full relative group"
        >
          {/* Background Glow */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[#ff3152] to-[#ff8c31] rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>
          
          <div className="relative flex items-center justify-center space-x-2 w-full bg-gradient-to-r from-[#ff3152] to-[#ff8c31] text-white font-bold py-5 rounded-2xl shadow-xl transition-all active:scale-[0.97]">
            {isLoading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                <span className="text-lg">Generate Card</span>
                <ArrowRight size={20} />
              </>
            )}
          </div>
        </button>

        {/* Custom Security and Signal Footer */}
        <div className="pt-8 border-t border-white/5 flex items-end justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest block">Security</span>
            <select
              className="bg-transparent border-none text-white font-bold p-0 focus:ring-0 cursor-pointer appearance-none hover:text-[#ff3152] transition-colors"
              value={config.security}
              onChange={(e) => setConfig({ ...config, security: e.target.value as SecurityType })}
            >
              <option value="WPA" className="bg-[#111111]">WPA2/3</option>
              <option value="WEP" className="bg-[#111111]">WEP</option>
              <option value="nopass" className="bg-[#111111]">Open</option>
            </select>
          </div>

          {/* Visual Signal Bars */}
          <div className="flex items-end gap-1 mb-1">
            <div className="w-1.5 h-3 bg-slate-800 rounded-sm"></div>
            <div className="w-1.5 h-4 bg-slate-800 rounded-sm"></div>
            <div className="w-1.5 h-6 bg-[#ff3152] rounded-sm shadow-[0_0_8px_#ff3152]"></div>
            <div className="w-1.5 h-4 bg-slate-800 rounded-sm"></div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default WifiForm;
