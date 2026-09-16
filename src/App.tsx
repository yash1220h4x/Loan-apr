import React, { useState, useMemo } from 'react';
import { LoanInputs } from './types';
import { LOAN_PRESETS, VERIFIED_NBFCS } from './data/nbfcs';
import { calculateAudit, generateTextReport } from './utils/auditCalculator';
import { Header } from './components/Header';
import { SidebarControls } from './components/SidebarControls';
import { RiskBanner } from './components/RiskBanner';
import { MetricCards } from './components/MetricCards';
import { FinancialAnatomy } from './components/FinancialAnatomy';
import { ComplianceMatrix } from './components/ComplianceMatrix';
import { AuditFindings } from './components/AuditFindings';
import { SachetReportModal } from './components/SachetReportModal';
import { NbfcLookupModal } from './components/NbfcLookupModal';
import {
  ShieldAlert,
  ShieldCheck,
  Building2,
  ExternalLink,
  Info,
  SlidersHorizontal,
  FileText
} from 'lucide-react';

export default function App() {
  // Default values matching the Streamlit app
  const [inputs, setInputs] = useState<LoanInputs>({
    presetName: 'Custom Input',
    principal: 10000,
    tenureDays: 30,
    dailyRate: 20.0,
    upfrontFee: 800,
    gstRate: 0.18,
    appContacts: false,
    kfsProvided: true,
    coolingOff: true,
    lenderName: ''
  });

  const [isSachetModalOpen, setIsSachetModalOpen] = useState(false);
  const [isNbfcModalOpen, setIsNbfcModalOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Compute live audit results
  const results = useMemo(() => {
    return calculateAudit(inputs);
  }, [inputs]);

  const handleSelectPreset = (presetId: string) => {
    const preset = LOAN_PRESETS.find(p => p.id === presetId || p.label === presetId);
    if (!preset) return;

    setInputs(prev => ({
      ...prev,
      presetName: preset.label,
      ...preset.inputs
    }));
  };

  const handleInputChange = (updated: Partial<LoanInputs>) => {
    setInputs(prev => {
      const next = { ...prev, ...updated };
      // If user is editing values directly, mark as Custom Input if it doesn't match the current preset
      if (updated.principal !== undefined ||
          updated.tenureDays !== undefined ||
          updated.dailyRate !== undefined ||
          updated.upfrontFee !== undefined ||
          updated.appContacts !== undefined ||
          updated.kfsProvided !== undefined ||
          updated.coolingOff !== undefined ||
          updated.lenderName !== undefined) {
        // If preset wasn't custom, check if changed
        if (next.presetName !== 'Custom Input') {
          const currentPresetObj = LOAN_PRESETS.find(p => p.label === next.presetName);
          if (currentPresetObj) {
            const hasChanged =
              (updated.principal !== undefined && updated.principal !== currentPresetObj.inputs.principal) ||
              (updated.tenureDays !== undefined && updated.tenureDays !== currentPresetObj.inputs.tenureDays) ||
              (updated.dailyRate !== undefined && updated.dailyRate !== currentPresetObj.inputs.dailyRate) ||
              (updated.upfrontFee !== undefined && updated.upfrontFee !== currentPresetObj.inputs.upfrontFee) ||
              (updated.appContacts !== undefined && updated.appContacts !== currentPresetObj.inputs.appContacts) ||
              (updated.kfsProvided !== undefined && updated.kfsProvided !== currentPresetObj.inputs.kfsProvided) ||
              (updated.coolingOff !== undefined && updated.coolingOff !== currentPresetObj.inputs.coolingOff) ||
              (updated.lenderName !== undefined && updated.lenderName !== currentPresetObj.inputs.lenderName);
            if (hasChanged) {
              next.presetName = 'Custom Input';
            }
          }
        }
      }
      return next;
    });
  };

  const handleDownloadReport = () => {
    const reportText = generateTextReport(inputs, results);
    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'LoanShield_Audit_Report.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 flex flex-col font-sans text-slate-900 antialiased">
      {/* Top Header */}
      <Header
        currentPreset={inputs.presetName}
        onSelectPreset={handleSelectPreset}
        onOpenNbfcModal={() => setIsNbfcModalOpen(true)}
        onOpenSachetModal={() => setIsSachetModalOpen(true)}
        safetyScore={results.safetyScore}
      />

      {/* Mobile Drawer Toggle Bar */}
      <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-2.5 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition"
        >
          <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
          <span>{mobileSidebarOpen ? 'Hide Loan Controls' : 'Edit Loan Terms & Controls'}</span>
        </button>

        <div className="text-xs font-bold flex items-center gap-1.5">
          <span className="text-slate-500">Safety Score:</span>
          <span className={`px-2 py-0.5 rounded text-2xs font-extrabold ${
            results.safetyScore >= 80
              ? 'bg-emerald-100 text-emerald-800'
              : results.safetyScore >= 50
              ? 'bg-amber-100 text-amber-800'
              : 'bg-rose-100 text-rose-800'
          }`}>
            {results.safetyScore}/100
          </span>
        </div>
      </div>

      {/* Main App Container */}
      <div className="flex-1 flex flex-col lg:flex-row max-w-7xl w-full mx-auto">
        {/* Sidebar Controls (Streamlit sidebar representation) */}
        <div className={`${mobileSidebarOpen ? 'block' : 'hidden'} lg:block shrink-0`}>
          <SidebarControls
            inputs={inputs}
            onChange={handleInputChange}
            onSelectPreset={(id) => {
              handleSelectPreset(id);
              setMobileSidebarOpen(false);
            }}
            isVerifiedNbfc={results.isVerifiedNbfc}
            onOpenNbfcModal={() => setIsNbfcModalOpen(true)}
          />
        </div>

        {/* Dashboard Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-x-hidden">
          {/* Main Title & Caption */}
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 flex items-center gap-2.5">
              <span>🛡️ LoanShield: Digital Lending &amp; True APR Auditor</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
              Cross-checking instant-loan fine print against Reserve Bank of India (RBI) consumer protection mandates.
            </p>
          </div>

          {/* Top Risk Banner */}
          <RiskBanner
            results={results}
            onOpenSachetModal={() => setIsSachetModalOpen(true)}
            onDownloadReport={handleDownloadReport}
          />

          {/* High-Level 4 Metric Cards */}
          <MetricCards inputs={inputs} results={results} />

          {/* Detailed Breakdown & Compliance (2 Columns) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            {/* Financial Anatomy Table & Scam Math */}
            <FinancialAnatomy inputs={inputs} results={results} />

            {/* RBI Compliance Matrix */}
            <ComplianceMatrix
              inputs={inputs}
              results={results}
              onToggleCheck={(field, val) => handleInputChange({ [field]: val })}
            />
          </div>

          {/* Audit Findings & Action Buttons */}
          <AuditFindings
            inputs={inputs}
            results={results}
            onOpenSachetModal={() => setIsSachetModalOpen(true)}
          />

          {/* Regulatory Reference Banner */}
          <footer className="pt-6 pb-8 border-t border-slate-200/80 text-2xs text-slate-500 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-700">Statutory Framework:</span>
                <span>RBI Guidelines on Digital Lending (DOR.CRE.REC.66/21.07.001/2022-23) &amp; Master Direction on KFS 2024</span>
              </div>
              <div className="flex items-center gap-4">
                <a
                  href="https://sachet.rbi.org.in"
                  target="_blank"
                  rel="noreferrer"
                  className="text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
                >
                  <span>RBI Sachet Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <a
                  href="https://cybercrime.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
                >
                  <span>Cyber Crime (1930)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
            <p className="text-slate-400">
              Disclaimer: LoanShield is an educational compliance and mathematical audit utility for retail borrowers. Always cross-verify loan agreements with the regulated entity&apos;s registered name on the RBI master directory before entering financial commitments.
            </p>
          </footer>
        </main>
      </div>

      {/* Modals */}
      <SachetReportModal
        isOpen={isSachetModalOpen}
        onClose={() => setIsSachetModalOpen(false)}
        inputs={inputs}
        results={results}
      />

      <NbfcLookupModal
        isOpen={isNbfcModalOpen}
        onClose={() => setIsNbfcModalOpen(false)}
        onSelectNbfc={(name) => handleInputChange({ lenderName: name })}
        selectedLender={inputs.lenderName}
      />
    </div>
  );
}
