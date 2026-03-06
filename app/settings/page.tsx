'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Settings, Zap, Shield, Globe, ExternalLink, ChevronRight, Database, Server, Clock, TrendingUp, Moon, Sun, Bell, Lock, User } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { BottomNav } from '@/components/BottomNav';

const settingsOptions = [
  {
    category: "Account",
    items: [
      { name: "Profile", icon: User, desc: "Manage your profile information" },
      { name: "Security", icon: Shield, desc: "Manage your account security" },
      { name: "Connected Wallets", icon: Lock, desc: "Manage your connected wallets" }
    ]
  },
  {
    category: "Preferences",
    items: [
      { name: "Notifications", icon: Bell, desc: "Manage your notification settings" },
      { name: "Theme", icon: Moon, desc: "Switch between dark and light mode" },
      { name: "Language", icon: Globe, desc: "Change your preferred language" }
    ]
  },
  {
    category: "System",
    items: [
      { name: "Network", icon: Server, desc: "Manage your network settings" },
      { name: "API", icon: Database, desc: "Manage your API settings" },
      { name: "About", icon: Zap, desc: "Learn more about Canonix" }
    ]
  }
];

export default function SettingsPage() {
  const [theme, setTheme] = useState('dark');

  return (
    <div className="min-h-screen bg-[#080A0F] text-white pb-32">
      {/* Header */}
      <header className="px-6 pt-12 pb-8 sticky top-0 bg-[#080A0F]/80 backdrop-blur-md z-10">
        <Link href="/explorer" className="inline-flex items-center gap-2 text-[#00E5CC] font-bold text-xs uppercase tracking-widest mb-6">
          <ArrowLeft size={16} />
          Back to Explorer
        </Link>
        <h1 className="font-display text-3xl font-black tracking-tighter">
          SETTINGS
        </h1>
        <p className="text-xs text-[#6B7280] font-medium mt-1 uppercase tracking-widest">Manage Your Experience</p>
      </header>

      <div className="px-6 space-y-8">
        {/* Settings List */}
        <div className="space-y-8">
          {settingsOptions.map((cat, i) => (
            <section key={i}>
              <h3 className="font-display font-bold text-xs text-[#6B7280] uppercase tracking-widest mb-4 px-2">{cat.category}</h3>
              <div className="space-y-3">
                {cat.items.map((item, j) => (
                  <div key={j} className="bg-[#0E1118] border border-[#1A2030] rounded-2xl p-5 flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-[#141820] flex items-center justify-center text-[#6B7280] group-hover:text-[#00E5CC] transition-colors">
                        <item.icon size={20} />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold mb-1">{item.name}</h4>
                        <p className="text-[10px] text-[#6B7280] font-medium">{item.desc}</p>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-[#1A2030] group-hover:text-[#00E5CC] transition-colors" />
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Logout Button */}
        <button className="w-full bg-[#141820] border border-[#1A2030] py-4 rounded-2xl font-display font-black text-xs uppercase tracking-widest text-red-500 hover:bg-red-500 hover:text-white transition-all">
          Logout
        </button>

        {/* Footer Info */}
        <div className="text-center">
          <p className="text-[10px] text-[#6B7280] font-bold uppercase tracking-widest">Version 2.4.0-STABLE</p>
          <p className="text-[10px] text-[#6B7280] font-bold uppercase tracking-widest mt-1">© 2025 Canonix Ecosystem</p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
