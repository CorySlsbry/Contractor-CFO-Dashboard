'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCompactCurrency } from '@/lib/utils';

interface Job {
  id: string;
  name: string;
  customer: string;
  status: 'Active' | 'Completed' | 'On Hold';
  estimatedCost: number;
  actualCost: number;
  billed: number;
  percentComplete: number;
  profitMargin: number;
  costs: {
    labor: number;
    materials: number;
    subcontractors: number;
    equipment: number;
    other: number;
  };
}

const jobsData: Job[] = [];

export default function JobsPage() {
  const [filterStatus, setFilterStatus] = useState<'All' | 'Active' | 'Completed' | 'Over Budget'>(
    'All'
  );

  const filteredJobs = jobsData.filter((job) => {
    if (filterStatus === 'All') return true;
    if (filterStatus === 'Active') return job.status === 'Active';
    if (filterStatus === 'Completed') return job.status === 'Completed';
    if (filterStatus === 'Over Budget') return job.profitMargin < 0;
    return true;
  });

  const totalActiveJobs = jobsData.filter((j) => j.status === 'Active').length;
  const totalEstimatedValue = jobsData.reduce((sum, j) => sum + j.estimatedCost, 0);

  if (jobsData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h3 className="text-lg font-semibold text-[#e8e8f0] mb-2">No Jobs Yet</h3>
        <p className="text-sm text-[#8888a0] max-w-md">Connect QuickBooks and your field management tool to see job costing data here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-1">Job Costing</h1>
          <p className="text-[#8888a0]">
            {totalActiveJobs} active jobs | Total Estimated Value:{' '}
            <span className="text-[#6366f1] font-semibold">
              {formatCompactCurrency(totalEstimatedValue)}
            </span>
          </p>
        </div>
      </div>

      {/* AI Executive Summary */}
      <div className="mb-4 p-4 rounded-lg bg-[#1a1a26] border border-[#2a2a3d]">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">AI Executive Summary</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex items-start gap-2">
            <span className="text-green-400 text-sm mt-0.5">▲</span>
            <p className="text-sm text-[#c8c8d8]"><span className="font-medium text-green-400">Win:</span> Overall portfolio at 94% budget efficiency across active jobs</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-amber-400 text-sm mt-0.5">▼</span>
            <p className="text-sm text-[#c8c8d8]"><span className="font-medium text-amber-400">Watch:</span> Mountain View Remodel trending 18% over budget — review material costs</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {(['All', 'Active', 'Completed', 'Over Budget'] as const).map((filter) => (
          <Button
            key={filter}
            variant={filterStatus === filter ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setFilterStatus(filter)}
          >
            {filter}
          </Button>
        ))}
      </div>

      {/* Job Cards */}
      <div className="grid grid-cols-1 gap-6">
        {filteredJobs.map((job) => (
          <Card key={job.id} className="p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-bold mb-1">{job.name}</h3>
                <p className="text-sm text-[#8888a0]">{job.customer}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    job.status === 'Completed'
                      ? 'success'
                      : job.status === 'Active'
                        ? 'info'
                        : 'warning'
                  }
                >
                  {job.status}
                </Badge>
                {job.profitMargin < 0 && (
                  <Badge variant="danger">Over Budget</Badge>
                )}
              </div>
            </div>

            {/* Budget Bar */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Budget Status</span>
                <span
                  className={`text-sm font-bold ${
                    job.profitMargin >= 0 ? 'text-[#22c55e]' : 'text-[#ef4444]'
                  }`}
                >
                  {job.profitMargin > 0 ? '+' : ''}
                  {job.profitMargin}% margin
                </span>
              </div>
              <div className="flex h-3 bg-[#2a2a3d] rounded-full overflow-hidden">
                <div
                  className={`${
                    job.profitMargin >= 0 ? 'bg-[#22c55e]' : 'bg-[#ef4444]'
                  }`}
                  style={{
                    width: `${Math.min((job.actualCost / job.estimatedCost) * 100, 100)}%`,
                  }}
                />
              </div>
              <div className="flex justify-between text-xs text-[#8888a0] mt-2">
                <span>Actual: {formatCompactCurrency(job.actualCost)}</span>
                <span>Estimated: {formatCompactCurrency(job.estimatedCost)}</span>
              </div>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6 pb-6 border-b border-[#2a2a3d]">
              <div className="bg-[#1a1a26] p-3 rounded-lg">
                <p className="text-xs text-[#8888a0] mb-1">Estimated Cost</p>
                <p className="text-lg font-bold">
                  {formatCompactCurrency(job.estimatedCost)}
                </p>
              </div>
              <div className="bg-[#1a1a26] p-3 rounded-lg">
                <p className="text-xs text-[#8888a0] mb-1">Actual Cost</p>
                <p className="text-lg font-bold">
                  {formatCompactCurrency(job.actualCost)}
                </p>
              </div>
              <div className="bg-[#1a1a26] p-3 rounded-lg">
                <p className="text-xs text-[#8888a0] mb-1">Billed</p>
                <p className="text-lg font-bold">
                  {formatCompactCurrency(job.billed)}
                </p>
              </div>
              <div className="bg-[#1a1a26] p-3 rounded-lg">
                <p className="text-xs text-[#8888a0] mb-1">Remaining</p>
                <p className="text-lg font-bold">
                  {formatCompactCurrency(job.estimatedCost - job.actualCost)}
                </p>
              </div>
              <div className="bg-[#1a1a26] p-3 rounded-lg">
                <p className="text-xs text-[#8888a0] mb-1">% Complete</p>
                <p className="text-lg font-bold">{job.percentComplete}%</p>
              </div>
            </div>

            {/* Cost Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-semibold mb-3">Cost Breakdown</h4>
                <div className="space-y-2">
                  {[
                    { label: 'Labor', value: job.costs.labor },
                    { label: 'Materials', value: job.costs.materials },
                    { label: 'Subcontractors', value: job.costs.subcontractors },
                    { label: 'Equipment', value: job.costs.equipment },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex justify-between items-center p-2 bg-[#1a1a26] rounded"
                    >
                      <span className="text-sm text-[#8888a0]">{item.label}</span>
                      <span className="text-sm font-semibold">
                        {formatCompactCurrency(item.value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Progress Ring */}
              <div className="flex flex-col items-center justify-center p-4 bg-[#1a1a26] rounded-lg">
                <div className="relative w-32 h-32 flex items-center justify-center">
                  <svg className="transform -rotate-90" width="128" height="128">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      fill="none"
                      stroke="#2a2a3d"
                      strokeWidth="8"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      fill="none"
                      stroke="#6366f1"
                      strokeWidth="8"
                      strokeDasharray={`${2 * Math.PI * 56}`}
                      strokeDashoffset={`${2 * Math.PI * 56 * (1 - job.percentComplete / 100)}`}
                      strokeLinecap="round"
                      style={{ transition: 'stroke-dashoffset 0.3s ease' }}
                    />
                  </svg>
                  <div className="absolute text-center">
                    <p className="text-2xl font-bold">{job.percentComplete}%</p>
                    <p className="text-xs text-[#8888a0]">Complete</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <Card className="p-12 text-center">
          <p className="text-[#8888a0]">No jobs found with selected filter.</p>
        </Card>
      )}
    </div>
  );
}
