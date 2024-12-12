import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { adminCreateAccountRoutes } from './create';
import AccountDetailAdminView from './view/AccountDetailAdminView';

const Accounts = lazy(() => import('./Accounts'));

export const adminAccountsRoutes: RouteObject[] = [
	{
		path: 'accounts',
		children: [
			{
				path: 'table',
				element: <Accounts />,
			},
			{
				path:':id/:role',
				element: <AccountDetailAdminView />
			},
			...adminCreateAccountRoutes,
		],
	},
];
