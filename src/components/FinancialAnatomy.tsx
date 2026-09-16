import React, { useState } from 'react';
import { LoanInputs, AuditResults } from '../types';
import { formatINR, getBreakdownRows } from '../utils/auditCalculator';
import {
  HelpCircle,
  Lightbulb,
  Table as TableIcon,
  Calculator,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  TrendingDown
} from 'lucide-react';

interface FinancialAnatomyProps {
  inputs: LoanInputs;
  results: AuditResults;
}

export const FinancialAnatomy: React.FC<FinancialAnatomyProps> = ({ inputs, results }) => {
  const [showFormulaDetails, setShowFormulaDetails] = useState(false);
  const rows = getBreakdownRows(inputs, results);

  const {
    netDisbursed,
    totalRepayment,
    totalFinanceCost,
    trueApr,
    advertisedSimpleAnnualRate
  } = results;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-indigo-50 text-indigo-700 rounded-lg">
            <TableIcon className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Financial Anatomy of the Offer
            </h3>
            <p className="text-2xs text-slate-500">
              Itemized ledger of sanctioned principal vs deductions vs final outflow
            </p>
          </div>
        </div>
        <span className="text-2xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
          RBI Disbursal Math
        </span>
      </div>

      {/* Ledger Table matching pandas DataFrame */}
      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-700 font-bold uppercase text-2xs tracking-wider">
              <th className="py-3 px-4">Component</th>
              <th className="py-3 px-4 text-right">Amount (₹)</th>
              <th className="py-3 px-4 text-right">% of Sanction</th>
              <th className="py-3 px-4 hidden sm:table-cell">Classification</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-800">
            {rows.map((row, index) => {
              const isNegative = row.amount < 0;
              const isHighlight = row.type === 'net' || row.type === 'repayment';

              return (
                <tr
                  key={index}
                  className={`hover:bg-slate-50/70 transition-colors ${
                    isHighlight ? 'font-semibold bg-slate-50/40' : ''
                  }`}
                >
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-900">{row.component}</div>
                    <div className="text-2xs text-slate-500 hidden sm:block">
                      {row.description}
                    </div>
                  </td>
                  <td className={`py-3 px-4 text-right font-mono font-bold ${
                    isNegative
                      ? 'text-rose-600'
                      : row.type === 'net'
                      ? 'text-emerald-700'
                      : row.type === 'repayment'
                      ? 'text-slate-900'
                      : 'text-slate-700'
                  }`}>
                    {row.amount < 0 ? `- ₹${Math.abs(row.amount).toLocaleString('en-IN')}` : `₹${row.amount.toLocaleString('en-IN')}`}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-slate-600">
                    {row.percentageOfPrincipal.toFixed(1)}%
                  </td>
                  <td className="py-3 px-4 hidden sm:table-cell">
                    <span className={`inline-block px-2 py-0.5 rounded text-2xs font-bold uppercase tracking-wider ${
                      row.type === 'principal'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : row.type === 'deduction'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : row.type === 'net'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : row.type === 'interest'
                        ? 'bg-amber-50 text-amber-800 border border-amber-200'
                        : 'bg-slate-100 text-slate-800 border border-slate-200'
                    }`}>
                      {row.type}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Visual Cash Flow Bar */}
      <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2">
        <div className="flex justify-between text-2xs font-bold text-slate-700">
          <span>Sanctioned Capital Allocation</span>
          <span>Liquid vs Deducted</span>
        </div>
        <div className="h-4 bg-slate-200 rounded-lg overflow-hidden flex">
          <div
            className="h-full bg-emerald-600 flex items-center justify-center text-white text-2xs font-bold"
            style={{ width: `${Math.max(5, (netDisbursed / inputs.principal) * 100)}%` }}
            title={`Net Cash in Hand: ${formatINR(netDisbursed)}`}
          >
            {((netDisbursed / inputs.principal) * 100).toFixed(0)}% Received
          </div>
          <div
            className="h-full bg-rose-500 flex items-center justify-center text-white text-2xs font-bold"
            style={{ width: `${Math.max(5, (results.totalUpfrontDeducted / inputs.principal) * 100)}%` }}
            title={`Upfront Deductions: ${formatINR(results.totalUpfrontDeducted)}`}
          >
            {((results.totalUpfrontDeducted / inputs.principal) * 100).toFixed(0)}% Fees
          </div>
        </div>
      </div>

      {/* The Math Scam Callout Card */}
      <div className="bg-blue-50/80 border border-blue-200 rounded-xl p-4 sm:p-5 text-blue-950 space-y-2.5">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-100 text-blue-800 rounded-lg shrink-0 mt-0.5">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-blue-900 flex items-center gap-1.5">
              <span>The Math Behind the High Rate</span>
            </h4>
            <p className="text-xs text-blue-900/90 leading-relaxed">
              Even though the advertised fee is only <span className="font-bold">₹{inputs.dailyRate.toFixed(0)}/day</span>,
              because you only receive <span className="font-bold">{formatINR(netDisbursed)}</span> and pay back{' '}
              <span className="font-bold">{formatINR(totalRepayment)}</span> in just{' '}
              <span className="font-bold">{inputs.tenureDays} days</span>, your true annualized interest rate jumps to{' '}
              <span className="font-bold underline text-rose-700 bg-rose-50 px-1 rounded">{trueApr.toFixed(1)}% APR</span>.
            </p>
          </div>
        </div>

        {/* Expandable RBI Formula Step-by-Step */}
        <div className="pt-2 border-t border-blue-200/60">
          <button
            type="button"
            onClick={() => setShowFormulaDetails(!showFormulaDetails)}
            className="text-2xs font-bold text-blue-800 hover:text-blue-950 flex items-center gap-1 transition-colors"
          >
            <Calculator className="w-3 h-3" />
            <span>{showFormulaDetails ? 'Hide RBI APR Formula Details' : 'View Exact RBI APR Formula & Steps'}</span>
            {showFormulaDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          {showFormulaDetails && (
            <div className="mt-3 p-3 bg-white rounded-lg border border-blue-200 text-2xs space-y-2 text-slate-800 font-mono">
              <div className="font-bold text-indigo-900 font-sans text-xs">
                RBI Digital Lending Guidelines Mandated Formula:
              </div>
              <div className="p-2 bg-slate-50 rounded border border-slate-200 overflow-x-auto text-slate-900 font-semibold">
                True APR = (Total Finance Cost ÷ Net Disbursed) × (365 ÷ Tenure in Days) × 100
              </div>
              <div className="space-y-1 text-slate-700 pt-1">
                <div>1. Total Finance Cost = Total Repayment ({formatINR(totalRepayment)}) - Net Disbursed ({formatINR(netDisbursed)}) = <span className="font-bold text-slate-900">{formatINR(totalFinanceCost)}</span></div>
                <div>2. Periodic Rate = {formatINR(totalFinanceCost)} ÷ {formatINR(netDisbursed)} = <span className="font-bold text-slate-900">{((totalFinanceCost / netDisbursed) * 100).toFixed(2)}%</span> for {inputs.tenureDays} days</div>
                <div>3. Annualization Factor = 365 ÷ {inputs.tenureDays} = <span className="font-bold text-slate-900">{(365 / inputs.tenureDays).toFixed(2)} cycles/year</span></div>
                <div>4. Result = {((totalFinanceCost / netDisbursed) * 100).toFixed(2)}% × {(365 / inputs.tenureDays).toFixed(2)} = <span className="font-bold text-rose-700">{trueApr.toFixed(2)}% APR</span></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
