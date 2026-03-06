'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, HelpCircle, ChevronDown, Search, Globe, Shield, Zap, Database, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { BottomNav } from '@/components/BottomNav';

const faqs = [
  {
    category: "General",
    items: [
      { q: "What is Canonix?", a: "Canonix is a decentralized exchange (DEX) and launchpad built on the Paxi Network, providing high-performance trading and token management tools." },
      { q: "How do I connect my wallet?", a: "You can connect your wallet by clicking the 'Connect Wallet' button in the Trade or Market sections. We support major Paxi-compatible wallets." },
      { q: "What are the fees?", a: "Trading fees on Canonix are competitive, typically 0.3% per swap, which goes towards liquidity providers and ecosystem development." }
    ]
  },
  {
    category: "Trading",
    items: [
      { q: "How does swapping work?", a: "Swapping uses an Automated Market Maker (AMM) model. You trade directly against a liquidity pool, and the price is determined by the ratio of tokens in the pool." },
      { q: "What is slippage?", a: "Slippage is the difference between the expected price of a trade and the price at which the trade is executed. It can occur during periods of high volatility or low liquidity." },
      { q: "Can I cancel a swap?", a: "Once a transaction is submitted to the blockchain and confirmed, it cannot be reversed or cancelled. Always double-check your trade details." }
    ]
  },
  {
    category: "Launchpad",
    items: [
      { q: "How can I launch my token?", a: "You can apply for the Canonix Launchpad through our developer portal. We review projects based on utility, team, and community potential." },
      { q: "What is a PRC20 token?", a: "PRC20 is the standard token format on the Paxi Network, similar to ERC20 on Ethereum, allowing for seamless integration across the ecosystem." }
    ]
  }
];

export default function FAQPage() {
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);

  const filteredFaqs = faqs.map(cat => ({
    ...cat,
    items: cat.items.filter(i => 
      i.q.toLowerCase().includes(search.toLowerCase()) || 
      i.a.toLowerCase().includes(search.toLowerCase())
    )
  })).filter(cat => cat.items.length > 0);

  return (
    <div className="min-h-screen bg-[#080A0F] text-white pb-32">
      {/* Header */}
      <header className="px-6 pt-12 pb-8 sticky top-0 bg-[#080A0F]/80 backdrop-blur-md z-10">
        <Link href="/explorer" className="inline-flex items-center gap-2 text-[#00E5CC] font-bold text-xs uppercase tracking-widest mb-6">
          <ArrowLeft size={16} />
          Back to Explorer
        </Link>
        <h1 className="font-display text-3xl font-black tracking-tighter">
          FAQ & SUPPORT
        </h1>
        <p className="text-xs text-[#6B7280] font-medium mt-1 uppercase tracking-widest">Everything you need to know</p>
      </header>

      <div className="px-6 space-y-8">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280]" size={18} />
          <input 
            type="text" 
            placeholder="Search questions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0E1118] border border-[#1A2030] rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-[#00E5CC] transition-colors"
          />
        </div>

        {/* FAQ List */}
        <div className="space-y-8">
          {filteredFaqs.map((cat, i) => (
            <section key={i}>
              <h3 className="font-display font-bold text-xs text-[#6B7280] uppercase tracking-widest mb-4 px-2">{cat.category}</h3>
              <div className="space-y-3">
                {cat.items.map((item, j) => {
                  const id = `${i}-${j}`;
                  const isExpanded = expanded === id;
                  return (
                    <div 
                      key={j} 
                      className={`bg-[#0E1118] border transition-all duration-300 rounded-2xl overflow-hidden ${isExpanded ? 'border-[#00E5CC]' : 'border-[#1A2030]'}`}
                    >
                      <button 
                        onClick={() => setExpanded(isExpanded ? null : id)}
                        className="w-full flex items-center justify-between p-5 text-left"
                      >
                        <span className="text-sm font-bold pr-4">{item.q}</span>
                        <ChevronDown size={18} className={`text-[#6B7280] transition-transform duration-300 ${isExpanded ? 'rotate-180 text-[#00E5CC]' : ''}`} />
                      </button>
                      <motion.div 
                        initial={false}
                        animate={{ height: isExpanded ? 'auto' : 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 text-xs text-[#6B7280] leading-relaxed border-t border-[#1A2030]/50 pt-4">
                          {item.a}
                        </div>
                      </motion.div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        {/* Support Card */}
        <div className="bg-gradient-to-br from-[#141820] to-[#0E1118] border border-[#1A2030] rounded-3xl p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#00E5CC]/10 flex items-center justify-center text-[#00E5CC] mx-auto mb-6">
            <HelpCircle size={32} />
          </div>
          <h3 className="text-xl font-display font-black mb-2">Still have questions?</h3>
          <p className="text-xs text-[#6B7280] mb-8 leading-relaxed">
            Can&apos;t find what you&apos;re looking for? Join our community on Telegram or Discord for real-time support.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <a href="#" className="bg-[#141820] border border-[#1A2030] py-3 rounded-xl text-xs font-bold uppercase tracking-wider">Telegram</a>
            <a href="#" className="bg-[#141820] border border-[#1A2030] py-3 rounded-xl text-xs font-bold uppercase tracking-wider">Discord</a>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
