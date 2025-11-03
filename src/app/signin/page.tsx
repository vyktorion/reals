'use client'

import { AuthPage } from '../../features/auth/components/AuthPage'
import { useApp } from '../../contexts/AppContext'
import { useRouter } from 'next/navigation'

export default function SignIn() {
  const { setIsAuthenticated } = useApp();
  const router = useRouter();

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    router.push('/');
  };

  return (
    <AuthPage onAuthSuccess={handleAuthSuccess} />
  );
}