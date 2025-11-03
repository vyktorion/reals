'use client'

import { NotificationsCenter } from '../../components/NotificationsCenter'
import { useRouter } from 'next/navigation'

export default function Notifications() {
  const router = useRouter();

  const handleViewProperty = (id: string) => {
    router.push(`/property/${id}`);
  };

  return (
    <NotificationsCenter onViewProperty={handleViewProperty} />
  );
}