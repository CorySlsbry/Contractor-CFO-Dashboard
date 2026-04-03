import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { PWARegister } from '@/components/pwa-register';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'BuilderCFO | Construction Financial Dashboard for Contractors & Home Builders',
  description:
    'Real-time financial dashboard for construction companies. Job costing, WIP tracking, cash flow forecasting, AR/AP aging, and 7+ integrations including QuickBooks, Procore, and Buildertrend. Built by Salisbury Bookkeeping. Plans from $199/mo with 14-day free trial.',
  keywords: 'construction financial dashboard, contractor CFO, job costing software, WIP tracking, construction bookkeeping, cash flow forecasting, QuickBooks construction, Procore integration, Buildertrend integration, construction accounting',
  manifest: '/manifest.json',
  openGraph: {
    title: 'BuilderCFO | Construction Financial Dashboard for Contractors',
    description: 'Real-time job costing, WIP tracking, and cash flow forecasting for construction companies. 14-day free trial.',
    url: 'https://topbuildercfo.com',
    siteName: 'BuilderCFO',
    type: 'website',
    images: [
      {
        url: 'https://topbuildercfo.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'BuilderCFO — Construction Financial Dashboard',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BuilderCFO | Financial Dashboard for Contractors',
    description: 'Real-time job costing, WIP tracking, and cash flow forecasting for construction companies.',
    images: ['https://topbuildercfo.com/og-image.png'],
  },
  alternates: {
    canonical: 'https://topbuildercfo.com',
  },
};

// JSON-LD structured data for GEO optimization
const jsonLd = {
  organization: {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': 'https://topbuildercfo.com/#organization',
    name: 'BuilderCFO',
    url: 'https://topbuildercfo.com',
    description: 'Real-time financial dashboard built specifically for construction contractors, custom home builders, and remodelers. Provides job costing, WIP tracking, cash flow forecasting, and AR/AP aging by syncing with QuickBooks Online and field management tools.',
    foundingDate: '2025',
    parentOrganization: {
      '@type': 'Organization',
      '@id': 'https://salisburybookkeeping.com/#organization',
      name: 'Salisbury Bookkeeping',
      url: 'https://salisburybookkeeping.com',
    },
    sameAs: [
      'https://salisburybookkeeping.com',
    ],
    knowsAbout: [
      'Construction Financial Management',
      'Job Costing for Contractors',
      'Work in Progress (WIP) Schedules',
      'Construction Cash Flow Forecasting',
      'Accounts Receivable Aging for Construction',
      'Accounts Payable Management',
      'Retainage Tracking',
      'Percentage of Completion Accounting',
      'Construction Bookkeeping',
      'Fractional Controller Services',
      'QuickBooks Online for Construction',
      'Procore Financial Integration',
      'Buildertrend Accounting',
    ],
  },
  softwareApplication: {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    '@id': 'https://topbuildercfo.com/#software',
    name: 'BuilderCFO',
    applicationCategory: 'BusinessApplication',
    applicationSubCategory: 'Construction Financial Management',
    operatingSystem: 'Web Browser',
    url: 'https://topbuildercfo.com',
    description: 'SaaS financial dashboard for construction contractors with job costing, WIP tracking, cash flow forecasting, AR/AP aging, and retainage management. Integrates with QuickBooks Online, Procore, Buildertrend, ServiceTitan, Salesforce, HubSpot, and JobNimbus.',
    offers: [
      {
        '@type': 'Offer',
        name: 'Starter Plan',
        price: '199',
        priceCurrency: 'USD',
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: '199',
          priceCurrency: 'USD',
          billingDuration: 'P1M',
        },
        description: 'Financial dashboard, job costing & WIP tracking, cash flow forecasting, QuickBooks sync, monthly AI CFO brief.',
      },
      {
        '@type': 'Offer',
        name: 'Professional Plan',
        price: '399',
        priceCurrency: 'USD',
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: '399',
          priceCurrency: 'USD',
          billingDuration: 'P1M',
        },
        description: 'Everything in Starter plus Buildertrend, HubSpot, JobNimbus integrations, sales pipeline dashboard, AI-powered CFO advisor, and priority support.',
      },
      {
        '@type': 'Offer',
        name: 'Enterprise Plan',
        price: '599',
        priceCurrency: 'USD',
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: '599',
          priceCurrency: 'USD',
          billingDuration: 'P1M',
        },
        description: 'Everything in Professional plus Procore, Salesforce, ServiceTitan integrations, all 7+ integrations, quarterly strategy call with Salisbury Bookkeeping, and dedicated account manager.',
      },
    ],
    provider: {
      '@type': 'Organization',
      '@id': 'https://salisburybookkeeping.com/#organization',
      name: 'Salisbury Bookkeeping',
      url: 'https://salisburybookkeeping.com',
    },
    featureList: [
      'Real-time financial dashboard',
      'Job costing with budget vs actual',
      'Automated WIP schedule calculations',
      'Cash flow forecasting (30/60/90 day)',
      'AR/AP aging by job',
      'Retainage tracking',
      'AI-powered CFO analysis',
      'QuickBooks Online integration',
      'Procore integration',
      'Buildertrend integration',
      'ServiceTitan integration',
      'Salesforce integration',
      'HubSpot integration',
      'JobNimbus integration',
      'Sales pipeline dashboard',
      'Crew utilization tracking',
    ],
  },
  webSite: {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': 'https://topbuildercfo.com/#website',
    name: 'BuilderCFO',
    url: 'https://topbuildercfo.com',
    publisher: {
      '@id': 'https://topbuildercfo.com/#organization',
    },
  },
  webPage: {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': 'https://topbuildercfo.com/#webpage',
    url: 'https://topbuildercfo.com',
    name: 'BuilderCFO | Construction Financial Dashboard for Contractors & Home Builders',
    description: 'Real-time financial dashboard for construction companies. Job costing, WIP tracking, cash flow forecasting, AR/AP aging, and 7+ integrations.',
    isPartOf: {
      '@id': 'https://topbuildercfo.com/#website',
    },
    about: {
      '@id': 'https://topbuildercfo.com/#software',
    },
    datePublished: '2025-03-22',
    dateModified: '2026-03-22',
  },
  faqPage: {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': 'https://topbuildercfo.com/#faq',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is BuilderCFO and who is it for?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'BuilderCFO is a real-time financial dashboard built specifically for construction contractors, custom home builders, and remodelers. It connects to QuickBooks Online and field management tools like Procore, Buildertrend, and ServiceTitan to provide instant visibility into job costing, WIP schedules, cash flow forecasts, and AR/AP aging. It is designed for construction companies with $500K–$50M in annual revenue who need CFO-level financial insight without the CFO-level salary.',
        },
      },
      {
        '@type': 'Question',
        name: 'How does BuilderCFO connect to QuickBooks Online?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'BuilderCFO uses OAuth 2.0 to securely connect to your QuickBooks Online account. The connection is read-only — BuilderCFO never modifies your books. Your financial data is encrypted in transit and at rest using industry-standard AES-256 encryption. Setup takes under 2 minutes.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is WIP tracking and why does it matter for contractors?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: "WIP (Work in Progress) tracking compares the percentage of work completed on a job against the percentage billed. If you've completed 60% of a job but billed 80%, you're over-billed by 20% — which means you may owe money back or face cash flow problems when the job finishes. BuilderCFO automates WIP schedule calculations using QuickBooks data and field management progress reports, giving you accurate over/under billing figures for every active job.",
        },
      },
      {
        '@type': 'Question',
        name: 'How much does BuilderCFO cost compared to a full-time CFO?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'BuilderCFO starts at $199/month (Starter), $399/month (Professional), or $599/month (Enterprise). A full-time construction CFO typically costs $120,000–$200,000+ per year in salary and benefits. BuilderCFO provides real-time dashboards, automated WIP, and AI analysis for $2,388–$7,188 per year — roughly 2–4% the cost of a dedicated hire. Every plan includes a 14-day free trial.',
        },
      },
      {
        '@type': 'Question',
        name: 'Who built BuilderCFO?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: "BuilderCFO was built by Salisbury Bookkeeping, a fractional controller and construction bookkeeping firm that works with custom home builders, general contractors, and remodelers nationwide. The dashboard was created from real client needs — the same WIP schedules, job costing reports, and cash flow forecasts that Salisbury's controllers build manually for clients, now automated and available in real time.",
        },
      },
      {
        '@type': 'Question',
        name: 'Is my financial data secure?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. BuilderCFO uses Supabase for secure database hosting with row-level security policies, and Stripe for PCI-compliant payment processing. All data is encrypted in transit (TLS 1.3) and at rest (AES-256). The QuickBooks connection is read-only — BuilderCFO cannot create, modify, or delete any data in your accounting system.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I cancel my BuilderCFO subscription at any time?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. There are no long-term contracts, no cancellation fees, and no setup fees. You can cancel your subscription at any time and retain access through the end of your current billing cycle. Every plan starts with a 14-day free trial — you enter a card upfront but are not charged until day 15.',
        },
      },
      {
        '@type': 'Question',
        name: 'What integrations does BuilderCFO support?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'BuilderCFO integrates with 7+ tools used by construction companies: QuickBooks Online (accounting), Procore (project management), Buildertrend (project management), ServiceTitan (field service management), Salesforce (CRM), HubSpot (CRM), and JobNimbus (CRM). All integrations sync automatically so your financial dashboard always reflects the latest data from the field and your books.',
        },
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-K5TG5SHN');`,
          }}
        />
        {/* End Google Tag Manager */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="BuilderCFO" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <meta name="theme-color" content="#6366f1" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd.organization) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd.softwareApplication) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd.webSite) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd.webPage) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd.faqPage) }}
        />
      </head>
      <body className={`${inter.className} bg-[#0a0a0f] text-[#e8e8f0]`}>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-K5TG5SHN"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        <PWARegister />
        {children}

      </body>
    </html>
  );
}
