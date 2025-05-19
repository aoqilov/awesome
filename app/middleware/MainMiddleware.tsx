// import { useLocalStorage } from '@/hooks/useLocalStorage';
// import { useTheme } from '@/providers/theme-provider';
import { ConfigProvider, theme } from 'antd';
import { useEffect } from 'react';

// import { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

const MainMiddleware = () => {
  const navigate = useNavigate();
  // const { theme: darkOrLight } = useTheme();
  // const [user] = useLocalStorage('user', null);
  const { pathname } = useLocation();
  useEffect(() => {
    // TODO: agar user bo'lsa ro'le ga qarab qayerga yo'naltirish kerakligini yozing agar user bo'lmasa qayerga yo'naltirish kerakligini yozing men bu yerda anniq path no ma'lum ekanligi uchun bir xil yozib qo'ya qoldim
    // navigate(user ? `/dashboard` : `/dashboard/users`);
    if (!pathname.startsWith('/dashboard')) {
      navigate(`register`);
    }
  }, [navigate, pathname]);
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
