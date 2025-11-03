'use client'

import { ProfilePage } from '../../components/ProfilePage'
import { useApp } from '../../contexts/AppContext'
import { useRouter } from 'next/navigation'

export default function Profile() {
  const { favorites } = useApp();
  const router = useRouter();

  const handleNavigateToSavedSearches = () => {
    router.push('/saved-searches');
  };

  const handleNavigateToNotifications = () => {
    router.push('/notifications');
  };

  return (
    <ProfilePage
      favoriteCount={favorites.length}
      onNavigateToSavedSearches={handleNavigateToSavedSearches}
      onNavigateToNotifications={handleNavigateToNotifications}
    />
  );
}