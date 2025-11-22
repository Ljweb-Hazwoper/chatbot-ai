import { useEffect, useRef, useCallback } from 'react';
import { ChatSocketService, ChatEventHandlers } from '../services/chat/chat-socket.service';

export interface UseChatSocketOptions {
  wsUrl?: string;
  userId: string;
  handlers: ChatEventHandlers;
  autoConnect?: boolean;
}

export const useChatSocket = ({
  wsUrl,
  userId,
  handlers,
  autoConnect = true,
}: UseChatSocketOptions) => {
  const serviceRef = useRef<ChatSocketService | null>(null);

  useEffect(() => {
    if (!autoConnect) {
      return;
    }

    const service = new ChatSocketService(wsUrl);
    serviceRef.current = service;

    service.connect(handlers);

    return () => {
      service.disconnect();
      serviceRef.current = null;
    };
  }, [wsUrl, autoConnect]);

  const startSession = useCallback(
    (sessionId?: string) => {
      if (!serviceRef.current) {
        throw new Error('Chat socket service is not initialized');
      }
      serviceRef.current.startSession({ userId, sessionId });
    },
    [userId]
  );

  const sendMessage = useCallback(
    (message: string, sessionId?: string, metadata?: Record<string, string>) => {
      if (!serviceRef.current) {
        throw new Error('Chat socket service is not initialized');
      }
      serviceRef.current.sendMessage({
        userId,
        message,
        sessionId,
        metadata,
      });
    },
    [userId]
  );

  const isConnected = useCallback(() => {
    return serviceRef.current?.isConnected() ?? false;
  }, []);

  return {
    startSession,
    sendMessage,
    isConnected,
  };
};

