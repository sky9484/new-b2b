import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Droplet, ArrowRight, Lock, Activity, Shield, Earth } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const fragmentShader = `
uniform float uTime;
uniform vec3 uColor1;
uniform vec3 uColor2;
varying vec2 vUv;
varying vec3 vPosition;

// Simple 2D noise implementation
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                      0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                     -0.577350269189626,  // -1.0 + 2.0 * C.x
                      0.024390243902439); // 1.0 / 41.0
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i); // Avoid truncation effects in permutation
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
		+ i.x + vec3(0.0, i1.x, 1.0 ));

  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main() {
  vec2 coords = vUv * 3.0; // scale
  float noise1 = snoise(coords + vec2(uTime * 0.1, uTime * 0.15));
  float noise2 = snoise(coords * 2.0 - vec2(uTime * 0.2, uTime * 0.1));
  float finalNoise = (noise1 + noise2) * 0.5;
  
  float mixVal = finalNoise * 0.5 + 0.5;
  vec3 color = mix(uColor1, uColor2, mixVal);
  
  // Create a slight gradient from top to bottom
  color = mix(color, uColor2, vUv.y * 0.5);
  
  gl_FragColor = vec4(color, mixVal * 0.3 + 0.1); // Add some transparency
}
`;

const vertexShader = `
varying vec2 vUv;
varying vec3 vPosition;
uniform float uTime;

void main() {
  vUv = uv;
  vPosition = position;
  
  // Slight wave distortion
  vPosition.z += sin(vPosition.x * 5.0 + uTime) * 0.1 + cos(vPosition.y * 3.0 + uTime) * 0.1;
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4(vPosition, 1.0);
}
`;

function WaterMesh() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  const uniforms = {
    uTime: { value: 0 },
    // Soft pacific blue and very light blue
    uColor1: { value: new THREE.Color("#0EA5E9") }, // pacific-blue
    uColor2: { value: new THREE.Color("#E0F2FE") }
  };

  return (
    <mesh position={[0, 0, -2]}>
      <planeGeometry args={[10, 10, 64, 64]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent={true}
        wireframe={false}
      />
    </mesh>
  );
}

