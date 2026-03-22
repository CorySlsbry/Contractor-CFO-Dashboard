'use client';

import { Card } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-1">Reports</h1>
        <p className="text-[#8888a0]">Generate and view financial reports</p>
      </div>

      <Card className="p-12 text-center border-dashed border-[#6366f1]/30">
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-[#6366f1]/10 rounded-lg">
            <BarChart3 size={40} className="text-[#6366f1]" />
          </div>
        </div>
        <h2 className="text-xl font-semibold mb-2 text-[#e8e8f0]">Reports Coming Soon</h2>
        <p className="text-[#8888a0] max-w-md mx-auto">
          Advanced reporting tools including custom date ranges, export capabilities, and trend analysis will be available soon.
        </p>
      </Card>
    </div>
  );
}
