import { useQueryParam } from "@/hooks/useQueryParam";
import { pb } from "@/pb/pb";
import { ConfigProvider, theme } from "antd";
import { RecordAuthResponse, RecordModel } from "pocketbase";
import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const MainMiddleware = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { chat_id } = useQueryParam();

  const [, setUser] = useState<undefined | RecordAuthResponse<RecordModel>>();

  useEffect(() => {
    const authenticateUser = async () => {
      try {
        const data = await pb
          .collection("users")
          .authWithPassword(`${chat_id}@gmail.com`, chat_id);

        const user = data.record;
        setUser(data);
        localStorage.setItem("user", JSON.stringify(user));

        // 👉 verified = false bo‘lsa — confirm sahifaga yuboramiz
        if (!user.verified) {
          navigate(`/register?chat_id=${chat_id}`, { replace: true });
          return;
        }

        // ✅ Role bo‘yicha yo‘naltirish
        const role = user.role;
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

        // ❌ Noma’lum role bo‘lsa logout
        if (role !== "player" && role !== "manager") {
          pb.authStore.clear();
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
  }, [chat_id, pathname, navigate]);

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
