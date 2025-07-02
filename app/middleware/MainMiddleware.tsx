import { useQueryParam } from "@/hooks/useQueryParam";
import { pb } from "@/pb/pb";
import { ConfigProvider, theme } from "antd";
import { useEffect, useState, useCallback } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Loading from "@/pages/Loading";

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
  const [user, setUser] = useState<undefined | UserRecordModel>(() => {
    // ✅ LocalStorage'dan user ma'lumotlarini olishga harakat qilamiz
    try {
      const savedUser = localStorage.getItem("user");
      return savedUser ? JSON.parse(savedUser) : undefined;
    } catch {
      return undefined;
    }
  });
  const [isLoading, setIsLoading] = useState(true); // ✅ Loading state qo'shamiz
  const getUser = useCallback(async (): Promise<UserRecordModel> => {
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
  }, [chat_id]);
  useEffect(() => {
    const authenticateUser = async () => {
      setIsLoading(true); // ✅ Loading boshlanishi
      try {
        let currentUser = user;

        // ✅ Agar user allaqachon mavjud bo'lsa va verified bo'lsa, tezroq tekshiramiz
        if (currentUser && currentUser.verified) {
          const role = currentUser.role;
          const isPlayerPath = pathname.startsWith("/client");
          const isManagerPath = pathname.startsWith("/dashboard");

          // Agar to'g'ri path'da bo'lsa, loading'ni darhol to'xtatamiz
          if (
            (role === "player" && isPlayerPath) ||
            (role === "manager" && isManagerPath)
          ) {
            setIsLoading(false);
            return;
          }
        }

        if (!currentUser) {
          const data = await getUser();

          setUser(data);
          currentUser = data;
        }

        if (!currentUser) {
          localStorage.removeItem("user");
          navigate(`/register?chat_id=${chat_id}`, { replace: true });
          setIsLoading(false);
          return;
        }

        localStorage.setItem("user", JSON.stringify(currentUser)); // redux yoki context

        // 👉 verified = false bo'lsa — verify sahifaga yuboramiz (step=2 for OTP)
        if (!currentUser.verified) {
          navigate(`/register?chat_id=${chat_id}&step=2`, { replace: true });
          setIsLoading(false);
          return;
        }

        // ✅ Role bo'yicha yo'naltirish
        const role = currentUser.role;
        const isPlayerPath = pathname.startsWith("/client");
        const isManagerPath = pathname.startsWith("/dashboard");

        if (role === "player" && !isPlayerPath) {
          navigate(`/client/home?chat_id=${chat_id}`, { replace: true });
          setIsLoading(false);
          return;
        }

        if (role === "manager" && !isManagerPath) {
          navigate(`/dashboard/home?chat_id=${chat_id}`, { replace: true });
          setIsLoading(false);
          return;
        }

        // ❌ Noma'lum role bo'lsa logout
        if (role !== "player" && role !== "manager") {
          pb.authStore.clear();
          localStorage.removeItem("user");
          navigate(`/register?chat_id=${chat_id}`, { replace: true });
          setIsLoading(false);
          return;
        }

        // ✅ Hamma tekshiruvlar muvaffaqiyatli yakunlanganda loading tugaydi
        setIsLoading(false);
      } catch (error) {
        console.error("Auth error:", error);
        pb.authStore.clear();
        navigate(`/register?chat_id=${chat_id}`, { replace: true });
        setIsLoading(false);
      }
    };

    if (!chat_id) {
      navigate(`/register?chat_id=${chat_id}`, { replace: true });
      setIsLoading(false);
      return;
    }
    authenticateUser();
  }, [chat_id, pathname, navigate, user, getUser]);
  // ✅ Loading paytida faqat Loading komponentini ko'rsatamiz
  if (isLoading) {
    return <Loading />;
  }

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