function RecentTransactions() {
  const [txns, setTxns] = useState([
    { id: '1', pair: 'MYR → PHP', amount: '$1,250', status: 'Settled' },
    { id: '2', pair: 'SGD → IDR', amount: '$4,300', status: 'Settled' },
    { id: '3', pair: 'MYR → THB', amount: '$850', status: 'Settled' },
  ]);

  useEffect(() => {
    let idCounter = 4;
    const interval = setInterval(() => {
      const pairs = ['MYR → PHP', 'SGD → IDR', 'MYR → THB', 'PHP → MYR', 'IDR → SGD', 'MYR → VND'];
      const num = Math.floor(Math.random() * 5000) + 100;
      const newTx = {
        id: (idCounter++).toString(),
        pair: pairs[Math.floor(Math.random() * pairs.length)],
        amount: '$' + num.toLocaleString(),
        status: 'Settled'
      };
      
      setTxns(prev => [newTx, ...prev].slice(0, 4));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-3 overflow-hidden relative min-h-[160px]">
      <AnimatePresence initial={false}>
        {txns.map((tx) => (
          <motion.div
            key={tx.id}
            initial={{ opacity: 0, y: -20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, scale: 0.9, height: 0 }}
            transition={{ duration: 0.4 }}
            className="flex justify-between items-center text-sm mb-3 last:mb-0"
          >
            <span className="font-mono font-medium text-blue-slate dark:text-platinum/80">{tx.pair}</span>
            <div className="flex flex-col items-end">
              <span className="font-mono text-xs text-blue-slate/70 dark:text-platinum/50">{tx.amount}</span>
              <span className="text-[10px] uppercase font-bold text-pacific-blue dark:text-pacific-blue">✓ {tx.status}</span>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

function LiveActivityRail() {
  return (
    <div className="flex-1 w-full bg-platinum dark:bg-dark-surface/50 rounded-xl border border-blue-slate/5 dark:border-blue-slate/30 relative overflow-hidden flex items-center justify-between px-4 md:px-12 py-8">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
      
      {/* Background track line */}
      <div className="absolute left-10 right-10 h-0.5 bg-gradient-to-r from-transparent via-blue-slate/20 dark:via-blue-slate/30 to-transparent"></div>

      <div className="relative z-10 flex flex-col items-center gap-2">
        <div className="w-12 h-12 rounded-full border border-blue-slate/10 dark:border-blue-slate/30 bg-white dark:bg-dark-bg flex items-center justify-center shadow-md font-bold text-xs text-blue-slate dark:text-platinum">MYR</div>
      </div>
      
      <div className="relative z-10 flex flex-col items-center gap-2">
        <div className="w-16 h-16 rounded-full border border-pacific-blue/30 bg-pacific-blue/10 flex items-center justify-center shadow-[0_0_30px_rgba(14,165,233,0.2)]">
          <div className="w-8 h-8 rounded-full bg-pacific-blue shadow-[0_0_15px_rgba(14,165,233,0.8)] animate-pulse flex items-center justify-center text-white">
            <Droplet className="w-4 h-4" />
          </div>
        </div>
      </div>

      <div className="relative z-10 flex flex-col items-center gap-2">
        <div className="w-12 h-12 rounded-full border border-blue-slate/10 dark:border-blue-slate/30 bg-white dark:bg-dark-bg flex items-center justify-center shadow-md font-bold text-xs text-blue-slate dark:text-platinum">PHP</div>
      </div>

      {/* Moving Particles */}
      <motion.div
        animate={{ left: ['10%', '50%', '85%'], scale: [0.5, 1.5, 0.5], opacity: [0, 1, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeIn' }}
        className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-tangerine rounded-full shadow-[0_0_10px_rgba(227,151,116,1)]"
      />
      <motion.div
        animate={{ left: ['10%', '50%', '85%'], scale: [0.5, 1.5, 0.5], opacity: [0, 1, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeIn', delay: 0.75 }}
        className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-tangerine rounded-full shadow-[0_0_10px_rgba(227,151,116,1)]"
      />
      
      <motion.div
        animate={{ left: ['85%', '50%', '10%'], scale: [0.5, 1.5, 0.5], opacity: [0, 1, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeIn', delay: 0.3 }}
        className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-pacific-blue rounded-full shadow-[0_0_10px_rgba(14,165,233,1)]"
      />
      <motion.div
        animate={{ left: ['85%', '50%', '10%'], scale: [0.5, 1.5, 0.5], opacity: [0, 1, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeIn', delay: 1.2 }}
        className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-pacific-blue rounded-full shadow-[0_0_10px_rgba(14,165,233,1)]"
      />
    </div>
  )
}

function WaterBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <Canvas camera={{ position: [0, 0, 1], fov: 75 }}>
        <WaterMesh />
      </Canvas>
    </div>
  );
}

export function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg text-blue-slate dark:text-platinum font-sans selection:bg-pacific-blue/30 relative">
      
      {/* 3D Water Background */}
      <WaterBackground />

      <header className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled 
          ? "bg-white/80 dark:bg-dark-bg/80 backdrop-blur-md shadow-sm border-b border-blue-slate/10 dark:border-blue-slate/30 py-4" 
          : "bg-transparent py-6"
      )}>
        <div className="flex items-center justify-between px-6 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-pacific-blue flex items-center justify-center shadow-lg shadow-pacific-blue/20">
              <Droplet className="text-white w-6 h-6" />
            </div>
            <div className="font-bold text-2xl tracking-tight">
              Spl<em className="not-italic text-pacific-blue dark:text-pacific-blue">ash</em>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 font-medium text-sm text-blue-slate/70 dark:text-platinum/70">
            <a href="#features" className="hover:text-tangerine dark:hover:text-tangerine transition-colors">Features</a>
            <a href="#network" className="hover:text-tangerine dark:hover:text-tangerine transition-colors">Network</a>
            <a href="#security" className="hover:text-tangerine dark:hover:text-tangerine transition-colors">Security</a>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Link to="/signin" className="text-sm font-semibold text-blue-slate/80 dark:text-platinum/80 hover:text-tangerine dark:hover:text-tangerine transition-colors">
              Sign In
            </Link>
            <Link to="/signup" className="px-5 py-2.5 bg-pacific-blue hover:bg-tangerine text-white text-sm font-bold rounded-xl shadow-lg shadow-pacific-blue/20 transition-all hover:-translate-y-0.5 hover:shadow-tangerine/20 active:scale-95">
              Get Started
            </Link>
          </div>

          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2 text-blue-slate/80 dark:text-platinum/80 z-50"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <div className="space-y-1.5 w-6">
              <span className={cn("block h-0.5 bg-current transition-transform duration-300", mobileMenuOpen ? "rotate-45 translate-y-2" : "")}></span>
              <span className={cn("block h-0.5 bg-current transition-opacity duration-300", mobileMenuOpen ? "opacity-0" : "")}></span>
              <span className={cn("block h-0.5 bg-current transition-transform duration-300", mobileMenuOpen ? "-rotate-45 -translate-y-2" : "")}></span>
            </div>
          </button>
        </div>
      </header>

      {/* Mobile Menu Content */}
      {mobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-20 left-4 right-4 bg-white/95 dark:bg-dark-surface/95 backdrop-blur-md border border-blue-slate/10 dark:border-blue-slate/30 rounded-2xl shadow-xl z-50 p-4 md:hidden"
        >
          <nav className="flex flex-col gap-4 text-center pb-4 border-b border-platinum dark:border-blue-slate/30">
            <a href="#features" className="font-semibold text-blue-slate dark:text-platinum" onClick={() => setMobileMenuOpen(false)}>Features</a>
            <a href="#network" className="font-semibold text-blue-slate dark:text-platinum" onClick={() => setMobileMenuOpen(false)}>Network</a>
            <a href="#security" className="font-semibold text-blue-slate dark:text-platinum" onClick={() => setMobileMenuOpen(false)}>Security</a>
          </nav>
          <div className="flex flex-col gap-3 pt-4">
            <Link to="/signin" className="w-full py-3 text-center font-bold text-blue-slate dark:text-platinum bg-platinum dark:bg-dark-bg rounded-xl" onClick={() => setMobileMenuOpen(false)}>
              Sign In
            </Link>
            <Link to="/signup" className="w-full py-3 text-center bg-pacific-blue text-white font-bold rounded-xl" onClick={() => setMobileMenuOpen(false)}>
              Get Started
            </Link>
          </div>
        </motion.div>
      )}

      <main className="relative z-10 pt-24">
        {/* Hero Section */}
        <section className="pt-10 lg:pt-24 pb-20 px-6 max-w-7xl mx-auto text-center flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/50 dark:bg-pacific-blue/10 border border-white/50 dark:border-pacific-blue/20 text-blue-slate dark:text-pacific-blue text-sm font-semibold mb-[55px] -mt-[70px] backdrop-blur-sm shadow-sm"
          >
            <span className="w-2 h-2 rounded-full bg-tangerine animate-pulse"></span>
            Sui Mainnet Integration Live
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl lg:text-7xl font-extrabold tracking-tight text-blue-slate dark:text-white max-w-4xl mb-6 leading-[1.1] drop-shadow-sm"
          >
            The Settlement Layer for <span className="text-transparent bg-clip-text bg-gradient-to-r from-pacific-blue to-blue-600 dark:to-tangerine">Southeast Asia</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-blue-slate/80 dark:text-platinum/90 max-w-2xl mb-10 leading-relaxed font-medium drop-shadow-sm"
          >
            Instant, secure fiat-to-fiat transactions powered by Web3 infrastructure. Built for enterprise treasuries and Money Service Businesses.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center"
          >
            <Link to="/signup" className="w-full sm:w-auto px-8 py-4 bg-pacific-blue hover:bg-tangerine text-white font-bold rounded-xl shadow-lg shadow-pacific-blue/25 transition-all hover:-translate-y-1 hover:shadow-tangerine/20 flex items-center justify-center gap-2">
              Start Building <ArrowRight className="w-5 h-5" />
            </Link>
            <button className="w-full sm:w-auto px-8 py-4 bg-white/80 dark:bg-dark-surface/80 hover:bg-white dark:hover:bg-dark-bg text-blue-slate dark:text-white font-bold border border-blue-slate/10 dark:border-blue-slate/30 rounded-xl transition-all hover:-translate-y-1 backdrop-blur-sm shadow-sm">
              Read Documentation
            </button>
          </motion.div>
        </section>

        <section className="px-6 pb-32 max-w-[1400px] mx-auto relative z-10 mt-[30px] mb-0">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="mt-0 mb-0 rounded-3xl border border-blue-slate/10 dark:border-blue-slate/30 bg-white/90 dark:bg-dark-surface/90 p-2 shadow-2xl overflow-hidden backdrop-blur-md"
          >
            <div className="flex items-center gap-2 px-4 py-3 border-b border-platinum dark:border-blue-slate/30 bg-white/50 dark:bg-dark-bg/50">
              <div className="w-3 h-3 rounded-full bg-[#E57373]"></div>
              <div className="w-3 h-3 rounded-full bg-[#FFB74D]"></div>
              <div className="w-3 h-3 rounded-full bg-[#81C784]"></div>
              <div className="ml-4 h-6 w-full max-w-md bg-white/80 dark:bg-dark-bg rounded border border-platinum dark:border-blue-slate/30 flex items-center px-3 shadow-inner">
                <span className="text-[10px] text-blue-slate/50 font-mono">splash.io/dashboard</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 bg-platinum/10 dark:bg-transparent">
              {/* Fake dashboard cards */}
              {[
                { title: "Total Volume", value: "$4.2M", diff: "+12%" },
                { title: "Active Corridors", value: "8", diff: "Stable" },
                { title: "Avg Settlement", value: "3.2s", diff: "-0.5s" },
                { title: "Network Status", value: "Optimal", diff: "100% Uptime" }
              ].map((card, i) => (
                <div key={i} className="bg-white dark:bg-dark-bg border border-platinum dark:border-blue-slate/30 p-5 rounded-2xl shadow-sm">
                  <div className="text-xs uppercase tracking-wider font-bold text-blue-slate/60 mb-2">{card.title}</div>
                  <div className="text-2xl font-bold text-blue-slate dark:text-white mb-1">{card.value}</div>
                  <div className="text-xs font-mono font-semibold text-pacific-blue dark:text-pacific-blue">{card.diff}</div>
                </div>
              ))}
              
              <div className="md:col-span-3 bg-white dark:bg-dark-bg border border-platinum dark:border-blue-slate/30 p-6 rounded-2xl h-64 flex items-center justify-center flex-col shadow-sm">
                <div className="w-full flex items-center justify-between mb-4">
                   <div className="text-sm font-bold text-blue-slate dark:text-platinum">Live Settlement Rail Activity</div>
                   <div className="text-[10px] uppercase font-mono px-2 py-1 bg-platinum dark:bg-dark-surface rounded text-blue-slate/70 dark:text-platinum/70">Sui Network</div>
                </div>
                <LiveActivityRail />
              </div>
              
              <div className="md:col-span-1 bg-white dark:bg-dark-bg border border-platinum dark:border-blue-slate/30 p-6 rounded-2xl flex flex-col justify-between shadow-sm">
                <div>
                  <div className="text-xs uppercase tracking-wider font-bold text-blue-slate/60 mb-4">Recent Txns</div>
                  <RecentTransactions />
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-white/80 dark:bg-dark-surface/80 backdrop-blur-md border-y border-platinum/50 dark:border-blue-slate/30 relative z-10">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-blue-slate dark:text-white mb-4">Engineered for Scale</h2>
              <p className="text-blue-slate/70 dark:text-platinum/80 max-w-2xl mx-auto text-lg font-medium">Next-generation primitives solving cross-border friction.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
              <FeatureCard 
                icon={<Activity className="text-tangerine w-6 h-6" />}
                title="Sub-Second Finality"
                desc="Transactions confirm in under a second using Sui's parallel execution engine, minimizing FX exposure."
              />
              <FeatureCard 
                icon={<Shield className="text-tangerine w-6 h-6" />}
                title="Bank-Grade Security"
                desc="AES-256 encryption at rest and in transit. SOC 2 Type II compliance roadmap underway."
              />
              <FeatureCard 
                icon={<Earth className="text-tangerine w-6 h-6" />}
                title="Liquidity Networks"
                desc="Deep liquidity pools across SEA corridors, enabling large-volume swaps with minimal slippage."
              />
            </div>

            {/* Comparison Table */}
            <div className="mt-16 text-center max-w-4xl mx-auto">
              <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-blue-slate dark:text-white mb-10">The Splash Advantage</h3>
              <div className="overflow-hidden rounded-2xl border border-blue-slate/10 dark:border-blue-slate/30 bg-white/50 dark:bg-dark-bg/50 backdrop-blur-sm shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-platinum/50 dark:bg-dark-surface/50 font-bold border-b border-blue-slate/10 dark:border-blue-slate/30 text-sm md:text-base text-blue-slate dark:text-platinum">
                        <th className="p-4 md:px-6 md:py-5 w-1/3">Feature</th>
                        <th className="p-4 md:px-6 md:py-5 w-1/3 bg-pacific-blue/5 text-pacific-blue dark:text-pacific-blue">Splash Networks</th>
                        <th className="p-4 md:px-6 md:py-5 w-1/3 text-blue-slate/70 dark:text-platinum/70">Traditional Bank/SWIFT</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm md:text-base divide-y divide-blue-slate/5 dark:divide-blue-slate/20">
                      <tr>
                        <td className="p-4 md:px-6 md:py-5 font-semibold text-blue-slate dark:text-platinum">Settlement Time</td>
                        <td className="p-4 md:px-6 md:py-5 font-bold text-pacific-blue bg-pacific-blue/5">&lt; 5 Minutes</td>
                        <td className="p-4 md:px-6 md:py-5 text-blue-slate/70 dark:text-platinum/70">1-5 Business Days</td>
                      </tr>
                      <tr>
                        <td className="p-4 md:px-6 md:py-5 font-semibold text-blue-slate dark:text-platinum">Transaction Fees</td>
                        <td className="p-4 md:px-6 md:py-5 font-bold text-pacific-blue bg-pacific-blue/5">Flat $0.50 (Sui PTB)</td>
                        <td className="p-4 md:px-6 md:py-5 text-blue-slate/70 dark:text-platinum/70">$15 - $50 + Intermediaries</td>
                      </tr>
                      <tr>
                        <td className="p-4 md:px-6 md:py-5 font-semibold text-blue-slate dark:text-platinum">FX Spread</td>
                        <td className="p-4 md:px-6 md:py-5 font-bold text-pacific-blue bg-pacific-blue/5">0.1% - 0.3% (Market)</td>
                        <td className="p-4 md:px-6 md:py-5 text-blue-slate/70 dark:text-platinum/70">2% - 5% (Hidden)</td>
                      </tr>
                      <tr>
                        <td className="p-4 md:px-6 md:py-5 font-semibold text-blue-slate dark:text-platinum">Transparency</td>
                        <td className="p-4 md:px-6 md:py-5 font-bold text-pacific-blue bg-pacific-blue/5">Real-time Explorer</td>
                        <td className="p-4 md:px-6 md:py-5 text-blue-slate/70 dark:text-platinum/70">Opaque / "Processing"</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 bg-white dark:bg-dark-bg border-t border-blue-slate/10 dark:border-blue-slate/30 py-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-pacific-blue flex items-center justify-center">
                <Droplet className="text-white w-4 h-4" />
              </div>
              <div className="font-bold text-xl tracking-tight text-blue-slate dark:text-white">
                Spl<em className="not-italic text-pacific-blue dark:text-pacific-blue">ash</em>
              </div>
            </div>
            <p className="text-sm font-medium text-blue-slate/70 dark:text-platinum/70 mb-6 leading-relaxed">
              Enterprise-grade liquidity and settlement infrastructure for modern cross-border corridors. Based in Southeast Asia.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-blue-slate dark:text-white mb-6 uppercase tracking-wider text-xs">Platform</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-sm font-medium text-blue-slate/70 hover:text-pacific-blue dark:text-platinum/70 dark:hover:text-pacific-blue transition-colors">Treasury Dashboard</a></li>
              <li><a href="#" className="text-sm font-medium text-blue-slate/70 hover:text-pacific-blue dark:text-platinum/70 dark:hover:text-pacific-blue transition-colors">Liquidity API</a></li>
              <li><a href="#" className="text-sm font-medium text-blue-slate/70 hover:text-pacific-blue dark:text-platinum/70 dark:hover:text-pacific-blue transition-colors">Supported Corridors</a></li>
              <li><a href="#" className="text-sm font-medium text-blue-slate/70 hover:text-pacific-blue dark:text-platinum/70 dark:hover:text-pacific-blue transition-colors">Network Status</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-blue-slate dark:text-white mb-6 uppercase tracking-wider text-xs">Resources</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-sm font-medium text-blue-slate/70 hover:text-pacific-blue dark:text-platinum/70 dark:hover:text-pacific-blue transition-colors">Developer Docs</a></li>
              <li><a href="#" className="text-sm font-medium text-blue-slate/70 hover:text-pacific-blue dark:text-platinum/70 dark:hover:text-pacific-blue transition-colors">Settlement Times</a></li>
              <li><a href="#" className="text-sm font-medium text-blue-slate/70 hover:text-pacific-blue dark:text-platinum/70 dark:hover:text-pacific-blue transition-colors">Sui Architecture</a></li>
              <li><a href="#" className="text-sm font-medium text-blue-slate/70 hover:text-pacific-blue dark:text-platinum/70 dark:hover:text-pacific-blue transition-colors">Blog</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-blue-slate dark:text-white mb-6 uppercase tracking-wider text-xs">Company</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-sm font-medium text-blue-slate/70 hover:text-pacific-blue dark:text-platinum/70 dark:hover:text-pacific-blue transition-colors">About Us</a></li>
              <li><a href="#" className="text-sm font-medium text-blue-slate/70 hover:text-pacific-blue dark:text-platinum/70 dark:hover:text-pacific-blue transition-colors">Compliance</a></li>
              <li><a href="#" className="text-sm font-medium text-blue-slate/70 hover:text-pacific-blue dark:text-platinum/70 dark:hover:text-pacific-blue transition-colors">Careers</a></li>
              <li><a href="#" className="text-sm font-medium text-blue-slate/70 hover:text-pacific-blue dark:text-platinum/70 dark:hover:text-pacific-blue transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-blue-slate/10 dark:border-blue-slate/30 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm font-medium text-blue-slate/50 dark:text-platinum/50">
            © {new Date().getFullYear()} Splash Networks. All rights reserved.
          </div>
          <div className="text-sm font-medium text-blue-slate/50 dark:text-platinum/50 flex items-center gap-2">
            Secured by <Shield className="w-4 h-4 ml-1 inline text-blue-slate/40 dark:text-platinum/40" />
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="p-8 rounded-3xl bg-white dark:bg-dark-bg border border-blue-slate/10 dark:border-blue-slate/30 transition-all hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-pacific-blue/10">
      <div className="w-12 h-12 rounded-xl bg-tangerine/10 dark:bg-tangerine/10 flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-blue-slate dark:text-white mb-3">{title}</h3>
      <p className="text-blue-slate/70 dark:text-platinum/70 leading-relaxed font-medium">
        {desc}
      </p>
    </div>
  );
}

