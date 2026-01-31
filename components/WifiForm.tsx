import React, { useState, memo, useMemo } from 'react';
import { Loader2, ArrowRight, Building2, User, Phone, Mail, MapPin, Globe, StickyNote, Sparkles, Eye, EyeOff } from 'lucide-react';
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
    hideSsidOnCard: false,
    hidePasswordOnCard: false,
    companyName: '',
    companyWebsite: '',
    contactName: '',
    contactPhone: '',
    contactAddress: '',
    contactEmail: '',
    notes: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(config);
  };

  const inputClasses = useMemo(() => "w-full bg-[#1a1a1a] border border-transparent rounded-2xl py-3.5 px-5 text-white placeholder-slate-700 hover:border-[#ff8c31]/30 focus:outline-none focus:ring-2 focus:ring-[#ff8c31]/50 focus:border-transparent transition-all duration-300 font-medium text-base md:text-sm", []);
  const labelClasses = useMemo(() => "text-[11px] font-bold text-slate-500 tracking-wider uppercase block ml-1 mb-1.5", []);

  return (
    <form 
      onSubmit={handleSubmit}
      style={{ contain: 'content' }}
      className="bg-[#111111] border border-white/5 rounded-[2.5rem] p-6 md:p-10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] w-full max-w-2xl mx-auto relative overflow-hidden backdrop-blur-sm"
    >
      {/* Integrated Header inside the tile */}
      <div className="flex flex-col items-center mb-10 pb-10 border-b border-white/5 animate-in fade-in duration-700">
        <div className="flex items-center mb-4 leading-none">
          <span className="text-4xl md:text-5xl font-[900] tracking-[-0.06em] font-outfit text-white">GuestPass</span>
          <span className="text-4xl md:text-5xl font-[900] tracking-[-0.06em] font-outfit text-transparent bg-clip-text bg-gradient-to-r from-[#ff3152] to-[#ff8c31] pr-4">Pro</span>
        </div>
        
        {/* Management Badge: Toned down Orange Stroke to match hover state */}
        <div className="px-5 py-1.5 rounded-full flex items-center gap-2.5 border border-[#ff8c31]/30 shadow-sm bg-transparent">
          <Sparkles size={11} className="text-[#ff8c31] fill-[#ff8c31]/20" />
          <span className="text-[9px] font-black uppercase tracking-[0.25em] text-white/80">Professional Guest Management</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-1 h-4 bg-[#ff3152] rounded-full"></div>
              <h3 className="text-xs font-black text-white uppercase tracking-[0.2em]">Network</h3>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className={labelClasses}>Network Name (SSID)</label>
              <input
                required
                type="text"
                placeholder="e.g. Office_Guest"
                className={inputClasses}
                value={config.ssid}
                autoComplete="off"
                onChange={(e) => setConfig({ ...config, ssid: e.target.value })}
              />
            </div>

            <div>
              <label className={labelClasses}>Password</label>
              <div className="relative">
                <input
                  required={config.security !== 'nopass'}
                  disabled={config.security === 'nopass'}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={inputClasses}
                  value={config.password}
                  onChange={(e) => setConfig({ ...config, password: e.target.value })}
                />
                {config.security !== 'nopass' && (
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-600 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                )}
              </div>
            </div>

            <div className="pt-2">
              <label className={labelClasses}>Security Type</label>
              <select
                className={`${inputClasses} appearance-none cursor-pointer`}
                value={config.security}
                onChange={(e) => setConfig({ ...config, security: e.target.value as SecurityType })}
              >
                <option value="WPA">WPA2/WPA3 (Standard)</option>
                <option value="WEP">WEP (Legacy)</option>
                <option value="nopass">None (Open)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1 h-4 bg-[#ff8c31] rounded-full"></div>
            <h3 className="text-xs font-black text-white uppercase tracking-[0.2em]">Business Profile</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className={labelClasses}>Company Name</label>
              <div className="relative">
                <Building2 size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
                <input
                  type="text"
                  placeholder="Acme Corp"
                  className={`${inputClasses} pl-12`}
                  value={config.companyName}
                  onChange={(e) => setConfig({ ...config, companyName: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className={labelClasses}>Company Address</label>
              <div className="relative">
                <MapPin size={16} className="absolute left-4 top-4 text-slate-600" />
                <textarea
                  placeholder="123 Business Lane, City, State"
                  rows={2}
                  className={`${inputClasses} pl-12 resize-none`}
                  value={config.contactAddress}
                  onChange={(e) => setConfig({ ...config, contactAddress: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className={labelClasses}>Company Website</label>
              <div className="relative">
                <Globe size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
                <input
                  type="text"
                  inputMode="url"
                  placeholder="acme.com"
                  className={`${inputClasses} pl-12`}
                  value={config.companyWebsite}
                  onChange={(e) => setConfig({ ...config, companyWebsite: e.target.value })}
                />
              </div>
            </div>

            <div className="pt-2 border-t border-white/5 space-y-4">
              <div>
                <label className={labelClasses}>Contact Name</label>
                <div className="relative">
                  <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
                  <input
                    type="text"
                    placeholder="Full Name"
                    className={`${inputClasses} pl-12`}
                    value={config.contactName}
                    onChange={(e) => setConfig({ ...config, contactName: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className={labelClasses}>Contact Phone</label>
                <div className="relative">
                  <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
                  <input
                    type="tel"
                    inputMode="tel"
                    placeholder="+1 (555) 000-0000"
                    className={`${inputClasses} pl-12`}
                    value={config.contactPhone}
                    onChange={(e) => setConfig({ ...config, contactPhone: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className={labelClasses}>Contact Email</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
                  <input
                    type="text"
                    inputMode="email"
                    placeholder="hi@acme.com"
                    className={`${inputClasses} pl-12`}
                    value={config.contactEmail}
                    onChange={(e) => setConfig({ ...config, contactEmail: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className={labelClasses}>Internal Notes</label>
              <div className="relative">
                <StickyNote size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
                <input
                  type="text"
                  placeholder="Reference details..."
                  className={`${inputClasses} pl-12`}
                  value={config.notes}
                  onChange={(e) => setConfig({ ...config, notes: e.target.value })}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-8 border-t border-white/5">
        <button
          disabled={isLoading || !config.ssid}
          type="submit"
          className="w-full relative group"
        >
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[#ff3152] to-[#ff8c31] rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-1000"></div>
          <div className="relative flex items-center justify-center space-x-2 w-full bg-gradient-to-r from-[#ff3152] to-[#ff8c31] text-white font-bold py-5 rounded-2xl shadow-xl transition-all active:scale-[0.98]">
            {isLoading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                <span className="text-lg">Generate Guest Card</span>
                <ArrowRight size={20} />
              </>
            )}
          </div>
        </button>
      </div>
    </form>
  );
};

export default memo(WifiForm);