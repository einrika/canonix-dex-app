'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Shield, Zap, Gift, Lock, Users, ChevronRight, HelpCircle } from 'lucide-react';
import Link from 'next/link';
import { BottomNav } from '@/components/BottomNav';

const config = {
  token: {
    name: "Canonix",
    symbol: "CNX",
    standard: "PRC20",
    totalSupply: "200,000 CNX",
    network: "Paxi Network",
    contractAddress: "paxi1se3cvmrhduhlv0v08r4c2hd3ds8tteuap7vap267ggmjglcd6p9sfnwmvp",
    logo: "assets/android-icon-192x192.png",
    tagline: "Meme Energy. Real Utility. One Ecosystem.",
    ctaLink: "/trade?token=paxi1se3cvmrhduhlv0v08r4c2hd3ds8tteuap7vap267ggmjglcd6p9sfnwmvp"
  },
  description: [
    "Canonix (CNX) is the official meme token of the Canonix ecosystem — created for fun, community, and practical use inside the platform.",
    "While CNX carries meme-driven energy, it is designed with real ecosystem utility in mind. It powers rewards, unlocks features, and supports engagement across Canonix services.",
    "Canonix focuses on building a strong and active community. CNX acts as the identity token that connects users, creators, and supporters within one growing ecosystem.",
    "As the ecosystem expands, CNX will continue to be integrated into new features, events, and incentive systems — keeping it simple, accessible, and useful."
  ],
  utilities: [
    { title: "Community Rewards", description: "Earn CNX through events, campaigns, ecosystem participation, and active community contributions.", icon: Gift },
    { title: "Feature Access", description: "Use CNX to unlock selected features, premium tools, or special ecosystem utilities within Canonix.", icon: Lock },
    { title: "Event Participation", description: "Join exclusive ecosystem events, token-based challenges, and reward programs using CNX.", icon: Zap },
    { title: "Future Governance", description: "In future updates, CNX holders may participate in community polls and ecosystem direction decisions.", icon: Users }
  ],
  tokenomics: [
    { label: "Liquidity Pool", percentage: 60, amount: 120000, color: "bg-[#00E5CC]" },
    { label: "Team (2 Members)", percentage: 10, amount: 20000, color: "bg-pink-500" },
    { label: "Platform Rewards", percentage: 15, amount: 30000, color: "bg-cyan-500" },
    { label: "Platform Reserve", percentage: 15, amount: 30000, color: "bg-yellow-500" }
  ],
  roadmap: [
    { phase: "Phase 1: Launch", items: ["CNX Token Deployment", "Initial Liquidity Setup", "Community Introduction", "Token Page Release"], status: "completed" },
    { phase: "Phase 2: Utility Expansion", items: ["Reward System Activation", "Feature Access Integration", "Community Campaign Events"], status: "upcoming" },
    { phase: "Phase 3: Ecosystem Growth", items: ["Expanded Use Cases", "Partnership Integrations", "Community Voting System"], status: "upcoming" }
  ],
  faq: [
    { question: "What is Canonix (CNX)?", answer: "Canonix (CNX) is a meme-powered utility token built for the Canonix ecosystem on Paxi Network." },
    { question: "What can I use CNX for?", answer: "CNX can be used for rewards, unlocking features, participating in ecosystem events, and future community-driven activities." },
    { question: "Where does CNX run?", answer: "CNX is deployed on Paxi Network using the PRC20 standard." },
    { question: "Is CNX a serious DeFi token?", answer: "CNX is primarily a meme-driven ecosystem token. It focuses on community engagement and practical platform utility rather than complex financial products." }
  ]
};

