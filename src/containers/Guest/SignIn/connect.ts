import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { $publicApi } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import { validationSchema } from './constants';
import type { LoginFormData } from './types';

const useConnect = () => {
  const router = useRouter();
  const { setAuth } = useAuthStore();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  // Use the auto-generated mutation hook for login
  const loginMutation = $publicApi.useMutation('post', '/api/auth/login', {
    onSuccess: (response) => {
      // Calculate expiration timestamp if expires_in is provided
      let expiresAt: number | undefined;
      if (response.expires_in) {
        expiresAt = Date.now() + response.expires_in * 1000;
      }

      // Store auth data in Zustand store
      setAuth(
        response.user,
        response.access_token,
        response.refresh_token,
        expiresAt,
      );

      // Redirect to the courses page
      router.push('/courses');
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    loginMutation.mutate({
      body: {
        username: data.username,
        password: data.password,
        scope: '',
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
  };

  return {
    isLoading: loginMutation.isPending,
    error: loginMutation.error
      ? loginMutation.error instanceof Error
        ? loginMutation.error.message
        : 'Login failed'
      : null,
    form,
    onSubmit,
  };
};

export default useConnect;
