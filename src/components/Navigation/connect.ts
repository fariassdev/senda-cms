import { BookOpenIcon, HomeIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';

import { useAuthStore } from '@/stores/authStore';

export default function useConnect() {
  const pathname = usePathname();
  const { user, clearAuth } = useAuthStore();

  const navigationItems = [
    {
      title: 'Dashboard',
      url: '/',
      icon: HomeIcon,
    },
    {
      title: 'Courses',
      url: '/courses',
      icon: BookOpenIcon,
    },
  ];

  const handleLogout = () => {
    clearAuth();
  };

  return {
    pathname,
    user,
    navigationItems,
    handleLogout,
  };
}
