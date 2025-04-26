'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { yupResolver } from '@hookform/resolvers/yup';
import { AlertCircle, Edit2, Save, SendHorizontal, Trash2 } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LOCAL_STORAGE_KEYS } from '@/constants/constants';
import useLocalStorage from '@/hooks/local_storage';
import { Variable, VariableItemProps } from '@/types/types';

import { editValidationSchema } from './variable_validation_shema';

export const VariableItem: React.FC<VariableItemProps> = ({
  variable,
  variables,
  setVariables,
}) => {
  const [_localStorageVariables, setLocalStorageVariables] = useLocalStorage<
    Variable[]
  >(LOCAL_STORAGE_KEYS.VARIABLES, []);
  const [isEditing, setIsEditing] = useState(false);
  const t = useTranslations('variablesPage');

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(editValidationSchema),
    mode: 'onChange',
  });

  const toggleEdit = () => {
    setIsEditing(true);
    setValue('name', variable.name);
    setValue('value', variable.value);
  };

  const deleteVar = () => {
    const updatedVariables = variables.filter(
      (item) => item.id !== variable.id
    );
    setLocalStorageVariables(updatedVariables);
    setVariables(updatedVariables);
  };

  const onSubmit = (data: { name: string; value: string }) => {
    const updatedVariables = variables.map((item) =>
      item.id === variable.id
        ? { ...item, name: data.name, value: data.value }
        : item
    );
    if (
      updatedVariables.filter((variable) => variable.name === data.name)
        .length === 1
    ) {
      setLocalStorageVariables(updatedVariables);
      setVariables(updatedVariables);
      setIsEditing(false);
    } else {
      setError('name', { message: 'varNameExist' });
    }
  };

  return (
    <div key={variable.id} className="flex items-center gap-2 w-full">
      {isEditing ? (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-1 w-full"
        >
          <div className="flex items-center gap-2">
            <SendHorizontal />
            <Input
              placeholder="Name"
              {...register('name')}
              className="bg-white"
            />
            <Input
              placeholder="Value"
              {...register('value')}
              className="bg-white"
            />
            <Button
              className="max-w-[100px] bg-amber-200 hover:bg-lime-200"
              type="submit"
              variant="outline"
              data-testid="save-button"
            >
              <Save />
            </Button>
            <Button
              className="max-w-[100px] bg-secondary-rose hover:bg-red-400"
              type="button"
              variant="outline"
              onClick={() => setIsEditing(false)}
            >
              <Trash2 />
            </Button>
          </div>
          <div className="flex flex-col gap-1">
            {errors.name && (
              <Alert variant="destructive" id="name-error">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>{t('error')}</AlertTitle>
                <AlertDescription>
                  {errors.name.message && t(errors.name.message)}
                </AlertDescription>
              </Alert>
            )}
            {errors.value && (
              <Alert variant="destructive" id="value-error">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>{t('error')}</AlertTitle>
                <AlertDescription>
                  {errors.value.message && t(errors.value.message)}
                </AlertDescription>
              </Alert>
            )}
          </div>
        </form>
      ) : (
        <>
          <SendHorizontal />
          <Input value={variable.name} disabled className="bg-white" />
          <Input value={variable.value} disabled className="bg-white" />
          <Button
            className="max-w-[100px] bg-amber-200 hover:bg-lime-200"
            type="button"
            variant="outline"
            onClick={toggleEdit}
            data-testid="edit-button"
          >
            <Edit2 />
          </Button>
          <Button
            className="max-w-[100px] bg-secondary-rose hover:bg-red-400"
            type="button"
            variant="outline"
            onClick={deleteVar}
            data-testid="delete-button"
          >
            <Trash2 />
          </Button>
        </>
      )}
    </div>
  );
};
