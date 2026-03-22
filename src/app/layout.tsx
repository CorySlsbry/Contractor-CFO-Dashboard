import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Contractor CFO Dashboard | Salisbury Bookkeeping',
  description:
    'Real-time financial dashboards and job costing visibility for construction companies. Know where every dollar goes on every job—without hiring a $150K CFO.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#0a0a0f] text-[#e8e8f0]`}>
        {children}
      </body>
    </html>
  );
}
