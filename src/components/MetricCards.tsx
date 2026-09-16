import React from 'react';
import { AuditResults, LoanInputs } from '../types';
import { formatINR } from '../utils/auditCalculator';
import {
  Wallet,
  ArrowUpRight,
  Percent,
  Flame,
  HelpCircle,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

interface MetricCardsProps {
  inputs: LoanInputs;
  results: AuditResults;
}

export const MetricCards: React.FC<MetricCardsProps> = ({ inputs, results }) => {
  const {
    netDisbursed,
    totalRepayment,
    totalFinanceCost,
    advertisedSimpleAnnualRate,
    trueApr,
    hiddenSpread,
    isInvalid
  } = results;

  if (isInvalid) return null;

  return (
    <div className="space-y-4">
      {/* 4 Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Cash in Hand */}
        <div
          id="metric-net-disbursed"
          className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs relative overflow-hidden flex flex-col justify-between"
        >
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                Cash in Hand (Net Disbursed)
              </span>
              <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg">
                <Wallet className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight pt-1">
              {formatINR(netDisbursed)}
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-2xs text-slate-500">
            <span>After fees & 18% GST</span>
            <span className="font-semibold text-slate-700">
              {((netDisbursed / inputs.principal) * 100).toFixed(0)}% of sanction
            </span>
          </div>
        </div>

        {/* Metric 2: Total You Repay */}
        <div
          id="metric-total-repayment"
          className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs relative overflow-hidden flex flex-col justify-between"
        >
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Total You Repay
              </span>
              <div className="p-2 bg-rose-50 text-rose-700 rounded-lg">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight pt-1">
              {formatINR(totalRepayment)}
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-2xs">
            <span className="text-slate-500">Total Credit Cost</span>
            <span className="font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
              - {formatINR(totalFinanceCost)}
            </span>
          </div>
        </div>

        {/* Metric 3: Advertised Rate */}
        <div
          id="metric-advertised-rate"
          className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs relative overflow-hidden flex flex-col justify-between"
        >
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Advertised Rate
              </span>
              <div className="p-2 bg-blue-50 text-blue-700 rounded-lg">
                <Percent className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight pt-1">
              {advertisedSimpleAnnualRate.toFixed(1)}%
              <span className="text-sm font-semibold text-slate-400 ml-1">p.a.</span>
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-2xs text-slate-500">
            <span>Nominal Interest on Sanction</span>
            <span className="font-semibold text-slate-700">Simple Annual</span>
          </div>
        </div>

        {/* Metric 4: Actual True APR */}
        <div
          id="metric-true-apr"
          className={`border rounded-2xl p-5 shadow-xs relative overflow-hidden flex flex-col justify-between transition-colors ${
            trueApr > 50
              ? 'bg-rose-50/50 border-rose-300'
              : trueApr > 36
              ? 'bg-amber-50/50 border-amber-300'
              : 'bg-white border-slate-200'
          }`}
        >
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1">
                Actual True APR
                {trueApr > 50 && <Flame className="w-3.5 h-3.5 text-rose-600 animate-pulse" />}
              </span>
              <div className={`p-2 rounded-lg ${
                trueApr > 50
                  ? 'bg-rose-100 text-rose-700'
                  : 'bg-indigo-50 text-indigo-700'
              }`}>
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className={`text-2xl sm:text-3xl font-black tracking-tight pt-1 ${
              trueApr > 50 ? 'text-rose-700' : 'text-slate-900'
            }`}>
              {trueApr.toFixed(1)}%
              <span className="text-sm font-semibold text-slate-400 ml-1">p.a.</span>
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-slate-200/60 flex items-center justify-between text-2xs">
            <span className="text-slate-600 font-medium">Hidden Spread</span>
            <span className={`font-bold px-2 py-0.5 rounded border ${
              hiddenSpread > 20
                ? 'bg-rose-100 text-rose-800 border-rose-200'
                : hiddenSpread > 0
                ? 'bg-amber-100 text-amber-800 border-amber-200'
                : 'bg-slate-100 text-slate-700 border-slate-200'
            }`}>
              +{hiddenSpread.toFixed(1)}% Spread
            </span>
          </div>
        </div>
      </div>

      {/* Visual Rate Gap Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Rate Disparity Index (RBI Benchmark vs Reality)
            </span>
          </div>
          <div className="flex items-center gap-4 text-2xs font-medium text-slate-600">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Standard Credit (12-24%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <span>Advertised ({advertisedSimpleAnnualRate.toFixed(1)}%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
              <span>True APR ({trueApr.toFixed(1)}%)</span>
            </div>
          </div>
        </div>

        {/* Multi-tier bar */}
        <div className="relative h-6 bg-slate-100 rounded-xl overflow-hidden flex">
          <div
            className="h-full bg-emerald-500 flex items-center justify-center text-white text-2xs font-bold"
            style={{ width: `${Math.min(100, Math.max(10, (24 / Math.max(trueApr, 50)) * 100))}%` }}
            title="Standard RBI personal loan benchmark: ~12-24% APR"
          >
            RBI Baseline
          </div>
          <div
            className="h-full bg-amber-400/80"
            style={{ width: `${Math.min(100, Math.max(5, ((Math.min(trueApr, 36) - 24) / Math.max(trueApr, 50)) * 100))}%` }}
            title="Warning zone (24%-36%)"
          />
          <div
            className="h-full bg-rose-500 flex items-center justify-end pr-2 text-white text-2xs font-bold"
            style={{ width: `${Math.min(100, Math.max(10, ((trueApr - 36) / Math.max(trueApr, 50)) * 100))}%` }}
            title="Predatory territory (>36%)"
          >
            {trueApr > 50 ? `${trueApr.toFixed(0)}% APR` : ''}
          </div>
        </div>
        <div className="flex justify-between text-2xs text-slate-400 mt-1 font-medium">
          <span>0%</span>
          <span>18% (Fair)</span>
          <span>36% (High)</span>
          <span>50%+ (Extortionate)</span>
        </div>
      </div>
    </div>
  );
};
