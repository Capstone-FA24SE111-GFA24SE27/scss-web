import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { counselorsTableRoutes } from './table';
import { counselorRoutes } from './counselor';
const Counselors = lazy(() => import('./table/Counselors'))

export const counselorsRoutes: RouteObject[] = [
  {
    path: 'counselors',
    children: [
      {
        index: true,
        element: <Counselors />
      },
      ...counselorRoutes,
    ]

  },
];