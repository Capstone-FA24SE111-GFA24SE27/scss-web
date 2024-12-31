import { Navigate, RouteObject } from 'react-router-dom';
import { lazy } from 'react';
const CounselorPublicQna = lazy(() => import('./CounselorPublicQna'))
export const counselorPublicQnaRoutes: RouteObject[] = [
  {
    path: 'public-qna',
    element: <CounselorPublicQna />,
  },
];