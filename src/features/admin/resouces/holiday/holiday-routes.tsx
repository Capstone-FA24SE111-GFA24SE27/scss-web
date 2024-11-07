import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { specialRoutes } from '@shared/configs';

const Holiday = lazy(() => import('./Holiday'))

export const holidaysRoutes: RouteObject[] = [
  {
    path: 'holidays',
    element: <Holiday />,
    children: [

    ],
  },

];