'use client';

import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';

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

const invoicesData: Invoice[] = [
  {
    id: '1',
    number: '2024-001',
    customer: 'Heritage Park Development',
    amount: 125000,
    issueDate: '2024-03-01',
    dueDate: '2024-03-31',
    status: 'Paid',
    daysOverdue: 0,
  },
  {
    id: '2',
    number: '2024-002',
    customer: 'Mrs. Sarah Mitchell',
    amount: 85000,
    issueDate: '2024-03-05',
    dueDate: '2024-04-05',
    status: 'Open',
    daysOverdue: 0,
  },
  {
    id: '3',
    number: '2024-003',
    customer: 'John & Patricia Johnson',
    amount: 45200,
    issueDate: '2024-02-20',
    dueDate: '2024-03-20',
    status: 'Overdue',
    daysOverdue: 1,
  },
  {
    id: '4',
    number: '2024-004',
    customer: 'Oakwood Properties LLC',
    amount: 340000,
    issueDate: '2024-02-15',
    dueDate: '2024-03-15',
    status: 'Paid',
    daysOverdue: 0,
  },
  {
    id: '5',
    number: '2024-005',
    customer: 'The Cedar Family',
    amount: 62300,
    issueDate: '2024-03-10',
    dueDate: '2024-04-10',
    status: 'Open',
    daysOverdue: 0,
  },
  {
    id: '6',
    number: '2024-006',
    customer: 'Riverside Development Corp',
    amount: 198500,
    issueDate: '2024-02-28',
    dueDate: '2024-03-28',
    status: 'Overdue',
    daysOverdue: -3,
  },
  {
    id: '7',
    number: '2024-007',
    customer: 'Mountain View Investors',
    amount: 89700,
    issueDate: '2024-03-08',
    dueDate: '2024-04-08',
    status: 'Open',
    daysOverdue: 0,
  },
  {
    id: '8',
    number: '2024-008',
    customer: 'Heritage Restoration Inc',
    amount: 156200,
    issueDate: '2024-01-30',
    dueDate: '2024-02-28',
    status: 'Overdue',
    daysOverdue: 21,
  },
  {
    id: '9',
    number: '2024-009',
    customer: 'Sunset Properties Group',
    amount: 234500,
    issueDate: '2024-02-10',
    dueDate: '2024-03-10',
    status: 'Paid',
    daysOverdue: 0,
  },
  {
    id: '10',
    number: '2024-010',
    customer: 'Premium Estates LLC',
    amount: 112400,
    issueDate: '2024-03-15',
    dueDate: '2024-04-15',
    status: 'Open',
    daysOverdue: 0,
  },
  {
    id: '11',
    number: '2024-011',
    customer: 'Summit Construction Partners',
    issueDate: '2024-03-12',
    dueDate: '2024-04-12',
    amount: 78900,
    status: 'Open',
    daysOverdue: 0,
  },
  {
    id: '12',
    number: '2024-012',
    customer: 'Aurora Building Group',
    amount: 245600,
    issueDate: '2024-02-01',
    dueDate: '2024-03-01',
    status: 'Overdue',
    daysOverdue: 20,
  },
  {
    id: '13',
    number: '2024-013',
    customer: 'Pinnacle Development LLC',
    amount: 167800,
    issueDate: '2024-03-18',
    dueDate: '2024-04-18',
    status: 'Open',
    daysOverdue: 0,
  },
  {
    id: '14',
    number: '2024-014',
    customer: 'Capital Building Solutions',
    amount: 52300,
    issueDate: '2024-03-01',
    dueDate: '2024-04-01',
    status: 'Open',
    daysOverdue: 0,
  },
  {
    id: '15',
    number: '2024-015',
    customer: 'Landmark Contractors',
    amount: 321400,
    issueDate: '2024-02-05',
    dueDate: '2024-03-05',
    status: 'Overdue',
    daysOverdue: 16,
  },
];

type SortField = 'number' | 'customer' | 'amount' | 'dueDate' | 'status';
type SortOrder = 'asc' | 'desc';

export default function InvoicesPage() {
  const [filterStatus, setFilterStatus] = useState<'All' | 'Paid' | 'Open' | 'Overdue'>(
    'All'
  );
  const [sortField, setSortField] = useState<SortField>('dueDate');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const filteredAndSorted = useMemo(() => {
    let filtered = invoicesData;

    if (filterStatus !== 'All') {
      filtered = filtered.filter((inv) => inv.status === filterStatus);
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-1">Invoices</h1>
        <p className="text-[#8888a0]">
          {invoicesData.length} invoices | Total Outstanding:{' '}
          <span className="text-[#ef4444] font-semibold">
            ${(stats.outstanding / 1000).toFixed(0)}k
          </span>
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-xs text-[#8888a0] mb-1">Total Outstanding</p>
          <p className="text-2xl font-bold mb-2">
            ${(stats.outstanding / 1000).toFixed(0)}k
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
            ${(stats.overdue / 1000).toFixed(0)}k
          </p>
          <p className="text-xs text-[#ef4444]">
            {invoicesData.filter((inv) => inv.status === 'Overdue').length} invoices
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-[#8888a0] mb-1">Paid This Month</p>
          <p className="text-2xl font-bold text-[#22c55e] mb-2">
            ${(stats.paidThisMonth / 1000).toFixed(0)}k
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
                    ${(invoice.amount / 1000).toFixed(0)}k
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
