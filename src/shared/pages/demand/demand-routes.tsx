import { RouteObject } from 'react-router-dom';
import { lazy } from 'react';
const DemandDetail = lazy(() => import('./DemandDetail'));



export const demandRoutes: RouteObject[] = [
  {
    path: 'demand/:id',
    element: <DemandDetail />,
  },
];