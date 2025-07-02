import { useQueryParam } from "@/hooks/useQueryParam";
import { useUser } from "@/contexts/UserContext";
import { ConfigProvider, theme } from "antd";
import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const MainMiddleware = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { chat_id } = useQueryParam();
  const { 
    user, 
    fetchUser, 
    clearUser, 
    isLoading, 
    error, 
    isInitialized 
  } = useUser();

  useEffect(() => {
    const authenticateUser = async () => {
      // Wait for UserContext to initialize
      if (!isInitialized) return;

      // If no chat_id, redirect to register
      if (!chat_id) {
        navigate(`/register?chat_id=${chat_id}`, { replace: true });
        return;
      }

      try {
        let currentUser = user;

        // Always fetch user data fresh (no localStorage persistence)
        if (!currentUser && !isLoading && !error) {
          currentUser = await fetchUser(chat_id);
        }

        // If still no user after fetch attempt, redirect to register
        if (!currentUser) {
          navigate(`/register?chat_id=${chat_id}`, { replace: true });
          return;
        }

        // If user is not verified, redirect to OTP step
        if (!currentUser.verified) {
          navigate(`/register?chat_id=${chat_id}&step=2`, { replace: true });
          return;
        }

        // Handle role-based routing
        const role = currentUser.role;
        const isPlayerPath = pathname.startsWith("/client");
        const isManagerPath = pathname.startsWith("/dashboard");

        if (role === "player" && !isPlayerPath) {
          navigate(`/client/home?chat_id=${chat_id}`, { replace: true });
          return;
        }

        if (role === "manager" && !isManagerPath) {
          navigate(`/dashboard/home?chat_id=${chat_id}`, { replace: true });
          return;
        }

        // If unknown role, clear user and redirect to register
        if (role !== "player" && role !== "manager") {
          clearUser();
          navigate(`/register?chat_id=${chat_id}`, { replace: true });
          return;
        }
      } catch (authError) {
        console.error("Auth error:", authError);
        clearUser();
        navigate(`/register?chat_id=${chat_id}`, { replace: true });
      }
    };

    authenticateUser();
  }, [
    chat_id,
    pathname,
    navigate,
    user,
    fetchUser,
    clearUser,
    isLoading,
    error,
    isInitialized,
  ]);

  return (
    <div className="cw-screen h-screen w-full">
      <ConfigProvider
        theme={{
          algorithm: theme.defaultAlgorithm,
        }}
      >
        <Outlet />
      </ConfigProvider>
    </div>
  );
};

export default MainMiddleware;
