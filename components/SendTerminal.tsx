'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { useWallet } from '@/lib/wallet-context';
import { type Token } from '@/lib/canonix-api';

export function SendTerminal({ tokens }: { tokens: Token[] }) {
  const { balances, executeSend } = useWallet();
  const [selectedToken, setSelectedToken] = useState<Token | 'PAXI'>('PAXI');
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [txResult, setTxResult] = useState<{ success: boolean; hash?: string; error?: string } | null>(null);

  const handleSend = async () => {
    setIsProcessing(true);
    try {
      const isPaxi = selectedToken === 'PAXI';
      const tokenAddress = isPaxi ? 'upaxi' : selectedToken.contract;
      const decimals = isPaxi ? 6 : selectedToken.decimals;
      const symbol = isPaxi ? 'PAXI' : selectedToken.symbol;

      const result = await executeSend(tokenAddress, recipient, parseFloat(amount), decimals, symbol);
      setTxResult({ success: true, hash: result.transactionHash });
    } catch (e: any) {
      setTxResult({ success: false, error: e.message });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-[#0E1118] border border-[#1A2030] rounded-2xl p-5">
        <p className="text-[10px] font-bold text-[#6B7280] mb-4 uppercase">Recipient Address</p>
        <input
          type="text"
          placeholder="paxi1..."
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          className="bg-transparent text-sm font-mono font-bold focus:outline-none w-full placeholder:text-[#1A2030]"
        />
      </div>

      <div className="bg-[#0E1118] border border-[#1A2030] rounded-2xl p-5">
        <p className="text-[10px] font-bold text-[#6B7280] mb-4 uppercase">Amount</p>
        <input
          type="number"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="bg-transparent text-2xl font-mono font-bold focus:outline-none w-full"
        />
      </div>

      <button
        onClick={handleSend}
        disabled={isProcessing || !recipient || !amount}
        className="w-full bg-[#00E5CC] text-[#080A0F] font-display font-extrabold py-4 rounded-2xl shadow-lg uppercase tracking-wider flex items-center justify-center gap-2"
      >
        {isProcessing ? <Loader2 className="animate-spin" /> : <><Send size={18} /> Send Assets</>}
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
            <div className="flex-1">
              <p className="font-bold text-sm">{txResult.success ? 'Sent Successfully!' : 'Send Failed'}</p>
              <p className="text-[10px] font-medium opacity-80 truncate">{txResult.success ? `Hash: ${txResult.hash}` : txResult.error}</p>
            </div>
            <button onClick={() => setTxResult(null)} className="p-1"><XCircle size={16} className="opacity-50" /></button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
