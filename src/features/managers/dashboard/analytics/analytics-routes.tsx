import { lazy } from 'react';
import { Navigate, Outlet, RouteObject } from 'react-router-dom';
const Analytics = lazy(() => import('./Analytics'));
export const analyticsRoutes: RouteObject[] = [
	{
		path: 'analytics',
		element: <Analytics />,
	},
];
