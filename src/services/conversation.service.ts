import apiClient from './api';
import { Conversation } from '@/types/conversation.types';

export interface CreateConversationData {
  participantId: string;
  propertyId?: string;
  initialMessage?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  timestamp: string;
  read: boolean;
  type: 'text' | 'image' | 'file' | 'property_link';
  attachments?: string[];
}

export interface ConversationFilters {
  participantId?: string;
  propertyId?: string;
  unreadOnly?: boolean;
}

class ConversationService {
  async getConversations(filters: ConversationFilters = {}): Promise<Conversation[]> {
    try {
      const params = new URLSearchParams();
      if (filters.participantId) params.append('participantId', filters.participantId);
      if (filters.propertyId) params.append('propertyId', filters.propertyId);
      if (filters.unreadOnly) params.append('unreadOnly', 'true');

      const queryString = params.toString();
      const url = `/api/conversations${queryString ? `?${queryString}` : ''}`;
      
      const response = await apiClient.get<Conversation[]>(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching conversations:', error);
      return [];
    }
  }

  async getConversation(id: string): Promise<Conversation | null> {
    try {
      const response = await apiClient.get<Conversation>(`/api/conversations/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching conversation:', error);
      return null;
    }
  }

  async createConversation(data: CreateConversationData): Promise<Conversation | null> {
    try {
      const response = await apiClient.post<Conversation>('/api/conversations', data);
      return response.data;
    } catch (error) {
      console.error('Error creating conversation:', error);
      return null;
    }
  }

  async deleteConversation(id: string): Promise<boolean> {
    try {
      await apiClient.delete(`/api/conversations/${id}`);
      return true;
    } catch (error) {
      console.error('Error deleting conversation:', error);
      return false;
    }
  }

  async markAsRead(conversationId: string): Promise<boolean> {
    try {
      await apiClient.patch(`/api/conversations/${conversationId}/read`);
      return true;
    } catch (error) {
      console.error('Error marking conversation as read:', error);
      return false;
    }
  }

  async getMessages(conversationId: string, page = 1, limit = 20): Promise<Message[]> {
    try {
      const response = await apiClient.get<Message[]>(
        `/api/conversations/${conversationId}/messages?page=${page}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching messages:', error);
      return [];
    }
  }

  async sendMessage(conversationId: string, content: string, type: 'text' | 'image' | 'file' = 'text'): Promise<Message | null> {
    try {
      const response = await apiClient.post<Message>(`/api/conversations/${conversationId}/messages`, {
        content,
        type,
      });
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      return null;
    }
  }

  async markMessageAsRead(messageId: string): Promise<boolean> {
    try {
      await apiClient.patch(`/api/messages/${messageId}/read`);
      return true;
    } catch (error) {
      console.error('Error marking message as read:', error);
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

  async getUnreadCount(userId: string): Promise<number> {
    try {
      const response = await apiClient.get<{ count: number }>(`/api/conversations/unread-count?userId=${userId}`);
      return response.data.count;
    } catch (error) {
      console.error('Error fetching unread count:', error);
      return 0;
    }
  }

  // Mock data for development
  mockGetConversations(): Conversation[] {
    return [
      {
        id: '1',
        participants: [
          {
            userId: '1',
            role: 'owner',
            joinedAt: new Date('2024-01-10T09:00:00Z'),
            lastReadAt: new Date('2024-01-15T10:00:00Z'),
            isActive: true,
            permissions: {
              canMessage: true,
              canAddMembers: true,
              canRemoveMembers: true,
              canArchive: true,
            },
          },
          {
            userId: '2',
            role: 'member',
            joinedAt: new Date('2024-01-10T09:00:00Z'),
            lastReadAt: new Date('2024-01-14T15:30:00Z'),
            isActive: true,
            permissions: {
              canMessage: true,
              canAddMembers: false,
              canRemoveMembers: false,
              canArchive: false,
            },
          },
        ],
        type: 'property',
        status: 'active',
        propertyId: 'prop1',
        metadata: {
          propertyTitle: 'Modern Villa with Pool',
        },
        lastMessage: {
          id: '1',
          senderId: '2',
          content: 'When can we schedule a viewing?',
          messageType: 'text',
          createdAt: new Date('2024-01-15T10:30:00Z'),
          readBy: ['1'],
        },
        unreadCount: { '2': 1 },
        settings: {
          notifications: true,
          autoArchive: false,
        },
        createdAt: new Date('2024-01-10T09:00:00Z'),
        updatedAt: new Date('2024-01-15T10:30:00Z'),
      },
    ];
  }
}

export const conversationService = new ConversationService();
export default conversationService;