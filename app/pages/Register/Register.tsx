/* eslint-disable @typescript-eslint/no-explicit-any */
// import { useTranslation } from '@/hooks/translation';

import { createContext, Dispatch, useContext, useState } from 'react';

import { PageTransition } from '@/shared/Motion';

import { useValidify } from '@/hooks/useValidify';
import SelectLang from './Steps/SelectLang';
import PhoneNumber from './Steps/PhoneNumber';
import OTP from './Steps/OTP';
import Profile from './Steps/Profile';

// Define the extended payload type with player-specific fields
export interface PlayerPayload {
  lang: string | undefined;
  fullName: string | undefined;
  phone: string | undefined;
  userType: string | undefined;
  agree: boolean | undefined;
  avatar: any;
  // Player-specific fields
  familyName?: string | undefined;
  birthDate?: any;
  birthPlace?: {
    region?: string | undefined;
    district?: string | undefined;
  };
  residencePlace?: {
    region?: string | undefined;
    district?: string | undefined;
  };
  otp?: string;
}

// Define the validation state type
export interface ValidationState {
  lang: boolean;
  fullName: boolean;
  phone: boolean;
  userType: boolean;
  agree: boolean | undefined;
  // Player-specific validation fields
  familyName?: boolean;
  birthDate?: boolean;
  birthPlace?: {
    region?: boolean;
    district?: boolean;
  };
  residencePlace?: {
    region?: boolean;
    district?: boolean;
  };
  otp?: boolean | undefined;
}

const RegisterContext = createContext({});

const RegisterPage = () => {
  const [step, setStep] = useState(0);
  const [isEdit, setisEdit] = useState({ bool: false, id: '' });
  const {
    state: payload,
    setState: setPayload,
    handleChange,
    stateValidation
  } = useValidify<PlayerPayload, ['phone', 'fullName', 'agree']>({
    rules: {
      phone: (value: string | undefined): boolean => {
        const phoneRegex = /^\+998\d{9}$/;
        return !phoneRegex.test(value || '');
      },
      fullName: (value: string | undefined): boolean => {
        const nameRegex = /^[a-zA-Zа-яА-ЯёЁ\s]+$/;
        return !nameRegex.test(value || '');
      },
      agree: (value: boolean | undefined): boolean => {
        return value !== true;
      }
    },
    requiredFields: ['phone', 'fullName', 'agree'],
    autoValidateOnChange: true
  });

  // const t = useTranslation();
  const currentStep = () => {
    switch (step) {
      case 0:
        return <SelectLang />;
      case 1:
        return <PhoneNumber />;
      case 2:
        return <OTP />;
      case 3:
        return <Profile />;
    }
  };
  return (
    <RegisterContext.Provider
      value={{
        step,
        setStep,
        payload,
        setPayload,
        handleChange,
        stateValidation,
        isEdit,
        setisEdit
      }}
    >
      <div className="max-w-[500px] mx-auto h-screen  p-4">
        <PageTransition key={`${step}`}>{currentStep()}</PageTransition>
      </div>
    </RegisterContext.Provider>
  );
};

export default RegisterPage;

export type RegisterContextType = {
  isEdit: { bool: boolean; id: string };
  setisEdit: Dispatch<React.SetStateAction<{ bool: boolean; id: string }>>;
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

// eslint-disable-next-line react-refresh/only-export-components
export const useRegister = () => useContext(RegisterContext);

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
