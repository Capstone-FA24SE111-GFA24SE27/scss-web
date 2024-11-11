import { RouteObject } from 'react-router-dom';
import { CounselorsRoutes } from './counselor/counselor-routes';
import { adminStudentsRoutes } from './student/student-routes';

export const adminAccountsRoutes: RouteObject[] = [
  {
    path: 'accounts',
    children: [
        ...CounselorsRoutes,
        ...adminStudentsRoutes
    ],
  },

];