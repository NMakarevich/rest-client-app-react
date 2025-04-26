'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { FirebaseError } from '@firebase/app';
import { yupResolver } from '@hookform/resolvers/yup';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

import { ProtectedRoutes } from '@/components/protected-routes';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth-context';
import { useRouter } from '@/i18n/navigation';
import { auth } from '@/lib/firebase';
import { SignUpFormData, useValidationSchemas } from '@/lib/validation-auth';

export default function SignUpPage() {
  const t = useTranslations('auth');
  const router = useRouter();
  const { signUpSchema } = useValidationSchemas();
  const { setAuthError } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setError,
  } = useForm<SignUpFormData>({
    resolver: yupResolver(signUpSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: SignUpFormData) => {
    setIsSubmitting(true);
    setAuthError(null);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      await updateProfile(userCredential.user, {
        displayName: data.displayName,
      });

      router.push('/');
    } catch (error) {
      console.error('Auth error:', error);
      if (error instanceof FirebaseError) {
        if (error.code === 'auth/email-already-in-use')
          setError('root', {
            type: 'manual',
            message: t('errors.auth/email-already-in-use'),
          });
        else
          setError('root', {
            type: 'manual',
            message: t('errors.auth_failed'),
          });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ProtectedRoutes>
      <div className="flex flex-col h-full gap-4 items-center justify-center p-4">
        <h2 className="text-3xl my-4">{t('signUpTitle')}</h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-md space-y-4"
          noValidate
        >
          <div className="h-20">
            <label htmlFor="displayName" className="block mb-1">
              {t('displayName')}
            </label>
            <input
              id="displayName"
              type="text"
              {...register('displayName')}
              className="w-full p-2 border rounded"
              disabled={isSubmitting}
            />
            {errors.displayName && (
              <p className="text-red-500 text-sm">
                {errors.displayName.message}
              </p>
            )}
          </div>

          <div className="h-20">
            <label htmlFor="email" className="block mb-1">
              {t('email')}
            </label>
            <input
              id="email"
              type="email"
              {...register('email')}
              className="w-full p-2 border rounded"
              disabled={isSubmitting}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          <div className="relative">
            <label htmlFor="password" className="block mb-1">
              {t('password')}
            </label>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              {...register('password')}
              className="w-full p-2 border rounded"
              disabled={isSubmitting}
            />
            <button
              type="button"
              className="absolute right-4 top-10"
              onClick={togglePasswordVisibility}
              disabled={isSubmitting}
              data-testid="eye"
              name="eye"
            >
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </button>
            <p className="py-1 text-red-500 text-sm min-h-[60px]">
              {errors.password && errors.password.message}
            </p>
          </div>

          <Button
            type="submit"
            className="w-full text-xl bg-lime-300 text-black rounded hover:bg-lime-400"
            disabled={isSubmitting || !isValid}
          >
            {t('signUp')}
          </Button>
        </form>

        <div className="flex flex-wrap max-w-md w-full gap-1 italic justify-end text-sm">
          {t('signUp_description_part1')}
          <Link
            href="/signin"
            className="text-blue-600 underline cursor-pointer hover:text-lime-300"
          >
            {t('signUp_description_part2')}
          </Link>
        </div>
        {errors.root && <p className="text-red-500">{errors.root.message}</p>}
      </div>
    </ProtectedRoutes>
  );
}
