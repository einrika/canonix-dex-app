'use client';

import { useQuery } from '@tanstack/react-query';
import { canonixApi, formatPrice, getTokenLetter, getTokenColor, type Token } from '@/lib/canonix-api';
import { BottomNav } from '@/components/BottomNav';
import { Providers } from '@/components/Providers';
import { motion } from 'framer-motion';
import { ArrowUpDown, Settings, ChevronDown, Shield, Info } from 'lucide-react';
import { useState, useMemo } from 'react';

function TradeContent() {
  const [payAmount, setPayAmount] = useState('');
  const [isSwapped, setIsSwapped] = useState(false);

  const { data: tokensData } = useQuery({
    queryKey: ['tokens'],
    queryFn: canonixApi.getTokenList,
  });

  const tokens = useMemo(() => Array.isArray(tokensData) ? tokensData : [], [tokensData]);

  const selectedToken = tokens[0] || { symbol: 'SELECT', name: 'Select Token' };

  return (
    <div className="flex-1 pb-32 overflow-y-auto no-scrollbar">
      {/* Header */}
      <header className="px-6 pt-8 pb-4 flex items-center justify-between sticky top-0 bg-[#080A0F]/80 backdrop-blur-md z-10">
        <h1 className="font-display text-2xl font-extrabold tracking-tighter">
          SWAP
        </h1>
        <button className="p-2 bg-[#0E1118] border border-[#1A2030] rounded-xl text-[#6B7280]">
          <Settings size={20} />
        </button>
      </header>

      <div className="px-6 py-4">
        {/* Swap Container */}
        <div className="relative space-y-2">
          {/* Pay Card */}
          <div className="bg-[#0E1118] border border-[#1A2030] rounded-2xl p-5">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-bold text-[#6B7280] uppercase tracking-wider">You Pay</span>
              <span className="text-[10px] font-bold text-[#6B7280]">Balance: 0.00</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <input 
                type="number" 
                placeholder="0.00"
                value={payAmount}
                onChange={(e) => setPayAmount(e.target.value)}
                className="bg-transparent text-3xl font-mono font-bold focus:outline-none w-full placeholder:text-[#1A2030]"
              />
              <button className="flex items-center gap-2 bg-[#141820] border border-[#1A2030] pl-2 pr-3 py-1.5 rounded-xl hover:border-[#00E5CC]/50 transition-colors">
                <div className="w-6 h-6 rounded-lg bg-[#00E5CC] flex items-center justify-center text-[10px] font-bold text-[#080A0F]">P</div>
                <span className="font-mono font-bold text-sm">PXI</span>
                <ChevronDown size={14} className="text-[#6B7280]" />
              </button>
            </div>
            <div className="mt-2 text-[10px] font-bold text-[#6B7280]">
              ≈ $0.00
            </div>
          </div>

          {/* Swap Button */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <motion.button 
              whileTap={{ scale: 0.9, rotate: 180 }}
              onClick={() => setIsSwapped(!isSwapped)}
              className="bg-[#080A0F] border-2 border-[#1A2030] p-2.5 rounded-xl text-[#00E5CC] shadow-[0_0_15px_rgba(0,0,0,0.5)]"
            >
              <ArrowUpDown size={20} />
            </motion.button>
          </div>

          {/* Receive Card */}
          <div className="bg-[#0E1118] border border-[#1A2030] rounded-2xl p-5">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-bold text-[#6B7280] uppercase tracking-wider">You Receive</span>
              <span className="text-[10px] font-bold text-[#6B7280]">Balance: 0.00</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className="text-3xl font-mono font-bold text-[#1A2030]">0.00</div>
              <button className="flex items-center gap-2 bg-[#141820] border border-[#1A2030] pl-2 pr-3 py-1.5 rounded-xl hover:border-[#00E5CC]/50 transition-colors">
                <div className={`w-6 h-6 rounded-lg ${getTokenColor(selectedToken.symbol)} flex items-center justify-center text-[10px] font-bold text-white`}>
                  {getTokenLetter(selectedToken.name)}
                </div>
                <span className="font-mono font-bold text-sm">{selectedToken.symbol}</span>
                <ChevronDown size={14} className="text-[#6B7280]" />
              </button>
            </div>
            <div className="mt-2 text-[10px] font-bold text-[#6B7280]">
              ≈ $0.00
            </div>
          </div>
        </div>

        {/* Info Rows */}
        <div className="mt-6 space-y-3 px-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#6B7280]">
              <Shield size={12} />
              ROUTING
            </div>
            <span className="text-[10px] font-bold">Paxi AMM v1</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#6B7280]">
              <Info size={12} />
              SLIPPAGE
            </div>
            <span className="text-[10px] font-bold text-[#00E5CC]">0.5%</span>
          </div>
        </div>

        {/* Action Button */}
        <motion.button 
          whileTap={{ scale: 0.98 }}
          className="w-full mt-8 bg-[#00E5CC] text-[#080A0F] font-display font-extrabold py-4 rounded-2xl shadow-[0_0_20px_rgba(0,229,204,0.3)] uppercase tracking-wider"
        >
          Connect Wallet
        </motion.button>

        <p className="mt-6 text-center text-[10px] font-medium text-[#6B7280] leading-relaxed">
          Swap powered by Canonix DEX on Paxi Network. <br />
          Always verify contract addresses before trading.
        </p>

        {/* Recent Activity */}
        <div className="mt-10">
          <h3 className="font-display font-bold text-xs text-[#6B7280] uppercase tracking-widest mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {tokens.slice(0, 3).map((t, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-[#0E1118]/50 border border-[#1A2030] rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#141820] flex items-center justify-center">
                    <ArrowUpDown size={14} className="text-[#00E5CC]" />
                  </div>
                  <div>
                    <p className="text-xs font-bold">Swapped PXI for {t.symbol}</p>
                    <p className="text-[10px] text-[#6B7280]">2 mins ago</p>
                  </div>
                </div>
                <span className="font-mono text-[10px] font-bold text-[#00E5CC]">SUCCESS</span>
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
    <Providers>
      <TradeContent />
      <BottomNav />
    </Providers>
  );
}
