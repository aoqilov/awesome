import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from "react";
import { UsersLanguageOptions } from "@/types/pocketbaseTypes";

interface RegisterState {
  step: number;
  payload: {
    lang?: UsersLanguageOptions;
    phone: string;
    otp: string;
    fullname: string;
    birthDate: string;
    bornCity: string;
    liveCity: string;
    role: string;
  };
  isEdit: {
    bool: boolean;
    id: string;
  };
  isLoading: boolean;
  error: string | null;
  isInRegistrationFlow: boolean;
}

type RegisterAction =
  | { type: "SET_STEP"; payload: number }
  | { type: "SET_PAYLOAD"; payload: Partial<RegisterState["payload"]> }
  | { type: "SET_IS_EDIT"; payload: RegisterState["isEdit"] }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_IN_REGISTRATION_FLOW"; payload: boolean }
  | { type: "RESET_STATE" }
  | { type: "HYDRATE_STATE"; payload: Partial<RegisterState> };

const initialState: RegisterState = {
  step: 0,
  payload: {
    phone: "",
    otp: "",
    fullname: "",
    birthDate: "",
    bornCity: "",
    liveCity: "",
    role: "",
  },
  isEdit: {
    bool: false,
    id: "",
  },
  isLoading: false,
  error: null,
  isInRegistrationFlow: false,
};

const registerReducer = (
  state: RegisterState,
  action: RegisterAction
): RegisterState => {
  switch (action.type) {
    case "SET_STEP":
      return { ...state, step: action.payload };
    case "SET_PAYLOAD":
      return {
        ...state,
        payload: { ...state.payload, ...action.payload },
      };
    case "SET_IS_EDIT":
      return { ...state, isEdit: action.payload };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "SET_IN_REGISTRATION_FLOW":
      return { ...state, isInRegistrationFlow: action.payload };
    case "RESET_STATE":
      return { ...initialState };
    case "HYDRATE_STATE":
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

interface RegisterContextType {
  state: RegisterState;
  setStep: (step: number) => void;
  setPayload: (payload: Partial<RegisterState["payload"]>) => void;
  setIsEdit: (isEdit: RegisterState["isEdit"]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setInRegistrationFlow: (inFlow: boolean) => void;
  resetState: () => void;
  // Legacy compatibility for existing components
  step: number;
  payload: RegisterState["payload"];
  isEdit: RegisterState["isEdit"];
}

const RegisterContext = createContext<RegisterContextType | null>(null);

const STORAGE_KEY = "registration_state";

interface RegisterProviderProps {
  children: ReactNode;
}

export const RegisterProvider: React.FC<RegisterProviderProps> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(registerReducer, initialState);

  // Load state from sessionStorage on mount
  useEffect(() => {
    try {
      const savedState = sessionStorage.getItem(STORAGE_KEY);
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        dispatch({ type: "HYDRATE_STATE", payload: parsedState });
      }
    } catch (error) {
      console.error("Error loading registration state:", error);
      sessionStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  // Save state to sessionStorage whenever it changes
  useEffect(() => {
    try {
      // Only save if we're in registration flow or have meaningful data
      if (state.isInRegistrationFlow || state.step > 0 || state.payload.phone) {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      }
    } catch (error) {
      console.error("Error saving registration state:", error);
    }
  }, [state]);

  // Clean up storage when registration is complete
  useEffect(() => {
    if (!state.isInRegistrationFlow && state.step === 0) {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  }, [state.isInRegistrationFlow, state.step]);

  const setStep = (step: number) => {
    dispatch({ type: "SET_STEP", payload: step });
  };

  const setPayload = (payload: Partial<RegisterState["payload"]>) => {
    dispatch({ type: "SET_PAYLOAD", payload });
  };

  const setIsEdit = (isEdit: RegisterState["isEdit"]) => {
    dispatch({ type: "SET_IS_EDIT", payload: isEdit });
  };

  const setLoading = (loading: boolean) => {
    dispatch({ type: "SET_LOADING", payload: loading });
  };

  const setError = (error: string | null) => {
    dispatch({ type: "SET_ERROR", payload: error });
  };

  const setInRegistrationFlow = (inFlow: boolean) => {
    dispatch({ type: "SET_IN_REGISTRATION_FLOW", payload: inFlow });
  };

  const resetState = () => {
    dispatch({ type: "RESET_STATE" });
    sessionStorage.removeItem(STORAGE_KEY);
    // Clear any other registration-related storage
    localStorage.removeItem("otpId");
  };

  const contextValue: RegisterContextType = {
    state,
    setStep,
    setPayload,
    setIsEdit,
    setLoading,
    setError,
    setInRegistrationFlow,
    resetState,
    // Legacy compatibility
    step: state.step,
    payload: state.payload,
    isEdit: state.isEdit,
  };

  return (
    <RegisterContext.Provider value={contextValue}>
      {children}
    </RegisterContext.Provider>
  );
};

export const useRegisterContext = (): RegisterContextType => {
  const context = useContext(RegisterContext);
  if (!context) {
    throw new Error(
      "useRegisterContext must be used within a RegisterProvider"
    );
  }
  return context;
};

// Backward compatibility hook for existing components
export const useRegister = (): RegisterContextType => {
  return useRegisterContext();
};
