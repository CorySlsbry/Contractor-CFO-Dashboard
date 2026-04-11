'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Briefcase, Loader2, ArrowUpDown } from 'lucide-react';
import Link from 'next/link';
import { formatCompactCurrency } from '@/lib/utils';
import type { JobData } from '@/types';

type SortField = 'name' | 'customer' | 'revenue' | 'profit_margin' | 'percent_complete' | 'status';
type SortOrder = 'asc' | 'desc';

const statusLabels: Record<JobData['status'], string> = {
  not_started: 'Not Started',
  in_progress: 'In Progress',
  completed: 'Completed',
  on_hold: 'On Hold',
};

const statusVariant = (s: JobData['status']): 'default' | 'info' | 'success' | 'warning' | 'danger' => {
  switch (s) {
    case 'completed': return 'success';
    case 'in_progress': return 'info';
    case 'on_hold': return 'warning';
    case 'not_started': return 'default';
    default: return 'default';
  }
};

export default function JobsPage() {
  const [jobs, setJobs] = useState<JobData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | JobData['status']>('all');
  const [sortField, setSortField] = useState<SortField>('revenue');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const getClientId = () =>
    typeof window !== 'undefined' ? window.localStorage?.getItem?.('selectedClientId') || null : null;
  const getLocationId = () =>
    typeof window !== 'undefined' ? window.localStorage?.getItem?.('selectedLocationId') || null : null;

  const fetchJobs = useCallback(async (clientId?: string | null, locationId?: string | null) => {
    try {
      setLoading(true);
      const p = new URLSearchParams();
      if (clientId) p.set('clientCompanyId', clientId);
      if (locationId) p.set('locationId', locationId);
      const qs = p.size > 0 ? '?' + p.toString() : '';
      const res = await fetch(`/api/qbo/data${qs}`);
      if (!res.ok) throw new Error('Failed to fetch jobs');
      const data = await res.json();
      const snapshotJobs: JobData[] = data.data?.jobs || [];
      setJobs(snapshotJobs);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch jobs');
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs(getClientId(), getLocationId());

    const handleClientChanged = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      fetchJobs(detail?.clientId ?? null, getLocationId());
    };
    const handleLocationChanged = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      fetchJobs(getClientId(), detail?.locationId ?? null);
    };
    window.addEventListener('clientChanged', handleClientChanged);
    window.addEventListener('locationChanged', handleLocationChanged);
    return () => {
      window.removeEventListener('clientChanged', handleClientChanged);
      window.removeEventListener('locationChanged', handleLocationChanged);
    };
  }, [fetchJobs]);

  const filteredAndSorted = useMemo(() => {
    let filtered = [...jobs];
    if (filterStatus !== 'all') {
      filtered = filtered.filter((j) => j.status === filterStatus);
    }
    return filtered.sort((a, b) => {
      let aVal: any = (a as any)[sortField];
      let bVal: any = (b as any)[sortField];
      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = (bVal as string).toLowerCase();
      }
      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [jobs, filterStatus, sortField, sortOrder]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const stats = useMemo(() => {
    const active = jobs.filter((j) => j.status === 'in_progress');
    const revenueActive = active.reduce((s, j) => s + (j.revenue || 0), 0);
    const costActive = active.reduce((s, j) => s + (j.actual_cost || 0), 0);
    const grossProfit = revenueActive - costActive;
    const avgMargin = jobs.length > 0
      ? jobs.reduce((s, j) => s + (j.profit_margin || 0), 0) / jobs.length
      : 0;
    const overBudget = jobs.filter((j) => j.actual_cost > j.estimated_cost).length;
    return { active: active.length, revenueActive, grossProfit, avgMargin, overBudget };
  }, [jobs]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 size={32} className="animate-spin mx-auto mb-4 text-[#6366f1]" />
          <p className="text-[#8888a0]">Loading jobs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-1">Job Costing</h1>
          <p className="text-[#8888a0]">Track job costs, budgets, and profitability</p>
        </div>
        <Card className="p-6 border-red-900/30">
          <p className="text-red-400 mb-4">{error}</p>
          <Link href="/dashboard/integrations">
            <Button variant="primary">Connect Integration</Button>
          </Link>
        </Card>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-1">Job Costing</h1>
          <p className="text-[#8888a0]">Track job costs, budgets, and profitability</p>
        </div>
        <Card className="p-12 text-center">
          <div className="flex justify-center mb-4">
            <Briefcase size={48} className="text-[#6366f1]" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Job Costing Not Connected</h3>
          <p className="text-[#8888a0] mb-6 max-w-md mx-auto">
            Connect Procore or Buildertrend to track job costs, budgets, and profitability
          </p>
          <Link href="/dashboard/integrations">
            <Button variant="primary">Connect Integration</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-1">Job Costing</h1>
        <p className="text-[#8888a0]">
          {jobs.length} jobs | {stats.active} active | Avg margin:{' '}
          <span className="text-[#22c55e] font-semibold">
            {stats.avgMargin.toFixed(1)}%
          </span>
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-xs text-[#8888a0] mb-1">Active Job Revenue</p>
          <p className="text-2xl font-bold mb-2">
            {formatCompactCurrency(stats.revenueActive)}
          </p>
          <p className="text-xs text-[#8888a0]">{stats.active} in progress</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-[#8888a0] mb-1">Gross Profit (Active)</p>
          <p className="text-2xl font-bold text-[#22c55e] mb-2">
            {formatCompactCurrency(stats.grossProfit)}
          </p>
          <p className="text-xs text-[#8888a0]">Revenue minus cost to date</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-[#8888a0] mb-1">Average Margin</p>
          <p className="text-2xl font-bold mb-2">{stats.avgMargin.toFixed(1)}%</p>
          <div className="h-2 bg-[#2a2a3d] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#22c55e]"
              style={{ width: `${Math.min(Math.max(stats.avgMargin, 0), 100)}%` }}
            />
          </div>
        </Card>
        <Card className={`p-4 ${stats.overBudget > 0 ? 'border-[#ef4444]/30' : ''}`}>
          <p className="text-xs text-[#8888a0] mb-1">Over Budget</p>
          <p className={`text-2xl font-bold mb-2 ${stats.overBudget > 0 ? 'text-[#ef4444]' : ''}`}>
            {stats.overBudget}
          </p>
          <p className="text-xs text-[#8888a0]">jobs exceeding estimate</p>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {(['all', 'in_progress', 'completed', 'on_hold', 'not_started'] as const).map((status) => (
          <Button
            key={status}
            variant={filterStatus === status ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setFilterStatus(status)}
          >
            {status === 'all' ? 'All' : statusLabels[status]}
          </Button>
        ))}
      </div>

      {/* Job Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#1a1a26] border-b border-[#2a2a3d]">
              <tr>
                <th className="py-3 px-4 text-left text-[#8888a0] font-semibold">
                  <button
                    onClick={() => handleSort('name')}
                    className="flex items-center gap-1 hover:text-[#e8e8f0]"
                  >
                    Job
                    <ArrowUpDown size={14} />
                  </button>
                </th>
                <th className="py-3 px-4 text-left text-[#8888a0] font-semibold">
                  Customer
                </th>
                <th className="py-3 px-4 text-right text-[#8888a0] font-semibold">
                  <button
                    onClick={() => handleSort('revenue')}
                    className="flex items-center justify-end gap-1 hover:text-[#e8e8f0] w-full"
                  >
                    Contract
                    <ArrowUpDown size={14} />
                  </button>
                </th>
                <th className="py-3 px-4 text-right text-[#8888a0] font-semibold">
                  Estimated
                </th>
                <th className="py-3 px-4 text-right text-[#8888a0] font-semibold">
                  Actual
                </th>
                <th className="py-3 px-4 text-right text-[#8888a0] font-semibold">
                  <button
                    onClick={() => handleSort('profit_margin')}
                    className="flex items-center justify-end gap-1 hover:text-[#e8e8f0] w-full"
                  >
                    Margin
                    <ArrowUpDown size={14} />
                  </button>
                </th>
                <th className="py-3 px-4 text-center text-[#8888a0] font-semibold">
                  <button
                    onClick={() => handleSort('percent_complete')}
                    className="flex items-center justify-center gap-1 hover:text-[#e8e8f0] w-full"
                  >
                    Progress
                    <ArrowUpDown size={14} />
                  </button>
                </th>
                <th className="py-3 px-4 text-center text-[#8888a0] font-semibold">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSorted.map((job) => {
                const isOver = job.actual_cost > job.estimated_cost;
                return (
                  <tr
                    key={job.id}
                    className={`border-b border-[#2a2a3d] hover:bg-[#1a1a26] transition-colors ${
                      isOver ? 'bg-[#ef4444]/5' : ''
                    }`}
                  >
                    <td className="py-4 px-4 font-medium text-[#e8e8f0]">
                      {job.name}
                    </td>
                    <td className="py-4 px-4 text-[#8888a0]">{job.customer}</td>
                    <td className="py-4 px-4 text-right font-semibold text-[#e8e8f0]">
                      {formatCompactCurrency(job.revenue)}
                    </td>
                    <td className="py-4 px-4 text-right text-[#8888a0]">
                      {formatCompactCurrency(job.estimated_cost)}
                    </td>
                    <td className={`py-4 px-4 text-right ${isOver ? 'text-[#ef4444]' : 'text-[#8888a0]'}`}>
                      {formatCompactCurrency(job.actual_cost)}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span
                        className={`font-semibold ${
                          job.profit_margin >= 20
                            ? 'text-[#22c55e]'
                            : job.profit_margin >= 10
                            ? 'text-[#f59e0b]'
                            : 'text-[#ef4444]'
                        }`}
                      >
                        {job.profit_margin.toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-[#2a2a3d] rounded-full overflow-hidden min-w-[80px]">
                          <div
                            className="h-full bg-[#6366f1]"
                            style={{ width: `${Math.min(job.percent_complete, 100)}%` }}
                          />
                        </div>
                        <span className="text-xs text-[#8888a0] w-10 text-right">
                          {job.percent_complete}%
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <Badge variant={statusVariant(job.status)}>
                        {statusLabels[job.status]}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {filteredAndSorted.length === 0 && (
        <Card className="p-12 text-center">
          <p className="text-[#8888a0]">No jobs found with selected filter.</p>
        </Card>
      )}
    </div>
  );
}
