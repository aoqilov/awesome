import DashboardLayout from '@/layout/Dashboard.layout';
import MainMiddleware from '@/middleware/MainMiddleware';
import Orders from '@/pages/ManagerPages/Orders/Orders';
import StadionDetail from '@/pages/ManagerPages/Stadion/Detail/StadionDetail';
import StadiumList from '@/pages/ManagerPages/Stadion/StadionMain';

import RegisterPage from '@/pages/Register/Register';
import MainPage from '@/pages/Routes/MainPage';

import { PageTransition } from '@/shared/Motion';

export const router = [
  {
    path: '/',
    element: <MainMiddleware />,
    children: [
      // TODO: Asosiy Router shu yerda yoziladi
      {
        path: 'dashboard',
        element: <DashboardLayout />,
        children: [
          {
            path: 'home',
            element: <MainPage />
          },
          {
            path: 'stadium',
            element: <StadiumList />
          },
          {
            path: 'stadium/:id',
            element: <StadionDetail />
          },
          { path: 'orders', element: <Orders /> },
          {
            path: '*',
            element: '404'
          }
        ].map((route) => ({
          ...route,
          element: <PageTransition>{route.element}</PageTransition>
        }))
      },
      {
        path: 'register',
        element: (
          <PageTransition>
            <RegisterPage />
          </PageTransition>
        )
      }
    ]
  }
];
