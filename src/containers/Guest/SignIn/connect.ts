import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { login } from '@/lib/auth';
import { useAuthStore } from '@/stores/authStore';
import { validationSchema } from './constants';
import type { LoginFormData } from './types';

const useConnect = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { setAuth } = useAuthStore();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      // Call the login API
      const response = await login({
        username: data.username,
        password: data.password,
      });

      // Update auth state with user data and token
      setAuth(response.user, response.access_token);

      // Redirect to the courses page (or dashboard)
      router.push('/courses');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, error, form, onSubmit };
};

export default useConnect;
