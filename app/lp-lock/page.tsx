'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Lock, Zap, Shield, Globe, ExternalLink, ChevronRight, Database, Server, Clock, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { BottomNav } from '@/components/BottomNav';

const lockedPools = [
  {
    name: "CNX / PXI",
    symbol: "CNX-PXI",
    desc: "Canonix / Paxi Liquidity Pool.",
    total: "$120,000",
    locked: "$120,000",
    unlocked: "$0",
    progress: 100,
    color: "bg-[#00E5CC]",
    image: "https://picsum.photos/seed/cnx/400/400"
  },
  {
    name: "PXS / PXI",
    symbol: "PXS-PXI",
    desc: "Paxi Swap / Paxi Liquidity Pool.",
    total: "$50,000",
    locked: "$45,000",
    unlocked: "$5,000",
    progress: 90,
    color: "bg-blue-500",
    image: "https://picsum.photos/seed/pxs/400/400"
  }
];

export default function LPLockPage() {
  return (
    <div className="flex-1 bg-[#080A0F] text-white pb-32 overflow-y-auto no-scrollbar">
      {/* Header */}
      <header className="px-6 pt-12 pb-8 sticky top-0 bg-[#080A0F]/80 backdrop-blur-md z-10">
        <Link href="/explorer" className="inline-flex items-center gap-2 text-[#00E5CC] font-bold text-xs uppercase tracking-widest mb-6">
          <ArrowLeft size={16} />
          Back to Explorer
        </Link>
        <h1 className="font-display text-3xl font-black tracking-tighter">
          LP LOCK
        </h1>
        <p className="text-xs text-[#6B7280] font-medium mt-1 uppercase tracking-widest">Locked Liquidity Pools</p>
      </header>

      <div className="px-6 space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#0E1118] border border-[#1A2030] rounded-2xl p-5">
            <Lock size={18} className="text-[#00E5CC] mb-3" />
            <p className="text-[10px] text-[#6B7280] uppercase font-bold mb-1">Total Locked LP</p>
            <p className="text-xl font-display font-black">$2.4M</p>
          </div>
          <div className="bg-[#0E1118] border border-[#1A2030] rounded-2xl p-5">
            <Shield size={18} className="text-yellow-400 mb-3" />
            <p className="text-[10px] text-[#6B7280] uppercase font-bold mb-1">Verified Pools</p>
            <p className="text-xl font-display font-black">42</p>
          </div>
        </div>

        {/* Locked Pools */}
        <section>
          <h3 className="font-display font-bold text-xs text-[#6B7280] uppercase tracking-widest mb-4 px-2">Active Locks</h3>
          <div className="space-y-4">
            {lockedPools.map((v, i) => (
              <div key={i} className="bg-[#0E1118] border border-[#1A2030] rounded-3xl overflow-hidden group">
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="relative w-12 h-12 rounded-2xl overflow-hidden bg-[#141820] border border-[#1A2030]">
                      <Image 
                        src={v.image} 
                        alt={v.name} 
                        fill
                        className="object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold leading-none mb-1">{v.name}</h4>
                      <p className="text-xs text-[#6B7280] font-medium">{v.symbol} • LP Token</p>
                    </div>
                  </div>
                  
                  <p className="text-sm text-[#9CA3AF] leading-relaxed mb-6">
                    {v.desc}
                  </p>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between items-end mb-1">
                      <p className="text-[10px] text-[#6B7280] uppercase font-bold">Lock Progress</p>
                      <p className="text-xs font-bold">{v.progress}%</p>
                    </div>
                    <div className="h-2 w-full bg-[#141820] rounded-full overflow-hidden">
                      <div className={`h-full ${v.color}`} style={{ width: `${v.progress}%` }} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[10px] text-[#6B7280] uppercase font-bold mb-1">Locked</p>
                        <p className="text-xs font-bold">{v.locked}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-[#6B7280] uppercase font-bold mb-1">Unlocked</p>
                        <p className="text-xs font-bold">{v.unlocked}</p>
                      </div>
                    </div>
                  </div>

                  <button className="w-full bg-[#141820] border border-[#1A2030] py-4 rounded-2xl font-display font-black text-xs uppercase tracking-widest hover:bg-[#00E5CC] hover:text-[#080A0F] transition-all">
                    View Lock Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Info Card */}
        <div className="bg-[#141820] border border-[#1A2030] rounded-3xl p-8">
          <h3 className="text-xl font-display font-black mb-4">Why LP Lock?</h3>
          <p className="text-xs text-[#6B7280] leading-relaxed mb-4">
            LP Lock is a security feature that prevents token creators from removing liquidity from the pool. This ensures that traders can always swap their tokens and protects against rug pulls.
          </p>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-[#00E5CC]/10 flex items-center justify-center text-[#00E5CC] font-bold text-xs shrink-0">1</div>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                Liquidity tokens are locked in a smart contract for a specified period.
              </p>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-[#00E5CC]/10 flex items-center justify-center text-[#00E5CC] font-bold text-xs shrink-0">2</div>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                The lock period is transparent and can be verified by anyone.
              </p>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-[#00E5CC]/10 flex items-center justify-center text-[#00E5CC] font-bold text-xs shrink-0">3</div>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                Locked liquidity provides confidence to traders and investors.
              </p>
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
