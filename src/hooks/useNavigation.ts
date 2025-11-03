import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';

export interface NavigationState {
  currentPath: string;
  previousPath: string | null;
  isLoading: boolean;
}

export function useNavigation() {
  const router = useRouter();
  const pathname = usePathname();

  const navigateTo = (path: string) => {
    router.push(path);
  };

  const navigateBack = () => {
    router.back();
  };

  const navigateToHome = () => {
    navigateTo('/');
  };

  const navigateToSearch = (query?: string) => {
    const path = query ? `/search?q=${encodeURIComponent(query)}` : '/search';
    navigateTo(path);
  };

  const navigateToProperty = (id: string) => {
    navigateTo(`/property/${id}`);
  };

  const navigateToProfile = () => {
    navigateTo('/profile');
  };

  const navigateToSignIn = () => {
    navigateTo('/signin');
  };

  const navigateToSignUp = () => {
    navigateTo('/signin?isSignUp=true');
  };

  const navigateToFavorites = () => {
    navigateTo('/favorites');
  };

  const navigateToSavedSearches = () => {
    navigateTo('/saved-searches');
  };

  const navigateToNotifications = () => {
    navigateTo('/notifications');
  };

  const navigateToPostProperty = () => {
    navigateTo('/post');
  };

  return {
    currentPath: pathname,
    navigateTo,
    navigateBack,
    navigateToHome,
    navigateToSearch,
    navigateToProperty,
    navigateToProfile,
    navigateToSignIn,
    navigateToSignUp,
    navigateToFavorites,
    navigateToSavedSearches,
    navigateToNotifications,
    navigateToPostProperty,
  };
}