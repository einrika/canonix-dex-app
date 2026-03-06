'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import CryptoJS from 'crypto-js';
import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing';
import { StargateClient, SigningStargateClient } from '@cosmjs/stargate';

interface Wallet {
  id: string;
  name: string;
  address: string;
  encryptedMnemonic: string;
  isWatchOnly: boolean;
}

interface Network {
  id: string;
  name: string;
  rpc: string;
  lcd: string;
  explorer: string;
  chainId: string;
}

interface WalletContextType {
  wallets: Wallet[];
  activeWallet: Wallet | null;
  activeNetwork: Network;
  isLocked: boolean;
  pin: string | null;
  balances: Record<string, string>;
  
  connectWallet: (wallet: Wallet) => void;
  disconnectWallet: () => void;
  addWallet: (name: string, mnemonic: string, pin: string) => Promise<void>;
  deleteWallet: (id: string) => void;
  unlock: (pin: string) => boolean;
  lock: () => void;
  setNetwork: (networkId: string) => void;
  refreshBalances: () => Promise<void>;
}

const DEFAULT_NETWORKS: Network[] = [
  {
    id: 'mainnet',
    name: 'Paxi Mainnet',
    rpc: 'https://mainnet-rpc.paxinet.io',
    lcd: 'https://mainnet-lcd.paxinet.io',
    explorer: 'https://explorer.paxinet.io',
    chainId: 'paxi-mainnet'
  },
  {
    id: 'testnet',
    name: 'Paxi Testnet',
    rpc: 'https://testnet-rpc.paxinet.io',
    lcd: 'https://testnet-lcd.paxinet.io',
    explorer: 'https://testnet-explorer.paxinet.io',
    chainId: 'paxi-testnet'
  }
];

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [wallets, setWallets] = useState<Wallet[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('paxi_wallets');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [activeWallet, setActiveWallet] = useState<Wallet | null>(() => {
    if (typeof window !== 'undefined') {
      const savedId = localStorage.getItem('paxi_active_wallet_id');
      const savedWallets = localStorage.getItem('paxi_wallets');
      if (savedId && savedWallets) {
        const parsedWallets = JSON.parse(savedWallets);
        return parsedWallets.find((w: Wallet) => w.id === savedId) || null;
      }
    }
    return null;
  });
  const [activeNetwork, setActiveNetwork] = useState<Network>(() => {
    if (typeof window !== 'undefined') {
      const savedId = localStorage.getItem('paxi_active_network_id');
      if (savedId) {
        return DEFAULT_NETWORKS.find(n => n.id === savedId) || DEFAULT_NETWORKS[0];
      }
    }
    return DEFAULT_NETWORKS[0];
  });
  const [isLocked, setIsLocked] = useState(true);
  const [pin, setPin] = useState<string | null>(null);
  const [balances, setBalances] = useState<Record<string, string>>({});

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('paxi_wallets', JSON.stringify(wallets));
  }, [wallets]);

  useEffect(() => {
    if (activeWallet) {
      localStorage.setItem('paxi_active_wallet_id', activeWallet.id);
    } else {
      localStorage.removeItem('paxi_active_wallet_id');
    }
  }, [activeWallet]);

  useEffect(() => {
    localStorage.setItem('paxi_active_network_id', activeNetwork.id);
  }, [activeNetwork]);

  const unlock = (inputPin: string) => {
    // Simple verification: try to decrypt one wallet
    if (wallets.length === 0) {
      setPin(inputPin);
      setIsLocked(false);
      return true;
    }

    try {
      const firstWallet = wallets[0];
      const bytes = CryptoJS.AES.decrypt(firstWallet.encryptedMnemonic, inputPin);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      if (decrypted) {
        setPin(inputPin);
        setIsLocked(false);
        return true;
      }
    } catch (e) {
      console.error('Unlock failed', e);
    }
    return false;
  };

  const lock = () => {
    setPin(null);
    setIsLocked(true);
  };

  const addWallet = async (name: string, mnemonic: string, inputPin: string) => {
    try {
      // Validate mnemonic
      const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, { prefix: 'paxi' });
      const [account] = await wallet.getAccounts();
      
      const encryptedMnemonic = CryptoJS.AES.encrypt(mnemonic, inputPin).toString();
      
      const newWallet: Wallet = {
        id: Date.now().toString(),
        name,
        address: account.address,
        encryptedMnemonic,
        isWatchOnly: false
      };

      setWallets(prev => [...prev, newWallet]);
      if (!activeWallet) setActiveWallet(newWallet);
      setPin(inputPin);
      setIsLocked(false);
    } catch (e) {
      console.error('Add wallet failed', e);
      throw e;
    }
  };

  const deleteWallet = (id: string) => {
    setWallets(prev => prev.filter(w => w.id !== id));
    if (activeWallet?.id === id) setActiveWallet(null);
  };

  const connectWallet = (wallet: Wallet) => {
    setActiveWallet(wallet);
  };

  const disconnectWallet = () => {
    setActiveWallet(null);
  };

  const setNetwork = (networkId: string) => {
    const net = DEFAULT_NETWORKS.find(n => n.id === networkId);
    if (net) setActiveNetwork(net);
  };

  const refreshBalances = useCallback(async () => {
    if (!activeWallet) return;
    try {
      const client = await StargateClient.connect(activeNetwork.rpc);
      const balance = await client.getAllBalances(activeWallet.address);
      const balanceMap: Record<string, string> = {};
      balance.forEach(b => {
        balanceMap[b.denom] = b.amount;
      });
      setBalances(balanceMap);
    } catch (e) {
      console.error('Refresh balances failed', e);
    }
  }, [activeWallet, activeNetwork]);

  useEffect(() => {
    const updateBalances = async () => {
      await refreshBalances();
    };
    updateBalances();
  }, [refreshBalances]);

  return (
    <WalletContext.Provider value={{
      wallets,
      activeWallet,
      activeNetwork,
      isLocked,
      pin,
      balances,
      connectWallet,
      disconnectWallet,
      addWallet,
      deleteWallet,
      unlock,
      lock,
      setNetwork,
      refreshBalances
    }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}
