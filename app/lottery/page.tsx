'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Ticket, Zap, Shield, Globe, ExternalLink, ChevronRight, Database, Server, Clock, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { BottomNav } from '@/components/BottomNav';

const lotteryStats = [
  {
    name: "Total Prize Pool",
    value: "10,000 CNX",
    icon: Ticket,
    color: "text-[#00E5CC]"
  },
  {
    name: "Next Draw",
    value: "2d 14h",
    icon: Clock,
    color: "text-yellow-400"
  },
  {
    name: "Total Participants",
    value: "1,250",
    icon: Globe,
    color: "text-blue-500"
  }
];

export default function LotteryPage() {
  return (
    <div className="flex-1 bg-[#080A0F] text-white pb-32 overflow-y-auto no-scrollbar">
      {/* Header */}
      <header className="px-6 pt-12 pb-8 sticky top-0 bg-[#080A0F]/80 backdrop-blur-md z-10">
        <Link href="/explorer" className="inline-flex items-center gap-2 text-[#00E5CC] font-bold text-xs uppercase tracking-widest mb-6">
          <ArrowLeft size={16} />
          Back to Explorer
        </Link>
        <h1 className="font-display text-3xl font-black tracking-tighter">
          LOTTERY
        </h1>
        <p className="text-xs text-[#6B7280] font-medium mt-1 uppercase tracking-widest">Win Big with Canonix</p>
      </header>

      <div className="px-6 space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-3">
          {lotteryStats.map((s, i) => (
            <div key={i} className="bg-[#0E1118] border border-[#1A2030] rounded-2xl p-6 flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl bg-[#141820] flex items-center justify-center ${s.color}`}>
                  <s.icon size={24} />
                </div>
                <div>
                  <h4 className="text-sm font-bold mb-1">{s.name}</h4>
                  <p className="text-xl font-display font-black">{s.value}</p>
                </div>
              </div>
              <div className="text-right">
                <ChevronRight size={16} className="text-[#1A2030] group-hover:text-[#00E5CC] transition-colors ml-auto mt-1" />
              </div>
            </div>
          ))}
        </div>

        {/* Ticket Purchase Card */}
        <div className="bg-gradient-to-br from-[#00E5CC] to-[#00BFA5] rounded-3xl p-8 text-center">
          <h3 className="text-2xl font-display font-black text-[#080A0F] mb-2">Buy Your Tickets</h3>
          <p className="text-[#080A0F]/70 text-sm font-medium mb-6">
            Each ticket costs 10 CNX. Buy more tickets to increase your chances of winning!
          </p>
          <div className="flex items-center justify-center gap-4 mb-8">
            <button className="w-10 h-10 rounded-full bg-[#080A0F] text-white flex items-center justify-center font-bold">-</button>
            <span className="text-2xl font-display font-black text-[#080A0F]">1</span>
            <button className="w-10 h-10 rounded-full bg-[#080A0F] text-white flex items-center justify-center font-bold">+</button>
          </div>
          <button className="inline-flex items-center justify-center bg-[#080A0F] text-white px-8 py-4 rounded-2xl font-display font-black text-sm uppercase tracking-wider shadow-xl">
            Buy Now
          </button>
        </div>

        {/* Info Card */}
        <div className="bg-[#141820] border border-[#1A2030] rounded-3xl p-8">
          <h3 className="text-xl font-display font-black mb-4">How it works?</h3>
          <p className="text-xs text-[#6B7280] leading-relaxed mb-4">
            The Canonix Lottery is a decentralized lottery system where you can win CNX rewards. Each ticket costs 10 CNX and gives you a chance to win the prize pool.
          </p>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-[#00E5CC]/10 flex items-center justify-center text-[#00E5CC] font-bold text-xs shrink-0">1</div>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                Purchase tickets using CNX. Each ticket costs 10 CNX.
              </p>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-[#00E5CC]/10 flex items-center justify-center text-[#00E5CC] font-bold text-xs shrink-0">2</div>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                The lottery draw happens every 3 days. Winners are chosen randomly.
              </p>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-[#00E5CC]/10 flex items-center justify-center text-[#00E5CC] font-bold text-xs shrink-0">3</div>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                Prizes are automatically distributed to the winners&apos; wallets.
              </p>
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
