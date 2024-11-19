import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { specialRoutes } from '@shared/configs';
import { problemTagsRoutes } from './resouces/problem-tag/problem-tag-routes';
import { resourcesRoutes } from './resouces';
import { profileRoutes, settingsRoutes } from '@/shared/pages';
import { adminProfilesRoutes } from './profiles/admin-profiles-routes';
import { adminAccountsRoutes } from './accounts/admin-accounts-routes';

const AdminLayout = lazy(() => import('./admin-layout'))

export const adminRoutes: RouteObject[] = [
  {
    path: '/',
    element: <AdminLayout />,
    children: [
        ...specialRoutes,
        ...resourcesRoutes,
        ...adminAccountsRoutes,
        ...adminProfilesRoutes,
        ...profileRoutes,
        ...settingsRoutes
    ],
  },

];