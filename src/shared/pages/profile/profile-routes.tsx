import { RouteObject } from 'react-router-dom';
import { lazy } from 'react';
const Profile = lazy(() => import('./Profile'))


export const profileRoutes: RouteObject[] = [
  {
    path: 'profile',
    element: <Profile />,
  },
];