'use client';

import { useQuery } from '@tanstack/react-query';
import { canonixApi } from '@/lib/canonix-api';
import { BottomNav } from '@/components/BottomNav';
import { Providers } from '@/components/Providers';
import { SwapTerminal } from '@/components/SwapTerminal';
import { LiquidityTerminal } from '@/components/LiquidityTerminal';
import { SendTerminal } from '@/components/SendTerminal';
import { BurnTerminal } from '@/components/BurnTerminal';
import { ArrowUpDown, Settings, Layers, Send, Flame } from 'lucide-react';
import { useMemo, useState } from 'react';

function TradeContent() {
  const [activeTab, setActiveTab] = useState<'swap' | 'lp' | 'send' | 'burn'>('swap');
  const { data: tokensData } = useQuery({
    queryKey: ['tokens'],
    queryFn: canonixApi.getTokenList,
  });

  const tokens = useMemo(() => Array.isArray(tokensData) ? tokensData : [], [tokensData]);

  return (
    <div className="flex-1 pb-32 overflow-y-auto no-scrollbar">
      {/* Header */}
      <header className="px-6 pt-8 pb-4 flex items-center justify-between sticky top-0 bg-[#080A0F]/80 backdrop-blur-md z-20">
        <h1 className="font-display text-2xl font-extrabold tracking-tighter uppercase">
          {activeTab}
        </h1>
        <button className="p-2 bg-[#0E1118] border border-[#1A2030] rounded-xl text-[#6B7280]">
          <Settings size={20} />
        </button>
      </header>

      {/* Sub-nav for Trading Features */}
      <div className="px-6 mb-4">
        <div className="flex bg-[#0E1118] p-1 rounded-xl border border-[#1A2030] overflow-x-auto no-scrollbar gap-1">
          <button
            onClick={() => setActiveTab('swap')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-bold uppercase transition-all whitespace-nowrap ${activeTab === 'swap' ? 'bg-[#00E5CC] text-[#080A0F]' : 'text-[#6B7280]'}`}
          >
            <ArrowUpDown size={12} /> Swap
          </button>
          <button
            onClick={() => setActiveTab('lp')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-bold uppercase transition-all whitespace-nowrap ${activeTab === 'lp' ? 'bg-[#00E5CC] text-[#080A0F]' : 'text-[#6B7280]'}`}
          >
            <Layers size={12} /> Liquidity
          </button>
          <button
            onClick={() => setActiveTab('send')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-bold uppercase transition-all whitespace-nowrap ${activeTab === 'send' ? 'bg-[#00E5CC] text-[#080A0F]' : 'text-[#6B7280]'}`}
          >
            <Send size={12} /> Send
          </button>
          <button
            onClick={() => setActiveTab('burn')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-bold uppercase transition-all whitespace-nowrap ${activeTab === 'burn' ? 'bg-[#00E5CC] text-[#080A0F]' : 'text-[#6B7280]'}`}
          >
            <Flame size={12} /> Burn
          </button>
        </div>
      </div>

      <div className="px-6 py-4">
        {activeTab === 'swap' && <SwapTerminal tokens={tokens} />}
        {activeTab === 'lp' && <LiquidityTerminal tokens={tokens} />}
        {activeTab === 'send' && <SendTerminal tokens={tokens} />}
        {activeTab === 'burn' && <BurnTerminal tokens={tokens} />}

        <p className="mt-8 text-center text-[10px] font-medium text-[#6B7280] leading-relaxed uppercase tracking-widest italic">
          Swap powered by Canonix DEX on Paxi Network. <br />
          Always verify contract addresses before trading.
        </p>

        {/* Recent Activity Mockup */}
        <div className="mt-12">
          <h3 className="font-display font-bold text-xs text-[#6B7280] uppercase tracking-widest mb-4 italic">Recent Terminal Activity</h3>
          <div className="space-y-3">
            {tokens.slice(0, 3).map((t, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-[#0E1118]/50 border border-[#1A2030] rounded-2xl group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#141820] flex items-center justify-center group-hover:rotate-12 transition-transform">
                    <ArrowUpDown size={14} className="text-[#00E5CC]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-tight">Swapped PXI for {t.symbol}</p>
                    <p className="text-[8px] text-[#6B7280] font-mono">JUST NOW</p>
                  </div>
                </div>
                <span className="font-mono text-[9px] font-bold text-[#00E5CC] italic">SUCCESS</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TradePage() {
  return (
    <>
      <TradeContent />
      <BottomNav />
    </>
  );
}
