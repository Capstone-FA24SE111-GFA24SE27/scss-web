const role: string = 'student'
import { studentRoutes } from '@features/students';
import { roles } from './shared/constants';
import { authRoutes } from '@features/auth';

let roleBasedRoutes;
switch (role) {
    case roles.STUDENT:
        roleBasedRoutes = studentRoutes;
        break;
    default:
        roleBasedRoutes = authRoutes;
}

export const appRoles = roleBasedRoutes
