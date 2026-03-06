'use client';

import { useQuery } from '@tanstack/react-query';
import { canonixApi, formatPrice, formatChange, formatMarketCap, getTokenLetter, getTokenColor, type Token } from '@/lib/canonix-api';
import { BottomNav } from '@/components/BottomNav';
import { Providers } from '@/components/Providers';
import { useWallet } from '@/lib/wallet-context';
import { motion } from 'framer-motion';
import { Search, X, Shield, Zap, TrendingUp, TrendingDown, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useState, useMemo } from 'react';

function MarketContent() {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'hot' | 'new' | 'verified' | 'pump' | 'wallet'>('hot');
  const { activeWallet } = useWallet();

  const { data: tokensData, isLoading } = useQuery({
    queryKey: ['tokens'],
    queryFn: canonixApi.getTokenList,
  });

  const tokens = useMemo(() => Array.isArray(tokensData) ? tokensData : [], [tokensData]);

  const filteredTokens = useMemo(() => {
    let result = [...tokens];

    // Apply Tab Filtering
    if (activeTab === 'verified') {
      result = result.filter(t => t.is_verified);
    } else if (activeTab === 'pump') {
      result = result.filter(t => t.is_pump);
    } else if (activeTab === 'wallet') {
      // In a real app, we'd filter by tokens the user actually owns
      // For now, we'll just show a placeholder or empty if no wallet
      if (!activeWallet) return [];
      // Mock: show only verified tokens as "owned" for demo purposes if needed, 
      // but better to show empty if we don't have real balance data yet
      return []; 
    }

    // Apply Sorting for Hot/New
    if (activeTab === 'hot') {
      // Sort by volume or change
      result.sort((a, b) => parseFloat(b.volume24h.toString()) - parseFloat(a.volume24h.toString()));
    } else if (activeTab === 'new') {
      // Sort by contract address or some timestamp if available
      // Since we don't have timestamp, we'll just reverse or use a proxy
      result.reverse();
    }

    // Apply Search
    if (search) {
      result = result.filter(t => 
        t.symbol.toLowerCase().includes(search.toLowerCase()) || 
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.contract.toLowerCase() === search.toLowerCase()
      );
    }

    return result;
  }, [tokens, search, activeTab, activeWallet]);

  return (
    <div className="flex-1 pb-32 overflow-y-auto no-scrollbar">
      {/* Header */}
      <header className="px-6 pt-8 pb-4 sticky top-0 bg-[#080A0F]/80 backdrop-blur-md z-10">
        <div className="flex items-center justify-between mb-4">
          <h1 className="font-display text-2xl font-extrabold tracking-tighter">
            MARKETS
          </h1>
          <div className="bg-[#00E5CC]/10 border border-[#00E5CC]/20 px-2 py-1 rounded-md">
            <span className="text-[10px] font-bold text-[#00E5CC]">{tokens.length} TOKENS</span>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" size={16} />
          <input 
            type="text"
            placeholder="Search symbol or address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0E1118] border border-[#1A2030] rounded-xl py-2.5 pl-10 pr-4 text-sm font-medium focus:outline-none focus:border-[#00E5CC]/50 transition-colors"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280]">
              <X size={16} />
            </button>
          )}
        </div>

        {/* Tabs (Sidebar Style) */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          {(['hot', 'new', 'verified', 'pump', 'wallet'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase whitespace-nowrap transition-all ${
                activeTab === tab 
                ? 'bg-[#00E5CC] text-[#080A0F] shadow-[0_0_12px_rgba(0,229,204,0.3)]' 
                : 'bg-[#0E1118] border border-[#1A2030] text-[#6B7280]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </header>

      {/* List */}
      <div className="px-6 space-y-2">
        <div className="flex items-center justify-between px-2 text-[10px] font-bold text-[#6B7280] uppercase tracking-wider mb-2">
          <span>Asset</span>
          <div className="flex gap-8">
            <span>Market Cap</span>
            <span className="w-16 text-right">Price</span>
          </div>
        </div>

        {isLoading ? (
          Array(10).fill(0).map((_, i) => (
            <div key={i} className="h-16 bg-[#0E1118] rounded-xl animate-pulse border border-[#1A2030]" />
          ))
        ) : activeTab === 'wallet' && !activeWallet ? (
          <div className="py-20 text-center">
            <p className="text-[#6B7280] font-medium mb-4">Connect wallet to view your assets</p>
            <Link href="/settings">
              <button className="bg-[#00E5CC] text-[#080A0F] px-6 py-2 rounded-xl font-bold text-xs uppercase">
                Connect Wallet
              </button>
            </Link>
          </div>
        ) : filteredTokens.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-[#6B7280] font-medium">No tokens found</p>
          </div>
        ) : (
          filteredTokens.map((token, index) => (
            <Link key={token.contract} href={`/token/${token.contract}`}>
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-[#0E1118] border border-[#1A2030] rounded-xl p-3 flex items-center justify-between mb-2"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[10px] text-[#6B7280] w-4">{index + 1}</span>
                  <div className={`w-10 h-10 rounded-xl ${getTokenColor(token.symbol)} flex items-center justify-center font-bold text-lg relative`}>
                    {getTokenLetter(token.name)}
                    {token.is_verified && (
                      <div className="absolute -top-1 -right-1 bg-[#080A0F] rounded-full p-0.5">
                        <Shield size={10} className="text-[#00E5CC] fill-[#00E5CC]/20" />
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="font-mono font-bold text-sm leading-none">{token.symbol}</p>
                      {token.is_pump && <Zap size={10} className="text-yellow-400 fill-yellow-400" />}
                    </div>
                    <p className="text-[10px] text-[#6B7280] font-medium mt-1">{token.name}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <p className="font-mono text-[10px] text-[#6B7280] font-bold">{formatMarketCap(token.marketCap)}</p>
                  <div className="text-right w-16">
                    <p className="font-mono font-bold text-sm leading-none mb-1">{formatPrice(token.price)}</p>
                    <p className={`text-[10px] font-bold ${parseFloat(token.change24h.toString()) >= 0 ? 'text-green-400' : 'text-rose-500'}`}>
                      {formatChange(token.change24h)}
                    </p>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

export default function MarketPage() {
  return (
    <>
      <MarketContent />
      <BottomNav />
    </>
  );
}
