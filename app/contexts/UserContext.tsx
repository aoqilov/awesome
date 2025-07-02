// contexts/UserContext.tsx
import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { pb } from "@/pb/pb";

interface UserRecordModel {
  avatar: string;
  birthDate: string;
  bornCity: string;
  chatId: string;
  collectionId: string;
  collectionName: string;
  created: string;
  email: string;
  emailVisibility: false;
  fullname: string;
  id: string;
  language: string;
  liveCity: string;
  phoneNumber: string;
  role: string;
  updated: string;
  verified: boolean;
}

interface UserState {
  user: UserRecordModel | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
}

type UserAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_USER"; payload: UserRecordModel | null }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_AUTHENTICATED"; payload: boolean }
  | { type: "SET_INITIALIZED"; payload: boolean }
  | { type: "UPDATE_USER"; payload: Partial<UserRecordModel> }
  | { type: "CLEAR_USER" };

const initialState: UserState = {
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
  isInitialized: false,
};

const userReducer = (state: UserState, action: UserAction): UserState => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_USER":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        error: null,
      };
    case "SET_ERROR":
      return { ...state, error: action.payload, isLoading: false };
    case "SET_AUTHENTICATED":
      return { ...state, isAuthenticated: action.payload };
    case "SET_INITIALIZED":
      return { ...state, isInitialized: action.payload };
    case "UPDATE_USER":
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      };
    case "CLEAR_USER":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        error: null,
      };
    default:
      return state;
  }
};

interface UserContextType {
  // State
  user: UserRecordModel | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  isInitialized: boolean;

  // Actions
  fetchUser: (chatId: string) => Promise<UserRecordModel | null>;
  updateUser: (data: Partial<UserRecordModel>) => Promise<void>;
  clearUser: () => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;

  // Computed properties
  isPlayer: boolean;
  isManager: boolean;
  userId: string | null;
}

const UserContext = createContext<UserContextType | null>(null);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  // Initialize the context without localStorage dependency
  useEffect(() => {
    dispatch({ type: "SET_INITIALIZED", payload: true });
  }, []);

  const fetchUser = useCallback(async (chatId: string): Promise<UserRecordModel | null> => {
    if (!chatId) {
      dispatch({ type: "SET_ERROR", payload: "Chat ID is required" });
      return null;
    }

    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "SET_ERROR", payload: null });

    try {
      const { record } = await pb
        .collection("users")
        .authWithPassword(`${chatId}@gmail.com`, chatId);
      
      const user = record as UserRecordModel;
      dispatch({ type: "SET_USER", payload: user });
      return user;
    } catch (error) {
      console.error("Error fetching user:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch user";
      dispatch({ type: "SET_ERROR", payload: errorMessage });
      pb.authStore.clear();
      return null;
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, []);

  const updateUser = useCallback(async (updateData: Partial<UserRecordModel>): Promise<void> => {
    if (!state.user?.id) {
      throw new Error("User ID is required for update");
    }

    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "SET_ERROR", payload: null });

    try {
      const updatedUser = await pb
        .collection("users")
        .update(state.user.id, updateData);
      
      dispatch({ type: "UPDATE_USER", payload: updatedUser });
    } catch (error) {
      console.error("Error updating user:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to update user";
      dispatch({ type: "SET_ERROR", payload: errorMessage });
      throw error;
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, [state.user?.id]);

  const clearUser = useCallback(() => {
    dispatch({ type: "CLEAR_USER" });
    pb.authStore.clear();
    
    // Clean up registration-related session storage
    sessionStorage.removeItem("registration_state");
    sessionStorage.removeItem("registration_otp_id");
  }, []);

  const setError = useCallback((error: string | null) => {
    dispatch({ type: "SET_ERROR", payload: error });
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    dispatch({ type: "SET_LOADING", payload: loading });
  }, []);

  const contextValue: UserContextType = {
    // State
    user: state.user,
    isLoading: state.isLoading,
    error: state.error,
    isAuthenticated: state.isAuthenticated,
    isInitialized: state.isInitialized,

    // Actions
    fetchUser,
    updateUser,
    clearUser,
    setError,
    setLoading,

    // Computed properties
    isPlayer: state.user?.role === "player",
    isManager: state.user?.role === "manager",
    userId: state.user?.id || null,
  };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

// Backward compatibility hook for existing components
export const useUserContext = (): UserContextType => {
  return useUser();
};
