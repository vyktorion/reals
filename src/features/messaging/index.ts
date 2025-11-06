// Feature: Messaging
// Real-time messaging system for agent-client communication
// Feature Sliced Design - Messaging layer

export { } from './ui';
export { } from './api';
export { } from './model';

// Feature metadata
export const messagingFeature = {
  name: 'messaging',
  description: 'Real-time messaging system for agent-client communication',
  version: '1.0.0',
  status: 'planned'
} as const;