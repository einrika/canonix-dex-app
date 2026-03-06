import { Inter, Syne, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-display',
});

const ibmPlexMono = IBM_Plex_Mono({
  weight: ['400', '500', '600'],
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata = {
  title: 'Canonix Native',
  description: 'Professional DEX Mobile App for Paxi Network',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${syne.variable} ${ibmPlexMono.variable} dark`}>
      <body className="bg-[#080A0F] text-[#F0F4FF] antialiased selection:bg-[#00E5CC]/30">
        <Providers>
          <div className="mx-auto max-w-md min-h-screen bg-[#080A0F] relative flex flex-col shadow-2xl overflow-hidden border-x border-[#1A2030]">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
