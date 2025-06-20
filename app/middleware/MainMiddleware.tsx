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
  const [setUser] = useState<undefined | RecordAuthResponse<RecordModel>>();

  // useEffect(() => {
  //   const authenticateUser = async () => {
  //     try {
  //       const data = await pb
  //         .collection("users")
  //         .authWithPassword(`${chat_id}@gmail.com`, chat_id);

  //       setUser(data);

  //       if (!pathname.includes("dashboard")) {
  //         navigate(`/dashboard/home?chat_id=${chat_id}`, { replace: true });
  //       }
  //     } catch (error) {
  //       pb.authStore.clear();
  //       console.error("Authentication failed:", error);
  //       navigate(`/register?chat_id=${chat_id}`, { replace: true });
  //     }
  //   };

  //   if (!chat_id) {
  //     pb.authStore.clear();
  //     navigate(`/register?chat_id=${chat_id}`, { replace: true });
  //     return;
  //   }

  //   // const alreadyLoggedIn =
  //   //   pb.authStore.isValid &&
  //   //   pb.authStore.record?.email === `${chat_id}@gmail.com`;

  //   // console.log(alreadyLoggedIn);

  //   // if (!alreadyLoggedIn) {
  //   authenticateUser();
  //   // }
  // }, [chat_id, pathname, navigate]);

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
