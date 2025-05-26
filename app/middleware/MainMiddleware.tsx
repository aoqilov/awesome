/* eslint-disable react-hooks/exhaustive-deps */
// import { useLocalStorage } from '@/hooks/useLocalStorage';
// import { useTheme } from '@/providers/theme-provider';
import { useQueryParam } from '@/hooks/useQueryParam';
import { pb } from '@/pb/pb';
import { ConfigProvider, theme } from 'antd';
import { RecordAuthResponse, RecordModel } from 'pocketbase';
import { useEffect, useState } from 'react';

// import { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

const MainMiddleware = () => {
  const n = useNavigate();

  // const { theme: darkOrLight } = useTheme();
  // const [user] = useLocalStorage('user', null);
  const { pathname } = useLocation();

  // useEffect(() => {
  //   // TODO: agar user bo'lsa ro'le ga qarab qayerga yo'naltirish kerakligini yozing agar user bo'lmasa qayerga yo'naltirish kerakligini yozing men bu yerda anniq path no ma'lum ekanligi uchun bir xil yozib qo'ya qoldim
  //   // navigate(user ? `/dashboard` : `/dashboard/users`);
  //   if (!pathname.startsWith('/dashboard')) {
  //     navigate(`register`);
  //   }
  // }, [navigate, pathname]);
  const { chat_id } = useQueryParam();
  const navigate = (pathName: string) => {
    n(pathName + (pathname.includes('?') ? '&' : '?') + `chat_id=${chat_id}`);
  };
  const [user, setUser] = useState<
    undefined | RecordAuthResponse<RecordModel>
  >();
  useEffect(() => {
    const authenticateUser = async () => {
      try {
        const data = await pb
          .collection('users')
          .authWithPassword(`${chat_id}gmail.com`, chat_id);

        setUser(data);
      } catch (error) {
        console.error('Authentication error:', error);
      }
    };

    if (chat_id) {
      authenticateUser();
    }
  }, [chat_id]);

  useEffect(() => {
    if (!user) {
      navigate(`/register`);
    } else {
      navigate(`/dashboard/home`);
    }
  }, [user, navigate]);
  return (
    <div className="cw-screen h-screen w-full ">
      <ConfigProvider
        theme={{
          algorithm: theme.defaultAlgorithm
        }}
      >
        <Outlet />
      </ConfigProvider>
    </div>
  );
};

export default MainMiddleware;
