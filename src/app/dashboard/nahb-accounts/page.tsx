'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import {
  BookOpen,
  Lock,
  Copy,
  Check,
  Search,
  ChevronDown,
  ChevronRight,
  ArrowRight,
  Building2,
  HardHat,
  Landmark,
  Home,
  Shovel,
  Wrench,
  TreePine,
  Users,
} from 'lucide-react';
import Link from 'next/link';

// ─── Plan gating ───────────────────────────────────────────────
interface SubscriptionInfo {
  plan: 'basic' | 'pro' | 'enterprise';
  includesAiToolkit: boolean;
}

// ─── Account types ─────────────────────────────────────────────
interface Account {
  code: string;
  name: string;
  description?: string;
}

interface AccountSubsection {
  range: string;
  title: string;
  accounts: Account[];
}

interface AccountSection {
  range: string;
  title: string;
  icon: React.ComponentType<any>;
  color: string;
  subsections: AccountSubsection[];
}

interface TabDef {
  key: string;
  label: string;
  shortLabel: string;
  icon: React.ComponentType<any>;
  description: string;
  appendix: string;
  sections: AccountSection[];
}

// ─────────────────────────────────────────────────────────────────
// TAB 1: Full COA (Appendices A & B)
// ─────────────────────────────────────────────────────────────────
const FULL_COA_SECTIONS: AccountSection[] = [
  {
    range: '1000–1990',
    title: 'Assets',
    icon: Building2,
    color: '#22c55e',
    subsections: [
      {
        range: '1000–1090',
        title: 'Cash & Equivalents',
        accounts: [
          { code: '1010', name: 'Petty cash' },
          { code: '1020', name: 'Cash, general' },
          { code: '1030', name: 'Cash, payroll' },
          { code: '1040', name: 'Cash, savings and money market' },
        ],
      },
      {
        range: '1200–1290',
        title: 'Receivables',
        accounts: [
          { code: '1210', name: 'Accounts receivable, trade' },
          { code: '1230', name: 'Notes receivable' },
          { code: '1265', name: 'Costs in excess of billings (underbilling)', description: 'WIP asset — revenue earned but not yet billed. Debit when earned revenue exceeds billings.' },
          { code: '1280', name: 'Allowance for doubtful accounts' },
          { code: '1290', name: 'Retentions (retainage) receivable', description: 'Amount withheld by owner/GC per contract, typically 5-10%, released at substantial completion.' },
        ],
      },
      {
        range: '1300–1440',
        title: 'Inventory & Construction Costs',
        accounts: [
          { code: '1310', name: 'Construction materials inventory' },
          { code: '1330', name: 'Property held for remodeling' },
          { code: '1410', name: 'Land and land development costs', description: 'GL account for Appendix G land development cost codes.' },
          { code: '1430', name: 'Direct construction cost', description: 'GL account for Appendix E direct construction cost codes (permits, site work, structure, MEP, finishes).' },
          { code: '1440', name: 'Indirect construction cost', description: 'GL account for Appendix F indirect construction cost codes (supers, field office, equipment, warranty).' },
        ],
      },
      {
        range: '1600–1690',
        title: 'Other Current Assets',
        accounts: [
          { code: '1610', name: 'Refundable deposits' },
          { code: '1620', name: 'Prepaid expenses' },
          { code: '1630', name: 'Employee advances' },
          { code: '1650', name: 'Due from affiliates or subsidiaries' },
          { code: '1660', name: 'Due from officers, stockholders, owners, or partners' },
          { code: '1690', name: 'Other current assets' },
        ],
      },
      {
        range: '1780–1890',
        title: 'Fixed Assets',
        accounts: [
          { code: '1780', name: 'Organization cost' },
          { code: '1810', name: 'Land' },
          { code: '1820', name: 'Buildings' },
          { code: '1830', name: 'Office furniture and equipment' },
          { code: '1840', name: 'Vehicles' },
          { code: '1850', name: 'Construction equipment' },
          { code: '1880', name: 'Leasehold improvements' },
          { code: '1890', name: 'Computer equipment and software' },
        ],
      },
      {
        range: '1900–1990',
        title: 'Accumulated Depreciation',
        accounts: [
          { code: '1920', name: 'Accumulated depreciation, buildings' },
          { code: '1930', name: 'Accumulated depreciation, office furniture and equipment' },
          { code: '1940', name: 'Accumulated depreciation, vehicles' },
          { code: '1950', name: 'Accumulated depreciation, construction equipment' },
          { code: '1980', name: 'Accumulated depreciation, leasehold improvements' },
          { code: '1990', name: 'Accumulated depreciation, computer equipment and software' },
        ],
      },
    ],
  },
  {
    range: '2000–2990',
    title: 'Liabilities & Owners\' Equity',
    icon: Landmark,
    color: '#ef4444',
    subsections: [
      {
        range: '2000–2490',
        title: 'Current Liabilities',
        accounts: [
          { code: '2010', name: 'Contract deposits' },
          { code: '2110', name: 'Accounts payable, trade' },
          { code: '2120', name: 'Retentions payable', description: 'Retainage withheld from subcontractors, typically 5-10% until project completion.' },
          { code: '2200', name: 'Line of credit payable' },
          { code: '2240', name: 'Current portion of long-term debt' },
          { code: '2290', name: 'Notes payable, other' },
          { code: '2310', name: 'Social Security and Medicare' },
          { code: '2320', name: 'Federal payroll tax, withheld and accrued' },
          { code: '2330', name: 'State and local payroll tax, withheld and accrued' },
          { code: '2410', name: 'Accrued commissions payable' },
          { code: '2420', name: 'Workers\' compensation insurance payable' },
          { code: '2425', name: 'Other accrued expenses' },
          { code: '2440', name: 'Due to affiliated companies or subsidiaries' },
          { code: '2450', name: 'Due to officers, stockholders, owners, or partners' },
          { code: '2480', name: 'Billings in excess of costs (overbilling)', description: 'WIP liability — amounts billed that exceed earned revenue. Credit when billings exceed earned revenue.' },
          { code: '2490', name: 'Other current liabilities' },
        ],
      },
      {
        range: '2500–2700',
        title: 'Long-Term Liabilities',
        accounts: [
          { code: '2510', name: 'Long-term notes payable' },
          { code: '2530', name: 'Mortgage notes payable' },
          { code: '2700', name: 'Other long-term liabilities' },
        ],
      },
      {
        range: '2900–2960',
        title: 'Owners\' Equity',
        accounts: [
          { code: '2900', name: 'Common stock' },
          { code: '2920', name: 'Retained earnings' },
          { code: '2950', name: 'Partnership or proprietorship account' },
          { code: '2960', name: 'Distributions, dividends, and draws' },
        ],
      },
    ],
  },
  {
    range: '3000–3990',
    title: 'Sales, Revenue & Cost of Sales',
    icon: HardHat,
    color: '#6366f1',
    subsections: [
      {
        range: '3000–3490',
        title: 'Sales & Revenues',
        accounts: [
          { code: '3130', name: 'Sales, residential remodeling' },
          { code: '3133', name: 'Sales, commercial and industrial remodeling' },
          { code: '3135', name: 'Sales, insurance restoration' },
          { code: '3137', name: 'Sales, repairs' },
          { code: '3190', name: 'Sales, other' },
          { code: '3370', name: 'Design fees collected' },
          { code: '3400', name: 'Miscellaneous income' },
          { code: '3410', name: 'Interest income' },
          { code: '3420', name: 'Dividend income' },
          { code: '3450', name: 'Earned discounts' },
          { code: '3460', name: 'Earned rebates' },
        ],
      },
      {
        range: '3800–3899',
        title: 'Costs of Construction (COGS)',
        accounts: [
          { code: '3810', name: 'Direct labor', description: 'Wages for workers directly performing construction work on job sites.' },
          { code: '3820', name: 'Labor burden', description: 'Employer taxes, workers comp, benefits attributable to direct labor (typically 25-40% of base wages).' },
          { code: '3830', name: 'Building material', description: 'All materials installed or consumed on specific jobs.' },
          { code: '3840', name: 'Trade contractors', description: 'Subcontractor costs — largest cost category for most GCs.' },
          { code: '3850', name: 'Rental equipment', description: 'Equipment rented specifically for jobs (cranes, excavators, scaffolding).' },
          { code: '3860', name: 'Other direct construction costs' },
          { code: '3870', name: 'Professional design fees' },
        ],
      },
    ],
  },
  {
    range: '4000–4990',
    title: 'Indirect Construction Cost',
    icon: HardHat,
    color: '#f59e0b',
    subsections: [
      {
        range: '4000–4070',
        title: 'Salaries & Wages',
        accounts: [
          { code: '4010', name: 'Superintendents' },
          { code: '4020', name: 'Laborers' },
          { code: '4030', name: 'Production manager' },
          { code: '4040', name: 'Architects, drafters, estimators, purchasers' },
          { code: '4050', name: 'Warranty and customer service manager' },
          { code: '4060', name: 'Warranty and customer service wages' },
          { code: '4070', name: 'Other indirect construction wages' },
        ],
      },
      {
        range: '4100–4190',
        title: 'Payroll Taxes & Benefits',
        accounts: [
          { code: '4110', name: 'Payroll taxes' },
          { code: '4120', name: 'Workers\' compensation insurance' },
          { code: '4130', name: 'Health and accident insurance' },
          { code: '4140', name: 'Retirement, pension, profit sharing' },
          { code: '4150', name: 'Union benefits' },
          { code: '4190', name: 'Other benefits' },
        ],
      },
      {
        range: '4200–4560',
        title: 'Field Operations',
        accounts: [
          { code: '4210', name: 'Rent, field office' },
          { code: '4265', name: 'Mobile phones, pagers, radios, field office' },
          { code: '4410', name: 'Lease payments, construction vehicles' },
          { code: '4420', name: 'Mileage reimbursement' },
          { code: '4430', name: 'Repairs and maintenance, construction vehicles' },
          { code: '4510', name: 'Rent, construction equipment' },
          { code: '4530', name: 'Repairs and maintenance, construction equipment' },
          { code: '4560', name: 'Small tools and supplies' },
        ],
      },
      {
        range: '4700–4990',
        title: 'Warranty, Depreciation & Other',
        accounts: [
          { code: '4710', name: 'Salaries and wages, warranty' },
          { code: '4720', name: 'Material, warranty' },
          { code: '4730', name: 'Trade contractor, warranty' },
          { code: '4840', name: 'Depreciation, construction vehicles' },
          { code: '4850', name: 'Depreciation, construction equipment' },
          { code: '4910', name: 'Insurance and bonding expenses' },
          { code: '4920', name: 'Builder\'s risk insurance' },
          { code: '4990', name: 'Absorbed indirect costs' },
        ],
      },
    ],
  },
  {
    range: '5000–5990',
    title: 'Financing Expenses',
    icon: Landmark,
    color: '#8b5cf6',
    subsections: [
      {
        range: '5000–5090',
        title: 'Interest Expenses',
        accounts: [
          { code: '5010', name: 'Interest on line of credit' },
          { code: '5020', name: 'Interest on notes payable' },
          { code: '5090', name: 'Interest expense, other' },
        ],
      },
    ],
  },
  {
    range: '6000–6990',
    title: 'Sales & Marketing Expenses',
    icon: Building2,
    color: '#ec4899',
    subsections: [
      {
        range: '6000–6395',
        title: 'Sales & Marketing',
        accounts: [
          { code: '6030', name: 'Salaries, sales personnel' },
          { code: '6040', name: 'Sales commissions, in-house' },
          { code: '6045', name: 'Sales commissions, internet and website support' },
          { code: '6050', name: 'Sales commissions, outside' },
          { code: '6110', name: 'Payroll taxes, sales and marketing' },
          { code: '6310', name: 'Print advertising' },
          { code: '6330', name: 'Web page design and maintenance expenses' },
          { code: '6335', name: 'Internet marketing, advertising and fees' },
          { code: '6340', name: 'Brochures and catalogues' },
          { code: '6350', name: 'Signs' },
          { code: '6390', name: 'Public relations' },
          { code: '6395', name: 'Referral fees' },
        ],
      },
    ],
  },
  {
    range: '8000–8990',
    title: 'General & Administrative',
    icon: Building2,
    color: '#06b6d4',
    subsections: [
      {
        range: '8000–8280',
        title: 'Office & Personnel',
        accounts: [
          { code: '8010', name: 'Salaries, owners' },
          { code: '8050', name: 'Salaries and wages, office and clerical' },
          { code: '8110', name: 'Payroll taxes' },
          { code: '8120', name: 'Workers\' compensation insurance' },
          { code: '8130', name: 'Health and accident insurance' },
          { code: '8140', name: 'Retirement, pension, profit-sharing plans' },
          { code: '8210', name: 'Rent' },
          { code: '8250', name: 'Utilities, administrative office' },
          { code: '8260', name: 'Telephone, administrative office' },
          { code: '8270', name: 'Office supplies, administrative office' },
          { code: '8280', name: 'Postage and deliveries' },
        ],
      },
      {
        range: '8320–8590',
        title: 'Technology, Vehicles & Taxes',
        accounts: [
          { code: '8320', name: 'Leases, computer hardware' },
          { code: '8330', name: 'Leases, computer software' },
          { code: '8335', name: 'Software licensing and subscription fees' },
          { code: '8340', name: 'Network and web development expenses' },
          { code: '8350', name: 'Repairs and maintenance, computer equipment' },
          { code: '8410', name: 'Lease, administrative vehicles' },
          { code: '8460', name: 'Travel' },
          { code: '8530', name: 'Personal property taxes' },
          { code: '8540', name: 'License fees' },
          { code: '8590', name: 'Other taxes' },
        ],
      },
      {
        range: '8600–8990',
        title: 'Insurance, Professional & Other',
        accounts: [
          { code: '8610', name: 'Hazard insurance, property insurance' },
          { code: '8630', name: 'General liability insurance' },
          { code: '8690', name: 'Other insurance' },
          { code: '8710', name: 'Accounting services' },
          { code: '8720', name: 'Legal services' },
          { code: '8730', name: 'Consulting services' },
          { code: '8810', name: 'Depreciation, buildings' },
          { code: '8870', name: 'Depreciation, computer equipment and software' },
          { code: '8900', name: 'Bad debts' },
          { code: '8920', name: 'Dues and subscriptions' },
          { code: '8950', name: 'Bank charges' },
          { code: '8990', name: 'Training and education expenses' },
        ],
      },
    ],
  },
  {
    range: '9000–9990',
    title: 'Other Income & Expenses',
    icon: Landmark,
    color: '#64748b',
    subsections: [
      {
        range: '9100–9290',
        title: 'Other Income & Expenses',
        accounts: [
          { code: '9150', name: 'Gain or loss on sale of assets' },
          { code: '9190', name: 'Other income' },
          { code: '9200', name: 'Extraordinary expenses' },
        ],
      },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────
// TAB 2: Remodeler COA (Appendix D)
// ─────────────────────────────────────────────────────────────────
const REMODELER_SECTIONS: AccountSection[] = [
  {
    range: '1000–1990',
    title: 'Assets',
    icon: Building2,
    color: '#22c55e',
    subsections: [
      {
        range: '1000–1090',
        title: 'Cash',
        accounts: [
          { code: '1010', name: 'Petty cash' },
          { code: '1020', name: 'Cash, general' },
          { code: '1030', name: 'Cash, payroll' },
          { code: '1040', name: 'Cash, savings and money market' },
        ],
      },
      {
        range: '1200–1690',
        title: 'Receivables & Current Assets',
        accounts: [
          { code: '1210', name: 'Accounts receivable, trade' },
          { code: '1230', name: 'Notes receivable' },
          { code: '1280', name: 'Allowance for doubtful accounts' },
          { code: '1290', name: 'Retentions (retainage) receivable' },
          { code: '1310', name: 'Construction materials inventory' },
          { code: '1330', name: 'Property held for remodeling' },
          { code: '1610', name: 'Refundable deposits' },
          { code: '1620', name: 'Prepaid expenses' },
          { code: '1630', name: 'Employee advances' },
          { code: '1650', name: 'Due from affiliates or subsidiaries' },
          { code: '1660', name: 'Due from officers, stockholders, owners, or partners' },
          { code: '1690', name: 'Other current assets' },
        ],
      },
      {
        range: '1780–1990',
        title: 'Fixed Assets & Depreciation',
        accounts: [
          { code: '1780', name: 'Organization cost' },
          { code: '1810', name: 'Land' },
          { code: '1820', name: 'Buildings' },
          { code: '1830', name: 'Office furniture and equipment' },
          { code: '1840', name: 'Vehicles' },
          { code: '1850', name: 'Construction equipment' },
          { code: '1880', name: 'Leasehold improvements' },
          { code: '1890', name: 'Computer equipment and software' },
          { code: '1920', name: 'Accumulated depreciation, buildings' },
          { code: '1930', name: 'Accumulated depreciation, office furniture and equipment' },
          { code: '1940', name: 'Accumulated depreciation, vehicles' },
          { code: '1950', name: 'Accumulated depreciation, construction equipment' },
          { code: '1980', name: 'Accumulated depreciation, leasehold improvements' },
          { code: '1990', name: 'Accumulated depreciation, computer equipment and software' },
        ],
      },
    ],
  },
  {
    range: '2000–2990',
    title: 'Liabilities & Owners\' Equity',
    icon: Landmark,
    color: '#ef4444',
    subsections: [
      {
        range: '2000–2490',
        title: 'Current Liabilities',
        accounts: [
          { code: '2010', name: 'Contract deposits' },
          { code: '2110', name: 'Accounts payable, trade' },
          { code: '2120', name: 'Retentions payable' },
          { code: '2200', name: 'Line of credit payable' },
          { code: '2240', name: 'Current portion of long-term debt' },
          { code: '2290', name: 'Notes payable, other' },
          { code: '2310', name: 'Social Security and Medicare' },
          { code: '2320', name: 'Federal payroll tax, withheld and accrued' },
          { code: '2330', name: 'State and local payroll tax, withheld and accrued' },
          { code: '2410', name: 'Accrued commissions payable' },
          { code: '2420', name: 'Workers\' compensation insurance payable' },
          { code: '2425', name: 'Other accrued expenses' },
          { code: '2440', name: 'Due to affiliated companies or subsidiaries' },
          { code: '2450', name: 'Due to officers, stockholders, owners, or partners' },
          { code: '2480', name: 'Billings in excess of costs' },
          { code: '2490', name: 'Other current liabilities' },
        ],
      },
      {
        range: '2500–2960',
        title: 'Long-Term Liabilities & Equity',
        accounts: [
          { code: '2510', name: 'Long-term notes payable' },
          { code: '2530', name: 'Mortgage notes payable' },
          { code: '2700', name: 'Other long-term liabilities' },
          { code: '2900', name: 'Common stock' },
          { code: '2920', name: 'Retained earnings' },
          { code: '2950', name: 'Partnership or proprietorship account' },
          { code: '2960', name: 'Distributions, dividends, and draws' },
        ],
      },
    ],
  },
  {
    range: '3000–3899',
    title: 'Sales, Revenue & COGS',
    icon: HardHat,
    color: '#6366f1',
    subsections: [
      {
        range: '3100–3460',
        title: 'Revenue',
        accounts: [
          { code: '3130', name: 'Sales, residential remodeling' },
          { code: '3133', name: 'Sales, commercial and industrial remodeling' },
          { code: '3135', name: 'Sales, insurance restoration' },
          { code: '3137', name: 'Sales, repairs' },
          { code: '3190', name: 'Sales, other' },
          { code: '3370', name: 'Design fees collected' },
          { code: '3400', name: 'Miscellaneous income' },
          { code: '3410', name: 'Interest income' },
          { code: '3420', name: 'Dividend income' },
          { code: '3450', name: 'Earned discounts' },
          { code: '3460', name: 'Earned rebates' },
        ],
      },
      {
        range: '3800–3870',
        title: 'Costs of Construction',
        accounts: [
          { code: '3810', name: 'Direct labor' },
          { code: '3820', name: 'Labor burden' },
          { code: '3830', name: 'Building material' },
          { code: '3840', name: 'Trade contractors' },
          { code: '3850', name: 'Rental equipment' },
          { code: '3860', name: 'Other direct construction costs' },
          { code: '3870', name: 'Professional design fees' },
        ],
      },
    ],
  },
  {
    range: '4000–8990',
    title: 'Operating Expenses',
    icon: Building2,
    color: '#f59e0b',
    subsections: [
      {
        range: '4000–4990',
        title: 'Indirect Construction Cost',
        accounts: [
          { code: '4010', name: 'Superintendents' },
          { code: '4020', name: 'Laborers' },
          { code: '4030', name: 'Production manager' },
          { code: '4040', name: 'Architects, drafters, estimators, purchasers' },
          { code: '4110', name: 'Payroll taxes' },
          { code: '4120', name: 'Workers\' compensation insurance' },
          { code: '4130', name: 'Health and accident insurance' },
          { code: '4265', name: 'Mobile phones, pagers, radios, field office' },
          { code: '4410', name: 'Lease payments, construction vehicles' },
          { code: '4420', name: 'Mileage reimbursement' },
          { code: '4430', name: 'Repairs and maintenance, construction vehicles' },
          { code: '4440', name: 'Operating expenses, construction vehicles' },
          { code: '4450', name: 'Taxes, licenses, insurance, construction vehicles' },
          { code: '4510', name: 'Rent, construction equipment' },
          { code: '4530', name: 'Repairs and maintenance, construction equipment' },
          { code: '4560', name: 'Small tools and supplies' },
          { code: '4710', name: 'Salaries and wages, warranty' },
          { code: '4720', name: 'Material, warranty' },
          { code: '4730', name: 'Trade contractor, warranty' },
        ],
      },
      {
        range: '5000–6395',
        title: 'Financing & Sales/Marketing',
        accounts: [
          { code: '5010', name: 'Interest on line of credit' },
          { code: '5020', name: 'Interest on notes payable' },
          { code: '5090', name: 'Interest expense, other' },
          { code: '6030', name: 'Salaries, sales personnel' },
          { code: '6040', name: 'Sales commissions, in-house' },
          { code: '6050', name: 'Sales commissions, outside' },
          { code: '6310', name: 'Print advertising' },
          { code: '6330', name: 'Web page design and maintenance expenses' },
          { code: '6335', name: 'Internet marketing, advertising and fees' },
          { code: '6395', name: 'Referral fees' },
        ],
      },
      {
        range: '8000–8990',
        title: 'General & Administrative',
        accounts: [
          { code: '8010', name: 'Salaries, owners' },
          { code: '8050', name: 'Salaries and wages, office and clerical' },
          { code: '8110', name: 'Payroll taxes' },
          { code: '8210', name: 'Rent' },
          { code: '8250', name: 'Utilities, administrative office' },
          { code: '8260', name: 'Telephone, administrative office' },
          { code: '8270', name: 'Office supplies' },
          { code: '8335', name: 'Software licensing and subscription fees' },
          { code: '8610', name: 'Hazard insurance, property insurance' },
          { code: '8630', name: 'General liability insurance' },
          { code: '8710', name: 'Accounting services' },
          { code: '8720', name: 'Legal services' },
          { code: '8900', name: 'Bad debts' },
          { code: '8950', name: 'Bank charges' },
          { code: '8990', name: 'Training and education expenses' },
        ],
      },
    ],
  },
  {
    range: '9000–9290',
    title: 'Other Income & Expenses',
    icon: Landmark,
    color: '#64748b',
    subsections: [
      {
        range: '9100–9290',
        title: 'Other',
        accounts: [
          { code: '9150', name: 'Gain or loss on sale of assets' },
          { code: '9190', name: 'Other' },
          { code: '9200', name: 'Extraordinary expenses' },
        ],
      },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────
// TAB 3: Direct Construction Costs (Appendix E — GL 1430)
// ─────────────────────────────────────────────────────────────────
const DIRECT_COST_SECTIONS: AccountSection[] = [
  {
    range: '1000–1999',
    title: 'Preparation & Preliminaries',
    icon: Shovel,
    color: '#f59e0b',
    subsections: [
      {
        range: '1000–1090',
        title: 'Permits & Fees',
        accounts: [
          { code: '1010', name: 'Building permits' },
          { code: '1020', name: 'HBA assessments' },
          { code: '1030', name: 'Warranty fees' },
        ],
      },
      {
        range: '1100–1120',
        title: 'Plans & Surveys',
        accounts: [
          { code: '1110', name: 'Blueprints' },
          { code: '1120', name: 'Surveys' },
        ],
      },
      {
        range: '1200–1300',
        title: 'Site Preparation',
        accounts: [
          { code: '1210', name: 'Lot clearing' },
          { code: '1220', name: 'Fill dirt and material' },
          { code: '1300', name: 'Demolition' },
        ],
      },
      {
        range: '1400–1490',
        title: 'Utility Connections',
        accounts: [
          { code: '1400', name: 'Temporary electric' },
          { code: '1420', name: 'Individual wells' },
          { code: '1430', name: 'Water service' },
          { code: '1440', name: 'Septic system' },
          { code: '1450', name: 'Sewer system' },
          { code: '1460', name: 'Gas service' },
          { code: '1470', name: 'Electric service' },
          { code: '1480', name: 'Telephone service' },
          { code: '1490', name: 'Other utility connections' },
        ],
      },
    ],
  },
  {
    range: '2000–2999',
    title: 'Excavation & Foundation',
    icon: Shovel,
    color: '#78716c',
    subsections: [
      {
        range: '2000–2300',
        title: 'Foundation Work',
        accounts: [
          { code: '2000', name: 'Excavation and backfill' },
          { code: '2010', name: 'Plumbing — ground' },
          { code: '2100', name: 'Footings and foundation' },
          { code: '2105', name: 'Rebar and reinforcing steel' },
          { code: '2110', name: 'Concrete block' },
          { code: '2120', name: 'Rough grading' },
          { code: '2130', name: 'Window wells' },
          { code: '2200', name: 'Waterproofing' },
          { code: '2300', name: 'Termite protection' },
        ],
      },
    ],
  },
  {
    range: '3000–3999',
    title: 'Rough Structure',
    icon: HardHat,
    color: '#ea580c',
    subsections: [
      {
        range: '3100–3150',
        title: 'Structural & Lumber',
        accounts: [
          { code: '3100', name: 'Structural steel' },
          { code: '3110', name: 'Lumber — 1st package' },
          { code: '3120', name: 'Lumber — 2nd package' },
          { code: '3130', name: 'Lumber — 3rd package' },
          { code: '3140', name: 'Trusses' },
          { code: '3150', name: 'Miscellaneous lumber' },
        ],
      },
      {
        range: '3200–3410',
        title: 'Framing & Exterior',
        accounts: [
          { code: '3210', name: 'Framing labor — draw #1' },
          { code: '3220', name: 'Framing labor — draw #2' },
          { code: '3230', name: 'Framing labor — draw #3' },
          { code: '3300', name: 'Windows' },
          { code: '3350', name: 'Skylights' },
          { code: '3400', name: 'Exterior siding' },
          { code: '3410', name: 'Exterior trim labor' },
        ],
      },
      {
        range: '3500–3810',
        title: 'Flatwork & Rough-ins',
        accounts: [
          { code: '3500', name: 'Flatwork material' },
          { code: '3550', name: 'Flatwork labor' },
          { code: '3610', name: 'HVAC — rough' },
          { code: '3720', name: 'Plumbing — rough' },
          { code: '3810', name: 'Electrical — rough' },
        ],
      },
      {
        range: '3720–3720',
        title: 'Gutters',
        accounts: [
          { code: '3720', name: 'Gutters and downspouts' },
        ],
      },
    ],
  },
  {
    range: '4000–4999',
    title: 'Full Enclosure',
    icon: Home,
    color: '#2563eb',
    subsections: [
      {
        range: '4100–4600',
        title: 'Roof, Masonry & Enclosure',
        accounts: [
          { code: '4100', name: 'Roofing material' },
          { code: '4150', name: 'Roofing labor' },
          { code: '4200', name: 'Masonry material' },
          { code: '4250', name: 'Masonry labor' },
          { code: '4300', name: 'Exterior doors' },
          { code: '4350', name: 'Garage door' },
          { code: '4400', name: 'Insulation' },
          { code: '4500', name: 'Fireplaces' },
          { code: '4600', name: 'Painting — exterior' },
        ],
      },
    ],
  },
  {
    range: '5000–5999',
    title: 'Finishing Trades',
    icon: Wrench,
    color: '#7c3aed',
    subsections: [
      {
        range: '5100–5300',
        title: 'Walls, Trim & Paint',
        accounts: [
          { code: '5100', name: 'Drywall' },
          { code: '5200', name: 'Interior trim material' },
          { code: '5250', name: 'Interior trim labor' },
          { code: '5300', name: 'Painting — interior' },
        ],
      },
      {
        range: '5400–5630',
        title: 'Cabinets, Flooring & Fixtures',
        accounts: [
          { code: '5400', name: 'Cabinets and vanities' },
          { code: '5450', name: 'Countertops' },
          { code: '5510', name: 'Ceramic tile' },
          { code: '5520', name: 'Special flooring' },
          { code: '5530', name: 'Vinyl' },
          { code: '5540', name: 'Carpet' },
          { code: '5610', name: 'Hardware' },
          { code: '5620', name: 'Shower doors and mirrors' },
          { code: '5630', name: 'Appliances' },
        ],
      },
      {
        range: '5700–5890',
        title: 'MEP Finals & Finishes',
        accounts: [
          { code: '5700', name: 'HVAC — final' },
          { code: '5710', name: 'Plumbing — final' },
          { code: '5720', name: 'Electrical fixtures' },
          { code: '5730', name: 'Electrical — final' },
          { code: '5810', name: 'Wall coverings' },
          { code: '5890', name: 'Special finishes' },
        ],
      },
    ],
  },
  {
    range: '6000–6999',
    title: 'Completion & Inspection',
    icon: TreePine,
    color: '#16a34a',
    subsections: [
      {
        range: '6100–6700',
        title: 'Final Site Work',
        accounts: [
          { code: '6100', name: 'Clean-up' },
          { code: '6200', name: 'Final grade' },
          { code: '6300', name: 'Driveways' },
          { code: '6400', name: 'Patios, walks' },
          { code: '6450', name: 'Decks' },
          { code: '6490', name: 'Fences' },
          { code: '6500', name: 'Ornamental iron' },
          { code: '6600', name: 'Landscaping' },
          { code: '6700', name: 'Pools' },
        ],
      },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────
// TAB 4: Indirect Construction Costs (Appendix F — GL 1440)
// ─────────────────────────────────────────────────────────────────
const INDIRECT_COST_SECTIONS: AccountSection[] = [
  {
    range: '4000–4090',
    title: 'Salaries & Wages',
    icon: Users,
    color: '#6366f1',
    subsections: [
      {
        range: '4000–4070',
        title: 'Construction Personnel',
        accounts: [
          { code: '4010', name: 'Superintendents' },
          { code: '4020', name: 'Laborers' },
          { code: '4030', name: 'Production manager' },
          { code: '4040', name: 'Architects, drafters, estimators, purchasers' },
          { code: '4050', name: 'Warranty and customer service manager' },
          { code: '4060', name: 'Warranty and customer service wages' },
          { code: '4070', name: 'Other indirect construction wages' },
        ],
      },
    ],
  },
  {
    range: '4100–4190',
    title: 'Payroll Taxes & Benefits',
    icon: Landmark,
    color: '#ef4444',
    subsections: [
      {
        range: '4100–4190',
        title: 'Taxes & Benefits',
        accounts: [
          { code: '4110', name: 'Payroll taxes' },
          { code: '4120', name: 'Workers\' compensation insurance' },
          { code: '4130', name: 'Health and accident insurance' },
          { code: '4140', name: 'Retirement, pension, profit sharing' },
          { code: '4150', name: 'Union benefits' },
          { code: '4190', name: 'Other benefits' },
        ],
      },
    ],
  },
  {
    range: '4200–4290',
    title: 'Field Office Expenses',
    icon: Building2,
    color: '#f59e0b',
    subsections: [
      {
        range: '4200–4290',
        title: 'Field Office',
        accounts: [
          { code: '4210', name: 'Rent, field office' },
          { code: '4230', name: 'Repairs and maintenance, field office' },
          { code: '4250', name: 'Utilities, field office' },
          { code: '4260', name: 'Telephone, field office' },
          { code: '4265', name: 'Mobile phones, pagers, and radios, field office' },
          { code: '4290', name: 'Other field office expenses' },
        ],
      },
    ],
  },
  {
    range: '4300–4390',
    title: 'Field Warehouse & Storage',
    icon: Building2,
    color: '#78716c',
    subsections: [
      {
        range: '4300–4360',
        title: 'Warehouse',
        accounts: [
          { code: '4310', name: 'Rent, field warehouse and storage' },
          { code: '4330', name: 'Repairs and maintenance, field warehouse and storage' },
          { code: '4350', name: 'Utilities, field warehouse and storage' },
          { code: '4360', name: 'Telephone, field warehouse and storage' },
        ],
      },
    ],
  },
  {
    range: '4400–4490',
    title: 'Construction Vehicles, Travel & Entertainment',
    icon: HardHat,
    color: '#ea580c',
    subsections: [
      {
        range: '4400–4490',
        title: 'Vehicles & Travel',
        accounts: [
          { code: '4410', name: 'Lease payments, construction vehicles' },
          { code: '4420', name: 'Mileage reimbursement' },
          { code: '4430', name: 'Repairs and maintenance, construction vehicles' },
          { code: '4440', name: 'Operating expenses, construction vehicles' },
          { code: '4450', name: 'Taxes, licenses, insurance, construction vehicles' },
          { code: '4460', name: 'Travel, construction department' },
          { code: '4470', name: 'Customer business entertainment, construction' },
          { code: '4480', name: 'Training and education, construction' },
          { code: '4490', name: 'Recruiting fees and expenses, construction' },
        ],
      },
    ],
  },
  {
    range: '4500–4560',
    title: 'Construction Equipment',
    icon: Wrench,
    color: '#2563eb',
    subsections: [
      {
        range: '4500–4560',
        title: 'Equipment',
        accounts: [
          { code: '4510', name: 'Rent, construction equipment' },
          { code: '4530', name: 'Repairs and maintenance, construction equipment' },
          { code: '4540', name: 'Operating expenses, construction equipment' },
          { code: '4550', name: 'Taxes and insurance, construction equipment' },
          { code: '4560', name: 'Small tools and supplies' },
        ],
      },
    ],
  },
  {
    range: '4600–4690',
    title: 'Unsold & In-Progress Units',
    icon: Home,
    color: '#ec4899',
    subsections: [
      {
        range: '4600–4660',
        title: 'Maintenance of Units',
        accounts: [
          { code: '4610', name: 'Temporary utilities' },
          { code: '4620', name: 'Trash maintenance' },
          { code: '4640', name: 'Lawn care' },
          { code: '4650', name: 'Utilities, completed units' },
          { code: '4660', name: 'Repairs and maintenance, completed units' },
        ],
      },
    ],
  },
  {
    range: '4700–4790',
    title: 'Warranty & Customer Service',
    icon: Wrench,
    color: '#7c3aed',
    subsections: [
      {
        range: '4700–4790',
        title: 'Warranty',
        accounts: [
          { code: '4710', name: 'Salaries and wages, warranty' },
          { code: '4720', name: 'Material, warranty' },
          { code: '4730', name: 'Trade contractor, warranty' },
          { code: '4790', name: 'Other warranty expenses' },
        ],
      },
    ],
  },
  {
    range: '4800–4990',
    title: 'Depreciation, Insurance & Other',
    icon: Landmark,
    color: '#64748b',
    subsections: [
      {
        range: '4800–4990',
        title: 'Depreciation & Other',
        accounts: [
          { code: '4820', name: 'Depreciation, construction office' },
          { code: '4830', name: 'Depreciation, warehouse' },
          { code: '4840', name: 'Depreciation, construction vehicles' },
          { code: '4850', name: 'Depreciation, construction equipment' },
          { code: '4910', name: 'Insurance and bonding expenses' },
          { code: '4920', name: 'Builder\'s risk insurance' },
          { code: '4990', name: 'Absorbed indirect costs' },
        ],
      },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────
// TAB 5: Land Development Costs (Appendix G — GL 1410)
// ─────────────────────────────────────────────────────────────────
const LAND_DEV_SECTIONS: AccountSection[] = [
  {
    range: '0100',
    title: 'Pre-Acquisition Costs',
    icon: Landmark,
    color: '#6366f1',
    subsections: [
      {
        range: '0100–0103',
        title: 'Pre-Acquisition',
        accounts: [
          { code: '0101', name: 'Options' },
          { code: '0102', name: 'Fees' },
          { code: '0103', name: 'Professional services' },
        ],
      },
    ],
  },
  {
    range: '0110',
    title: 'Acquisition Costs',
    icon: Building2,
    color: '#22c55e',
    subsections: [
      {
        range: '0110–0116',
        title: 'Land Purchase',
        accounts: [
          { code: '0111', name: 'Purchase price, undeveloped land' },
          { code: '0112', name: 'Sales commissions' },
          { code: '0113', name: 'Legal fees' },
          { code: '0114', name: 'Appraisals' },
          { code: '0115', name: 'Closing costs' },
          { code: '0116', name: 'Interest and financial fees' },
        ],
      },
    ],
  },
  {
    range: '0120',
    title: 'Land Planning & Design',
    icon: Building2,
    color: '#f59e0b',
    subsections: [
      {
        range: '0120–0129',
        title: 'Planning',
        accounts: [
          { code: '0121', name: 'Bonds' },
          { code: '0122', name: 'Fees' },
          { code: '0123', name: 'Permits' },
          { code: '0124', name: 'Legal expenses' },
          { code: '0125', name: 'Land planner fee' },
          { code: '0126', name: 'Preliminary architecture' },
          { code: '0127', name: 'Landscape architecture' },
          { code: '0128', name: 'Marketing expenses' },
          { code: '0129', name: 'Property tax' },
        ],
      },
    ],
  },
  {
    range: '0130',
    title: 'Engineering',
    icon: Wrench,
    color: '#2563eb',
    subsections: [
      {
        range: '0130–0138',
        title: 'Engineering Services',
        accounts: [
          { code: '0131', name: 'Civil engineering' },
          { code: '0132', name: 'Soil testing' },
          { code: '0133', name: 'Environmental engineering' },
          { code: '0134', name: 'Traffic engineering' },
          { code: '0138', name: 'Project management' },
        ],
      },
    ],
  },
  {
    range: '0140',
    title: 'Earthwork',
    icon: Shovel,
    color: '#78716c',
    subsections: [
      {
        range: '0140–0145',
        title: 'Site Earthwork',
        accounts: [
          { code: '0141', name: 'Fill dirt' },
          { code: '0142', name: 'Clearing lot' },
          { code: '0143', name: 'Rock removal' },
          { code: '0144', name: 'Erosion control' },
          { code: '0145', name: 'Dust control' },
        ],
      },
    ],
  },
  {
    range: '0150',
    title: 'Utilities',
    icon: Wrench,
    color: '#ea580c',
    subsections: [
      {
        range: '0150–0158',
        title: 'Utility Infrastructure',
        accounts: [
          { code: '0151', name: 'Sewer lines' },
          { code: '0152', name: 'Storm sewer' },
          { code: '0153', name: 'Water lines' },
          { code: '0154', name: 'Gas lines' },
          { code: '0155', name: 'Electric lines' },
          { code: '0156', name: 'Telephone lines' },
          { code: '0157', name: 'Cable television lines' },
          { code: '0158', name: 'Special technology lines' },
        ],
      },
    ],
  },
  {
    range: '0160',
    title: 'Streets & Walks',
    icon: Building2,
    color: '#ec4899',
    subsections: [
      {
        range: '0160–0165',
        title: 'Streets',
        accounts: [
          { code: '0161', name: 'Curbs and gutters' },
          { code: '0162', name: 'Walkways' },
          { code: '0163', name: 'Paving' },
          { code: '0164', name: 'Street lights' },
          { code: '0165', name: 'Street signs' },
        ],
      },
    ],
  },
  {
    range: '0170',
    title: 'Signage',
    icon: Building2,
    color: '#7c3aed',
    subsections: [
      {
        range: '0170–0174',
        title: 'Signs',
        accounts: [
          { code: '0171', name: 'Temporary' },
          { code: '0172', name: 'Entry sign' },
          { code: '0173', name: 'Permanent signs' },
          { code: '0174', name: 'Street signs' },
        ],
      },
    ],
  },
  {
    range: '0180',
    title: 'Landscaping',
    icon: TreePine,
    color: '#16a34a',
    subsections: [
      {
        range: '0180–0186',
        title: 'Landscape',
        accounts: [
          { code: '0181', name: 'Sod or seed' },
          { code: '0182', name: 'Shrubs' },
          { code: '0183', name: 'Trees' },
          { code: '0184', name: 'Mulch' },
          { code: '0185', name: 'Other materials' },
          { code: '0186', name: 'Labor' },
        ],
      },
    ],
  },
  {
    range: '0190',
    title: 'Amenities',
    icon: Home,
    color: '#06b6d4',
    subsections: [
      {
        range: '0190–0198',
        title: 'Community Amenities',
        accounts: [
          { code: '0191', name: 'Recreation center' },
          { code: '0192', name: 'Recreation center furnishings' },
          { code: '0193', name: 'Exercise equipment' },
          { code: '0194', name: 'Swimming pool' },
          { code: '0195', name: 'Tennis court' },
          { code: '0196', name: 'Tot lots' },
          { code: '0197', name: 'Putting greens' },
          { code: '0198', name: 'Exercise trail' },
        ],
      },
    ],
  },
];

// We need the Users icon import — it's already used via lucide-react in the indirect section
// Just adding it to the import list at the top isn't possible since the file is already written
// Let's reference it from the existing imports

// ─────────────────────────────────────────────────────────────────
// TAB DEFINITIONS
// ─────────────────────────────────────────────────────────────────
const TABS: TabDef[] = [
  {
    key: 'full',
    label: 'Full Chart of Accounts',
    shortLabel: 'Full COA',
    icon: BookOpen,
    description: 'Complete NAHB Standard Chart of Accounts for home builders — all 9 account ranges',
    appendix: 'Appendices A & B',
    sections: FULL_COA_SECTIONS,
  },
  {
    key: 'remodeler',
    label: 'Remodeler Chart of Accounts',
    shortLabel: 'Remodelers',
    icon: Home,
    description: 'Abbreviated chart for small-volume remodelers — fewer accounts, same NAHB numbering',
    appendix: 'Appendix D',
    sections: REMODELER_SECTIONS,
  },
  {
    key: 'direct',
    label: 'Direct Construction Costs',
    shortLabel: 'Direct Costs',
    icon: HardHat,
    description: 'Trade-level cost codes for tracking direct job costs — foundation through completion',
    appendix: 'Appendix E — GL 1430',
    sections: DIRECT_COST_SECTIONS,
  },
  {
    key: 'indirect',
    label: 'Indirect Construction Costs',
    shortLabel: 'Indirect Costs',
    icon: Wrench,
    description: 'Field operations overhead — supers, vehicles, equipment, warranty, and field office',
    appendix: 'Appendix F — GL 1440',
    sections: INDIRECT_COST_SECTIONS,
  },
  {
    key: 'land',
    label: 'Land Development Costs',
    shortLabel: 'Land Dev',
    icon: TreePine,
    description: 'Cost codes for land acquisition, engineering, utilities, streets, and amenities',
    appendix: 'Appendix G — GL 1410',
    sections: LAND_DEV_SECTIONS,
  },
];

// ─── Helpers ───────────────────────────────────────────────────
function getAllAccountsFromSections(sections: AccountSection[]): (Account & { sectionTitle: string; subsectionTitle: string })[] {
  const all: (Account & { sectionTitle: string; subsectionTitle: string })[] = [];
  for (const section of sections) {
    for (const sub of section.subsections) {
      for (const account of sub.accounts) {
        all.push({ ...account, sectionTitle: section.title, subsectionTitle: sub.title });
      }
    }
  }
  return all;
}

function getAllAccountsAcrossTabs(): (Account & { sectionTitle: string; subsectionTitle: string; tabLabel: string })[] {
  const all: (Account & { sectionTitle: string; subsectionTitle: string; tabLabel: string })[] = [];
  for (const tab of TABS) {
    for (const section of tab.sections) {
      for (const sub of section.subsections) {
        for (const account of sub.accounts) {
          all.push({ ...account, sectionTitle: section.title, subsectionTitle: sub.title, tabLabel: tab.shortLabel });
        }
      }
    }
  }
  return all;
}

// ─── Users icon reference (already in lucide-react import above) ────
// Used in indirect costs section

// ─── Component ─────────────────────────────────────────────────
export default function NAHBAccountsPage() {
  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('full');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const res = await fetch('/api/stripe/subscription');
        const data = await res.json();
        if (data.success) {
          setSubscription(data.data);
        }
      } catch {
        // fail silently
      } finally {
        setLoading(false);
      }
    };
    fetchSubscription();
  }, []);

  const currentTab = TABS.find((t) => t.key === activeTab) || TABS[0];
  const currentAccounts = useMemo(() => getAllAccountsFromSections(currentTab.sections), [currentTab]);
  const allAccountsAcross = useMemo(() => getAllAccountsAcrossTabs(), []);

  const toggleSection = (range: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(range)) {
        next.delete(range);
      } else {
        next.add(range);
      }
      return next;
    });
  };

  const expandAll = () => {
    const allRanges = new Set<string>();
    currentTab.sections.forEach((s) => {
      allRanges.add(s.range);
      s.subsections.forEach((sub) => allRanges.add(sub.range));
    });
    setExpandedSections(allRanges);
  };

  const collapseAll = () => setExpandedSections(new Set());

  const handleCopyAccount = (code: string, name: string) => {
    navigator.clipboard.writeText(`${code} ${name}`);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleCopyTab = () => {
    const text = currentAccounts.map((a) => `${a.code}\t${a.name}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopiedCode('TAB');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Search across ALL tabs
  const searchResults = searchQuery
    ? allAccountsAcross.filter(
        (a) =>
          a.code.includes(searchQuery) ||
          a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (a.description && a.description.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : [];

  // ─── Plan gate ───
  if (!loading && subscription && !subscription.includesAiToolkit) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#6366f1]/10 flex items-center justify-center mx-auto mb-6">
          <Lock size={32} className="text-[#6366f1]" />
        </div>
        <h1 className="text-2xl font-bold text-[#e8e8f0] mb-3">
          NAHB Chart of Accounts — Pro & Enterprise
        </h1>
        <p className="text-[#8888a0] mb-8 max-w-md mx-auto">
          Access the complete NAHB Standard Chart of Accounts (2016 revision) with 5 specialized views:
          Full COA, Remodeler edition, Direct Construction Costs by trade, Indirect Costs, and Land Development.
        </p>
        <Link
          href="/dashboard/settings"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white bg-[#6366f1] hover:bg-[#5558d9] transition"
        >
          Upgrade Plan
          <ArrowRight size={18} />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#e8e8f0] flex items-center gap-2">
            <BookOpen size={24} className="text-[#6366f1]" />
            NAHB Chart of Accounts
          </h1>
          <p className="text-sm text-[#8888a0] mt-1">
            Industry-standard chart of accounts for construction companies — 5 specialized views
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8888a0]" />
          <input
            type="text"
            placeholder="Search all tabs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-[#0a0a0f] border border-[#1e1e2e] text-[#e8e8f0] placeholder-[#8888a0] text-sm focus:outline-none focus:border-[#6366f1] transition"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto gap-1 pb-1 -mx-1 px-1 scrollbar-thin">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key);
                setExpandedSections(new Set());
                setSearchQuery('');
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-[#6366f1] text-white shadow-lg shadow-[#6366f1]/20'
                  : 'bg-[#12121a] border border-[#1e1e2e] text-[#8888a0] hover:text-[#e8e8f0] hover:border-[#3a3a4d]'
              }`}
            >
              <Icon size={16} />
              <span className="hidden sm:inline">{tab.shortLabel}</span>
              <span className="sm:hidden">{tab.shortLabel}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Description */}
      <div className="bg-[#12121a] border border-[#1e1e2e] rounded-lg px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-[#e8e8f0]">{currentTab.label}</h2>
            <p className="text-xs text-[#8888a0] mt-0.5">
              {currentTab.description} &middot; <span className="text-[#6366f1]">{currentTab.appendix}</span> &middot; {currentAccounts.length} accounts
            </p>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={expandAll}
          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#12121a] border border-[#1e1e2e] text-[#8888a0] hover:text-[#e8e8f0] hover:border-[#3a3a4d] transition"
        >
          Expand All
        </button>
        <button
          onClick={collapseAll}
          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#12121a] border border-[#1e1e2e] text-[#8888a0] hover:text-[#e8e8f0] hover:border-[#3a3a4d] transition"
        >
          Collapse All
        </button>
        <button
          onClick={handleCopyTab}
          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#6366f1] text-white hover:bg-[#5558d9] transition flex items-center gap-1.5"
        >
          {copiedCode === 'TAB' ? <Check size={14} /> : <Copy size={14} />}
          {copiedCode === 'TAB' ? 'Copied!' : `Copy ${currentTab.shortLabel}`}
        </button>
      </div>

      {/* Search Results — across ALL tabs */}
      {searchQuery && (
        <Card className="bg-[#12121a] border-[#1e1e2e] p-4">
          <h3 className="text-sm font-semibold text-[#e8e8f0] mb-3">
            Search Results ({searchResults.length} found across all tabs)
          </h3>
          {searchResults.length === 0 ? (
            <p className="text-sm text-[#8888a0]">No accounts match &ldquo;{searchQuery}&rdquo;</p>
          ) : (
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {searchResults.map((result, idx) => (
                <div
                  key={`${result.code}-${idx}`}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg bg-[#0a0a0f] border border-[#1e1e2e] hover:border-[#3a3a4d] transition group"
                >
                  <code className="text-sm font-mono text-[#6366f1] font-bold w-12 flex-shrink-0">
                    {result.code}
                  </code>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm text-[#e8e8f0]">{result.name}</span>
                    {result.description && (
                      <p className="text-xs text-[#8888a0] mt-0.5">{result.description}</p>
                    )}
                    <span className="text-[10px] text-[#6366f1]">
                      {result.tabLabel} → {result.sectionTitle}
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopyAccount(result.code, result.name)}
                    className="opacity-0 group-hover:opacity-100 transition p-1.5 rounded text-[#8888a0] hover:text-[#e8e8f0]"
                  >
                    {copiedCode === result.code ? <Check size={14} /> : <Copy size={14} />}
                  </button>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* Account Sections — current tab */}
      {!searchQuery && (
        <div className="space-y-3">
          {currentTab.sections.map((section) => {
            const Icon = section.icon;
            const isSectionExpanded = expandedSections.has(section.range);

            return (
              <Card
                key={section.range}
                className="bg-[#12121a] border-[#1e1e2e] overflow-hidden"
              >
                {/* Section Header */}
                <button
                  onClick={() => toggleSection(section.range)}
                  className="w-full flex items-center gap-3 p-4 hover:bg-[#0a0a0f]/50 transition text-left"
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${section.color}15` }}
                  >
                    <Icon size={20} style={{ color: section.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-base font-bold text-[#e8e8f0]">
                      {section.range} — {section.title}
                    </h2>
                    <p className="text-xs text-[#8888a0]">
                      {section.subsections.reduce((sum, s) => sum + s.accounts.length, 0)} accounts
                    </p>
                  </div>
                  {isSectionExpanded ? (
                    <ChevronDown size={20} className="text-[#8888a0]" />
                  ) : (
                    <ChevronRight size={20} className="text-[#8888a0]" />
                  )}
                </button>

                {/* Subsections */}
                {isSectionExpanded && (
                  <div className="border-t border-[#1e1e2e]">
                    {section.subsections.map((sub) => {
                      const isSubExpanded = expandedSections.has(sub.range);

                      return (
                        <div key={sub.range}>
                          <button
                            onClick={() => toggleSection(sub.range)}
                            className="w-full flex items-center gap-3 px-6 py-3 hover:bg-[#0a0a0f]/30 transition text-left border-b border-[#1e1e2e]/50"
                          >
                            {isSubExpanded ? (
                              <ChevronDown size={16} className="text-[#6366f1]" />
                            ) : (
                              <ChevronRight size={16} className="text-[#8888a0]" />
                            )}
                            <span className="text-sm font-semibold text-[#e8e8f0]">
                              {sub.title}
                            </span>
                            <span className="text-xs text-[#8888a0] ml-auto">
                              {sub.accounts.length} accounts
                            </span>
                          </button>

                          {isSubExpanded && (
                            <div className="px-6 pb-3">
                              {sub.accounts.map((account) => (
                                <div
                                  key={account.code}
                                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#0a0a0f] transition group"
                                >
                                  <code className="text-sm font-mono font-bold w-12 flex-shrink-0" style={{ color: section.color }}>
                                    {account.code}
                                  </code>
                                  <div className="flex-1 min-w-0">
                                    <span className="text-sm text-[#e8e8f0]">{account.name}</span>
                                    {account.description && (
                                      <p className="text-xs text-[#8888a0] mt-0.5">{account.description}</p>
                                    )}
                                  </div>
                                  <button
                                    onClick={() => handleCopyAccount(account.code, account.name)}
                                    className="opacity-0 group-hover:opacity-100 transition p-1.5 rounded text-[#8888a0] hover:text-[#e8e8f0]"
                                    title="Copy account code and name"
                                  >
                                    {copiedCode === account.code ? (
                                      <Check size={14} className="text-green-400" />
                                    ) : (
                                      <Copy size={14} />
                                    )}
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* Footer */}
      <div className="text-center py-6 border-t border-[#1e1e2e]">
        <p className="text-xs text-[#8888a0]">
          Based on the <span className="text-[#6366f1]">NAHB Standard Chart of Accounts (Revised 2016)</span> published by the
          National Association of Home Builders.
        </p>
        <p className="text-xs text-[#8888a0] mt-2">
          Copy individual accounts or a full tab to set up in{' '}
          <span className="text-[#e8e8f0]">QuickBooks Online</span>,{' '}
          <span className="text-[#e8e8f0]">Xero</span>, or{' '}
          <span className="text-[#e8e8f0]">Sage</span>.
        </p>
      </div>
    </div>
  );
}
