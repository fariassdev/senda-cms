import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { login, storeLoginResponse } from '@/lib/auth';
import { validationSchema } from './constants';
import type { LoginFormData } from './types';

const useConnect = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      // Call the login API
      const response = await login({
        email: data.email,
        password: data.password,
      });

      // Store auth data with proper token expiration handling
      storeLoginResponse(response);

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
