/* eslint-disable @typescript-eslint/no-explicit-any */
import { Input } from 'antd';
import ErrorText from '../ui/ErrorText';
import { useTranslation } from '@/hooks/translation';
import { JSX } from 'react';

const StandartInput = <T,>({
  title,
  error,
  handleInputChange,
  placeHolder,
  errorText,
  type = 'text',
  field,
  regex,
  value,
  autocomplete = 'new-password',
  size = 'large',
  variant = 'outlined',
  disabled = false,
  readonly = false,
  wraperClassName,
  titleIcon,
  titleStyle,
  sizing = {
    title: 'w-full',
    input: 'w-full'
  }
}: {
  title: { uz: string; ru: string; en: string };
  error: boolean | undefined;
  handleInputChange: (
    field: keyof T,
    value: any | ((prevField?: T[keyof T]) => T[keyof T])
  ) => void;
  placeHolder: { uz: string; ru: string; en: string };
  errorText: string;
  type?: 'text' | 'password' | 'email';
  field: keyof T;
  value: any;
  regex?: RegExp;
  autocomplete?: 'new-password' | 'new-fieldName';
  size?: 'large' | 'small' | 'middle';
  variant?: 'outlined' | 'filled' | 'borderless';
  disabled?: boolean;
  readonly?: boolean;
  wraperClassName?: string;
  titleIcon?: JSX.Element;
  titleStyle?: {
    position?: 'left' | 'right' | 'top' | 'bottom';
    fontSize?: string;
    fontWeight?: string;
    hiddem?: boolean;
  };
  sizing?: {
    title: string;
    input: string;
  };
}) => {
  const t = useTranslation();
  const InputComponent = type === 'password' ? Input.Password : Input;

  return (
    <form autoComplete="new-fieldName">
      <div
        className={`items-center gap-2 ${wraperClassName} ${
          titleStyle
            ? titleStyle.position === 'top'
              ? 'flex flex-col'
              : titleStyle.position === 'bottom'
              ? 'flex flex-col-reverse'
              : titleStyle.position === 'right'
              ? 'flex'
              : 'flex flex-row-reverse'
            : ''
        }`}
      >
        <div
          className={`${sizing.title} flex justify-start items-center gap-2`}
          style={{
            fontSize: titleStyle?.fontSize,
            fontWeight: titleStyle?.fontWeight,
            display: titleStyle?.hiddem ? 'none' : 'flex'
          }}
        >
          {titleIcon}
          {title ? t(title) : ''}
        </div>

        <div className={sizing.input}>
          <InputComponent
            variant={variant}
            name={field as string}
            value={value}
            size={size}
            type={type}
            status={error ? 'error' : ''}
            disabled={disabled}
            readOnly={readonly}
            onChange={(e) => {
              const value2 = e.target.value;
              if (regex) {
                handleInputChange(field, value2.replace(regex, ''));
              } else {
                handleInputChange(field, value2);
              }
            }}
            placeholder={t(placeHolder) as string}
            autoComplete={autocomplete}
            className="text-16px "
          />
          <ErrorText error={error} message={errorText} />
        </div>
      </div>
    </form>
  );
};

export default StandartInput;
