import { QueryParamProvider } from '@/hooks/useQueryParam';
import DashboardLayout from '@/layout/Dashboard.layout';
import MainMiddleware from '@/middleware/MainMiddleware';
import AddField from '@/pages/ManagerPages/AddField/AddField';
import AddStadionPage from '@/pages/ManagerPages/AddStadion/Stadion';
import Orders from '@/pages/ManagerPages/Orders/Orders';
import Schedule from '@/pages/ManagerPages/Schedule/Schedule';
import StadionDetail from '@/pages/ManagerPages/Stadion/Detail/StadionDetail';
import StadiumList from '@/pages/ManagerPages/Stadion/StadionMain';
import Profile from '@/pages/Profile/Profile';

import RegisterPage from '@/pages/Register/Register';

import MainPage from '@/pages/Routes/MainPage';

import { PageTransition } from '@/shared/Motion';

export const router = [
  {
    path: '/',

    element: (
      <QueryParamProvider>
        <MainMiddleware />
      </QueryParamProvider>
    ),
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
          { path: 'stadium/add-stadium', element: <AddStadionPage /> },
          {
            path: 'stadium/:id',
            element: <StadionDetail />
          },
          {
            path: 'stadium/:id/schedule/:fieldId',
            element: <Schedule />
          },
          { path: 'stadium/:id/add-field', element: <AddField /> },
          { path: 'orders', element: <Orders /> },
          { path: 'profile', element: <Profile /> },
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
