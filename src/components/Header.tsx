import React from 'react';
import { ShieldAlert, ShieldCheck, Shield, FileSearch, Building2, ExternalLink } from 'lucide-react';
import { LOAN_PRESETS } from '../data/nbfcs';

interface HeaderProps {
  currentPreset: string;
  onSelectPreset: (presetId: string) => void;
  onOpenNbfcModal: () => void;
  onOpenSachetModal: () => void;
  safetyScore: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentPreset,
  onSelectPreset,
  onOpenNbfcModal,
  onOpenSachetModal,
  safetyScore
}) => {
  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Logo and branding */}
          <div className="flex items-center space-x-3">
            <div className={`p-2.5 rounded-xl flex items-center justify-center transition-colors ${
              safetyScore >= 80
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : safetyScore >= 50
                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                : 'bg-rose-50 text-rose-700 border border-rose-200'
            }`}>
              {safetyScore >= 80 ? (
                <ShieldCheck className="w-6 h-6 sm:w-7 sm:h-7" />
              ) : safetyScore >= 50 ? (
                <Shield className="w-6 h-6 sm:w-7 sm:h-7" />
              ) : (
                <ShieldAlert className="w-6 h-6 sm:w-7 sm:h-7" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                  LoanShield
                </h1>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                  RBI Auditor
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Digital Lending & True APR Auditor &bull; Cross-checking RBI Mandates
              </p>
            </div>
          </div>

          {/* Quick Presets on Desktop */}
          <div className="hidden lg:flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200/80">
            {LOAN_PRESETS.map((p) => {
              const isActive = currentPreset === p.label || currentPreset === p.id;
              return (
                <button
                  key={p.id}
                  id={`preset-btn-${p.id}`}
                  onClick={() => onSelectPreset(p.id)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    isActive
                      ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  {p.label.split(' ')[0]} {p.label.replace(/^[^\s]+ /, '')}
                </button>
              );
            })}
          </div>

          {/* Action buttons */}
          <div className="flex items-center space-x-2">
            <button
              id="nbfc-directory-header-btn"
              onClick={onOpenNbfcModal}
              className="inline-flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs"
              title="Browse Verified RBI NBFC Directory"
            >
              <Building2 className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden md:inline">RBI NBFC Index</span>
            </button>

            <button
              id="sachet-portal-header-btn"
              onClick={onOpenSachetModal}
              className="inline-flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 transition-colors"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">RBI Sachet Guide</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
