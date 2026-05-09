import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Droplet, ArrowRight, Github, Mail, KeyRound, Lock, EyeOff, Eye } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

export function AuthPage({ mode = 'signin' }: { mode?: 'signin' | 'signup' | 'forgot' }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('demo@splash.io');
  const [password, setPassword] = useState('demo1234');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate auth action
    setTimeout(() => {
      setIsLoading(false);
      if (mode === 'forgot') {
        setIsSuccess(true);
      } else {
        navigate('/dashboard');
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-platinum dark:bg-dark-bg text-blue-slate dark:text-platinum font-sans selection:bg-pacific-blue/30">
      
      {/* Left Panel - Image/Brand */}
      <div className="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden bg-white dark:bg-dark-surface border-r border-platinum dark:border-blue-slate/30">
        
        {/* Background glow */}
        <div className="absolute top-[20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-pacific-blue/10 blur-[120px] pointer-events-none" />
        
        <div className="relative z-10 flex items-center gap-3">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-pacific-blue flex items-center justify-center shadow-lg shadow-pacific-blue/20 group-hover:scale-105 transition-transform">
              <Droplet className="text-white w-6 h-6" />
            </div>
            <div className="font-bold text-2xl tracking-tight text-blue-slate dark:text-white">
              Spl<em className="not-italic text-pacific-blue dark:text-pacific-blue">ash</em>
            </div>
          </Link>
        </div>

        <div className="relative z-10 max-w-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="mb-8 rounded-2xl border border-blue-slate/10 dark:border-blue-slate/30 bg-white/50 dark:bg-dark-bg/80 backdrop-blur-md p-6 shadow-xl shadow-pacific-blue/5"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-platinum dark:bg-dark-surface border-2 border-white dark:border-blue-slate/50 flex items-center justify-center overflow-hidden">
                <img src="https://i.pravatar.cc/100?img=33" alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="text-sm font-bold text-blue-slate dark:text-white">"Reduced settlement time by 98%"</div>
                <div className="text-xs text-blue-slate/70 dark:text-platinum/70">Sarah Chen, Operations @ FinTech Co.</div>
              </div>
            </div>
          </motion.div>

          <h2 className="text-4xl font-bold mb-4 tracking-tight leading-[1.1] text-blue-slate dark:text-white">The new standard<br />for global treasuries.</h2>
          <p className="text-lg text-blue-slate/80 dark:text-platinum/80">Join forward-thinking financial institutions settling instantly on the Sui network.</p>
        </div>

        <div className="relative z-10 flex gap-4 text-sm font-medium text-blue-slate/60 dark:text-platinum/60">
          <a href="#" className="hover:text-tangerine dark:hover:text-tangerine transition-colors">Privacy</a>
          <a href="#" className="hover:text-tangerine dark:hover:text-tangerine transition-colors">Terms</a>
          <a href="#" className="hover:text-tangerine dark:hover:text-tangerine transition-colors">Contact</a>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12 relative">
        <div className="w-full max-w-[400px]">
          
          <div className="lg:hidden flex items-center gap-3 mb-10 justify-center">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-pacific-blue flex items-center justify-center shadow-lg shadow-pacific-blue/20">
                <Droplet className="text-white w-6 h-6" />
              </div>
              <div className="font-bold text-2xl tracking-tight text-blue-slate dark:text-white">
                Spl<em className="not-italic text-pacific-blue dark:text-pacific-blue">ash</em>
              </div>
            </Link>
          </div>

          <div className="text-center mb-10">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2 text-blue-slate dark:text-white">
              {mode === 'signin' ? 'Welcome back' : mode === 'signup' ? 'Create an account' : 'Reset password'}
            </h1>
            <p className="text-blue-slate/60 text-sm font-medium">
              {mode === 'signin' ? 'Sign in to your Splash dashboard' : mode === 'signup' ? 'Enter your details to get started' : 'We will send you a reset link'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === 'signup' && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-blue-slate/70 dark:text-platinum/70">Full Name</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-blue-slate/40 group-focus-within:text-pacific-blue transition-colors">
                    <span className="w-5 h-5 flex items-center justify-center font-bold">@</span>
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 bg-white dark:bg-dark-surface border border-blue-slate/10 dark:border-blue-slate/30 rounded-xl text-sm outline-none focus:border-pacific-blue focus:ring-1 focus:ring-pacific-blue transition-all text-blue-slate dark:text-white placeholder:text-blue-slate/40"
                    placeholder="Jane Doe"
                    required
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-blue-slate/70 dark:text-platinum/70">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-blue-slate/40 group-focus-within:text-pacific-blue transition-colors">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-white dark:bg-dark-surface border border-blue-slate/10 dark:border-blue-slate/30 rounded-xl text-sm outline-none focus:border-pacific-blue focus:ring-1 focus:ring-pacific-blue transition-all text-blue-slate dark:text-white placeholder:text-blue-slate/40"
                  placeholder="name@company.com"
                  required
                />
              </div>
            </div>

            {mode !== 'forgot' && (
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold uppercase tracking-wider text-blue-slate/70 dark:text-platinum/70">Password</label>
                  {mode === 'signin' && (
                    <Link to="/forgot-password" className="text-xs font-bold text-pacific-blue dark:text-pacific-blue/80 hover:text-tangerine dark:hover:text-tangerine transition-colors">Forgot?</Link>
                  )}
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-blue-slate/40 group-focus-within:text-pacific-blue transition-colors">
                    <KeyRound className="h-5 w-5" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-12 py-3.5 bg-white dark:bg-dark-surface border border-blue-slate/10 dark:border-blue-slate/30 rounded-xl text-sm outline-none focus:border-pacific-blue focus:ring-1 focus:ring-pacific-blue transition-all text-blue-slate dark:text-white placeholder:text-blue-slate/40 font-mono tracking-wider"
                    placeholder="••••••••"
                    required
                  />
                  <button 
                    type="button" 
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-blue-slate/40 hover:text-pacific-blue dark:hover:text-tangerine"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            )}

            {mode === 'forgot' && isSuccess && (
              <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-500 text-sm font-medium">
                Reset link sent! Check your inbox.
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || (mode === 'forgot' && isSuccess)}
              className="w-full bg-blue-slate hover:bg-pacific-blue text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-slate/20 transition-all hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2 mt-4 disabled:opacity-70 disabled:hover:translate-y-0"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {mode === 'signin' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Send Reset Link'} 
                  {mode !== 'forgot' && <ArrowRight className="w-4 h-4" />}
                </>
              )}
            </button>
          </form>

          {mode !== 'forgot' && (
            <>
              <div className="mt-8 flex items-center justify-between">
                <span className="h-px w-full bg-blue-slate/10 dark:bg-blue-slate/30"></span>
                <span className="px-4 text-[10px] font-bold uppercase tracking-wider text-blue-slate/40 shrink-0">or continue with</span>
                <span className="h-px w-full bg-blue-slate/10 dark:bg-blue-slate/30"></span>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-4">
                <button className="flex justify-center items-center gap-2 py-3 px-4 bg-white dark:bg-dark-surface border border-blue-slate/10 dark:border-blue-slate/30 rounded-xl hover:bg-platinum dark:hover:bg-dark-bg transition-colors font-semibold text-sm">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Google
                </button>
                <button className="flex justify-center items-center gap-2 py-3 px-4 bg-white dark:bg-dark-surface border border-blue-slate/10 dark:border-blue-slate/30 rounded-xl hover:bg-platinum dark:hover:bg-dark-bg transition-colors font-semibold text-sm">
                  <Github className="w-5 h-5" />
                  GitHub
                </button>
              </div>
            </>
          )}

          <p className="mt-10 text-center text-sm font-medium text-blue-slate/60">
            {mode === 'signin' ? (
              <>Don't have an account? <Link to="/signup" className="font-bold text-pacific-blue dark:text-tangerine hover:underline">Create an account</Link></>
            ) : mode === 'signup' ? (
              <>Already have an account? <Link to="/signin" className="font-bold text-pacific-blue dark:text-tangerine hover:underline">Sign in</Link></>
            ) : (
              <>Remembered your password? <Link to="/signin" className="font-bold text-pacific-blue dark:text-tangerine hover:underline">Sign in</Link></>
            )}
          </p>

        </div>
      </div>
    </div>
  );
}
