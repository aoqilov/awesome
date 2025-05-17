import DashboardLayout from '@/layout/Dashboard.layout';
import MainMiddleware from '@/middleware/MainMiddleware';
import HomePage from '@/pages/HomePage';

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
            element: <HomePage />
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
            <h1> Bu yerga register page ni import qilasiz </h1>
          </PageTransition>
        )
      }
    ]
  }
];
