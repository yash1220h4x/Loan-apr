import { LoanInputs, AuditResults, RiskFlag, ComplianceCheck, BreakdownRow } from '../types';
import { VERIFIED_NBFCS } from '../data/nbfcs';

export function formatINR(amount: number, includeDecimals = false): string {
  if (isNaN(amount) || !isFinite(amount)) return '₹0';
  const rounded = includeDecimals ? amount.toFixed(2) : Math.round(amount).toString();
  const parts = rounded.split('.');
  let integerPart = parts[0];
  const decimalPart = parts.length > 1 ? '.' + parts[1] : '';

  // Indian number format (last 3 digits, then groups of 2)
  const isNegative = integerPart.startsWith('-');
  if (isNegative) integerPart = integerPart.slice(1);

  let lastThree = integerPart.slice(-3);
  const otherNumbers = integerPart.slice(0, -3);
  if (otherNumbers !== '') {
    lastThree = ',' + lastThree;
  }
  const res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;
  return `${isNegative ? '-' : ''}₹${res}${decimalPart}`;
}

export function calculateAudit(inputs: LoanInputs): AuditResults {
  const principal = inputs.principal;
  const tenureDays = Math.max(1, inputs.tenureDays);
  const upfrontFee = inputs.upfrontFee;
  const gstOnFee = upfrontFee * (inputs.gstRate || 0.18);
  const totalUpfrontDeducted = upfrontFee + gstOnFee;
  const netDisbursed = principal - totalUpfrontDeducted;
  const totalInterest = inputs.dailyRate * tenureDays;
  const totalRepayment = principal + totalInterest;

  if (netDisbursed <= 0) {
    return {
      totalUpfrontDeducted,
      gstOnFee,
      netDisbursed,
      totalInterest,
      totalRepayment,
      totalFinanceCost: 0,
      trueApr: 0,
      advertisedSimpleAnnualRate: 0,
      hiddenSpread: 0,
      deductionPct: principal > 0 ? (totalUpfrontDeducted / principal) * 100 : 0,
      isVerifiedNbfc: false,
      safetyScore: 0,
      riskFlags: [
        {
          id: 'invalid-fees',
          severity: 'danger',
          title: 'Invalid Configuration / 100% Capital Theft',
          description: 'Upfront processing fees and GST equal or exceed the sanctioned principal. No funds reach the borrower.',
          rbiRule: 'RBI Digital Lending Master Directions, Clause 4.1',
          penalty: 100
        }
      ],
      complianceChecks: [],
      isInvalid: true,
      invalidReason: 'Processing fees and GST equal or exceed the sanctioned principal!'
    };
  }

  // Total Finance Cost = Total paid back - Net cash actually received in account
  const totalFinanceCost = totalRepayment - netDisbursed;

  // Nominal Annualized Percentage Rate (APR) based on net disbursement
  const trueApr = (totalFinanceCost / netDisbursed) * (365 / tenureDays) * 100;

  // Calculate Advertised Nominal Rate for comparison
  const advertisedSimpleAnnualRate = (totalInterest / principal) * (365 / tenureDays) * 100;
  const hiddenSpread = trueApr - advertisedSimpleAnnualRate;
  const deductionPct = (totalUpfrontDeducted / principal) * 100;

  // RBI NBFC Check
  const lenderClean = (inputs.lenderName || '').trim().toLowerCase();
  let matchedNbfcName: string | undefined = undefined;
  const isVerifiedNbfc = lenderClean.length > 0 && VERIFIED_NBFCS.some(item => {
    const isMatch = item.name.toLowerCase().includes(lenderClean) ||
                    item.brand.toLowerCase().includes(lenderClean) ||
                    lenderClean.includes(item.brand.toLowerCase()) ||
                    lenderClean.includes(item.name.toLowerCase());
    if (isMatch) matchedNbfcName = item.name;
    return isMatch;
  });

  const riskFlags: RiskFlag[] = [];
  let scorePenalty = 0;

  // 1. APR Check
  if (trueApr > 50) {
    riskFlags.push({
      id: 'predatory-apr',
      severity: 'danger',
      title: 'Predatory Interest Rate',
      description: `Effective APR is ${trueApr.toFixed(1)}%, which is exorbitant and typical of unauthorized high-risk payday schemes.`,
      rbiRule: 'RBI Fair Practices Code (FPC) Section 2(vi) - Excessive Rate of Interest Guidelines',
      penalty: 40
    });
    scorePenalty += 40;
  } else if (trueApr > 36) {
    riskFlags.push({
      id: 'high-apr',
      severity: 'warning',
      title: 'High APR',
      description: `Effective APR is ${trueApr.toFixed(1)}%, noticeably above standard commercial personal credit (12%-28%).`,
      rbiRule: 'RBI Ceiling Advisory & Risk-based pricing benchmark',
      penalty: 20
    });
    scorePenalty += 20;
  }

  // 2. Short Tenure / Roll-over trap
  if (tenureDays < 15) {
    riskFlags.push({
      id: 'debt-trap-window',
      severity: 'danger',
      title: 'Severe Debt Trap Window',
      description: `Loan tenure is only ${tenureDays} days. A tenure under 15 days is a primary hallmark of predatory flash lending schemes designed to force refinancing rollovers.`,
      rbiRule: 'RBI Digital Lending Circular Sep 2022 - Minimum Reasonable Tenure Requirement',
      penalty: 30
    });
    scorePenalty += 30;
  }

  // 3. Excessive Upfront Deductions
  if (totalUpfrontDeducted > 0.10 * principal) {
    riskFlags.push({
      id: 'excessive-deduction',
      severity: 'warning',
      title: 'Excessive Upfront Deductions',
      description: `You lose ${deductionPct.toFixed(1)}% of your sanctioned amount before it even hits your bank account.`,
      rbiRule: 'RBI Guidelines on All-Inclusive Annual Cost & Net Disbursement Transparency',
      penalty: 20
    });
    scorePenalty += 20;
  }

  // 4. Contacts / Device Storage Harvesting
  if (inputs.appContacts) {
    riskFlags.push({
      id: 'contacts-violation',
      severity: 'danger',
      title: 'Gross RBI Regulatory Violation',
      description: 'The app demands access to Contact Book, Media, or Storage. RBI strictly bans apps from accessing smartphone media, contact lists, and device storage.',
      rbiRule: 'RBI/2022-23/111 DOR.CRE.REC.66/21.07.001/2022-23 Clause 4.2 - Restrictions on DLAs Storage and Access',
      penalty: 50
    });
    scorePenalty += 50;
  }

  // 5. Missing Key Fact Statement (KFS)
  if (!inputs.kfsProvided) {
    riskFlags.push({
      id: 'kfs-breach',
      severity: 'warning',
      title: 'Transparency Breach (No KFS)',
      description: 'No standardized Key Fact Statement (KFS) was provided prior to agreement execution. RBI mandates KFS for all retail digital loans.',
      rbiRule: 'RBI Master Direction - Key Fact Statement (KFS) for Loans & Advances 2024',
      penalty: 20
    });
    scorePenalty += 20;
  }

  // 6. RBI Whitelist Check
  if (!isVerifiedNbfc && lenderClean !== '') {
    riskFlags.push({
      id: 'unverified-lender',
      severity: 'warning',
      title: 'Unverified Lending Entity',
      description: `"${inputs.lenderName}" was not found in our RBI-registered NBFC verification index. Unregistered entities cannot legally lend in India.`,
      rbiRule: 'Section 45-IA of Reserve Bank of India Act, 1934 - Mandatory Registration of NBFCs',
      penalty: 20
    });
    scorePenalty += 20;
  }

  const safetyScore = Math.max(0, 100 - scorePenalty);

  const complianceChecks: ComplianceCheck[] = [
    {
      id: 'kfs',
      label: 'Key Fact Statement (KFS) provided upfront',
      subtext: 'Mandated standardized format disclosing all charges and APR before signing',
      status: inputs.kfsProvided,
      rbiReference: 'RBI KFS Directions 2024'
    },
    {
      id: 'privacy',
      label: 'Zero access to Contact Book / Gallery storage',
      subtext: 'Apps are explicitly prohibited from accessing borrower phone storage or contacts',
      status: !inputs.appContacts,
      rbiReference: 'RBI DLA Data Privacy Standard'
    },
    {
      id: 'tenure',
      label: 'Tenure ≥ 15 days (Safe from roll-over traps)',
      subtext: 'Ultra-short 7-day loans are known debt-cycle traps and often fraudulent',
      status: tenureDays >= 15,
      rbiReference: 'RBI Debt Trap Prevention'
    },
    {
      id: 'cooling_off',
      label: 'Look-up / Cooling-off cancellation period offered',
      subtext: 'Borrowers must be given an exit window without penalty to exit if unsatisfied',
      status: inputs.coolingOff,
      rbiReference: 'RBI Digital Lending Clause 5.1'
    },
    {
      id: 'nbfc_verify',
      label: 'Partner NBFC verified on RBI database',
      subtext: 'Lender must hold a valid RBI NBFC certificate or partner with a registered bank',
      status: isVerifiedNbfc,
      rbiReference: 'RBI Act 1934 Sec 45-IA'
    }
  ];

  return {
    totalUpfrontDeducted,
    gstOnFee,
    netDisbursed,
    totalInterest,
    totalRepayment,
    totalFinanceCost,
    trueApr,
    advertisedSimpleAnnualRate,
    hiddenSpread,
    deductionPct,
    isVerifiedNbfc,
    verifiedNbfcMatch: matchedNbfcName,
    safetyScore,
    riskFlags,
    complianceChecks,
    isInvalid: false
  };
}

