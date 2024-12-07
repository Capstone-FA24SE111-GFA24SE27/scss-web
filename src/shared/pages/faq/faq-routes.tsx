import { Navigate, RouteObject } from 'react-router-dom';
import { lazy } from 'react';
const Faq = lazy(() => import('./Faq'))

export const faqRoutes: RouteObject[] = [
  {
    path: 'faq',
    element: <Faq />
  },
];