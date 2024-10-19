import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

const Counselor = lazy(() => import('./Counselor'))
export const counselorRoutes: RouteObject[] = [
  {
    path: 'counselor/:id',
    element: <Counselor />,
  }
];