export default function TokenCNXPage() {
  return (
    <div className="min-h-screen bg-[#080A0F] text-white pb-32">
      {/* Hero Section */}
      <div className="relative h-80 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#00E5CC]/20 to-[#080A0F] z-0" />
        <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/cnx/1000/1000')] bg-cover bg-center opacity-20 mix-blend-overlay" />
        
        <div className="relative z-10 px-6 pt-12">
          <Link href="/explorer" className="inline-flex items-center gap-2 text-[#00E5CC] font-bold text-xs uppercase tracking-widest mb-8">
            <ArrowLeft size={16} />
            Back to Explorer
          </Link>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-3xl bg-[#00E5CC] flex items-center justify-center text-[#080A0F] font-display font-black text-2xl shadow-[0_0_30px_rgba(0,229,204,0.3)]">
              CNX
            </div>
            <div>
              <h1 className="text-3xl font-display font-black tracking-tighter leading-none">
                {config.token.name}
              </h1>
              <p className="text-[#00E5CC] font-bold text-sm mt-1">{config.token.symbol} • {config.token.standard}</p>
            </div>
          </div>
          
          <p className="text-lg font-medium text-white/90 leading-tight max-w-xs">
            {config.token.tagline}
          </p>
        </div>
      </div>

      <div className="px-6 -mt-8 relative z-10 space-y-8">
        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Link href={config.token.ctaLink} className="flex items-center justify-center gap-2 bg-[#00E5CC] text-[#080A0F] py-4 rounded-2xl font-display font-black text-sm uppercase tracking-wider shadow-[0_8px_20px_rgba(0,229,204,0.2)]">
            <Zap size={18} fill="currentColor" />
            Swap CNX
          </Link>
          <Link href="/trade" className="flex items-center justify-center gap-2 bg-[#141820] border border-[#1A2030] text-white py-4 rounded-2xl font-display font-black text-sm uppercase tracking-wider">
            Trade Terminal
          </Link>
        </div>

        {/* Contract Info */}
        <div className="bg-[#0E1118] border border-[#1A2030] rounded-2xl p-5">
          <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest mb-2">Contract Address</p>
          <div className="flex items-center justify-between gap-3">
            <code className="text-xs font-mono text-[#00E5CC] break-all bg-[#080A0F] p-3 rounded-xl border border-[#1A2030] flex-1">
              {config.token.contractAddress}
            </code>
          </div>
        </div>

        {/* Description */}
        <section>
          <h3 className="font-display font-bold text-xs text-[#6B7280] uppercase tracking-widest mb-4">The Vision</h3>
          <div className="space-y-4">
            {config.description.map((p, i) => (
              <p key={i} className="text-sm text-[#9CA3AF] leading-relaxed">
                {p}
              </p>
            ))}
          </div>
        </section>

        {/* Utilities */}
        <section>
          <h3 className="font-display font-bold text-xs text-[#6B7280] uppercase tracking-widest mb-4">Ecosystem Utilities</h3>
          <div className="grid grid-cols-1 gap-3">
            {config.utilities.map((u, i) => (
              <div key={i} className="bg-[#0E1118] border border-[#1A2030] rounded-2xl p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#141820] flex items-center justify-center text-[#00E5CC] shrink-0">
                  <u.icon size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold mb-1">{u.title}</h4>
                  <p className="text-xs text-[#6B7280] leading-relaxed">{u.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tokenomics */}
        <section>
          <h3 className="font-display font-bold text-xs text-[#6B7280] uppercase tracking-widest mb-4">Tokenomics</h3>
          <div className="bg-[#0E1118] border border-[#1A2030] rounded-2xl p-6">
            <div className="flex h-4 w-full rounded-full overflow-hidden mb-6 bg-[#141820]">
              {config.tokenomics.map((t, i) => (
                <div key={i} style={{ width: `${t.percentage}%` }} className={t.color} />
              ))}
            </div>
            <div className="space-y-4">
              {config.tokenomics.map((t, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${t.color}`} />
                    <span className="text-xs font-medium text-[#9CA3AF]">{t.label}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold">{t.percentage}%</p>
                    <p className="text-[10px] text-[#6B7280] font-mono">{t.amount.toLocaleString()} CNX</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Roadmap */}
        <section>
          <h3 className="font-display font-bold text-xs text-[#6B7280] uppercase tracking-widest mb-4">Roadmap</h3>
          <div className="space-y-4">
            {config.roadmap.map((r, i) => (
              <div key={i} className="relative pl-8 pb-4 last:pb-0">
                <div className="absolute left-0 top-0 bottom-0 w-px bg-[#1A2030]">
                  <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full border-2 border-[#080A0F] ${r.status === 'completed' ? 'bg-[#00E5CC]' : 'bg-[#1A2030]'}`} />
                </div>
                <h4 className={`text-sm font-bold mb-2 ${r.status === 'completed' ? 'text-white' : 'text-[#6B7280]'}`}>{r.phase}</h4>
                <ul className="space-y-2">
                  {r.items.map((item, j) => (
                    <li key={j} className="flex items-center gap-2 text-xs text-[#6B7280]">
                      <div className="w-1 h-1 rounded-full bg-[#1A2030]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section>
          <h3 className="font-display font-bold text-xs text-[#6B7280] uppercase tracking-widest mb-4">Common Questions</h3>
          <div className="space-y-3">
            {config.faq.map((f, i) => (
              <div key={i} className="bg-[#0E1118] border border-[#1A2030] rounded-2xl p-5">
                <h4 className="text-sm font-bold mb-2 flex items-center gap-2">
                  <HelpCircle size={16} className="text-[#00E5CC]" />
                  {f.question}
                </h4>
                <p className="text-xs text-[#6B7280] leading-relaxed">{f.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer CTA */}
        <div className="bg-gradient-to-br from-[#00E5CC] to-[#00BFA5] rounded-3xl p-8 text-center">
          <h3 className="text-2xl font-display font-black text-[#080A0F] mb-2">Ready to Join?</h3>
          <p className="text-[#080A0F]/70 text-sm font-medium mb-6">
            Get your CNX today and be part of the Canonix ecosystem — earn rewards, join events, and grow with the community.
          </p>
          <Link href={config.token.ctaLink} className="inline-flex items-center justify-center bg-[#080A0F] text-white px-8 py-4 rounded-2xl font-display font-black text-sm uppercase tracking-wider shadow-xl">
            Enter App
          </Link>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
