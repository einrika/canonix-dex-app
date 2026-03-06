'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Gift, Zap, Shield, Globe, ExternalLink, ChevronRight, Database, Server, Clock, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { BottomNav } from '@/components/BottomNav';

const rewards = [
  {
    name: "Daily Login",
    desc: "Login every day to earn CNX rewards.",
    reward: "10 CNX",
    status: "Available",
    icon: Clock,
    color: "text-[#00E5CC]"
  },
  {
    name: "Trading Volume",
    desc: "Reach $1,000 trading volume to earn rewards.",
    reward: "100 CNX",
    status: "In Progress",
    icon: TrendingUp,
    color: "text-blue-500"
  },
  {
    name: "Community Event",
    desc: "Participate in our community events.",
    reward: "50 CNX",
    status: "Locked",
    icon: Gift,
    color: "text-pink-500"
  }
];

export default function RewardsPage() {
  return (
    <div className="min-h-screen bg-[#080A0F] text-white pb-32">
      {/* Header */}
      <header className="px-6 pt-12 pb-8 sticky top-0 bg-[#080A0F]/80 backdrop-blur-md z-10">
        <Link href="/explorer" className="inline-flex items-center gap-2 text-[#00E5CC] font-bold text-xs uppercase tracking-widest mb-6">
          <ArrowLeft size={16} />
          Back to Explorer
        </Link>
        <h1 className="font-display text-3xl font-black tracking-tighter">
          REWARDS
        </h1>
        <p className="text-xs text-[#6B7280] font-medium mt-1 uppercase tracking-widest">Earn While You Trade</p>
      </header>

      <div className="px-6 space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#0E1118] border border-[#1A2030] rounded-2xl p-5">
            <Gift size={18} className="text-[#00E5CC] mb-3" />
            <p className="text-[10px] text-[#6B7280] uppercase font-bold mb-1">Total Earned</p>
            <p className="text-xl font-display font-black">1,250 CNX</p>
          </div>
          <div className="bg-[#0E1118] border border-[#1A2030] rounded-2xl p-5">
            <Zap size={18} className="text-yellow-400 mb-3" />
            <p className="text-[10px] text-[#6B7280] uppercase font-bold mb-1">Pending Rewards</p>
            <p className="text-xl font-display font-black">150 CNX</p>
          </div>
        </div>

        {/* Active Rewards */}
        <section>
          <h3 className="font-display font-bold text-xs text-[#6B7280] uppercase tracking-widest mb-4 px-2">Active Rewards</h3>
          <div className="space-y-4">
            {rewards.map((r, i) => (
              <div key={i} className="bg-[#0E1118] border border-[#1A2030] rounded-3xl p-6 flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl bg-[#141820] flex items-center justify-center ${r.color}`}>
                    <r.icon size={24} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold mb-1">{r.name}</h4>
                    <p className="text-[10px] text-[#6B7280] font-medium mb-1">{r.desc}</p>
                    <p className="text-xs font-bold text-[#00E5CC]">{r.reward}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${r.status === 'Available' ? 'text-[#00E5CC]' : 'text-[#6B7280]'}`}>
                    {r.status}
                  </span>
                  <ChevronRight size={16} className="text-[#1A2030] group-hover:text-[#00E5CC] transition-colors ml-auto mt-1" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Claim Card */}
        <div className="bg-gradient-to-br from-[#00E5CC] to-[#00BFA5] rounded-3xl p-8 text-center">
          <h3 className="text-2xl font-display font-black text-[#080A0F] mb-2">Claim Your Rewards</h3>
          <p className="text-[#080A0F]/70 text-sm font-medium mb-6">
            You have 150 CNX pending rewards. Claim them now to add them to your wallet.
          </p>
          <button className="inline-flex items-center justify-center bg-[#080A0F] text-white px-8 py-4 rounded-2xl font-display font-black text-sm uppercase tracking-wider shadow-xl">
            Claim Now
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
