export interface Token {
  contract: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  marketCap: number;
  volume24h: number;
  holders: number;
  is_verified: boolean;
  is_pump: boolean;
  decimals: number;
  liquidity: number;
  totalSupply: number;
  logo?: string;
}

export interface NodeStatus {
  block_height: number;
  status: string;
  network: string;
  tps?: number;
}

const EXPLORER_API = 'https://explorer.paxinet.io/api';
const PUMPFUN_API = 'https://paxi-pumpfun.winsnip.xyz/api';

export const canonixApi = {
  getTokenList: async (): Promise<Token[]> => {
    try {
      const res = await fetch('/api/token-list');
      const data = await res.json();
      
      const contracts = data.contracts || [];
      
      return contracts.map((c: any) => {
        const decimals = c.decimals || 6;
        const totalSupply = parseFloat(c.total_supply || 0) / Math.pow(10, decimals);
        let pricePaxi = 0;
        if (parseFloat(c.reserve_prc20) > 0) {
          pricePaxi = (parseFloat(c.reserve_paxi) / parseFloat(c.reserve_prc20)) * Math.pow(10, decimals - 6);
        }
        const marketCapPaxi = totalSupply * pricePaxi;
        const liquidityPaxi = (parseFloat(c.reserve_paxi || 0) * 2) / 1000000;

        return {
          contract: c.contract_address,
          symbol: c.symbol,
          name: c.name,
          price: pricePaxi,
          change24h: parseFloat(c.price_change_24h || 0),
          marketCap: marketCapPaxi,
          volume24h: parseFloat(c.volume_24h || 0),
          holders: parseInt(c.num_holders || 0),
          is_verified: !!c.verified || !!c.official_verified,
          is_pump: !!c.is_pump,
          decimals: decimals,
          liquidity: liquidityPaxi,
          totalSupply: totalSupply,
          logo: c.logo
        };
      });
    } catch (error) {
      console.error('Error fetching token list:', error);
      return [];
    }
  },

  getTokenDetail: async (contract: string): Promise<Token | null> => {
    try {
      const res = await fetch(`/api/token-detail?address=${contract}`);
      const data = await res.json();
      
      const c = data.contract || data;
      if (!c || !c.contract_address) return null;

      const decimals = c.decimals || 6;
      const totalSupply = parseFloat(c.total_supply || 0) / Math.pow(10, decimals);
      let pricePaxi = 0;
      if (parseFloat(c.reserve_prc20) > 0) {
        pricePaxi = (parseFloat(c.reserve_paxi) / parseFloat(c.reserve_prc20)) * Math.pow(10, decimals - 6);
      }
      const marketCapPaxi = totalSupply * pricePaxi;
      const liquidityPaxi = (parseFloat(c.reserve_paxi || 0) * 2) / 1000000;

      return {
        contract: c.contract_address,
        symbol: c.symbol,
        name: c.name,
        price: pricePaxi,
        change24h: parseFloat(c.price_change_24h || 0),
        marketCap: marketCapPaxi,
        volume24h: parseFloat(c.volume_24h || 0),
        holders: parseInt(c.num_holders || 0),
        is_verified: !!c.verified || !!c.official_verified,
        is_pump: !!c.is_pump,
        decimals: decimals,
        liquidity: liquidityPaxi,
        totalSupply: totalSupply,
        logo: c.logo
      };
    } catch (error) {
      console.error('Error fetching token detail:', error);
      return null;
    }
  },

  getNodeStatus: async (): Promise<NodeStatus | null> => {
    try {
      const res = await fetch('/api/node-status');
      const data = await res.json();
      return {
        block_height: data.block_height || 0,
        status: 'online',
        network: 'Paxi Mainnet',
        tps: data.total_txs || 0
      };
    } catch (error) {
      console.error('Error fetching node status:', error);
      return {
        block_height: 0,
        status: 'offline',
        network: 'Paxi Mainnet'
      };
    }
  }
};

export const formatPrice = (price: number | string) => {
  const p = typeof price === 'string' ? parseFloat(price) : price;
  if (isNaN(p)) return '0.00 PAXI';
  if (p === 0) return '0.00 PAXI';
  if (p < 0.000001) return `${p.toFixed(10)} PAXI`;
  if (p < 0.001) return `${p.toFixed(8)} PAXI`;
  if (p < 1) return `${p.toFixed(6)} PAXI`;
  return `${p.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })} PAXI`;
};

export const formatChange = (change: number | string) => {
  const c = typeof change === 'string' ? parseFloat(change) : change;
  if (isNaN(c)) return '0.00%';
  const prefix = c >= 0 ? '+' : '';
  return `${prefix}${c.toFixed(2)}%`;
};

export const formatMarketCap = (mc: number | string) => {
  const n = typeof mc === 'string' ? parseFloat(mc) : mc;
  if (isNaN(n)) return '$0';
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(2)}K`;
  return `$${n.toFixed(0)}`;
};

export const getTokenLetter = (name: string) => name.charAt(0).toUpperCase();

export const getTokenColor = (symbol: string) => {
  const colors = [
    'bg-blue-500', 'bg-purple-500', 'bg-pink-500', 
    'bg-indigo-500', 'bg-cyan-500', 'bg-teal-500', 
    'bg-emerald-500', 'bg-orange-500'
  ];
  let hash = 0;
  for (let i = 0; i < symbol.length; i++) {
    hash = symbol.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};
