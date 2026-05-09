import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Search, ChevronRight, Activity, CheckCircle2, ArrowRight, Building2, Building, RefreshCw, Layers, Send, ArrowUpRight, CreditCard, Landmark, Wallet } from 'lucide-react';
import { cn } from '../lib/utils';
import { EncryptionService } from '../services/encryption';
import { SuiBlockchainClient } from '../services/suiClient';

const mockRecipients = [
  { id: 1, name: 'Juan Dela Cruz', bank: 'BDO Unibank', account: 'SPL24091', country: 'Philippines', currency: 'PHP', initial: 'JD' },
  { id: 2, name: 'Maria Santos', bank: 'BPI', account: 'SPL24090', country: 'Philippines', currency: 'PHP', initial: 'MS' },
  { id: 3, name: 'PT Angkasa Maju', bank: 'Bank Mandiri', account: 'ID92348', country: 'Indonesia', currency: 'IDR', initial: 'PA' },
  { id: 4, name: 'John Smith', bank: 'Chase Bank', account: 'US45678', country: 'United States', currency: 'USD', initial: 'JS' },
];

const fpxBanks = [
  { id: 'mbb', name: 'Maybank2U', logo: <div className="w-12 h-12 rounded-full bg-[#FFCE00] flex items-center justify-center font-black text-black text-sm tracking-tighter shadow-sm border border-black/5">MB</div> },
  { id: 'cimb', name: 'CIMB Clicks', logo: <div className="w-12 h-12 rounded-xl bg-[#E4002B] flex items-center justify-center font-bold text-white text-sm shadow-sm shadow-[#E4002B]/20 border border-white/10">CIMB</div> },
  { id: 'pbb', name: 'Public Bank', logo: <div className="w-12 h-12 rounded-2xl bg-[#E3000F] flex items-center justify-center font-black text-white text-xs shadow-sm shadow-[#E3000F]/20 border border-white/10">PBB</div> },
  { id: 'rhb', name: 'RHB Now', logo: <div className="w-12 h-12 rounded-full bg-[#0067B1] flex items-center justify-center font-bold text-white text-sm shadow-sm shadow-[#0067B1]/20 border border-white/10">RHB</div> },
  { id: 'hlb', name: 'Hong Leong Connect', logo: <div className="w-12 h-12 rounded-[14px] bg-[#00519E] flex items-center justify-center font-bold text-white text-xs border-b-4 border-[#BE1E2D] shadow-sm">HLB</div> },
  { id: 'amb', name: 'AmBank', logo: <div className="w-12 h-12 rounded-lg bg-[#ED1C24] flex items-center justify-center font-bold text-[#FFD100] text-sm shadow-sm border border-[#FFD100]/20">Am</div> },
];

interface SendMoneyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SendMoneyModal({ isOpen, onClose }: SendMoneyModalProps) {
  const [step, setStep] = useState(1);
  const [selectedRecipient, setSelectedRecipient] = useState<any>(null);
  const [amount, setAmount] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'fpx' | 'card' | 'direct_debit'>('fpx');
  const [railState, setRailState] = useState<'idle' | 'fpnx' | 'exchange' | 'sui' | 'done'>('idle');
  const [recipientError, setRecipientError] = useState<string | null>(null);

  // Reset state when opened
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setSelectedRecipient(null);
      setAmount('');
      setIsSending(false);
      setTxHash(null);
      setSelectedBank(null);
      setSelectedPaymentMethod('fpx');
      setRailState('idle');
      setRecipientError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleProceedToFpx = () => {
    setStep(3); // Go to Payment selection
  };

  const handleRecipientSelect = (r: any) => {
    // Client-side validation to ensure currency and bank details are compatible
    const supportedCurrencies = ['PHP', 'IDR'];
    if (!supportedCurrencies.includes(r.currency)) {
      setRecipientError(`Transfers to ${r.currency} are not supported on this route.`);
      return;
    }
    
    // Example: Block specific un-partnered banks
    if (r.bank === 'Unsupported Bank') {
      setRecipientError(`Direct settlement to ${r.bank} is currently offline.`);
      return;
    }

    setRecipientError(null);
    setSelectedRecipient(r);
    setStep(2);
  };

