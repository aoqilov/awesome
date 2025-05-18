import DashboardLayout from '@/layout/Dashboard.layout';
import MainMiddleware from '@/middleware/MainMiddleware';

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
