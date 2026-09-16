import React, { useState } from 'react';
import { LoanInputs } from '../types';
import { LOAN_PRESETS, VERIFIED_NBFCS } from '../data/nbfcs';
import { formatINR } from '../utils/auditCalculator';
import {
  SlidersHorizontal,
  Info,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  RotateCcw,
  Sparkles,
  Building2,
  Calendar,
  IndianRupee,
  ShieldCheck,
  ShieldAlert
} from 'lucide-react';

interface SidebarControlsProps {
  inputs: LoanInputs;
  onChange: (updated: Partial<LoanInputs>) => void;
  onSelectPreset: (presetId: string) => void;
  isVerifiedNbfc: boolean;
  onOpenNbfcModal: () => void;
}

export const SidebarControls: React.FC<SidebarControlsProps> = ({
  inputs,
  onChange,
  onSelectPreset,
  isVerifiedNbfc,
  onOpenNbfcModal
}) => {
  const [showNbfcSuggestions, setShowNbfcSuggestions] = useState(false);

  const gstAmount = inputs.upfrontFee * (inputs.gstRate || 0.18);
  const totalUpfrontDeductions = inputs.upfrontFee + gstAmount;

  // Filter NBFC suggestions based on current lenderName
  const matchingNbfcs = VERIFIED_NBFCS.filter(item => {
    if (!inputs.lenderName || inputs.lenderName.length < 2) return false;
    const query = inputs.lenderName.toLowerCase();
    return item.name.toLowerCase().includes(query) || item.brand.toLowerCase().includes(query);
  });

  return (
    <aside className="w-full lg:w-96 bg-white border-r border-slate-200 lg:min-h-[calc(100vh-5rem)] p-5 sm:p-6 space-y-6 shrink-0">
      {/* Title & Preset Bar */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <SlidersHorizontal className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">
              LoanShield Controls
            </h2>
          </div>
          <button
            id="reset-controls-btn"
            onClick={() => onSelectPreset('custom')}
            className="text-xs font-medium text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors"
            title="Reset to default custom inputs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
        </div>

        {/* Real-World Scenario Presets */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-700">
            Load Real-World Scenario:
          </label>
          <div className="relative">
            <select
              id="preset-dropdown-select"
              value={
                LOAN_PRESETS.find(p => p.label === inputs.presetName || p.id === inputs.presetName)?.id ||
                'custom'
              }
              onChange={(e) => onSelectPreset(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2.5 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
            >
              {LOAN_PRESETS.map((preset) => (
                <option key={preset.id} value={preset.id}>
                  {preset.label}
                </option>
              ))}
            </select>
          </div>
          {/* Preset mini description */}
          {inputs.presetName && inputs.presetName !== 'Custom Input' && (
            <p className="text-2xs text-slate-500 bg-slate-50 border border-slate-200/70 p-2 rounded-md leading-relaxed">
              {LOAN_PRESETS.find(p => p.label === inputs.presetName || p.id === inputs.presetName)?.description}
            </p>
          )}
        </div>
      </div>

      <hr className="border-slate-200" />

      {/* Section 1: Loan Terms */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-700 inline-flex items-center justify-center text-2xs font-bold">1</span>
            Loan Terms
          </h3>
        </div>

        {/* Principal */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label htmlFor="sanctioned-principal-input" className="text-xs font-semibold text-slate-700">
              Sanctioned Loan Amount (₹)
            </label>
            <span className="text-xs font-bold text-indigo-700">
              {formatINR(inputs.principal)}
            </span>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <IndianRupee className="w-4 h-4" />
            </div>
            <input
              id="sanctioned-principal-input"
              type="number"
              min={1000}
              max={200000}
              step={500}
              value={inputs.principal}
              onChange={(e) => onChange({ principal: Number(e.target.value) || 0 })}
              className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-semibold focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>

          {/* Quick chips */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {[5000, 10000, 25000, 50000, 100000].map((val) => (
              <button
                key={val}
                type="button"
                id={`chip-principal-${val}`}
                onClick={() => onChange({ principal: val })}
                className={`text-2xs px-2 py-1 rounded-md font-medium border transition-colors ${
                  inputs.principal === val
                    ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                ₹{val >= 1000 ? `${val / 1000}k` : val}
              </button>
            ))}
          </div>
        </div>

        {/* Tenure Days */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label htmlFor="tenure-days-slider" className="text-xs font-semibold text-slate-700 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Tenure (in Days)
            </label>
            <div className="flex items-center gap-1.5">
              <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                inputs.tenureDays < 15
                  ? 'bg-rose-100 text-rose-700 border border-rose-200'
                  : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
              }`}>
                {inputs.tenureDays} Days
              </span>
            </div>
          </div>

          <input
            id="tenure-days-slider"
            type="range"
            min={3}
            max={180}
            step={1}
            value={inputs.tenureDays}
            onChange={(e) => onChange({ tenureDays: Number(e.target.value) })}
            className="w-full accent-indigo-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
          />

          <div className="flex justify-between text-2xs text-slate-400 font-medium px-0.5">
            <span className={inputs.tenureDays <= 7 ? 'text-rose-600 font-bold' : ''}>3d</span>
            <span className={inputs.tenureDays === 7 ? 'text-rose-600 font-bold' : ''}>7d (Trap)</span>
            <span className={inputs.tenureDays === 15 ? 'text-amber-600 font-bold' : ''}>15d (Min Safe)</span>
            <span>30d</span>
            <span>90d</span>
            <span>180d</span>
          </div>

          {inputs.tenureDays < 15 && (
            <p className="text-2xs text-rose-600 bg-rose-50 border border-rose-200 rounded-md p-2 flex items-start gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>
                <strong>Warning:</strong> Loans under 15 days are heavily associated with extortionate revolving rollover traps.
              </span>
            </p>
          )}
        </div>
      </div>

      <hr className="border-slate-200" />

      {/* Section 2: Advertised Charges */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
          <span className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-700 inline-flex items-center justify-center text-2xs font-bold">2</span>
          Advertised Charges
        </h3>

        {/* Daily Flat Fee */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label htmlFor="daily-rate-input" className="text-xs font-semibold text-slate-700">
              Advertised Daily Fee / Interest (₹/day)
            </label>
            <span className="text-xs font-bold text-slate-900">
              ₹{inputs.dailyRate.toFixed(1)}/day
            </span>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <IndianRupee className="w-4 h-4" />
            </div>
            <input
              id="daily-rate-input"
              type="number"
              min={0}
              max={500}
              step={5}
              value={inputs.dailyRate}
              onChange={(e) => onChange({ dailyRate: Number(e.target.value) || 0 })}
              className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-semibold focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>
          <p className="text-2xs text-slate-500">
            Total over {inputs.tenureDays} days: <span className="font-semibold text-slate-800">{formatINR(inputs.dailyRate * inputs.tenureDays)}</span>
          </p>
        </div>

        {/* Upfront Processing Fee */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label htmlFor="upfront-fee-input" className="text-xs font-semibold text-slate-700">
              Upfront Processing / Platform Fee (₹)
            </label>
            <span className="text-xs font-bold text-slate-900">
              {formatINR(inputs.upfrontFee)}
            </span>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <IndianRupee className="w-4 h-4" />
            </div>
            <input
              id="upfront-fee-input"
              type="number"
              min={0}
              max={10000}
              step={100}
              value={inputs.upfrontFee}
              onChange={(e) => onChange({ upfrontFee: Number(e.target.value) || 0 })}
              className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-semibold focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>

          {/* GST Calculation Breakdown */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-2xs space-y-1">
            <div className="flex justify-between text-slate-600">
              <span>+ GST on Processing Fee (18%):</span>
              <span className="font-semibold text-slate-800">{formatINR(gstAmount, true)}</span>
            </div>
            <div className="flex justify-between font-bold text-slate-900 border-t border-slate-200/80 pt-1">
              <span>Total Upfront Deducted:</span>
              <span className="text-rose-700">{formatINR(totalUpfrontDeductions, true)}</span>
            </div>
          </div>
        </div>
      </div>

      <hr className="border-slate-200" />

      {/* Section 3: Permissions & Disclosures */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
          <span className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-700 inline-flex items-center justify-center text-2xs font-bold">3</span>
          Permissions & Disclosures
        </h3>

        {/* Checkboxes */}
        <div className="space-y-3">
          {/* App Contacts/Gallery */}
          <label className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
            inputs.appContacts
              ? 'bg-rose-50/80 border-rose-300 text-rose-900 shadow-2xs'
              : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-800'
          }`}>
            <input
              id="app-contacts-checkbox"
              type="checkbox"
              checked={inputs.appContacts}
              onChange={(e) => onChange({ appContacts: e.target.checked })}
              className="mt-0.5 w-4 h-4 rounded text-rose-600 focus:ring-rose-500 border-slate-300 accent-rose-600"
            />
            <div className="space-y-0.5">
              <div className="text-xs font-semibold flex items-center gap-1.5">
                <span>App requests Contact Book / Gallery access</span>
                {inputs.appContacts && (
                  <span className="text-2xs bg-rose-200 text-rose-800 px-1.5 py-0.2 rounded font-bold">
                    RBI VIOLATION
                  </span>
                )}
              </div>
              <p className="text-2xs text-slate-500 leading-tight">
                RBI rules explicitly ban digital lending apps from requesting access to smartphone storage or media.
              </p>
            </div>
          </label>

          {/* KFS Provided */}
          <label className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
            !inputs.kfsProvided
              ? 'bg-amber-50/80 border-amber-300 text-amber-900'
              : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-800'
          }`}>
            <input
              id="kfs-provided-checkbox"
              type="checkbox"
              checked={inputs.kfsProvided}
              onChange={(e) => onChange({ kfsProvided: e.target.checked })}
              className="mt-0.5 w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 accent-emerald-600"
            />
            <div className="space-y-0.5">
              <div className="text-xs font-semibold">
                Key Fact Statement (KFS) provided upfront
              </div>
              <p className="text-2xs text-slate-500 leading-tight">
                Mandatory document stating all fees, APR, and recovery agent details before loan agreement execution.
              </p>
            </div>
          </label>

          {/* Cooling Off Period */}
          <label className="flex items-start gap-2.5 p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer text-slate-800 transition-all">
            <input
              id="cooling-off-checkbox"
              type="checkbox"
              checked={inputs.coolingOff}
              onChange={(e) => onChange({ coolingOff: e.target.checked })}
              className="mt-0.5 w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 accent-indigo-600"
            />
            <div className="space-y-0.5">
              <div className="text-xs font-semibold">
                Look-up / Free cancellation period available
              </div>
              <p className="text-2xs text-slate-500 leading-tight">
                Borrower can exit the loan by repaying principal without penalty within a designated look-up window.
              </p>
            </div>
          </label>
        </div>

        {/* Lender Name Input */}
        <div className="space-y-1.5 relative">
          <div className="flex justify-between items-center">
            <label htmlFor="lender-name-input" className="text-xs font-semibold text-slate-700 flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              Lending App / NBFC Partner
            </label>
            <button
              type="button"
              id="browse-nbfc-link"
              onClick={onOpenNbfcModal}
              className="text-2xs text-indigo-600 hover:text-indigo-800 font-semibold underline"
            >
              Verify List
            </button>
          </div>

          <div className="relative">
            <input
              id="lender-name-input"
              type="text"
              placeholder="e.g. KreditBee, Bajaj Finance, DMI Finance..."
              value={inputs.lenderName}
              onChange={(e) => {
                onChange({ lenderName: e.target.value });
                setShowNbfcSuggestions(true);
              }}
              onFocus={() => setShowNbfcSuggestions(true)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
            {inputs.lenderName && (
              <div className="absolute right-2.5 top-2.5">
                {isVerifiedNbfc ? (
                  <ShieldCheck className="w-4 h-4 text-emerald-600" title="RBI Verified Entity" />
                ) : (
                  <ShieldAlert className="w-4 h-4 text-amber-500" title="Not verified in sample RBI index" />
                )}
              </div>
            )}
          </div>

          {/* Autocomplete dropdown */}
          {showNbfcSuggestions && matchingNbfcs.length > 0 && (
            <div className="absolute z-20 left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
              <div className="p-1.5 text-2xs text-slate-400 font-medium border-b border-slate-100">
                RBI Registered Match Found:
              </div>
              {matchingNbfcs.map((item) => (
                <button
                  key={item.name}
                  type="button"
                  id={`suggest-nbfc-${item.brand}`}
                  onClick={() => {
                    onChange({ lenderName: item.name });
                    setShowNbfcSuggestions(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-indigo-50/70 border-b border-slate-100 last:border-0 transition-colors"
                >
                  <div className="text-xs font-semibold text-slate-900">{item.brand}</div>
                  <div className="text-2xs text-slate-500 truncate">{item.name}</div>
                </button>
              ))}
            </div>
          )}

          {/* Verified status badge */}
          {inputs.lenderName && (
            <div className="pt-1">
              {isVerifiedNbfc ? (
                <div className="flex items-center gap-1 text-2xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-md font-medium">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                  <span>Found in RBI-registered NBFC verification index</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-2xs text-amber-800 bg-amber-50 border border-amber-200 px-2 py-1 rounded-md font-medium">
                  <AlertTriangle className="w-3 h-3 text-amber-600 shrink-0" />
                  <span>Entity not in our verified index. Check official RBI website.</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
