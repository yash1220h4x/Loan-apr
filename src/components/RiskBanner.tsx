import React from 'react';
import { ShieldAlert, ShieldCheck, AlertTriangle, ArrowRight, FileDown, ExternalLink } from 'lucide-react';
import { AuditResults } from '../types';

interface RiskBannerProps {
  results: AuditResults;
  onOpenSachetModal: () => void;
  onDownloadReport: () => void;
}

export const RiskBanner: React.FC<RiskBannerProps> = ({
  results,
  onOpenSachetModal,
  onDownloadReport
}) => {
  const { safetyScore, isInvalid, invalidReason, riskFlags } = results;

  if (isInvalid) {
    return (
      <div id="invalid-configuration-alert" className="p-6 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-950 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-rose-100 text-rose-700 rounded-xl">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-rose-900">
              Invalid Loan Configuration
            </h3>
            <p className="text-sm text-rose-800">
              {invalidReason || 'Upfront processing fees and GST equal or exceed the sanctioned principal!'}
            </p>
            <p className="text-xs text-rose-700 pt-1">
              Please adjust the loan amount or reduce the upfront platform fee in the left sidebar controls.
            </p>
          </div>
        </div>
      </div>
    );
  }

  let statusConfig = {
    title: 'HIGH PREDATORY RISK DETECTED',
    badge: '🚨 HIGH PREDATORY RISK',
    summary: 'This loan exhibits characteristics of extortionate or illegal lending practices.',
    bgColor: 'bg-rose-50/90',
    borderColor: 'border-rose-200',
    accentBorder: 'border-l-rose-600',
    textColor: 'text-rose-950',
    headingColor: 'text-rose-900',
    subtextColor: 'text-rose-800',
    scoreBadgeBg: 'bg-rose-600 text-white',
    icon: <ShieldAlert className="w-8 h-8 text-rose-600" />,
    progressBarColor: 'bg-rose-600'
  };

  if (safetyScore >= 80) {
    statusConfig = {
      title: 'Low Risk Offer',
      badge: '✅ COMPLIANT OFFER',
      summary: 'This offer appears compliant with fair digital lending standards and RBI consumer protection baselines.',
      bgColor: 'bg-emerald-50/90',
      borderColor: 'border-emerald-200',
      accentBorder: 'border-l-emerald-600',
      textColor: 'text-emerald-950',
      headingColor: 'text-emerald-900',
      subtextColor: 'text-emerald-800',
      scoreBadgeBg: 'bg-emerald-600 text-white',
      icon: <ShieldCheck className="w-8 h-8 text-emerald-600" />,
      progressBarColor: 'bg-emerald-600'
    };
  } else if (safetyScore >= 50) {
    statusConfig = {
      title: 'Caution Advised',
      badge: '⚠️ CAUTION ADVISED',
      summary: 'High hidden fees or missing statutory disclosures detected. Review terms carefully before signing.',
      bgColor: 'bg-amber-50/90',
      borderColor: 'border-amber-200',
      accentBorder: 'border-l-amber-500',
      textColor: 'text-amber-950',
      headingColor: 'text-amber-900',
      subtextColor: 'text-amber-800',
      scoreBadgeBg: 'bg-amber-600 text-white',
      icon: <AlertTriangle className="w-8 h-8 text-amber-600" />,
      progressBarColor: 'bg-amber-500'
    };
  }

  return (
    <div
      id="top-risk-banner"
      className={`relative overflow-hidden rounded-2xl border ${statusConfig.borderColor} ${statusConfig.bgColor} p-5 sm:p-6 transition-all shadow-xs`}
    >
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
        {/* Left icon and message */}
        <div className="flex items-start gap-4">
          <div className="p-3 bg-white/80 rounded-2xl shadow-2xs shrink-0 border border-slate-200/40">
            {statusConfig.icon}
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-2xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/90 border border-slate-200/60 text-slate-800">
                {statusConfig.badge}
              </span>
              <span className="text-xs font-semibold text-slate-600">
                RBI Compliance Audit
              </span>
            </div>

            <h2 className={`text-xl sm:text-2xl font-black tracking-tight ${statusConfig.headingColor}`}>
              {safetyScore >= 80 ? '✅ ' : safetyScore >= 50 ? '⚠️ ' : '🚨 '}
              {statusConfig.title}{' '}
              <span className="font-semibold text-base sm:text-lg opacity-90">
                (Safety Score: {safetyScore}/100)
              </span>
            </h2>

            <p className={`text-sm ${statusConfig.subtextColor} max-w-2xl font-medium leading-relaxed`}>
              {statusConfig.summary}
            </p>
          </div>
        </div>

        {/* Right Score Meter & Quick Action */}
        <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-3 w-full lg:w-auto shrink-0 border-t lg:border-t-0 border-slate-200/60 pt-3 lg:pt-0">
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-2xs uppercase tracking-wider font-bold text-slate-500">
                Safety Rating
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900">
                {safetyScore}
                <span className="text-sm font-semibold text-slate-400">/100</span>
              </div>
            </div>

            <div className="w-24 bg-white/80 rounded-full h-3.5 p-0.5 border border-slate-300">
              <div
                className={`h-full rounded-full transition-all duration-500 ${statusConfig.progressBarColor}`}
                style={{ width: `${Math.max(4, safetyScore)}%` }}
              />
            </div>
          </div>

          {safetyScore < 50 && (
            <button
              id="report-sachet-banner-btn"
              onClick={onOpenSachetModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition shadow-xs"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Report to RBI Sachet</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Penalties Summary Chip bar if score is penalized */}
      {riskFlags.length > 0 && (
        <div className="mt-4 pt-3.5 border-t border-slate-200/70 flex flex-wrap items-center gap-2 text-2xs">
          <span className="font-bold text-slate-700">Deduction Factors:</span>
          {riskFlags.map((flag) => (
            <span
              key={flag.id}
              className={`px-2 py-0.5 rounded font-medium ${
                flag.severity === 'danger'
                  ? 'bg-rose-100/90 text-rose-800 border border-rose-200'
                  : 'bg-amber-100/90 text-amber-800 border border-amber-200'
              }`}
            >
              -{flag.penalty} pts: {flag.title}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
