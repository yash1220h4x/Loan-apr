import React, { useState } from 'react';
import { AuditResults, LoanInputs } from '../types';
import { formatINR } from '../utils/auditCalculator';
import {
  X,
  ShieldAlert,
  ExternalLink,
  Copy,
  Check,
  PhoneCall,
  FileCheck,
  AlertTriangle,
  Send
} from 'lucide-react';

interface SachetReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  inputs: LoanInputs;
  results: AuditResults;
}

export const SachetReportModal: React.FC<SachetReportModalProps> = ({
  isOpen,
  onClose,
  inputs,
  results
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const violationsList = results.riskFlags.map((f, i) => `${i + 1}. ${f.title}: ${f.description}`).join('\n');

  const complaintTemplate = `TO: RESERVE BANK OF INDIA (SACHET PORTAL) & CYBER CRIME CELL
COMPLAINT: REPORTING SUSPICIOUS / PREDATORY DIGITAL LENDING APPLICATION

Date: ${new Date().toLocaleDateString('en-IN')}

1. ENTITY DETAILS:
- Name of App / Lender: ${inputs.lenderName || 'Unknown / Unnamed Digital Lending App'}
- Sanctioned Loan Principal: Rs. ${inputs.principal}
- Actual Cash Disbursed in Bank: Rs. ${results.netDisbursed.toFixed(2)}
- Total Repayment Demanded: Rs. ${results.totalRepayment.toFixed(2)}
- Stated Tenure: ${inputs.tenureDays} Days
- Calculated True APR: ${results.trueApr.toFixed(1)}% p.a.
- Advertised Nominal Rate: ${results.advertisedSimpleAnnualRate.toFixed(1)}% p.a.

2. IDENTIFIED STATUTORY VIOLATIONS (RBI Master Directions on Digital Lending):
${violationsList}
${inputs.appContacts ? '- Gross Privacy Breach: Application demanded access to Contact Book and Device Storage, in direct contravention of RBI Digital Lending Directions.' : ''}
${!inputs.kfsProvided ? '- Transparency Violation: Key Fact Statement (KFS) was withheld prior to contract signing.' : ''}

3. RELIEF REQUESTED:
I request the Reserve Bank of India and Enforcement Directorate to investigate the lending credentials of this entity, verify if it operates with a valid NBFC registration, and block unauthorized payment gateways associated with this predatory scheme.

Submitted via LoanShield Digital Lending Auditor.`;

  const handleCopyComplaint = async () => {
    try {
      await navigator.clipboard.writeText(complaintTemplate);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-5 bg-rose-50 border-b border-rose-200 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-rose-100 text-rose-700 rounded-xl">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-rose-950">
                RBI Sachet Portal Reporting Guide
              </h3>
              <p className="text-xs text-rose-800">
                Official grievance channels for illegal lending apps & extortionate APR
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-rose-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-slate-800 text-xs sm:text-sm">
          {/* Sachet Overview Notice */}
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-950 space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-amber-900">
              <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
              <span>What is the RBI Sachet Portal?</span>
            </div>
            <p className="text-xs leading-relaxed text-amber-900/90">
              <strong>Sachet (sachet.rbi.org.in)</strong> is the Reserve Bank of India&apos;s statutory multi-agency portal to report entities collecting deposits or disbursing credit without valid RBI registrations. Reports are automatically forwarded to State Police Economic Offences Wings (EOW) and the RBI Enforcement Department.
            </p>
          </div>

          {/* Official Portals Direct Access */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Official Grievance Portals
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a
                href="https://sachet.rbi.org.in"
                target="_blank"
                rel="noreferrer"
                className="p-3.5 rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/40 transition group flex flex-col justify-between"
              >
                <div>
                  <div className="font-bold text-slate-900 flex items-center justify-between">
                    <span>RBI Sachet Portal</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600" />
                  </div>
                  <p className="text-2xs text-slate-500 mt-1">
                    Directly report unregistered digital lenders and unauthorized recovery tactics.
                  </p>
                </div>
                <span className="text-2xs font-semibold text-indigo-600 mt-2">sachet.rbi.org.in &rarr;</span>
              </a>

              <a
                href="https://cybercrime.gov.in"
                target="_blank"
                rel="noreferrer"
                className="p-3.5 rounded-xl border border-slate-200 hover:border-rose-400 hover:bg-rose-50/40 transition group flex flex-col justify-between"
              >
                <div>
                  <div className="font-bold text-slate-900 flex items-center justify-between">
                    <span>National Cyber Crime Portal</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-rose-600" />
                  </div>
                  <p className="text-2xs text-slate-500 mt-1">
                    For blackmail, contact harvesting, morphing, or debt extortion. Call Helpline <strong>1930</strong>.
                  </p>
                </div>
                <span className="text-2xs font-semibold text-rose-600 mt-2">cybercrime.gov.in (Dial 1930) &rarr;</span>
              </a>
            </div>
          </div>

          {/* Pre-filled Complaint Text Box */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Generated Complaint Affidavit
              </h4>
              <button
                type="button"
                id="copy-complaint-template-btn"
                onClick={handleCopyComplaint}
                className="inline-flex items-center gap-1.5 px-3 py-1 text-2xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Text</span>
                  </>
                )}
              </button>
            </div>
            <textarea
              readOnly
              rows={8}
              value={complaintTemplate}
              className="w-full p-3 font-mono text-2xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 leading-relaxed focus:outline-none select-all"
            />
          </div>

          {/* 4 Steps to lodge complaint */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Step-by-Step Reporting Checklist
            </h4>
            <ol className="list-decimal list-inside space-y-1 text-xs text-slate-700 pl-1">
              <li>Open <strong>sachet.rbi.org.in</strong> and click on <em>&quot;Help Your Police / Report An Illegal Entity&quot;</em>.</li>
              <li>Paste the auto-generated complaint draft and mention bank transfer screenshots / UPI IDs.</li>
              <li>Revoke all app permissions in your phone settings immediately (Settings &rarr; Apps &rarr; Permissions &rarr; Contacts/Photos &rarr; Don&apos;t Allow).</li>
              <li>If receiving threatening calls or messages, immediately dial <strong>1930</strong> (National Cyber Fraud Helpline).</li>
            </ol>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-200/60 rounded-xl transition"
          >
            Close
          </button>
          <button
            type="button"
            onClick={handleCopyComplaint}
            className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition shadow-xs flex items-center gap-1.5"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{copied ? 'Copied!' : 'Copy Complaint'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
