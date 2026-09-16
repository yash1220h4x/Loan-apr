export interface LoanInputs {
  presetName: string;
  principal: number;
  tenureDays: number;
  dailyRate: number;
  upfrontFee: number;
  gstRate: number; // default 0.18
  appContacts: boolean;
  kfsProvided: boolean;
  coolingOff: boolean;
  lenderName: string;
}

export interface BreakdownRow {
  component: string;
  amount: number;
  percentageOfPrincipal: number;
  type: 'principal' | 'deduction' | 'net' | 'interest' | 'repayment';
  description: string;
}

export interface ComplianceCheck {
  id: string;
  label: string;
  subtext: string;
  status: boolean;
  rbiReference: string;
}

export interface RiskFlag {
  id: string;
  severity: 'danger' | 'warning';
  title: string;
  description: string;
  rbiRule: string;
  penalty: number;
}

export interface AuditResults {
  totalUpfrontDeducted: number;
  gstOnFee: number;
  netDisbursed: number;
  totalInterest: number;
  totalRepayment: number;
  totalFinanceCost: number;
  trueApr: number;
  advertisedSimpleAnnualRate: number;
  hiddenSpread: number;
  deductionPct: number;
  isVerifiedNbfc: boolean;
  verifiedNbfcMatch?: string;
  safetyScore: number;
  riskFlags: RiskFlag[];
  complianceChecks: ComplianceCheck[];
  isInvalid: boolean;
  invalidReason?: string;
}

export interface LoanPreset {
  id: string;
  label: string;
  badge: string;
  badgeType: 'danger' | 'success' | 'warning' | 'neutral';
  description: string;
  inputs: Omit<LoanInputs, 'presetName' | 'gstRate'>;
}
