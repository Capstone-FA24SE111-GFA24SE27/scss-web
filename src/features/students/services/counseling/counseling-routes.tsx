import { counselorRoutes } from '@/shared/pages';
import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
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