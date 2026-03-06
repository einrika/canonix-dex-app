'use client';

import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { canonixApi, formatPrice, formatChange, getTokenLetter, getTokenColor, type Token } from '@/lib/canonix-api';
import { BottomNav } from '@/components/BottomNav';
import { Providers } from '@/components/Providers';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, Layers, Search, Zap, Star } from 'lucide-react';
import Link from 'next/link';

function HomeContent() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSort, setActiveSort] = useState<'hot' | 'new' | 'gainer' | 'mcap'>('hot');

  const { data: tokensData, isLoading } = useQuery({
    queryKey: ['tokens'],
    queryFn: canonixApi.getTokenList,
  });

  const tokens = useMemo(() => Array.isArray(tokensData) ? tokensData : [], [tokensData]);

  const filteredTokens = useMemo(() => {
    let result = tokens.filter(t =>
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.contract.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (activeSort === 'new') {
      // In real app, sort by creation date
      return [...result].reverse();
    } else if (activeSort === 'gainer') {
      return [...result].sort((a, b) => b.change24h - a.change24h);
    } else if (activeSort === 'mcap') {
      return [...result].sort((a, b) => b.marketCap - a.marketCap);
    }
    return result;
  }, [tokens, searchTerm, activeSort]);

  const { data: nodeStatus } = useQuery({
    queryKey: ['nodeStatus'],
    queryFn: canonixApi.getNodeStatus,
  });

  const hotTokens = tokens.slice(0, 8);

  return (
    <div className="flex-1 pb-32 overflow-y-auto no-scrollbar">
      {/* Header */}
      <header className="px-6 pt-8 pb-4 flex items-center justify-between sticky top-0 bg-[#080A0F]/80 backdrop-blur-md z-10">
        <h1 className="font-display text-2xl font-extrabold tracking-tighter text-[#00E5CC]">
          CANONIX
        </h1>
        <div className="flex items-center gap-2 bg-[#0E1118] border border-[#1A2030] px-3 py-1.5 rounded-full">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="font-mono text-[10px] font-bold text-[#6B7280]">
            BLOCK {nodeStatus?.block_height || '-------'}
          </span>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="px-6 py-4">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0E1118] to-[#141820] border border-[#1A2030] p-6">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#00E5CC]/10 blur-3xl rounded-full -mr-16 -mt-16" />
          <h2 className="font-display text-sm font-bold text-[#00E5CC] uppercase tracking-widest mb-1">
            Paxi Network DEX
          </h2>
          <p className="text-2xl font-display font-extrabold leading-tight mb-4">
            Trade PRC20 Tokens <br /> with Zero Friction.
          </p>
          <div className="flex gap-4">
            <div className="flex-1">
              <p className="text-[10px] text-[#6B7280] uppercase font-bold mb-1">Total Tokens</p>
              <p className="font-mono text-lg font-bold">{tokens.length || '---'}</p>
            </div>
            <div className="flex-1">
              <p className="text-[10px] text-[#6B7280] uppercase font-bold mb-1">Verified</p>
              <p className="font-mono text-lg font-bold">{tokens.filter(t => t.is_verified).length || '---'}</p>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#00E5CC]/50 to-transparent" />
        </div>
      </section>

      {/* Hot Tokens Carousel */}
      <section className="py-4">
        <div className="px-6 flex items-center justify-between mb-4">
          <h3 className="font-display font-bold text-sm flex items-center gap-2">
            <TrendingUp size={16} className="text-[#00E5CC]" />
            HOT TOKENS
          </h3>
        </div>
        <div className="flex gap-4 overflow-x-auto px-6 no-scrollbar">
          {isLoading ? (
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="min-w-[140px] h-32 bg-[#0E1118] rounded-xl animate-pulse border border-[#1A2030]" />
            ))
          ) : (
            hotTokens.map((token) => (
              <Link key={token.contract} href={`/token/${token.contract}`}>
                <motion.div 
                  whileTap={{ scale: 0.95 }}
                  className="min-w-[140px] bg-[#0E1118] border border-[#1A2030] rounded-xl p-4"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`w-8 h-8 rounded-lg ${getTokenColor(token.symbol)} flex items-center justify-center font-bold text-xs`}>
                      {getTokenLetter(token.name)}
                    </div>
                    <span className="font-mono font-bold text-sm">{token.symbol}</span>
                  </div>
                  <p className="font-mono text-sm font-bold mb-1">{formatPrice(token.price)}</p>
                  <p className={`text-[10px] font-bold ${parseFloat(token.change24h.toString()) >= 0 ? 'text-green-400' : 'text-rose-500'}`}>
                    {formatChange(token.change24h)}
                  </p>
                </motion.div>
              </Link>
            ))
          )}
        </div>
      </section>

      {/* Market Tabs & Search */}
      <section className="px-6 py-4">
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280]" size={18} />
          <input
            type="text"
            placeholder="Search by Name or Address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#0E1118] border border-[#1A2030] rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:outline-none focus:border-[#00E5CC]/50 transition-colors placeholder:text-[#6B7280] uppercase"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-4 mb-4">
          {(['hot', 'new', 'gainer', 'mcap'] as const).map((sort) => (
            <button
              key={sort}
              onClick={() => setActiveSort(sort)}
              className={`px-6 py-2 rounded-xl text-[10px] font-bold uppercase transition-all whitespace-nowrap border ${
                activeSort === sort
                ? 'bg-[#00E5CC] text-[#080A0F] border-[#00E5CC] shadow-lg'
                : 'bg-[#0E1118] text-[#6B7280] border-[#1A2030]'
              }`}
            >
              {sort === 'gainer' ? 'Top Gainers' : sort === 'mcap' ? 'Market Cap' : sort}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {isLoading ? (
            Array(6).fill(0).map((_, i) => (
              <div key={i} className="h-20 bg-[#0E1118] rounded-2xl animate-pulse border border-[#1A2030]" />
            ))
          ) : (
            filteredTokens.slice(0, 20).map((token) => (
              <Link key={token.contract} href={`/token/${token.contract}`}>
                <motion.div 
                  whileTap={{ scale: 0.98 }}
                  className="bg-[#0E1118] border border-[#1A2030] rounded-2xl p-4 flex items-center justify-between group hover:border-[#00E5CC]/30 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl ${getTokenColor(token.symbol)} flex items-center justify-center font-bold text-xl shadow-lg relative`}>
                      {getTokenLetter(token.name)}
                      {token.is_verified && (
                        <div className="absolute -top-1 -right-1 bg-[#080A0F] rounded-full p-0.5 border border-[#1A2030]">
                          <Zap size={10} className="text-[#00E5CC] fill-[#00E5CC]" />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="font-mono font-bold text-sm leading-none uppercase">{token.symbol}</p>
                        {token.is_pump && <span className="text-[8px] px-1 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 rounded font-black italic">PUMP</span>}
                      </div>
                      <p className="text-[10px] text-[#6B7280] font-bold uppercase tracking-tighter">{token.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-mono font-bold text-sm leading-none mb-1.5">{formatPrice(token.price)}</p>
                    <div className={`inline-block px-2 py-0.5 rounded-lg text-[10px] font-black italic ${parseFloat(token.change24h.toString()) >= 0 ? 'bg-green-500/10 text-green-400' : 'bg-rose-500/10 text-rose-500'}`}>
                      {formatChange(token.change24h)}
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      <HomeContent />
      <BottomNav />
    </>
  );
}
