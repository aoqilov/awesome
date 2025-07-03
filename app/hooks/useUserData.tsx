// hooks/useUserData.tsx
/**
 * Custom hook that provides a clean interface for accessing user data
 * This replaces the localStorage usage pattern throughout the app
 */
import { useUser } from "@/contexts/UserContext";

export const useUserData = () => {
  const { user, isLoading, error, fetchUser, updateUser, clearUser } = useUser();

  return {
    // User data
    userId: user?.id,
    userEmail: user?.email,
    userFullname: user?.fullname,
    userPhone: user?.phoneNumber,
    userRole: user?.role,
    userAvatar: user?.avatar,
    userBirthDate: user?.birthDate,
    userBornCity: user?.bornCity,
    userLiveCity: user?.liveCity,
    userLanguage: user?.language,
    userVerified: user?.verified,
    user, // Full user object

    // State
    isLoading,
    error,
    isAuthenticated: !!user,
    isPlayer: user?.role === "player",
    isManager: user?.role === "manager",

    // Actions
    fetchUser,
    updateUser,
    clearUser,
  };
};

export default useUserData;
