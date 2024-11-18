import { Navigate, RouteObject } from "react-router-dom"
import { Error404, Error500, StudentView } from "@shared/pages"
export const specialRoutes: RouteObject[] = [
    {
        path: '404',
        element: <Error404 />
    },
    {
        path: '500',
        element: <Error500 />
    },
    {
        path: '*',
        element: <Navigate to="404" />
    },
    {
        path: 'student-view/:id',
        element: <StudentView />
    }
]