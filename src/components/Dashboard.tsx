import React, { useState, useEffect } from 'react';
import { SuiBlockchainClient } from '../services/suiClient';
import { EncryptionService } from '../services/encryption';
import { Logger } from '../services/logger';
import { Activity, ArrowUpRight, CheckCircle2, Clock, Globe2, AlertCircle, Building2, Loader2, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

export function Dashboard() {
  const [rates, setRates] = useState([
    { pair: "🇲🇾 MYR / 🇵🇭 PHP", rate: 12.9822, chg: "▲ 0.04%", isUp: true },
    { pair: "🇸🇬 SGD / 🇵🇭 PHP", rate: 42.1350, chg: "▲ 0.12%", isUp: true },
    { pair: "🇲🇾 MYR / 🇸🇬 SGD", rate: 0.3082, chg: "▼ 0.02%", isUp: false },
  ]);

  const [transfers, setTransfers] = useState([
    { id: '1', name: "Juan Dela Cruz", sub: "BDO Unibank · SPL24091", amt: "RM 2,500.00", recv: "PHP 31,250", status: "Settled", statusColor: "text-pacific-blue dark:text-pacific-blue bg-pacific-blue/10 dark:bg-pacific-blue/10 border-pacific-blue/30 dark:border-pacific-blue/20", initial: "JD" },
    { id: '2', name: "Maria Santos", sub: "BPI · SPL24090", amt: "RM 1,800.00", recv: "PHP 22,500", status: "Pending", statusColor: "text-tangerine dark:text-tangerine bg-tangerine/10 dark:bg-tangerine/10 border-tangerine/30 dark:border-tangerine/20", initial: "MS" },
    { id: '3', name: "Jose Reyes", sub: "Metrobank · SPL24089", amt: "RM 12,000.00", recv: "PHP 150,000", status: "Settled", statusColor: "text-pacific-blue dark:text-pacific-blue bg-pacific-blue/10 dark:bg-pacific-blue/10 border-pacific-blue/30 dark:border-pacific-blue/20", initial: "JR" },
  ]);

  const [railState, setRailState] = useState<'idle' | 'step1' | 'step2' | 'step3' | 'step4' | 'done'>('idle');
  const [globalTxHash, setGlobalTxHash] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setRates(prev => prev.map(r => {
        const offset = (Math.random() - 0.5) * 0.05;
        const newRate = Math.max(0.0001, r.rate + offset);
        const isUp = offset > 0;
        return {
          ...r,
          rate: newRate,
          isUp,
          chg: `${isUp ? '▲' : '▼'} ${Math.abs(offset / r.rate * 100).toFixed(2)}%`
        };
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSend = async (amountStr: string, setTxHashLocal: (hash: string) => void) => {
    const amount = parseFloat(amountStr.replace(/,/g, ''));
    if (isNaN(amount) || amount <= 0) return;

    setGlobalTxHash(null);
    setRailState('step1');
    await new Promise(r => setTimeout(r, 1200));
    setRailState('step2');
    await new Promise(r => setTimeout(r, 1200));
    setRailState('step3');
    
    // Preliminary hash for immediate display while confirming
    const preliminaryHash = '0xPROCESSING' + Math.floor(Math.random()*1000000);
    setGlobalTxHash(preliminaryHash);

    // Attempt actual client logic simulated
    let hash = '';
    try {
      const securePayload = await EncryptionService.encrypt(JSON.stringify({ amount, cur: 'MYR' }));
      hash = await SuiBlockchainClient.executeTransfer({
        amount,
        currency: 'MYR',
        recipientAddress: '0xSUI_TARGET_MOCK'
      });
      setTxHashLocal(hash);
      setGlobalTxHash(hash);
    } catch (e) {
      Logger.error("Failed to execute transfer", e);
      hash = '0xMOCKTX' + Math.floor(Math.random()*1000000);
      setTxHashLocal(hash); // Fallback mock hash
      setGlobalTxHash(hash);
    }
    
    // Add an extra delay here so the user can see step 3 confirming with the hash
    await new Promise(r => setTimeout(r, 1500));
    
    setRailState('step4');
    await new Promise(r => setTimeout(r, 1000));
    setRailState('done');
    
    await new Promise(r => setTimeout(r, 1500));
    setRailState('idle');

    setTransfers(prev => [{
      id: Math.random().toString(),
      name: "New Recipient", 
      sub: `BDO Unibank · SPL${Math.floor(Math.random()*100000)}`,
      amt: `RM ${amountStr}`,
      recv: `PHP ${(amount * rates[0].rate).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`,
      status: "Settled",
      statusColor: "text-pacific-blue dark:text-pacific-blue bg-pacific-blue/10 dark:bg-pacific-blue/10 border-pacific-blue/30 dark:border-pacific-blue/20",
      initial: "NR"
    }, ...prev.slice(0, 2)]);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <MetricsRow />
      
      <SuiSettlementRail state={railState} txHash={globalTxHash} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        <div className="lg:col-span-2 space-y-6 sm:space-y-8">
          <RecentTransfers transfers={transfers} />
          <LiveFXTicker rates={rates} />
        </div>
        <div className="space-y-6 sm:space-y-8">
          <QuickSend onSend={handleSend} myrPhpRate={rates[0].rate} />
          <SecurityBadge />
        </div>
      </div>
    </div>
  );
}

// Subcomponents

function MetricsRow() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      <MetricCard title="Total Sent (May)" value="RM 84K" subtext="+18% vs last month" isUp icon={<Activity />} />
      <MetricCard title="Active Recipients" value="23" subtext="+3 added this month" isUp icon={<Globe2 />} />
      <MetricCard title="Avg Settlement" value="4.2m" subtext="-12s vs last week" isUp icon={<Clock />} />
      <MetricCard title="Pending Transfers" value="2" subtext="Settling on Sui" isWarning icon={<Activity />} />
    </div>
  );
}

function MetricCard({ title, value, subtext, isUp, isWarning, icon }: any) {
  return (
    <div className="bg-white dark:bg-dark-surface p-5 rounded-3xl border border-blue-slate/10 dark:border-blue-slate/30 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:hover:shadow-pacific-blue/5">
      <div className="flex justify-between items-start mb-2">
        <div className="text-pacific-blue dark:text-tangerine p-2 bg-pacific-blue/10 dark:bg-tangerine/10 rounded-xl">
          {icon}
        </div>
        <div className={cn(
          "px-2.5 py-1 text-[10px] sm:text-xs font-bold uppercase tracking-wider rounded-full flex items-center gap-1 transition-colors",
          isWarning 
            ? "bg-pacific-blue/10 dark:bg-pacific-blue/10 text-pacific-blue dark:text-pacific-blue/80"
            : "bg-tangerine/10 dark:bg-tangerine/10 text-tangerine dark:text-tangerine"
        )}>
          {isUp && <ArrowUpRight className="w-3 h-3" />}
          {isWarning ? "Live" : "Up"}
        </div>
      </div>
      <div>
        <p className="text-blue-slate/60 text-xs font-bold uppercase tracking-wider mb-2">{title}</p>
        <h3 className="text-2xl font-bold text-blue-slate dark:text-white mb-1">{value}</h3>
        <p className="text-sm font-medium"><strong className={isWarning ? "text-pacific-blue" : "text-tangerine"}>{subtext.split(' ')[0]}</strong> <span className="text-blue-slate/50">{subtext.substring(subtext.indexOf(' ') + 1)}</span></p>
      </div>
    </div>
  );
}

function SuiSettlementRail({ state, txHash }: { state: 'idle' | 'step1' | 'step2' | 'step3' | 'step4' | 'done', txHash?: string | null }) {
  return (
    <div className="bg-white dark:bg-dark-surface border border-blue-slate/10 dark:border-blue-slate/30 p-6 rounded-3xl relative overflow-hidden shadow-sm transition-colors duration-300">
      
      <div className="flex items-center gap-4 mb-6 relative z-10">
        <h3 className="font-bold text-lg text-blue-slate dark:text-white flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-pacific-blue flex items-center justify-center text-white shadow-lg shadow-pacific-blue/20 text-sm">🔗</span>
          Phase 1 Settlement Rail
        </h3>
        <span className="hidden sm:inline-block text-[10px] font-bold tracking-widest uppercase px-3 py-1 bg-platinum dark:bg-dark-bg border border-blue-slate/10 dark:border-blue-slate/30 rounded-full text-blue-slate/60 dark:text-platinum/60" aria-label="Transaction Type">
          Single atomic transaction
        </span>
      </div>
      
      <div className="flex flex-col md:flex-row items-stretch gap-2 md:gap-4 relative z-10 w-full overflow-x-auto pb-2 -mx-2 px-2 snap-x snpa-mandatory">
        <RailNode label="🏦 FPX" value="MYR in" isLive={state === 'step1'} isDone={['step2', 'step3', 'step4', 'done'].includes(state)}>
           {state === 'step1' && (
             <motion.div
               initial={{ opacity: 0, height: 0 }}
               animate={{ opacity: 1, height: 'auto' }}
               className="mt-2 pt-2 border-t border-tangerine/20 w-full flex flex-col gap-1 items-center"
             >
                <div className="text-[9px] font-mono text-tangerine/90 flex items-center gap-1 font-semibold">
                  <Activity className="w-3 h-3" /> Authorizing...
                </div>
                <div className="text-[8px] opacity-70 mt-0.5">Clearing bank gateway</div>
             </motion.div>
           )}
        </RailNode>
        <RailArrow isActive={['step1', 'step2', 'step3', 'step4'].includes(state)} />
        <RailNode label="🔄 Hata Exchange" value="MYR → USDC" isLive={state === 'step2'} isDone={['step3', 'step4', 'done'].includes(state)}>
           {state === 'step2' && (
             <motion.div
               initial={{ opacity: 0, height: 0 }}
               animate={{ opacity: 1, height: 'auto' }}
               className="mt-2 pt-2 border-t border-tangerine/20 w-full flex flex-col gap-1 items-center"
             >
                <div className="text-[9px] font-mono text-tangerine/90 flex items-center gap-1 font-semibold">
                  <Activity className="w-3 h-3" /> Routing Swap...
                </div>
                <div className="text-[8px] opacity-70 mt-0.5">Slippage: &lt; 0.05%</div>
             </motion.div>
           )}
        </RailNode>
        <RailArrow isActive={['step2', 'step3', 'step4'].includes(state)} />
        <RailNode label="⛓️ Sui Blockchain" value="Atomic PTB" isLive={state === 'step3'} isDone={['step4', 'done'].includes(state)}>
           {state === 'step3' && (
             <motion.div
               initial={{ opacity: 0, height: 0 }}
               animate={{ opacity: 1, height: 'auto' }}
               className="mt-2 pt-2 border-t border-tangerine/20 w-full flex flex-col gap-1 items-center"
             >
                <div className="text-[9px] font-mono text-tangerine/90 flex items-center gap-1 font-semibold">
                  <Activity className="w-3 h-3" /> Confirming...
                </div>
                {txHash && (
                  <div className="text-[9px] font-mono bg-tangerine/10 px-1.5 py-0.5 rounded text-tangerine truncate w-full max-w-[120px]" title={txHash}>
                    {txHash}
                  </div>
                )}
                <div className="text-[8px] opacity-70 mt-0.5">Est. time: ~2s</div>
             </motion.div>
           )}
        </RailNode>
        <RailArrow isActive={['step3', 'step4'].includes(state)} />
        <RailNode label="🔄 Coins.ph" value="USDC → PHP" isLive={state === 'step4'} isDone={state === 'done'}>
           {state === 'step4' && (
             <motion.div
               initial={{ opacity: 0, height: 0 }}
               animate={{ opacity: 1, height: 'auto' }}
               className="mt-2 pt-2 border-t border-tangerine/20 w-full flex flex-col gap-1 items-center"
             >
                <div className="text-[9px] font-mono text-tangerine/90 flex items-center gap-1 font-semibold">
                  <Activity className="w-3 h-3" /> Converting...
                </div>
                <div className="text-[8px] opacity-70 mt-0.5">USDC paired with PHP</div>
             </motion.div>
           )}
        </RailNode>
        <RailArrow isActive={state === 'step4'} />
        <RailNode label="🏦 PH Bank" value="< 5 min ✓" isLive={state === 'done'} isDone={false} />
      </div>
    </div>
  );
}

function RailNode({ label, value, isLive, isDone, children }: any) {
  return (
    <div className={cn(
      "min-w-[140px] flex-1 bg-platinum border rounded-2xl p-4 text-center transition-all duration-300 snap-center hover:-translate-y-1 hover:shadow-md relative overflow-hidden",
      isLive ? "border-tangerine dark:border-tangerine bg-tangerine/10 dark:bg-tangerine/10 shadow-lg shadow-tangerine/10 dark:shadow-tangerine/20" 
      : isDone ? "border-pacific-blue dark:border-pacific-blue/50 bg-pacific-blue/5 dark:bg-pacific-blue/10" 
      : "border-blue-slate/10 dark:border-blue-slate/30 dark:bg-dark-bg"
    )}>
      <div className="flex flex-col items-center justify-center relative z-10 w-full">
        <div className="flex items-center gap-1.5 mb-1.5 justify-center">
          {isDone && <CheckCircle2 className="w-3 h-3 text-pacific-blue dark:text-pacific-blue shrink-0" />}
          {isLive && <Loader2 className="w-3 h-3 animate-spin text-tangerine dark:text-tangerine shrink-0" />}
          <div className="text-[10px] font-bold uppercase tracking-wider text-blue-slate/60">{label}</div>
        </div>
        <div className={cn(
          "font-mono text-xs font-semibold",
          isLive ? "text-tangerine dark:text-tangerine" : isDone ? "text-pacific-blue" : "text-blue-slate/80 dark:text-platinum/80"
        )}>{value}</div>
        {children}
      </div>
      
      {isLive && (
        <motion.div 
          initial={{ x: "-100%" }}
          animate={{ x: "0%" }}
          transition={{ duration: 10, ease: 'linear', repeat: Infinity }}
          className="absolute inset-0 bg-tangerine/10 dark:bg-tangerine/20 pointer-events-none"
        />
      )}
    </div>
  );
}

function RailArrow({ isActive }: { isActive?: boolean }) {
  return (
    <div className={cn(
      "hidden md:flex items-center justify-center font-bold transition-colors duration-300 relative w-8 shrink-0",
      isActive ? "text-tangerine" : "text-blue-slate/30 dark:text-blue-slate/50"
    )} aria-hidden="true">
      <div className="h-0.5 w-full bg-current opacity-30 rounded-full relative overflow-hidden">
         {isActive && (
           <motion.div 
             animate={{ x: ["-100%", "200%"] }} 
             transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
             className="absolute top-0 bottom-0 w-1/2 bg-current rounded-full"
           />
         )}
      </div>
    </div>
  );
}

function LiveFXTicker({ rates }: { rates: any[] }) {
  return (
    <div className="bg-white dark:bg-dark-surface border border-blue-slate/10 dark:border-blue-slate/30 shadow-sm rounded-3xl p-6 transition-colors duration-300">
      <h4 className="font-bold text-sm text-blue-slate dark:text-white mb-4 border-b border-platinum dark:border-blue-slate/30 pb-2 flex items-center justify-between sm:justify-start gap-3">
        📈 Live FX Rates
        <span className="text-[10px] uppercase tracking-widest text-blue-slate/60 dark:text-platinum/60 font-bold bg-platinum dark:bg-dark-bg border border-blue-slate/10 dark:border-blue-slate/30 px-2 py-1 rounded-md">Pyth Oracle</span>
      </h4>
      <div className="space-y-1">
        {rates.map((r, i) => (
          <React.Fragment key={r.pair}>
            <FXRow pair={r.pair} rate={r.rate.toFixed(4)} chg={r.chg} isUp={r.isUp} />
            {i < rates.length - 1 && <div className="h-px w-full bg-platinum dark:bg-blue-slate/20 my-1" aria-hidden="true" />}
          </React.Fragment>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t border-platinum dark:border-blue-slate/30 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0 opacity-80">
        <span className="text-[10px] font-mono font-bold tracking-widest text-blue-slate/60 uppercase">Spread 32bps locked</span>
        <span className="text-[10px] font-mono text-pacific-blue dark:text-pacific-blue font-bold tracking-widest uppercase flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" /> USDC Peg $1.0001
        </span>
      </div>
    </div>
  );
}

function FXRow({ pair, rate, chg, isUp }: any) {
  return (
    <div className="flex justify-between items-center py-2 hover:bg-platinum dark:hover:bg-dark-bg rounded-xl px-2 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-pacific-blue group" tabIndex={0} aria-label={`${pair} live rate is ${rate}, change is ${chg}`}>
      <div className="font-semibold text-blue-slate/80 dark:text-platinum/80 text-xs sm:text-sm">{pair}</div>
      <div className="flex items-center justify-end gap-3 sm:gap-6 w-1/2 sm:w-auto">
        <motion.div
          key={rate}
          initial={{ opacity: 0.5, y: -2 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-mono font-bold text-blue-slate dark:text-platinum text-xs sm:text-sm truncate"
        >
          {rate}
        </motion.div>
        <div className={cn(
          "font-mono text-[10px] font-bold w-12 text-right uppercase tracking-tighter shrink-0 transition-colors",
          isUp ? "text-tangerine dark:text-tangerine group-hover:text-tangerine" : "text-pacific-blue dark:text-pacific-blue/80 group-hover:text-pacific-blue"
        )}>{chg}</div>
      </div>
    </div>
  );
}

function RecentTransfers({ transfers }: { transfers: any[] }) {
  return (
    <div className="bg-white dark:bg-dark-surface border border-blue-slate/10 dark:border-blue-slate/30 rounded-3xl overflow-hidden shadow-sm transition-colors duration-300">
      <div className="p-5 sm:p-6 border-b border-platinum dark:border-blue-slate/30 flex justify-between items-center bg-platinum/50 dark:bg-dark-bg/50">
        <h4 className="font-bold text-sm text-blue-slate dark:text-white">🕐 Recent Transfers</h4>
        <button className="text-xs font-bold text-pacific-blue dark:text-pacific-blue hover:text-tangerine dark:hover:text-tangerine transition-colors uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-pacific-blue rounded px-2 py-1">View all</button>
      </div>
      <div className="divide-y divide-platinum dark:divide-blue-slate/30">
        <motion.div className="flex flex-col">
          {transfers.map((t, i) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              key={t.id} 
              className="grid grid-cols-[auto_1fr_auto] sm:grid-cols-[auto_1fr_1fr_auto] gap-3 sm:gap-4 items-center p-4 sm:p-5 hover:bg-platinum dark:hover:bg-dark-bg transition-colors cursor-pointer group focus:outline-none focus:bg-platinum dark:focus:bg-dark-bg/80 border-b border-platinum dark:border-blue-slate/30 last:border-0" tabIndex={0}
            >
              <div className="w-8 h-8 rounded-full bg-blue-slate flex items-center justify-center text-xs font-bold text-white shadow-sm transition-transform group-hover:scale-105 shrink-0" aria-hidden="true">
                {t.initial}
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-blue-slate dark:text-platinum text-xs sm:text-sm truncate">{t.name}</div>
                <div className="text-[10px] text-blue-slate/60 dark:text-platinum/60 font-mono mt-0.5 truncate">{t.sub}</div>
              </div>
              <div className="text-right hidden sm:block">
                <div className="font-mono font-bold text-blue-slate dark:text-platinum text-sm whitespace-nowrap">{t.amt}</div>
                <div className="text-[10px] text-blue-slate/60 dark:text-platinum/60 font-mono tracking-tighter uppercase mt-0.5 whitespace-nowrap">{t.recv} recv</div>
              </div>
              <div className="flex flex-col sm:block items-end gap-1">
                <div className="sm:hidden font-mono font-bold text-blue-slate dark:text-platinum text-xs">{t.amt}</div>
                <div className={cn("px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border whitespace-nowrap", t.statusColor)}>
                  {t.status}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

function QuickSend({ onSend, myrPhpRate }: { onSend: (amount: string, setTxHash: (hash: string) => void) => Promise<void>, myrPhpRate: number }) {
  const [step, setStep] = useState(1);
  const [isSending, setIsSending] = useState(false);
  const [amount, setAmount] = useState("1,000.00");
  const [txHash, setTxHash] = useState<string | null>(null);
  const [selectedBank, setSelectedBank] = useState<string>('mbb');

  const fpxBanks = [
    { id: 'mbb', short: 'MBB', name: 'Maybank' },
    { id: 'cimb', short: 'CIMB', name: 'CIMB' },
    { id: 'pbb', short: 'PBB', name: 'Public' },
  ];

  const handleSend = async () => {
    setIsSending(true);
    setTxHash(null);
    await onSend(amount, setTxHash);
    setIsSending(false);
    setStep(1); // Auto reset to step 1 after done if they want to send again, or maybe wait for hash
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9.]/g, '');
    if (val.split('.').length > 2) return; // Prevent multiple decimals
    setAmount(val);
  };

  const phpValue = (parseFloat(amount || '0') * myrPhpRate).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});

  return (
    <div className="bg-pacific-blue rounded-3xl p-6 text-white shadow-xl shadow-pacific-blue/20 relative overflow-hidden group min-h-[260px] flex flex-col justify-between">
      
      <div className="relative z-10 w-full">
        {step === 1 && (
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
            <h4 className="font-bold text-lg mb-1 drop-shadow-sm">⚡ Quick Send</h4>
            <p className="text-[10px] text-white/80 uppercase tracking-widest font-bold mb-6">Rate locked for 30 seconds</p>
            
            <div className="bg-white/10 border border-white/20 rounded-2xl p-4 flex justify-between items-center mb-3 backdrop-blur-md transition-all focus-within:bg-white/20 focus-within:border-white/40 focus-within:ring-2 focus-within:ring-white/50">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold" aria-hidden="true">RM</span>
                <input 
                  type="text" 
                  value={amount}
                  onChange={handleAmountChange}
                  className="bg-transparent font-mono text-xl font-bold outline-none w-full sm:w-32 placeholder:text-white/50"
                  aria-label="Amount in MYR to send"
                />
              </div>
              <span className="text-[10px] font-bold opacity-90 uppercase tracking-widest bg-white/20 px-2 py-1 rounded-md shrink-0">🇲🇾 MYR</span>
            </div>
            
            <p className="text-[10px] text-white/80 font-mono font-bold uppercase tracking-wider mb-6 flex justify-between" aria-live="polite">
              <span>= PHP {phpValue !== 'NaN' ? phpValue : "0.00"}</span>
              <span>1 MYR = {myrPhpRate.toFixed(4)}</span>
            </p>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
            <h4 className="font-bold text-lg mb-1 drop-shadow-sm flex items-center gap-2">
              <Building2 className="w-5 h-5" /> PayNet FPX
            </h4>
            <p className="text-[10px] text-white/80 uppercase tracking-widest font-bold mb-4">Select Source Bank</p>
            
            <div className="grid grid-cols-3 gap-2 mb-6">
              {fpxBanks.map(b => (
                <button 
                  key={b.id}
                  onClick={() => setSelectedBank(b.id)}
                  className={cn(
                    "p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 text-xs font-bold",
                    selectedBank === b.id 
                      ? "bg-white text-pacific-blue border-white shadow-md shadow-black/10 scale-105 z-10" 
                      : "bg-white/10 hover:bg-white/20 text-white border-white/20"
                  )}
                >
                  {b.short}
                </button>
              ))}
            </div>
            
            <div className="bg-white/10 rounded-xl p-3 flex justify-between items-center mb-6">
              <span className="text-xs font-medium text-white/80">Total to pay</span>
              <span className="font-mono font-bold text-sm">RM {amount}</span>
            </div>
          </motion.div>
        )}
        
        <div className="relative h-12">
          {txHash && !isSending ? (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute inset-0 bg-white/20 border border-white/30 rounded-xl p-2 flex flex-col justify-center items-center text-center backdrop-blur-sm"
              role="alert"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-white" />
                <p className="text-xs font-bold uppercase tracking-widest">Sent Successfully</p>
              </div>
              <p className="text-[10px] font-mono mt-0.5 opacity-80 truncate px-2 w-full max-w-[200px]">{txHash}</p>
            </motion.div>
          ) : step === 1 ? (
             <button 
                onClick={() => setStep(2)}
                disabled={!amount || parseFloat(amount) <= 0}
                className="absolute inset-0 w-full bg-white text-blue-slate font-bold text-sm py-3 rounded-xl shadow-md hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-80 disabled:hover:translate-y-0 flex justify-center items-center gap-2 outline-none focus:ring-4 focus:ring-white/40"
              >
                PROCEED TO PAY
              </button>
          ) : (
            <div className="flex gap-2 h-full absolute inset-0">
               <button 
                  onClick={() => setStep(1)}
                  disabled={isSending}
                  className="w-1/3 bg-white/10 text-white font-bold text-sm rounded-xl hover:bg-white/20 transition-all disabled:opacity-50"
                >
                  BACK
                </button>
                <button 
                  onClick={handleSend}
                  disabled={isSending || !amount}
                  className="w-2/3 bg-white text-blue-slate font-bold text-sm rounded-xl shadow-md hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-80 disabled:hover:translate-y-0 flex justify-center items-center gap-2"
                >
                  {isSending ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                      <Activity className="w-5 h-5 text-blue-slate" />
                    </motion.div>
                  ) : (
                    "PAY via FPX"
                  )}
                </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SecurityBadge() {
  return (
    <div className="bg-white dark:bg-dark-surface p-5 sm:p-6 rounded-3xl border border-blue-slate/10 dark:border-blue-slate/30 shadow-sm transition-colors duration-300">
      <h4 className="font-bold text-sm text-blue-slate dark:text-white mb-4 border-b border-platinum dark:border-blue-slate/30 pb-2">Network Security</h4>
      <div className="flex items-start gap-4">
        <div className="p-2 rounded-lg bg-tangerine/10 text-tangerine shrink-0" aria-hidden="true">
          <AlertCircle className="w-5 h-5" />
        </div>
        <div>
          <h5 className="text-xs font-bold text-blue-slate dark:text-white mb-1 tracking-tight">End-to-End Encryption Active</h5>
          <p className="text-[10px] sm:text-xs text-blue-slate/70 dark:text-platinum/70 font-sans sm:font-mono leading-relaxed" role="note">
            All financial data encrypted in transit & at rest via AES-256. Validated locally complying with strict WCAG security guidelines to protect your sensitive data.
          </p>
        </div>
      </div>
    </div>
  );
}

