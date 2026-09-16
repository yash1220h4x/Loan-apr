import React from 'react';
import { AuditResults, LoanInputs } from '../types';
import {
  CheckCircle2,
  XCircle,
  ShieldCheck,
  ShieldAlert,
  Info,
  Building,
  Lock,
  Calendar,
  FileText,
  RotateCcw
} from 'lucide-react';

interface ComplianceMatrixProps {
  inputs: LoanInputs;
  results: AuditResults;
  onToggleCheck?: (field: keyof LoanInputs, val: any) => void;
}

export const ComplianceMatrix: React.FC<ComplianceMatrixProps> = ({
  inputs,
  results,
  onToggleCheck
}) => {
  const { complianceChecks } = results;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              RBI Digital Lending Compliance Matrix
            </h3>
            <p className="text-2xs text-slate-500">
              Cross-checked against the Reserve Bank of India DLA Regulatory Framework
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-2xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
            {complianceChecks.filter(c => c.status).length} of {complianceChecks.length} Passed
          </span>
        </div>
      </div>

      {/* Compliance List */}
      <div className="space-y-3">
        {complianceChecks.map((check) => {
          const isPass = check.status;
          return (
            <div
              key={check.id}
              className={`p-3.5 sm:p-4 rounded-xl border transition-all ${
                isPass
                  ? 'bg-emerald-50/40 border-emerald-200'
                  : 'bg-rose-50/50 border-rose-200'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 shrink-0">
                    {isPass ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-rose-600" />
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                      {check.label}
                    </div>
                    <p className="text-2xs sm:text-xs text-slate-600 leading-relaxed">
                      {check.subtext}
                    </p>
                    <div className="pt-0.5 text-2xs text-slate-400 font-mono">
                      Ref: {check.rbiReference}
                    </div>
                  </div>
                </div>

                <div className="shrink-0">
                  {isPass ? (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-2xs font-extrabold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
                      COMPLIANT
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-2xs font-extrabold uppercase tracking-wider bg-rose-100 text-rose-800 border border-rose-300">
                      VIOLATION
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Statutory Guidance Note */}
      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-2xs text-slate-600 space-y-1">
        <div className="font-bold text-slate-800 flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-indigo-600" />
          <span>Statutory Protection Rights for Digital Borrowers:</span>
        </div>
        <p className="leading-relaxed">
          Under RBI Master Directions (2022-2024), any regulated entity (RE) extending credit via digital lending applications (DLAs)
          must disburse directly into the borrower&apos;s bank account without pass-through pool accounts, provide a cooling-off window,
          and refrain from biometric or contact harvesting.
        </p>
      </div>
    </div>
  );
};
