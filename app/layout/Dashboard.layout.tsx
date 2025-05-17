import { Outlet, NavLink } from 'react-router-dom';
import {
  Package,
  Bell,
  User,
  Truck,
  Home,
  MessageSquareText
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from '@/hooks/translation';

const DashboardLayout = () => {
  const t = useTranslation();
  const userNavigation = [
    {
      icon: <Home size={20} />,
      label: t({ uz: 'Asosiy', en: 'Main', ru: 'Главная' }),
      path: '/dashboard/home'
    },
    {
      icon: (
        <svg
          width="24"
          height="25"
          viewBox="0 0 24 25"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M22 24.2998L2 24.2998C1.28203 24.2998 0.700195 23.718 0.700195 23L0.700193 2C0.700195 1.28203 1.28203 0.700199 2 0.700197L22 0.700195C22.718 0.700195 23.2998 1.28203 23.2998 2L23.2998 23C23.2998 23.718 22.718 24.2998 22 24.2998Z"
            stroke="#6C7072"
            stroke-width="1.4"
          />
          <path
            d="M16.3643 25L16.3643 21.4545C16.3643 20.9023 15.9165 20.4545 15.3643 20.4545L8.63699 20.4545C8.0847 20.4545 7.63699 20.9023 7.63699 21.4545L7.63699 25"
            stroke="#6C7072"
            stroke-width="1.4"
          />
          <path
            d="M7.63574 0L7.63574 3.54545C7.63574 4.09774 8.08346 4.54545 8.63574 4.54545L15.363 4.54545C15.9153 4.54545 16.363 4.09774 16.363 3.54545L16.363 -1.87452e-07"
            stroke="#6C7072"
            stroke-width="1.4"
          />
          <path
            d="M24 12.5L4.41074e-06 12.5"
            stroke="#6C7072"
            stroke-width="1.4"
          />
          <path
            d="M12 16.3457C9.8581 16.3457 8.12891 14.62 8.12891 12.5C8.12915 10.3802 9.85825 8.65527 12 8.65527C14.1417 8.65535 15.8709 10.3802 15.8711 12.5C15.8711 14.62 14.1418 16.3456 12 16.3457Z"
            stroke="#6C7072"
            stroke-width="1.4"
          />
        </svg>
      ),
      label: 'Stadion',
      path: '/dashboard/stadium'
    },
    { icon: <Bell size={20} />, label: 'Buyurtma', path: '/dashboard/orders' },
    {
      icon: <MessageSquareText size={20} />,
      label: 'Xabarlar',
      path: '/dashboard/announcements'
    },

    { icon: <User size={20} />, label: 'Profil', path: '/dashboard/profile' }
  ];
  const managerNavigation = [
    { icon: <Package size={20} />, label: 'Yuklar', path: '/dashboard/cargos' },
    {
      icon: <Truck size={20} />,
      label: 'Mashinalarim',
      path: '/dashboard/vehicles'
    },
    { icon: <User size={20} />, label: 'Profil', path: '/dashboard/profile' }
  ];
  const userRole: 'driver' | 'dispatcher' = 'dispatcher';
  const getNavItems = () => {
    if (userRole === 'dispatcher') {
      return userNavigation;
    } else if (userRole === 'driver') {
      return managerNavigation;
    } else {
      return [];
    }
  };
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100">
      <main className="h-[calc(100v-4.5rem)] pb-20 overflow-y-auto p-4 noScroll ">
        <Outlet />
      </main>
      <motion.nav
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        className="h-18 bg-white border-t border-gray-100  fixed bottom-0 left-0 right-0 z-[101] shadow-[0_-4px_10px_rgba(0,0,0,0.03)]"
      >
        <div className="flex items-center justify-center gap-2  h-full max-w-md mx-auto px-2 ">
          {getNavItems().map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              className={() => `
                relative flex flex-col items-center justify-center
                transition-all duration-200 py-2 min-w-[55px]
              `}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="activeNavBackground"
                      className="absolute inset-0 bg-green-500 rounded-xl "
                      transition={{ type: 'spring', duration: 0.8 }}
                    />
                  )}
                  <motion.div
                    whileTap={{ scale: 0.9 }}
                    className={`flex items-center justify-center z-50 ${
                      isActive ? 'text-white' : 'text-gray-500'
                    }`}
                  >
                    {item.icon}
                  </motion.div>
                  <motion.span
                    className={`text-[8px] font-bold  z-50 mt-1 ${
                      isActive ? ' text-white' : 'text-gray-500'
                    }`}
                    animate={{ scale: isActive ? 1.05 : 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {item.label}
                  </motion.span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </motion.nav>
    </div>
  );
};

export default DashboardLayout;
