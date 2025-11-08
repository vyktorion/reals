// Conversation Types - From reference repository


export interface Conversation {
  id: string;
  participants: ConversationParticipant[];
  propertyId?: string;
  type: 'direct' | 'property' | 'group';
  status: 'active' | 'archived' | 'blocked';
  lastMessage?: ConversationMessage;
  unreadCount: { [userId: string]: number };
  metadata: {
    propertyTitle?: string;
    propertyPrice?: number;
    meetingType?: 'virtual' | 'in-person';
    scheduledTime?: Date;
    location?: string;
  };
  settings: {
    notifications: boolean;
    autoArchive: boolean;
    allowedHours?: {
      start: string; // "09:00"
      end: string;   // "18:00"
    };
  };
  createdAt: Date;
  updatedAt: Date;
  archivedAt?: Date;
  pinnedBy?: string[];
}

// Conversation participant
export interface ConversationParticipant {
  userId: string;
  role: 'owner' | 'member' | 'admin';
  joinedAt: Date;
  lastReadAt: Date;
  isActive: boolean;
  permissions: {
    canMessage: boolean;
    canAddMembers: boolean;
    canRemoveMembers: boolean;
    canArchive: boolean;
  };
}

// Conversation with extended info
export interface ConversationWithUser extends Conversation {
  participants: (ConversationParticipant & {
    user: {
      id: string;
      name: string;
      avatar?: string;
      role: string;
      online?: boolean;
    };
  })[];
  messages: ConversationMessage[];
  property?: {
    id: string;
    title: string;
    price: number;
    images: string[];
    location: string;
  };
  isPinned: boolean;
  isArchived: boolean;
}

// Simplified message for conversations
export interface ConversationMessage {
  id: string;
  senderId: string;
  content: string;
  messageType: 'text' | 'image' | 'file' | 'property' | 'system' | 'meeting';
  createdAt: Date;
  readBy: string[];
  attachments?: {
    id: string;
    fileName: string;
    fileType: string;
    fileUrl: string;
  }[];
}

// Conversation creation
export interface ConversationCreate {
  participantIds: string[];
  propertyId?: string;
  initialMessage?: string;
  type?: 'direct' | 'property' | 'group';
  meetingType?: 'virtual' | 'in-person';
  scheduledTime?: Date;
  location?: string;
}

// Conversation search
export interface ConversationSearch {
  userId?: string;
  propertyId?: string;
  type?: 'direct' | 'property' | 'group';
  status?: 'active' | 'archived' | 'blocked';
  hasUnread?: boolean;
  dateRange?: {
    start: Date;
    end: Date;
  };
  limit?: number;
  page?: number;
  sortBy?: 'lastActivity' | 'created' | 'unreadCount';
  sortOrder?: 'asc' | 'desc';
}

// Conversation list response
export interface ConversationListResponse {
  conversations: ConversationWithUser[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
  unreadTotal: number;
}

// Conversation update
export interface ConversationUpdate {
  status?: 'active' | 'archived' | 'blocked';
  settings?: Partial<Conversation['settings']>;
  metadata?: Partial<Conversation['metadata']>;
}

// Conversation member management
export interface ConversationMember {
  userId: string;
  role: 'owner' | 'member' | 'admin';
  permissions: {
    canMessage: boolean;
    canAddMembers: boolean;
    canRemoveMembers: boolean;
    canArchive: boolean;
  };
}

export interface ConversationMemberUpdate {
  userId: string;
  role?: 'owner' | 'member' | 'admin';
  permissions?: Partial<ConversationMember['permissions']>;
  isActive?: boolean;
}

// Conversation statistics
export interface ConversationStats {
  totalConversations: number;
  activeConversations: number;
  archivedConversations: number;
  totalUnreadMessages: number;
  averageResponseTime: number; // in minutes
  mostActiveConversations: {
    conversationId: string;
    messageCount: number;
  }[];
  lastActivityAt: Date;
}

// Conversation error handling
export interface ConversationError {
  code: 'USER_NOT_FOUND' | 'PROPERTY_NOT_FOUND' | 'PERMISSION_DENIED' | 'INVALID_PARTICIPANTS';
  message: string;
  details?: {
    code?: string;
    field?: string;
    value?: unknown;
  };
}

// Real-time conversation updates
export interface ConversationUpdateEvent {
  type: 'message' | 'member_added' | 'member_removed' | 'status_changed' | 'archived';
  conversationId: string;
  data: {
    message?: {
      id: string;
      content: string;
      senderId: string;
    };
    member?: {
      userId: string;
      role: string;
    };
    status?: string;
    conversation?: {
      id: string;
      status: string;
    };
  };
  timestamp: Date;
  userId: string;
}