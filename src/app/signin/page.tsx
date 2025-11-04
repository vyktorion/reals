'use client'

import { AuthPage } from '../../features/auth/components/AuthPage'
import { useApp } from '../../contexts/AppContext'

export default function SignIn() {
  const { setIsAuthenticated } = useApp();

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    // Redirect is now handled in AuthPage component
  };

  return (
    <AuthPage onAuthSuccess={handleAuthSuccess} />
  );
}