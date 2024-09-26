import { RouteObject } from 'react-router-dom';
import { lazy } from 'react';

const Events = lazy(() => import('./Events'))

export const eventsRoutes: RouteObject[] = [
  {
    path: 'events',
    element: <Events />,
  },
];