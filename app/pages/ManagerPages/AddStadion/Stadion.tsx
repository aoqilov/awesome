// import { useTranslation } from '@/hooks/translation';

import { createContext, Dispatch, useContext, useState } from 'react';

import { PageTransition } from '@/shared/Motion';

import { useValidify } from '@/hooks/useValidify';
import StadionForm from './StadionForm';
import StadionMap from './StadionMap';
// Define the extended payload type with player-specific fields
export interface PlayerPayload {
  StadionName: string | undefined;
  openTime: string | undefined;
  closeTime: string | undefined;
  location: string | undefined;
  locationTitle: string | undefined;
  province: string | undefined;
  city: string | undefined;
  rules: string | undefined;
  telegram: string | undefined;
  instagram: string | undefined;
  youtube: string | undefined;
  facebook: string | undefined;
  amenities: string[] | undefined;
}

// Define the validation state type
export interface ValidationState {
  StadionName: boolean | undefined;
  openTime: boolean | undefined;
  closeTime: boolean | undefined;
  location: boolean | undefined;
  province: boolean | undefined;
  city: boolean | undefined;
  rules: boolean | undefined;
  telegram: boolean | undefined;
  instagram: boolean | undefined;
  youtube: boolean | undefined;
  facebook: boolean | undefined;
  amenities: boolean | undefined;
}

const AddStadionContext = createContext<Partial<AddStadionContextType>>({});
export type AddStadionContextType = {
  step: number;
  setStep: Dispatch<React.SetStateAction<number>>;
  payload: PlayerPayload;
  setPayload: Dispatch<React.SetStateAction<PlayerPayload>>;
  handleChange: <F extends keyof PlayerPayload>(
    field: F,
    value: PlayerPayload[F]
  ) => void;
  stateValidation: Partial<ValidationState>;
};

const AddStadionPage = () => {
  const [step, setStep] = useState(0);
  const {
    state: payload,
    setState: setPayload,
    handleChange,
    stateValidation
  } = useValidify<
    PlayerPayload,
    ['location', 'StadionName', 'openTime', 'closeTime', 'province', 'city']
  >({
    rules: {
      location: (value: string | undefined): boolean =>
        value === undefined || value.trim() === '',
      StadionName: (value: string | undefined): boolean =>
        value === undefined || value.trim() === '',
      openTime: (value: string | undefined): boolean =>
        value === undefined || value.trim() === '',
      closeTime: (value: string | undefined): boolean =>
        value === undefined || value.trim() === '',
      province: (value: string | undefined): boolean =>
        value === undefined || value.trim() === '',
      city: (value: string | undefined): boolean =>
        value === undefined || value.trim() === ''
    },
    requiredFields: [
      'location',
      'StadionName',
      'openTime',
      'closeTime',
      'province',
      'city'
    ],
    autoValidateOnChange: true
  });

  const currentStep = () => {
    switch (step) {
      case 0:
        return <StadionForm />;
      case 1:
        return <StadionMap />;
    }
  };

  return (
    <AddStadionContext.Provider
      value={{
        step,
        setStep,
        payload: payload as PlayerPayload,
        setPayload: setPayload as Dispatch<React.SetStateAction<PlayerPayload>>,
        handleChange,
        stateValidation: stateValidation as ValidationState
      }}
    >
      <div className="max-w-[500px] mx-auto   ">
        <PageTransition key={`${step}`}>
          <div className="">{currentStep()}</div>
        </PageTransition>
      </div>
    </AddStadionContext.Provider>
  );
};

export default AddStadionPage;

// eslint-disable-next-line react-refresh/only-export-components
export const useAddStadion = () => useContext(AddStadionContext);

// eslint-disable-next-line react-refresh/only-export-components
export const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 24
    }
  }
};
