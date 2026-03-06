'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, BarChart2, ArrowUpDown, Globe, Wallet as WalletIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useState } from 'react';
import { WalletModal } from './WalletModal';
import { useWallet } from '@/lib/wallet-context';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const tabs = [
  { name: 'Home', icon: LayoutGrid, path: '/' },
  { name: 'Market', icon: BarChart2, path: '/market' },
  { name: 'Trade', icon: ArrowUpDown, path: '/trade' },
  { name: 'Explorer', icon: Globe, path: '/explorer' },
];

export function BottomNav() {
  const pathname = usePathname();
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const { activeWallet } = useWallet();

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-6 px-4 pointer-events-none">
        <div className="max-w-md w-full pointer-events-auto">
          <nav className="bg-[#0E1118]/80 backdrop-blur-xl border border-[#1A2030] rounded-2xl flex items-center justify-around py-3 px-2 shadow-2xl">
            {tabs.map((tab) => {
              const isActive = pathname === tab.path;
              const Icon = tab.icon;

              return (
                <Link
                  key={tab.path}
                  href={tab.path}
                  className="relative flex flex-col items-center justify-center w-14 group"
                >
                  <div className={cn(
                    "p-2 rounded-xl transition-all duration-300",
                    isActive ? "text-[#00E5CC]" : "text-[#6B7280] group-hover:text-white"
                  )}>
                    <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                  </div>
                  
                  <span className={cn(
                    "text-[9px] font-bold mt-0.5 transition-all duration-300 uppercase tracking-tighter",
                    isActive ? "text-[#00E5CC]" : "text-[#6B7280]"
                  )}>
                    {tab.name}
                  </span>

                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute -bottom-1 w-1 h-1 bg-[#00E5CC] rounded-full shadow-[0_0_8px_#00E5CC]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}

            {/* Wallet Tab */}
            <button
              onClick={() => setIsWalletModalOpen(true)}
              className="relative flex flex-col items-center justify-center w-14 group"
            >
              <div className={cn(
                "p-2 rounded-xl transition-all duration-300",
                activeWallet ? "text-[#00E5CC]" : "text-[#6B7280] group-hover:text-white"
              )}>
                <WalletIcon size={20} strokeWidth={activeWallet ? 2.5 : 2} />
              </div>
              
              <span className={cn(
                "text-[9px] font-bold mt-0.5 transition-all duration-300 uppercase tracking-tighter",
                activeWallet ? "text-[#00E5CC]" : "text-[#6B7280]"
              )}>
                {activeWallet ? 'Wallet' : 'Connect'}
              </span>
            </button>
          </nav>
        </div>
      </div>

      <WalletModal 
        isOpen={isWalletModalOpen} 
        onClose={() => setIsWalletModalOpen(false)} 
      />
    </>
  );
}
