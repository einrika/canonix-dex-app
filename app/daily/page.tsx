'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Activity, Zap, Shield, Globe, ExternalLink, ChevronRight, Database, Server, Clock, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { BottomNav } from '@/components/BottomNav';

const dailyStats = [
  {
    name: "Total Volume",
    value: "$1.2M",
    change: "+12.5%",
    icon: TrendingUp,
    color: "text-[#00E5CC]"
  },
  {
    name: "New Tokens",
    value: "12",
    change: "+2",
    icon: Zap,
    color: "text-yellow-400"
  },
  {
    name: "Active Users",
    value: "1,250",
    change: "+150",
    icon: Globe,
    color: "text-blue-500"
  }
];

export default function DailyPage() {
  return (
    <div className="min-h-screen bg-[#080A0F] text-white pb-32">
      {/* Header */}
      <header className="px-6 pt-12 pb-8 sticky top-0 bg-[#080A0F]/80 backdrop-blur-md z-10">
        <Link href="/explorer" className="inline-flex items-center gap-2 text-[#00E5CC] font-bold text-xs uppercase tracking-widest mb-6">
          <ArrowLeft size={16} />
          Back to Explorer
        </Link>
        <h1 className="font-display text-3xl font-black tracking-tighter">
          DAILY STATS
        </h1>
        <p className="text-xs text-[#6B7280] font-medium mt-1 uppercase tracking-widest">Network Activity Overview</p>
      </header>

      <div className="px-6 space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-3">
          {dailyStats.map((s, i) => (
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
                <span className={`text-[10px] font-bold uppercase tracking-widest text-green-500`}>
                  {s.change}
                </span>
                <ChevronRight size={16} className="text-[#1A2030] group-hover:text-[#00E5CC] transition-colors ml-auto mt-1" />
              </div>
            </div>
          ))}
        </div>

        {/* Activity Chart Placeholder */}
        <div className="bg-[#0E1118] border border-[#1A2030] rounded-3xl p-8 text-center">
          <h3 className="text-xl font-display font-black mb-4">Activity Chart</h3>
          <div className="h-48 w-full bg-[#141820] rounded-2xl flex items-center justify-center text-[#6B7280] font-bold text-xs">
            Chart Placeholder
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-[#141820] border border-[#1A2030] rounded-3xl p-8">
          <h3 className="text-xl font-display font-black mb-4">Daily Insights</h3>
          <p className="text-xs text-[#6B7280] leading-relaxed mb-4">
            Network activity is increasing, with a 12.5% increase in total volume over the last 24 hours. This indicates a growing interest in the Paxi Network ecosystem.
          </p>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-[#00E5CC]/10 flex items-center justify-center text-[#00E5CC] font-bold text-xs shrink-0">1</div>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                Total volume reached $1.2M, a significant milestone for the DEX.
              </p>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-[#00E5CC]/10 flex items-center justify-center text-[#00E5CC] font-bold text-xs shrink-0">2</div>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                12 new tokens were listed on the launchpad, showing strong creator interest.
              </p>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-[#00E5CC]/10 flex items-center justify-center text-[#00E5CC] font-bold text-xs shrink-0">3</div>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                Active users increased by 150, reaching a total of 1,250.
              </p>
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
