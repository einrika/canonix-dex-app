'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { useWallet } from '@/lib/wallet-context';
import { type Token, formatPrice, getTokenLetter, getTokenColor } from '@/lib/canonix-api';

interface LiquidityTerminalProps {
  tokens: Token[];
}

export function LiquidityTerminal({ tokens }: LiquidityTerminalProps) {
  const { activeWallet, balances, executeAddLP, executeRemoveLP } = useWallet();
  const [mode, setMode] = useState<'add' | 'remove'>('add');
  const [selectedToken, setSelectedToken] = useState<Token | undefined>(tokens[0]);
  const [paxiAmount, setPaxiAmount] = useState('');
  const [tokenAmount, setTokenAmount] = useState('');
  const [lpAmount, setLpAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [txResult, setTxResult] = useState<{ success: boolean; hash?: string; error?: string } | null>(null);

  const paxiBalance = parseFloat(balances['upaxi'] || '0') / 1e6;
  const tokenBalance = selectedToken ? parseFloat(balances[selectedToken.contract] || '0') / Math.pow(10, selectedToken.decimals) : 0;

  const handleAddLP = async () => {
    if (!selectedToken) return;
    setIsProcessing(true);
    try {
      const result = await executeAddLP(
        selectedToken.contract,
        parseFloat(paxiAmount),
        parseFloat(tokenAmount),
        selectedToken.decimals,
        selectedToken.symbol
      );
      setTxResult({ success: true, hash: result.transactionHash });
    } catch (e: any) {
      setTxResult({ success: false, error: e.message });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemoveLP = async () => {
    if (!selectedToken) return;
    setIsProcessing(true);
    try {
      const result = await executeRemoveLP(
        selectedToken.contract,
        parseFloat(lpAmount),
        selectedToken.symbol
      );
      setTxResult({ success: true, hash: result.transactionHash });
    } catch (e: any) {
      setTxResult({ success: false, error: e.message });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex bg-[#0E1118] p-1 rounded-2xl border border-[#1A2030]">
        <button
          onClick={() => setMode('add')}
          className={`flex-1 py-3 rounded-xl font-display font-bold text-sm uppercase transition-all ${
            mode === 'add' ? 'bg-[#00E5CC] text-[#080A0F]' : 'text-[#6B7280]'
          }`}
        >
          Add
        </button>
        <button
          onClick={() => setMode('remove')}
          className={`flex-1 py-3 rounded-xl font-display font-bold text-sm uppercase transition-all ${
            mode === 'remove' ? 'bg-[#00E5CC] text-[#080A0F]' : 'text-[#6B7280]'
          }`}
        >
          Remove
        </button>
      </div>

      {mode === 'add' ? (
        <div className="space-y-4">
          <div className="bg-[#0E1118] border border-[#1A2030] rounded-2xl p-5">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] font-bold text-[#6B7280]">PAXI AMOUNT</span>
              <span className="text-[10px] font-bold text-[#6B7280]">BAL: {paxiBalance.toFixed(2)}</span>
            </div>
            <input
              type="number"
              placeholder="0.00"
              value={paxiAmount}
              onChange={(e) => setPaxiAmount(e.target.value)}
              className="bg-transparent text-2xl font-mono font-bold focus:outline-none w-full"
            />
          </div>

          <div className="flex justify-center -my-6 relative z-10">
            <div className="bg-[#080A0F] border-2 border-[#1A2030] p-2 rounded-xl text-[#00E5CC]">
              <Plus size={20} />
            </div>
          </div>

          <div className="bg-[#0E1118] border border-[#1A2030] rounded-2xl p-5">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] font-bold text-[#6B7280] uppercase">{selectedToken?.symbol} AMOUNT</span>
              <span className="text-[10px] font-bold text-[#6B7280]">BAL: {tokenBalance.toFixed(4)}</span>
            </div>
            <input
              type="number"
              placeholder="0.00"
              value={tokenAmount}
              onChange={(e) => setTokenAmount(e.target.value)}
              className="bg-transparent text-2xl font-mono font-bold focus:outline-none w-full"
            />
          </div>

          <button
            onClick={handleAddLP}
            disabled={isProcessing || !paxiAmount || !tokenAmount}
            className="w-full bg-[#00E5CC] text-[#080A0F] font-display font-extrabold py-4 rounded-2xl shadow-lg uppercase tracking-wider flex items-center justify-center"
          >
            {isProcessing ? <Loader2 className="animate-spin" /> : 'Supply Liquidity'}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-[#0E1118] border border-[#1A2030] rounded-2xl p-5">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] font-bold text-[#6B7280]">LP TOKEN AMOUNT</span>
              <span className="text-[10px] font-bold text-[#6B7280]">MAX: 0.00</span>
            </div>
            <input
              type="number"
              placeholder="0.00"
              value={lpAmount}
              onChange={(e) => setLpAmount(e.target.value)}
              className="bg-transparent text-2xl font-mono font-bold focus:outline-none w-full"
            />
          </div>

          <button
            onClick={handleRemoveLP}
            disabled={isProcessing || !lpAmount}
            className="w-full bg-rose-500 text-white font-display font-extrabold py-4 rounded-2xl shadow-lg uppercase tracking-wider flex items-center justify-center"
          >
            {isProcessing ? <Loader2 className="animate-spin" /> : 'Remove Liquidity'}
          </button>
        </div>
      )}

      {/* Result Toast (shared) */}
      <AnimatePresence>
        {txResult && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className={`fixed bottom-24 left-6 right-6 z-[110] p-4 rounded-2xl shadow-2xl flex items-center gap-3 ${
              txResult.success ? 'bg-green-500 text-[#080A0F]' : 'bg-rose-500 text-white'
            }`}
          >
            <div className="bg-white/20 p-2 rounded-full">
              {txResult.success ? <CheckCircle size={20} /> : <XCircle size={20} />}
            </div>
            <div className="flex-1">
              <p className="font-bold text-sm">{txResult.success ? 'Success!' : 'Failed'}</p>
              <p className="text-[10px] font-medium opacity-80 truncate">
                {txResult.success ? `Hash: ${txResult.hash}` : txResult.error}
              </p>
            </div>
            <button onClick={() => setTxResult(null)} className="p-1">
              <XCircle size={16} className="opacity-50" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
