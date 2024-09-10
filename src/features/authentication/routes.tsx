import { RouteObject } from 'react-router-dom';
import { Login } from './pages';

const authenticationRoutes: RouteObject[] = [
  {
    path: '/login',
    element: <Login />,
  },
];