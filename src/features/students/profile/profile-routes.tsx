import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
const Profile = lazy(() => import('./StudentProfile'))
export const profileRoutes: RouteObject[] = [
  {
    path: 'profile',
    element: <Profile />
  },
];

