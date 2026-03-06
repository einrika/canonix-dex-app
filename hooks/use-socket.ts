import { useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [paxiPriceUSD, setPaxiPriceUSD] = useState<number>(0);

  useEffect(() => {
    const socketInstance = io();

    socketInstance.on('connect', () => {
      console.log('[Socket] Connected, ID:', socketInstance.id);
      setIsConnected(true);
    });

    socketInstance.on('disconnect', () => {
      console.log('[Socket] Disconnected');
      setIsConnected(false);
    });

    socketInstance.on('paxi_price_usd_update', (data: { usd: number }) => {
      if (data.usd) {
        setPaxiPriceUSD(data.usd);
        window.dispatchEvent(new CustomEvent('paxi_price_updated', { detail: data.usd }));
      }
    });

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const subscribeToken = useCallback((address: string) => {
    if (socket) {
      socket.emit('subscribe_token', address);
      console.log('[Socket] Subscribed to token:', address);
    }
  }, [socket]);

  const unsubscribeToken = useCallback((address: string) => {
    if (socket) {
      socket.emit('unsubscribe_token', address);
      console.log('[Socket] Unsubscribed from token:', address);
    }
  }, [socket]);

  const joinSidebar = useCallback(() => {
    if (socket) {
      socket.emit('subscribe_sidebar');
      console.log('[Socket] Joined sidebar monitoring');
    }
  }, [socket]);

  const leaveSidebar = useCallback(() => {
    if (socket) {
      socket.emit('unsubscribe_sidebar');
      console.log('[Socket] Left sidebar monitoring');
    }
  }, [socket]);

  return {
    socket,
    isConnected,
    paxiPriceUSD,
    subscribeToken,
    unsubscribeToken,
    joinSidebar,
    leaveSidebar,
  };
};
