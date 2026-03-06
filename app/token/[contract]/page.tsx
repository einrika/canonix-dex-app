'use client';

import { useQuery } from '@tanstack/react-query';
import { canonixApi, formatPrice, formatChange, formatMarketCap, getTokenLetter, getTokenColor, type Token } from '@/lib/canonix-api';
import { Providers } from '@/components/Providers';
import { useWallet } from '@/lib/wallet-context';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Share2, ExternalLink, Shield, Copy, CheckCircle, 
  TrendingUp, TrendingDown, Activity, Zap, Info, Globe, 
  Twitter, MessageCircle, Link as LinkIcon, BarChart3, 
  Layers, Users, Info as InfoIcon, Megaphone, Rocket,
  Settings, Brain, AlertTriangle, Loader2
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useMemo, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { GoogleGenAI } from "@google/genai";
import { SwapTerminal } from '@/components/SwapTerminal';

// Mock chart data
const generateChartData = (basePrice: number) => {
  return Array.from({ length: 24 }, (_, i) => ({
    time: `${i}:00`,
    price: basePrice * (1 + (Math.random() * 0.1 - 0.05)),
  }));
};

function TokenDetailContent() {
  const params = useParams();
  const router = useRouter();
  const contract = params.contract as string;
  const { activeWallet } = useWallet();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'chart' | 'swap' | 'stats' | 'info' | 'ai'>('chart');
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const { data: tokensData } = useQuery({
    queryKey: ['tokens'],
    queryFn: canonixApi.getTokenList,
  });

  const tokens = useMemo(() => Array.isArray(tokensData) ? tokensData : [], [tokensData]);

  const { data: token, isLoading } = useQuery({
    queryKey: ['token', contract],
    queryFn: () => canonixApi.getTokenDetail(contract),
    enabled: !!contract,
  });

  const chartData = useMemo(() => token ? generateChartData(token.price) : [], [token]);

  const handleCopy = () => {
    navigator.clipboard.writeText(contract);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Check out ${token?.name} on Canonix`,
        url: window.location.href,
      });
    }
  };

  const runAiAnalysis = async () => {
    if (!token || isAnalyzing) return;
    setIsAnalyzing(true);
    setActiveTab('ai');
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY! });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Analyze this crypto token: ${token.name} (${token.symbol}). 
        Price: ${token.price}, 24h Change: ${token.change24h}%, Market Cap: ${token.marketCap}. 
        Provide a brief, professional market sentiment and technical outlook for a DEX mobile app.`,
      });
      setAiAnalysis(response.text || "Analysis unavailable.");
    } catch (e) {
      console.error('AI Analysis failed', e);
      setAiAnalysis("Failed to generate AI analysis. Please try again later.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#00E5CC] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!token) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <p className="text-[#6B7280] mb-4">Token not found or error loading data.</p>
        <button 
          onClick={() => router.back()}
          className="bg-[#0E1118] border border-[#1A2030] px-6 py-2 rounded-xl font-bold"
        >
          Go Back
        </button>
      </div>
    );
  }

  const isPositive = parseFloat(token.change24h.toString()) >= 0;

  return (
    <div className="flex-1 pb-20 overflow-y-auto no-scrollbar bg-[#080A0F]">
      {/* Header */}
      <header className="px-6 pt-8 pb-4 flex items-center justify-between sticky top-0 bg-[#080A0F]/80 backdrop-blur-md z-20">
        <button 
          onClick={() => router.back()}
          className="p-2 bg-[#0E1118] border border-[#1A2030] rounded-xl text-[#6B7280]"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex flex-col items-center">
          <h1 className="font-display text-xs font-bold tracking-widest uppercase text-[#00E5CC]">
            {token.symbol} / PXI
          </h1>
          <p className="text-[10px] text-[#6B7280] font-mono">{formatPrice(token.price)}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={runAiAnalysis} className="p-2 bg-[#0E1118] border border-[#1A2030] rounded-xl text-[#00E5CC]">
            <Brain size={20} />
          </button>
          <button onClick={handleShare} className="p-2 bg-[#0E1118] border border-[#1A2030] rounded-xl text-[#6B7280]">
            <Share2 size={20} />
          </button>
        </div>
      </header>

      {/* Token Hero */}
      <div className="px-6 pt-4 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className={`w-14 h-14 rounded-2xl ${getTokenColor(token.symbol)} flex items-center justify-center font-bold text-2xl shadow-xl relative`}>
            {getTokenLetter(token.name)}
            {token.is_verified && (
              <div className="absolute -bottom-1 -right-1 bg-[#080A0F] rounded-full p-1">
                <Shield size={12} className="text-[#00E5CC] fill-[#00E5CC]/20" />
              </div>
            )}
          </div>
          <div>
            <h2 className="text-xl font-display font-extrabold flex items-center gap-2">
              {token.name}
              {token.is_pump && <Zap size={14} className="text-yellow-400 fill-yellow-400" />}
            </h2>
            <div className="flex items-center gap-2">
              <p className="text-[#6B7280] font-mono text-xs">{token.symbol}</p>
              <div className={`flex items-center gap-0.5 text-[10px] font-bold ${isPositive ? 'text-green-400' : 'text-rose-500'}`}>
                {isPositive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                {formatChange(token.change24h)}
              </div>
            </div>
          </div>
        </div>

        {/* Action Tabs */}
        <div className="flex bg-[#0E1118] p-1 rounded-xl border border-[#1A2030] overflow-x-auto no-scrollbar">
          {(['chart', 'swap', 'stats', 'info', 'ai'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 min-w-[60px] py-2 rounded-lg text-[10px] font-bold uppercase transition-all ${
                activeTab === tab 
                ? 'bg-[#00E5CC] text-[#080A0F] shadow-lg' 
                : 'text-[#6B7280] hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'chart' && (
          <motion.div 
            key="chart"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="px-6"
          >
            <div className="bg-[#0E1118] border border-[#1A2030] rounded-2xl p-4 h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00E5CC" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#00E5CC" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1A2030" vertical={false} />
                  <XAxis dataKey="time" hide />
                  <YAxis hide domain={['auto', 'auto']} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0E1118', border: '1px solid #1A2030', borderRadius: '8px' }}
                    itemStyle={{ color: '#00E5CC', fontWeight: 'bold' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="price" 
                    stroke="#00E5CC" 
                    fillOpacity={1} 
                    fill="url(#colorPrice)" 
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}

        {activeTab === 'swap' && (
          <motion.div 
            key="swap"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="px-6"
          >
            <SwapTerminal
              initialToken={token}
              tokens={tokens}
            />
          </motion.div>
        )}

        {activeTab === 'ai' && (
          <motion.div 
            key="ai"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="px-6"
          >
            <div className="bg-[#0E1118] border border-[#1A2030] rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Brain size={120} className="text-[#00E5CC]" />
              </div>
              
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-[#00E5CC]/10 rounded-lg flex items-center justify-center">
                  <Brain size={18} className="text-[#00E5CC]" />
                </div>
                <h3 className="font-display font-bold text-sm uppercase tracking-widest">Neural Market Analysis</h3>
              </div>

              {isAnalyzing ? (
                <div className="py-12 flex flex-col items-center justify-center text-center">
                  <Loader2 size={32} className="text-[#00E5CC] animate-spin mb-4" />
                  <p className="text-xs font-bold text-[#6B7280] uppercase animate-pulse">Processing Telemetry...</p>
                </div>
              ) : aiAnalysis ? (
                <div className="space-y-4">
                  <div className="bg-[#080A0F] border border-[#1A2030] p-4 rounded-xl">
                    <p className="text-xs text-[#6B7280] leading-relaxed italic">
                      &quot;{aiAnalysis}&quot;
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-yellow-500/80">
                    <AlertTriangle size={12} />
                    AI insights are experimental. Trade at your own risk.
                  </div>
                  <button 
                    onClick={runAiAnalysis}
                    className="w-full py-3 bg-[#1A2030] text-[#00E5CC] rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-[#00E5CC]/10 transition-colors"
                  >
                    Refresh Analysis
                  </button>
                </div>
              ) : (
                <div className="py-12 text-center">
                  <p className="text-xs text-[#6B7280] mb-6 uppercase font-bold">Ready for deep neural analysis</p>
                  <button 
                    onClick={runAiAnalysis}
                    className="bg-[#00E5CC] text-[#080A0F] px-8 py-3 rounded-xl font-bold text-xs uppercase shadow-lg"
                  >
                    Start AI Analysis
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'stats' && (
          <motion.div 
            key="stats"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="px-6 space-y-4"
          >
            {/* Trade Stats */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <BarChart3 size={16} className="text-[#00E5CC]" />
                <h3 className="text-xs font-bold uppercase tracking-widest">Trade Stats</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#0E1118] border border-[#1A2030] rounded-xl p-4">
                  <p className="text-[10px] text-[#6B7280] font-bold mb-1">MARKET CAP</p>
                  <p className="font-mono text-sm font-bold">{formatMarketCap(token.marketCap)}</p>
                </div>
                <div className="bg-[#0E1118] border border-[#1A2030] rounded-xl p-4">
                  <p className="text-[10px] text-[#6B7280] font-bold mb-1">LIQUIDITY</p>
                  <p className="font-mono text-sm font-bold">$124.5K</p>
                </div>
                <div className="bg-[#0E1118] border border-[#1A2030] rounded-xl p-4">
                  <p className="text-[10px] text-[#6B7280] font-bold mb-1">24H VOLUME</p>
                  <p className="font-mono text-sm font-bold">{formatMarketCap(token.volume24h)}</p>
                </div>
                <div className="bg-[#0E1118] border border-[#1A2030] rounded-xl p-4">
                  <p className="text-[10px] text-[#6B7280] font-bold mb-1">24H CHANGE</p>
                  <p className={`font-mono text-sm font-bold ${isPositive ? 'text-green-400' : 'text-rose-500'}`}>{formatChange(token.change24h)}</p>
                </div>
              </div>
            </section>

            {/* Pool Depth */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <Layers size={16} className="text-[#00E5CC]" />
                <h3 className="text-xs font-bold uppercase tracking-widest">Pool Depth</h3>
              </div>
              <div className="bg-[#0E1118] border border-[#1A2030] rounded-xl p-4">
                <div className="flex justify-between text-[10px] font-bold text-[#6B7280] mb-2">
                  <span>BUY DEPTH</span>
                  <span>SELL DEPTH</span>
                </div>
                <div className="h-4 w-full bg-[#1A2030] rounded-full flex overflow-hidden">
                  <div className="h-full bg-green-500/80" style={{ width: '58%' }} />
                  <div className="h-full bg-rose-500/80" style={{ width: '42%' }} />
                </div>
                <div className="flex justify-between mt-2 text-[10px] font-bold">
                  <span className="text-green-400">$72.2K</span>
                  <span className="text-rose-500">$52.3K</span>
                </div>
              </div>
            </section>

            {/* Top Holders */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <Users size={16} className="text-[#00E5CC]" />
                <h3 className="text-xs font-bold uppercase tracking-widest">Top Holders</h3>
              </div>
              <div className="bg-[#0E1118] border border-[#1A2030] rounded-xl overflow-hidden">
                {[
                  { addr: 'paxi1...3x9a', share: '12.4%', value: '$15.4K' },
                  { addr: 'paxi1...k8m2', share: '8.2%', value: '$10.2K' },
                  { addr: 'paxi1...v4p0', share: '5.1%', value: '$6.3K' },
                  { addr: 'paxi1...r7w1', share: '3.8%', value: '$4.7K' },
                  { addr: 'paxi1...q2n9', share: '2.5%', value: '$3.1K' },
                ].map((holder, i) => (
                  <div key={i} className={`flex justify-between items-center p-3 ${i !== 0 ? 'border-t border-[#1A2030]' : ''}`}>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-[#6B7280] font-mono">{i + 1}</span>
                      <span className="text-xs font-mono">{holder.addr}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold">{holder.share}</p>
                      <p className="text-[10px] text-[#6B7280]">{holder.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </motion.div>
        )}

        {activeTab === 'info' && (
          <motion.div 
            key="info"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="px-6 space-y-6"
          >
            {/* Token Info */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <InfoIcon size={16} className="text-[#00E5CC]" />
                <h3 className="text-xs font-bold uppercase tracking-widest">Token Info</h3>
              </div>
              <div className="bg-[#0E1118] border border-[#1A2030] rounded-xl overflow-hidden">
                {[
                  { label: 'Symbol', value: token.symbol },
                  { label: 'Name', value: token.name },
                  { label: 'Contract', value: `${contract.slice(0, 8)}...${contract.slice(-8)}`, copyable: true },
                  { label: 'Decimals', value: token.decimals || '18' },
                  { label: 'Total Supply', value: '1,000,000,000' },
                ].map((item, i) => (
                  <div key={i} className={`flex justify-between items-center p-4 ${i !== 0 ? 'border-t border-[#1A2030]' : ''}`}>
                    <span className="text-xs font-medium text-[#6B7280]">{item.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold">{item.value}</span>
                      {item.copyable && <Copy size={12} className="text-[#00E5CC] cursor-pointer" onClick={handleCopy} />}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* About */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <Info size={16} className="text-[#00E5CC]" />
                <h3 className="text-xs font-bold uppercase tracking-widest">About</h3>
              </div>
              <div className="bg-[#0E1118] border border-[#1A2030] rounded-xl p-4">
                <p className="text-xs text-[#6B7280] leading-relaxed">
                  {token.name} is a decentralized asset on the Paxi Network. 
                  It aims to provide high-speed transactions and low-cost utility 
                  within the Canonix ecosystem. This token is part of the 
                  growing decentralized finance landscape on Paxi.
                </p>
              </div>
            </section>

            {/* Marketing & Project */}
            <section className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Megaphone size={16} className="text-[#00E5CC]" />
                  <h3 className="text-xs font-bold uppercase tracking-widest">Marketing</h3>
                </div>
                <div className="flex gap-3">
                  <button className="p-3 bg-[#0E1118] border border-[#1A2030] rounded-xl text-[#00E5CC]">
                    <Twitter size={18} />
                  </button>
                  <button className="p-3 bg-[#0E1118] border border-[#1A2030] rounded-xl text-[#00E5CC]">
                    <MessageCircle size={18} />
                  </button>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Rocket size={16} className="text-[#00E5CC]" />
                  <h3 className="text-xs font-bold uppercase tracking-widest">Project</h3>
                </div>
                <div className="flex gap-3">
                  <button className="p-3 bg-[#0E1118] border border-[#1A2030] rounded-xl text-[#00E5CC]">
                    <Globe size={18} />
                  </button>
                  <button className="p-3 bg-[#0E1118] border border-[#1A2030] rounded-xl text-[#00E5CC]">
                    <LinkIcon size={18} />
                  </button>
                </div>
              </div>
            </section>

            {/* Another Link */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <LinkIcon size={16} className="text-[#00E5CC]" />
                <h3 className="text-xs font-bold uppercase tracking-widest">Another Link</h3>
              </div>
              <div className="bg-[#0E1118] border border-[#1A2030] rounded-xl p-4 flex items-center justify-between">
                <span className="text-xs font-bold">Explorer Link</span>
                <ExternalLink size={14} className="text-[#6B7280]" />
              </div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default function TokenDetailPage() {
  return (
    <>
      <TokenDetailContent />
    </>
  );
}
