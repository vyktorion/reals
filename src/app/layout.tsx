import type { Metadata } from "next";
import { Inter } from 'next/font/google'
import "./globals.css";
import { getServerSession } from 'next-auth';
import { authOptions } from '../lib/auth/nextauth';
import ClientLayout from './client-layout';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "LuxeEstate - Premium Properties",
  description: "Discover your dream property with LuxeEstate",
  manifest: "/manifest.json",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#00bfff',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const session = await getServerSession(authOptions);
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ClientLayout session={session}>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}