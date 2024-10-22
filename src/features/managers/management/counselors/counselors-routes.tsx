import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { counselorRoutes } from './counselor';

const Counselors = lazy(() => import('./Counselors'))
const Counselor = lazy(() => import('./counselor/Counselor'))
export const counselorsRoutes: RouteObject[] = [
  {
    path: 'counselors',
    element: <Counselors />,
  },
  ...counselorRoutes
];