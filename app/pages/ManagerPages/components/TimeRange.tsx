/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from 'react';
import { ConfigProvider, DatePicker } from 'antd';
import dayjs from 'dayjs';
import { cn } from '@/lib/utils';

import enUS from 'antd/es/locale/en_US'; // yoki ru_RU dan nusxa olishingiz mumkin
import ruRU from 'antd/es/locale/ru_RU';
import { useTranslation } from '@/hooks/translation';

import { useLang } from '@/providers/LangProvider';

const uz_UZ = {
  ...enUS, // yoki ...ruRU
  DatePicker: {
    ...enUS.DatePicker,
    lang: {
      ...enUS.DatePicker?.lang,
      locale: 'uz',
      placeholder: 'Sanani tanlang',
      yearPlaceholder: 'Yilni tanlang',
      quarterPlaceholder: 'Chorakni tanlang',
      monthPlaceholder: 'Oyni tanlang',
      weekPlaceholder: 'Haftani tanlang',
      rangePlaceholder: ['Boshlanish sanasi', 'Tugash sanasi'],
      months: [
        'Yanvar',
        'Fevral',
        'Mart',
        'Aprel',
        'May',
        'Iyun',
        'Iyul',
        'Avgust',
        'Sentabr',
        'Oktabr',
        'Noyabr',
        'Dekabr'
      ],
      monthsShort: [
        'Yan',
        'Fev',
        'Mar',
        'Apr',
        'May',
        'Iyun',
        'Iyul',
        'Avg',
        'Sen',
        'Okt',
        'Noy',
        'Dek'
      ],
      weekdays: [
        'Yakshanba',
        'Dushanba',
        'Seshanba',
        'Chorshanba',
        'Payshanba',
        'Juma',
        'Shanba'
      ],
      weekdaysShort: ['Yak', 'Dush', 'Sesh', 'Chor', 'Pay', 'Jum', 'Shan'],
      weekdaysMin: ['Ya', 'Du', 'Se', 'Cho', 'Pa', 'Ju', 'Sha']
    }
  },
  locale: 'uz'
};
const locale = {
  name: 'uz',
  weekdays:
    'Yakshanba_Dushanba_Seshanba_Chorshanba_Payshanba_Juma_Shanba'.split('_'),
  months:
    'Yanvar_Fevral_Mart_Aprel_May_Iyun_Iyul_Avgust_Sentabr_Oktabr_Noyabr_Dekabr'.split(
      '_'
    ),
  weekStart: 1,
  weekdaysShort: 'Yak_Dush_Sesh_Chor_Pay_Jum_Shan'.split('_'),
  monthsShort: 'Yan_Fev_Mar_Apr_May_Iyun_Iyul_Avg_Sen_Okt_Noy_Dek'.split('_'),
  weekdaysMin: 'Ya_Du_Se_Cho_Pa_Ju_Sha'.split('_'),
  formats: {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'DD/MM/YYYY',
    LL: 'D MMMM YYYY',
    LLL: 'D MMMM YYYY HH:mm',
    LLLL: 'dddd, D MMMM YYYY HH:mm'
  },
  relativeTime: {
    future: '%s dan keyin',
    past: '%s oldin',
    s: 'bir necha soniya',
    m: 'bir daqiqa',
    mm: '%d daqiqa',
    h: 'bir soat',
    hh: '%d soat',
    d: 'bir kun',
    dd: '%d kun',
    M: 'bir oy',
    MM: '%d oy',
    y: 'bir yil',
    yy: '%d yil'
  },
  ordinal: (n: any) => `${n}-chi`
};

dayjs.locale(locale, undefined, true);

