import { Navigate, RouteObject } from 'react-router-dom';
import { lazy } from 'react';
const PublicQna = lazy(() => import('./PublicQna'))

export const publicQnaRoutes: RouteObject[] = [
  {
    path: 'public-qna',
    element: <PublicQna />
  },
];