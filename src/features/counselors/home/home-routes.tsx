import { RouteObject } from 'react-router-dom'
import { lazy } from "react";
import Dashboard from './Dashboard';
const Home = lazy(() => import("./Home"));

export const homeRoutes: RouteObject[] = [
  {
    path: 'home',
    element: <Home />,
  },
  {
    path: 'dashboard',
    element: <Dashboard />,
  },

];
