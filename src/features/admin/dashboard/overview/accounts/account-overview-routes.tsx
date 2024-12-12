import { lazy } from 'react';
import { Navigate, Outlet, RouteObject } from 'react-router-dom';
const AccountOverview = lazy(() => import('./AccountsOverview'));
export const accountOverviewRoutes: RouteObject[] = [
	{
		path: 'overview',
		element: <AccountOverview />,
	},
];
