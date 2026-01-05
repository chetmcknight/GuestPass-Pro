
import React, { useState } from 'react';
import { Wifi, Lock, Eye, EyeOff, ShieldCheck, Sparkles, Loader2 } from 'lucide-react';
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
      className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl space-y-6 w-full max-w-md mx-auto"
    >
      <div className="text-center space-y-2 mb-8">
        <div className="inline-flex p-3 bg-indigo-500/20 rounded-2xl text-indigo-400 mb-2">
          <Wifi size={32} />
        </div>
        <h2 className="text-2xl font-bold text-white font-outfit">Configure Guest WiFi</h2>
        <p className="text-indigo-200/60 text-sm">Enter your network details to generate a card.</p>
      </div>

      <div className="space-y-4">
        {/* SSID Input */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-indigo-300 uppercase tracking-wider ml-1">Network Name (SSID)</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/40 group-focus-within:text-indigo-400 transition-colors">
              <Wifi size={18} />
            </div>
            <input
              required
              type="text"
              placeholder="e.g. MyHome_5G"
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
              value={config.ssid}
              onChange={(e) => setConfig({ ...config, ssid: e.target.value })}
            />
          </div>
        </div>

        {/* Password Input (Conditionally Rendered) */}
        {config.security !== 'nopass' && (
          <div className="space-y-1">
            <label className="text-xs font-semibold text-indigo-300 uppercase tracking-wider ml-1">Password</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/40 group-focus-within:text-indigo-400 transition-colors">
                <Lock size={18} />
              </div>
              <input
                required
                type={showPassword ? "text" : "password"}
                placeholder="********"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-12 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                value={config.password}
                onChange={(e) => setConfig({ ...config, password: e.target.value })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/40 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
        )}

        {/* Hidden Toggle */}
        <div className="flex items-center space-x-3 ml-1 pt-2">
          <button
            type="button"
            onClick={() => setConfig({ ...config, hidden: !config.hidden })}
            className={`w-12 h-6 rounded-full transition-colors relative ${config.hidden ? 'bg-indigo-600' : 'bg-white/20'}`}
          >
            <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${config.hidden ? 'translate-x-6' : ''}`} />
          </button>
          <span className="text-sm text-indigo-100/80">Hidden Network</span>
        </div>

        {/* Security Select (Moved to last position) */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-indigo-300 uppercase tracking-wider ml-1">Security Type</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/40">
              <ShieldCheck size={18} />
            </div>
            <select
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all appearance-none cursor-pointer"
              value={config.security}
              onChange={(e) => setConfig({ ...config, security: e.target.value as SecurityType })}
            >
              <option value="WPA" className="bg-slate-900">WPA/WPA2/WPA3 (Recommended)</option>
              <option value="WEP" className="bg-slate-900">WEP (Legacy)</option>
              <option value="nopass" className="bg-slate-900">None (Open Network)</option>
            </select>
          </div>
        </div>
      </div>

      <button
        disabled={isLoading || !config.ssid}
        type="submit"
        className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-500/20 flex items-center justify-center space-x-2 transition-all active:scale-[0.98]"
      >
        {isLoading ? (
          <Loader2 className="animate-spin" size={20} />
        ) : (
          <>
            <Sparkles size={20} />
            <span>Generate Guest Card</span>
          </>
        )}
      </button>
    </form>
  );
};

export default WifiForm;
