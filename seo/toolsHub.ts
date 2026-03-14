// seo/toolsHub.ts

export type ToolFaqItem = {
  question: string;
  answer: string;
};

export type ToolSeoConfig = {
  slug: string;
  path: string;
  name: string;
  metaTitle: string;
  metaDescription: string; 
  faq: ToolFaqItem[];
};

const baseUrl = "https://toolcorehub.com";

export const toolsSeo: Record<string, ToolSeoConfig> = {
  "remove-empty-lines": {
    slug: "remove-empty-lines",
    path: "/tools/remove-empty-lines",
    name: "Remove Empty Lines",
    metaTitle: "Remove Empty Lines tool for clean text | Toolcorehub",
    metaDescription:
      "Use this Remove Empty Lines tool to delete blank lines, clean messy text, and copy a tidy version ready for your editor or CMS.",
    
    
    faq: [
      {
        question:
          "Does this Remove Empty Lines tool change my text content?",
        answer:
          "No. It only removes empty or whitespace only lines and trims spaces at the start and end of each line. Your actual words stay the same.",
      },
      {
        question: "Is this Remove Empty Lines tool safe for large text blocks?",
        answer:
          "Yes. It runs in your browser and can comfortably handle long plain text, logs, and copied content. For extremely huge files, you can download the cleaned text and continue in a desktop editor.",
      },
    ],
  },

  "freelance-hourly-rate-calculator": {
    slug: "freelance-hourly-rate-calculator",
    path: "/tools/freelance-hourly-rate-calculator",
    name: "Freelance Hourly Rate Calculator",
    metaTitle: "Freelance Hourly Rate Calculator Based on Expenses | Toolcorehub",
    metaDescription:
      "Calculate your freelance hourly rate based on desired income, monthly expenses, billable hours, tax rate, and vacation time. Get minimum, comfortable, and premium rate tiers instantly.",
    faq: [
      {
        question: "How do I calculate my minimum freelance hourly rate?",
        answer:
          "Add your desired annual income to your total yearly business expenses, then divide by (1 minus your tax rate) to find your required gross income. Divide that gross income by your total billable hours per year to get your break-even minimum hourly rate.",
      },
      {
        question:
          "What is the difference between the minimum, comfortable, and premium freelance rates?",
        answer:
          "The minimum rate is the floor that covers income, expenses, and taxes with no buffer. The comfortable rate adds a 25% margin to handle slow periods and reinvestment. The premium rate adds 50%, positioning you as a specialist and creating financial headroom.",
      },
      {
        question: "Should I include taxes in my freelance rate calculation?",
        answer:
          "Yes. Freelancers pay their own taxes including self-employment contributions. The calculator grosses up your target income using your declared tax rate so that after paying taxes you retain your desired take-home income.",
      },
      {
        question:
          "How many billable hours can a freelancer realistically work per year?",
        answer:
          "A freelancer billing 25 hours per week with 2 weeks vacation has roughly 1,250 billable hours per year. Non-billable time for admin, proposals, and communication typically reduces effective billable capacity by 20–40% compared to total working hours.",
      },
      {
        question: "Why do non-billable hours matter when setting a freelance rate?",
        answer:
          "Non-billable hours consume your working day without generating direct revenue. Tracking them reveals your true effective rate and signals whether you need to raise prices, reduce scope creep, or delegate administrative tasks.",
      },
    ],
  },

  "mortgage-amortization-schedule-generator": {
    slug: "mortgage-amortization-schedule-generator",
    path: "/tools/mortgage-amortization-schedule-generator",
    name: "Mortgage Amortization Schedule Generator",
    metaTitle: "Mortgage Amortization Schedule Generator | Toolcorehub",
    metaDescription:
      "Generate a full mortgage amortization schedule with monthly payments, interest breakdown, and payoff date. Export to PDF or Excel. Free, instant, no signup needed.",
    faq: [
      {
        question: "What is a mortgage amortization schedule?",
        answer:
          "A mortgage amortization schedule is a complete table of every monthly payment over the life of a loan. Each row shows how much of the payment goes toward principal, how much toward interest, and the remaining balance after that payment.",
      },
      {
        question: "How is the monthly mortgage payment calculated?",
        answer:
          "The monthly payment uses the formula: P × [r(1+r)^n] / [(1+r)^n − 1], where P is the loan amount, r is the monthly interest rate (annual rate divided by 12), and n is the total number of payments (loan term in months).",
      },
      {
        question: "How do extra monthly payments affect my mortgage?",
        answer:
          "Extra payments reduce your outstanding principal faster, which means less interest accrues each month. This shortens your loan term and can save you tens of thousands of dollars in total interest, depending on how much extra you pay and how early you start.",
      },
      {
        question: "Can I download the amortization schedule?",
        answer:
          "Yes. Use the Download PDF button to save a formatted amortization report, or Download Excel to get a spreadsheet with a summary tab and full amortization table. You can also use the Print button for a print-optimised layout.",
      },
      {
        question: "Why does so much of my early payment go toward interest?",
        answer:
          "In the early months, your outstanding balance is highest, so more interest accrues. As you pay down the principal, the interest portion of each payment shrinks and the principal portion grows — this is what amortization means.",
      },
    ],
  },

  // add more tools here later...
};

export function getToolSeo(slug: string): ToolSeoConfig {
  const config = toolsSeo[slug];
  if (!config) {
    throw new Error(`No SEO config found for tool: ${slug}`);
  }
  return config;
}

export function getToolFullUrl(slug: string): string {
  const tool = getToolSeo(slug);
  return `${baseUrl}${tool.path}`;
}
