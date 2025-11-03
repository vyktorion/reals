'use client'

import { PostProperty } from '../../components/PostProperty'
import { useRouter } from 'next/navigation'

export default function Post() {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  return (
    <PostProperty onClose={handleGoBack} />
  );
}