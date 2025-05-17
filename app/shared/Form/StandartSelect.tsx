/* eslint-disable @typescript-eslint/no-explicit-any */

import { useInfinityScroll } from '@/hooks/useInfinityScroll';

import { Select } from 'antd';
import ErrorText from '../ui/ErrorText';
import { useTranslation } from '@/hooks/translation';
import { JSX, useEffect } from 'react';
export interface ListOptions {
  filter?: string;
  sort?: string;
  expand?: string;
}
const StandartSelect = <T, A>({
  title,
  error,
  handleInputChange,
  placeHolder,
  errorText,
  field,
  value,
  collectionName,
  apiOptions,
  options: StaticOption,
  wraperClassName,
  size = 'large',
  variant = 'outlined',
  disabled,
  arrow = true,
  allowClear = true,
  optionCallBack,
  titleStyle,
  titleIcon,
  sizing = {
    title: 'w-full',
    select: 'w-full'
  }
}: {
  wraperClassName?: string;
  className?: string;
  labelClassName?: string;
  title?: { uz: string; ru: string; en: string };
  titleIcon?: JSX.Element;
  error: boolean | undefined;
  handleInputChange: <F extends keyof T>(field: F, value: T[F]) => void;
  placeHolder: { uz: string; ru: string; en: string };
  errorText: string;
  field: keyof T;
  value: any;
  options: { label: any; value: any }[];
  collectionName: string;
  apiOptions?: ListOptions;
  size?: 'large' | 'small' | 'middle';
  variant?: 'outlined' | 'filled' | 'borderless';
  arrow?: boolean;
  readonly?: boolean;
  disabled?: boolean;
  StaticOption?: { label: any; value: any }[];
  allowClear?: boolean;
  optionCallBack: (item: A) => { label: JSX.Element | string; value: string };
  titleStyle?: {
    position?: 'left' | 'right' | 'top' | 'bottom';
    fontSize?: string;
    fontWeight?: string;
    hiddem?: boolean;
  };
  sizing?: {
    title: string;
    select: string;
  };
}) => {
  const { ref, data, setSearchText, searchText } = useInfinityScroll<A>(
    collectionName,
    apiOptions
  );

  const collectionArr = data?.pages.flatMap((page) => page.items) || [];
  const options = collectionArr?.map(optionCallBack);
  useEffect(() => {
    options[options.length] = {
      label: <div ref={ref}>{options[options.length]?.label}</div>,
      value: options[options.length]?.value
    };
  }, [data, options, ref]);

  // .map((item, index) => ({
  //   value: item?.id,
  //   label: (
  //     <h1
  //       key={item.name + index}
  //       ref={index === collectionArr.length - 10 ? ref : null}
  //     >
  //       {item?.name}
  //     </h1>
  //   ),
  //   item: item
  // }));
  const t = useTranslation();
  return (
    <form autoComplete="new-fieldName">
      <div
        className={` items-center gap-2 ${wraperClassName} ${
          titleStyle
            ? titleStyle?.position === 'top'
              ? 'flex flex-col'
              : titleStyle?.position === 'bottom'
              ? 'flex flex-col-reverse'
              : titleStyle?.position === 'right'
              ? 'flex '
              : 'flex flex-reverse'
            : ''
        }`}
      >
        <div
          className={` ${sizing.title} flex justify-start items-center gap-2`}
          style={{
            fontSize: titleStyle?.fontSize,
            fontWeight: titleStyle?.fontWeight,
            display: titleStyle?.hiddem ? 'none' : 'flex'
          }}
        >
          {titleIcon}
          {title ? t(title) : ''}
        </div>

        <div className={sizing.select}>
          <Select
            allowClear={allowClear}
            variant={variant}
            size={size}
            className={`w-full mt-6  custom-select`}
            searchValue={searchText}
            onSearch={(e) => setSearchText(e)}
            value={value}
            status={error ? 'error' : ''}
            showSearch
            disabled={disabled}
            suffixIcon={arrow}
            options={StaticOption.length === 0 ? options : StaticOption || []}
            filterOption={false}
            onChange={(e) => handleInputChange(field, e)}
            placeholder={t(placeHolder)}
          />
          <ErrorText error={error} message={errorText} />{' '}
        </div>
      </div>
    </form>
  );
};

export default StandartSelect;
