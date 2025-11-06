// MessageContext.tsx
// Message context for global messaging state management
// Feature Sliced Design - Message context layer

"use client";

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { ConversationWithUser } from '@/types/conversation.types';
import { MessageWithUser } from '@/types/message.types';

interface MessageState {
  conversations: ConversationWithUser[];
  messages: MessageWithUser[];
  selectedConversation: ConversationWithUser | null;
  isLoading: boolean;
  error: string | null;
  unreadCount: number;
}

type MessageAction =
  | { type: 'SET_CONVERSATIONS'; payload: ConversationWithUser[] }
  | { type: 'SET_MESSAGES'; payload: MessageWithUser[] }
  | { type: 'SELECT_CONVERSATION'; payload: ConversationWithUser | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'SET_UNREAD_COUNT'; payload: number }
  | { type: 'CLEAR_ERROR' };

const initialState: MessageState = {
  conversations: [],
  messages: [],
  selectedConversation: null,
  isLoading: false,
  error: null,
  unreadCount: 0,
};

function messageReducer(state: MessageState, action: MessageAction): MessageState {
  switch (action.type) {
    case 'SET_CONVERSATIONS':
      return { ...state, conversations: action.payload };
    case 'SET_MESSAGES':
      return { ...state, messages: action.payload };
    case 'SELECT_CONVERSATION':
      return { ...state, selectedConversation: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_UNREAD_COUNT':
      return { ...state, unreadCount: action.payload };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
}

interface MessageContextType {
  state: MessageState;
  setConversations: (conversations: ConversationWithUser[]) => void;
  setMessages: (messages: MessageWithUser[]) => void;
  selectConversation: (conversation: ConversationWithUser | null) => void;
  setLoading: (loading: boolean) => void;
  setUnreadCount: (count: number) => void;
  clearError: () => void;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export function MessageProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(messageReducer, initialState);

  const setConversations = (conversations: ConversationWithUser[]) => {
    dispatch({ type: 'SET_CONVERSATIONS', payload: conversations });
  };

  const setMessages = (messages: MessageWithUser[]) => {
    dispatch({ type: 'SET_MESSAGES', payload: messages });
  };

  const selectConversation = (conversation: ConversationWithUser | null) => {
    dispatch({ type: 'SELECT_CONVERSATION', payload: conversation });
  };

  const setLoading = (loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };

  const setUnreadCount = (count: number) => {
    dispatch({ type: 'SET_UNREAD_COUNT', payload: count });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  return (
    <MessageContext.Provider value={{
      state,
      setConversations,
      setMessages,
      selectConversation,
      setLoading,
      setUnreadCount,
      clearError
    }}>
      {children}
    </MessageContext.Provider>
  );
}

export function useMessage() {
  const context = useContext(MessageContext);
  if (context === undefined) {
    throw new Error('useMessage must be used within a MessageProvider');
  }
  return context;
}