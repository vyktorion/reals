import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '../components/ThemeProvider'
import { AppProvider } from '../contexts/AppContext'
import { Toaster } from '../components/ui/sonner'
import { LayoutContent } from '../components/LayoutContent'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'LuxeEstate - Premium Properties',
  description: 'Discover your dream property with LuxeEstate',
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AppProvider>
            <LayoutContent>
              {children}
            </LayoutContent>
            <Toaster />
          </AppProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}