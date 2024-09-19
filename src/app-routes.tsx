import { Navigate, RouteObject } from "react-router-dom"
import { Error404Page } from "./shared/pages"
export const appRoutes: RouteObject[] = [
    {
        path: '404',
        element: <Error404Page />
    },
    {
        path: '*',
        element: <Navigate to="404" />
    }
]