'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Activity, Zap, Shield, Globe, ExternalLink, ChevronRight, Database, Server, Clock, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { BottomNav } from '@/components/BottomNav';

const preMarketTokens = [
  {
    name: "Paxi AI (PAI)",
    symbol: "PAI",
    desc: "AI-powered oracle for the Paxi Network ecosystem.",
    status: "Upcoming",
    price: "$0.05",
    change: "+12.5%",
    volume: "$1.2M",
    image: "https://picsum.photos/seed/pai/400/400"
  },
  {
    name: "WinSnip (WNS)",
    symbol: "WNS",
    desc: "Decentralized social media platform on Paxi.",
    status: "Live",
    price: "$0.12",
    change: "+8.2%",
    volume: "$850K",
    image: "https://picsum.photos/seed/wns/400/400"
  }
];

export default function PreMarketPage() {
  return (
    <div className="flex-1 bg-[#080A0F] text-white pb-32 overflow-y-auto no-scrollbar">
      {/* Header */}
      <header className="px-6 pt-12 pb-8 sticky top-0 bg-[#080A0F]/80 backdrop-blur-md z-10">
        <Link href="/explorer" className="inline-flex items-center gap-2 text-[#00E5CC] font-bold text-xs uppercase tracking-widest mb-6">
          <ArrowLeft size={16} />
          Back to Explorer
        </Link>
        <h1 className="font-display text-3xl font-black tracking-tighter">
          PRE-MARKET
        </h1>
        <p className="text-xs text-[#6B7280] font-medium mt-1 uppercase tracking-widest">Trade Tokens Before Listing</p>
      </header>

      <div className="px-6 space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#0E1118] border border-[#1A2030] rounded-2xl p-5">
            <Clock size={18} className="text-[#00E5CC] mb-3" />
            <p className="text-[10px] text-[#6B7280] uppercase font-bold mb-1">Active Markets</p>
            <p className="text-xl font-display font-black">8</p>
          </div>
          <div className="bg-[#0E1118] border border-[#1A2030] rounded-2xl p-5">
            <TrendingUp size={18} className="text-yellow-400 mb-3" />
            <p className="text-[10px] text-[#6B7280] uppercase font-bold mb-1">24h Volume</p>
            <p className="text-xl font-display font-black">$2.1M</p>
          </div>
        </div>

        {/* Pre-Market Tokens */}
        <section>
          <h3 className="font-display font-bold text-xs text-[#6B7280] uppercase tracking-widest mb-4 px-2">Active Pre-Markets</h3>
          <div className="space-y-4">
            {preMarketTokens.map((p, i) => (
              <div key={i} className="bg-[#0E1118] border border-[#1A2030] rounded-3xl overflow-hidden group">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-2xl overflow-hidden bg-[#141820] border border-[#1A2030]">
                        <Image 
                          src={p.image} 
                          alt={p.name} 
                          fill
                          className="object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold leading-none mb-1">{p.name}</h4>
                        <p className="text-xs text-[#6B7280] font-medium">{p.symbol} • PRC20</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-display font-black text-[#00E5CC]">{p.price}</p>
                      <p className="text-[10px] font-bold text-green-500 uppercase tracking-widest">{p.change}</p>
                    </div>
                  </div>
                  
                  <p className="text-sm text-[#9CA3AF] leading-relaxed mb-6">
                    {p.desc}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div>
                      <p className="text-[10px] text-[#6B7280] uppercase font-bold mb-1">24h Volume</p>
                      <p className="text-xs font-bold">{p.volume}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-[#6B7280] uppercase font-bold mb-1">Status</p>
                      <p className={`text-xs font-bold ${p.status === 'Live' ? 'text-[#00E5CC]' : 'text-blue-400'}`}>{p.status}</p>
                    </div>
                  </div>

                  <button className="w-full bg-[#141820] border border-[#1A2030] py-4 rounded-2xl font-display font-black text-xs uppercase tracking-widest hover:bg-[#00E5CC] hover:text-[#080A0F] transition-all">
                    Trade Pre-Market
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Info Card */}
        <div className="bg-[#141820] border border-[#1A2030] rounded-3xl p-8">
          <h3 className="text-xl font-display font-black mb-4">How it works?</h3>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-[#00E5CC]/10 flex items-center justify-center text-[#00E5CC] font-bold text-xs shrink-0">1</div>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                Pre-market trading allows you to buy and sell tokens before they are officially listed on the main exchange.
              </p>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-[#00E5CC]/10 flex items-center justify-center text-[#00E5CC] font-bold text-xs shrink-0">2</div>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                Prices are determined by supply and demand within the pre-market pool, which may differ from the initial listing price.
              </p>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-[#00E5CC]/10 flex items-center justify-center text-[#00E5CC] font-bold text-xs shrink-0">3</div>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                Once the token is officially listed, pre-market tokens are automatically converted to the main token at a 1:1 ratio.
              </p>
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
