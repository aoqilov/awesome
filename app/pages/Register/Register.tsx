/* eslint-disable @typescript-eslint/no-explicit-any */
// import { useTranslation } from '@/hooks/translation';

import {
  createContext,
  Dispatch,
  useContext,
  useState,
  useEffect,
} from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { useQueryParam } from "@/hooks/useQueryParam";

import { PageTransition } from "@/shared/Motion";

import { useValidify } from "@/hooks/useValidify";
import SelectLang from "./Steps/SelectLang";
import PhoneNumber from "./Steps/PhoneNumber";
import OTP from "./Steps/OTP";
import Profile from "./Steps/Profile";
import { UsersLanguageOptions } from "@/types/pocketbaseTypes";
import Loading from "../Loading";
// Define the extended payload type with player-specific fields
export interface PlayerPayload {
  lang: UsersLanguageOptions | undefined;
  fullName: string | undefined;
  phone: string | undefined;
  userType: string | undefined;
  agree: boolean | undefined;
  avatar: any;
  avatarPreview?: string; // For displaying preview of selected image
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
  const navigate = useNavigate();
  const { chat_id } = useQueryParam();
  const { user: currentUser, fetchUser } = useUser();

  // ✅ Check if user is already authenticated and verified
  useEffect(() => {
    const checkAuthentication = async () => {
      if (!chat_id) return;

      try {
        // Try to fetch user if not already loaded
        let userToCheck = currentUser;
        if (!userToCheck) {
          userToCheck = await fetchUser(chat_id);
        }

        // If user exists and is verified, redirect to appropriate dashboard
        if (userToCheck && userToCheck.verified) {
          const role = userToCheck.role;

          if (role === "player") {
            navigate(`/client/home?chat_id=${chat_id}`, { replace: true });
            return;
          }

          if (role === "manager") {
            navigate(`/dashboard/home?chat_id=${chat_id}`, { replace: true });
            return;
          }
        }
      } catch (error) {
        console.error("Authentication check error:", error);
        // Continue with registration flow
      }
    };

    checkAuthentication();
  }, [chat_id, currentUser, fetchUser, navigate]);

  const [searchParams] = useSearchParams();
  const stepParam = searchParams.get("step");
  const [step, setStep] = useState(stepParam ? parseInt(stepParam, 10) : 0);
  const [isEdit, setisEdit] = useState({ bool: false, id: "" });

  // Update step when URL parameter changes
  useEffect(() => {
    const stepParam = searchParams.get("step");
    if (stepParam) {
      const stepNumber = parseInt(stepParam, 10);
      if (stepNumber >= 0 && stepNumber <= 3) {
        setStep(stepNumber);
      }
    } else {
      // If no step parameter, default to step 0
      setStep(0);
    }
  }, [searchParams]);

  const {
    state: payload,
    setState: setPayload,
    handleChange,
    stateValidation,
  } = useValidify<PlayerPayload, ["phone", "fullName", "agree"]>({
    rules: {
      phone: (value: string | undefined): boolean => {
        const phoneRegex = /^\+998\d{9}$/;
        return !phoneRegex.test(value || "");
      },
      fullName: (value: string | undefined): boolean => {
        const nameRegex = /^[a-zA-Zа-яА-ЯёЁ\s]+$/;
        return !nameRegex.test(value || "");
      },
      agree: (value: boolean | undefined): boolean => {
        return value !== true;
      },
    },
    requiredFields: ["phone", "fullName", "agree"],
    autoValidateOnChange: true,
  });

  // Load user data from UserContext (already handled by MainMiddleware)
  const { user, isLoading } = useUser();

  // Don't render Register component until MainMiddleware completes initial auth check
  // This prevents showing wrong step before redirection
  useEffect(() => {
    const stepParam = searchParams.get("step");
    if (stepParam === "2") {
      if (user && user.email) {
        setPayload((prev) => ({
          ...prev,
          fullName: user.fullname,
          userType: user.role,
        }));
      }
    }
  }, [searchParams, user, setPayload]);

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

  // Show loading when user data is being fetched
  if (isLoading) {
    return <Loading />;
  }

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
        setisEdit,
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
      type: "spring",
      stiffness: 300,
      damping: 24,
    },
  },
};
