import React, { useState } from 'react';
import { AuditResults, LoanInputs } from '../types';
import { generateTextReport } from '../utils/auditCalculator';
import {
  AlertOctagon,
  AlertTriangle,
  CheckCircle,
  Download,
  Copy,
  Printer,
  ShieldAlert,
  Check,
  FileText
} from 'lucide-react';

interface AuditFindingsProps {
  inputs: LoanInputs;
  results: AuditResults;
  onOpenSachetModal: () => void;
}

export const AuditFindings: React.FC<AuditFindingsProps> = ({
  inputs,
  results,
  onOpenSachetModal
}) => {
  const [copied, setCopied] = useState(false);
  const { riskFlags, safetyScore, isInvalid } = results;

  if (isInvalid) return null;

  const handleDownloadTxt = () => {
    const reportText = generateTextReport(inputs, results);
    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `LoanShield_Audit_Report_${inputs.lenderName ? inputs.lenderName.replace(/[^a-zA-Z0-9]/g, '_') : 'Scan'}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopyClipboard = async () => {
    const reportText = generateTextReport(inputs, results);
    try {
      await navigator.clipboard.writeText(reportText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.error('Failed to copy to clipboard', e);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-rose-50 text-rose-700 rounded-lg">
            <AlertOctagon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Audit Findings & Warnings
            </h3>
            <p className="text-2xs text-slate-500">
              Summary of regulatory non-compliance, rate discrepancies, and consumer traps
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            id="copy-report-btn"
            onClick={handleCopyClipboard}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
            title="Copy audit findings report to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-bold">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>Copy Summary</span>
              </>
            )}
          </button>

          <button
            type="button"
            id="print-report-btn"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
            title="Print or save as PDF"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Print / PDF</span>
          </button>
        </div>
      </div>

      {/* Flag List */}
      <div className="space-y-3">
        {riskFlags.length > 0 ? (
          riskFlags.map((flag) => {
            const isDanger = flag.severity === 'danger';
            return (
              <div
                key={flag.id}
                className={`p-4 rounded-xl border flex items-start gap-3.5 transition-colors ${
                  isDanger
                    ? 'bg-rose-50/70 border-rose-200 text-rose-950'
                    : 'bg-amber-50/70 border-amber-200 text-amber-950'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {isDanger ? (
                    <AlertOctagon className="w-5 h-5 text-rose-600" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                  )}
                </div>

                <div className="space-y-1 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="text-sm font-bold flex items-center gap-2">
                      <span>{isDanger ? '🚨' : '⚠️'} {flag.title}</span>
                    </div>
                    <span className={`text-2xs font-extrabold uppercase px-2 py-0.5 rounded ${
                      isDanger
                        ? 'bg-rose-200/80 text-rose-900'
                        : 'bg-amber-200/80 text-amber-900'
                    }`}>
                      -{flag.penalty} pts
                    </span>
                  </div>

                  <p className="text-xs font-medium leading-relaxed">
                    {flag.description}
                  </p>

                  <div className="text-2xs text-slate-500 pt-1 font-mono">
                    Statutory Rule: {flag.rbiRule}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-5 rounded-xl bg-emerald-50/60 border border-emerald-200 text-emerald-900 flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <div className="text-sm font-bold">
                Clean Bill of Health: No Major Red Flags Detected
              </div>
              <p className="text-xs text-emerald-800 leading-relaxed">
                The loan terms adhere to standard retail credit baselines under Reserve Bank of India consumer protection standards. Always verify the lender is disbursing from a registered bank account before accepting.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons matching Streamlit */}
      <div className="pt-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Action 1: Sachet Report Button if Safety Score < 50 */}
          {safetyScore < 50 ? (
            <button
              id="report-rbi-sachet-action-btn"
              type="button"
              onClick={onOpenSachetModal}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 rounded-xl transition shadow-xs cursor-pointer"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>🚨 Report Entity to RBI Sachet Portal</span>
            </button>
          ) : (
            <button
              id="report-rbi-sachet-action-btn"
              type="button"
              onClick={onOpenSachetModal}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
            >
              <ShieldAlert className="w-4 h-4 text-slate-500" />
              <span>How to Report to RBI Sachet</span>
            </button>
          )}

          {/* Action 2: Download Audit Findings (.txt) matching Streamlit */}
          <button
            id="download-findings-btn"
            type="button"
            onClick={handleDownloadTxt}
            className="w-full flex items-center justify-center gap-2 px-5 py-3 text-sm font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 active:bg-indigo-200 border border-indigo-200 rounded-xl transition cursor-pointer shadow-2xs"
          >
            <Download className="w-4 h-4" />
            <span>📥 Download Audit Findings (.txt)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
