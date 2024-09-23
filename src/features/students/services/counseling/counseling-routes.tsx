import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { counselorRoutes } from './counselor';
const Counseling = lazy(() => import('./Counseling'))
export const counselingRoutes: RouteObject[] = [
    {
        path: 'counseling',
        element: <Counseling />,
        children: [
            ...counselorRoutes
        ]
    },
];