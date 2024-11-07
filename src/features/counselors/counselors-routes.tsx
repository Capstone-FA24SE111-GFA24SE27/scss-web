import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { specialRoutes } from '@shared/configs';
import { counselingRoutes } from './counseling';
import { qnaRoutes } from './qna';
import { counselorStudentsRoutes } from './students';
import { homeRoutes } from './home';

const CounselorsLayout = lazy(() => import('./counselors-layout'))

export const counselorsRoutes: RouteObject[] = [
  {
    path: '/',
    element: <CounselorsLayout />,
    children: [
      ...homeRoutes,
      ...counselingRoutes,
      ...qnaRoutes,
      ...counselorStudentsRoutes,
      ...specialRoutes
    ],
  },

];