'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import CryptoJS from 'crypto-js';
import { DirectSecp256k1HdWallet, Registry } from '@cosmjs/proto-signing';
import { StargateClient, SigningStargateClient, defaultRegistryTypes } from '@cosmjs/stargate';

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
  switchWallet: (id: string) => void;
  buildAndSendTx: (messages: any[], memo?: string, metadata?: any) => Promise<any>;
  executeSwap: (contractAddress: string, offerDenom: string, offerAmount: number, minReceive: number, tokenDecimals: number, symbol: string) => Promise<any>;
  executeSend: (tokenAddress: string, recipient: string, amount: number, tokenDecimals: number, symbol: string) => Promise<any>;
  executeBurn: (contractAddress: string, amount: number, tokenDecimals: number, symbol: string) => Promise<any>;
  executeAddLP: (contractAddress: string, paxiAmount: number, tokenAmount: number, tokenDecimals: number, symbol: string) => Promise<any>;
  executeRemoveLP: (contractAddress: string, lpAmount: number, symbol: string) => Promise<any>;
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

  const switchWallet = (id: string) => {
    const wallet = wallets.find(w => w.id === id);
    if (wallet) setActiveWallet(wallet);
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

  const buildAndSendTx = async (messages: any[], memo: string = "", metadata: any = {}) => {
    if (!activeWallet || isLocked || !pin) {
      throw new Error("Wallet locked or not connected");
    }

    try {
      // Decrypt mnemonic
      const bytes = CryptoJS.AES.decrypt(activeWallet.encryptedMnemonic, pin);
      const mnemonic = bytes.toString(CryptoJS.enc.Utf8);

      const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, { prefix: 'paxi' });

      const myRegistry = new Registry(defaultRegistryTypes);
      // Note: In a real app, we would add custom message types here if needed

      const client = await SigningStargateClient.connectWithSigner(activeNetwork.rpc, wallet, {
        registry: myRegistry
      });

      const result = await client.signAndBroadcast(activeWallet.address, messages, "auto", memo);

      await refreshBalances();
      return result;
    } catch (e) {
      console.error('Transaction failed', e);
      throw e;
    }
  };

  const executeSwap = async (
    contractAddress: string,
    offerDenom: string,
    offerAmount: number,
    minReceive: number,
    tokenDecimals: number,
    symbol: string
  ) => {
    if (!activeWallet) return;

    const microOffer = offerDenom === 'upaxi' ?
      Math.floor(offerAmount * 1e6).toString() :
      Math.floor(offerAmount * Math.pow(10, tokenDecimals)).toString();

    const microMinReceive = offerDenom === 'upaxi' ?
      Math.floor(minReceive * Math.pow(10, tokenDecimals)).toString() :
      Math.floor(minReceive * 1e6).toString();

    const messages = [];

    // 1. Allowance if offering PRC20
    if (offerDenom !== 'upaxi') {
      messages.push({
        typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
        value: {
          sender: activeWallet.address,
          contract: offerDenom,
          msg: new TextEncoder().encode(JSON.stringify({
            increase_allowance: {
              spender: "paxi1v2p59q89nssvsn4t48zstndn6r6znunyxvpx3tky8303jnyhyt7sw9mcyq",
              amount: microOffer
            }
          })),
          funds: []
        }
      });
    }

    // 2. Swap Message
    messages.push({
      typeUrl: "/x.swap.types.MsgSwap",
      value: {
        creator: activeWallet.address,
        prc20: contractAddress,
        offerDenom: offerDenom,
        offerAmount: microOffer,
        minReceive: microMinReceive
      }
    });

    return buildAndSendTx(messages, "Swap via Canonix", {
      type: 'Swap',
      asset: symbol
    });
  };

  const executeSend = async (
    tokenAddress: string,
    recipient: string,
    amount: number,
    tokenDecimals: number,
    symbol: string
  ) => {
    if (!activeWallet) return;

    const microAmount = Math.floor(amount * Math.pow(10, tokenDecimals)).toString();
    const messages = [];

    if (tokenAddress === 'upaxi') {
      messages.push({
        typeUrl: "/cosmos.bank.v1beta1.MsgSend",
        value: {
          fromAddress: activeWallet.address,
          toAddress: recipient,
          amount: [{ denom: 'upaxi', amount: microAmount }]
        }
      });
    } else {
      messages.push({
        typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
        value: {
          sender: activeWallet.address,
          contract: tokenAddress,
          msg: new TextEncoder().encode(JSON.stringify({
            transfer: {
              recipient: recipient,
              amount: microAmount
            }
          })),
          funds: []
        }
      });
    }

    return buildAndSendTx(messages, "Send via Canonix", {
      type: 'Send',
      asset: symbol,
      address: recipient
    });
  };

  const executeBurn = async (
    contractAddress: string,
    amount: number,
    tokenDecimals: number,
    symbol: string
  ) => {
    if (!activeWallet) return;

    const microAmount = Math.floor(amount * Math.pow(10, tokenDecimals)).toString();

    const messages = [{
      typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
      value: {
        sender: activeWallet.address,
        contract: contractAddress,
        msg: new TextEncoder().encode(JSON.stringify({
          burn: {
            amount: microAmount
          }
        })),
        funds: []
      }
    }];

    return buildAndSendTx(messages, "Burn Tokens", {
      type: 'Burn',
      asset: symbol
    });
  };

  const executeAddLP = async (
    contractAddress: string,
    paxiAmount: number,
    tokenAmount: number,
    tokenDecimals: number,
    symbol: string
  ) => {
    if (!activeWallet) return;

    const microPaxi = Math.floor(paxiAmount * 1e6).toString();
    const microToken = Math.floor(tokenAmount * Math.pow(10, tokenDecimals)).toString();

    const messages = [];

    // 1. Allowance for Token
    messages.push({
      typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
      value: {
        sender: activeWallet.address,
        contract: contractAddress,
        msg: new TextEncoder().encode(JSON.stringify({
          increase_allowance: {
            spender: "paxi1v2p59q89nssvsn4t48zstndn6r6znunyxvpx3tky8303jnyhyt7sw9mcyq",
            amount: microToken
          }
        })),
        funds: []
      }
    });

    // 2. Provide Liquidity Msg
    messages.push({
      typeUrl: "/x.swap.types.MsgProvideLiquidity",
      value: {
        creator: activeWallet.address,
        prc20: contractAddress,
        paxiAmount: microPaxi + 'upaxi',
        prc20Amount: microToken
      }
    });

    return buildAndSendTx(messages, "Add Liquidity", {
      type: 'Add Liquidity',
      asset: `PAXI / ${symbol}`
    });
  };

  const executeRemoveLP = async (
    contractAddress: string,
    lpAmount: number,
    symbol: string
  ) => {
    if (!activeWallet) return;

    const microLP = Math.floor(lpAmount * 1e6).toString();

    const messages = [{
      typeUrl: "/x.swap.types.MsgWithdrawLiquidity",
      value: {
        creator: activeWallet.address,
        prc20: contractAddress,
        lpAmount: microLP
      }
    }];

    return buildAndSendTx(messages, "Remove Liquidity", {
      type: 'Remove Liquidity',
      asset: `PAXI / ${symbol}`
    });
  };

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
      refreshBalances,
      switchWallet,
      buildAndSendTx,
      executeSwap,
      executeSend,
      executeBurn,
      executeAddLP,
      executeRemoveLP
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
