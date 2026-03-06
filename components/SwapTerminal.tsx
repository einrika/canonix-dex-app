'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, ChevronDown, ArrowUpDown, Loader2, Info, Shield, CheckCircle, XCircle } from 'lucide-react';
import { useWallet } from '@/lib/wallet-context';
import { type Token, formatPrice, getTokenLetter, getTokenColor } from '@/lib/canonix-api';
import { calculateSwap } from '@/lib/swap-logic';

interface SwapTerminalProps {
  initialToken?: Token;
  tokens: Token[];
}

export function SwapTerminal({ initialToken, tokens }: SwapTerminalProps) {
  const { activeWallet, balances, executeSwap } = useWallet();
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [payAmount, setPayAmount] = useState('');
  const [selectedToken, setSelectedToken] = useState<Token | undefined>(initialToken || tokens[0]);
  const [slippage, setSlippage] = useState(0.5);
  const [isSlippageOpen, setIsSlippageOpen] = useState(false);
  const [isTokenSelectorOpen, setIsTokenSelectorOpen] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [txResult, setTxResult] = useState<{ success: boolean; hash?: string; error?: string } | null>(null);

  // Sync selectedToken if initialToken changes
  useEffect(() => {
    if (initialToken) setSelectedToken(initialToken);
  }, [initialToken]);

  const paxiBalance = parseFloat(balances['upaxi'] || '0') / 1e6;
  const tokenBalance = selectedToken ? parseFloat(balances[selectedToken.contract] || '0') / Math.pow(10, selectedToken.decimals) : 0;

  const currentPayBalance = tradeType === 'buy' ? paxiBalance : tokenBalance;

  const swapResult = useMemo(() => {
    if (!selectedToken || !payAmount) return { outputAmount: 0, priceImpact: 0, minReceived: 0 };

    // We need real reserve data here, for now using mock derived from price
    // In a real scenario, this would come from a query to the pool
    const reservePaxi = 1000000; // Mock
    const reservePrc20 = reservePaxi / selectedToken.price;

    return calculateSwap({
      payAmount: parseFloat(payAmount),
      tradeType,
      slippage,
      reservePaxi,
      reservePrc20,
      tokenDecimals: selectedToken.decimals,
    });
  }, [selectedToken, payAmount, tradeType, slippage]);

  const handleExecuteSwap = async () => {
    if (!selectedToken) return;
    setIsProcessing(true);
    try {
      const result = await executeSwap(
        selectedToken.contract,
        tradeType === 'buy' ? 'upaxi' : selectedToken.contract,
        parseFloat(payAmount),
        swapResult.minReceived,
        selectedToken.decimals,
        selectedToken.symbol
      );
      setTxResult({ success: true, hash: result.transactionHash });
    } catch (e: any) {
      setTxResult({ success: false, error: e.message });
    } finally {
      setIsProcessing(false);
      setIsConfirming(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex bg-[#0E1118] p-1 rounded-2xl border border-[#1A2030]">
        <button
          onClick={() => setTradeType('buy')}
          className={`flex-1 py-3 rounded-xl font-display font-bold text-sm uppercase transition-all ${
            tradeType === 'buy' ? 'bg-green-500 text-[#080A0F] shadow-lg' : 'text-[#6B7280]'
          }`}
        >
          Buy
        </button>
        <button
          onClick={() => setTradeType('sell')}
          className={`flex-1 py-3 rounded-xl font-display font-bold text-sm uppercase transition-all ${
            tradeType === 'sell' ? 'bg-rose-500 text-white shadow-lg' : 'text-[#6B7280]'
          }`}
        >
          Sell
        </button>
      </div>

      {/* Pay Card */}
      <div className="bg-[#0E1118] border border-[#1A2030] rounded-2xl p-5">
        <div className="flex justify-between items-center mb-4">
          <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest">You Pay</span>
          <button
            onClick={() => setPayAmount(currentPayBalance.toString())}
            className="text-[10px] font-bold text-[#00E5CC] hover:underline"
          >
            Balance: {currentPayBalance.toFixed(tradeType === 'buy' ? 2 : 4)}
          </button>
        </div>
        <div className="flex items-center justify-between gap-4">
          <input
            type="number"
            placeholder="0.00"
            value={payAmount}
            onChange={(e) => setPayAmount(e.target.value)}
            className="bg-transparent text-3xl font-mono font-bold focus:outline-none w-full placeholder:text-[#1A2030]"
          />
          <button
            onClick={() => tradeType === 'sell' && setIsTokenSelectorOpen(true)}
            className="flex items-center gap-2 bg-[#141820] border border-[#1A2030] pl-2 pr-3 py-1.5 rounded-xl"
          >
            {tradeType === 'buy' ? (
              <>
                <div className="w-6 h-6 rounded-lg bg-[#00E5CC] flex items-center justify-center text-[10px] font-bold text-[#080A0F]">P</div>
                <span className="font-mono font-bold text-sm">PXI</span>
              </>
            ) : (
              <>
                <div className={`w-6 h-6 rounded-lg ${getTokenColor(selectedToken?.symbol || '')} flex items-center justify-center text-[10px] font-bold text-white`}>
                  {getTokenLetter(selectedToken?.name || 'T')}
                </div>
                <span className="font-mono font-bold text-sm">{selectedToken?.symbol}</span>
                <ChevronDown size={14} className="text-[#6B7280]" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Swap Button Icon */}
      <div className="flex justify-center -my-6 relative z-10">
        <motion.button
          whileTap={{ scale: 0.9, rotate: 180 }}
          onClick={() => setTradeType(tradeType === 'buy' ? 'sell' : 'buy')}
          className="bg-[#080A0F] border-2 border-[#1A2030] p-2.5 rounded-xl text-[#00E5CC] shadow-xl"
        >
          <ArrowUpDown size={20} />
        </motion.button>
      </div>

      {/* Receive Card */}
      <div className="bg-[#0E1118] border border-[#1A2030] rounded-2xl p-5">
        <div className="flex justify-between items-center mb-4">
          <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest">You Receive</span>
          <span className="text-[10px] font-bold text-[#6B7280]">
            Balance: {(tradeType === 'buy' ? tokenBalance : paxiBalance).toFixed(tradeType === 'buy' ? 4 : 2)}
          </span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <div className={`text-3xl font-mono font-bold ${swapResult.outputAmount > 0 ? 'text-white' : 'text-[#1A2030]'}`}>
            {swapResult.outputAmount.toFixed(tradeType === 'buy' ? 4 : 2)}
          </div>
          <button
            onClick={() => tradeType === 'buy' && setIsTokenSelectorOpen(true)}
            className="flex items-center gap-2 bg-[#141820] border border-[#1A2030] pl-2 pr-3 py-1.5 rounded-xl"
          >
            {tradeType === 'sell' ? (
              <>
                <div className="w-6 h-6 rounded-lg bg-[#00E5CC] flex items-center justify-center text-[10px] font-bold text-[#080A0F]">P</div>
                <span className="font-mono font-bold text-sm">PXI</span>
              </>
            ) : (
              <>
                <div className={`w-6 h-6 rounded-lg ${getTokenColor(selectedToken?.symbol || '')} flex items-center justify-center text-[10px] font-bold text-white`}>
                  {getTokenLetter(selectedToken?.name || 'T')}
                </div>
                <span className="font-mono font-bold text-sm">{selectedToken?.symbol}</span>
                <ChevronDown size={14} className="text-[#6B7280]" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Stats Panel */}
      <div className="bg-[#0E1118] border border-[#1A2030] rounded-2xl p-4 space-y-3">
        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
          <span className="text-[#6B7280]">Price Impact</span>
          <span className={swapResult.priceImpact > 5 ? 'text-rose-500' : swapResult.priceImpact > 2 ? 'text-yellow-500' : 'text-green-400'}>
            {swapResult.priceImpact.toFixed(2)}%
          </span>
        </div>
        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
          <span className="text-[#6B7280]">Min Received</span>
          <span className="text-white">{swapResult.minReceived.toFixed(tradeType === 'buy' ? 4 : 2)} {tradeType === 'buy' ? selectedToken?.symbol : 'PXI'}</span>
        </div>
        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest pt-3 border-t border-[#1A2030]">
          <span className="text-[#6B7280]">Slippage Tolerance</span>
          <button
            onClick={() => setIsSlippageOpen(true)}
            className="text-[#00E5CC] flex items-center gap-1"
          >
            {slippage}% <Settings size={10} />
          </button>
        </div>
      </div>

      {/* Main Action Button */}
      {!activeWallet ? (
        <button className="w-full bg-[#00E5CC] text-[#080A0F] font-display font-extrabold py-4 rounded-2xl shadow-lg uppercase tracking-wider">
          Connect Wallet
        </button>
      ) : (
        <button
          disabled={!payAmount || parseFloat(payAmount) <= 0 || parseFloat(payAmount) > currentPayBalance}
          onClick={() => setIsConfirming(true)}
          className="w-full bg-[#00E5CC] text-[#080A0F] font-display font-extrabold py-4 rounded-2xl shadow-lg uppercase tracking-wider disabled:opacity-50 disabled:grayscale"
        >
          {parseFloat(payAmount) > currentPayBalance ? 'Insufficient Balance' : `${tradeType === 'buy' ? 'Buy' : 'Sell'} Now`}
        </button>
      )}

      {/* Confirmation Modal */}
      <AnimatePresence>
        {isConfirming && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsConfirming(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-sm bg-[#0E1118] border border-[#1A2030] rounded-3xl p-6 shadow-2xl"
            >
              <h3 className="text-lg font-display font-extrabold uppercase tracking-widest mb-6 text-center">Confirm Swap</h3>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-[#6B7280] font-bold uppercase">Pay</span>
                  <span className="text-sm font-mono font-bold">{payAmount} {tradeType === 'buy' ? 'PXI' : selectedToken?.symbol}</span>
                </div>
                <div className="flex justify-center">
                  <ArrowUpDown size={16} className="text-[#00E5CC]" />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-[#6B7280] font-bold uppercase">Receive</span>
                  <span className="text-sm font-mono font-bold">{swapResult.outputAmount.toFixed(4)} {tradeType === 'buy' ? selectedToken?.symbol : 'PXI'}</span>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsConfirming(false)}
                  className="flex-1 py-4 bg-[#080A0F] border border-[#1A2030] rounded-2xl font-bold text-xs uppercase"
                >
                  Cancel
                </button>
                <button
                  onClick={handleExecuteSwap}
                  disabled={isProcessing}
                  className="flex-1 py-4 bg-[#00E5CC] text-[#080A0F] rounded-2xl font-bold text-xs uppercase shadow-lg flex items-center justify-center"
                >
                  {isProcessing ? <Loader2 className="animate-spin" /> : 'Confirm'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Transaction Result Toast */}
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
              <p className="font-bold text-sm">{txResult.success ? 'Transaction Successful!' : 'Transaction Failed'}</p>
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

      {/* Slippage Modal */}
      <AnimatePresence>
        {isSlippageOpen && (
          <div className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center p-0 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSlippageOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="relative w-full max-w-sm bg-[#0E1118] border-t sm:border border-[#1A2030] rounded-t-[2rem] sm:rounded-3xl p-8"
            >
              <h3 className="text-lg font-display font-extrabold uppercase tracking-widest mb-6">Slippage Settings</h3>
              <div className="grid grid-cols-4 gap-2 mb-6">
                {[0.1, 0.5, 1.0, 3.0].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSlippage(s)}
                    className={`py-2 rounded-xl font-mono text-xs border ${
                      slippage === s ? 'bg-[#00E5CC] text-[#080A0F] border-[#00E5CC]' : 'border-[#1A2030] text-[#6B7280]'
                    }`}
                  >
                    {s}%
                  </button>
                ))}
              </div>
              <button
                onClick={() => setIsSlippageOpen(false)}
                className="w-full py-4 bg-[#1A2030] text-white rounded-2xl font-bold uppercase text-xs"
              >
                Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Token Selector Modal */}
      <AnimatePresence>
        {isTokenSelectorOpen && (
          <div className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center p-0 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsTokenSelectorOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="relative w-full max-w-md h-[80vh] bg-[#0E1118] border-t sm:border border-[#1A2030] rounded-t-[2rem] sm:rounded-3xl flex flex-col overflow-hidden"
            >
              <div className="p-6 border-b border-[#1A2030] flex justify-between items-center">
                <h3 className="text-lg font-display font-extrabold uppercase tracking-widest">Select Token</h3>
                <button onClick={() => setIsTokenSelectorOpen(false)} className="text-[#6B7280]">
                  <XCircle size={24} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-2 no-scrollbar">
                {tokens.map((token) => (
                  <button
                    key={token.contract}
                    onClick={() => {
                      setSelectedToken(token);
                      setIsTokenSelectorOpen(false);
                    }}
                    className={`w-full p-4 rounded-2xl border transition-all flex items-center justify-between ${
                      selectedToken?.contract === token.contract ? 'bg-[#00E5CC]/10 border-[#00E5CC]' : 'bg-[#080A0F] border-[#1A2030] hover:border-[#6B7280]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl ${getTokenColor(token.symbol)} flex items-center justify-center font-bold`}>
                        {getTokenLetter(token.name)}
                      </div>
                      <div className="text-left">
                        <p className="font-mono font-bold text-sm">{token.symbol}</p>
                        <p className="text-[10px] text-[#6B7280] font-medium">{token.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-sm font-bold">{formatPrice(token.price)}</p>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
