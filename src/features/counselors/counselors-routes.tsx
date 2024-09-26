import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { specialRoutes } from '@shared/configs';
import { counselingRoutes } from './counseling';

const CounselorLayout = lazy(() => import('./counselor-layout'))

export const counselorsRoutes: RouteObject[] = [
  {
    path: '/',
    element: <CounselorLayout />,
    children: [
      ...counselingRoutes,
      ...specialRoutes
    ],
  },

];