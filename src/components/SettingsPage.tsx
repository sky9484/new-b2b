import React from 'react';
import { Shield, Key, Bell, CreditCard, Building, Globe, Smartphone, Lock } from 'lucide-react';
import { cn } from '../lib/utils';

export function SettingsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-blue-slate/60 dark:text-platinum/60 text-sm mt-1">Manage your account preferences and security configurations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-1">
          <SettingsTab icon={<Building />} label="Company Profile" active />
          <SettingsTab icon={<Shield />} label="Security & API" />
          <SettingsTab icon={<CreditCard />} label="Billing" />
          <SettingsTab icon={<Bell />} label="Notifications" />
          <SettingsTab icon={<Globe />} label="Preferences" />
        </div>

        <div className="md:col-span-3 space-y-6">
          <div className="bg-white dark:bg-dark-surface border border-blue-slate/10 dark:border-blue-slate/30 rounded-3xl p-6 sm:p-8 shadow-sm">
            <h2 className="text-lg font-bold border-b border-platinum dark:border-blue-slate/30 pb-4 mb-6">Company Information</h2>
            
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-blue-slate/70 dark:text-platinum/70">Company Name</label>
                  <input type="text" defaultValue="Acme Sdn Bhd" className="w-full bg-platinum dark:bg-dark-bg border border-blue-slate/10 dark:border-blue-slate/30 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-pacific-blue/50 focus:ring-1 focus:ring-pacific-blue/50 transition-all font-medium" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-blue-slate/70 dark:text-platinum/70">Registration Number</label>
                  <input type="text" defaultValue="202401058392" className="w-full bg-platinum dark:bg-dark-bg border border-blue-slate/10 dark:border-blue-slate/30 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-pacific-blue/50 focus:ring-1 focus:ring-pacific-blue/50 transition-all font-medium" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-blue-slate/70 dark:text-platinum/70">Registered Address</label>
                <input type="text" defaultValue="Level 42, Petronas Twin Towers, KLCC, 50088 Kuala Lumpur, Malaysia" className="w-full bg-platinum dark:bg-dark-bg border border-blue-slate/10 dark:border-blue-slate/30 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-pacific-blue/50 focus:ring-1 focus:ring-pacific-blue/50 transition-all font-medium" />
              </div>

              <div className="pt-4 flex justify-end">
                <button className="bg-pacific-blue hover:bg-pacific-blue/90 text-white font-bold py-2.5 px-6 rounded-xl transition-colors shadow-lg shadow-pacific-blue/20">
                  Save Changes
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-dark-surface border border-blue-slate/10 dark:border-blue-slate/30 rounded-3xl p-6 sm:p-8 shadow-sm">
            <h2 className="text-lg font-bold border-b border-platinum dark:border-blue-slate/30 pb-4 mb-6">API Keys & Webhooks</h2>
            
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-platinum dark:bg-dark-bg border border-blue-slate/10 dark:border-blue-slate/30">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-sm flex items-center gap-2">
                      Live Secret Key
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">Restricted</span>
                    </h3>
                    <p className="text-xs text-blue-slate/60 mt-1">Used for server-side API calls</p>
                  </div>
                  <button className="text-sm font-bold text-pacific-blue hover:text-pacific-blue/80 transition-colors">Reveal</button>
                </div>
                <div className="font-mono text-sm bg-blue-slate/5 dark:bg-black/20 p-3 rounded-lg border border-blue-slate/10 dark:border-blue-slate/30 break-all">
                  sk_live_51O******************************************************
                </div>
              </div>

              <div className="pt-2">
                <button className="flex items-center gap-2 text-sm font-bold text-blue-slate hover:text-pacific-blue transition-colors">
                  <Key className="w-4 h-4" /> Generate New API Key
                </button>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-dark-surface border border-blue-slate/10 dark:border-blue-slate/30 rounded-3xl p-6 sm:p-8 shadow-sm border-tangerine/30">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-tangerine/10 text-tangerine flex items-center justify-center shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Two-Factor Authentication</h3>
                <p className="text-sm text-blue-slate/70 dark:text-platinum/70 mb-4">Add an extra layer of security to your account by requesting a code upon login.</p>
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-tangerine/10 text-tangerine border border-tangerine/20">Enabled</span>
                  <button className="text-sm font-bold text-pacific-blue hover:text-pacific-blue/80">Manage Device</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingsTab({ icon, label, active }: { icon: React.ReactElement<{ className?: string }>, label: string, active?: boolean }) {
  return (
    <button className={cn(
      "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-pacific-blue text-left",
      active 
        ? "bg-white dark:bg-dark-surface text-pacific-blue dark:text-pacific-blue font-bold shadow-sm border border-blue-slate/10 dark:border-blue-slate/30" 
        : "text-blue-slate/70 dark:text-platinum/70 hover:text-blue-slate dark:hover:text-white hover:bg-platinum dark:hover:bg-dark-surface font-medium border border-transparent"
    )}>
      {React.cloneElement(icon as any, {
        className: cn("w-5 h-5", active ? "text-pacific-blue" : "text-current"),
      })}
      <span>{label}</span>
    </button>
  );
}
