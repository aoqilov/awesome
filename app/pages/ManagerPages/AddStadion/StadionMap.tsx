import { useTranslation } from '@/hooks/translation';
import { useAddStadion } from './Stadion';

import YandexMapComponent from '@/components/YandexMaps.component';
import { Input, Select } from 'antd';
const StadionMap = () => {
  const { payload, setPayload, setStep } = useAddStadion();
  const t = useTranslation();
  return (
    <div>
      <div className="relative">
        <h1 className="text-center text-xl ">
          {t({
            uz: 'Stadion yaratish',
            ru: 'Создать стадион',
            en: 'Create stadium'
          })}
        </h1>
        <div className="absolute top-0 left-0" onClick={() => setStep?.(0)}>
          <svg
            width="8"
            height="24"
            viewBox="0 0 8 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7 18L1 12L7 6"
              stroke="#090A0A"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
      <div className="h-[calc(100vh-115px)] border ">
        <YandexMapComponent
          onSelect={
            // (lat, lng) =>
            // setPayload?.((p) => ({ ...p, location: `${lat},${lng}` }))
          }
          value={payload?.location}
        />
      </div>
      <div className="pb-[85px] absolute bottom-0 left-0 right-0  bg-white rounded-t-xl p-4">
        <div className="my-4">
          <Select
            placeholder={'Viloyat / shahar'}
            className="w-full "
            value={payload?.province}
            onChange={(value) =>
              setPayload?.((p) => ({ ...p, province: value }))
            }
          />
        </div>
        <div className="my-4">
          <Select
            placeholder={'Tuman / shaharcha'}
            className="w-full "
            value={payload?.city}
            onChange={(value) => setPayload?.((p) => ({ ...p, city: value }))}
          />
        </div>
        <div className="my-4">
          <Input
            className="w-full "
            placeholder="Manzil"
            value={payload?.locationTitle}
            onChange={(e) =>
              setPayload?.((p) => ({
                ...p,
                locationTitle: e.target.value || ''
              }))
            }
          />
        </div>
      </div>
    </div>
  );
};

export default StadionMap;