export function getBreakdownRows(inputs: LoanInputs, results: AuditResults): BreakdownRow[] {
  const p = inputs.principal;
  return [
    {
      component: 'Sanctioned Principal',
      amount: p,
      percentageOfPrincipal: 100,
      type: 'principal',
      description: 'The nominal loan amount shown in the offer or sanction letter.'
    },
    {
      component: 'Upfront Processing Fee',
      amount: -inputs.upfrontFee,
      percentageOfPrincipal: p > 0 ? (inputs.upfrontFee / p) * 100 : 0,
      type: 'deduction',
      description: 'Platform charge deducted directly from sanction before transfer.'
    },
    {
      component: 'GST on Fee (18%)',
      amount: -results.gstOnFee,
      percentageOfPrincipal: p > 0 ? (results.gstOnFee / p) * 100 : 0,
      type: 'deduction',
      description: 'Statutory Goods & Services Tax levied on the processing service charge.'
    },
    {
      component: 'Actual Cash Disbursed (In-Hand)',
      amount: results.netDisbursed,
      percentageOfPrincipal: p > 0 ? (results.netDisbursed / p) * 100 : 0,
      type: 'net',
      description: 'The actual liquid money deposited into your verified bank account.'
    },
    {
      component: `Interest & Daily Fees (${inputs.tenureDays} days @ ₹${inputs.dailyRate}/day)`,
      amount: results.totalInterest,
      percentageOfPrincipal: p > 0 ? (results.totalInterest / p) * 100 : 0,
      type: 'interest',
      description: 'Cumulative daily flat fee accumulated over the active tenure period.'
    },
    {
      component: 'Total Repayment Amount',
      amount: results.totalRepayment,
      percentageOfPrincipal: p > 0 ? (results.totalRepayment / p) * 100 : 0,
      type: 'repayment',
      description: 'The full amount you must repay to the lender by the due date.'
    }
  ];
}

export function generateTextReport(inputs: LoanInputs, results: AuditResults): string {
  const flagLines = results.riskFlags.length > 0
    ? results.riskFlags.map(f => `- [${f.severity.toUpperCase()}] ${f.title}: ${f.description}`).join('\n')
    : '- No major red flags detected. The loan terms adhere to standard retail credit baselines.';

  return `LOANSHIELD AUDIT REPORT
----------------------------------
Sanctioned Amount: Rs. ${inputs.principal}
Net Cash in Hand: Rs. ${results.netDisbursed.toFixed(2)}
Total Repayment: Rs. ${results.totalRepayment.toFixed(2)}
Advertised Rate: ${results.advertisedSimpleAnnualRate.toFixed(2)}%
Calculated True APR: ${results.trueApr.toFixed(2)}%
Safety Score: ${results.safetyScore}/100

Identified Violations:
${flagLines}

Compliance Status:
${results.complianceChecks.map(c => `- ${c.status ? '[COMPLIANT]' : '[VIOLATION]'} ${c.label}`).join('\n')}

Generated by LoanShield | Digital Lending Auditor
Cross-checking against Reserve Bank of India (RBI) consumer protection mandates.
Date: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
`;
}
