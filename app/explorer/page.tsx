'use client';

import { useQuery } from '@tanstack/react-query';
import { canonixApi } from '@/lib/canonix-api';
import { BottomNav } from '@/components/BottomNav';
import { Providers } from '@/components/Providers';
import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { Globe, Activity, Zap, Shield, ExternalLink, Server, Cpu, Database, ArrowRight, LayoutGrid, Settings, HelpCircle, Gift, Lock, Ticket } from 'lucide-react';
import Link from 'next/link';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function ExplorerContent() {
  const { data: nodeStatus } = useQuery({
    queryKey: ['nodeStatus'],
    queryFn: canonixApi.getNodeStatus,
  });

  const { data: tokensData } = useQuery({
    queryKey: ['tokens'],
    queryFn: canonixApi.getTokenList,
  });

  const tokens = useMemo(() => Array.isArray(tokensData) ? tokensData : [], [tokensData]);

  const verifiedCount = tokens.filter(t => t.is_verified).length;
  const pumpCount = tokens.filter(t => t.is_pump).length;

  const stats = [
    { label: 'RPC Endpoint', value: 'mainnet-rpc.paxinet.io', icon: Server },
    { label: 'LCD Endpoint', value: 'mainnet-lcd.paxinet.io', icon: Database },
    { label: 'Network', value: 'Paxi Network', icon: Globe },
    { label: 'Native Token', value: 'PXI', icon: Zap },
  ];

  const ecosystem = [
    { name: 'Canonix DEX', url: 'https://canonix.my.id', desc: 'Primary DEX platform', icon: Globe },
    { name: 'Paxi Explorer', url: 'https://explorer.paxinet.io', desc: 'Block explorer', icon: Activity },
    { name: 'WinScan', url: 'https://winscan.winsnip.xyz', desc: 'Network analytics', icon: Zap },
  ];

  const features = [
    { name: 'Launchpad', path: '/launchpad', icon: Zap, color: 'text-yellow-400' },
    { name: 'Pre-Market', path: '/pre-market', icon: Activity, color: 'text-blue-400' },
    { name: 'Vesting', path: '/vesting', icon: Shield, color: 'text-purple-400' },
    { name: 'LP Lock', path: '/lp-lock', icon: Lock, color: 'text-emerald-400' },
    { name: 'Rewards', path: '/rewards', icon: Gift, color: 'text-pink-400' },
    { name: 'Daily', path: '/daily', icon: Activity, color: 'text-cyan-400' },
    { name: 'Lottery', path: '/lottery', icon: Ticket, color: 'text-orange-400' },
    { name: 'FAQ', path: '/faq', icon: HelpCircle, color: 'text-indigo-400' },
  ];

  return (
    <div className="flex-1 pb-32 overflow-y-auto no-scrollbar">
      {/* Header */}
      <header className="px-6 pt-8 pb-4 sticky top-0 bg-[#080A0F]/80 backdrop-blur-md z-10">
        <h1 className="font-display text-2xl font-extrabold tracking-tighter">
          EXPLORER
        </h1>
        <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest mt-1">Paxi Network Status</p>
      </header>

      <div className="px-6 py-4 space-y-6">
        {/* Network Status Card */}
        <div className="bg-gradient-to-br from-[#0E1118] to-[#141820] border border-[#1A2030] rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4">
            <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 px-2 py-1 rounded-md">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-bold text-green-500 uppercase">Online</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-[#00E5CC]/10 flex items-center justify-center text-[#00E5CC]">
              <Activity size={24} />
            </div>
            <div>
              <p className="text-lg font-display font-bold leading-none mb-1">Paxi Mainnet</p>
              <p className="text-xs text-[#6B7280] font-medium">Chain ID: paxi-mainnet-1</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] text-[#6B7280] uppercase font-bold mb-1">Block Height</p>
              <p className="font-mono text-lg font-bold text-[#00E5CC]">{nodeStatus?.block_height?.toLocaleString() || '-------'}</p>
            </div>
            <div>
              <p className="text-[10px] text-[#6B7280] uppercase font-bold mb-1">Total Transactions</p>
              <p className="font-mono text-lg font-bold text-[#00E5CC]">{nodeStatus?.tps?.toLocaleString() || '-------'}</p>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <section>
          <h3 className="font-display font-bold text-xs text-[#6B7280] uppercase tracking-widest mb-4">Degen Tools</h3>
          <div className="grid grid-cols-4 gap-3">
            {features.map((f, i) => (
              <Link key={i} href={f.path}>
                <motion.div 
                  whileTap={{ scale: 0.95 }}
                  className="flex flex-col items-center gap-2 p-3 bg-[#0E1118] border border-[#1A2030] rounded-xl"
                >
                  <div className={cn("w-10 h-10 rounded-lg bg-[#141820] flex items-center justify-center", f.color)}>
                    <f.icon size={20} />
                  </div>
                  <span className="text-[10px] font-bold text-center leading-tight">{f.name}</span>
                </motion.div>
              </Link>
            ))}
          </div>
        </section>

        {/* Network Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#0E1118] border border-[#1A2030] rounded-xl p-4">
            <Activity size={16} className="text-[#6B7280] mb-3" />
            <p className="text-[10px] text-[#6B7280] uppercase font-bold mb-1">Circulating Supply</p>
            <p className="text-xs font-mono font-bold truncate">{(nodeStatus as any)?.circulating_supply?.toLocaleString() || '---'} PXI</p>
          </div>
          <div className="bg-[#0E1118] border border-[#1A2030] rounded-xl p-4">
            <Zap size={16} className="text-[#6B7280] mb-3" />
            <p className="text-[10px] text-[#6B7280] uppercase font-bold mb-1">Total Staked</p>
            <p className="text-xs font-mono font-bold truncate">{(nodeStatus as any)?.total_staked?.toLocaleString() || '---'} PXI</p>
          </div>
          <div className="bg-[#0E1118] border border-[#1A2030] rounded-xl p-4">
            <Server size={16} className="text-[#6B7280] mb-3" />
            <p className="text-[10px] text-[#6B7280] uppercase font-bold mb-1">Total Accounts</p>
            <p className="text-xs font-mono font-bold truncate">{(nodeStatus as any)?.total_accounts?.toLocaleString() || '---'}</p>
          </div>
          <div className="bg-[#0E1118] border border-[#1A2030] rounded-xl p-4">
            <Database size={16} className="text-[#6B7280] mb-3" />
            <p className="text-[10px] text-[#6B7280] uppercase font-bold mb-1">Daily Yield</p>
            <p className="text-xs font-mono font-bold truncate">{((nodeStatus as any)?.daily_yield * 100)?.toFixed(4) || '---'}%</p>
          </div>
        </div>

        {/* Ecosystem Links */}
        <section>
          <h3 className="font-display font-bold text-xs text-[#6B7280] uppercase tracking-widest mb-4">Ecosystem</h3>
          <div className="space-y-2">
            {ecosystem.map((e, i) => (
              <a 
                key={i} 
                href={e.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 bg-[#0E1118] border border-[#1A2030] rounded-xl hover:border-[#00E5CC]/50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#141820] flex items-center justify-center text-[#6B7280] group-hover:text-[#00E5CC] transition-colors">
                    <e.icon size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold">{e.name}</p>
                    <p className="text-[10px] text-[#6B7280]">{e.desc}</p>
                  </div>
                </div>
                <ExternalLink size={16} className="text-[#1A2030] group-hover:text-[#00E5CC] transition-colors" />
              </a>
            ))}
          </div>
        </section>

        {/* CNX Token Card */}
        <Link href="/token-cnx">
          <div className="bg-gradient-to-r from-[#00E5CC]/10 to-transparent border border-[#00E5CC]/20 rounded-2xl p-5 flex items-center justify-between group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#00E5CC] flex items-center justify-center text-[#080A0F] font-display font-black text-xl">
                CNX
              </div>
              <div>
                <p className="text-sm font-bold text-white">Canonix Token (CNX)</p>
                <p className="text-[10px] text-[#00E5CC] font-bold uppercase tracking-widest">The Heart of Ecosystem</p>
              </div>
            </div>
            <ArrowRight size={20} className="text-[#00E5CC] group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Token Stats */}
        <section className="bg-[#0E1118] border border-[#1A2030] rounded-2xl p-5">
          <h3 className="font-display font-bold text-xs text-[#6B7280] uppercase tracking-widest mb-4">Token Statistics</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-[#6B7280]">Total Listed</span>
              <span className="font-mono font-bold">{tokens.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Shield size={14} className="text-[#00E5CC]" />
                <span className="text-sm font-medium text-[#6B7280]">Verified Tokens</span>
              </div>
              <span className="font-mono font-bold">{verifiedCount}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Zap size={14} className="text-yellow-400" />
                <span className="text-sm font-medium text-[#6B7280]">Pump Tokens</span>
              </div>
              <span className="font-mono font-bold">{pumpCount}</span>
            </div>
          </div>
        </section>

        {/* About Card */}
        <div className="p-6 bg-[#141820] border border-[#1A2030] rounded-2xl">
          <h4 className="font-display font-bold text-sm mb-2">About Canonix</h4>
          <p className="text-xs text-[#6B7280] leading-relaxed">
            Canonix is the premier decentralized exchange and token launchpad for the Paxi Network. 
            Empowering creators and traders with high-performance DeFi tools.
          </p>
          <div className="mt-4 pt-4 border-t border-[#1A2030] flex justify-between items-center">
            <span className="text-[10px] font-bold text-[#6B7280]">VERSION 2.4.0-STABLE</span>
            <span className="text-[10px] font-bold text-[#00E5CC]">GITHUB REPO</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ExplorerPage() {
  return (
    <Providers>
      <ExplorerContent />
      <BottomNav />
    </Providers>
  );
}
