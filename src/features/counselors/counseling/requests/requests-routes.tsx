import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
const Requests = lazy(() => import('./Requests'))
export const requestsRoutes: RouteObject[] = [
  {
    path: 'requests',
    element: <Requests />
  },
];