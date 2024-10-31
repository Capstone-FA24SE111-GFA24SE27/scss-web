import { RouteObject } from 'react-router-dom';
import { CounselorsRoutes } from './counselor/counselor-routes';

export const adminAccountsRoutes: RouteObject[] = [
  {
    path: 'accounts',
    children: [
        ...CounselorsRoutes
    ],
  },

];