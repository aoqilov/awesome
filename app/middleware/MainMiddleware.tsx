// import { useQueryParam } from "@/hooks/useQueryParam";
// import { useUser } from "@/contexts/UserContext";
// import { ConfigProvider, theme } from "antd";
// import { useEffect, useState } from "react";
// import { Outlet, useLocation, useNavigate } from "react-router-dom";
// import LogoBanner from "@/pages/LogoBanner";

// const MainMiddleware = () => {
//   const navigate = useNavigate();
//   const { pathname } = useLocation();
//   const { chat_id } = useQueryParam();
//   const [load, setLoad] = useState(true); // Avval true bo'lishi kerak (LogoBanner ko‘rinadi)
//   const { user, fetchUser, clearUser, error, isInitialized, setLoading } =
//     useUser();

//   useEffect(() => {
//     const authenticateUser = async () => {
//       if (!isInitialized) return; // Context tayyor bo‘lmaguncha kutish

//       setLoading(true);

//       if (!chat_id || chat_id === "undefined") {
//         setLoading(false);
//         setLoad(false);
//         navigate("/register", { replace: true });
//         return;
//       }

//       try {
//         let currentUser = user;

//         if (!currentUser && !error) {
//           currentUser = await fetchUser(chat_id);
//         }

//         if (!currentUser) {
//           setLoading(false);
//           setLoad(false);
//           navigate(`/register?chat_id=${chat_id}`, { replace: true });
//           return;
//         }

//         if (!currentUser.verified) {
//           setLoading(false);
//           setLoad(false);
//           navigate(`/register?chat_id=${chat_id}&step=2`, { replace: true });
//           return;
//         }

//         const role = currentUser.role;
//         const isPlayerPath = pathname.startsWith("/client");
//         const isManagerPath = pathname.startsWith("/dashboard");

//         if (role === "player" && !isPlayerPath) {
//           setLoading(false);
//           setLoad(false);
//           navigate(`/client/home?chat_id=${chat_id}`, { replace: true });
//           return;
//         }

//         if (role === "manager" && !isManagerPath) {
//           setLoading(false);
//           setLoad(false);
//           navigate(`/dashboard/home?chat_id=${chat_id}`, { replace: true });
//           return;
//         }

//         if (role !== "player" && role !== "manager") {
//           clearUser();
//           setLoading(false);
//           setLoad(false);
//           navigate(`/register?chat_id=${chat_id}`, { replace: true });
//           return;
//         }

//         // ✅ Hamma narsa joyida bo‘lsa:
//         setLoading(false);
//         setLoad(false); // Endi Outlet ko‘rsatiladi
//       } catch (authError) {
//         console.error("Auth error:", authError);
//         clearUser();
//         setLoading(false);
//         setLoad(false);
//         navigate(`/register?chat_id=${chat_id}`, { replace: true });
//       }
//     };

//     authenticateUser();
//   }, [
//     chat_id,
//     pathname,
//     navigate,
//     user,
//     fetchUser,
//     clearUser,
//     error,
//     isInitialized,
//     setLoading,
//   ]);

//   return (
//     <div className="cw-screen h-screen w-full">
//       <ConfigProvider
//         theme={{
//           algorithm: theme.defaultAlgorithm,
//         }}
//       >
//         {load ? <LogoBanner /> : <Outlet />}
//       </ConfigProvider>
//     </div>
//   );
// };

// export default MainMiddleware;import { useQueryParam } from "@/hooks/useQueryParam";import { useUser } from "@/contexts/UserContext";
import { ConfigProvider, theme } from "antd";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import LogoBanner from "@/pages/LogoBanner";
import { useQueryParam } from "@/hooks/useQueryParam";
import { useUser } from "@/contexts/UserContext";

const MainMiddleware = () => {
  const navigate = useNavigate();
  const { chat_id } = useQueryParam();

  const [isLoadingScreen, setIsLoadingScreen] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState(
    "Foydalanuvchi tekshirilmoqda..."
  );

  const { fetchUser, clearUser, isInitialized, setLoading } = useUser();

  useEffect(() => {
    if (!isInitialized) return;

    const authenticateUser = async () => {
      setLoading(true);
      setIsLoadingScreen(true);
      setLoadingMessage("Foydalanuvchi aniqlanmoqda...");

      if (!chat_id || chat_id === "undefined") {
        setLoadingMessage("chat_id topilmadi. Ro‘yxatga yo‘naltirilmoqda...");
        setLoading(false);
        setTimeout(() => {
          setIsLoadingScreen(false);
          navigate("/register", { replace: true });
        }, 500);
        return;
      }

      try {
        setLoadingMessage("Foydalanuvchi maʼlumotlari olinmoqda...");
        const currentUser = await fetchUser(chat_id);

        if (!currentUser) {
          setLoadingMessage("Foydalanuvchi topilmadi...");
          setLoading(false);
          setTimeout(() => {
            setIsLoadingScreen(false);
            navigate(`/register?chat_id=${chat_id}`, { replace: true });
          }, 500);
          return;
        }

        // ✅ Muvaffaqiyatli topildi
        setLoading(false);
        setTimeout(() => setIsLoadingScreen(false), 200);
      } catch (err) {
        console.error("Xatolik:", err);
        setLoadingMessage("Xatolik yuz berdi...");
        clearUser();
        setLoading(false);
        setTimeout(() => {
          setIsLoadingScreen(false);
          navigate(`/register?chat_id=${chat_id}`, { replace: true });
        }, 500);
      }
    };

    authenticateUser();
  }, [isInitialized, chat_id]); // chat_id ham kuzatilsin

  return (
    <div className="h-screen w-full">
      <ConfigProvider theme={{ algorithm: theme.defaultAlgorithm }}>
        {isLoadingScreen ? <LogoBanner message={loadingMessage} /> : <Outlet />}
      </ConfigProvider>
    </div>
  );
};

export default MainMiddleware;
