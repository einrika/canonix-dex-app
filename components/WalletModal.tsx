'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2, Wallet as WalletIcon, Key, Shield, CheckCircle, AlertCircle } from 'lucide-react';
import { useWallet } from '@/lib/wallet-context';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WalletModal({ isOpen, onClose }: WalletModalProps) {
  const { wallets, activeWallet, connectWallet, addWallet, deleteWallet, isLocked, unlock, lock } = useWallet();
  const [view, setView] = useState<'list' | 'add' | 'unlock'>('list');
  const [newWalletName, setNewWalletName] = useState('');
  const [mnemonic, setMnemonic] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddWallet = async () => {
    if (!newWalletName || !mnemonic || !pin) {
      setError('Please fill all fields');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await addWallet(newWalletName, mnemonic, pin);
      setView('list');
      setNewWalletName('');
      setMnemonic('');
      setPin('');
    } catch (e) {
      setError('Invalid mnemonic or PIN');
    } finally {
      setLoading(false);
    }
  };

  const handleUnlock = () => {
    if (unlock(pin)) {
      setView('list');
      setPin('');
      setError('');
    } else {
      setError('Incorrect PIN');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            className="relative w-full max-w-md bg-[#0E1118] border border-[#1A2030] rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="p-6 border-b border-[#1A2030] flex items-center justify-between">
              <h2 className="font-display text-lg font-extrabold uppercase tracking-widest">
                {view === 'list' ? 'My Wallets' : view === 'add' ? 'Add Wallet' : 'Unlock Wallet'}
              </h2>
              <button onClick={onClose} className="p-2 hover:bg-[#1A2030] rounded-xl transition-colors">
                <X size={20} className="text-[#6B7280]" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 max-h-[70vh] overflow-y-auto no-scrollbar">
              {view === 'list' && (
                <div className="space-y-4">
                  {wallets.length === 0 ? (
                    <div className="text-center py-10">
                      <div className="w-16 h-16 bg-[#1A2030] rounded-full flex items-center justify-center mx-auto mb-4">
                        <WalletIcon size={32} className="text-[#6B7280]" />
                      </div>
                      <p className="text-[#6B7280] font-medium mb-6">No wallets found</p>
                      <button 
                        onClick={() => setView('add')}
                        className="w-full bg-[#00E5CC] text-[#080A0F] font-bold py-4 rounded-2xl flex items-center justify-center gap-2 uppercase text-sm"
                      >
                        <Plus size={18} />
                        Create or Import Wallet
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-2">
                        {wallets.map((wallet) => (
                          <div 
                            key={wallet.id}
                            onClick={() => connectWallet(wallet)}
                            className={`p-4 rounded-2xl border transition-all cursor-pointer group ${
                              activeWallet?.id === wallet.id 
                              ? 'bg-[#00E5CC]/10 border-[#00E5CC]' 
                              : 'bg-[#080A0F] border-[#1A2030] hover:border-[#00E5CC]/50'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                  activeWallet?.id === wallet.id ? 'bg-[#00E5CC] text-[#080A0F]' : 'bg-[#1A2030] text-[#6B7280]'
                                }`}>
                                  <WalletIcon size={20} />
                                </div>
                                <div>
                                  <p className="font-bold text-sm">{wallet.name}</p>
                                  <p className="text-[10px] font-mono text-[#6B7280]">{wallet.address.slice(0, 12)}...{wallet.address.slice(-8)}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {activeWallet?.id === wallet.id && <CheckCircle size={16} className="text-[#00E5CC]" />}
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteWallet(wallet.id);
                                  }}
                                  className="p-2 text-[#6B7280] hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <button 
                        onClick={() => setView('add')}
                        className="w-full bg-[#0E1118] border border-[#1A2030] text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 uppercase text-sm mt-4"
                      >
                        <Plus size={18} />
                        Add Another Wallet
                      </button>
                    </>
                  )}
                </div>
              )}

              {view === 'add' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-[#6B7280] uppercase mb-1.5 block">Wallet Name</label>
                    <input 
                      type="text"
                      placeholder="e.g. Main Wallet"
                      value={newWalletName}
                      onChange={(e) => setNewWalletName(e.target.value)}
                      className="w-full bg-[#080A0F] border border-[#1A2030] rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-[#00E5CC]/50"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-[#6B7280] uppercase mb-1.5 block">Mnemonic Phrase</label>
                    <textarea 
                      placeholder="Enter your 12 or 24 word phrase..."
                      rows={3}
                      value={mnemonic}
                      onChange={(e) => setMnemonic(e.target.value)}
                      className="w-full bg-[#080A0F] border border-[#1A2030] rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-[#00E5CC]/50 resize-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-[#6B7280] uppercase mb-1.5 block">Set PIN</label>
                    <input 
                      type="password"
                      placeholder="Enter PIN to encrypt wallet"
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                      className="w-full bg-[#080A0F] border border-[#1A2030] rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-[#00E5CC]/50"
                    />
                  </div>
                  
                  {error && (
                    <div className="flex items-center gap-2 text-rose-500 text-xs font-bold bg-rose-500/10 p-3 rounded-xl">
                      <AlertCircle size={14} />
                      {error}
                    </div>
                  )}

                  <div className="flex gap-3 pt-2">
                    <button 
                      onClick={() => setView('list')}
                      className="flex-1 bg-[#080A0F] border border-[#1A2030] text-[#6B7280] font-bold py-4 rounded-2xl uppercase text-xs"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleAddWallet}
                      disabled={loading}
                      className="flex-1 bg-[#00E5CC] text-[#080A0F] font-bold py-4 rounded-2xl uppercase text-xs shadow-lg disabled:opacity-50"
                    >
                      {loading ? 'Processing...' : 'Import Wallet'}
                    </button>
                  </div>
                </div>
              )}

              {view === 'unlock' && (
                <div className="space-y-4">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-[#00E5CC]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Shield size={32} className="text-[#00E5CC]" />
                    </div>
                    <p className="text-[#6B7280] text-sm">Enter your PIN to unlock your wallets</p>
                  </div>
                  
                  <div>
                    <label className="text-[10px] font-bold text-[#6B7280] uppercase mb-1.5 block">Enter PIN</label>
                    <input 
                      type="password"
                      placeholder="••••••"
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                      className="w-full bg-[#080A0F] border border-[#1A2030] rounded-xl py-4 px-4 text-center text-2xl tracking-[1em] focus:outline-none focus:border-[#00E5CC]/50"
                    />
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 text-rose-500 text-xs font-bold bg-rose-500/10 p-3 rounded-xl">
                      <AlertCircle size={14} />
                      {error}
                    </div>
                  )}

                  <button 
                    onClick={handleUnlock}
                    className="w-full bg-[#00E5CC] text-[#080A0F] font-bold py-4 rounded-2xl uppercase text-sm shadow-lg mt-4"
                  >
                    Unlock
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
