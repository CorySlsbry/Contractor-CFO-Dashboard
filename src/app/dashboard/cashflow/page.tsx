'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CashFlowChart } from '@/components/charts/cashflow-chart';
import { AlertCircle, TrendingUp } from 'lucide-react';
import { formatCompactCurrency } from '@/lib/utils';
import Link from 'next/link';

interface Bill {
  id: string;
  vendor_name: string;
  amount: number;
  due_date: string;
}

interface Invoice {
  id: string;
  customer_name: string;
  amount: number;
  due_date: string;
}

interface CashFlowData {
  success: boolean;
  data: {
    snapshot_data: {
      accounts_receivable: { total: number; invoices: Invoice[] };
      accounts_payable: { total: number; bills: Bill[] };
      cash_flow: { operating: number; investing: number; financing: number };
    };
  };
}

interface Payment {
  id: string;
  vendor: string;
  amount: number;
  dueDate: string;
  status: 'Due Soon' | 'Overdue' | 'Scheduled';
}

interface Receivable {
  id: string;
  customer: string;
  amount: number;
  expectedDate: string;
  status: 'Expected' | 'At Risk';
}

export default function CashFlowPage() {
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [receivables, setReceivables] = useState<Receivable[]>([]);
  const [hasData, setHasData] = useState(false);

  useEffect(() => {
    const fetchCashFlowData = async () => {
      try {
        const response = await fetch('/api/qbo/data');
        const data: CashFlowData = await response.json();

        if (data.success && data.data?.snapshot_data) {
          const { accounts_payable, accounts_receivable } = data.data.snapshot_data;

          // Transform bills to payments
          if (accounts_payable.bills && accounts_payable.bills.length > 0) {
            const transformedPayments: Payment[] = accounts_payable.bills.map((bill) => ({
              id: bill.id,
              vendor: bill.vendor_name || 'Unknown Vendor',
              amount: bill.amount || 0,
              dueDate: bill.due_date || '',
              status: 'Scheduled' as const,
            }));
            setPayments(transformedPayments);
          }

          // Transform invoices to receivables
          if (accounts_receivable.invoices && accounts_receivable.invoices.length > 0) {
            const transformedReceivables: Receivable[] = accounts_receivable.invoices.map((invoice) => ({
              id: invoice.id,
              customer: invoice.customer_name || 'Unknown Customer',
              amount: invoice.amount || 0,
              expectedDate: invoice.due_date || '',
              status: 'Expected' as const,
            }));
            setReceivables(transformedReceivables);
          }

          setHasData(
            (accounts_payable.bills && accounts_payable.bills.length > 0) ||
            (accounts_receivable.invoices && accounts_receivable.invoices.length > 0)
          );
        }
      } catch (error) {
        console.error('Error fetching cash flow data:', error);
        setHasData(false);
      } finally {
        setLoading(false);
      }
    };

    fetchCashFlowData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-[#8888a0]">Loading cash flow data...</div>
      </div>
    );
  }

  if (!hasData) {
    return (
      <div className="space-y-6">
        <Card className="p-8 bg-gradient-to-br from-[#6366f1]/10 to-[#1a1a26] border-[#6366f1]/20">
          <div className="text-center py-12">
            <AlertCircle className="mx-auto mb-4 text-[#8888a0]" size={48} />
            <h2 className="text-xl font-semibold text-[#e8e8f0] mb-2">
              No Cash Flow Data
            </h2>
            <p className="text-[#8888a0] mb-6">
              Connect QuickBooks to see your cash flow data
            </p>
            <Link
              href="/dashboard/integrations"
              className="inline-block px-6 py-2 bg-[#6366f1] text-white rounded-lg hover:bg-[#6366f1]/90 transition-colors"
            >
              Go to Integrations
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  const totalUpcomingPayments = payments.reduce((sum, p) => sum + p.amount, 0);
  const totalUpcomingReceivables = receivables.reduce((sum, r) => sum + r.amount, 0);

  return (
    <div className="space-y-6">
      {/* Hero Card - Current Cash Position */}
      <Card className="p-8 bg-gradient-to-br from-[#6366f1]/10 to-[#1a1a26] border-[#6366f1]/20">
        <p className="text-[#8888a0] text-sm mb-2">Upcoming Receivables vs Payments</p>
        <div className="grid grid-cols-2 gap-8">
          <div>
            <h3 className="text-[#8888a0] text-sm mb-2">Expected Inflows</h3>
            <p className="text-4xl font-bold text-[#22c55e]">
              {formatCompactCurrency(totalUpcomingReceivables)}
            </p>
          </div>
          <div>
            <h3 className="text-[#8888a0] text-sm mb-2">Upcoming Outflows</h3>
            <p className="text-4xl font-bold text-[#ef4444]">
              {formatCompactCurrency(totalUpcomingPayments)}
            </p>
          </div>
        </div>
      </Card>

      {/* Cash Flow Chart */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Cash Flow</h2>
        <CashFlowChart data={undefined} />
      </Card>

      {/* Upcoming Payments & Receivables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Payments */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Upcoming Payments</h2>
            <span className="text-sm font-bold text-[#ef4444]">
              {formatCompactCurrency(totalUpcomingPayments)} total
            </span>
          </div>

          {payments.length === 0 ? (
            <p className="text-[#8888a0] text-center py-8">No upcoming payments</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#2a2a3d]">
                    <th className="text-left py-2 px-2 text-[#8888a0] font-medium">
                      Vendor
                    </th>
                    <th className="text-right py-2 px-2 text-[#8888a0] font-medium">
                      Amount
                    </th>
                    <th className="text-right py-2 px-2 text-[#8888a0] font-medium">
                      Due
                    </th>
                    <th className="text-right py-2 px-2 text-[#8888a0] font-medium">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => (
                    <tr
                      key={payment.id}
                      className="border-b border-[#2a2a3d] hover:bg-[#1a1a26] transition-colors"
                    >
                      <td className="py-3 px-2 text-[#e8e8f0] truncate">
                        {payment.vendor}
                      </td>
                      <td className="py-3 px-2 text-right text-[#e8e8f0] font-semibold">
                        {formatCompactCurrency(payment.amount)}
                      </td>
                      <td className="py-3 px-2 text-right text-[#8888a0]">
                        {payment.dueDate
                          ? new Date(payment.dueDate).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })
                          : '—'}
                      </td>
                      <td className="py-3 px-2 text-right">
                        <Badge variant="info">{payment.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Upcoming Receivables */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Upcoming Receivables</h2>
            <span className="text-sm font-bold text-[#22c55e]">
              {formatCompactCurrency(totalUpcomingReceivables)} total
            </span>
          </div>

          {receivables.length === 0 ? (
            <p className="text-[#8888a0] text-center py-8">No upcoming receivables</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#2a2a3d]">
                    <th className="text-left py-2 px-2 text-[#8888a0] font-medium">
                      Customer
                    </th>
                    <th className="text-right py-2 px-2 text-[#8888a0] font-medium">
                      Amount
                    </th>
                    <th className="text-right py-2 px-2 text-[#8888a0] font-medium">
                      Expected
                    </th>
                    <th className="text-right py-2 px-2 text-[#8888a0] font-medium">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {receivables.map((receivable) => (
                    <tr
                      key={receivable.id}
                      className="border-b border-[#2a2a3d] hover:bg-[#1a1a26] transition-colors"
                    >
                      <td className="py-3 px-2 text-[#e8e8f0] truncate">
                        {receivable.customer}
                      </td>
                      <td className="py-3 px-2 text-right text-[#e8e8f0] font-semibold">
                        {formatCompactCurrency(receivable.amount)}
                      </td>
                      <td className="py-3 px-2 text-right text-[#8888a0]">
                        {receivable.expectedDate
                          ? new Date(receivable.expectedDate).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })
                          : '—'}
                      </td>
                      <td className="py-3 px-2 text-right">
                        <Badge variant="success">{receivable.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
