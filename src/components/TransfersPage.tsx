import React, { useState } from 'react';
import { Send, ArrowRightLeft, ArrowUpRight, Search, FileText, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import { SendMoneyModal } from './SendMoneyModal';

const mockTransfers = [
  { id: 'TRX-83921', date: 'Today, 10:42 AM', recipient: 'Juan Dela Cruz', bank: 'BDO Unibank', sent: 'MYR 2,500.00', received: 'PHP 31,250.00', status: 'Settled', type: 'Outbound' },
  { id: 'TRX-83920', date: 'Yesterday, 3:15 PM', recipient: 'Maria Santos', bank: 'BPI', sent: 'MYR 1,800.00', received: 'PHP 22,500.00', status: 'Pending', type: 'Outbound' },
  { id: 'TRX-83919', date: 'May 6, 2026, 9:00 AM', recipient: 'Jose Reyes', bank: 'Metrobank', sent: 'MYR 12,000.00', received: 'PHP 150,000.00', status: 'Settled', type: 'Outbound' },
  { id: 'TRX-83918', date: 'May 5, 2026, 2:30 PM', recipient: 'Ana Lim', bank: 'UnionBank', sent: 'MYR 4,200.00', received: 'PHP 52,500.00', status: 'Failed', type: 'Outbound' },
  { id: 'TRX-83917', date: 'May 2, 2026, 11:15 AM', recipient: 'Pedro Penduko', bank: 'BDO Unibank', sent: 'MYR 850.00', received: 'PHP 10,625.00', status: 'Settled', type: 'Outbound' },
];

export function TransfersPage() {
  const [filter, setFilter] = useState('All');
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  
  const filtered = filter === 'All' ? mockTransfers : mockTransfers.filter(t => t.status === filter);

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Transfers</h1>
          <p className="text-blue-slate/60 dark:text-platinum/60 text-sm mt-1">View and manage your recent cross-border transactions.</p>
        </div>
        <button 
          onClick={() => setIsSendModalOpen(true)}
          className="bg-pacific-blue hover:bg-pacific-blue/90 text-white font-bold py-2.5 px-5 rounded-xl transition-colors shadow-lg shadow-pacific-blue/20 flex items-center gap-2"
        >
          <Send className="w-4 h-4" /> New Transfer
        </button>
      </div>

      <div className="bg-white dark:bg-dark-surface border border-blue-slate/10 dark:border-blue-slate/30 rounded-3xl overflow-hidden shadow-sm">
        <div className="p-4 sm:p-6 border-b border-platinum dark:border-blue-slate/30 flex flex-col sm:flex-row justify-between items-center gap-4 bg-platinum/50 dark:bg-dark-bg/50">
          <div className="flex bg-platinum dark:bg-dark-bg p-1 rounded-lg w-full sm:w-auto">
            {['All', 'Settled', 'Pending', 'Failed'].map(f => (
              <button 
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "flex-1 sm:flex-none px-4 py-1.5 rounded-md text-sm font-semibold transition-colors",
                  filter === f 
                    ? "bg-white dark:bg-dark-surface text-blue-slate dark:text-white shadow-sm"
                    : "text-blue-slate/60 dark:text-platinum/60 hover:text-blue-slate dark:hover:text-platinum"
                )}
              >
                {f}
              </button>
            ))}
          </div>
          
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-slate/40" />
            <input 
              type="text" 
              placeholder="Search by ID or name..." 
              className="w-full bg-platinum dark:bg-dark-bg border border-blue-slate/10 dark:border-blue-slate/30 rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-pacific-blue/50 focus:ring-1 focus:ring-pacific-blue/50 transition-all font-medium text-blue-slate dark:text-white placeholder:text-blue-slate/40"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-platinum dark:border-blue-slate/30 text-[10px] uppercase tracking-wider text-blue-slate/50 font-bold bg-platinum/20 dark:bg-dark-bg/20">
                <th className="p-4 sm:p-6 font-bold">Transaction</th>
                <th className="p-4 sm:p-6 font-bold">Recipient</th>
                <th className="p-4 sm:p-6 font-bold text-right">Amount Sent</th>
                <th className="p-4 sm:p-6 font-bold text-right">Amount Received</th>
                <th className="p-4 sm:p-6 font-bold">Status</th>
                <th className="p-4 sm:p-6 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-platinum dark:divide-blue-slate/30">
              {filtered.map(t => (
                <tr key={t.id} className="hover:bg-platinum/50 dark:hover:bg-dark-bg/50 transition-colors group">
                  <td className="p-4 sm:p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-platinum dark:bg-dark-bg flex items-center justify-center shrink-0">
                        <ArrowUpRight className="w-5 h-5 text-pacific-blue" />
                      </div>
                      <div>
                        <div className="font-semibold text-sm">{t.id}</div>
                        <div className="text-xs text-blue-slate/60 dark:text-platinum/60 mt-0.5">{t.date}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 sm:p-6">
                    <div className="font-semibold text-sm">{t.recipient}</div>
                    <div className="text-xs text-blue-slate/60 dark:text-platinum/60 mt-0.5 font-mono">{t.bank}</div>
                  </td>
                  <td className="p-4 sm:p-6 text-right font-mono font-semibold text-sm">{t.sent}</td>
                  <td className="p-4 sm:p-6 text-right font-mono font-semibold text-sm text-pacific-blue/90">{t.received}</td>
                  <td className="p-4 sm:p-6">
                    <div className={cn(
                      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border",
                      t.status === 'Settled' ? "bg-pacific-blue/10 text-pacific-blue border-pacific-blue/20" : 
                      t.status === 'Pending' ? "bg-tangerine/10 text-tangerine border-tangerine/20" : 
                      "bg-red-500/10 text-red-500 border-red-500/20"
                    )}>
                      {t.status === 'Settled' && <CheckCircle2 className="w-3 h-3" />}
                      {t.status === 'Pending' && <Clock className="w-3 h-3" />}
                      {t.status === 'Failed' && <AlertCircle className="w-3 h-3" />}
                      {t.status}
                    </div>
                  </td>
                  <td className="p-4 sm:p-6 text-right">
                    <button className="p-2 text-blue-slate/40 hover:text-pacific-blue transition-colors rounded-lg hover:bg-pacific-blue/10" aria-label="View Receipt">
                      <FileText className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-blue-slate/50 font-medium">
                    No transfers found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <SendMoneyModal isOpen={isSendModalOpen} onClose={() => setIsSendModalOpen(false)} />
    </div>
  );
}
