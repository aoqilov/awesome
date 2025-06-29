import { useQueryParam } from "@/hooks/useQueryParam";
import { pb } from "@/pb/pb";
import { ConfigProvider, theme } from "antd";
import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

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

const MainMiddleware = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { chat_id } = useQueryParam();

  const [user, setUser] = useState<undefined | UserRecordModel>();

  const getUser = async (): Promise<UserRecordModel> => {
    try {
      const { record } = await pb
        .collection("users")
        .authWithPassword(`${chat_id}@gmail.com`, chat_id);
      return record as UserRecordModel;
    } catch (error) {
      console.error("Error fetching user:", error);
      pb.authStore.clear();
      localStorage.removeItem("user");
      throw error;
    }
  };

  useEffect(() => {
    const authenticateUser = async () => {
      try {
        let currentUser = user;

        if (!currentUser) {
          const data = await getUser();

          setUser(data);
          currentUser = data;
        }

        if (!currentUser) {
          localStorage.removeItem("user");
          navigate(`/register?chat_id=${chat_id}`, { replace: true });
          return;
        }

        localStorage.setItem("user", JSON.stringify(currentUser)); // redux yoki context

        // 👉 verified = false bo'lsa — verify sahifaga yuboramiz (step=2 for OTP)
        if (!currentUser.verified) {
          navigate(`/register?chat_id=${chat_id}&step=2`, { replace: true });
          return;
        }

        // ✅ Role bo'yicha yo'naltirish
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

        // ❌ Noma'lum role bo'lsa logout
        if (role !== "player" && role !== "manager") {
          pb.authStore.clear();
          localStorage.removeItem("user");
          navigate(`/register?chat_id=${chat_id}`, { replace: true });
          return;
        }
      } catch (error) {
        console.error("Auth error:", error);
        pb.authStore.clear();
        navigate(`/register?chat_id=${chat_id}`, { replace: true });
      }
    };

    if (!chat_id) {
      navigate(`/register?chat_id=${chat_id}`, { replace: true });
      return;
    }

    authenticateUser();
  }, [chat_id, pathname, navigate, user]); // Added 'user' to dependencies

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
