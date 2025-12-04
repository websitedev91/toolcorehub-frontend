// lib/loanCalculator.ts

export type PaymentFrequency = "monthly" | "quarterly" | "yearly";

export interface PrepaymentInput {
  principal: number;        // Loan Amount
  annualRate: number;       // Interest rate (%)
  years: number;            // Loan term in years
  extraPayment: number;     // Extra payment amount
  frequency: PaymentFrequency;
}

export interface LoanScenario {
  totalInterest: number;
  totalMonths: number;
  totalPaid: number;
}

export interface PrepaymentResult {
  normal: LoanScenario;
  prepay: LoanScenario;
  savingsAmount: number;
  reductionInterestPercent: number;
  reductionPaymentsPercent: number;
  monthsSaved: number;
  savedYears: number;
  savedYearsPercent: number;
  finalMonthlyPayment: number; // Regular EMI with no prepayment
}

/**
 * Standard EMI calculation
 */
const calculateEmi = (
  principal: number,
  annualRate: number,
  totalMonths: number
): number => {
  if (principal <= 0 || totalMonths <= 0) return 0;

  const monthlyRate = annualRate / 12 / 100;

  if (monthlyRate === 0) {
    return principal / totalMonths;
  }

  const factor = Math.pow(1 + monthlyRate, totalMonths);
  return (principal * monthlyRate * factor) / (factor - 1);
};

/**
 * Normal loan schedule (no prepayments)
 */
const simulateNormalLoan = (
  principal: number,
  annualRate: number,
  years: number
): LoanScenario => {
  let totalMonths = Math.max(Math.round(years * 12), 1);
  const emi = calculateEmi(principal, annualRate, totalMonths);

  if (principal <= 0 || emi <= 0) {
    return { totalInterest: 0, totalMonths: 0, totalPaid: 0 };
  }

  const monthlyRate = annualRate / 12 / 100;
  let remaining = principal;
  let monthCount = 0;
  let totalInterest = 0;
  let totalPaid = 0;

  // Handle zero interest specially
  if (monthlyRate === 0) {
    const principalPerMonth = principal / totalMonths;
    while (remaining > 1e-6 && monthCount < totalMonths + 10) {
      monthCount += 1;
      const payment = Math.min(principalPerMonth, remaining);
      remaining -= payment;
      totalPaid += payment;
    }
    return { totalInterest: 0, totalMonths: monthCount, totalPaid };
  }

  while (remaining > 1e-6 && monthCount < totalMonths + 600) {
    monthCount += 1;

    const interestForMonth = remaining * monthlyRate;
    let paymentThisMonth = emi;
    let principalPayment = paymentThisMonth - interestForMonth;

    if (principalPayment <= 0) {
      principalPayment = remaining;
      paymentThisMonth = interestForMonth + principalPayment;
    }

    if (principalPayment > remaining) {
      principalPayment = remaining;
      paymentThisMonth = interestForMonth + principalPayment;
    }

    remaining -= principalPayment;
    totalInterest += interestForMonth;
    totalPaid += paymentThisMonth;
  }

  return { totalInterest, totalMonths: monthCount, totalPaid };
};

/**
 * Loan schedule with regular extra payments at the given frequency.
 * Logic matches the Finaid Prepayment Calculator behaviour:
 *  - EMI is calculated from original principal / rate / term
 *  - Extra payment is added on top of EMI whenever frequency hits
 *  - We stop when principal reaches 0 (tenure is reduced)
 */
const simulatePrepaymentLoan = (input: PrepaymentInput): LoanScenario => {
  const { principal, annualRate, years, extraPayment, frequency } = input;

  let totalMonths = Math.max(Math.round(years * 12), 1);
  const emi = calculateEmi(principal, annualRate, totalMonths);

  if (principal <= 0 || emi <= 0) {
    return { totalInterest: 0, totalMonths: 0, totalPaid: 0 };
  }

  const monthlyRate = annualRate / 12 / 100;
  const freqMonths =
    frequency === "monthly" ? 1 : frequency === "quarterly" ? 3 : 12;

  let remaining = principal;
  let monthCount = 0;
  let totalInterest = 0;
  let totalPaid = 0;

  // Zero-interest case with prepayments
  if (monthlyRate === 0) {
    const basePrincipal = principal / totalMonths;
    while (remaining > 1e-6 && monthCount < totalMonths + 600) {
      monthCount += 1;
      let payment = basePrincipal;
      if (monthCount % freqMonths === 0) {
        payment += extraPayment;
      }
      if (payment > remaining) {
        payment = remaining;
      }
      remaining -= payment;
      totalPaid += payment;
    }
    return { totalInterest: 0, totalMonths: monthCount, totalPaid };
  }

  while (remaining > 1e-6 && monthCount < totalMonths + 600) {
    monthCount += 1;

    const interestForMonth = remaining * monthlyRate;
    let paymentThisMonth = emi;

    // Add extra payment at chosen frequency
    if (monthCount % freqMonths === 0 && extraPayment > 0) {
      paymentThisMonth += extraPayment;
    }

    let principalPayment = paymentThisMonth - interestForMonth;

    if (principalPayment <= 0) {
      principalPayment = remaining;
      paymentThisMonth = interestForMonth + principalPayment;
    }

    if (principalPayment > remaining) {
      principalPayment = remaining;
      paymentThisMonth = interestForMonth + principalPayment;
    }

    remaining -= principalPayment;
    totalInterest += interestForMonth;
    totalPaid += paymentThisMonth;
  }

  return { totalInterest, totalMonths: monthCount, totalPaid };
};

/**
 * Main function used by the UI
 */
export const calculatePrepaymentSavings = (
  input: PrepaymentInput
): PrepaymentResult => {
  const totalMonths = Math.max(Math.round(input.years * 12), 1);
  const emi = calculateEmi(input.principal, input.annualRate, totalMonths);

  const normal = simulateNormalLoan(
    input.principal,
    input.annualRate,
    input.years
  );

  const prepay = simulatePrepaymentLoan(input);

  const savingsAmount = Math.max(
    0,
    normal.totalInterest - prepay.totalInterest
  );

  const reductionInterestPercent =
    normal.totalInterest > 0
      ? Math.max(
          0,
          (savingsAmount / normal.totalInterest) * 100
        )
      : 0;

  const monthsSaved = Math.max(0, normal.totalMonths - prepay.totalMonths);

  const reductionPaymentsPercent =
    normal.totalMonths > 0
      ? Math.max(0, (monthsSaved / normal.totalMonths) * 100)
      : 0;

  const savedYears = monthsSaved / 12;
  const savedYearsPercent =
    normal.totalMonths > 0
      ? Math.max(0, (monthsSaved / normal.totalMonths) * 100)
      : 0;

  return {
    normal,
    prepay,
    savingsAmount,
    reductionInterestPercent,
    reductionPaymentsPercent,
    monthsSaved,
    savedYears,
    savedYearsPercent,
    finalMonthlyPayment: emi,
  };
};
