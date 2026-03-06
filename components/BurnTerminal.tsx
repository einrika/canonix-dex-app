'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { useWallet } from '@/lib/wallet-context';
import { type Token } from '@/lib/canonix-api';

export function BurnTerminal({ tokens }: { tokens: Token[] }) {
  const { balances, executeBurn } = useWallet();
  const [selectedToken, setSelectedToken] = useState<Token | undefined>(tokens[0]);
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [txResult, setTxResult] = useState<{ success: boolean; hash?: string; error?: string } | null>(null);

  const handleBurn = async () => {
    if (!selectedToken) return;
    setIsProcessing(true);
    try {
      const result = await executeBurn(selectedToken.contract, parseFloat(amount), selectedToken.decimals, selectedToken.symbol);
      setTxResult({ success: true, hash: result.transactionHash });
    } catch (e: any) {
      setTxResult({ success: false, error: e.message });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4 text-center">
      <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-6 mb-4">
        <Flame size={48} className="text-rose-500 mx-auto mb-4 animate-pulse" />
        <h3 className="text-lg font-display font-extrabold uppercase text-rose-500">Token Burn Terminal</h3>
        <p className="text-[10px] text-[#6B7280] font-medium uppercase mt-2 tracking-widest leading-relaxed">
          Burning tokens removes them from circulation forever. <br /> This action is irreversible.
        </p>
      </div>

      <div className="bg-[#0E1118] border border-[#1A2030] rounded-2xl p-5 text-left">
        <p className="text-[10px] font-bold text-[#6B7280] mb-4 uppercase">Amount to Burn</p>
        <input
          type="number"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="bg-transparent text-3xl font-mono font-bold focus:outline-none w-full text-rose-500"
        />
      </div>

      <button
        onClick={handleBurn}
        disabled={isProcessing || !amount}
        className="w-full bg-rose-500 text-white font-display font-extrabold py-4 rounded-2xl shadow-[0_0_20px_rgba(244,63,94,0.3)] uppercase tracking-wider flex items-center justify-center gap-2"
      >
        {isProcessing ? <Loader2 className="animate-spin" /> : <><Flame size={18} /> Confirm Burn</>}
      </button>

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
            <div className="flex-1 text-left">
              <p className="font-bold text-sm">{txResult.success ? 'Burned Successfully' : 'Burn Failed'}</p>
              <p className="text-[10px] font-medium opacity-80 truncate">{txResult.success ? `Hash: ${txResult.hash}` : txResult.error}</p>
            </div>
            <button onClick={() => setTxResult(null)} className="p-1"><XCircle size={16} className="opacity-50" /></button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
