import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  Settings, 
  Send, 
  Users, 
  LogOut,
  Droplet,
  Bell,
  Search,
  Moon,
  Sun,
  Menu,
  X
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Logger } from '../services/logger';

export function Layout({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkMode] = useState(true); // default to dark mode based on theme
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  const toggleDarkMode = () => {
    Logger.debug('Toggling dark mode representation');
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <div className={cn(
      "min-h-screen flex w-full",
      "bg-platinum dark:bg-dark-bg text-blue-slate dark:text-platinum font-sans transition-colors duration-300 selection:bg-pacific-blue/30"
    )}>
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-blue-slate/60 dark:bg-black/60 z-40 lg:hidden animate-in fade-in backdrop-blur-sm"
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 flex flex-col border-r border-blue-slate/10 dark:border-blue-slate/30 bg-white dark:bg-dark-surface transition-transform duration-300 ease-in-out lg:static lg:translate-x-0",
        mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}
      aria-label="Sidebar Navigation">
        <Link to="/" className="h-20 flex items-center justify-between px-6 lg:px-8 cursor-pointer group hover:bg-platinum dark:hover:bg-dark-bg transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-pacific-blue flex items-center justify-center shadow-lg shadow-pacific-blue/20 transition-all duration-300 group-hover:scale-105">
              <Droplet className="text-white w-5 h-5" />
            </div>
            <div className="font-bold text-xl tracking-tight text-blue-slate dark:text-white">
              Spl<em className="not-italic text-pacific-blue dark:text-pacific-blue">ash</em>
            </div>
          </div>
          <button 
            className="lg:hidden p-2 -mr-2 text-blue-slate/40 hover:text-blue-slate dark:hover:text-white"
            onClick={(e) => { e.preventDefault(); closeMobileMenu(); }}
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </Link>
        
        <nav className="flex-1 px-4 py-8 space-y-2">
          <NavItem href="/dashboard" icon={<BarChart3 />} label="Dashboard" active={location.pathname === '/dashboard'} onClick={closeMobileMenu} />
          <NavItem href="/transfers" icon={<Send />} label="Transfers" active={location.pathname === '/transfers'} onClick={closeMobileMenu} />
          <NavItem href="/recipients" icon={<Users />} label="Recipients" active={location.pathname === '/recipients'} onClick={closeMobileMenu} />
          <NavItem href="/settings" icon={<Settings />} label="Settings" active={location.pathname === '/settings'} onClick={closeMobileMenu} />
        </nav>
        
        <div className="p-4 px-4 space-y-2 border-t border-blue-slate/10 dark:border-blue-slate/30">
          <NavItem href="/" icon={<LogOut />} label="Sign Out" onClick={() => { closeMobileMenu(); navigate('/'); }} />
        </div>

        <div className="p-6 border-t border-blue-slate/10 dark:border-blue-slate/30">
          <div className="flex items-center gap-3 p-3 bg-platinum dark:bg-dark-bg rounded-2xl border border-blue-slate/10 dark:border-blue-slate/30">
            <div className="w-10 h-10 rounded-full bg-platinum dark:bg-dark-surface flex-shrink-0 border-2 border-white dark:border-blue-slate/50 flex items-center justify-center font-bold text-blue-slate dark:text-white text-sm">
              AS
            </div>
            <div className="flex-1 min-w-0 overflow-hidden">
              <span className="block text-xs font-semibold truncate text-blue-slate dark:text-white">Acme Sdn Bhd</span>
              <span className="block text-[10px] text-pacific-blue dark:text-pacific-blue/80 font-mono tracking-tighter uppercase">● Encrypted Session</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative bg-platinum dark:bg-dark-bg transition-colors duration-300">
        {/* Background ambient orbs */}
        <div className="pointer-events-none absolute w-[400px] h-[400px] -top-32 -right-32 bg-pacific-blue/5 rounded-full blur-[100px]" aria-hidden="true" />
        
        {/* Top Navbar */}
        <header className="h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 border-b border-blue-slate/10 dark:border-blue-slate/30 bg-white/80 dark:bg-dark-bg/80 backdrop-blur-md relative z-10 transition-colors duration-300">
          <div className="flex items-center gap-3 sm:gap-4 text-blue-slate/60 dark:text-platinum/60">
            <button 
              className="lg:hidden p-2 -ml-2 text-blue-slate/60 dark:text-platinum/60 hover:text-blue-slate dark:hover:text-white"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={mobileMenuOpen}
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="hidden lg:hidden w-8 h-8 rounded-lg bg-pacific-blue sm:flex items-center justify-center shadow-lg shadow-pacific-blue/20">
              <Droplet className="text-white w-4 h-4" />
            </div>
            <span className="hidden sm:inline-block text-xs uppercase tracking-widest font-bold text-blue-slate/60 dark:text-platinum/60">Network</span>
            <div className="flex items-center gap-2 bg-platinum dark:bg-dark-surface px-3 py-1 rounded-full border border-blue-slate/10 dark:border-blue-slate/30" role="status" aria-label="Network status">
              <span className="w-2 h-2 bg-tangerine rounded-full animate-pulse" aria-hidden="true"></span>
              <span className="text-xs font-medium text-blue-slate dark:text-platinum">Sui Mainnet</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3 lg:gap-6">
            <div className="hidden sm:flex items-center gap-2 bg-platinum dark:bg-dark-surface border border-blue-slate/10 dark:border-blue-slate/30 rounded-xl px-4 py-2 text-sm focus-within:ring-2 focus-within:ring-pacific-blue/50 transition-all">
              <Search className="w-4 h-4 text-blue-slate/50" aria-hidden="true" />
              <input 
                type="text" 
                placeholder="Search txns..." 
                className="bg-transparent outline-none w-24 md:w-48 text-blue-slate dark:text-platinum placeholder:text-blue-slate/40 dark:placeholder:text-platinum/40 font-medium" 
                aria-label="Search transactions"
              />
            </div>
            
            <button 
              onClick={toggleDarkMode} 
              className="p-2 text-blue-slate/60 hover:text-tangerine dark:hover:text-tangerine transition-colors outline-none focus:ring-2 focus:ring-tangerine rounded-lg"
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            
            <button 
              className="relative p-2 text-blue-slate/60 hover:text-tangerine dark:hover:text-tangerine transition-colors outline-none focus:ring-2 focus:ring-tangerine rounded-lg"
              aria-label="Notifications, unread"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-tangerine rounded-full border-2 border-white dark:border-dark-bg"></span>
            </button>
            
            <button className="hidden md:block px-4 py-1.5 bg-platinum dark:bg-dark-surface hover:bg-blue-slate/10 dark:hover:bg-blue-slate/30 text-sm font-semibold rounded-lg border border-blue-slate/10 dark:border-blue-slate/30 transition-all text-blue-slate dark:text-white focus:ring-2 focus:ring-pacific-blue">System Health</button>
          </div>
        </header>

        {/* Content View */}
        <div 
          className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-10 py-6 lg:py-8 relative z-10"
          role="main"
          id="main-content"
        >
          {children}
        </div>
      </main>
    </div>
  );
}

