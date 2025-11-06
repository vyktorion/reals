# Quick Fix Guide - Critical Issues

## 1. Fix TypeScript Errors (Copy-Paste Ready)

### Fix auth hook import error:
```typescript
// In src/hooks/auth/useAuth.ts, line 2
// FROM:
import { useLocalStorage } from './useLocalStorage';

// TO:
import { useLocalStorage } from '../useLocalStorage';
```

### Fix User type in auth service:
```typescript
// In src/services/auth.service.ts, around line 136
// Add this to User interface or use existing property
const mockUser: User = {
  // ... existing properties
  firstName: 'John',  // Remove this line or update User type
};
```

### Fix conversation roles:
```typescript
// In src/services/conversation.service.ts, lines 153, 159
// FROM:
role: 'Proprietar',  // or 'Agent'

// TO:
role: 'owner',       // or 'admin' or 'member'
```

### Fix message service:
```typescript
// In src/services/message.service.ts, lines 188, 199
// Remove these lines or update Message type
senderName: 'John Anderson',  // Remove this line
```

### Fix date types:
```typescript
// In src/services/conversation.service.ts, lines 168, 172-173
// FROM:
timestamp: '2024-01-15T10:30:00Z',
unreadCount: 2,
createdAt: '2024-01-10T09:00:00Z',
updatedAt: '2024-01-15T10:30:00Z',

// TO:
timestamp: new Date('2024-01-15T10:30:00Z'),
unreadCount: { userId: 2 },
createdAt: new Date('2024-01-10T09:00:00Z'),
updatedAt: new Date('2024-01-15T10:30:00Z'),
```

## 2. Remove Duplicate Files (Safe to Delete)

These files are exact duplicates and can be safely removed:

- `src/components/ContactForm.tsx` (keep forms version)
- `src/components/EditProperty.tsx` (keep forms version)  
- `src/components/Onboarding.tsx` (keep forms version)
- `src/components/MapView.tsx` (keep map version)
- `src/hooks/useAuth.ts` (keep auth version)
- `src/hooks/useDebounce.ts` (keep search version)
- `src/hooks/useDevice.ts` (keep ui version)
- `src/hooks/use-mobile.ts` (keep ui version)

## 3. Fix PropertyCard Conflict

Choose ONE version to keep:
- `src/components/PropertyCard.tsx` (more features, complex)
- `src/components/property/PropertyCard.tsx` (simpler, modern)

Update all imports to use the chosen version.

## 4. Test After Fixes

Run these commands to verify fixes:
```bash
npm run build
npx tsc --noEmit --skipLibCheck
```

## Time Estimate
- TypeScript errors: 30 minutes
- Remove duplicates: 15 minutes
- Update imports: 45 minutes
- Testing: 30 minutes

**Total: ~2 hours**