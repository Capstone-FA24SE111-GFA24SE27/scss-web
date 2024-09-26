import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { requestsRoutes } from './requests'
import { appointmentsRoutes } from './appointments'
import Requests from './requests/Requests';
export const counselingRoutes: RouteObject[] = [
    {
        path: 'counseling',
        // element: <Requests />,
        children: [
            ...requestsRoutes,
            ...appointmentsRoutes
        ]
    },
];