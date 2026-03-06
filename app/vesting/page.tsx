'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Shield, Zap, Globe, ExternalLink, ChevronRight, Database, Server, Clock, TrendingUp, Lock } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { BottomNav } from '@/components/BottomNav';

const vestingSchedules = [
  {
    name: "Canonix (CNX)",
    symbol: "CNX",
    desc: "Team and Advisor vesting schedule.",
    total: "20,000 CNX",
    unlocked: "5,000 CNX",
    locked: "15,000 CNX",
    progress: 25,
    color: "bg-[#00E5CC]",
    image: "https://picsum.photos/seed/cnx/400/400"
  },
  {
    name: "Paxi Swap (PXS)",
    symbol: "PXS",
    desc: "Ecosystem rewards vesting schedule.",
    total: "100,000 PXS",
    unlocked: "10,000 PXS",
    locked: "90,000 PXS",
    progress: 10,
    color: "bg-blue-500",
    image: "https://picsum.photos/seed/pxs/400/400"
  }
];

export default function VestingPage() {
  return (
    <div className="min-h-screen bg-[#080A0F] text-white pb-32">
      {/* Header */}
      <header className="px-6 pt-12 pb-8 sticky top-0 bg-[#080A0F]/80 backdrop-blur-md z-10">
        <Link href="/explorer" className="inline-flex items-center gap-2 text-[#00E5CC] font-bold text-xs uppercase tracking-widest mb-6">
          <ArrowLeft size={16} />
          Back to Explorer
        </Link>
        <h1 className="font-display text-3xl font-black tracking-tighter">
          VESTING
        </h1>
        <p className="text-xs text-[#6B7280] font-medium mt-1 uppercase tracking-widest">Token Release Schedules</p>
      </header>

      <div className="px-6 space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#0E1118] border border-[#1A2030] rounded-2xl p-5">
            <Lock size={18} className="text-[#00E5CC] mb-3" />
            <p className="text-[10px] text-[#6B7280] uppercase font-bold mb-1">Total Locked</p>
            <p className="text-xl font-display font-black">$1.2M</p>
          </div>
          <div className="bg-[#0E1118] border border-[#1A2030] rounded-2xl p-5">
            <Zap size={18} className="text-yellow-400 mb-3" />
            <p className="text-[10px] text-[#6B7280] uppercase font-bold mb-1">Next Release</p>
            <p className="text-xl font-display font-black">2d 14h</p>
          </div>
        </div>

        {/* Vesting Schedules */}
        <section>
          <h3 className="font-display font-bold text-xs text-[#6B7280] uppercase tracking-widest mb-4 px-2">Active Schedules</h3>
          <div className="space-y-4">
            {vestingSchedules.map((v, i) => (
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
                      <p className="text-xs text-[#6B7280] font-medium">{v.symbol} • PRC20</p>
                    </div>
                  </div>
                  
                  <p className="text-sm text-[#9CA3AF] leading-relaxed mb-6">
                    {v.desc}
                  </p>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between items-end mb-1">
                      <p className="text-[10px] text-[#6B7280] uppercase font-bold">Vesting Progress</p>
                      <p className="text-xs font-bold">{v.progress}%</p>
                    </div>
                    <div className="h-2 w-full bg-[#141820] rounded-full overflow-hidden">
                      <div className={`h-full ${v.color}`} style={{ width: `${v.progress}%` }} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[10px] text-[#6B7280] uppercase font-bold mb-1">Unlocked</p>
                        <p className="text-xs font-bold">{v.unlocked}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-[#6B7280] uppercase font-bold mb-1">Locked</p>
                        <p className="text-xs font-bold">{v.locked}</p>
                      </div>
                    </div>
                  </div>

                  <button className="w-full bg-[#141820] border border-[#1A2030] py-4 rounded-2xl font-display font-black text-xs uppercase tracking-widest hover:bg-[#00E5CC] hover:text-[#080A0F] transition-all">
                    View Vesting Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Info Card */}
        <div className="bg-[#141820] border border-[#1A2030] rounded-3xl p-8">
          <h3 className="text-xl font-display font-black mb-4">What is Vesting?</h3>
          <p className="text-xs text-[#6B7280] leading-relaxed mb-4">
            Vesting is a process where tokens are locked and released over a period of time. This ensures long-term commitment from the team and prevents market dumps.
          </p>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-[#00E5CC]/10 flex items-center justify-center text-[#00E5CC] font-bold text-xs shrink-0">1</div>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                Tokens are released linearly or in batches according to the schedule.
              </p>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-[#00E5CC]/10 flex items-center justify-center text-[#00E5CC] font-bold text-xs shrink-0">2</div>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                Once unlocked, tokens can be claimed and traded freely.
              </p>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-[#00E5CC]/10 flex items-center justify-center text-[#00E5CC] font-bold text-xs shrink-0">3</div>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                Vesting schedules are transparent and verifiable on the blockchain.
              </p>
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
