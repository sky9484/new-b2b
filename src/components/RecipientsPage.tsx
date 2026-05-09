import React, { useState } from 'react';
import { Users, UserPlus, Search, MoreVertical, Edit2, Trash2, Send } from 'lucide-react';
import { cn } from '../lib/utils';
import { SendMoneyModal } from './SendMoneyModal';

const mockRecipients = [
  { id: 1, name: 'Juan Dela Cruz', bank: 'BDO Unibank', account: 'SPL24091', country: 'Philippines', currency: 'PHP', email: 'juan@example.ph', initial: 'JD' },
  { id: 2, name: 'Maria Santos', bank: 'BPI', account: 'SPL24090', country: 'Philippines', currency: 'PHP', email: 'maria.santos@company.ph', initial: 'MS' },
  { id: 3, name: 'Jose Reyes', bank: 'Metrobank', account: 'SPL24089', country: 'Philippines', currency: 'PHP', email: 'jreyes@business.ph', initial: 'JR' },
  { id: 4, name: 'PT Angkasa Maju', bank: 'Bank Mandiri', account: 'ID92348', country: 'Indonesia', currency: 'IDR', email: 'finance@angkasa.id', initial: 'PA' },
  { id: 5, name: 'Siam Trading Co.', bank: 'Kasikornbank', account: 'TH49382', country: 'Thailand', currency: 'THB', email: 'billing@siamtrading.th', initial: 'ST' },
];

export function RecipientsPage() {
  const [search, setSearch] = useState('');
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);

  const filtered = mockRecipients.filter(r => 
    r.name.toLowerCase().includes(search.toLowerCase()) || 
    r.bank.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Recipients</h1>
          <p className="text-blue-slate/60 dark:text-platinum/60 text-sm mt-1">Manage your corporate beneficiaries across Southeast Asia.</p>
        </div>
        <button className="bg-pacific-blue hover:bg-pacific-blue/90 text-white font-bold py-2.5 px-5 rounded-xl transition-colors shadow-lg shadow-pacific-blue/20 flex items-center gap-2">
          <UserPlus className="w-4 h-4" /> Add Recipient
        </button>
      </div>

      <div className="bg-white dark:bg-dark-surface border border-blue-slate/10 dark:border-blue-slate/30 rounded-3xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-platinum dark:border-blue-slate/30 bg-platinum/50 dark:bg-dark-bg/50">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-slate/40" />
            <input 
              type="text" 
              placeholder="Search recipients..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white dark:bg-dark-bg border border-blue-slate/10 dark:border-blue-slate/30 rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-pacific-blue/50 focus:ring-1 focus:ring-pacific-blue/50 transition-all font-medium text-blue-slate dark:text-white placeholder:text-blue-slate/40"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 sm:p-6">
          {filtered.map(r => (
            <div key={r.id} className="border border-blue-slate/10 dark:border-blue-slate/30 rounded-2xl p-5 hover:border-pacific-blue/30 dark:hover:border-pacific-blue/30 transition-all group bg-platinum/20 dark:bg-dark-bg/20 hover:bg-white dark:hover:bg-dark-surface hover:shadow-md">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-slate/10 dark:bg-blue-slate/80 text-blue-slate dark:text-platinum flex items-center justify-center font-bold text-lg">
                  {r.initial}
                </div>
                <button className="p-1.5 text-blue-slate/40 hover:text-blue-slate dark:hover:text-white transition-colors rounded-lg hover:bg-platinum dark:hover:bg-dark-bg opacity-0 group-hover:opacity-100 focus:opacity-100">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
              
              <h3 className="font-bold text-lg text-blue-slate dark:text-white mb-1 truncate">{r.name}</h3>
              <p className="text-sm text-blue-slate/60 dark:text-platinum/60 mb-4 truncate">{r.email}</p>
              
              <div className="space-y-2 pt-4 border-t border-blue-slate/10 dark:border-blue-slate/30">
                <div className="flex justify-between text-sm">
                  <span className="text-blue-slate/50">Bank</span>
                  <span className="font-medium text-blue-slate dark:text-platinum">{r.bank}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-blue-slate/50">Account</span>
                  <span className="font-mono font-medium text-blue-slate dark:text-platinum">{r.account}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-blue-slate/50">Country</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium text-blue-slate dark:text-platinum">{r.country}</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-platinum dark:bg-dark-bg text-blue-slate/60">{r.currency}</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex gap-2">
                <button 
                  onClick={() => setIsSendModalOpen(true)}
                  className="flex-1 py-2 text-sm font-bold text-pacific-blue bg-pacific-blue/10 hover:bg-pacific-blue/20 rounded-xl transition-colors"
                >
                  Send Money
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {filtered.length === 0 && (
          <div className="p-12 text-center text-blue-slate/50 font-medium">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>No recipients found matching matching your search.</p>
          </div>
        )}
      </div>
      <SendMoneyModal isOpen={isSendModalOpen} onClose={() => setIsSendModalOpen(false)} />
    </div>
  );
}
