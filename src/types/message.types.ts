// Message Types - From reference repository

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  recipientId: string;
  content: string;
  messageType: 'text' | 'image' | 'file' | 'property' | 'system';
  attachments?: MessageAttachment[];
  propertyId?: string;
  readAt?: Date;
  deliveredAt?: Date;
  editedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Message attachment
export interface MessageAttachment {
  id: string;
  messageId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  fileUrl: string;
  thumbnailUrl?: string;
}

// Message composition
export interface MessageComposition {
  conversationId?: string;
  recipientId: string;
  content: string;
  messageType?: 'text' | 'image' | 'file' | 'property';
  propertyId?: string;
  attachments?: File[];
}

// Message with user info
export interface MessageWithUser extends Message {
  sender: {
    id: string;
    name: string;
    avatar?: string;
  };
  recipient: {
    id: string;
    name: string;
    avatar?: string;
  };
  property?: {
    id: string;
    title: string;
    price: number;
    images: string[];
  };
}

// Message search
export interface MessageSearch {
  conversationId?: string;
  userId?: string;
  content?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  messageType?: 'text' | 'image' | 'file' | 'property' | 'system';
  limit?: number;
  page?: number;
}

// Message list response
export interface MessageListResponse {
  messages: MessageWithUser[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Message notification
export interface MessageNotification {
  id: string;
  conversationId: string;
  messageId: string;
  recipientId: string;
  senderId: string;
  content: string;
  propertyId?: string;
  read: boolean;
  createdAt: Date;
}

// Message statistics
export interface MessageStats {
  totalMessages: number;
  unreadMessages: number;
  messagesByType: {
    [key in Message['messageType']]: number;
  };
  averageResponseTime: number; // in minutes
  lastActivityAt: Date;
}

// Message template
export interface MessageTemplate {
  id: string;
  name: string;
  content: string;
  category: 'greeting' | 'followup' | 'closing' | 'custom';
  variables?: string[];
  isActive: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

// Message error handling
export interface MessageError {
  code: 'INVALID_RECIPIENT' | 'MESSAGE_TOO_LONG' | 'ATTACHMENT_TOO_LARGE' | 'PROPERTY_NOT_FOUND';
  message: string;
  details?: {
    code?: string;
    field?: string;
    value?: unknown;
  };
}