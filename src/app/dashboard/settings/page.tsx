'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, Plug, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-1">Settings</h1>
        <p className="text-[#8888a0]">Manage your account and preferences</p>
      </div>

      {/* Account Settings */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Account Settings</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-[#1a1a26] rounded-lg">
            <div>
              <p className="text-sm font-medium text-[#e8e8f0]">Company Name</p>
              <p className="text-[#8888a0]">Summit Ridge Construction</p>
            </div>
            <Button variant="secondary" size="sm">Edit</Button>
          </div>
          <div className="flex items-center justify-between p-4 bg-[#1a1a26] rounded-lg">
            <div>
              <p className="text-sm font-medium text-[#e8e8f0]">Email</p>
              <p className="text-[#8888a0]">john@summitridge.com</p>
            </div>
            <Button variant="secondary" size="sm">Edit</Button>
          </div>
          <div className="flex items-center justify-between p-4 bg-[#1a1a26] rounded-lg">
            <div>
              <p className="text-sm font-medium text-[#e8e8f0]">Plan</p>
              <p className="text-[#8888a0]">Professional ($299/month)</p>
            </div>
            <Button variant="secondary" size="sm">Manage</Button>
          </div>
        </div>
      </Card>

      {/* Integrations Card */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Integrations</h2>
          <Link href="/dashboard/integrations">
            <Button variant="primary" size="sm" className="flex items-center gap-2">
              <Plug size={16} />
              Manage Integrations
              <ArrowRight size={14} />
            </Button>
          </Link>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-[#1a1a26] rounded-lg">
            <div>
              <p className="text-sm font-medium text-[#e8e8f0]">QuickBooks Online</p>
              <p className="text-xs text-[#22c55e]">Connected</p>
            </div>
            <span className="text-xs text-[#8888a0]">Accounting</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-[#1a1a26] rounded-lg">
            <div>
              <p className="text-sm font-medium text-[#e8e8f0]">Procore, Buildertrend, ServiceTitan</p>
              <p className="text-xs text-[#8888a0]">Project Management</p>
            </div>
            <Link href="/dashboard/integrations">
              <span className="text-xs text-indigo-400 hover:text-indigo-300 cursor-pointer">Connect &rarr;</span>
            </Link>
          </div>
          <div className="flex items-center justify-between p-4 bg-[#1a1a26] rounded-lg">
            <div>
              <p className="text-sm font-medium text-[#e8e8f0]">Salesforce, HubSpot, JobNimbus</p>
              <p className="text-xs text-[#8888a0]">CRM & Sales</p>
            </div>
            <Link href="/dashboard/integrations">
              <span className="text-xs text-indigo-400 hover:text-indigo-300 cursor-pointer">Connect &rarr;</span>
            </Link>
          </div>
        </div>
      </Card>

      {/* Notification Preferences */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Notifications</h2>
        <div className="space-y-3">
          <label className="flex items-center gap-3 p-3 hover:bg-[#1a1a26] rounded-lg cursor-pointer transition-colors">
            <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
            <span className="text-sm text-[#e8e8f0]">Daily cash position summary</span>
          </label>
          <label className="flex items-center gap-3 p-3 hover:bg-[#1a1a26] rounded-lg cursor-pointer transition-colors">
            <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
            <span className="text-sm text-[#e8e8f0]">Invoice payment reminders</span>
          </label>
          <label className="flex items-center gap-3 p-3 hover:bg-[#1a1a26] rounded-lg cursor-pointer transition-colors">
            <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
            <span className="text-sm text-[#e8e8f0]">Budget alerts for jobs over 80%</span>
          </label>
          <label className="flex items-center gap-3 p-3 hover:bg-[#1a1a26] rounded-lg cursor-pointer transition-colors">
            <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
            <span className="text-sm text-[#e8e8f0]">Integration sync failure alerts</span>
          </label>
        </div>
      </Card>

      {/* Data Sync Settings */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Data Sync</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-[#1a1a26] rounded-lg">
            <div>
              <p className="text-sm font-medium text-[#e8e8f0]">Auto-sync frequency</p>
              <p className="text-xs text-[#8888a0]">Automatically pull data from all connected sources</p>
            </div>
            <select className="bg-[#0a0a0f] border border-[#2a2a3a] rounded-lg px-3 py-1.5 text-sm text-[#e8e8f0]">
              <option>Every hour</option>
              <option>Every 4 hours</option>
              <option>Every 12 hours</option>
              <option>Daily</option>
              <option>Manual only</option>
            </select>
          </div>
        </div>
      </Card>
    </div>
  );
}
