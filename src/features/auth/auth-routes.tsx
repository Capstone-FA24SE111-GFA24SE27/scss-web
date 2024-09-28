import { Navigate, RouteObject } from 'react-router-dom';
import { SignIn } from './auth-pages';
import { lazy } from 'react';

const AuthLayout = lazy(() => import('./auth-layout'))

export const authRoutes: RouteObject[] = [
  {
    path: '/',
    element: <AuthLayout />,
    children: [
      {
        path: '',
        element: <SignIn />
      }
    ],
  },
  {
    path: '*',
    element: <Navigate to={'/'} />
  }
];