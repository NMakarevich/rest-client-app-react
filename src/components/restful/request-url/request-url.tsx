'use client';

import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { yupResolver } from '@hookform/resolvers/yup';

import { schema } from '@/components/restful/request-url/schema';
import { Input } from '@/components/ui/input';
import { useVariables } from '@/hooks/use-variables';
import { updateUrl } from '@/utils/request-url';

export function RequestUrl({ url }: { url: string }) {
  const {
    register,
    getValues,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues: { API_URL: url },
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  const { insertVariables } = useVariables();

  const t = useTranslations('restfulPage');

  const handleBlur = useCallback(() => {
    const { target, isAllInserted } = insertVariables(
      getValues('API_URL') as string
    );
    const url = URL.parse(target);
    if (!isAllInserted || !url) {
      setError('API_URL', { message: 'urlError' });
      return;
    } else clearErrors();
    const newUrl = updateUrl({
      apiUrl: target,
    });
    window.history.replaceState(null, '', newUrl);
  }, [clearErrors, getValues, insertVariables, setError]);

  return (
    <div className={'flex flex-col flex-1 relative w-full'}>
      <Input
        className={'primary-color-component-bg'}
        type={'text'}
        placeholder={'API URL'}
        {...register('API_URL', { onBlur: handleBlur })}
      />
      <span
        className={
          'absolute top-[40px] left-[10px] min-h-[14px] text-[14px] text-(--color-destructive)'
        }
      >
        {errors.API_URL?.message && t(errors.API_URL.message)}
      </span>
    </div>
  );
}
