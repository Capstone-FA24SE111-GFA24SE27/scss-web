import { RouteObject } from 'react-router-dom';
import { adminCounselorsRoutes } from './counselor/counselor-routes';
import { adminStudentsRoutes } from './student/student-routes';

export const adminProfilesRoutes: RouteObject[] = [
  {
    path: 'profiles',
    children: [
        ...adminCounselorsRoutes,
        ...adminStudentsRoutes
    ],
  },

];