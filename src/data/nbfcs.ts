import { LoanPreset } from '../types';

export const VERIFIED_NBFCS: { name: string; brand: string; license: string }[] = [
  { name: "BAJAJ FINANCE LIMITED", brand: "Bajaj Finserv", license: "NBFC-Investment and Credit Company (NBFC-ICC)" },
  { name: "KREDITBEE (KRAZYBEE SERVICES PVT LTD)", brand: "KreditBee", license: "NBFC-ND-SI / RBI Reg: B-07.00806" },
  { name: "MUTHOOT FINANCE LIMITED", brand: "Muthoot Finance", license: "NBFC-Deposit Taking" },
  { name: "TATA CAPITAL FINANCIAL SERVICES", brand: "Tata Capital", license: "NBFC-ICC" },
  { name: "POONAWALLA FINCORP", brand: "Poonawalla Fincorp", license: "NBFC-ND-SI" },
  { name: "DMI FINANCE", brand: "DMI Finance", license: "NBFC-ND-SI (Lending partner for Google Pay, etc.)" },
  { name: "IDFC FIRST BHARAT LTD", brand: "IDFC First Bharat", license: "Wholly owned subsidiary of IDFC FIRST Bank" },
  { name: "ADITYA BIRLA FINANCE LIMITED", brand: "Aditya Birla Capital", license: "NBFC-ICC" },
  { name: "L&T FINANCE HOLDINGS LIMITED", brand: "L&T Finance", license: "NBFC-ICC" },
  { name: "HERO FINCORP LIMITED", brand: "Hero Fincorp", license: "NBFC-ICC" },
  { name: "SICREVA CAPITAL SERVICES PVT LTD (KISHT)", brand: "Kisht", license: "NBFC-ND-NSI" },
  { name: "PAYU FINANCE INDIA PRIVATE LIMITED", brand: "LazyPay", license: "NBFC-ND-SI" },
  { name: "EARLYSALARY SERVICES PRIVATE LIMITED (FIBE)", brand: "Fibe", license: "NBFC-ND-NSI" },
  { name: "INVICTA MEDIATEK PRIVATE LIMITED (MONEYVIEW)", brand: "MoneyView (Partner NBFCs: Whizdm/DMI)", license: "NBFC Registered Partner" }
];

export const LOAN_PRESETS: LoanPreset[] = [
  {
    id: "predatory-7-day",
    label: "⚠️ Predatory 7-Day Fast Loan",
    badge: "Predatory Trap",
    badgeType: "danger",
    description: "Classic Chinese instant lending app scam: 7-day tenure, ₹1,200 upfront fee on ₹5,000, high daily interest, and illegal contacts permission harvesting.",
    inputs: {
      principal: 5000,
      tenureDays: 7,
      dailyRate: 30.0,
      upfrontFee: 1200,
      appContacts: true,
      kfsProvided: false,
      coolingOff: false,
      lenderName: "FastRupee Cash Loan (Unknown)"
    }
  },
  {
    id: "legitimate-nbfc",
    label: "✅ Legitimate NBFC Micro-Loan",
    badge: "RBI Compliant",
    badgeType: "success",
    description: "A compliant digital personal loan from an RBI-registered NBFC with 90-day tenure, fair processing fee, zero contact harvesting, and upfront KFS.",
    inputs: {
      principal: 25000,
      tenureDays: 90,
      dailyRate: 10.0,
      upfrontFee: 500,
      appContacts: false,
      kfsProvided: true,
      coolingOff: true,
      lenderName: "KREDITBEE (KRAZYBEE SERVICES PVT LTD)"
    }
  },
  {
    id: "salary-advance-14-day",
    label: "⚠️ Sneaky 14-Day Payday Advance",
    badge: "High Hidden APR",
    badgeType: "warning",
    description: "Advertised as 'cheap short-term cash', but ₹1,500 fee on ₹10,000 for 14 days causes true APR to surge past 380%.",
    inputs: {
      principal: 10000,
      tenureDays: 14,
      dailyRate: 25.0,
      upfrontFee: 1500,
      appContacts: false,
      kfsProvided: true,
      coolingOff: false,
      lenderName: "QuickSalary Cash Advance"
    }
  },
  {
    id: "custom",
    label: "Custom Input",
    badge: "Manual Input",
    badgeType: "neutral",
    description: "Audit any custom loan offer from an SMS, WhatsApp promotion, or mobile loan app.",
    inputs: {
      principal: 10000,
      tenureDays: 30,
      dailyRate: 20.0,
      upfrontFee: 800,
      appContacts: false,
      kfsProvided: true,
      coolingOff: true,
      lenderName: ""
    }
  }
];
