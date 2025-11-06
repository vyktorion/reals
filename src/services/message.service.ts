import apiClient from './api';
import { Message } from '@/types/message.types';

export interface SendMessageData {
  conversationId: string;
  content: string;
  type: 'text' | 'image' | 'file' | 'property_link';
  attachments?: string[];
  recipientId: string;
}

export interface MessageFilters {
  conversationId?: string;
  senderId?: string;
  type?: 'text' | 'image' | 'file' | 'property_link';
  dateFrom?: string;
  dateTo?: string;
  read?: boolean;
}

export interface MessageListResponse {
  messages: Message[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

class MessageService {
  async getMessages(filters: MessageFilters = {}, page = 1, limit = 20): Promise<MessageListResponse> {
    try {
      const params = new URLSearchParams();
      if (filters.conversationId) params.append('conversationId', filters.conversationId);
      if (filters.senderId) params.append('senderId', filters.senderId);
      if (filters.type) params.append('type', filters.type);
      if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
      if (filters.dateTo) params.append('dateTo', filters.dateTo);
      if (filters.read !== undefined) params.append('read', filters.read.toString());
      params.append('page', page.toString());
      params.append('limit', limit.toString());

      const queryString = params.toString();
      const url = `/api/messages?${queryString}`;
      
      const response = await apiClient.get<MessageListResponse>(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching messages:', error);
      return {
        messages: [],
        total: 0,
        page: 1,
        limit: 20,
        hasMore: false,
      };
    }
  }

  async getMessage(id: string): Promise<Message | null> {
    try {
      const response = await apiClient.get<Message>(`/api/messages/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching message:', error);
      return null;
    }
  }

  async sendMessage(data: SendMessageData): Promise<Message | null> {
    try {
      const response = await apiClient.post<Message>('/api/messages', data);
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      return null;
    }
  }

  async markAsRead(messageId: string): Promise<boolean> {
    try {
      await apiClient.patch(`/api/messages/${messageId}/read`);
      return true;
    } catch (error) {
      console.error('Error marking message as read:', error);
      return false;
    }
  }

  async markConversationAsRead(conversationId: string, userId: string): Promise<boolean> {
    try {
      await apiClient.patch(`/api/conversations/${conversationId}/read`, { userId });
      return true;
    } catch (error) {
      console.error('Error marking conversation as read:', error);
      return false;
    }
  }

  async deleteMessage(messageId: string): Promise<boolean> {
    try {
      await apiClient.delete(`/api/messages/${messageId}`);
      return true;
    } catch (error) {
      console.error('Error deleting message:', error);
      return false;
    }
  }

  async editMessage(messageId: string, newContent: string): Promise<Message | null> {
    try {
      const response = await apiClient.patch<Message>(`/api/messages/${messageId}`, {
        content: newContent,
        edited: true,
      });
      return response.data;
    } catch (error) {
      console.error('Error editing message:', error);
      return null;
    }
  }

  async getUnreadCount(userId: string): Promise<number> {
    try {
      const response = await apiClient.get<{ count: number }>(`/api/messages/unread-count?userId=${userId}`);
      return response.data.count;
    } catch (error) {
      console.error('Error fetching unread count:', error);
      return 0;
    }
  }

  async getRecentMessages(userId: string, limit = 10): Promise<Message[]> {
    try {
      const response = await apiClient.get<Message[]>(`/api/messages/recent?userId=${userId}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching recent messages:', error);
      return [];
    }
  }

  async searchMessages(query: string, userId: string): Promise<Message[]> {
    try {
      const response = await apiClient.get<Message[]>(`/api/messages/search?q=${encodeURIComponent(query)}&userId=${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error searching messages:', error);
      return [];
    }
  }

  async getConversationMessages(conversationId: string, page = 1, limit = 50): Promise<Message[]> {
    try {
      const response = await apiClient.get<Message[]>(
        `/api/conversations/${conversationId}/messages?page=${page}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching conversation messages:', error);
      return [];
    }
  }

  async uploadAttachment(file: File): Promise<string | null> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await apiClient.post<{ url: string }>('/api/messages/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.url;
    } catch (error) {
      console.error('Error uploading attachment:', error);
      return null;
    }
  }

  // Mock data for development
  mockGetMessages(conversationId: string): Message[] {
    const now = new Date('2024-01-15');
    return [
      {
        id: '1',
        conversationId,
        senderId: '1',
        recipientId: '2',
        content: 'Hello! I am interested in this property. When can we schedule a viewing?',
        messageType: 'text',
        createdAt: new Date('2024-01-15T10:30:00Z'),
        updatedAt: new Date('2024-01-15T10:30:00Z'),
      },
      {
        id: '2',
        conversationId,
        senderId: '2',
        recipientId: '1',
        content: 'Thank you for your interest! I can show you the property tomorrow at 2 PM. Would that work for you?',
        messageType: 'text',
        createdAt: new Date('2024-01-15T11:15:00Z'),
        updatedAt: new Date('2024-01-15T11:15:00Z'),
      },
    ];
  }
}

export const messageService = new MessageService();
export default messageService;