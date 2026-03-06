'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Rocket, Zap, Shield, Globe, ExternalLink, ChevronRight, Activity, Database, Server } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { BottomNav } from '@/components/BottomNav';

const projects = [
  {
    name: "Canonix (CNX)",
    symbol: "CNX",
    desc: "The Pulse of Paxi Network. Meme Energy, Real Utility.",
    status: "Live",
    raised: "120,000 CNX",
    goal: "200,000 CNX",
    progress: 60,
    color: "bg-[#00E5CC]",
    image: "https://picsum.photos/seed/cnx/400/400"
  },
  {
    name: "Paxi Swap (PXS)",
    symbol: "PXS",
    desc: "Next-gen AMM for the Paxi Network ecosystem.",
    status: "Upcoming",
    raised: "0 PXS",
    goal: "500,000 PXS",
    progress: 0,
    color: "bg-blue-500",
    image: "https://picsum.photos/seed/pxs/400/400"
  }
];

export default function LaunchpadPage() {
  return (
    <div className="min-h-screen bg-[#080A0F] text-white pb-32">
      {/* Header */}
      <header className="px-6 pt-12 pb-8 sticky top-0 bg-[#080A0F]/80 backdrop-blur-md z-10">
        <Link href="/explorer" className="inline-flex items-center gap-2 text-[#00E5CC] font-bold text-xs uppercase tracking-widest mb-6">
          <ArrowLeft size={16} />
          Back to Explorer
        </Link>
        <h1 className="font-display text-3xl font-black tracking-tighter">
          LAUNCHPAD
        </h1>
        <p className="text-xs text-[#6B7280] font-medium mt-1 uppercase tracking-widest">Early Access to New Projects</p>
      </header>

      <div className="px-6 space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#0E1118] border border-[#1A2030] rounded-2xl p-5">
            <Rocket size={18} className="text-[#00E5CC] mb-3" />
            <p className="text-[10px] text-[#6B7280] uppercase font-bold mb-1">Total Projects</p>
            <p className="text-xl font-display font-black">12</p>
          </div>
          <div className="bg-[#0E1118] border border-[#1A2030] rounded-2xl p-5">
            <Zap size={18} className="text-yellow-400 mb-3" />
            <p className="text-[10px] text-[#6B7280] uppercase font-bold mb-1">Total Raised</p>
            <p className="text-xl font-display font-black">$4.2M</p>
          </div>
        </div>

        {/* Featured Projects */}
        <section>
          <h3 className="font-display font-bold text-xs text-[#6B7280] uppercase tracking-widest mb-4 px-2">Featured Projects</h3>
          <div className="space-y-4">
            {projects.map((p, i) => (
              <div key={i} className="bg-[#0E1118] border border-[#1A2030] rounded-3xl overflow-hidden group">
                <div className="relative h-48 overflow-hidden">
                  <Image 
                    src={p.image} 
                    alt={p.name} 
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 right-4 bg-[#080A0F]/80 backdrop-blur-md px-3 py-1 rounded-full border border-[#1A2030] z-10">
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${p.status === 'Live' ? 'text-[#00E5CC]' : 'text-blue-400'}`}>
                      {p.status}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-xl ${p.color} flex items-center justify-center text-[#080A0F] font-display font-black text-xs shrink-0`}>
                      {p.symbol}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold leading-none mb-1">{p.name}</h4>
                      <p className="text-xs text-[#6B7280] font-medium">{p.symbol} • PRC20</p>
                    </div>
                  </div>
                  <p className="text-sm text-[#9CA3AF] leading-relaxed mb-6">
                    {p.desc}
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-end mb-1">
                      <p className="text-[10px] text-[#6B7280] uppercase font-bold">Progress</p>
                      <p className="text-xs font-bold">{p.progress}%</p>
                    </div>
                    <div className="h-2 w-full bg-[#141820] rounded-full overflow-hidden">
                      <div className={`h-full ${p.color}`} style={{ width: `${p.progress}%` }} />
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-[10px] text-[#6B7280] uppercase font-bold">Raised</p>
                        <p className="text-xs font-bold">{p.raised}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-[#6B7280] uppercase font-bold">Goal</p>
                        <p className="text-xs font-bold">{p.goal}</p>
                      </div>
                    </div>
                  </div>

                  <button className="w-full mt-8 bg-[#141820] border border-[#1A2030] py-4 rounded-2xl font-display font-black text-xs uppercase tracking-widest hover:bg-[#00E5CC] hover:text-[#080A0F] transition-all">
                    View Project Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Apply Section */}
        <div className="bg-gradient-to-br from-[#00E5CC] to-[#00BFA5] rounded-3xl p-8 text-center">
          <h3 className="text-2xl font-display font-black text-[#080A0F] mb-2">Launch Your Project</h3>
          <p className="text-[#080A0F]/70 text-sm font-medium mb-6">
            Apply to be part of the Canonix Launchpad and gain access to our community and tools.
          </p>
          <button className="inline-flex items-center justify-center bg-[#080A0F] text-white px-8 py-4 rounded-2xl font-display font-black text-sm uppercase tracking-wider shadow-xl">
            Apply Now
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
