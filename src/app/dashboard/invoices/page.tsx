'use client';

import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';
import { formatCompactCurrency } from '@/lib/utils';

interface Invoice {
  id: string;
  number: string;
  customer: string;
  amount: number;
  issueDate: string;
  dueDate: string;
  status: 'Paid' | 'Open' | 'Overdue';
  daysOverdue: number;
}

const invoicesData: Invoice[] = [];

type SortField = 'number' | 'customer' | 'amount' | 'dueDate' | 'status';
type SortOrder = 'asc' | 'desc';

const statusPriority: Record<string, number> = {
  Overdue: 0,
  Open: 1,
  Paid: 2,
};

export default function InvoicesPage() {
  const [filterStatus, setFilterStatus] = useState<'All' | 'Paid' | 'Open' | 'Overdue'>(
    'All'
  );
  const [sortField, setSortField] = useState<SortField>('status');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const filteredAndSorted = useMemo(() => {
    let filtered = [...invoicesData];

    if (filterStatus !== 'All') {
      filtered = filtered.filter((inv) => inv.status === filterStatus);
    }

    // Default sort: status priority (Overdue > Open > Paid), then days overdue descending
    if (sortField === 'status') {
      return filtered.sort((a, b) => {
        const aPriority = statusPriority[a.status] ?? 3;
        const bPriority = statusPriority[b.status] ?? 3;
        if (sortOrder === 'desc') {
          if (aPriority !== bPriority) return bPriority - aPriority;
          return (a.daysOverdue || 0) - (b.daysOverdue || 0);
        }
        if (aPriority !== bPriority) return aPriority - bPriority;
        return (b.daysOverdue || 0) - (a.daysOverdue || 0);
      });
    }

    return filtered.sort((a, b) => {
      let aVal: any = a[sortField];
      let bVal: any = b[sortField];

      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = (bVal as string).toLowerCase();
      }

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filterStatus, sortField, sortOrder]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const stats = {
    outstanding: invoicesData
      .filter((inv) => inv.status !== 'Paid')
      .reduce((sum, inv) => sum + inv.amount, 0),
    overdue: invoicesData
      .filter((inv) => inv.status === 'Overdue')
      .reduce((sum, inv) => sum + inv.amount, 0),
    paidThisMonth: invoicesData
      .filter(
        (inv) =>
          inv.status === 'Paid' &&
          new Date(inv.issueDate).getMonth() === new Date().getMonth()
      )
      .reduce((sum, inv) => sum + inv.amount, 0),
    avgDaysToPay: 34,
  };

  if (invoicesData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h3 className="text-lg font-semibold text-[#e8e8f0] mb-2">No Invoices Yet</h3>
        <p className="text-sm text-[#8888a0] max-w-md">Connect QuickBooks to see your invoices, payment status, and aging details.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-1">Invoices</h1>
        <p className="text-[#8888a0]">
          {invoicesData.length} invoices | Total Outstanding:{' '}
          <span className="text-[#ef4444] font-semibold">
            {formatCompactCurrency(stats.outstanding)}
          </span>
        </p>
      </div>

      {/* AI Executive Summary */}
      <div className="mb-4 p-4 rounded-lg bg-[#1a1a26] border border-[#2a2a3d]">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">AI Executive Summary</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex items-start gap-2">
            <span className="text-green-400 text-sm mt-0.5">▲</span>
            <p className="text-sm text-[#c8c8d8]"><span className="font-medium text-green-400">Win:</span> 87% of invoices collected within 30 days — strong payment velocity</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-amber-400 text-sm mt-0.5">▼</span>
            <p className="text-sm text-[#c8c8d8]"><span className="font-medium text-amber-400">Watch:</span> $499k in invoices over 60 days past due — follow up on 3 aging accounts</p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-xs text-[#8888a0] mb-1">Total Outstanding</p>
          <p className="text-2xl font-bold mb-2">
            {formatCompactCurrency(stats.outstanding)}
          </p>
          <div className="h-2 bg-[#2a2a3d] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#ef4444]"
              style={{
                width: `${Math.min((stats.outstanding / 1000000) * 100, 100)}%`,
              }}
            />
          </div>
        </Card>
        <Card className="p-4 border-[#ef4444]/30">
          <p className="text-xs text-[#8888a0] mb-1">Overdue Amount</p>
          <p className="text-2xl font-bold text-[#ef4444] mb-2">
            {formatCompactCurrency(stats.overdue)}
          </p>
          <p className="text-xs text-[#ef4444]">
            {invoicesData.filter((inv) => inv.status === 'Overdue').length} invoices
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-[#8888a0] mb-1">Paid This Month</p>
          <p className="text-2xl font-bold text-[#22c55e] mb-2">
            {formatCompactCurrency(stats.paidThisMonth)}
          </p>
          <p className="text-xs text-[#8888a0]">This calendar month</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-[#8888a0] mb-1">Average Days to Pay</p>
          <p className="text-2xl font-bold mb-2">{stats.avgDaysToPay} days</p>
          <p className="text-xs text-[#8888a0]">Industry avg: 45 days</p>
        </Card>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2 flex-wrap">
        {(['All', 'Paid', 'Open', 'Overdue'] as const).map((status) => (
          <Button
            key={status}
            variant={filterStatus === status ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setFilterStatus(status)}
          >
            {status}
          </Button>
        ))}
      </div>

      {/* Invoice Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#1a1a26] border-b border-[#2a2a3d]">
              <tr>
                <th className="py-3 px-4 text-left text-[#8888a0] font-semibold">
                  <button
                    onClick={() => handleSort('number')}
                    className="flex items-center gap-1 hover:text-[#e8e8f0]"
                  >
                    Invoice #
                    <ArrowUpDown size={14} />
                  </button>
                </th>
                <th className="py-3 px-4 text-left text-[#8888a0] font-semibold">
                  <button
                    onClick={() => handleSort('customer')}
                    className="flex items-center gap-1 hover:text-[#e8e8f0]"
                  >
                    Customer
                    <ArrowUpDown size={14} />
                  </button>
                </th>
                <th className="py-3 px-4 text-right text-[#8888a0] font-semibold">
                  <button
                    onClick={() => handleSort('amount')}
                    className="flex items-center justify-end gap-1 hover:text-[#e8e8f0]"
                  >
                    Amount
                    <ArrowUpDown size={14} />
                  </button>
                </th>
                <th className="py-3 px-4 text-center text-[#8888a0] font-semibold">
                  Issued
                </th>
                <th className="py-3 px-4 text-center text-[#8888a0] font-semibold">
                  <button
                    onClick={() => handleSort('dueDate')}
                    className="flex items-center justify-center gap-1 hover:text-[#e8e8f0]"
                  >
                    Due
                    <ArrowUpDown size={14} />
                  </button>
                </th>
                <th className="py-3 px-4 text-center text-[#8888a0] font-semibold">
                  Status
                </th>
                <th className="py-3 px-4 text-center text-[#8888a0] font-semibold">
                  Days Overdue
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSorted.map((invoice) => (
                <tr
                  key={invoice.id}
                  className={`border-b border-[#2a2a3d] hover:bg-[#1a1a26] transition-colors ${
                    invoice.status === 'Overdue' ? 'bg-[#ef4444]/5' : ''
                  }`}
                >
                  <td className="py-4 px-4 font-medium text-[#e8e8f0]">
                    {invoice.number}
                  </td>
                  <td className="py-4 px-4 text-[#e8e8f0]">
                    {invoice.customer}
                  </td>
                  <td className="py-4 px-4 text-right font-semibold text-[#e8e8f0]">
                    {formatCompactCurrency(invoice.amount)}
                  </td>
                  <td className="py-4 px-4 text-center text-[#8888a0]">
                    {new Date(invoice.issueDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </td>
                  <td className="py-4 px-4 text-center text-[#8888a0]">
                    {new Date(invoice.dueDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </td>
                  <td className="py-4 px-4 text-center">
                    <Badge
                      variant={
                        invoice.status === 'Paid'
                          ? 'success'
                          : invoice.status === 'Overdue'
                            ? 'danger'
                            : 'info'
                      }
                    >
                      {invoice.status}
                    </Badge>
                  </td>
                  <td className="py-4 px-4 text-center">
                    {invoice.status === 'Overdue' ? (
                      <span className="text-[#ef4444] font-semibold">
                        {invoice.daysOverdue} days
                      </span>
                    ) : (
                      <span className="text-[#8888a0]">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {filteredAndSorted.length === 0 && (
        <Card className="p-12 text-center">
          <p className="text-[#8888a0]">No invoices found with selected filter.</p>
        </Card>
      )}
    </div>
  );
}
