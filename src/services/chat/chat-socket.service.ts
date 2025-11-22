import { io, Socket } from 'socket.io-client';

export interface StartSessionPayload {
  userId: string;
  sessionId?: string;
}

export interface SendMessagePayload {
  sessionId?: string;
  userId: string;
  message: string;
  metadata?: Record<string, string>;
}

export interface ChatPartialPayload {
  delta: string;
}

export interface CourseRecommendation {
  courseId: string;
  courseName: string;
  description: string;
  price: string;
  duration: string;
  url: string;
}

export interface ChatFinalPayload {
  reply: string;
  hasNewRecommendations: boolean;
  recommendations: CourseRecommendation[];
  citedRegulations?: string[];
  previousResponseId: string;
  sessionId: string;
}

export interface ChatErrorPayload {
  message: string;
}

export interface SessionStartedPayload {
  sessionId: string;
  previousResponseId?: string;
}

export type ChatEventHandlers = {
  onPartial?: (payload: ChatPartialPayload) => void;
  onFinal?: (payload: ChatFinalPayload) => void;
  onError?: (payload: ChatErrorPayload) => void;
  onSessionStarted?: (payload: SessionStartedPayload) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
};

export class ChatSocketService {
  private socket: Socket | null = null;
  private readonly wsUrl: string;
  private handlers: ChatEventHandlers = {};

  public constructor(wsUrl?: string) {
    this.wsUrl = wsUrl || import.meta.env.VITE_WS_URL || 'http://localhost:3000';
  }

  public connect(handlers: ChatEventHandlers): void {
    if (this.socket?.connected) {
      return;
    }

    this.handlers = handlers;

    this.socket = io(this.wsUrl, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    this.setupEventListeners();
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
    }
    this.handlers = {};
  }

  public startSession(payload: StartSessionPayload): void {
    if (!this.socket?.connected) {
      throw new Error('Socket is not connected');
    }
    this.socket.emit('chat:start', payload);
  }

  public sendMessage(payload: SendMessagePayload): void {
    if (!this.socket?.connected) {
      throw new Error('Socket is not connected');
    }
    this.socket.emit('chat:message', payload);
  }

  public isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  private setupEventListeners(): void {
    if (!this.socket) {
      return;
    }

    this.socket.on('connect', () => {
      this.handlers.onConnect?.();
    });

    this.socket.on('disconnect', () => {
      this.handlers.onDisconnect?.();
    });

    this.socket.on('chat:started', (payload: SessionStartedPayload) => {
      this.handlers.onSessionStarted?.(payload);
    });

    this.socket.on('chat:partial', (payload: ChatPartialPayload) => {
      this.handlers.onPartial?.(payload);
    });

    this.socket.on('chat:final', (payload: ChatFinalPayload) => {
      this.handlers.onFinal?.(payload);
    });

    this.socket.on('chat:error', (payload: ChatErrorPayload) => {
      this.handlers.onError?.(payload);
    });
  }
}