  const handlePayAndSend = async () => {
    if (selectedPaymentMethod === 'fpx' && !selectedBank) return;
    setIsSending(true);
    setStep(4); // Transfer Progress
    
    // Simulate Rail Progress
    setRailState('fpnx');
    await new Promise(r => setTimeout(r, 1000));
    setRailState('exchange');
    await new Promise(r => setTimeout(r, 1000));
    setRailState('sui');
    
    try {
      const hash = await SuiBlockchainClient.executeTransfer({
        amount: parseFloat(amount),
        currency: 'MYR',
        recipientAddress: '0xSUI_TARGET_MOCK'
      });
      setTxHash(hash);
      
      await new Promise(r => setTimeout(r, 1000));
      setRailState('done');
    } catch (e) {
      console.error(e);
    } finally {
      setIsSending(false);
    }
  };

  const getExchangeRate = (currency: string) => {
    switch (currency) {
      case 'PHP': return 12.9822;
      case 'IDR': return 3350.50;
      default: return 1;
    }
  };

  const receivedAmount = selectedRecipient && amount ? (parseFloat(amount) * getExchangeRate(selectedRecipient.currency)).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) : '0.00';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={railState === 'done' || step < 4 ? onClose : undefined}
          className="absolute inset-0 bg-blue-slate/60 dark:bg-black/80 backdrop-blur-sm"
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-white dark:bg-dark-surface rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-platinum dark:border-blue-slate/30 bg-platinum/30 dark:bg-dark-bg/50">
            <h2 className="text-xl font-bold text-blue-slate dark:text-white flex items-center gap-2">
              {step === 1 && 'Select Recipient'}
              {step === 2 && 'Enter Amount'}
              {step === 3 && 'Payment Method'}
              {step === 4 && railState === 'done' ? 'Transfer Complete' : step === 4 && 'Processing...'}
            </h2>
            <button 
              onClick={onClose} 
              disabled={step === 4 && railState !== 'done'}
              className="p-2 text-blue-slate/40 hover:text-blue-slate dark:hover:text-white transition-colors rounded-full hover:bg-platinum dark:hover:bg-dark-bg focus:outline-none disabled:opacity-30 disabled:pointer-events-none"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto w-full relative">
            {/* Step 1: Select Recipient */}
            {step === 1 && (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="p-6 space-y-4"
              >
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-slate/40" />
                  <input 
                    type="text" 
                    placeholder="Search name or bank..." 
                    className="w-full bg-platinum dark:bg-dark-bg border border-blue-slate/10 dark:border-blue-slate/30 rounded-xl pl-9 pr-4 py-3 text-sm focus:outline-none focus:border-pacific-blue/50 focus:ring-1 focus:ring-pacific-blue/50 transition-all font-medium text-blue-slate dark:text-white placeholder:text-blue-slate/40"
                  />
                </div>

                <AnimatePresence>
                  {recipientError && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-xs font-medium text-red-500 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 p-3 rounded-lg"
                    >
                      {recipientError}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-2 mt-4">
                  {mockRecipients.map(r => (
                    <button 
                      key={r.id}
                      onClick={() => handleRecipientSelect(r)}
                      className="w-full flex items-center justify-between p-4 rounded-2xl border border-blue-slate/10 dark:border-blue-slate/30 hover:border-pacific-blue hover:bg-pacific-blue/5 transition-all group text-left"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-slate/10 dark:bg-blue-slate/80 text-blue-slate dark:text-platinum flex items-center justify-center font-bold">
                          {r.initial}
                        </div>
                        <div>
                          <div className="font-bold text-blue-slate dark:text-white transition-colors group-hover:text-pacific-blue">{r.name}</div>
                          <div className="text-xs text-blue-slate/60 dark:text-platinum/60">{r.bank} • {r.account}</div>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-blue-slate/30 group-hover:text-pacific-blue transition-transform group-hover:translate-x-1" />
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 2: Amount & Review */}
            {step === 2 && (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="p-6 space-y-6"
              >
                <div className="flex items-center xl:gap-4 gap-3 p-4 bg-platinum/50 dark:bg-dark-bg/50 border border-blue-slate/10 dark:border-blue-slate/30 rounded-2xl">
                  <div className="w-10 h-10 rounded-full bg-blue-slate/10 dark:bg-blue-slate/80 text-blue-slate dark:text-platinum flex items-center justify-center font-bold shrink-0">
                    {selectedRecipient?.initial}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs text-blue-slate/60 dark:text-platinum/60 uppercase tracking-widest font-bold">Sending To</div>
                    <div className="font-bold text-blue-slate dark:text-white truncate">{selectedRecipient?.name}</div>
                  </div>
                  <button onClick={() => setStep(1)} className="ml-auto text-xs font-bold text-pacific-blue hover:underline shrink-0">Change</button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-blue-slate/60 dark:text-platinum/60 uppercase tracking-widest">You Send</label>
                    <div className="flex items-center mt-2 border-b-2 border-blue-slate/10 dark:border-blue-slate/30 focus-within:border-pacific-blue transition-colors pb-2">
                      <span className="text-2xl font-bold text-blue-slate dark:text-white mr-3">MYR</span>
                      <input 
                        type="text" 
                        value={amount}
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^0-9.]/g, '');
                          if (val.split('.').length > 2) return;
                          setAmount(val);
                        }}
                        placeholder="0.00"
                        className="w-full bg-transparent text-3xl font-bold outline-none text-blue-slate dark:text-white placeholder:text-blue-slate/20 dark:placeholder:text-platinum/20"
                      />
                    </div>
                  </div>

                  <div className="py-2 flex flex-col gap-2 relative">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-blue-slate/60 dark:text-platinum/60 font-medium">Exchange Rate</span>
                      <span className="font-mono font-bold text-blue-slate dark:text-white">1 MYR = {getExchangeRate(selectedRecipient?.currency || '')} {selectedRecipient?.currency}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-blue-slate/60 dark:text-platinum/60 font-medium">Fee</span>
                      <span className="font-mono font-bold text-tangerine">0.00 MYR</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-blue-slate/60 dark:text-platinum/60 uppercase tracking-widest">Recipient Gets</label>
                    <div className="flex items-center mt-2 border-b-2 border-transparent pb-2">
                      <span className="text-2xl font-bold text-blue-slate dark:text-white mr-3">{selectedRecipient?.currency}</span>
                      <span className="w-full text-3xl font-bold text-blue-slate dark:text-white">
                        {receivedAmount}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Payment Method Selection */}
            {step === 3 && (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="p-6 space-y-6"
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { 
                      id: 'fpx', 
                      label: 'FPX Bank', 
                      desc: 'Online Banking', 
                      icon: (
                        <div className="w-16 h-16 rounded-[1rem] bg-gradient-to-tr from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center mb-4 transition-all group-hover:scale-110 shadow-sm border border-gray-200 dark:border-gray-600">
                           <div className="flex items-baseline font-black italic tracking-tighter">
                             <span className="text-2xl text-[#E4002B]">F</span>
                             <span className="text-xl text-black dark:text-white">PX</span>
                           </div>
                        </div>
                      )
                    },
                    { 
                      id: 'card', 
                      label: 'Credit Card', 
                      desc: 'Visa / Mastercard', 
                      icon: (
                        <div className="relative w-16 h-16 rounded-[1rem] bg-gradient-to-br from-indigo-50 to-indigo-100/50 dark:from-gray-800 dark:to-gray-700 flex flex-col items-center justify-center mb-4 transition-all group-hover:scale-110 shadow-sm border border-indigo-100 dark:border-gray-600 overflow-hidden">
                           <div className="absolute right-1 top-2 w-10 h-6 bg-white dark:bg-gray-100 rounded-[4px] border border-gray-200 flex items-center justify-center shadow overflow-hidden rotate-12 transition-transform group-hover:rotate-[15deg]">
                             <span className="text-[10px] font-black italic text-blue-800">VISA</span>
                           </div>
                           <div className="absolute left-1 bottom-2 w-10 h-6 bg-white dark:bg-gray-100 rounded-[4px] border border-gray-200 flex items-center justify-center shadow -rotate-12 transition-transform group-hover:-rotate-[15deg]">
                             <div className="flex -space-x-1.5 opacity-90"><div className="w-3.5 h-3.5 rounded-full bg-[#EB001B] mix-blend-multiply"></div><div className="w-3.5 h-3.5 rounded-full bg-[#F79E1B] mix-blend-multiply"></div></div>
                           </div>
                        </div>
                      )
                    },
                    { 
                      id: 'direct_debit', 
                      label: 'Direct Debit', 
                      desc: 'Saved Accounts', 
                      icon: (
                        <div className="relative w-16 h-16 rounded-[1rem] bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center mb-4 transition-all group-hover:scale-110 shadow-sm border border-emerald-100 dark:border-gray-600">
                           <div className="w-[50px] h-8 rounded bg-gradient-to-r from-[#FFCE00] to-amber-400 absolute -translate-x-1 translate-y-1 rotate-[-10deg] shadow-sm flex items-center justify-between px-1.5 group-hover:-translate-x-2 transition-all">
                              <span className="text-[8px] font-black text-black">MB</span>
                              <div className="h-6 w-5 bg-white/30 rounded-sm"></div>
                           </div>
                           <div className="w-[50px] h-8 rounded bg-gradient-to-r from-emerald-500 to-emerald-600 absolute translate-x-1 -translate-y-1 rotate-[8deg] shadow-md flex items-center justify-between px-1.5 group-hover:translate-x-2 transition-all text-white border border-emerald-400/50">
                              <Landmark className="w-4 h-4 ml-0.5" />
                           </div>
                        </div>
                      )
                    }
                  ].map(method => (
                    <button
                      key={method.id}
                      onClick={() => {
                        setSelectedPaymentMethod(method.id as any);
                        setSelectedBank(null); // Reset bank if switching
                      }}
                      className={cn(
                        "relative flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all text-center group overflow-hidden",
                        selectedPaymentMethod === method.id 
                          ? "bg-pacific-blue/5 border-pacific-blue text-pacific-blue transform scale-[1.02] shadow-md shadow-pacific-blue/20" 
                          : "bg-white dark:bg-dark-surface border-blue-slate/10 dark:border-blue-slate/30 text-blue-slate/70 dark:text-platinum/70 hover:border-pacific-blue/30 hover:shadow-md hover:bg-blue-slate/5 dark:hover:bg-blue-slate/5"
                      )}
                    >
                      {selectedPaymentMethod === method.id && (
                        <div className="absolute top-3 right-3 text-pacific-blue">
                          <CheckCircle2 className="w-5 h-5 fill-pacific-blue/20" />
                        </div>
                      )}
                      
                      {/* Subdued background shape for texture */}
                      <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-current opacity-[0.03] rounded-full blur-2xl group-hover:opacity-[0.06] transition-opacity"></div>
                      
                      {method.icon}
                      <span className="text-base font-bold leading-tight tracking-tight">{method.label}</span>
                      <span className="text-xs font-medium opacity-70 mt-1.5">{method.desc}</span>
                    </button>
                  ))}
                </div>

                {selectedPaymentMethod === 'fpx' && (
                  <>
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-xl flex items-start gap-3">
                      <div className="bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded shrink-0 leading-none">FPX</div>
                      <p className="text-xs text-blue-800 dark:text-blue-200 leading-relaxed font-medium">
                        Secure online payment gateway. You will be redirected to your bank to authorize the payment of <strong>MYR {amount}</strong>.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-blue-slate dark:text-white mb-3">Select your bank</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {fpxBanks.map(bank => (
                          <button
                            key={bank.id}
                            onClick={() => setSelectedBank(bank.id)}
                            className={cn(
                              "p-4 rounded-xl border flex flex-col items-center gap-2 transition-all",
                              selectedBank === bank.id 
                                ? "bg-pacific-blue/10 border-pacific-blue ring-2 ring-pacific-blue/20" 
                                : "bg-platinum dark:bg-dark-bg border-blue-slate/10 dark:border-blue-slate/30 hover:border-pacific-blue/50"
                            )}
                          >
                            <span className="text-2xl" aria-hidden="true">{bank.logo}</span>
                            <span className="text-xs font-bold text-blue-slate dark:text-white text-center leading-tight">{bank.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {selectedPaymentMethod === 'card' && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="bg-blue-slate/5 dark:bg-dark-bg border border-blue-slate/10 dark:border-blue-slate/30 p-4 rounded-xl flex items-center justify-between">
                      <p className="text-xs text-blue-slate dark:text-platinum leading-relaxed font-medium">
                        Pay securely using your Credit or Debit Card. A <strong>1.5% processing fee</strong> may apply.
                      </p>
                      <div className="flex gap-2 shrink-0 ml-4">
                        <div className="w-10 h-6 bg-white rounded border border-gray-200 flex items-center justify-center shadow-sm">
                           <span className="text-[10px] font-black italic text-blue-800">VISA</span>
                        </div>
                        <div className="w-10 h-6 bg-white rounded border border-gray-200 flex items-center justify-center shadow-sm">
                           <div className="flex -space-x-1.5 opacity-90"><div className="w-3.5 h-3.5 rounded-full bg-red-500 mix-blend-multiply"></div><div className="w-3.5 h-3.5 rounded-full bg-amber-400 mix-blend-multiply"></div></div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <input className="w-full bg-platinum dark:bg-dark-bg border border-blue-slate/10 dark:border-blue-slate/30 focus:border-pacific-blue rounded-xl p-4 text-sm font-mono outline-none text-blue-slate dark:text-white placeholder:text-blue-slate/40" placeholder="Card Number" />
                      <div className="flex gap-3">
                        <input className="w-1/2 bg-platinum dark:bg-dark-bg border border-blue-slate/10 dark:border-blue-slate/30 focus:border-pacific-blue rounded-xl p-4 text-sm font-mono outline-none text-blue-slate dark:text-white placeholder:text-blue-slate/40" placeholder="MM/YY" />
                        <input className="w-1/2 bg-platinum dark:bg-dark-bg border border-blue-slate/10 dark:border-blue-slate/30 focus:border-pacific-blue rounded-xl p-4 text-sm font-mono outline-none text-blue-slate dark:text-white placeholder:text-blue-slate/40" placeholder="CVC" />
                      </div>
                      <input className="w-full bg-platinum dark:bg-dark-bg border border-blue-slate/10 dark:border-blue-slate/30 focus:border-pacific-blue rounded-xl p-4 text-sm font-medium outline-none text-blue-slate dark:text-white placeholder:text-blue-slate/40" placeholder="Cardholder Name" />
                    </div>
                  </div>
                )}

                {selectedPaymentMethod === 'direct_debit' && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                     <div className="bg-blue-slate/5 dark:bg-dark-bg border border-blue-slate/10 dark:border-blue-slate/30 p-4 rounded-xl">
                      <p className="text-xs text-blue-slate dark:text-platinum leading-relaxed font-medium">
                        Instant transfer from your linked bank account. No additional fees.
                      </p>
                    </div>
                    <p className="text-xs font-bold text-blue-slate dark:text-white mb-2 uppercase tracking-wide">Saved Accounts</p>
                    <button className="w-full flex items-center justify-between p-4 border-2 border-pacific-blue/50 bg-pacific-blue/5 rounded-xl transition-all shadow-sm">
                       <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-full bg-[#FFCE00] flex items-center justify-center font-black text-black text-xs tracking-tighter shadow-sm border border-black/5">MB</div>
                         <div className="text-left">
                           <div className="text-sm font-bold text-blue-slate dark:text-white">Maybank Savings</div>
                           <div className="text-xs font-mono text-blue-slate/60 dark:text-platinum/60 mt-0.5">**** 8273</div>
                         </div>
                       </div>
                       <CheckCircle2 className="w-5 h-5 text-pacific-blue" />
                     </button>
                     <button className="w-full flex items-center gap-4 p-4 border border-dashed border-blue-slate/20 dark:border-blue-slate/40 rounded-xl hover:bg-platinum dark:hover:bg-dark-bg transition-all mt-2 group">
                        <div className="w-10 h-10 rounded-full bg-platinum dark:bg-dark-surface flex items-center justify-center text-blue-slate/60 dark:text-platinum/60 group-hover:bg-white dark:group-hover:bg-blue-slate/10 transition-colors border-2 border-transparent group-hover:border-blue-slate/10">+</div>
                        <div className="text-sm font-medium text-blue-slate/80 dark:text-platinum/80">Link new bank account</div>
                     </button>
                  </div>
                )}
              </motion.div>
            )}

            {/* Step 4: Progress & Success */}
            {step === 4 && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-8 text-center flex flex-col items-center justify-center min-h-[400px] relative"
              >
                <AnimatePresence mode="wait">
                  {railState === 'done' ? (
                    <motion.div 
                      key="success"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="flex flex-col items-center w-full"
                    >
                      <div className="w-24 h-24 bg-pacific-blue/10 dark:bg-pacific-blue/20 rounded-full flex items-center justify-center mb-6">
                        <CheckCircle2 className="w-12 h-12 text-pacific-blue" />
                      </div>
                      <h3 className="text-2xl font-bold text-blue-slate dark:text-white mb-2">Transfer Settled!</h3>
                      <p className="text-blue-slate/60 dark:text-platinum/60 mb-6">Funds have been routed and settled in {selectedRecipient?.name}'s account.</p>
                      
                      <div className="bg-platinum dark:bg-dark-bg p-4 rounded-xl text-left w-full mb-2">
                        <div className="text-xs text-blue-slate/50 dark:text-platinum/50 uppercase tracking-widest font-bold mb-1">Blockchain Receipt</div>
                        <div className="font-mono text-xs text-pacific-blue font-semibold break-all flex items-center justify-between">
                          {txHash} <ArrowUpRight className="w-4 h-4 ml-2 shrink-0 opacity-50" />
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="progress"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="w-full flex flex-col items-center space-y-8"
                    >
                      <h3 className="text-lg font-bold animate-pulse text-blue-slate dark:text-white">Routing Transfer...</h3>
                      
                      <div className="w-full max-w-sm space-y-4">
                        <ProgressStep 
                          icon={<Building />} 
                          title="FPX Payment Received" 
                          status={['exchange', 'sui'].includes(railState as string) ? 'done' : 'active'} 
                        />
                        <div className="h-4 w-0.5 bg-platinum dark:bg-blue-slate/30 ml-6" />
                        <ProgressStep 
                          icon={<RefreshCw />} 
                          title="Hata: MYR to USDC" 
                          status={['sui'].includes(railState as string) ? 'done' : railState === 'exchange' ? 'active' : 'idle'} 
                        />
                        <div className="h-4 w-0.5 bg-platinum dark:bg-blue-slate/30 ml-6" />
                        <ProgressStep 
                          icon={<Layers />} 
                          title="Sui Network Settlement" 
                          status={railState === 'sui' ? 'active' : 'idle'} 
                          glow
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </div>

          <div className="p-6 border-t border-platinum dark:border-blue-slate/30 bg-platinum/30 dark:bg-dark-bg/50">
            {step === 1 && (
              <button 
                onClick={onClose}
                className="w-full py-3.5 px-4 rounded-xl font-bold text-blue-slate/60 dark:text-platinum/60 hover:bg-platinum dark:hover:bg-dark-surface transition-colors"
              >
                Cancel
              </button>
            )}
            {step === 2 && (
              <div className="flex gap-3">
                <button 
                  onClick={() => setStep(1)}
                  className="px-4 py-3.5 rounded-xl font-bold text-blue-slate/60 dark:text-platinum/60 hover:bg-platinum dark:hover:bg-dark-surface transition-colors"
                >
                  Back
                </button>
                <button 
                  onClick={handleProceedToFpx}
                  disabled={!amount || parseFloat(amount) <= 0}
                  className="flex-1 flex items-center justify-center gap-2 bg-pacific-blue hover:bg-pacific-blue/90 text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-lg shadow-pacific-blue/20 disabled:opacity-50 disabled:shadow-none"
                >
                  Proceed to Pay <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            )}
            {step === 3 && (
              <div className="flex gap-3">
                <button 
                  onClick={() => setStep(2)}
                  className="px-4 py-3.5 rounded-xl font-bold text-blue-slate/60 dark:text-platinum/60 hover:bg-platinum dark:hover:bg-dark-surface transition-colors"
                >
                  Back
                </button>
                <button 
                  onClick={handlePayAndSend}
                  disabled={(selectedPaymentMethod === 'fpx' && !selectedBank) || isSending}
                  className="flex-1 flex items-center justify-center gap-2 bg-pacific-blue hover:bg-pacific-blue/90 text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-lg shadow-pacific-blue/20 disabled:opacity-50 disabled:shadow-none"
                >
                  {selectedPaymentMethod === 'fpx' ? 'Pay via FPX' : selectedPaymentMethod === 'card' ? 'Pay via Card' : 'Pay via Direct Debit'} <Send className="w-4 h-4 ml-1" />
                </button>
              </div>
            )}
            {step === 4 && railState === 'done' && (
              <button 
                onClick={onClose}
                className="w-full py-3.5 px-4 rounded-xl font-bold bg-platinum dark:bg-dark-bg text-blue-slate dark:text-white hover:bg-blue-slate/10 transition-colors shadow-sm border border-blue-slate/10 dark:border-blue-slate/30"
              >
                Done
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

function ProgressStep({ icon, title, status, glow }: { icon: React.ReactNode, title: string, status: 'idle' | 'active' | 'done', glow?: boolean }) {
  return (
    <div className={cn(
      "flex items-center gap-4 p-4 rounded-2xl border transition-all",
      status === 'done' ? "bg-pacific-blue/5 border-pacific-blue/20 text-blue-slate dark:text-white" :
      status === 'active' ? (glow ? "bg-pacific-blue border-pacific-blue text-white shadow-lg shadow-pacific-blue/30" : "bg-white dark:bg-dark-surface border-pacific-blue/50 text-blue-slate dark:text-white shadow-sm ring-2 ring-pacific-blue/20") :
      "bg-platinum/50 dark:bg-dark-bg/50 border-transparent text-blue-slate/40 dark:text-platinum/40"
    )}>
      <div className={cn(
        "flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-colors relative",
        status === 'done' ? "bg-pacific-blue text-white" : 
        status === 'active' ? (glow ? "bg-white text-pacific-blue" : "bg-pacific-blue/10 text-pacific-blue") : 
        "bg-blue-slate/10 dark:bg-blue-slate/30 text-current"
      )}>
        {status === 'done' ? <CheckCircle2 className="w-6 h-6" /> : icon}
        {status === 'active' && (
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", glow ? "bg-white" : "bg-pacific-blue")}></span>
            <span className={cn("relative inline-flex rounded-full h-3 w-3", glow ? "bg-white" : "bg-pacific-blue")}></span>
          </span>
        )}
      </div>
      <div className="font-bold text-left">{title}</div>
    </div>
  );
}

