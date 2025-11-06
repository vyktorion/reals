// API Types - Centralized API response and request types

import { Property } from './property.types';
import { User } from './user.types';
import { AuthUser } from './auth.types';
import { Message } from './message.types';
import { Conversation } from './conversation.types';
import { UploadedFile } from './upload.types';

// Base API response
export interface ApiResponse<T = unknown> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
  timestamp: string;
  requestId?: string;
}

// Paginated response
export interface PaginatedResponse<T = unknown> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// API error response
export interface ApiError {
  success: false;
  error: string;
  errorCode?: string;
  details?: Record<string, unknown>;
  timestamp: string;
  requestId?: string;
}

// Request types
export interface ApiRequest {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean>;
  query?: Record<string, string | number | boolean>;
  body?: Record<string, unknown>;
  timeout?: number;
}

// Authentication API
export interface AuthApiRequest {
  email: string;
  password: string;
  remember?: boolean;
}

export type AuthApiResponse = ApiResponse<{
  user: AuthUser;
  token: string;
  refreshToken: string;
  expiresIn: number;
}>;

// User API
export interface UserApiRequest {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export type UserApiResponse = PaginatedResponse<User>;

// Property API
export interface PropertyApiRequest {
  page?: number;
  limit?: number;
  search?: string;
  type?: 'sale' | 'rent' | 'hotel';
  status?: string;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  bedrooms?: number;
  bathrooms?: number;
  minArea?: number;
  maxArea?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  featured?: boolean;
}

export type PropertyApiResponse = PaginatedResponse<Property>;

// Favorite API
export interface FavoriteApiRequest {
  propertyId: string;
}

export type FavoriteApiResponse = ApiResponse<{
  id: string;
  userId: string;
  propertyId: string;
  createdAt: string;
}>;

// Notification API
export interface NotificationApiRequest {
  page?: number;
  limit?: number;
  type?: string;
  read?: boolean;
  dateRange?: {
    start: string;
    end: string;
  };
}

export type NotificationApiResponse = PaginatedResponse<{
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  data?: Record<string, unknown>;
  createdAt: string;
}>;

// Message API
export interface MessageApiRequest {
  conversationId?: string;
  recipientId?: string;
  content: string;
  messageType?: 'text' | 'image' | 'file' | 'property';
  propertyId?: string;
  attachments?: File[];
}

export type MessageApiResponse = ApiResponse<Message>;

// Conversation API
export interface ConversationApiRequest {
  participantIds: string[];
  propertyId?: string;
  type?: 'direct' | 'property' | 'group';
  initialMessage?: string;
}

export type ConversationApiResponse = ApiResponse<Conversation>;

// Upload API
export interface UploadApiRequest {
  files: File[];
  type?: 'property_image' | 'property_document' | 'user_avatar';
  propertyId?: string;
  metadata?: Record<string, unknown>;
}

export type UploadApiResponse = ApiResponse<{
  files: UploadedFile[];
  totalSize: number;
}>;

// Search API
export interface SearchApiRequest {
  query: string;
  type?: 'properties' | 'users' | 'conversations';
  filters?: Record<string, unknown>;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export type SearchApiResponse = PaginatedResponse<unknown>;

// Statistics API
export interface StatsApiRequest {
  type: 'properties' | 'users' | 'messages' | 'uploads';
  dateRange?: {
    start: string;
    end: string;
  };
  filters?: Record<string, unknown>;
}

export type StatsApiResponse = ApiResponse<{
  total: number;
  today: number;
  thisWeek: number;
  thisMonth: number;
  growth: number; // percentage
  breakdown?: Record<string, number>;
}>;

// WebSocket types
export interface WebSocketMessage {
  type: 'message' | 'notification' | 'status' | 'typing';
  data: unknown;
  timestamp: string;
  userId?: string;
  roomId?: string;
}

// Real-time events
export interface RealTimeEvent {
  event: string;
  data: unknown;
  timestamp: string;
  userId: string;
  sessionId?: string;
}

// API middleware
export interface ApiMiddleware {
  onRequest?: (config: ApiRequest) => ApiRequest | Promise<ApiRequest>;
  onResponse?: (response: unknown) => unknown;
  onError?: (error: unknown) => unknown;
}

// API configuration
export interface ApiConfig {
  baseURL: string;
  timeout: number;
  retries: number;
  retryDelay: number;
  headers: Record<string, string>;
  middlewares: ApiMiddleware[];
  authentication: {
    type: 'bearer' | 'api-key' | 'oauth';
    token?: string;
    refreshToken?: string;
  };
}

// Rate limiting
export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number;
  retryAfter?: number;
}

// Health check
export interface HealthCheckResponse {
  status: 'healthy' | 'unhealthy' | 'degraded';
  timestamp: string;
  uptime: number;
  version: string;
  services: {
    database: 'healthy' | 'unhealthy';
    cache: 'healthy' | 'unhealthy';
    storage: 'healthy' | 'unhealthy';
    email: 'healthy' | 'unhealthy';
    push: 'healthy' | 'unhealthy';
  };
}