const TimeRange = ({ value, onChange }: { value: any; onChange: any }) => {
  const [currentDate, setCurrentDate] = useState(dayjs(value).startOf('month'));

  const days = useMemo(() => {
    const startOfMonth = currentDate.startOf('month');
    const daysInMonth = startOfMonth.daysInMonth();
    const daysArray = [];
    for (let i = 0; i < daysInMonth; i++) {
      const date = startOfMonth.add(i, 'day');
      daysArray.push({
        label: date.format('dd'),
        date: date
      });
    }
    return daysArray;
  }, [currentDate]);

  useEffect(() => {
    const valueDate = dayjs(value);
    if (!valueDate.isSame(currentDate, 'month')) {
      setCurrentDate(valueDate.startOf('month'));
    }
  }, [currentDate, value]);

  const selectedIndex = days.findIndex((d) =>
    d.date.isSame(dayjs(value), 'day')
  );

  // Barqaror 5 ta kun ko‘rsatish (chegaralarda ham)
  const minLength = 5;
  const start = Math.max(
    Math.min(selectedIndex - 2, days.length - minLength),
    0
  );
  const end = Math.min(start + minLength, days.length);
  const visibleDays = days.slice(start, end);

  const handleArrowChange = (direction: number) => {
    const newDate = dayjs(value).add(direction, 'day');
    if (!newDate.isSame(currentDate, 'month')) {
      setCurrentDate(newDate.startOf('month'));
    }
    onChange(newDate);
  };
  const weekDays = {
    Mo: {
      uz: 'Dushanba',
      en: 'Monday',
      ru: 'Понедельник'
    },
    Tu: {
      uz: 'Seshanba',
      en: 'Tuesday',
      ru: 'Вторник'
    },
    We: {
      uz: 'Chorshanba',
      en: 'Wednesday',
      ru: 'Среда'
    },
    Th: {
      uz: 'Payshanba',
      en: 'Thursday',
      ru: 'Четверг'
    },
    Fr: {
      uz: 'Juma',
      en: 'Friday',
      ru: 'Пятница'
    },
    Sa: {
      uz: 'Shanba',
      en: 'Saturday',
      ru: 'Суббота'
    },
    Su: {
      uz: 'Yakshanba',
      en: 'Sunday',
      ru: 'Воскресенье'
    }
  };
  const t = useTranslation();
  const { lang } = useLang();
  return (
    <div className="space-y-2 w-full my-1">
      <div className="flex justify-between items-center">
        <span className="text-lg font-semibold">
          {t({ uz: 'Kalendar', en: 'Calendar', ru: 'Календарь' })}
        </span>
        <ConfigProvider
          locale={
            lang === 'uz'
              ? (uz_UZ as unknown as typeof ruRU)
              : lang === 'ru'
              ? ruRU
              : enUS
          }
        >
          <DatePicker
            lang="uz"
            variant="borderless"
            picker="date"
            value={dayjs(value)}
            onChange={(date) => {
              if (date) {
                setCurrentDate(date.startOf('month'));
                onChange(date);
              }
            }}
            format="DD-MMMM, dddd"
          />
        </ConfigProvider>
      </div>

      <div className=" grid  grid-cols-7 w-full items-center  rounded-2xl mb-2  bg-white px-2 py-2  overflow-hidden">
        <button
          className="w-[80%] mx-auto text-gray-400 col-span-1 border rounded-md bg-gray-100 h-full"
          onClick={() => handleArrowChange(-1)}
        >
          &lt;
        </button>

        <div className="w-full col-span-5 grid grid-cols-5  gap-1">
          {visibleDays.map((day, index) => {
            const isSelected = day.date.isSame(dayjs(value), 'day');
            return (
              <div
                key={index}
                onClick={() => onChange(day.date)}
                className={cn(
                  'flex col-span-1 w-full  h-full cursor-pointer flex-col items-center rounded-xl px-2 py-1 transition-all',
                  isSelected
                    ? 'border border-green-600 bg-green-50'
                    : 'text-gray-400 bg-gray-100'
                )}
              >
                <span className="text-sm font-medium">
                  {(
                    t(weekDays[day.label as keyof typeof weekDays]) as string
                  ).slice(0, 3)}
                </span>
                <span
                  className={cn(
                    'text-lg font-semibold',
                    isSelected ? 'text-green-600' : ''
                  )}
                >
                  {day.date.format('DD')}
                </span>
              </div>
            );
          })}
        </div>

        <button
          className="w-[80%] mx-auto text-gray-400 col-span-1 border rounded-md bg-gray-100 h-full"
          onClick={() => handleArrowChange(1)}
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default TimeRange;
