import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
const Settings = lazy(() => import('./Settings'))
export const settingsRoutes: RouteObject[] = [
  {
    path: 'settings',
    element: <Settings />
  },
];

