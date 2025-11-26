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
      email: '',
      password: '',
    },
  });

  // Use the auto-generated mutation hook for login
  const loginMutation = $publicApi.useMutation('post', '/api/users/login', {
    onSuccess: (response) => {
      // Store auth data in Zustand store
      setAuth(response.user, response.user.token);

      // Redirect to the courses page
      router.push('/courses');
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    loginMutation.mutate({
      body: {
        user: {
          email: data.email,
          password: data.password,
        },
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
