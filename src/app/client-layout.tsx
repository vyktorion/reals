'use client';

import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from '../components/ThemeProvider';
import { LayoutContent } from '../components/LayoutContent';
import { AppProvider } from '../contexts/AppContext';
import { Toaster } from '../components/ui/sonner';
import { Session } from 'next-auth';

interface ClientLayoutProps {
  children: React.ReactNode;
  session: Session | null;
}

export default function ClientLayout({
  children,
  session,
}: ClientLayoutProps) {
  // Removed unused isMobile state as it's not being used

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <SessionProvider session={session}>
        <div className="min-h-screen bg-background flex flex-col" suppressHydrationWarning={true}>
          <AppProvider>
            <LayoutContent>
              {children}
            </LayoutContent>
          </AppProvider>
          <Toaster />
        </div>
      </SessionProvider>
    </ThemeProvider>
  );
}