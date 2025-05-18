import { useLang } from '@/providers/LangProvider';
import { JSX } from 'react';

export const useTranslation = () => {
  const { lang } = useLang();
  return (dict: Record<'uz' | 'ru' | 'en', string | JSX.Element>) =>
    dict[lang as keyof typeof dict];
};