function NavItem({ icon, label, active, onClick, href }: { icon: React.ReactElement<{ className?: string, 'aria-hidden'?: string }>, label: string, active?: boolean, onClick?: () => void, href?: string }) {
  if (href) {
    return (
      <Link 
        to={href}
        onClick={(e) => {
          if (href === '/') {
             e.preventDefault(); // Handle special case like sign out navigate
             if(onClick) onClick();
             return;
          }
          if(onClick) onClick();
        }}
        className={cn(
          "flex items-center gap-3 px-4 py-3 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-pacific-blue",
          active 
            ? "bg-pacific-blue/10 text-pacific-blue font-bold border border-pacific-blue/20" 
            : "text-blue-slate/70 dark:text-platinum/70 hover:text-pacific-blue dark:hover:text-pacific-blue hover:bg-platinum dark:hover:bg-dark-surface font-semibold"
        )}
        aria-current={active ? "page" : undefined}
      >
        {React.cloneElement(icon as any, {
          className: cn("w-5 h-5", active ? "text-pacific-blue" : "text-current"),
          "aria-hidden": "true"
        })}
        <span>{label}</span>
      </Link>
    );
  }

  return (
    <button 
      onClick={(e) => {
        e.preventDefault();
        if(onClick) onClick();
      }}
      className={cn(
        "flex w-full items-center gap-3 px-4 py-3 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-pacific-blue",
        active 
          ? "bg-pacific-blue/10 text-pacific-blue font-bold border border-pacific-blue/20" 
          : "text-blue-slate/70 dark:text-platinum/70 hover:text-pacific-blue dark:hover:text-pacific-blue hover:bg-platinum dark:hover:bg-dark-surface font-semibold"
      )}
      aria-current={active ? "page" : undefined}
    >
      {React.cloneElement(icon as any, {
        className: cn("w-5 h-5", active ? "text-pacific-blue" : "text-current"),
        "aria-hidden": "true"
      })}
      <span>{label}</span>
    </button>
  );
}
